import { NextResponse } from "next/server"
import { createClient } from "@/utitls/supabase/server"
import crypto from "crypto"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized - No user found" }, { status: 401 })
    }

    console.log("Logged-in user ID:", user.id)

    // Check if API key already exists in api_keys table
    // Don't use .single() here to avoid errors
    const { data, error } = await supabase.from("api_keys").select("api_key").eq("user_id", user.id)

    if (error) {
      console.error("Error fetching API key:", error)
      return NextResponse.json({ error: "Failed to retrieve API key" }, { status: 500 })
    }

    // If no API key exists or no data returned, generate a new one
    if (!data || data.length === 0) {
      // Generate new API key
      const newApiKey = crypto.randomBytes(32).toString("hex")

      const { data: insertData, error: insertError } = await supabase
        .from("api_keys")
        .insert([{ user_id: user.id, api_key: newApiKey }])
        .select("api_key")

      if (insertError) {
        console.error("❌ Error inserting API key:", insertError)
        return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
      }

      if (!insertData || insertData.length === 0) {
        return NextResponse.json({ error: "Failed to retrieve newly created API key" }, { status: 500 })
      }

      console.log("✅ New API Key generated:", insertData[0].api_key.substring(0, 10) + "...")
      return NextResponse.json({ apiKey: insertData[0].api_key })
    }

    console.log("✅ Existing API Key found:", data[0].api_key.substring(0, 10) + "...")
    return NextResponse.json({ apiKey: data[0].api_key })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
