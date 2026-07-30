import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/i18n';

// Routes qui NÉCESSITENT une authentification
const PROTECTED_PREFIXES = ['/dashboard', '/profile'];

// Routes d'auth — si déjà connecté, rediriger vers dashboard
const AUTH_ROUTES = ['/auth/login', '/auth/register'];

// Middleware i18n
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Redirection racine vers locale par défaut ─────────────────────────────────
  if (pathname === '/') {
    const url = new URL(`/${defaultLocale}`, request.url);
    return NextResponse.redirect(url);
  }

  // ── Gestion i18n ─────────────────────────────────────────────────────────────
  const response = intlMiddleware(request);

  // Récupérer le token (cookie ou header)
  const token =
    request.cookies.get('avs_access')?.value ??
    request.headers.get('Authorization')?.replace('Bearer ', '');

  // ── Redirections et headers de sécurité ─────────────────────────────────────
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  // ── Redirection login si route protégée sans token ──────────────────────────
  if (isProtected && !token) {
    const url = new URL(`/${defaultLocale}/auth/login`, request.url);
    url.searchParams.set('callbackUrl', pathname);
    url.searchParams.set('reason', 'auth_required');
    return NextResponse.redirect(url);
  }

  // ── Si déjà connecté, ne pas re-afficher login/register ────────────────────
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL(`/${defaultLocale}/dashboard`, request.url));
  }

  // ── Headers de sécurité sur toutes les réponses ─────────────────────────────
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  // Exclure les assets statiques et les routes Next.js internes
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/|patterns/|api/|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp).*)'],
};
