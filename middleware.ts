import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/admin', '/chat', '/tickets', '/resources', '/peer-support', '/counselor', '/student']
  const adminRoutes = ['/admin']
  const profileRoutes = ['/profile-setup'] // Routes that require auth but not full profile
  const verificationRoutes = ['/verify-email', '/auth/callback'] // Routes for email verification
  const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => url.pathname.startsWith(route))
  const isProfileRoute = profileRoutes.some(route => url.pathname.startsWith(route))
  const isVerificationRoute = verificationRoutes.some(route => url.pathname.startsWith(route))

  // Allow verification routes without authentication
  if (isVerificationRoute) {
    return supabaseResponse
  }

  // If user is not authenticated and trying to access protected or profile routes
  if (!user && (isProtectedRoute || isProfileRoute)) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is authenticated and on profile setup route, allow access
  if (user && isProfileRoute) {
    return supabaseResponse
  }

  // If user is authenticated, check their role and approval status
  if (user && isProtectedRoute) {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('role, approval_status')
        .eq('id', user.id)
        .single()

      if (userData) {
        // Check if admin is trying to access admin routes
        if (isAdminRoute && userData.role !== 'admin') {
          url.pathname = '/dashboard'
          return NextResponse.redirect(url)
        }

        // Check approval status for non-admin users
        if (userData.role !== 'admin') {
          if (userData.approval_status === 'pending') {
            // Redirect to waiting approval page
            if (!url.pathname.startsWith('/waiting-approval')) {
              url.pathname = '/waiting-approval'
              return NextResponse.redirect(url)
            }
          } else if (userData.approval_status === 'rejected') {
            // Redirect to login with error message
            url.pathname = '/login'
            return NextResponse.redirect(url)
          }
        }

        // Role-based redirects
        if (userData.approval_status === 'approved' || userData.role === 'admin') {
          // Redirect based on role if accessing root dashboard
          if (url.pathname === '/dashboard') {
            if (userData.role === 'admin') {
              url.pathname = '/admin'
              return NextResponse.redirect(url)
            }
            // Students and counselors stay on /dashboard
          }
        }
      }
    } catch (error) {
      console.error('Error checking user data:', error)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}