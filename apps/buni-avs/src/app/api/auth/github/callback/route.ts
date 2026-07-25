import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/auth/login?error=github', request.url));
  }

  return NextResponse.redirect(new URL(`/auth/login?github_code=${encodeURIComponent(code)}`, request.url));
}
