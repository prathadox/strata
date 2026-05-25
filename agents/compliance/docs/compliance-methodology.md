# Compliance Gate Methodology, v1

This file's sha256 is included as `methodologyHash` on every published ComplianceReceipt.

## Inputs

Per gate cycle:
- `wallet`: the depositor's 0x-prefixed Ethereum address.
- `credentialProof`: an EIP-712 signed credential from a recognized issuer, binding `wallet`, `kycTier`, `jurisdictionCode`, `issuedAtSec`, `expiresAtSec`.
- `depositorAuthSignature`: the depositor's EIP-712 signature over `DepositorAuth(wallet, credentialEvidenceHash, deadline)`.
- `deadline`: unix timestamp (seconds) after which the auth is invalid.

## Step 1: Check existing receipt

If an on-chain `ComplianceRegistry.activeReceipt(wallet)` returns a receipt with both `kycExpiresAtSec > now` and `sanctionsScreenExpiresAtSec > now`, return `existing` immediately. No new receipt is minted.

## Step 2: Credential verification

1. Assert `credentialProof.wallet` matches the request `wallet` (case-insensitive).
2. Assert `credentialProof.expiresAtSec > now`.
3. Reconstruct the EIP-712 typed-data hash from the credential fields.
4. Verify the signature recovers to `credentialProof.issuer`.
5. Assert `credentialProof.issuer` is the expected issuer address for the adapter (v1: Hardhat account #0).

Any failure returns `denied` with reason `credential-invalid`.

## Step 3: DepositorAuth verification

1. Recover the EIP-712 signer from `depositorAuthSignature` over domain `StrataCompliance/1/5000` and type `DepositorAuth(address wallet, bytes32 credentialEvidenceHash, uint256 deadline)`.
2. Assert the recovered address equals `wallet`.
3. Assert `deadline >= now`.

Failure returns `denied` with reason `credential-invalid`.

## Step 4: Sanctions screening

1. Call `sanctionsOracle.screen(wallet)`.
2. The oracle returns `{ clear, screenedAtSec, resultHash, provider }`.
3. If the oracle throws, return `denied` with reason `internal-error` (fail-closed).
4. If `clear === false`, return `denied` with reason `sanctions-hit`.

The screen result has a 24-hour TTL (`SANCTIONS_TTL_SECONDS = 86400`).

## Step 5: Policy resolution

1. Call `policyResolver.resolve(credential.jurisdictionCode)`.
2. v1 stub: look up in the in-memory `STUB_POLICIES` map. v1 supports four jurisdictions: `US`, `EU`, `GB`, `permissionless`.
3. Live resolver: read `JurisdictionPolicyNFT.activePolicyFor(keccak256(jurisdictionCode))` to get the token ID. If `tokenId === 0`, no active policy exists. Check `PolicyRevocationRegistry.isPolicyRevoked(tokenId)`. If revoked, return null. Fetch the policy JSON from IPFS via the token URI.
4. If no policy is found, return `denied` with reason `policy-missing`.

## Step 6: Tranche routing

Deterministic table lookup. Given `policy.permittedTranchesByKycTier[kycTier]`, read the tranche bitmask:
- bit 0 = senior
- bit 1 = mezzanine
- bit 2 = junior

If `sanctionsClear === false`, mask is 0 (denied). If the resulting mask is 0, return `denied` with reason `jurisdiction-denied`.

## Step 7: Evidence encryption

1. Generate a 32-byte random key via `crypto.randomBytes(32)`.
2. Serialize the evidence payload: `JSON.stringify({ credentialProof, sanctionsScreen, jurisdictionCode, kycTier })`.
3. Encrypt with AES-256-GCM (12-byte IV, 16-byte auth tag).
4. Wire format for IPFS: `[12-byte IV][16-byte tag][ciphertext]`, base64-encoded.
5. Pin the encrypted blob to Lighthouse. The returned CID is `evidenceBlobCid`.
6. Pin the sanctions screen metadata separately. The returned CID is `sanctionsScreenCid`.

The per-receipt key is not stored on-chain. It is returned to the caller or held by the compliance agent for auditor access.

## Step 8: Receipt composition

1. `receiptId = uint256(keccak256(abi.encodePacked(wallet, credentialEvidenceHash, policyTokenId, sanctionsScreenCid)))`.
2. `jurisdictionCodeHash = keccak256(abi.encodePacked(jurisdictionCode, salt))`. Default salt is 32 zero bytes. The salt allows the depositor to request a privacy-preserving hash without revealing their jurisdiction on-chain.
3. `kycExpiresAtSec = now + KYC_TTL_SECONDS[kycTier]`. TTLs: `none = 86400` (1 day), `basic = 15552000` (180 days), `enhanced = 31536000` (365 days).
4. `sanctionsScreenExpiresAtSec = now + SANCTIONS_TTL_SECONDS` (86400, 1 day).
5. Compose the full `ComplianceReceipt` object with version `1.0`, all fields above, `methodologyHash`, `codeCommit`, and `publishedAtSec = now`.

## Step 9: EIP-712 signing

1. Sign the receipt with the Compliance agent key using EIP-712 typed data.
2. Domain: `StrataCompliance/1/5000`.
3. Type: `ComplianceReceipt(uint256 receiptId, address wallet, uint256 policyTokenId, uint8 permittedTranchesMask, uint64 kycExpiresAtSec, uint64 sanctionsScreenExpiresAtSec, bytes32 policyHash, bytes32 credentialEvidenceHash, bytes32 methodologyHash)`.
4. The signature is appended to the receipt JSON.

## Step 10: Pin and mint

1. Pin the signed receipt JSON to Lighthouse. The returned CID is `receiptCid`.
2. If `dryRun === true`, return the receipt without on-chain mint.
3. If live, call `ComplianceRegistry.mintComplianceReceipt(depositorWallet, policyTokenId, permittedTranchesMask, kycExpiresAtSec, sanctionsScreenExpiresAtSec, tokenURI=receiptCid)`.
4. If the transaction reverts, throw `AbortError` (not retried beyond the retry config).

## Fail-closed principle

Every error path in the gate returns a denial or throws. No depositor is ever silently approved. If the sanctions oracle is unreachable, the result is `denied/internal-error`. If the credential signature does not verify, the result is `denied/credential-invalid`. If the policy is missing or revoked, the result is `denied/policy-missing` or `denied/policy-revoked`. There is no fallback that grants access.

## Receipt identifiers

```
receiptId = uint256(keccak256(abi.encodePacked(wallet, credentialEvidenceHash, policyTokenId, sanctionsScreenCid)))
jurisdictionCodeHash = keccak256(abi.encodePacked(jurisdictionCode, salt))
```

## Replayability

Given the source code at `codeCommit`, this methodology file whose sha256 matches `methodologyHash`, the credential proof, the sanctions screen result, and the policy state at `policyResolvedAtBlock`, anyone can re-run the gate and produce the same `receiptId`, `permittedTranchesMask`, `kycExpiresAtSec`, and `sanctionsScreenExpiresAtSec`. Two fields differ: `publishedAtSec` (wall clock) and `signature` (key-dependent). The inspect script pins `publishedAtSec` to `1700000000` and uses an ephemeral key, so its output file is reproducible.
