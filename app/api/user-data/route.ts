import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utitls/supabase/server"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    let userId: string | null = null

    // Check for API key in the Authorization header
    const authHeader = req.headers.get("Authorization")
    console.log("Auth header received:", authHeader) // Debug log

    const apiKey = authHeader?.replace("Bearer ", "")

    if (apiKey) {
      console.log("API key extracted (first 10 chars):", apiKey.substring(0, 10) + "...") // Debug log, only show part of the key

      // IMPORTANT: Log the exact query we're about to run
      console.log("Running query: SELECT user_id FROM api_keys WHERE api_key = '" + apiKey.substring(0, 5) + "...'")

      // If API key is provided, authenticate using the API key
      // Make sure we're using the correct column name "api_key"
      const { data: apiKeyData, error: apiKeyError } = await supabase
        .from("api_keys")
        .select("user_id")
        .eq("api_key", apiKey)

      // Log the raw response for debugging
      console.log("API key lookup response:", {
        hasData: apiKeyData && apiKeyData.length > 0,
        rowCount: apiKeyData?.length,
        hasError: !!apiKeyError,
      })

      if (apiKeyError) {
        console.error("API key lookup error:", apiKeyError)
        return NextResponse.json({ error: "Invalid API key", details: "Database lookup failed" }, { status: 401 })
      }

      if (!apiKeyData || apiKeyData.length === 0) {
        console.log("No matching API key found in database") // Debug log
        return NextResponse.json({ error: "Invalid API key", details: "No matching key found" }, { status: 401 })
      }

      userId = apiKeyData[0].user_id
      console.log("Authenticated via API key for user:", userId)
    } else {
      // Fall back to session-based authentication
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        return NextResponse.json(
          {
            error: "Authentication required. Provide a valid API key or login session.",
          },
          { status: 401 },
        )
      }

      userId = user.id
      console.log("Authenticated via session for user:", userId)
    }

    // Fetch blogs for the authenticated user
    const { data: blogs, error: blogsError } = await supabase
      .from("blogs")
      .select("id, title, blog_post")
      .eq("user_id", userId)

    if (blogsError) {
      console.error("Blogs error:", blogsError)
      return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
    }

    // Fetch headline-to-blog data for the authenticated user
    const { data: headlinetoblog, error: hlError } = await supabase
      .from("headlinetoblog")
      .select("id, headline, blog_text")
      .eq("user_id", userId)

    if (hlError) {
      console.error("Headlines error:", hlError)
      return NextResponse.json({ error: "Failed to fetch headlines" }, { status: 500 })
    }

    return NextResponse.json({
      blogs: blogs || [],
      headlinetoblog: headlinetoblog || [],
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
