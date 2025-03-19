"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function PaymentSuccessPage() {
  const [message, setMessage] = useState("Processing your payment...")
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const updateSubscription = async () => {
      try {
        // Get parameters from URL
        const userId = searchParams.get("user_id")
        const planId = searchParams.get("plan")
        const subscriptionId = searchParams.get("subscription_id")
        const status = searchParams.get("status") || "active"

        // New parameters for subscription type
        const billingCycle = searchParams.get("billing_cycle")
        const credits = searchParams.get("credits")
        const monthlyPrice = searchParams.get("monthly_price")
        const annualPrice = searchParams.get("annual_price")
        const annualDiscount = searchParams.get("annual_discount")
        const currency = searchParams.get("currency")

        setDebugInfo(
          `Received params: user_id=${userId}, plan=${planId}, subscription_id=${subscriptionId}, status=${status}, billing_cycle=${billingCycle}, credits=${credits}, monthly_price=${monthlyPrice}, annual_price=${annualPrice}, currency=${currency}`,
        )

        // Check if we have the minimum required parameters
        if (!userId || !planId) {
          setError("Error: Missing required parameters.")
          setDebugInfo(`Missing params: ${!userId ? "user_id " : ""}${!planId ? "plan " : ""}`)
          setIsProcessing(false)
          return
        }

        // Verify the user exists in the auth.users table
        const { data: userData, error: userError } = await supabase.auth.getUser()

        setDebugInfo((prev) => `${prev}\nUser query result: ${JSON.stringify({ userData, userError })}`)

        if (userError) {
          throw new Error(`User verification failed: ${userError.message}`)
        }

        if (!userData || !userData.user) {
          throw new Error("User not found")
        }

        setDebugInfo((prev) => `${prev}\nUser verified: ${JSON.stringify(userData)}`)

        // Determine if this is an annual subscription - ONLY if explicitly set to annual/annually
        // Default to monthly if not specified
        const isAnnual = billingCycle === "annually" || billingCycle === "annual"
        const billingCycleValue = isAnnual ? "annually" : "monthly"
        const subscriptionTypeValue = isAnnual ? "annual" : "monthly"

        setDebugInfo(
          (prev) =>
            `${prev}\nBilling cycle determination: billingCycle=${billingCycle}, isAnnual=${isAnnual}, billingCycleValue=${billingCycleValue}`,
        )

        // Calculate period end based on billing cycle
        const currentDate = new Date()
        const periodEnd = new Date(currentDate)

        if (isAnnual) {
          periodEnd.setFullYear(periodEnd.getFullYear() + 1)
        } else {
          periodEnd.setMonth(periodEnd.getMonth() + 1)
        }

        // Determine credits based on plan or parameter
        let creditAmount = 0
        if (credits) {
          creditAmount = Number.parseInt(credits)
        } else {
          // Fallback to plan-based credits
          creditAmount =
            planId === "basic"
              ? 10
              : planId === "pro"
                ? 30
                : planId === "starter"
                  ? 30
                  : planId === "professional"
                    ? 60
                    : 2
        }

        // Prepare subscription data
        const subscriptionData = {
          user_id: userId,
          plan_id: planId,
          dodo_subscription_id: subscriptionId || null,
          status: status,
          credits: creditAmount,
          billing_cycle: billingCycleValue,
          subscription_type: subscriptionTypeValue,
          monthly_price: monthlyPrice ? Number.parseFloat(monthlyPrice) : null,
          annual_price: annualPrice ? Number.parseFloat(annualPrice) : null,
          annual_discount_percentage: annualDiscount ? Number.parseInt(annualDiscount) : 20,
          currency: currency || "USD",
          current_period_start: currentDate.toISOString(),
          current_period_end: periodEnd.toISOString(),
        }

        setDebugInfo((prev) => `${prev}\nPrepared subscription data: ${JSON.stringify(subscriptionData)}`)

        // Update the subscription in your database
        const { error } = await supabase.from("subscriptions").upsert(subscriptionData)

        if (error) throw error

        setMessage(
          `Payment successful! You've subscribed to the ${planId} plan on a ${isAnnual ? "yearly" : "monthly"} billing cycle.`,
        )
        setDebugInfo((prev) => `${prev}\nSubscription updated: ${JSON.stringify(subscriptionData)}`)
        setSuccess(true)
        setIsProcessing(false)

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } catch (error) {
        console.error("Error updating subscription:", error)
        setError("There was an error processing your payment. Please contact support.")
        setIsProcessing(false)

        if (error instanceof Error) {
          setDebugInfo((prev) => `${prev}\nError details: ${error.message}\nStack: ${error.stack}`)
        } else {
          setDebugInfo((prev) => `${prev}\nError details: ${JSON.stringify(error)}`)
        }
      }
    }

    updateSubscription()
  }, [searchParams, router, supabase])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="bg-red-100 p-3 rounded-full inline-flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Return to Dashboard
            </button>

            {debugInfo && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
                <h3 className="font-bold mb-2 text-sm">Debug Info:</h3>
                <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-60">{debugInfo}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-full inline-flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>

            {debugInfo && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
                <h3 className="font-bold mb-2 text-sm">Debug Info:</h3>
                <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-60">{debugInfo}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-orange-500 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Your Payment</h2>
          <p className="text-gray-600">Please wait while we activate your subscription...</p>

          {debugInfo && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
              <h3 className="font-bold mb-2 text-sm">Debug Info:</h3>
              <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-60">{debugInfo}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

