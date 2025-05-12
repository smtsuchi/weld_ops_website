import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === 'admin';

    if (req.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: ['/admin/:path*']
}; 