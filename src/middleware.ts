import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pcp = request.cookies.get('PCP')?.value;
  const session = request.cookies.get('session')?.value;

  // ── Gate page (/): if PCP cookie already set → go to login form ──
  if (pathname === '/') {
    if (pcp) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // ── Dashboard routes: need both PCP + session ──
  if (pathname.startsWith('/dashboard')) {
    if (!pcp || !session) {
      // Clear any partial cookies and send back to gate
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('PCP');
      response.cookies.delete('session');
      return response;
    }
    return NextResponse.next();
  }

  // ── Login page: need PCP cookie (set by gate) ──
  if (pathname === '/login') {
    if (!pcp) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // If already has session too → go straight to dashboard
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // ── Register / restore: need PCP cookie ──
  if (pathname === '/register' || pathname === '/restore') {
    if (!pcp) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/login', '/register', '/restore'],
};
