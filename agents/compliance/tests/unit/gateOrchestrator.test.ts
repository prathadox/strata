import { describe, it, expect, vi } from 'vitest';
import { privateKeyToAccount } from 'viem/accounts';
import type { Hex } from 'viem';
import { GateOrchestrator, type GateOrchestratorDeps } from '../../src/pipeline/gateOrchestrator.js';
import { signDepositorAuth } from '../../src/signing/eip712.js';
import type { CredentialProof } from '../../src/adapters/credential.js';
import type { CredentialResult, SanctionsScreenResult, JurisdictionPolicy, ComplianceReceipt } from '../../src/types.js';

const TEST_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as Hex;
const account = privateKeyToAccount(TEST_KEY);
const WALLET = account.address as `0x${string}`;

const NOW_SEC = 1_700_000_000;
const DEADLINE = NOW_SEC + 3600;

const CREDENTIAL_EVIDENCE_HASH = ('0x' + 'ab'.repeat(32)) as Hex;
const SANCTIONS_RESULT_HASH = ('0x' + 'bb'.repeat(32)) as Hex;
const METHODOLOGY_HASH = ('0x' + 'dd'.repeat(32)) as Hex;

const credentialProof: CredentialProof = {
  issuer: '0x1111111111111111111111111111111111111111',
  wallet: WALLET,
  kycTier: 'basic',
  jurisdictionCode: 'US',
  issuedAtSec: NOW_SEC - 3600,
  expiresAtSec: NOW_SEC + 86400 * 365,
  signature: '0xdeadbeef' as `0x${string}`
};

const validCredential: CredentialResult = {
  valid: true,
  kycTier: 'basic',
  jurisdictionCode: 'US',
  credentialEvidenceHash: CREDENTIAL_EVIDENCE_HASH,
  issuer: '0x1111111111111111111111111111111111111111',
  provider: 'zkpass'
};

const clearSanctionsScreen: SanctionsScreenResult = {
  wallet: WALLET,
  clear: true,
  screenedAtSec: NOW_SEC - 60,
  resultHash: SANCTIONS_RESULT_HASH,
  provider: 'chainalysis'
};

const usPolicy: JurisdictionPolicy = {
  version: '1.0',
  policyTokenId: '1',
  jurisdictionCode: 'US',
  effectiveFromSec: 1_699_000_000,
  effectiveUntilSec: null,
  permittedTranchesByKycTier: { none: 4, basic: 3, enhanced: 7 },
  sourceTextHash: ('0x' + 'ee'.repeat(32)) as Hex,
  sourceTextCid: null,
  aiInterpretationCid: null,
  aiInterpretationHash: null,
  aiModel: null,
  aiPromptHash: null,
  policyHash: ('0x' + 'cc'.repeat(32)) as Hex,
  publisher: {
    multisigAddress: '0x0000000000000000000000000000000000000000',
    identityNFT: 'ipfs://placeholder'
  },
  publishedAtSec: 1_699_000_000,
  signatures: []
};

function makePinEvidence(): (data: string, apiKey: string) => Promise<string> {
  let counter = 0;
  return vi.fn(async () => `QmTestCid${++counter}`);
}

function makeMockPublisher() {
  return {
    publishReceipt: vi.fn(async (draft: any) => ({
      receiptCid: 'QmTestReceipt',
      receipt: { ...draft, signature: '0x' + 'ff'.repeat(65) } as ComplianceReceipt,
      txHash: undefined as `0x${string}` | undefined
    }))
  };
}

async function signAuth(): Promise<`0x${string}`> {
  return signDepositorAuth({
    account,
    wallet: WALLET,
    credentialEvidenceHash: CREDENTIAL_EVIDENCE_HASH,
    deadline: BigInt(DEADLINE)
  });
}

function makeDeps(overrides?: Partial<GateOrchestratorDeps>): GateOrchestratorDeps {
  return {
    credentialAdapter: {
      provider: 'zkpass',
      verify: vi.fn(async () => validCredential)
    },
    sanctionsOracle: {
      provider: 'chainalysis',
      screen: vi.fn(async () => clearSanctionsScreen)
    },
    policyResolver: {
      resolve: vi.fn(async () => usPolicy)
    },
    publisher: makeMockPublisher(),
    pinEvidence: makePinEvidence(),
    lighthouseApiKey: 'test-api-key',
    publisherAddress: '0x3333333333333333333333333333333333333333',
    identityNFT: 'strata-identity-42',
    methodologyHash: METHODOLOGY_HASH,
    codeCommit: 'abc1234',
    nowSec: () => NOW_SEC,
    ...overrides
  };
}

