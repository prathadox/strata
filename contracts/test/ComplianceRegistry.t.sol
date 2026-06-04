// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {ComplianceRegistry} from "../src/compliance/ComplianceRegistry.sol";
import {IComplianceRegistry} from "../src/interfaces/IComplianceRegistry.sol";

contract ComplianceRegistryTest is Test {
    ComplianceRegistry reg;

    address owner = address(0xA11CE);
    uint256 verifierPk = uint256(0xB0B);
    address verifier;
    address alice = address(0xA11);
    address bob = address(0xB0B0);

    bytes32 constant CLAIM_TYPEHASH = keccak256(
        "ClaimData(address user,uint8 trancheMask,uint64 expiresAt,string policyId,string zkReceiptCid,bytes32 nonce,uint64 signedAt)"
    );

    function setUp() public {
        verifier = vm.addr(verifierPk);
        vm.warp(1_700_000_000); // non-zero base time
        vm.prank(owner);
        reg = new ComplianceRegistry(owner, verifier);
    }

    // ── EIP-712 signing helpers ──────────────────────────────────────────
    function _domainSeparator() internal view returns (bytes32) {
        return keccak256(abi.encode(
            keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
            keccak256(bytes("StrataCompliance")),
            keccak256(bytes("1")),
            block.chainid,
            address(reg)
        ));
    }

    function _sign(uint256 pk, IComplianceRegistry.ClaimData memory d) internal view returns (bytes memory) {
        bytes32 structHash = keccak256(abi.encode(
            CLAIM_TYPEHASH, d.user, d.trancheMask, d.expiresAt,
            keccak256(bytes(d.policyId)), keccak256(bytes(d.zkReceiptCid)), d.nonce, d.signedAt
        ));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", _domainSeparator(), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(pk, digest);
        return abi.encodePacked(r, s, v);
    }

    function _claim(address user, uint8 mask, uint64 expiresAt, bytes32 nonce)
        internal view returns (IComplianceRegistry.ClaimData memory)
    {
        return IComplianceRegistry.ClaimData({
            user: user, trancheMask: mask, expiresAt: expiresAt,
            policyId: "EU-MiCA-AllTranches-v1", zkReceiptCid: "QmReceipt",
            nonce: nonce, signedAt: uint64(block.timestamp)
        });
    }

    // ── tests ────────────────────────────────────────────────────────────
    function test_claim_mintsSoulboundAndAllowsAllTranches() public {
        IComplianceRegistry.ClaimData memory d = _claim(alice, 0x07, 0, bytes32(uint256(1)));
        reg.claimReceipt(d, _sign(verifierPk, d));
        assertEq(reg.balanceOf(alice), 1);
        assertEq(reg.receiptOf(alice), 1);
        assertTrue(reg.isAllowed(alice, 0)); // senior
        assertTrue(reg.isAllowed(alice, 1)); // mezz
        assertTrue(reg.isAllowed(alice, 2)); // junior
    }

    function test_isAllowed_respectsMask_seniorOnly() public {
        // mask 0x04 = bit2 = Senior only
        IComplianceRegistry.ClaimData memory d = _claim(alice, 0x04, 0, bytes32(uint256(2)));
        reg.claimReceipt(d, _sign(verifierPk, d));
        assertTrue(reg.isAllowed(alice, 0));  // senior allowed
        assertFalse(reg.isAllowed(alice, 1)); // mezz blocked
        assertFalse(reg.isAllowed(alice, 2)); // junior blocked
    }

    function test_isAllowed_juniorOnly_permissionlessTier() public {
        // mask 0x01 = bit0 = Junior only (the "permissionless wallet" tier)
        IComplianceRegistry.ClaimData memory d = _claim(alice, 0x01, 0, bytes32(uint256(3)));
        reg.claimReceipt(d, _sign(verifierPk, d));
        assertFalse(reg.isAllowed(alice, 0));
        assertFalse(reg.isAllowed(alice, 1));
        assertTrue(reg.isAllowed(alice, 2));
    }

    function test_claim_rejectsBadSigner() public {
        IComplianceRegistry.ClaimData memory d = _claim(alice, 0x07, 0, bytes32(uint256(4)));
        vm.expectRevert(ComplianceRegistry.NotVerifier.selector);
        reg.claimReceipt(d, _sign(uint256(0xBAD), d)); // wrong key
    }

    function test_claim_rejectsReplayedNonce() public {
        bytes32 nonce = bytes32(uint256(5));
        IComplianceRegistry.ClaimData memory d1 = _claim(alice, 0x07, 0, nonce);
        reg.claimReceipt(d1, _sign(verifierPk, d1));
        // different user, same nonce -> NonceUsed
        IComplianceRegistry.ClaimData memory d2 = _claim(bob, 0x07, 0, nonce);
        vm.expectRevert(ComplianceRegistry.NonceUsed.selector);
        reg.claimReceipt(d2, _sign(verifierPk, d2));
    }

    function test_claim_rejectsStaleSignature() public {
        IComplianceRegistry.ClaimData memory d = _claim(alice, 0x07, 0, bytes32(uint256(6)));
        bytes memory sig = _sign(verifierPk, d);
        vm.warp(block.timestamp + 2 hours); // beyond 1h window
        vm.expectRevert(ComplianceRegistry.SigExpired.selector);
        reg.claimReceipt(d, sig);
    }

    function test_claim_rejectsInvalidMask() public {
        IComplianceRegistry.ClaimData memory d = _claim(alice, 0x08, 0, bytes32(uint256(7))); // high bit set
        vm.expectRevert(ComplianceRegistry.InvalidMask.selector);
        reg.claimReceipt(d, _sign(verifierPk, d));
    }

    function test_soulbound_transferReverts() public {
        IComplianceRegistry.ClaimData memory d = _claim(alice, 0x07, 0, bytes32(uint256(8)));
        reg.claimReceipt(d, _sign(verifierPk, d));
        vm.prank(alice);
        vm.expectRevert(ComplianceRegistry.Soulbound.selector);
        reg.transferFrom(alice, bob, 1);
    }

    function test_expiry_disablesAccess() public {
        uint64 exp = uint64(block.timestamp + 1 days);
        IComplianceRegistry.ClaimData memory d = _claim(alice, 0x07, exp, bytes32(uint256(9)));
        reg.claimReceipt(d, _sign(verifierPk, d));
        assertTrue(reg.isAllowed(alice, 0));
        vm.warp(block.timestamp + 2 days);
        assertFalse(reg.isAllowed(alice, 0));
    }

    function test_revoke_disablesAccess_andEmits() public {
        IComplianceRegistry.ClaimData memory d = _claim(alice, 0x07, 0, bytes32(uint256(10)));
        reg.claimReceipt(d, _sign(verifierPk, d));
        vm.expectEmit(true, true, false, false);
        emit ComplianceRegistry.ReceiptRevoked(1, owner);
        vm.prank(owner);
        reg.revokeReceipt(1);
        assertFalse(reg.isAllowed(alice, 0));
    }

    function test_oneActiveReceipt_thenRenewAfterRevoke() public {
        IComplianceRegistry.ClaimData memory d1 = _claim(alice, 0x07, 0, bytes32(uint256(11)));
        reg.claimReceipt(d1, _sign(verifierPk, d1));
        // second active claim blocked
        IComplianceRegistry.ClaimData memory d2 = _claim(alice, 0x07, 0, bytes32(uint256(12)));
        vm.expectRevert(ComplianceRegistry.AlreadyHasReceipt.selector);
        reg.claimReceipt(d2, _sign(verifierPk, d2));
        // revoke, then renewal works
        vm.prank(owner);
        reg.revokeReceipt(1);
        IComplianceRegistry.ClaimData memory d3 = _claim(alice, 0x07, 0, bytes32(uint256(13)));
        reg.claimReceipt(d3, _sign(verifierPk, d3));
        assertEq(reg.receiptOf(alice), 2);
        assertTrue(reg.isAllowed(alice, 0));
    }

    function test_publishPolicy_ownerOnly() public {
        vm.prank(owner);
        reg.publishPolicy("US-Permissioned-Senior-v1", "QmPolicyCid");
        assertEq(reg.policies("US-Permissioned-Senior-v1"), "QmPolicyCid");
        vm.prank(address(0xBAD));
        vm.expectRevert(ComplianceRegistry.NotOwner.selector);
        reg.publishPolicy("x", "y");
    }

    function test_setVerifier_onlyOwner_rotates() public {
        vm.prank(owner);
        reg.setVerifier(address(0xCAFE));
        assertEq(reg.verifier(), address(0xCAFE));
        vm.prank(address(0xBAD));
        vm.expectRevert(ComplianceRegistry.NotOwner.selector);
        reg.setVerifier(address(0x1));
    }

    function test_tokenURI_pointsToReceiptCid() public {
        IComplianceRegistry.ClaimData memory d = _claim(alice, 0x07, 0, bytes32(uint256(14)));
        reg.claimReceipt(d, _sign(verifierPk, d));
        assertEq(reg.tokenURI(1), "ipfs://QmReceipt");
    }
}
