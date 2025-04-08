import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utitls/supabase/server"; // make sure this is correct

export async function GET(req: NextRequest) {
  const supabase = await createClient(); // ✅ Await the promise

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "You need to be logged in to view your blogs." }, { status: 401 });
  }

  const userId = user.id;

  const { data: blogs, error: blogsError } = await supabase
    .from("blogs")
    .select("id, title, blog_post")
    .eq("user_id", userId);

  if (blogsError) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }

  const { data: headlinetoblog, error: hlError } = await supabase
    .from("headlinetoblog")
    .select("id, title, blog_post")
    .eq("user_id", userId);

  if (hlError) {
    return NextResponse.json({ error: "Failed to fetch headlinetoblog" }, { status: 500 });
  }

  return NextResponse.json({
    blogs: blogs || [],
    headlinetoblog: headlinetoblog || [],
  });
}
