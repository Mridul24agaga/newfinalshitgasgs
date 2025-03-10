import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with admin privileges for API key validation
const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function GET(request: Request) {
  try {
    // Get the API key from the Authorization header
    const authHeader = request.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "API key is required" }, { status: 401 })
    }

    const apiKey = authHeader.replace("Bearer ", "")

    // Validate the API key and get the associated user
    const { data: apiKeyData, error: apiKeyError } = await adminSupabase
      .from("keys")
      .select("user_id")
      .eq("key", apiKey)
      .single()

    if (apiKeyError || !apiKeyData) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    // Update the last_used_at timestamp
    await adminSupabase.from("keys").update({ last_used_at: new Date().toISOString() }).eq("key", apiKey)

    // Get the user ID from the API key
    const userId = apiKeyData.user_id

    // Get the blog ID from the query parameter
    const url = new URL(request.url)
    const blogId = url.searchParams.get("id")

    // Query to fetch blogs
    let query = adminSupabase.from("blogs").select("*").eq("user_id", userId)

    // If a blog ID is provided, filter by that ID
    if (blogId) {
      query = query.eq("id", blogId)
    }

    // Execute the query
    const { data: blogs, error: blogsError } = await query

    if (blogsError) {
      return NextResponse.json({ error: blogsError.message }, { status: 500 })
    }

    return NextResponse.json({
      blogs,
      user_id: userId,
      blog_count: blogs.length,
    })
  } catch (error) {
    console.error("Error fetching blogs with API key:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

