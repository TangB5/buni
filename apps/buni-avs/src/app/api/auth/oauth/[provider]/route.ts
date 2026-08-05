import { type NextRequest, NextResponse } from 'next/server';
import {
  getOAuthProvider,
  getOAuthRedirectUri,
  isOAuthProviderId,
} from '@/features/auth/oauth/providers';
import {
  OAUTH_CALLBACK_COOKIE,
  OAUTH_COOKIE_OPTIONS,
  OAUTH_STATE_COOKIE,
  OAUTH_VERIFIER_COOKIE,
  pkceChallenge,
  randomToken,
  sanitizeCallbackUrl,
} from '@/features/auth/oauth/state';

function loginRedirect(request: NextRequest, error: string) {
  const url = new URL('/auth/login', request.url);
  url.searchParams.set('error', error);
  return NextResponse.redirect(url);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider: providerParam } = await params;

  if (!isOAuthProviderId(providerParam)) {
    return loginRedirect(request, 'oauth_unknown_provider');
  }

  const provider = getOAuthProvider(providerParam);
  if (!provider) {
    return loginRedirect(request, 'oauth_not_configured');
  }

  const state = randomToken();
  const callbackUrl = sanitizeCallbackUrl(request.nextUrl.searchParams.get('callbackUrl'));

  const authorizeUrl = new URL(provider.authorizeUrl);
  authorizeUrl.searchParams.set('client_id', provider.clientId);
  authorizeUrl.searchParams.set('redirect_uri', getOAuthRedirectUri(provider.id, request.url));
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('scope', provider.scope);
  authorizeUrl.searchParams.set('state', state);

  let verifier: string | null = null;
  if (provider.usesPkce) {
    verifier = randomToken();
    authorizeUrl.searchParams.set('code_challenge', await pkceChallenge(verifier));
    authorizeUrl.searchParams.set('code_challenge_method', 'S256');
  }

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(OAUTH_STATE_COOKIE, state, OAUTH_COOKIE_OPTIONS);
  response.cookies.set(OAUTH_CALLBACK_COOKIE, callbackUrl, OAUTH_COOKIE_OPTIONS);
  if (verifier) {
    response.cookies.set(OAUTH_VERIFIER_COOKIE, verifier, OAUTH_COOKIE_OPTIONS);
  }

  return response;
}
