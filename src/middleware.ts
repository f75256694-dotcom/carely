import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Prūft, ob ein Supabase Auth-Cookie/Token existiert
  const hasAuthToken = request.cookies.getAll().some(cookie => cookie.name.includes('sb-'));
  const { pathname } = request.nextUrl;

  // Geschützte Seiten, die nur eingeloggte Nutzer sehen dürfen
  const protectedRoutes = ['/family', '/requests', '/chat', '/caregiver', '/kyc', '/finances'];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !hasAuthToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/family/:path*',
    '/requests/:path*',
    '/chat/:path*',
    '/caregiver/:path*',
    '/kyc/:path*',
    '/finances/:path*',
  ],
};