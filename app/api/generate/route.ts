import { NextResponse } from "next/server";
import { generateBlog } from "../../actions";

export async function POST(request: Request) {
  const { url, humanizeLevel } = await request.json();

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    console.log(`Starting blog generation for URL: ${url}`);
    const blogPosts = await generateBlog(url, humanizeLevel || "normal");

    if (!blogPosts || blogPosts.length === 0) {
      return NextResponse.json({ error: "No blog posts generated" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      blogPosts: blogPosts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.blog_post,
        citations: post.citations,
        timestamp: post.timestamp,
        reveal_date: post.reveal_date,
      })),
    });
  } catch (error: any) {
    console.error("Blog generation error:", error.message);
    return NextResponse.json({ error: `Blog generation failed: ${error.message}` }, { status: 500 });
  }
}

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes timeout