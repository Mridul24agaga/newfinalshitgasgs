import { NextResponse } from "next/server"
import { generateBlog } from "@/app/actions"

// Test endpoint to manually trigger blog generation (for debugging)
export async function POST(request: Request) {
  try {
    const { scheduleId, websiteUrl } = await request.json()

    if (!websiteUrl) {
      return NextResponse.json({ error: "Website URL is required" }, { status: 400 })
    }

    console.log(`🧪 Testing blog generation for schedule ${scheduleId}`)
    console.log(`🔗 Website URL: ${websiteUrl}`)
    console.log(`🤖 Calling generateBlog("${websiteUrl}")`)

    const startTime = Date.now()
    const result = await generateBlog(websiteUrl)
    const endTime = Date.now()

    console.log(`⏱️ Blog generation took ${endTime - startTime}ms`)
    console.log("📝 Result:", result)

    return NextResponse.json({
      success: true,
      result,
      execution_time_ms: endTime - startTime,
      message: "Blog generation test completed successfully! 🎉",
      action_called: "generateBlog",
      website_url: websiteUrl,
    })
  } catch (error) {
    console.error("❌ Test execution failed:", error)
    return NextResponse.json(
      {
        error: "Test execution failed",
        message: String(error),
        action_attempted: "generateBlog",
      },
      { status: 500 },
    )
  }
}
