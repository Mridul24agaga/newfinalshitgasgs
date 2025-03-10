import { NextResponse } from "next/server"
import { createClient } from "@/utitls/supabase/server"
import crypto from "crypto"

// Generate a new API key
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get the current user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the name for the API key from the request
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "API key name is required" }, { status: 400 })
    }

    // Generate a random API key
    const apiKey = `sk_${crypto.randomBytes(24).toString("hex")}`

    // Insert the API key into the database
    const { data, error } = await supabase
      .from("keys")
      .insert({
        key: apiKey,
        user_id: session.user.id,
        name,
      })
      .select("id, key, name, created_at, expires_at")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ apiKey: data })
  } catch (error) {
    console.error("Error creating API key:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// Get all API keys for the current user
export async function GET() {
  try {
    const supabase = await createClient()

    // Get the current user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all API keys for the current user
    const { data, error } = await supabase
      .from("keys")
      .select("id, key, name, created_at, expires_at, last_used_at")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ apiKeys: data })
  } catch (error) {
    console.error("Error fetching API keys:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

