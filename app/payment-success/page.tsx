"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { CheckCircle, Loader2, AlertCircle } from "lucide-react"

// Define interface for API response
interface ApiResponse {
  error?: string
  [key: string]: any
}

export default function PaymentSuccessPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
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
        const paymentStatus = searchParams.get("payment_status")

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
              paymentStatus,
            },
            null,
            2,
          )}`,
        )

        // Check if payment status indicates a failure
        if (paymentStatus === "failed") {
          setError("Your payment has failed. Please try again.")
          setLoading(false)
          setTimeout(() => router.push("/payment"), 3000)
          return
        }

        if (!userId || !planId || !credits) {
          setError("Missing required payment information. Please contact support.")
          setLoading(false)
          setTimeout(() => router.push("/payment"), 3000)
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
          setTimeout(() => router.push("/payment"), 3000)
          return
        }

        if (!user) {
          setError("You must be logged in to complete this process.")
          setLoading(false)
          setTimeout(() => router.push("/payment"), 3000)
          return
        }

        if (user.id !== userId) {
          setError("User ID mismatch. Please contact support.")
          setLoading(false)
          setTimeout(() => router.push("/payment"), 3000)
          return
        }

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

        // Try to create or update the subscription using the API with retry logic
        let apiSuccess = false
        let apiResponse: ApiResponse | null = null
        let apiError = null

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
              apiResponse = JSON.parse(responseText)
              apiError = apiResponse?.error || "Failed to create subscription"

              // Check if this is a dodopayment failure
              if (apiError.includes("dodopayment") || apiError.includes("payment") || apiError.includes("failed")) {
                // If we've already retried, show the error
                if (retryCount >= 2) {
                  throw new Error(apiError)
                }

                // Otherwise, increment retry count and try again after a delay
                setRetryCount((prev) => prev + 1)
                setDebugInfo((prev) => `${prev}\n\nRetrying API call (${retryCount + 1}/3)...`)

                // Wait 2 seconds before retrying
                await new Promise((resolve) => setTimeout(resolve, 2000))

                // Retry the API call
                processPayment()
                return
              } else {
                throw new Error(apiError)
              }
            } catch (jsonError) {
              throw new Error(`API error: ${responseText}`)
            }
          }

          // Try to parse the response as JSON
          try {
            apiResponse = JSON.parse(responseText)
            apiSuccess = true
            setDebugInfo((prev) => `${prev}\n\nAPI response parsed: ${JSON.stringify(apiResponse, null, 2)}`)
          } catch (e) {
            setDebugInfo((prev) => `${prev}\n\nCouldn't parse API response as JSON`)
            // Continue anyway since the response was ok
            apiSuccess = true
          }
        } catch (apiError) {
          setDebugInfo(
            (prev) => `${prev}\n\nAPI error: ${apiError instanceof Error ? apiError.message : String(apiError)}`,
          )

          // Check if the error is related to dodopayment
          const errorMessage = apiError instanceof Error ? apiError.message : String(apiError)
          if (
            errorMessage.toLowerCase().includes("dodopayment") ||
            errorMessage.toLowerCase().includes("payment failed")
          ) {
            // If we've already retried multiple times, show the error
            if (retryCount >= 2) {
              setError("Your payment has failed after multiple attempts. Please try again.")
              setLoading(false)
              setTimeout(() => router.push("/payment"), 3000)
              return
            }

            // Otherwise, increment retry count and try again after a delay
            setRetryCount((prev) => prev + 1)
            setDebugInfo((prev) => `${prev}\n\nRetrying after payment error (${retryCount + 1}/3)...`)

            // Wait 2 seconds before retrying
            await new Promise((resolve) => setTimeout(resolve, 2000))

            // Retry the entire process
            processPayment()
            return
          }

          throw apiError
        }

        // If we got here, the API call was successful
        // Continue with updating onboarding status and recording payment

        // Also update onboarding_status to mark it as completed
        try {
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
          // Continue anyway - this is not critical
        }

        // Record the payment success
        try {
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
            // Continue anyway - this is not critical
          } else {
            setDebugInfo((prev) => `${prev}\n\nRecorded payment success via API route`)
          }
        } catch (paymentRecordError) {
          console.error("Error recording payment success:", paymentRecordError)
          setDebugInfo(
            (prev) =>
              `${prev}\n\nException recording payment: ${paymentRecordError instanceof Error ? paymentRecordError.message : "Unknown error"}`,
          )
          // Continue anyway - this is not critical
        }

        // Show success and redirect
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
        const errorMessage = err instanceof Error ? err.message : String(err)

        // Check if this is a dodopayment failure
        if (
          errorMessage.toLowerCase().includes("dodopayment") ||
          errorMessage.toLowerCase().includes("payment failed")
        ) {
          // If we've already retried multiple times, show the error
          if (retryCount >= 2) {
            setError("Your payment has failed after multiple attempts. Please try again.")
            setLoading(false)
            setTimeout(() => router.push("/payment"), 3000)
            return
          }

          // Otherwise, increment retry count and try again after a delay
          setRetryCount((prev) => prev + 1)
          setDebugInfo((prev) => `${prev}\n\nRetrying after general error (${retryCount + 1}/3)...`)

          // Wait 2 seconds before retrying
          await new Promise((resolve) => setTimeout(resolve, 2000))

          // Retry the entire process
          processPayment()
          return
        } else if (err instanceof Error) {
          setError(`Failed to process payment: ${err.message}`)
        } else {
          setError("An unknown error occurred while processing your payment.")
        }

        setDebugInfo((prev) => `${prev}\n\nFinal error: ${err instanceof Error ? err.message : JSON.stringify(err)}`)
        setLoading(false)

        // For payment failures, redirect to payment page after 3 seconds
        if (
          errorMessage.toLowerCase().includes("dodopayment") ||
          errorMessage.toLowerCase().includes("payment failed")
        ) {
          setTimeout(() => {
            router.push("/payment")
          }, 3000)
        }
      }
    }

    processPayment()
  }, [router, searchParams, supabase, retryCount])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-8 max-w-md w-full">
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-[#294fd6] animate-spin mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {retryCount > 0 ? `Processing Your Payment (Attempt ${retryCount + 1}/3)` : "Processing Your Payment"}
            </h1>
            <p className="text-gray-600 text-center">Please wait while we confirm your subscription details...</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center">
            <div className="bg-green-50 ring-2 ring-green-200 p-3 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 text-center mb-6">
              Your subscription has been activated successfully. You will be redirected to your dashboard in a moment.
            </p>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#294fd6] h-2 animate-progress"></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-red-50 ring-2 ring-red-200 p-3 rounded-full mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h1>
            <p className="text-red-600 text-center mb-6">{error}</p>
            <p className="text-gray-600 text-center mb-4">You will be redirected to the payment page in a moment.</p>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#294fd6] h-2 animate-progress"></div>
            </div>
            <button
              onClick={() => router.push("/payment")}
              className="bg-[#294fd6] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#294fd6]/80 transition-colors shadow-md hover:shadow-lg mt-4"
            >
              Return to Payment
            </button>
          </div>
        )}
      </div>

      {/* Add a manual retry button for users experiencing issues */}
      {loading && retryCount > 0 && (
        <button onClick={() => setRetryCount((prev) => prev + 1)} className="mt-4 text-[#294fd6] underline">
          Click to retry manually
        </button>
      )}
    </div>
  )
}
