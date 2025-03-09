// Site A: app/api/blogs-by-id/route.ts
"use server";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utitls/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const apiKey = req.headers.get("x-api-key");
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!apiKey) {
    return NextResponse.json({ message: "API key required, bro!" }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ message: "Blog ID is required, asshole!" }, { status: 400 });
  }

  // Validate API key against api_control
  const { data: apiControl, error: apiError } = await supabase
    .from("api_control")
    .select("user_id")
    .eq("api_key", apiKey)
    .single();

  if (apiError || !apiControl) {
    return NextResponse.json({ message: "Invalid API key, man!" }, { status: 401 });
  }

  // Fetch the blog, ensuring user_id matches
  const { data: blog, error: blogError } = await supabase
    .from("blogs")
    .select("id, title, blog_post, citations, created_at, timestamp, reveal_date, url, wordpress_post_id")
    .eq("id", id)
    .eq("user_id", apiControl.user_id)
    .single();

  if (blogError) {
    return NextResponse.json({ message: `Shit went wrong: ${blogError.message}` }, { status: 500 });
  }

  if (!blog) {
    return NextResponse.json({ message: "Blog not found or you don’t own it, dude!" }, { status: 404 });
  }

  // Log usage (optional, add last_used column if needed)
  await supabase
    .from("api_control")
    .update({ last_used: new Date().toISOString() })
    .eq("api_key", apiKey);

  return NextResponse.json(blog);
}