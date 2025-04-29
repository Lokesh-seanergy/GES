import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = [
  '/ges-workbench/dashboard',
  '/dashboard',
  '/shows',
  '/exhibits',
  '/customers',
  '/reports',
  '/settings'
];

// Define public routes
const publicRoutes = [
  '/ges-workbench/login',
  '/login',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;
  
  // Handle root paths
  if (pathname === '/' || pathname === '/ges-workbench' || pathname === '/ges-workbench/') {
    if (!token) {
      return NextResponse.redirect(new URL('/ges-workbench/login', request.url));
    }
    return NextResponse.redirect(new URL('/ges-workbench/dashboard', request.url));
  }

  // Check if the path is protected
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/ges-workbench/login', request.url));
    }
  }

  // Check if the path is public (like login) and user is already authenticated
  if (publicRoutes.some(route => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL('/ges-workbench/dashboard', request.url));
  }

  // For all other routes, proceed normally
  return NextResponse.next();
}

// Match all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 