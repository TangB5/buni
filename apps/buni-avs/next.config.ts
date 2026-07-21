import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'standalone',
  typedRoutes: true,
  allowedDevOrigins: ['192.168.1.190'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.buni.africa',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  env: { NEXT_PUBLIC_SITE_URL: 'https://avs.buni.africa' },
};

export default config;
