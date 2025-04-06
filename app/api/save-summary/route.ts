import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client (server-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json()
    const { url, summary } = body

    if (!url || !summary) {
      return NextResponse.json({ error: "URL and summary are required" }, { status: 400 })
    }

    // Get the current user from the session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Session error:", sessionError.message)
      return NextResponse.json({ error: "Authentication error" }, { status: 401 })
    }

    if (!sessionData.session || !sessionData.session.user) {
      console.error("No authenticated user found")
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const userId = sessionData.session.user.id

    // Insert the summary into the database
    const { error: insertError } = await supabase.from("summary_website_save").insert({
      user_id: userId,
      website_url: url,
      summary: summary,
      created_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Insert error:", insertError.message)
      return NextResponse.json({ error: `Failed to save summary: ${insertError.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Summary saved successfully" })
  } catch (error: any) {
    console.error("Error in save-summary API route:", error.message)
    return NextResponse.json({ error: "Failed to save summary", details: error.message }, { status: 500 })
  }
}

