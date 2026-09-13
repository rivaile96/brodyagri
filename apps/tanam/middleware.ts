import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'brodyagri-secret-key-ganti-di-production-2026'
);

const PUBLIC_PATHS = ['/', '/auth/login', '/auth/register', '/api/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths (Root Launcher, Auth, & Auth APIs)
  if (pathname === '/' || PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check session cookie
  const token = request.cookies.get('brodyagri_session')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
