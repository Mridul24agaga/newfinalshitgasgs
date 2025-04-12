import { NextResponse } from "next/server";
import { generateBlog } from "@/app/headlinetoblog";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { url, headline, humanizeLevel } = await request.json();

    // Validate inputs
    if (!url || typeof url !== "string") {
      console.error("Invalid URL:", url);
      return NextResponse.json({ error: "URL is required and must be a string" }, { status: 400 });
    }

    if (!headline || typeof headline !== "string") {
      console.error("Invalid headline:", headline);
      return NextResponse.json({ error: "Headline is required and must be a string" }, { status: 400 });
    }

    // Validate humanizeLevel (optional, defaults to "normal")
    const validHumanizeLevels = ["normal", "hardcore"];
    const selectedHumanizeLevel = humanizeLevel && validHumanizeLevels.includes(humanizeLevel) ? humanizeLevel : "normal";

    console.log(`Starting blog generation for URL: ${url}, Headline: ${headline}, Humanize Level: ${selectedHumanizeLevel}`);

    // Call the generateBlog function
    const blogPosts = await generateBlog(url, headline, selectedHumanizeLevel);

    // Check if blog posts were generated
    if (!blogPosts || blogPosts.length === 0) {
      console.error("No blog posts generated");
      return NextResponse.json({ error: "No blog posts were generated" }, { status: 500 });
    }

    // Format the response
    const response = {
      success: true,
      blogPosts: blogPosts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.blog_post,
        citations: post.citations,
        timestamp: post.timestamp,
        reveal_date: post.reveal_date,
        url: post.url,
        is_blurred: post.is_blurred,
        needs_formatting: post.needs_formatting,
      })),
    };

    console.log(`Successfully generated ${blogPosts.length} blog post(s)`);
    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {
    console.error("Blog generation error:", error.message);
    return NextResponse.json(
      { error: `Blog generation failed: ${error.message}` },
      { status: 500 }
    );
  }
}

// Specify runtime and max duration
export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes timeout