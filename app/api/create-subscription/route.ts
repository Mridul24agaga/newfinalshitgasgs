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

    // Check if dodopayment was successful
    const dodopaymentStatus = await checkDodopaymentStatus(userId, subscriptionData.plan_id)

    if (dodopaymentStatus === "failed") {
      return NextResponse.json({ error: "dodopayment failed", status: "failed" }, { status: 400 })
    } else if (dodopaymentStatus === "pending") {
      // For pending payments, you might want to create the subscription but mark it as pending
      // or handle it according to your business logic
      console.log("Payment is pending verification - proceeding with caution")

      // Option 1: Fail the request and ask user to try again later
      // return NextResponse.json({ error: "Payment is still processing. Please try again later.", status: "pending" }, { status: 202 });

      // Option 2: Continue but mark the subscription as pending
      subscriptionData.status = "pending"
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

// Fixed implementation with proper TypeScript error handling
async function checkDodopaymentStatus(userId: string, planId: string): Promise<string> {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.DODOPAYMENT_API_KEY

    if (!apiKey) {
      console.error("Missing DODOPAYMENT_API_KEY environment variable")
      throw new Error("Payment verification configuration error")
    }

    // Construct the API URL - adjust this to match your actual dodopayment API endpoint
    const apiUrl = `${process.env.DODOPAYMENT_API_URL || "https://api.dodopayment.com"}/v1/payments/verify`

    // Make the API call to verify the payment
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-Api-Version": "2023-01-01",
      },
      body: JSON.stringify({
        user_id: userId,
        plan_id: planId,
        // Include any other required parameters for your payment verification
        verification_type: "subscription",
        timestamp: new Date().toISOString(),
      }),
      // Set a reasonable timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    // Check if the request was successful
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Dodopayment API error (${response.status}):`, errorText)

      // If we get a specific error code that indicates payment failure, return "failed"
      if (response.status === 402 || response.status === 400) {
        return "failed"
      }

      // For other API errors, throw an exception to be caught by the caller
      throw new Error(`Payment verification API error: ${response.status}`)
    }

    // Parse the response
    const data = await response.json()

    // Log the response for debugging
    console.log("Dodopayment verification response:", data)

    // Check the payment status from the response
    // Adjust this logic based on your actual API response structure
    if (data.status === "successful" || data.status === "completed" || data.status === "active") {
      return "success"
    } else if (data.status === "pending") {
      // For pending payments, you might want to handle differently
      // For now, we'll treat pending as not yet successful
      return "pending"
    } else {
      // Any other status is considered a failure
      return "failed"
    }
  } catch (error: unknown) {
    // Log the error
    console.error("Error verifying payment with dodopayment:", error)

    // Properly type check the error before accessing properties
    if (error instanceof TypeError || (error instanceof Error && error.name === "AbortError")) {
      console.warn("Network error during payment verification - treating as pending")
      return "pending"
    }

    // For other errors, assume failure
    return "failed"
  }
}
