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

    // Force update subscription to mark onboarding as completed
    const { error: subscriptionError } = await supabase
      .from("subscriptions")
      .update({
        onboarding_completed: true,
        website_onboarding_completed: true,
      })
      .eq("user_id", user_id)

    if (subscriptionError) {
      console.error("Error updating subscription onboarding status:", subscriptionError)
    }

    // Force update onboarding_status to mark it as completed
    const { error: onboardingError } = await supabase.from("onboarding_status").upsert({
      user_id: user_id,
      is_completed: true,
      updated_at: new Date().toISOString(),
    })

    if (onboardingError) {
      console.error("Error updating onboarding status:", onboardingError)
    }

    return NextResponse.json({ success: true, message: "Onboarding forcefully marked as completed" })
  } catch (error) {
    console.error("Unexpected error in force-complete-onboarding API:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}

