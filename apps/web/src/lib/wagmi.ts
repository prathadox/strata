'use client';

import { createConfig, http, cookieStorage, createStorage, type Config } from 'wagmi';
import { mantle } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Mantle-only wagmi config. With `multiInjectedProviderDiscovery: true` (the v2 default),
// wagmi listens for EIP-6963 announcements and exposes ONE connector per installed wallet
// — MetaMask, Exodus, Phantom, etc. each get their own entry in `connectors`. Our connect
// UIs use `findMetaMask()` (see below) to pick the MetaMask one specifically, instead of
// `connectors[0]` which would pick whatever hijacked `window.ethereum`.
//
// We also keep one explicit `injected({ target: 'metaMask' })` as a fallback for browsers
// where MetaMask hasn't announced via EIP-6963 yet — wagmi will dedup it against the
// EIP-6963 entry when both exist.

export const config: Config = createConfig({
  chains: [mantle],
  connectors: [
    injected({ target: 'metaMask', shimDisconnect: true })
  ],
  multiInjectedProviderDiscovery: true,
  transports: {
    [mantle.id]: http('https://rpc.mantle.xyz')
  },
  ssr: true,
  storage: createStorage({ storage: cookieStorage })
});

// Find the MetaMask connector among the discovered EIP-6963 entries. Falls back to the
// explicit `injected({ target: 'metaMask' })` connector we configured.
export function findMetaMask<T extends { id: string; name: string }>(
  connectors: readonly T[]
): T | undefined {
  return (
    connectors.find((c) => /metamask/i.test(c.name)) ??
    connectors.find((c) => c.id === 'metaMask' || c.id === 'io.metamask') ??
    connectors.find((c) => c.id === 'injected') // explicit target:'metaMask' fallback
  );
}
