import { NextResponse } from "next/server";
import { createClient } from "@/utitls/supabase/server";
import crypto from "crypto"; // Built-in Node.js module for generating secure keys

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized - No user found" }, { status: 401 });
  }

  console.log("Logged-in user ID:", user.id);

  // Check if API key already exists
  let { data, error } = await supabase
    .from("users_api_keys")
    .select("api_key")
    .eq("user_id", user.id)
    .single();

  if (!data) {
    // Generate a new API key if it doesn't exist
    const newApiKey = crypto.randomBytes(32).toString("hex"); // Generates a secure 64-char key

    const { data: insertData, error: insertError } = await supabase
      .from("users_api_keys")
      .insert([{ user_id: user.id, api_key: newApiKey }])
      .select("api_key")
      .single();

    if (insertError) {
      console.error("Error inserting API key:", insertError);
      return NextResponse.json({ error: "Failed to create API key" }, { status: 500 });
    }

    console.log("New API Key generated:", newApiKey);
    return NextResponse.json({ apiKey: newApiKey });
  }

  console.log("Existing API Key found:", data.api_key);
  return NextResponse.json({ apiKey: data.api_key });
}
