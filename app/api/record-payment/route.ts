import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { user_id, plan_id, credits, billing_cycle, timestamp, amount, currency } = await request.json()

    // Validate required fields
    if (!user_id || !plan_id) {
      return NextResponse.json({ error: "Missing required payment data" }, { status: 400 })
    }

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Verify the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }

    // Ensure the authenticated user matches the requested user ID
    if (user.id !== user_id) {
      return NextResponse.json({ error: "User ID mismatch" }, { status: 403 })
    }

    // Record payment in payment_history
    const paymentData = {
      user_id,
      plan_id,
      amount: amount || null,
      currency: currency || "USD",
      credits: credits || 0,
      billing_cycle: billing_cycle || "monthly",
      payment_date: timestamp || new Date().toISOString(),
      payment_status: "completed",
    }

    const { data, error } = await supabase.from("payment_history").insert(paymentData).select().single()

    if (error) {
      console.error("Error recording payment:", error)
      return NextResponse.json({ error: "Failed to record payment" }, { status: 500 })
    }

    return NextResponse.json({ success: true, payment: data })
  } catch (error) {
    console.error("Payment recording API error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
