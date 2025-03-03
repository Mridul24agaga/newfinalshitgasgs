"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"

export default function PaymentSuccessPage() {
  const [message, setMessage] = useState("Processing your payment...")
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const updateSubscription = async () => {
      const userId = searchParams.get("user_id")
      const planId = searchParams.get("plan")
      const subscriptionId = searchParams.get("subscription_id")
      const status = searchParams.get("status")

      setDebugInfo(
        `Received params: user_id=${userId}, plan=${planId}, subscription_id=${subscriptionId}, status=${status}`,
      )

      if (!userId || !planId || !subscriptionId || !status) {
        setError("Error: Missing required parameters.")
        setDebugInfo(
          `Missing params: ${!userId ? "user_id " : ""}${!planId ? "plan " : ""}${!subscriptionId ? "subscription_id " : ""}${!status ? "status" : ""}`,
        )
        return
      }

      try {
        // Verify the user exists in the auth.users table
        const { data: user, error: userError } = await supabase.auth.getUser()

        setDebugInfo((prev) => `${prev}\nUser query result: ${JSON.stringify({ user, userError })}`)

        if (userError) {
          throw new Error(`User verification failed: ${userError.message}`)
        }

        if (!user) {
          throw new Error("User not found")
        }

        setDebugInfo((prev) => `${prev}\nUser verified: ${JSON.stringify(user)}`)

        // Prepare subscription data
        const subscriptionData = {
          user_id: userId,
          plan_id: planId,
          dodo_subscription_id: subscriptionId,
          status: status,
          credits: planId === "basic" ? 10 : planId === "pro" ? 30 : 2,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }

        // Update the subscription in your database
        const { error } = await supabase.from("subscriptions").upsert(subscriptionData)

        if (error) throw error

        setMessage(`Payment successful! You've subscribed to the ${planId} plan.`)
        setDebugInfo((prev) => `${prev}\nSubscription updated: ${JSON.stringify(subscriptionData)}`)

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } catch (error) {
        console.error("Error updating subscription:", error)
        setError("There was an error processing your payment. Please contact support.")
        if (error instanceof Error) {
          setDebugInfo((prev) => `${prev}\nError details: ${error.message}\nStack: ${error.stack}`)
        } else {
          setDebugInfo((prev) => `${prev}\nError details: ${JSON.stringify(error)}`)
        }
      }
    }

    updateSubscription()
  }, [searchParams, router, supabase.auth.getUser, supabase.from])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
        {error ? <p className="text-red-600 mb-4">{error}</p> : <p className="mb-4">{message}</p>}
        {!error && <p className="text-sm text-gray-600">Redirecting to dashboard in 2 seconds...</p>}
        {debugInfo && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h2 className="font-bold mb-2">Debug Info:</h2>
            <pre className="whitespace-pre-wrap text-xs">{debugInfo}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

