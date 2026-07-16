import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host');
  
  // ── Redirect www.vclub.sh to vclub.sh for SEO consistency ──
  if (host && host.startsWith('www.')) {
    const cleanHost = host.replace(/^www\./, '');
    const newUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, `https://${cleanHost}`);
    return NextResponse.redirect(newUrl, 301);
  }

  const { pathname } = request.nextUrl;

  const pcp = request.cookies.get('PCP')?.value;
  const session = request.cookies.get('session')?.value;

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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt, logo.svg, icon.svg, apple-icon.svg (metadata files/assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|logo.svg|icon.svg|apple-icon.svg).*)',
  ],
};
