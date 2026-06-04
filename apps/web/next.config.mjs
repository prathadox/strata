/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Silence optional peer-dep warnings from wagmi/walletconnect/metamask-sdk that only
    // matter in React Native / Node-server contexts. Resolving them to `false` tells webpack
    // to stub them out — they're never imported in the browser code path we actually use.
    config.resolve.fallback = {
      ...(config.resolve.fallback ?? {}),
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false
    };
    return config;
  }
};
export default nextConfig;
