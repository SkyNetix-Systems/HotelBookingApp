import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define private routes
  const privateRoutes = ['/owner', '/admin', '/customer']

  // Check if current path is a private route
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route))

  // Get token from cookies
  const token = request.cookies.get('token')?.value

  if (isPrivateRoute) {
    if (!token) {
      // No token, redirect to login
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    try {
      // Verify token
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key'
      jwt.verify(token, jwtSecret)

      // Token is valid, allow access
      return NextResponse.next()
    } catch (error) {
      // Token is invalid, redirect to login
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  } else {
    // Public route - check if user is already authenticated
    if (token) {
      try {
        // Verify and decode token to get user role
        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key'
        const decoded = jwt.verify(token, jwtSecret) as { role: string }

        // Redirect to appropriate dashboard based on role
        let dashboardUrl: string
        switch (decoded.role) {
          case 'customer':
            dashboardUrl = '/customer/dashboard'
            break
          case 'owner':
            dashboardUrl = '/owner/dashboard'
            break
          case 'admin':
            dashboardUrl = '/admin/dashboard'
            break
          default:
            dashboardUrl = '/customer/dashboard' // fallback
        }

        // Only redirect if not already on the dashboard
        if (!pathname.startsWith(dashboardUrl)) {
          const redirectUrl = new URL(dashboardUrl, request.url)
          return NextResponse.redirect(redirectUrl)
        }
      } catch (error) {
        // Token is invalid, clear it and continue to public route
        const response = NextResponse.next()
        response.cookies.delete('token')
        return response
      }
    }

    // Public route without token or invalid token, allow access
    return NextResponse.next()
  }
}

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