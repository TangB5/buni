import type { NextConfig } from 'next';
import { composePlugins, withNx } from '@nx/next';

const config: NextConfig = {
  nx: {},
  experimental: { typedRoutes: true },
  images: { domains: ['cdn.buni.africa','res.cloudinary.com'] },
  env: { NEXT_PUBLIC_SITE_URL: 'https://icons.buni.africa' },
};

export default composePlugins(withNx)(config);
