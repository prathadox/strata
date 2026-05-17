import type { SourceProtocol, RiskFactors } from '../../types.js';

export interface ProtocolMeta {
  auditFactor: number;
  oracleType: NonNullable<RiskFactors['oracleType']>;
  counterpartyClass: NonNullable<RiskFactors['counterpartyClass']>;
  contractAgeDays: number;
}

export const PROTOCOL_CONFIG: Record<SourceProtocol, ProtocolMeta> = {
  aave:         { auditFactor: 0.30, oracleType: 'chainlink_dec', counterpartyClass: 'permissionless',       contractAgeDays: 700 },
  ondo:         { auditFactor: 0.30, oracleType: 'chainlink_dec', counterpartyClass: 'custodial',            contractAgeDays: 730 },
  ethena:       { auditFactor: 0.30, oracleType: 'chainlink_dec', counterpartyClass: 'attested_centralized', contractAgeDays: 600 },
  meth:         { auditFactor: 0.30, oracleType: 'redstone',      counterpartyClass: 'permissionless',       contractAgeDays: 730 },
  mantleVault:  { auditFactor: 0.60, oracleType: 'redstone',      counterpartyClass: 'attested_centralized', contractAgeDays: 365 },
  cian:         { auditFactor: 0.60, oracleType: 'custom_multi',  counterpartyClass: 'permissionless',       contractAgeDays: 300 },
  agni:         { auditFactor: 0.60, oracleType: 'redstone',      counterpartyClass: 'permissionless',       contractAgeDays: 540 },
  merchantMoe:  { auditFactor: 0.60, oracleType: 'redstone',      counterpartyClass: 'permissionless',       contractAgeDays: 540 },
  fbtc:         { auditFactor: 0.60, oracleType: 'custom_multi',  counterpartyClass: 'custodial',            contractAgeDays: 365 },
  mortgageDemo: { auditFactor: 1.00, oracleType: 'single',        counterpartyClass: 'attested_centralized', contractAgeDays: 30  }
};

export function metaFor(source: SourceProtocol): ProtocolMeta {
  return PROTOCOL_CONFIG[source];
}
