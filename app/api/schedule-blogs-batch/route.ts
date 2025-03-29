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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Extract API key from headers
    const authHeader = request.headers.get("Authorization")
    const apiKey = authHeader?.replace("Bearer ", "")

    if (!apiKey) {
      console.error("API Key is missing")
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
      console.error("Invalid API Key:", userError)
      const res = NextResponse.json({ error: "Invalid API Key" }, { status: 403 })
      res.headers.set("Access-Control-Allow-Origin", "*")
      return res
    }

    // Get the schedules from the request body
    const { schedules } = await request.json()

    // Validate required fields
    if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
      const res = NextResponse.json({ error: "Missing or invalid schedules array" }, { status: 400 })
      res.headers.set("Access-Control-Allow-Origin", "*")
      return res
    }

    // Check for duplicate blog IDs (to prevent scheduling the same blog multiple times)
    const blogIds = schedules.map((schedule) => schedule.blogId)
    const uniqueBlogIds = new Set(blogIds)

    if (uniqueBlogIds.size !== blogIds.length) {
      const res = NextResponse.json({ error: "Duplicate blog IDs detected" }, { status: 400 })
      res.headers.set("Access-Control-Allow-Origin", "*")
      return res
    }

    // Check for duplicate dates (to prevent scheduling multiple blogs on the same day)
    const dates = schedules.map((schedule) => schedule.scheduledDate.split("T")[0]) // Get just the date part
    const uniqueDates = new Set(dates)

    if (uniqueDates.size !== dates.length) {
      const res = NextResponse.json({ error: "Duplicate dates detected" }, { status: 400 })
      res.headers.set("Access-Control-Allow-Origin", "*")
      return res
    }

    // Verify all blogs belong to the authenticated user
    const { data: userBlogs, error: userBlogsError } = await supabase
      .from("blogs")
      .select("id")
      .eq("user_id", userApi.user_id)
      .in("id", blogIds)

    if (userBlogsError) {
      console.error("Error verifying blog ownership:", userBlogsError)
      const res = NextResponse.json({ error: "Error verifying blog ownership" }, { status: 500 })
      res.headers.set("Access-Control-Allow-Origin", "*")
      return res
    }

    if (!userBlogs || userBlogs.length !== blogIds.length) {
      const res = NextResponse.json(
        { error: "One or more blogs do not belong to the authenticated user" },
        { status: 403 },
      )
      res.headers.set("Access-Control-Allow-Origin", "*")
      return res
    }

    // Update each blog with its scheduled date
    const updatePromises = schedules.map((schedule) =>
      supabase
        .from("blogs")
        .update({ scheduled_date: schedule.scheduledDate })
        .eq("id", schedule.blogId)
        .eq("user_id", userApi.user_id),
    )

    // Execute all updates
    const updateResults = await Promise.all(updatePromises)

    // Check for errors in any of the updates
    const errors = updateResults.filter((result) => result.error)
    if (errors.length > 0) {
      console.error("Errors updating blogs:", errors)
      const res = NextResponse.json({ error: "Error updating one or more blogs" }, { status: 500 })
      res.headers.set("Access-Control-Allow-Origin", "*")
      return res
    }

    // Return success response
    const response = NextResponse.json({
      success: true,
      message: `Successfully scheduled ${schedules.length} blog posts`,
    })
    response.headers.set("Access-Control-Allow-Origin", "*")
    return response
  } catch (error) {
    console.error("Error scheduling blogs:", error)
    const res = NextResponse.json({ error: "Internal server error" }, { status: 500 })
    res.headers.set("Access-Control-Allow-Origin", "*")
    return res
  }
}

