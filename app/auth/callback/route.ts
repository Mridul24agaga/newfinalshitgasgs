import { NextResponse } from "next/server";
import { createClient } from "@/utitls/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  // Always redirect to the production site
  const redirectUrl = "https://getmoreseo.org/onboarding";

  if (code) {
    const supabase = await createClient(); // Add await here

    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // Successful verification, redirect to production site with auth flag
        return NextResponse.redirect(`${redirectUrl}?verified=true`);
      }
    } catch (err) {
      console.error("Auth callback error:", err);
    }
  }

  // If there's an error or no code, redirect to error page on production site
  return NextResponse.redirect(`https://getmoreseo.org/signup?error=verification_failed`);
}