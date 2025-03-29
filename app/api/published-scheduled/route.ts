import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utitls/supabase/server"

// This endpoint is meant to be called by a cron job to publish scheduled posts
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the API key from the query parameter for cron job authentication
    const url = new URL(req.url)
    const apiKey = url.searchParams.get("apiKey")

    if (!apiKey) {
      return NextResponse.json({ error: "API Key is required" }, { status: 401 })
    }

    // Validate API key (you might want a special admin API key for this)
    const { data: validKey, error: keyError } = await supabase
      .from("users_api_keys")
      .select("user_id")
      .eq("api_key", apiKey)
      .single()

    if (keyError || !validKey) {
      return NextResponse.json({ error: "Invalid API Key" }, { status: 403 })
    }

    // Get current time
    const now = new Date().toISOString()

    // Find all blogs that are scheduled and their scheduled time has passed
    const { data: scheduledBlogs, error: blogsError } = await supabase
      .from("blogs")
      .select("id")
      .eq("status", "scheduled")
      .lt("scheduled_for", now)

    if (blogsError) {
      return NextResponse.json({ error: "Error fetching scheduled blogs" }, { status: 500 })
    }

    if (!scheduledBlogs || scheduledBlogs.length === 0) {
      return NextResponse.json({ message: "No blogs to publish" })
    }

    // Update all these blogs to published status
    const blogIds = scheduledBlogs.map((blog) => blog.id)

    const { data: updatedBlogs, error: updateError } = await supabase
      .from("blogs")
      .update({
        status: "published",
        published_at: now,
      })
      .in("id", blogIds)
      .select()

    if (updateError) {
      return NextResponse.json({ error: "Error publishing blogs" }, { status: 500 })
    }

    return NextResponse.json({
      message: `Published ${updatedBlogs.length} blogs`,
      publishedBlogs: updatedBlogs,
    })
  } catch (error) {
    console.error("Error in publish-scheduled API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

