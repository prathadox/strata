// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {IComplianceRegistry} from "../interfaces/IComplianceRegistry.sol";

/// @notice Programmable-compliance gate. The Compliance Agent (ERC-8004 #105) signs an EIP-712
///         claim off-chain attesting which tranches a user is permitted; the user redeems it here
///         for a non-transferable (soulbound) Compliance Receipt NFT. Vaults gate deposits through
///         `isAllowed(user, tranche)`. The registry also records reusable Jurisdiction Policy
///         documents (policyId -> IPFS CID) other Mantle RWA protocols can subscribe to.
contract ComplianceRegistry is IComplianceRegistry, ERC721, EIP712 {
    error NotOwner();
    error NotVerifier();
    error NotAuthorized();
    error NonceUsed();
    error SigExpired();
    error InvalidMask();
    error AlreadyHasReceipt();
    error Soulbound();

    struct Receipt {
        uint64  issuedAt;
        uint64  expiresAt;     // 0 = no expiry
        uint8   trancheMask;   // bit0=Junior, bit1=Mezz, bit2=Senior
        string  policyId;
        string  zkReceiptCid;
        bool    revoked;
    }

    bytes32 private constant CLAIM_TYPEHASH = keccak256(
        "ClaimData(address user,uint8 trancheMask,uint64 expiresAt,string policyId,string zkReceiptCid,bytes32 nonce,uint64 signedAt)"
    );
    uint256 internal constant SIG_WINDOW = 1 hours;

    address public immutable owner;
    address public verifier; // Compliance Agent signing address
    uint256 public nextTokenId;

    mapping(uint256 => Receipt) public receipts;
    mapping(address => uint256) public receiptOf;  // user → tokenId (0 = none)
    mapping(bytes32 => bool)    public usedNonces;
    mapping(string => string)   public policies;   // policyId → IPFS doc CID

    event ComplianceVerified(address indexed user, uint256 indexed tokenId, string policyId, string zkReceiptCid);
    event PolicyUpdated(string indexed policyId, string cid);
    event ReceiptRevoked(uint256 indexed tokenId, address indexed by);
    event VerifierRotated(address indexed oldVerifier, address indexed newVerifier);

    constructor(address owner_, address verifier_)
        ERC721("Strata Compliance Receipt", "scRCPT")
        EIP712("StrataCompliance", "1")
    {
        owner = owner_;
        verifier = verifier_;
    }

    modifier onlyOwner() { if (msg.sender != owner) revert NotOwner(); _; }

    function setVerifier(address newVerifier) external onlyOwner {
        emit VerifierRotated(verifier, newVerifier);
        verifier = newVerifier;
    }

    function publishPolicy(string calldata policyId, string calldata cid) external onlyOwner {
        policies[policyId] = cid;
        emit PolicyUpdated(policyId, cid);
    }

    /// @notice Redeem a verifier-signed EIP-712 claim for a soulbound compliance receipt.
    function claimReceipt(ClaimData calldata data, bytes calldata sig) external {
        bytes32 structHash = keccak256(abi.encode(
            CLAIM_TYPEHASH,
            data.user,
            data.trancheMask,
            data.expiresAt,
            keccak256(bytes(data.policyId)),
            keccak256(bytes(data.zkReceiptCid)),
            data.nonce,
            data.signedAt
        ));
        if (ECDSA.recover(_hashTypedDataV4(structHash), sig) != verifier) revert NotVerifier();

        if (usedNonces[data.nonce]) revert NonceUsed();
        usedNonces[data.nonce] = true;

        if (data.signedAt > block.timestamp || block.timestamp - data.signedAt > SIG_WINDOW) revert SigExpired();
        if (data.trancheMask == 0 || data.trancheMask & 0xF8 != 0) revert InvalidMask();

        uint256 existing = receiptOf[data.user];
        if (existing != 0 && _isActive(receipts[existing])) revert AlreadyHasReceipt();

        uint256 tokenId = ++nextTokenId;
        receipts[tokenId] = Receipt({
            issuedAt: uint64(block.timestamp),
            expiresAt: data.expiresAt,
            trancheMask: data.trancheMask,
            policyId: data.policyId,
            zkReceiptCid: data.zkReceiptCid,
            revoked: false
        });
        receiptOf[data.user] = tokenId;
        _mint(data.user, tokenId);
        emit ComplianceVerified(data.user, tokenId, data.policyId, data.zkReceiptCid);
    }

    function revokeReceipt(uint256 tokenId) external {
        if (msg.sender != owner && msg.sender != verifier) revert NotAuthorized();
        receipts[tokenId].revoked = true;
        emit ReceiptRevoked(tokenId, msg.sender);
    }

    /// @dev tranche: 0=Senior, 1=Mezzanine, 2=Junior. Mask bit0=Junior, bit1=Mezz, bit2=Senior.
    function isAllowed(address user, uint8 tranche) external view returns (bool) {
        if (tranche > 2) return false;
        uint256 tid = receiptOf[user];
        if (tid == 0) return false;
        Receipt storage r = receipts[tid];
        if (!_isActive(r)) return false;
        uint8 bit = uint8(1 << (2 - tranche)); // Senior(0)->bit2, Mezz(1)->bit1, Junior(2)->bit0
        return r.trancheMask & bit != 0;
    }

    function _isActive(Receipt storage r) internal view returns (bool) {
        if (r.revoked) return false;
        if (r.expiresAt != 0 && r.expiresAt <= block.timestamp) return false;
        return true;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string.concat("ipfs://", receipts[tokenId].zkReceiptCid);
    }

    /// @dev Soulbound: block transfers, allow mint (from==0) and burn (to==0).
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) revert Soulbound();
        return super._update(to, tokenId, auth);
    }
}
