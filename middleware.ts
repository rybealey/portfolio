import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip authentication check for login page
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Check authentication for all other admin routes
  if (pathname.startsWith('/admin')) {
    const authCookie = request.cookies.get('admin-auth');
    
    if (authCookie?.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};

