import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Prüft, ob ein Supabase Auth-Cookie/Token existiert
  const hasAuthToken = request.cookies.getAll().some(cookie => cookie.name.includes('sb-'));
  const { pathname } = request.nextUrl;

  // Ausnahme: Öffentliche Unterseiten im Caregiver-Bereich
  const publicCaregiverRoutes = ['/caregiver/onboarding'];

  // Geschützte Seiten, die nur eingeloggte Nutzer sehen dürfen
  const protectedRoutes = ['/family', '/requests', '/chat', '/caregiver', '/kyc', '/finances'];

  const isPublicRoute = publicCaregiverRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Wenn es eine geschützte Route ist, KEIN Auth-Token da ist UND es KEINE öffentliche Ausnahme ist -> Redirect zu /login
  if (isProtectedRoute && !hasAuthToken && !isPublicRoute) {
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