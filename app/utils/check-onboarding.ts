import { createClient } from "@/utitls/supabase/client"

export async function checkOnboardingStatus(userId: string) {
  const supabase = createClient()

  try {
    // First check if user has website summaries
    const { data: summaries, error: summariesError } = await supabase
      .from("summary_website_save")
      .select("id")
      .eq("user_id", userId)
      .limit(1)

    if (summaries && summaries.length > 0) {
      return {
        isCompleted: true,
        source: "summaries",
      }
    }

    // If no summaries, check subscription table
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("website_onboarding_completed, onboarding_completed")
      .eq("user_id", userId)
      .single()

    if (subError) {
      if (subError.code === "PGRST116") {
        return {
          isCompleted: false,
          source: "no_subscription",
        }
      }
      throw subError
    }

    return {
      isCompleted: subscription.website_onboarding_completed === true || subscription.onboarding_completed === true,
      source: "subscription",
    }
  } catch (error) {
    console.error("Error checking onboarding status:", error)
    return {
      isCompleted: false,
      source: "error",
      error,
    }
  }
}

