import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/db/prisma';

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

  // NGO routes - check role and approval status
  if (ngoRoutes) {
    // First check role
    if (token.role !== 'NGO') {
      if (token.role === 'DONOR') {
        return NextResponse.redirect(new URL('/dashboard/donor', request.url));
      }
      if (token.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Check NGO approval status
    // Skip check for verification-pending page itself and API routes
    if (!pathname.startsWith('/dashboard/ngo/verification-pending') && 
        !pathname.startsWith('/api/')) {
      
      const ngoProfile = await prisma.ngoProfile.findUnique({
        where: { userId: token.id },
        select: { approvalStatus: true }
      });

      if (ngoProfile && ngoProfile.approvalStatus !== 'APPROVED') {
        // Redirect to verification pending page
        return NextResponse.redirect(new URL('/verification-pending', request.url));
      }
    }
  }

  if (adminRoutes && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};
