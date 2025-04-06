import { NextResponse } from "next/server"
import { createClient } from "@/utitls/supabase/server"

export async function POST(request: Request) {
  try {
    // Use the server client which has elevated permissions
    // Need to await the client creation since it returns a Promise
    const supabase = await createClient()

    // Parse the request body
    let data
    try {
      data = await request.json()
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { subscriptionData, userId } = data

    if (!subscriptionData || !userId) {
      return NextResponse.json({ error: "Missing required data: subscriptionData or userId" }, { status: 400 })
    }

    console.log("Creating subscription for user:", userId)

    // Check if a subscription already exists
    const { data: existingSub, error: checkError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing subscription:", checkError)
    }

    let result
    if (existingSub) {
      // Update existing subscription
      const { data, error: updateError } = await supabase
        .from("subscriptions")
        .update(subscriptionData)
        .eq("user_id", userId)
        .select()

      if (updateError) {
        console.error("Error updating subscription:", updateError)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      result = { updated: true, subscription: data }
    } else {
      // Create new subscription
      const { data, error: insertError } = await supabase.from("subscriptions").insert(subscriptionData).select()

      if (insertError) {
        console.error("Error creating subscription:", insertError)
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }

      result = { created: true, subscription: data }
    }

    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

