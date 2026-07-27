import { NextRequest, NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/auth/login?error=github', request.url));
  }

  try {
    // Échanger le code contre un access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      return NextResponse.redirect(new URL('/auth/login?error=github_token', request.url));
    }

    // Rediriger vers la page de login avec le token
    return NextResponse.redirect(
      new URL(`/auth/login?github_token=${encodeURIComponent(tokenData.access_token)}`, request.url)
    );
  } catch (error) {
    return NextResponse.redirect(new URL('/auth/login?error=github_exchange', request.url));
  }
}
