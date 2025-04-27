import { type NextRequest, NextResponse } from "next/server"
import { generateBlog } from "@/app/actions"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Validate URL format
    let validatedUrl: string
    try {
      validatedUrl = new URL(url.startsWith("http") ? url : `https://${url}`).toString()
    } catch (e) {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    console.log(`API: Generating blog for URL: ${validatedUrl}`)

    // Call the existing generateBlog function from actions.ts
    const result = await generateBlog(validatedUrl)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error in generate API route:", error)

    // Return appropriate error response
    return NextResponse.json(
      {
        error: error.message || "Failed to generate blog",
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
