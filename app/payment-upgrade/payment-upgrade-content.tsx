"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { CheckCircle, Loader2 } from "lucide-react"

export default function PaymentUpgradeContent() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [existingCredits, setExistingCredits] = useState(0)
  const [newTotalCredits, setNewTotalCredits] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const processUpgrade = async () => {
      try {
        // Get URL parameters
        const userId = searchParams.get("user_id")
        const planId = searchParams.get("plan_id")
        const planName = searchParams.get("plan_name")
        const credits = searchParams.get("credits")
        const existingCreditsParam = searchParams.get("existing_credits")
        const newCredits = searchParams.get("new_credits")
        const totalCredits = searchParams.get("total_credits")
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
              existingCreditsParam,
              newCredits,
              totalCredits,
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

        console.log("Processing upgrade with params:", {
          userId,
          planId,
          credits,
          existingCreditsParam,
          newCredits,
          totalCredits,
          billingCycle,
          currency,
        })

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

        // Fetch the user's existing subscription to get current credits
        const { data: existingSubscription, error: subscriptionError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (subscriptionError) {
          setError(`Failed to fetch existing subscription: ${subscriptionError.message}`)
          setLoading(false)
          return
        }

        if (!existingSubscription) {
          setError("No existing subscription found. Please use the regular subscription page.")
          setLoading(false)
          return
        }

        // Set existing credits from the database or from URL parameter
        const currentCredits = existingCreditsParam
          ? Number.parseInt(existingCreditsParam, 10)
          : existingSubscription.credits || 0

        setExistingCredits(currentCredits)

        // Calculate new total credits
        const newCreditsValue = Number.parseInt(credits, 10)
        const calculatedTotalCredits = totalCredits
          ? Number.parseInt(totalCredits, 10)
          : currentCredits + newCreditsValue

        setNewTotalCredits(calculatedTotalCredits)

        setDebugInfo(
          (prev) =>
            `${prev}\n\nExisting subscription: ${JSON.stringify(existingSubscription, null, 2)}\n` +
            `Current credits: ${currentCredits}\n` +
            `New credits to add: ${newCreditsValue}\n` +
            `New total credits: ${calculatedTotalCredits}`,
        )

        // Call the upgrade-plan API route
        try {
          const response = await fetch("/api/upgrade-plan", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: user.id,
              plan_id: planId,
              credits: newCreditsValue,
              existing_credits: currentCredits,
              new_credits: newCreditsValue,
              total_credits: calculatedTotalCredits,
              billing_cycle: billingCycle,
              currency: currency,
              previous_plan_id: existingSubscription.plan_id,
            }),
          })

          const responseData = await response.json()
          setDebugInfo((prev) => `${prev}\n\nAPI response: ${JSON.stringify(responseData, null, 2)}`)

          if (!response.ok) {
            throw new Error(responseData.error || "Failed to upgrade subscription")
          }
        } catch (apiError) {
          setDebugInfo(
            (prev) => `${prev}\n\nAPI error: ${apiError instanceof Error ? apiError.message : String(apiError)}`,
          )
          throw apiError
        }

        setSuccess(true)
        setLoading(false)

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push(
            `/dashboard?user_id=${user.id}&plan=${planId}&credits=${calculatedTotalCredits}&billing_cycle=${billingCycle}&currency=${currency}&upgraded=true`,
          )
        }, 3000)
      } catch (err) {
        console.error("Upgrade processing error:", err)
        if (err instanceof Error) {
          setError(`Failed to process upgrade: ${err.message}`)
        } else {
          setError("An unknown error occurred while processing your upgrade.")
        }
        setDebugInfo((prev) => `${prev}\n\nFinal error: ${err instanceof Error ? err.message : JSON.stringify(err)}`)
        setLoading(false)
      }
    }

    processUpgrade()
  }, [router, searchParams, supabase])

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-[#294fd6] animate-spin mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Upgrade</h1>
          <p className="text-gray-600 text-center">Please wait while we confirm your subscription upgrade...</p>
        </div>
      ) : success ? (
        <div className="flex flex-col items-center">
          <div className="bg-green-50 ring-2 ring-green-200 p-3 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Upgrade Successful!</h1>
          <p className="text-gray-600 text-center mb-4">
            Your subscription has been upgraded successfully. You will be redirected to your dashboard in a moment.
          </p>

          {/* Credit summary */}
          <div className="w-full bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Credit Summary</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-500">Previous Credits</p>
                <p className="text-lg font-semibold text-gray-800">{existingCredits}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Added Credits</p>
                <p className="text-lg font-semibold text-green-600">+{newTotalCredits - existingCredits}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">New Total</p>
                <p className="text-lg font-semibold text-indigo-600">{newTotalCredits}</p>
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-[#294fd6] h-2 animate-progress"></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="bg-red-50 ring-2 ring-red-200 p-3 rounded-full mb-4">
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Upgrade Error</h1>
          <p className="text-red-600 text-center mb-6">{error}</p>
          <button
            onClick={() => router.push("/account")}
            className="bg-[#294fd6] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#294fd6]/80 transition-colors shadow-md hover:shadow-lg"
          >
            Return to Account
          </button>
        </div>
      )}

      {/* Debug information (only shown in development) */}
      {process.env.NODE_ENV === "development" && debugInfo && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs font-mono overflow-auto max-h-64">
          <details>
            <summary className="cursor-pointer font-semibold mb-2">Debug Information</summary>
            <pre className="whitespace-pre-wrap">{debugInfo}</pre>
          </details>
        </div>
      )}
    </>
  )
}
