import { createClient } from "@/utitls/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Create a supabase client with admin privileges
    const supabase = await createClient()

    // Parse the request body
    const { user_id } = await request.json()

    // Validate required fields
    if (!user_id) {
      return NextResponse.json({ error: "Missing required field: user_id is required" }, { status: 400 })
    }

    // Update subscription to mark onboarding as completed
    const { error: subscriptionError } = await supabase
      .from("subscriptions")
      .update({
        onboarding_completed: true,
        website_onboarding_completed: true,
      })
      .eq("user_id", user_id)

    if (subscriptionError) {
      console.error("Error updating subscription onboarding status:", subscriptionError)
      // Continue even if this fails as we'll still try to update the onboarding_status table
    }

    // Update onboarding_status to mark it as completed
    const { data, error } = await supabase.from("onboarding_status").upsert({
      user_id: user_id,
      is_completed: true,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error updating onboarding status:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Unexpected error in update-onboarding API:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}

