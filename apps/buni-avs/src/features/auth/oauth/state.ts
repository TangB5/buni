// Cookies temporaires du flux OAuth (state anti-CSRF, verifier PKCE, redirection)

export const OAUTH_STATE_COOKIE = 'avs_oauth_state';
export const OAUTH_VERIFIER_COOKIE = 'avs_oauth_verifier';
export const OAUTH_CALLBACK_COOKIE = 'avs_oauth_callback';

export const OAUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/api/auth/oauth',
  maxAge: 60 * 10,
} as const;

function base64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('base64url');
}

export function randomToken(): string {
  return base64Url(crypto.getRandomValues(new Uint8Array(32)));
}

export async function pkceChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return base64Url(new Uint8Array(digest));
}

/** N'autorise que des chemins internes, pour éviter une redirection ouverte. */
export function sanitizeCallbackUrl(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/dashboard';
  return value;
}
