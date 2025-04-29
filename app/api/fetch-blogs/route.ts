import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utitls/supabase/server"

// Define the type for blog data
interface Blog {
  user_id: string
  blog_post: string
}

export async function OPTIONS(req: NextRequest) {
  console.log("OPTIONS request received from origin:", req.headers.get("origin"))
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-api-key",
        "Access-Control-Max-Age": "86400",
      },
    },
  )
}

export async function GET(req: NextRequest) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key",
  }

  console.log("GET request received from origin:", req.headers.get("origin"))
  console.log("Request headers:", Object.fromEntries(req.headers.entries()))

  const supabase = await createClient()
  console.log("Supabase client initialized")

  const apiKey = req.headers.get("x-api-key")
  if (!apiKey) {
    console.error("API key missing in request")
    return NextResponse.json(
      { error: "API Key is required", details: "Please provide an x-api-key header" },
      { status: 400, headers },
    )
  }

  console.log("Validating API key:", apiKey)
  const { data: apiKeyData, error: apiKeyError } = await supabase
    .from("api_keys")
    .select("user_id")
    .eq("api_key", apiKey)
    .single()

  console.log("API key query result:", JSON.stringify(apiKeyData, null, 2), "Error:", apiKeyError?.message)

  if (apiKeyError || !apiKeyData) {
    console.error("API key validation failed:", apiKeyError?.message || "No matching API key")
    return NextResponse.json(
      {
        error: "Invalid API Key",
        details: apiKeyError?.message || "API key not found in api_keys table",
        debug: `Queried api_keys with api_key: ${apiKey}`,
      },
      { status: 403, headers },
    )
  }

  const user_id = apiKeyData.user_id.trim()
  console.log("Fetching blogs for user_id:", user_id)

  // Primary query: cast user_id to text
  const { data: blogs, error: blogsError } = await supabase
    .from("blogs")
    .select("user_id, blog_post")
    .eq("user_id::text", user_id)

  console.log("Primary query result (text cast):", JSON.stringify(blogs, null, 2), "Error:", blogsError?.message)

  if (blogsError) {
    console.error("Failed to fetch blogs (text cast):", blogsError.message)
    return NextResponse.json({ error: "Failed to fetch blogs", details: blogsError.message }, { status: 500, headers })
  }

  // Fallback query: direct UUID comparison
  let fallbackBlogs: Blog[] = [] // Explicitly type the array
  if (!blogs || blogs.length === 0) {
    console.log("Trying fallback query with direct UUID comparison")
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("blogs")
      .select("user_id, blog_post")
      .eq("user_id", user_id)

    console.log(
      "Fallback query result (UUID):",
      JSON.stringify(fallbackData, null, 2),
      "Error:",
      fallbackError?.message,
    )

    if (fallbackError) {
      console.error("Failed to fetch blogs (UUID):", fallbackError.message)
    } else {
      fallbackBlogs = fallbackData || []
    }
  }

  // Debug: Fetch sample blogs
  const { data: sampleBlogs } = await supabase.from("blogs").select("user_id, blog_post").limit(5)

  console.log("Sample blogs table data:", JSON.stringify(sampleBlogs, null, 2))

  const finalBlogs = blogs && blogs.length > 0 ? blogs : fallbackBlogs

  if (!finalBlogs || finalBlogs.length === 0) {
    console.log(`No blogs found for user_id: ${user_id}`)
    return NextResponse.json(
      {
        blogs: [],
        message: `No blogs found for this API key. User ID: ${user_id} has 0 blog posts.`,
        debug: `Queried blogs table with user_id: ${user_id}. Sample user_ids in blogs: ${JSON.stringify(
          sampleBlogs?.map((row) => row.user_id) || [],
        )}`,
      },
      { status: 200, headers },
    )
  }

  console.log(`Fetched ${finalBlogs.length} blogs for user_id: ${user_id}`)
  return NextResponse.json({ blogs: finalBlogs }, { status: 200, headers })
}
