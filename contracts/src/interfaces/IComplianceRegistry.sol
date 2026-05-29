// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IComplianceGate} from "./IComplianceGate.sol";

/// @dev Full compliance surface: a verifier-signed, soulbound receipt gate plus reusable
///      jurisdiction-policy records. Extends IComplianceGate so it swaps into vaults directly.
interface IComplianceRegistry is IComplianceGate {
    struct ClaimData {
        address user;
        uint8   trancheMask;   // bit0=Junior, bit1=Mezz, bit2=Senior
        uint64  expiresAt;     // 0 = no expiry
        string  policyId;
        string  zkReceiptCid;
        bytes32 nonce;
        uint64  signedAt;
    }

    function claimReceipt(ClaimData calldata data, bytes calldata sig) external;
    function revokeReceipt(uint256 tokenId) external;
    function publishPolicy(string calldata policyId, string calldata cid) external;
    function setVerifier(address newVerifier) external;
}
