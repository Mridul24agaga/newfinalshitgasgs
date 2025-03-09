// Site A: app/api/test-blog-fetch/route.ts
"use server";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const blogId = searchParams.get("id"); // Get the blog id from the query parameter
  const apiKey = searchParams.get("apiKey") || req.headers.get("x-api-key"); // Get the API key from query or header

  if (!blogId) {
    return NextResponse.json({ message: "Blog ID is required, asshole!" }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({ message: "API key is required, bro!" }, { status: 401 });
  }

  try {
    // Call the /api/blogs-by-id endpoint
    const response = await fetch(`https://blogosocial.com/api/blogs-by-id?id=${blogId}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const blogData = await response.json();
    return NextResponse.json({
      message: "Endpoint is working, hell yeah!",
      blogData,
    });
  } catch (err: unknown) {
    console.error(`Error testing endpoint: ${err instanceof Error ? err.message : String(err)}`);
    return NextResponse.json({
      message: `Endpoint test failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      success: false,
    }, { status: 500 });
  }
}