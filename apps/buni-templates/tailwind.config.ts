import type { Config } from 'tailwindcss';
import { buniPreset } from '@buni/config';
const config: Config = {
  presets: [buniPreset as Config],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
};
export default config;
