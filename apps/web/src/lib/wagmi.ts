'use client';

import { createConfig, http, cookieStorage, createStorage, type Config } from 'wagmi';
import { mantle } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Mantle-only wagmi config. We use the `injected` connector with `target: 'metaMask'` so it
// binds specifically to the MetaMask provider — not Exodus, not Brave, not whatever other
// extension may have hijacked `window.ethereum`.
//
// `cookieStorage` makes the connection state survive a page reload, and the connector's
// `shimDisconnect: true` lets us cleanly disconnect without the extension auto-reconnecting.

export const config: Config = createConfig({
  chains: [mantle],
  connectors: [
    injected({
      target: 'metaMask',
      shimDisconnect: true
    })
  ],
  transports: {
    [mantle.id]: http('https://rpc.mantle.xyz')
  },
  ssr: true,
  storage: createStorage({ storage: cookieStorage })
});
