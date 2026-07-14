import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pcp = request.cookies.get('PCP')?.value;
  const session = request.cookies.get('session')?.value;

  // ── Gate page (/): no cookie → show gate; PCP cookie → splash ──
  if (pathname === '/') {
    if (pcp) {
      return NextResponse.redirect(new URL('/splash', request.url));
    }
    return NextResponse.next();
  }

  // ── Splash page: requires PCP cookie ──
  if (pathname === '/splash') {
    if (!pcp) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Already has session → skip splash, go straight to dashboard
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // ── Login page: requires PCP cookie ──
  if (pathname === '/login') {
    if (!pcp) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Already logged in → go to dashboard
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // ── Register / restore: require PCP cookie ──
  if (pathname === '/register' || pathname === '/restore') {
    if (!pcp) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // ── Dashboard routes: need both PCP + session ──
  if (pathname.startsWith('/dashboard')) {
    if (!pcp || !session) {
      const response = NextResponse.redirect(new URL('/', request.url));
      if (!pcp) response.cookies.delete('session');
      return response;
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/splash', '/dashboard/:path*', '/login', '/register', '/restore'],
};
