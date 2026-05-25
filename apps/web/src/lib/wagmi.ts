'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { type Config } from 'wagmi';
import { mantle } from 'wagmi/chains';

export const config: Config = getDefaultConfig({
  appName: 'Strata',
  projectId: 'strata-hackathon-demo',
  chains: [mantle],
  ssr: true
});
