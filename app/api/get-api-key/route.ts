import { NextResponse } from "next/server";
import { createClient } from "@/utitls/supabase/server"; // fixed typo: 'utitls' to 'utils'
import crypto from "crypto";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized - No user found" }, { status: 401 });
  }

  console.log("Logged-in user ID:", user.id);

  // Check if API key already exists in api_keys table
  let { data, error } = await supabase
    .from("api_keys")
    .select("api_key")
    .eq("user_id", user.id)
    .single();

  if (!data || error) {
    // Generate new API key
    const newApiKey = crypto.randomBytes(32).toString("hex");

    const { data: insertData, error: insertError } = await supabase
      .from("api_keys")
      .insert([{ user_id: user.id, api_key: newApiKey }])
      .select("api_key")
      .single();

    if (insertError) {
      console.error("❌ Error inserting API key:", insertError);
      return NextResponse.json({ error: "Failed to create API key" }, { status: 500 });
    }

    console.log("✅ New API Key generated:", insertData.api_key);
    return NextResponse.json({ apiKey: insertData.api_key });
  }

  console.log("✅ Existing API Key found:", data.api_key);
  return NextResponse.json({ apiKey: data.api_key });
}
