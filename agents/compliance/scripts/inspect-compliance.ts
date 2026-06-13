import { writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { privateKeyToAccount } from 'viem/accounts';
import { createStubCredentialAdapter, signStubCredential } from '../src/adapters/stubCredential.js';
import { createStubSanctionsOracle } from '../src/adapters/stubSanctions.js';
import { createStubPolicyResolver } from '../src/pipeline/policyResolver.js';
import { GateOrchestrator } from '../src/pipeline/gateOrchestrator.js';
import { signDepositorAuth } from '../src/signing/eip712.js';

const EPHEMERAL_KEY = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d' as const;
const PINNED_CLOCK_SEC = 1_700_000_000;

async function main(): Promise<void> {
  process.env.COMPLIANCE_DRY_RUN = 'true';

  const methodology = readFileSync('agents/compliance/docs/compliance-methodology.md', 'utf-8');
  const methodologyHash = '0x' + createHash('sha256').update(methodology).digest('hex');
  const codeCommit = execSync('git rev-parse HEAD').toString().trim();

  const complianceAccount = privateKeyToAccount(EPHEMERAL_KEY);
  const testWallet = complianceAccount.address;

  const credentialProof = await signStubCredential(
    testWallet,
    'enhanced',
    'US',
    PINNED_CLOCK_SEC - 86400,
    PINNED_CLOCK_SEC + 365 * 86400
  );

  const depositorAuthSig = await signDepositorAuth({
    account: complianceAccount,
    wallet: testWallet,
    credentialEvidenceHash: '0x' + '00'.repeat(32) as `0x${string}`,
    deadline: BigInt(PINNED_CLOCK_SEC + 3600)
  });

  const stubPinCounter = { n: 0 };
  const stubPin = async (_data: string, _apiKey: string): Promise<string> => {
    stubPinCounter.n++;
    return `bafk-stub-evidence-${stubPinCounter.n}`;
  };

  const stubPublisher = {
    async publishReceipt(draft: any) {
      return {
        receiptCid: 'bafk-stub-receipt-cid',
        receipt: { ...draft, signature: '0x' + 'ab'.repeat(65) }
      };
    }
  };

  const orchestrator = new GateOrchestrator({
    credentialAdapter: createStubCredentialAdapter({ now: () => PINNED_CLOCK_SEC }),
    sanctionsOracle: createStubSanctionsOracle({ now: () => PINNED_CLOCK_SEC }),
    policyResolver: createStubPolicyResolver(),
    publisher: stubPublisher,
    pinEvidence: stubPin,
    pinataJwt: 'stub-key',
    publisherAddress: complianceAccount.address,
    identityNFT: 'ipfs://placeholder',
    methodologyHash,
    codeCommit,
    nowSec: () => PINNED_CLOCK_SEC
  });

  const result = await orchestrator.runGateCycle(
    testWallet,
    credentialProof,
    depositorAuthSig,
    PINNED_CLOCK_SEC + 3600
  );

  const lines = [
    `# Compliance inspect (dry-run)`,
    ``,
    `- wallet: ${testWallet}`,
    `- methodologyHash: ${methodologyHash}`,
    `- codeCommit: ${codeCommit}`,
    `- clockSec: ${PINNED_CLOCK_SEC}`,
    ``,
    `## Gate result`,
    ``,
    `- status: ${result.status}`,
  ];

  if (result.status === 'approved') {
    lines.push(
      `- receiptCid: ${result.receiptCid}`,
      `- evidenceCid: ${result.evidenceCid}`,
      `- permittedTranchesMask: ${result.receipt.permittedTranchesMask}`,
      `- kycTier: ${result.receipt.kycTier}`,
      `- kycExpiresAtSec: ${result.receipt.kycExpiresAtSec}`,
      `- sanctionsScreenExpiresAtSec: ${result.receipt.sanctionsScreenExpiresAtSec}`,
      `- policyTokenId: ${result.receipt.policyTokenId}`,
      `- jurisdictionCodeHash: ${result.receipt.jurisdictionCodeHash}`,
      `- credentialProvider: ${result.receipt.credentialProvider}`,
    );
  } else if (result.status === 'denied') {
    lines.push(`- reason: ${result.reason}`);
  } else if (result.status === 'existing') {
    lines.push(
      `- receiptId: ${result.receipt.receiptId}`,
      `- mask: ${result.receipt.mask}`,
    );
  }

  writeFileSync('agents/compliance/compliance-output.md', lines.join('\n') + '\n');
  console.log(JSON.stringify(result, null, 2));
  console.log('wrote agents/compliance/compliance-output.md');
}

main().catch((e) => { console.error(e); process.exit(1); });
