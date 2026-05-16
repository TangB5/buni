import type { Config } from 'tailwindcss';
import { buniPreset } from '@buni/config';

const config: Config = {
  presets: [buniPreset as Config],

  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
};

export default config;