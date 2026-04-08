import { z } from 'zod';

const EnvSchema = z.object({
  NEXT_PUBLIC_API_URL:   z.string().url().default('http://localhost:4000/api/v1'),
  NEXT_PUBLIC_APP_URL:   z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME:  z.string().default('AVS — African Visual Standard'),
});

const _parsed = EnvSchema.safeParse({
  NEXT_PUBLIC_API_URL:  process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_URL:  process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
});

if (!_parsed.success) {
  console.error('[AVS] Variables d\'environnement invalides :', _parsed.error.flatten());
}

export const env = _parsed.success ? _parsed.data : EnvSchema.parse({});
