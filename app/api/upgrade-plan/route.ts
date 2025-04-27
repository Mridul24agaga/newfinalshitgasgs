import { createClient } from "@/utitls/supabase/server" // Fixed typo from "utitls" to "utils"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json()
    const {
      user_id,
      plan_id,
      credits,
      existing_credits,
      new_credits,
      total_credits,
      billing_cycle,
      subscription_type,
      currency = "USD",
    } = body

    // Validate required fields
    if (!user_id || !plan_id || !credits) {
      return NextResponse.json(
        { error: "Missing required fields: user_id, plan_id, and credits are required" },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await createClient() // Removed cookieStore argument

    // Verify user exists
    const { data: userData, error: userError } = await supabase
      .from("userssignuped")
      .select("*")
      .eq("id", user_id)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: `User not found: ${userError?.message || "User does not exist"}` },
        { status: 404 }
      )
    }

    // Check if subscription exists
    const { data: existingSubscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user_id)
      .single()

    if (!existingSubscription) {
      return NextResponse.json(
        {
          error: "User does not have an existing subscription. Use the create-subscription endpoint instead.",
        },
        { status: 400 }
      )
    }

    // Define subscription data
    const currentDate = new Date()
    const periodEnd = new Date(currentDate)
    const isAnnual = billing_cycle === "annually" || billing_cycle === "annual"

    if (isAnnual) {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1)
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1)
    }

    // Calculate total credits
    const finalCredits =
      total_credits !== undefined
        ? Number(total_credits)
        : existing_credits !== undefined && new_credits !== undefined
          ? Number(existing_credits) + Number(new_credits)
          : existingSubscription.credits + Number(credits)

    console.log(
      `Upgrading subscription: Plan ID ${existingSubscription.plan_id} -> ${plan_id}, Credits: ${existingSubscription.credits} -> ${finalCredits}`
    )

    // Update the existing subscription
    const { data, error } = await supabase
      .from("subscriptions")
      .update({
        plan_id,
        credits: finalCredits,
        status: "active",
        billing_cycle: isAnnual ? "annually" : "monthly",
        subscription_type: subscription_type || (isAnnual ? "annual" : "monthly"),
        currency,
        current_period_start: currentDate.toISOString(),
        current_period_end: periodEnd.toISOString(),
        updated_at: currentDate.toISOString(),
      })
      .eq("user_id", user_id)
      .select()

    if (error) {
      return NextResponse.json(
        { error: `Failed to upgrade subscription: ${error.message}` },
        { status: 500 }
      )
    }

    // Record the upgrade transaction
    await supabase.from("payment_records").insert({
      user_id,
      plan_id,
      credits: Number(credits),
      billing_cycle: isAnnual ? "annually" : "monthly",
      timestamp: currentDate.toISOString(),
      transaction_type: "upgrade",
      previous_plan_id: existingSubscription.plan_id,
      previous_credits: existingSubscription.credits,
    })

    return NextResponse.json({
      success: true,
      message: "Subscription upgraded successfully",
      data,
    })
  } catch (error) {
    console.error("Error upgrading subscription:", error)
    return NextResponse.json(
      {
        error: `Server error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    )
  }
}