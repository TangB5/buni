import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const config: NextConfig = {
  output: 'standalone',
  typedRoutes: true,
  allowedDevOrigins: ['192.168.1.190'],
  images: {
    unoptimized: true,
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

export default withNextIntl(config);
