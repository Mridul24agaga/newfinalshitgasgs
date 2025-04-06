import { createClient } from "@/utitls/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Create a supabase client with admin privileges
    const supabase = await createClient()

    // Parse the request body
    const subscriptionData = await request.json()

    // Validate required fields
    if (!subscriptionData.user_id || !subscriptionData.plan_id) {
      return NextResponse.json({ error: "Missing required fields: user_id and plan_id are required" }, { status: 400 })
    }

    // Check if a subscription already exists for this user
    const { data: existingSub, error: checkError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", subscriptionData.user_id)
      .maybeSingle()

    let result

    if (existingSub) {
      // Update existing subscription
      const { data, error } = await supabase
        .from("subscriptions")
        .update(subscriptionData)
        .eq("user_id", subscriptionData.user_id)
        .select()

      if (error) {
        console.error("Error updating subscription:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      result = data
    } else {
      // Insert new subscription
      const { data, error } = await supabase.from("subscriptions").insert(subscriptionData).select()

      if (error) {
        console.error("Error creating subscription:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      result = data
    }

    // Also update onboarding_status to mark it as completed
    const { error: onboardingError } = await supabase.from("onboarding_status").upsert({
      user_id: subscriptionData.user_id,
      is_completed: true,
      updated_at: new Date().toISOString(),
    })

    if (onboardingError) {
      console.error("Error updating onboarding status:", onboardingError)
      // Continue even if this fails as the subscription was updated successfully
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Unexpected error in update-subscription API:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}

