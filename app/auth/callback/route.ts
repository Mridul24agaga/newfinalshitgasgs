import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })

    try {
      await supabase.auth.exchangeCodeForSession(code)

      // After successful authentication, redirect to the dashboard
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
    } catch (error: unknown) {
      console.error("Error exchanging code for session:", error)
      // Redirect to error page with error details
      let errorMessage = "An unknown error occurred"
      if (error instanceof Error) {
        errorMessage = error.message
      }
      return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=${encodeURIComponent(errorMessage)}`)
    }
  }

  // If there's no code, redirect to the login page
  return NextResponse.redirect(`${requestUrl.origin}/login?error=No_auth_code`)
}

