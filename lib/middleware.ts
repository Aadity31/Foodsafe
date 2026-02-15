import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  const pathname = request.nextUrl.pathname;

  // Define role-based routes
  const donorRoutes = pathname.startsWith('/dashboard/donor');
  const ngoRoutes = pathname.startsWith('/dashboard/ngo');
  const adminRoutes = pathname.startsWith('/admin');

  // If no token, redirect to login for protected routes
  if (!token) {
    if (donorRoutes || ngoRoutes || adminRoutes) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }

  // Role-based route protection
  if (donorRoutes && token.role !== 'DONOR') {
    // Redirect to appropriate dashboard based on role
    if (token.role === 'NGO') {
      return NextResponse.redirect(new URL('/dashboard/ngo', request.url));
    }
    if (token.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (ngoRoutes && token.role !== 'NGO') {
    if (token.role === 'DONOR') {
      return NextResponse.redirect(new URL('/dashboard/donor', request.url));
    }
    if (token.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (adminRoutes && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check for unverified users accessing dashboard
  // Note: We would need to fetch user.verified from DB in a real implementation
  // For now, this is a placeholder
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};
