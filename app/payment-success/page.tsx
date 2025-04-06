"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { CheckCircle, Loader2 } from "lucide-react"

export default function PaymentSuccessPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get URL parameters
        const userId = searchParams.get("user_id")
        const planId = searchParams.get("plan_id")
        const planName = searchParams.get("plan_name")
        const credits = searchParams.get("credits")
        const billingCycle = searchParams.get("billing_cycle") || "monthly"
        const currency = searchParams.get("currency") || "USD"
        const subscriptionId = searchParams.get("subscription_id")
        const status = searchParams.get("status")

        setDebugInfo(
          `URL params: ${JSON.stringify(
            {
              userId,
              planId,
              planName,
              credits,
              billingCycle,
              currency,
              subscriptionId,
              status,
            },
            null,
            2,
          )}`,
        )

        if (!userId || !planId || !credits) {
          setError("Missing required payment information. Please contact support.")
          setLoading(false)
          return
        }

        console.log("Processing payment success with params:", { userId, planId, credits, billingCycle, currency })

        // Check if the authenticated user matches the userId in the URL
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError) {
          setError(`Authentication error: ${authError.message}`)
          setLoading(false)
          return
        }

        if (!user) {
          setError("You must be logged in to complete this process.")
          setLoading(false)
          return
        }

        if (user.id !== userId) {
          setError("User ID mismatch. Please contact support.")
          setLoading(false)
          return
        }

        // Debug authentication state
        console.log("Authenticated user:", user)
        setDebugInfo((prev) => `${prev}\n\nAuthenticated user: ${JSON.stringify(user, null, 2)}`)

        // Define subscription data
        const currentDate = new Date()
        const periodEnd = new Date(currentDate)
        const isAnnual = billingCycle === "annually" || billingCycle === "annual"

        if (isAnnual) {
          periodEnd.setFullYear(periodEnd.getFullYear() + 1)
        } else {
          periodEnd.setMonth(periodEnd.getMonth() + 1)
        }

        // Get price information from URL parameters and ensure they're proper numbers
        const monthlyPrice = searchParams.get("monthly_price")
          ? Number.parseInt(searchParams.get("monthly_price")!, 10) || undefined
          : undefined

        const annualPrice = searchParams.get("annual_price")
          ? Number.parseInt(searchParams.get("annual_price")!, 10) || undefined
          : undefined

        // Convert discount percentage to integer (round to nearest whole number)
        const annualDiscount = searchParams.get("annual_discount")
          ? Math.round(Number(searchParams.get("annual_discount")))
          : undefined

        const subscriptionData = {
          user_id: user.id,
          plan_id: planId,
          credits: Number.parseInt(credits),
          status: status || "active",
          billing_cycle: isAnnual ? "annually" : "monthly",
          subscription_type: isAnnual ? "annual" : "monthly",
          currency: currency,
          current_period_start: currentDate.toISOString(),
          current_period_end: periodEnd.toISOString(),
          onboarding_completed: true,
          website_onboarding_completed: true,
          monthly_price: monthlyPrice,
          annual_price: annualPrice,
          annual_discount_percentage: annualDiscount,
        }

        setDebugInfo((prev) => `${prev}\n\nSubscription data: ${JSON.stringify(subscriptionData, null, 2)}`)

        // Try to create or update the subscription using the API
        try {
          const response = await fetch("/api/create-subscription", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subscriptionData,
              userId: user.id,
            }),
          })

          const responseText = await response.text()
          setDebugInfo((prev) => `${prev}\n\nAPI response: ${responseText}`)

          if (!response.ok) {
            try {
              const errorData = JSON.parse(responseText)
              throw new Error(errorData.error || "Failed to create subscription")
            } catch (jsonError) {
              throw new Error(`API error: ${responseText}`)
            }
          }

          // Try to parse the response as JSON
          try {
            const responseData = JSON.parse(responseText)
            setDebugInfo((prev) => `${prev}\n\nAPI response parsed: ${JSON.stringify(responseData, null, 2)}`)
          } catch (e) {
            setDebugInfo((prev) => `${prev}\n\nCouldn't parse API response as JSON`)
          }
        } catch (apiError) {
          setDebugInfo(
            (prev) => `${prev}\n\nAPI error: ${apiError instanceof Error ? apiError.message : String(apiError)}`,
          )
          throw apiError
        }

        // Also update onboarding_status to mark it as completed
        try {
          // Use the existing API route for this
          const onboardingResponse = await fetch("/api/update-onboarding", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: user.id }),
          })

          if (!onboardingResponse.ok) {
            setDebugInfo((prev) => `${prev}\n\nError updating onboarding status via API route`)
          } else {
            setDebugInfo((prev) => `${prev}\n\nUpdated onboarding status successfully via API route`)
          }
        } catch (onboardingError) {
          console.error("Error updating onboarding status:", onboardingError)
          setDebugInfo(
            (prev) =>
              `${prev}\n\nException updating onboarding: ${onboardingError instanceof Error ? onboardingError.message : "Unknown error"}`,
          )
        }

        // Record the payment success
        try {
          // Use the existing API route for this
          const paymentRecordResponse = await fetch("/api/record-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: user.id,
              plan_id: planId,
              credits: Number.parseInt(credits),
              billing_cycle: billingCycle,
              timestamp: currentDate.toISOString(),
            }),
          })

          if (!paymentRecordResponse.ok) {
            setDebugInfo((prev) => `${prev}\n\nError recording payment success via API route`)
          } else {
            setDebugInfo((prev) => `${prev}\n\nRecorded payment success via API route`)
          }
        } catch (paymentRecordError) {
          console.error("Error recording payment success:", paymentRecordError)
          setDebugInfo(
            (prev) =>
              `${prev}\n\nException recording payment: ${paymentRecordError instanceof Error ? paymentRecordError.message : "Unknown error"}`,
          )
        }

        setSuccess(true)
        setLoading(false)

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push(
            `/dashboard?user_id=${user.id}&plan=${planId}&credits=${credits}&billing_cycle=${billingCycle}&currency=${currency}`,
          )
        }, 3000)
      } catch (err) {
        console.error("Payment processing error:", err)
        if (err instanceof Error) {
          setError(`Failed to process payment: ${err.message}`)
        } else {
          setError("An unknown error occurred while processing your payment.")
        }
        setDebugInfo((prev) => `${prev}\n\nFinal error: ${err instanceof Error ? err.message : JSON.stringify(err)}`)
        setLoading(false)
      }
    }

    processPayment()
  }, [router, searchParams, supabase])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Payment</h1>
            <p className="text-gray-600 text-center">Please wait while we confirm your subscription details...</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 text-center mb-6">
              Your subscription has been activated successfully. You will be redirected to your dashboard in a moment.
            </p>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-2 animate-progress"></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h1>
            <p className="text-red-600 text-center mb-6">{error}</p>
            <button
              onClick={() => router.push("/upgrade")}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {debugInfo && (
          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg overflow-auto max-h-96">
            <p className="text-sm font-mono text-gray-600 whitespace-pre-wrap">{debugInfo}</p>
          </div>
        )}
      </div>
    </div>
  )
}

