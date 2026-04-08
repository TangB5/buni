import type { NextConfig } from 'next';

const config: NextConfig = {
  experimental: { typedRoutes: true },
  images: { domains: ['cdn.buni.africa','res.cloudinary.com'] },
  env: { NEXT_PUBLIC_SITE_URL: 'https://avs.buni.africa' },
};

export default config;
