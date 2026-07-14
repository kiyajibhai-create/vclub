import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pcp = request.cookies.get('PCP')?.value;
  const session = request.cookies.get('session')?.value;

  // ── Dashboard routes: need both PCP + session ──
  if (pathname.startsWith('/dashboard')) {
    if (!pcp || !session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // ── Login page: need PCP cookie (set by gate) ──
  if (pathname === '/login') {
    if (!pcp) {
      return NextResponse.redirect(new URL('/', request.url));
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

  // ── Gate page (/): always accessible ──
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/restore'],
};
