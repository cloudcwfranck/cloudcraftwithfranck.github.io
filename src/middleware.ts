import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

function isDashboardPath(pathname: string): boolean {
  return pathname.includes('/dashboard');
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isDashboardPath(pathname)) {
    const authCookie = request.cookies.get('dashboard_auth');
    const password = process.env.DASHBOARD_PASSWORD;

    if (password && authCookie?.value !== password) {
      const loginUrl = new URL('/api/dashboard-login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/(en|id)/:path*',
  ],
};
