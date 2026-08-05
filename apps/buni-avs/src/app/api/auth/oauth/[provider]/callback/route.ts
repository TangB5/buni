import { type NextRequest, NextResponse } from 'next/server';
import {
  getOAuthProvider,
  getOAuthRedirectUri,
  isOAuthProviderId,
  type OAuthProvider,
} from '@/features/auth/oauth/providers';
import {
  OAUTH_CALLBACK_COOKIE,
  OAUTH_STATE_COOKIE,
  OAUTH_VERIFIER_COOKIE,
  sanitizeCallbackUrl,
} from '@/features/auth/oauth/state';

function clearFlowCookies(response: NextResponse) {
  for (const name of [OAUTH_STATE_COOKIE, OAUTH_VERIFIER_COOKIE, OAUTH_CALLBACK_COOKIE]) {
    response.cookies.delete({ name, path: '/api/auth/oauth' });
  }
  return response;
}

function failure(request: NextRequest, error: string) {
  const url = new URL('/auth/login', request.url);
  url.searchParams.set('error', error);
  return clearFlowCookies(NextResponse.redirect(url));
}

async function exchangeCode(
  provider: OAuthProvider,
  code: string,
  redirectUri: string,
  verifier: string | null,
): Promise<string> {
  const body = new URLSearchParams({
    client_id: provider.clientId,
    client_secret: provider.clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });
  if (verifier) body.set('code_verifier', verifier);

  const res = await fetch(provider.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body,
  });

  const data = (await res.json()) as { access_token?: string; error?: string };
  if (!res.ok || !data.access_token) {
    throw new Error(data.error || `Token exchange failed (${res.status})`);
  }
  return data.access_token;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider: providerParam } = await params;
  const query = request.nextUrl.searchParams;

  if (query.get('error')) return failure(request, 'oauth_denied');
  if (!isOAuthProviderId(providerParam)) return failure(request, 'oauth_unknown_provider');

  const provider = getOAuthProvider(providerParam);
  if (!provider) return failure(request, 'oauth_not_configured');

  const code = query.get('code');
  const state = query.get('state');
  const expectedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return failure(request, 'oauth_invalid_state');
  }

  try {
    const accessToken = await exchangeCode(
      provider,
      code,
      getOAuthRedirectUri(provider.id, request.url),
      request.cookies.get(OAUTH_VERIFIER_COOKIE)?.value ?? null,
    );

    const profile = await provider.fetchProfile(accessToken);
    if (!profile.email) return failure(request, 'oauth_no_email');

    // Échange le profil contre une session Buni (cookies HttpOnly émis par le backend)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const backendRes = await fetch(`${apiUrl}/api/v1/auth/oauth/${provider.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
      credentials: 'include',
    });

    if (!backendRes.ok) return failure(request, 'oauth_session_failed');

    const callbackUrl = sanitizeCallbackUrl(
      request.cookies.get(OAUTH_CALLBACK_COOKIE)?.value ?? null,
    );
    const response = clearFlowCookies(NextResponse.redirect(new URL(callbackUrl, request.url)));

    const setCookieHeader = backendRes.headers.get('set-cookie');
    if (setCookieHeader) {
      response.headers.append('set-cookie', setCookieHeader);
    }

    return response;
  } catch {
    return failure(request, 'oauth_exchange_failed');
  }
}
