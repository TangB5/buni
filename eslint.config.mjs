import { FlatCompat } from '@eslint/eslintrc';
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default [
  { ignores: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/.nx/**'] },
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars':  ['warn', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
    },
  },
];
