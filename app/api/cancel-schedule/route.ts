import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utitls/supabase/server"

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    // Extract API key from headers
    const authHeader = req.headers.get("Authorization")
    const apiKey = authHeader?.replace("Bearer ", "")

    if (!apiKey) {
      const res = NextResponse.json({ error: "API Key is required" }, { status: 401 })
      res.headers.set("Access-Control-Allow-Origin", "*")
      return res
    }

    // Validate API key against `users_api_keys` table
    const { data: userApi, error: userError } = await supabase
      .from("users_api_keys")
      .select("user_id")
      .eq("api_key", apiKey)
      .single()

    if (userError || !userApi) {
      const res = NextResponse.json({ error: "Invalid API Key" }, { status: 403 })
      res.headers.set("Access-Control-Allow-Origin", "*")
      return res
    }

    // Parse request body
    const body = await req.json()
    const { blogId } = body

    if (!blogId) {
      const res = NextResponse.json({ error: "Blog ID is required" }, { status: 400 })
      res.headers.set("Access-Control-Allow-Origin", "*")
      return res
    }

    // Verify the blog belongs to the user
    const { data: blog, error: blogError } = await supabase
      .from("blogs")
      .select("id")
      .eq("id", blogId)
      .eq("user_id", userApi.user_id)
      .single()

    if (blogError || !blog) {
      const res = NextResponse.json({ error: "Blog not found or access denied" }, { status: 404 })
      res.headers.set("Access-Control-Allow-Origin", "*")
      return res
    }

    // Update the blog to remove scheduling
    const { data: updatedBlog, error: updateError } = await supabase
      .from("blogs")
      .update({
        scheduled_for: null,
        status: "draft",
      })
      .eq("id", blogId)
      .select()
      .single()

    if (updateError) {
      const res = NextResponse.json({ error: "Failed to cancel schedule" }, { status: 500 })
      res.headers.set("Access-Control-Allow-Origin", "*")
      return res
    }

    const response = NextResponse.json(updatedBlog)
    response.headers.set("Access-Control-Allow-Origin", "*")
    return response
  } catch (error) {
    console.error("Error in cancel-schedule API:", error)
    const res = NextResponse.json({ error: "Internal server error" }, { status: 500 })
    res.headers.set("Access-Control-Allow-Origin", "*")
    return res
  }
}

