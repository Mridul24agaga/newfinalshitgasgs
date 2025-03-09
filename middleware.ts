import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/profile", "/settings"];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If it's a protected route and user is not signed in, redirect to login
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is signed in and tries to access login or signup, redirect to dashboard
  if (user && ["/login", "/signup"].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ADDED: API key validation for /api/blog/* routes
  if (request.nextUrl.pathname.startsWith("/api/blog")) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: "API key is required, bro!" }, { status: 401 });
    }

    // Simple rate limiting (in-memory, per API key)
    const rateLimit = new Map<string, { count: number; lastReset: number }>();
    const LIMIT = 100; // 100 requests per hour
    const WINDOW = 60 * 60 * 1000; // 1 hour in ms
    const now = Date.now();
    let rl = rateLimit.get(apiKey) || { count: 0, lastReset: now };
    if (now - rl.lastReset > WINDOW) {
      rl = { count: 0, lastReset: now };
    }
    if (rl.count >= LIMIT) {
      return NextResponse.json({ error: "Rate limit exceeded. Chill out, man!" }, { status: 429 });
    }
    rl.count++;
    rateLimit.set(apiKey, rl);

    // Validate API key against Supabase
    const { data, error } = await supabase
      .from("api_keys")
      .select("user_id, is_active")
      .eq("api_key", apiKey)
      .single();

    if (error || !data || !data.is_active) {
      return NextResponse.json({ error: "Invalid or inactive API key." }, { status: 401 });
    }

    // Attach user_id to headers for downstream API routes
    request.headers.set("x-user-id", data.user_id);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Include /api routes explicitly since we want to handle /api/blog/*
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};