import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({
      request,
    })

    // Create a server client to check the auth session
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
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

    // refreshes auth token if it exists
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')
    const isPublicRoute = request.nextUrl.pathname === '/'

    if (
      !user &&
      !isAuthRoute &&
      !isPublicRoute &&
      !request.nextUrl.pathname.startsWith('/auth')
    ) {
      // If user is not logged in and not on a public/auth route, redirect to login
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    if (user && isAuthRoute) {
      // If user is logged in, and tries to access login/signup, redirect to dashboard
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard' // we'll create this later
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (e) {
    // If Supabase fails to initialize (e.g., missing env vars), just pass the request through and avoid a 500
    console.error('Middleware Supabase Error:', e)
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}
