'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { config } from '../lib/wagmi';

// wagmi v2's WagmiProvider auto-reconnects on mount by default, and our wagmi.ts
// uses cookieStorage so the previously-connected MetaMask account + chain
// rehydrate transparently across reloads.
const queryClient = new QueryClient();

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config} reconnectOnMount>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#ff3d86',
          accentColorForeground: '#0a0408',
          borderRadius: 'medium'
        })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
