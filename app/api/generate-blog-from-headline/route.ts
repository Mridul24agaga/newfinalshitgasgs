import { NextResponse } from "next/server"
import { generateBlog } from "@/app/headlinetoblog"
import { createClient } from "@/utitls/supabase/server"

export async function POST(request: Request) {
  try {
    const { headline, websiteUrl, humanizeLevel } = await request.json()

    if (!headline) {
      return NextResponse.json({ error: "Headline is required" }, { status: 400 })
    }

    console.log(`Received request to generate blog with:`)
    console.log(`- Headline: ${headline}`)
    console.log(`- Website URL: ${websiteUrl || "Not provided"}`)
    console.log(`- Humanize Level: ${humanizeLevel || "normal"}`)

    // Authenticate user - await the client creation
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication failed:", authError?.message)
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Generate blog post - pass empty string if websiteUrl is not provided
    const blogResult = await generateBlog(websiteUrl || "", headline)

    // Generate a unique ID for the blog post
    const blogId = crypto.randomUUID()

    // Save to headlinetoblog table
    const { error: saveError } = await supabase.from("headlinetoblog").insert({
      id: blogId,
      user_id: user.id,
      title: blogResult.headline,
      blog_post: blogResult.content,
      created_at: new Date().toISOString(),
      url: websiteUrl || null,
      is_blurred: blogResult.is_blurred,
    })

    if (saveError) {
      console.error("Error saving to headlinetoblog table:", saveError)
      return NextResponse.json({ error: "Failed to save blog post" }, { status: 500 })
    }

    return NextResponse.json({
      id: blogId,
      title: blogResult.headline,
      content: blogResult.content,
      is_blurred: blogResult.is_blurred,
    })
  } catch (error: any) {
    console.error("Error in generate-blog-from-headline API route:", error)
    return NextResponse.json({ error: error.message || "Failed to generate blog post" }, { status: 500 })
  }
}
