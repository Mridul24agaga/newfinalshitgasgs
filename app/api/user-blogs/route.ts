// app/api/user-blogs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utitls/supabase/server";

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*", // Allow all origins or restrict as needed
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    },
  });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient(); // Remove await if createClient is synchronous

  // Extract API key from headers
  const authHeader = req.headers.get("Authorization");
  console.log("Auth Header:", authHeader);
  const apiKey = authHeader?.replace("Bearer ", "");

  if (!apiKey) {
    console.error("API Key is missing");
    const res = NextResponse.json({ error: "API Key is required" }, { status: 401 });
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  }

  // Validate API key against `users_api_keys` table
  const { data: userApi, error: userError } = await supabase
    .from("users_api_keys")
    .select("user_id")
    .eq("api_key", apiKey)
    .single();

  if (userError || !userApi) {
    console.error("Invalid API Key:", userError);
    const res = NextResponse.json({ error: "Invalid API Key" }, { status: 403 });
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  }

  console.log("User API found:", userApi);

  // Fetch blogs for the authenticated user
  const { data: blogs, error: blogsError } = await supabase
    .from("blogs")
    .select("id, title, blog_post")
    .eq("user_id", userApi.user_id);

  if (blogsError) {
    console.error("Error fetching blogs:", blogsError);
    const res = NextResponse.json({ error: "Error fetching blogs" }, { status: 500 });
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  }

  console.log("Blogs fetched:", blogs);

  // Ensure blogs is an array
  if (!Array.isArray(blogs)) {
    console.error("Unexpected data format for blogs:", blogs);
    const res = NextResponse.json({ error: "Unexpected data format" }, { status: 500 });
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  }

  // Return the blogs with CORS header
  const response = NextResponse.json(blogs);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}