describe('GateOrchestrator', () => {
  it('happy path: valid credential + clear sanctions + US policy returns approved', async () => {
    const deps = makeDeps();
    const orchestrator = new GateOrchestrator(deps);
    const sig = await signAuth();

    const result = await orchestrator.runGateCycle(WALLET, credentialProof, sig, DEADLINE);

    expect(result.status).toBe('approved');
    if (result.status !== 'approved') throw new Error('unreachable');

    expect(result.receiptCid).toBe('QmTestReceipt');
    expect(result.evidenceCid).toBe('QmTestCid1');
    expect(result.receipt).toBeDefined();
    expect(result.receipt.wallet).toBe(WALLET);
    expect(result.receipt.kycTier).toBe('basic');
    expect(result.receipt.permittedTranchesMask).toBe(3);
    expect(result.receipt.sanctionsClear).toBe(true);

    expect(deps.credentialAdapter.verify).toHaveBeenCalledOnce();
    expect(deps.sanctionsOracle.screen).toHaveBeenCalledWith(WALLET);
    expect(deps.policyResolver.resolve).toHaveBeenCalledWith('US');
    expect(deps.publisher.publishReceipt).toHaveBeenCalledOnce();
    expect(deps.pinEvidence).toHaveBeenCalledTimes(2);
  });

  it('sanctioned wallet returns denied with sanctions-hit', async () => {
    const sanctionedScreen: SanctionsScreenResult = {
      ...clearSanctionsScreen,
      clear: false
    };
    const deps = makeDeps({
      sanctionsOracle: {
        provider: 'chainalysis',
        screen: vi.fn(async () => sanctionedScreen)
      }
    });
    const orchestrator = new GateOrchestrator(deps);
    const sig = await signAuth();

    const result = await orchestrator.runGateCycle(WALLET, credentialProof, sig, DEADLINE);

    expect(result.status).toBe('denied');
    if (result.status !== 'denied') throw new Error('unreachable');
    expect(result.reason).toBe('sanctions-hit');
    expect(deps.publisher.publishReceipt).not.toHaveBeenCalled();
  });

  it('invalid credential returns denied with credential-invalid', async () => {
    const invalidCredential: CredentialResult = { ...validCredential, valid: false };
    const deps = makeDeps({
      credentialAdapter: {
        provider: 'zkpass',
        verify: vi.fn(async () => invalidCredential)
      }
    });
    const orchestrator = new GateOrchestrator(deps);
    const sig = await signAuth();

    const result = await orchestrator.runGateCycle(WALLET, credentialProof, sig, DEADLINE);

    expect(result.status).toBe('denied');
    if (result.status !== 'denied') throw new Error('unreachable');
    expect(result.reason).toBe('credential-invalid');
    expect(deps.sanctionsOracle.screen).not.toHaveBeenCalled();
  });

  it('existing valid receipt short-circuits without calling credential adapter', async () => {
    const deps = makeDeps({
      readActiveReceipt: vi.fn(async () => ({
        receiptId: 42n,
        mask: 7,
        kycExp: BigInt(NOW_SEC + 86400),
        sanctionsExp: BigInt(NOW_SEC + 43200)
      }))
    });
    const orchestrator = new GateOrchestrator(deps);

    const result = await orchestrator.runGateCycle(
      WALLET, credentialProof, '0xdead' as `0x${string}`, DEADLINE
    );

    expect(result.status).toBe('existing');
    if (result.status !== 'existing') throw new Error('unreachable');
    expect(result.receipt.receiptId).toBe('42');
    expect(result.receipt.mask).toBe(7);
    expect(result.receipt.kycExp).toBe(NOW_SEC + 86400);
    expect(result.receipt.sanctionsExp).toBe(NOW_SEC + 43200);

    expect(deps.credentialAdapter.verify).not.toHaveBeenCalled();
    expect(deps.sanctionsOracle.screen).not.toHaveBeenCalled();
    expect(deps.publisher.publishReceipt).not.toHaveBeenCalled();
  });

  it('missing policy returns denied with policy-missing', async () => {
    const deps = makeDeps({
      policyResolver: {
        resolve: vi.fn(async () => null)
      }
    });
    const orchestrator = new GateOrchestrator(deps);
    const sig = await signAuth();

    const result = await orchestrator.runGateCycle(WALLET, credentialProof, sig, DEADLINE);

    expect(result.status).toBe('denied');
    if (result.status !== 'denied') throw new Error('unreachable');
    expect(result.reason).toBe('policy-missing');
    expect(deps.publisher.publishReceipt).not.toHaveBeenCalled();
  });
});
