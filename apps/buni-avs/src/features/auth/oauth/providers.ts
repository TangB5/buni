// Configuration OAuth — server-only (ne jamais importer depuis un composant client)

export const OAUTH_PROVIDER_IDS = ['google', 'github'] as const;
export type OAuthProviderId = (typeof OAUTH_PROVIDER_IDS)[number];

export interface OAuthProfile {
  provider: OAuthProviderId;
  providerAccountId: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
}

export interface OAuthProvider {
  id: OAuthProviderId;
  label: string;
  clientId: string;
  clientSecret: string;
  authorizeUrl: string;
  tokenUrl: string;
  scope: string;
  usesPkce: boolean;
  fetchProfile: (accessToken: string) => Promise<OAuthProfile>;
}

export function isOAuthProviderId(value: string): value is OAuthProviderId {
  return (OAUTH_PROVIDER_IDS as readonly string[]).includes(value);
}

async function fetchGoogleProfile(accessToken: string): Promise<OAuthProfile> {
  const res = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Google userinfo failed (${res.status})`);

  const profile = (await res.json()) as {
    sub: string;
    email?: string;
    name?: string;
    picture?: string;
  };

  return {
    provider: 'google',
    providerAccountId: profile.sub,
    email: profile.email ?? null,
    name: profile.name ?? null,
    avatar: profile.picture ?? null,
  };
}

async function fetchGithubProfile(accessToken: string): Promise<OAuthProfile> {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/vnd.github+json',
  };

  const res = await fetch('https://api.github.com/user', { headers });
  if (!res.ok) throw new Error(`GitHub user failed (${res.status})`);

  const profile = (await res.json()) as {
    id: number;
    login: string;
    email?: string | null;
    name?: string | null;
    avatar_url?: string | null;
  };

  // L'email est masqué par défaut : on récupère l'email principal vérifié
  let email = profile.email ?? null;
  if (!email) {
    const emailsRes = await fetch('https://api.github.com/user/emails', { headers });
    if (emailsRes.ok) {
      const emails = (await emailsRes.json()) as {
        email: string;
        primary: boolean;
        verified: boolean;
      }[];
      email = emails.find((e) => e.primary && e.verified)?.email ?? null;
    }
  }

  return {
    provider: 'github',
    providerAccountId: String(profile.id),
    email,
    name: profile.name ?? profile.login,
    avatar: profile.avatar_url ?? null,
  };
}

/**
 * Retourne la config d'un provider, ou `null` si les variables
 * d'environnement (client id / secret) ne sont pas définies.
 */
export function getOAuthProvider(id: OAuthProviderId): OAuthProvider | null {
  const clientId = process.env[`${id.toUpperCase()}_OAUTH_CLIENT_ID`];
  const clientSecret = process.env[`${id.toUpperCase()}_OAUTH_CLIENT_SECRET`];

  if (!clientId || !clientSecret) return null;

  const base = { clientId, clientSecret };

  if (id === 'google') {
    return {
      ...base,
      id: 'google',
      label: 'Google',
      authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scope: 'openid email profile',
      usesPkce: true,
      fetchProfile: fetchGoogleProfile,
    };
  }

  return {
    ...base,
    id: 'github',
    label: 'GitHub',
    authorizeUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    scope: 'read:user user:email',
    usesPkce: false,
    fetchProfile: fetchGithubProfile,
  };
}

export function getOAuthRedirectUri(provider: OAuthProviderId, requestUrl: string): string {
  const base = process.env.OAUTH_REDIRECT_BASE_URL || new URL(requestUrl).origin;
  return new URL(`/api/auth/oauth/${provider}/callback`, base).toString();
}
