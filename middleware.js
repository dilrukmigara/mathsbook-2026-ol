import { NextResponse } from 'next/server';

export function middleware(request) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Check if host corresponds to papers subdomain
  // e.g. papers.mathsbook.dilrukmigara.me, papers.localhost:3000, etc.
  const isPapersSubdomain = 
    host.startsWith('papers.') || 
    host.includes('papers.mathsbook');

  if (isPapersSubdomain) {
    // If accessing root of papers subdomain, rewrite to /papers
    if (url.pathname === '/') {
      url.pathname = '/papers';
      return NextResponse.rewrite(url);
    }

    // If accessing subpaths under papers subdomain that are not static or api or uploads
    if (
      !url.pathname.startsWith('/papers') &&
      !url.pathname.startsWith('/api') &&
      !url.pathname.startsWith('/uploads') &&
      !url.pathname.startsWith('/_next') &&
      !url.pathname.includes('.')
    ) {
      url.pathname = `/papers${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude static assets, images, favicon
    '/((?!_next/static|_next/image|favicon.ico|icons.svg).*)',
  ],
};
