import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utitls/supabase/server"

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    },
  })
}

// GET: Fetch all blogs (both scheduled and unscheduled)
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    // Extract API key from headers
    const authHeader = req.headers.get("Authorization")
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

    // Fetch all blogs for the authenticated user, including scheduled_date
    const { data: blogs, error: blogsError } = await supabase
      .from("blogs")
      .select("id, title, blog_post, scheduled_date")
      .eq("user_id", userApi.user_id)
      .order("scheduled_date", { ascending: true })
      .order("id", { ascending: true }) // Secondary sort by ID

    if (blogsError) {
      console.error("Error fetching blogs:", blogsError)
      const res = NextResponse.json({ error: "Error fetching blogs" }, { status: 500 })
      res.headers.set("Access-Control-Allow-Origin", "*")
      return res
    }

    // Sort null values to the end manually
    const sortedBlogs = [...blogs].sort((a, b) => {
      // If both have scheduled_date or both don't, maintain the original order
      if ((a.scheduled_date && b.scheduled_date) || (!a.scheduled_date && !b.scheduled_date)) {
        return 0
      }
      // If a has scheduled_date but b doesn't, a comes first
      if (a.scheduled_date && !b.scheduled_date) {
        return -1
      }
      // If b has scheduled_date but a doesn't, b comes first
      return 1
    })

    // Return the blogs with CORS header
    const response = NextResponse.json(sortedBlogs)
    response.headers.set("Access-Control-Allow-Origin", "*")
    return response
  } catch (error) {
    console.error("Error in admin blogs GET:", error)
    const res = NextResponse.json({ error: "Internal server error" }, { status: 500 })
    res.headers.set("Access-Control-Allow-Origin", "*")
    return res
  }
}

// POST: Schedule blogs (batch scheduling)
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

    // Get the request body
    const body = await request.json()
    const { action } = body

    // Handle different admin actions
    if (action === "schedule_blogs") {
      return await handleScheduleBlogs(supabase, userApi.user_id, body.schedules)
    } else {
      const res = NextResponse.json({ error: "Invalid action" }, { status: 400 })
      res.headers.set("Access-Control-Allow-Origin", "*")
      return res
    }
  } catch (error) {
    console.error("Error in admin blogs POST:", error)
    const res = NextResponse.json({ error: "Internal server error" }, { status: 500 })
    res.headers.set("Access-Control-Allow-Origin", "*")
    return res
  }
}

// Helper function to handle blog scheduling
async function handleScheduleBlogs(supabase: any, userId: string, schedules: any[]) {
  // Validate schedules
  if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
    const res = NextResponse.json({ error: "Missing or invalid schedules array" }, { status: 400 })
    res.headers.set("Access-Control-Allow-Origin", "*")
    return res
  }

  // Check for duplicate blog IDs
  const blogIds = schedules.map((schedule) => schedule.blogId)
  const uniqueBlogIds = new Set(blogIds)

  if (uniqueBlogIds.size !== blogIds.length) {
    const res = NextResponse.json({ error: "Duplicate blog IDs detected" }, { status: 400 })
    res.headers.set("Access-Control-Allow-Origin", "*")
    return res
  }

  // Check for duplicate dates
  const dates = schedules.map((schedule) => schedule.scheduledDate.split("T")[0])
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
    .eq("user_id", userId)
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
      .eq("user_id", userId),
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
}

// PUT: Update a specific blog (for future expansion)
export async function PUT(request: NextRequest) {
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

    // Get the request body
    const body = await request.json()
    const { blogId, updates } = body

    if (!blogId || !updates) {
      const res = NextResponse.json({ error: "Missing blogId or updates" }, { status: 400 })
      res.headers.set("Access-Control-Allow-Origin", "*")
      return res
    }

    // Verify the blog belongs to the authenticated user
    const { data: blog, error: blogError } = await supabase
      .from("blogs")
      .select("id")
      .eq("id", blogId)
      .eq("user_id", userApi.user_id)
      .single()

    if (blogError || !blog) {
      console.error("Blog not found or not owned by user:", blogError)
      const res = NextResponse.json({ error: "Blog not found or not owned by user" }, { status: 404 })
      res.headers.set("Access-Control-Allow-Origin", "*")
      return res
    }

    // Update the blog
    const { data: updatedBlog, error: updateError } = await supabase
      .from("blogs")
      .update(updates)
      .eq("id", blogId)
      .eq("user_id", userApi.user_id)
      .select()

    if (updateError) {
      console.error("Error updating blog:", updateError)
      const res = NextResponse.json({ error: "Error updating blog" }, { status: 500 })
      res.headers.set("Access-Control-Allow-Origin", "*")
      return res
    }

    // Return the updated blog
    const response = NextResponse.json(updatedBlog)
    response.headers.set("Access-Control-Allow-Origin", "*")
    return response
  } catch (error) {
    console.error("Error in admin blogs PUT:", error)
    const res = NextResponse.json({ error: "Internal server error" }, { status: 500 })
    res.headers.set("Access-Control-Allow-Origin", "*")
    return res
  }
}

