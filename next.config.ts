import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['playwright'],
  },
  // Disable telemetry
  telemetry: false,
};

export default nextConfig;
