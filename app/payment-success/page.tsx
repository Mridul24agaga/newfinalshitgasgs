"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [debugInfo, setDebugInfo] = useState<Record<string, any> | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get URL parameters
        const userId = searchParams.get("user_id")
        const planId = searchParams.get("plan_id")
        const planName = searchParams.get("plan_name")
        const existingCredits = searchParams.get("existing_credits")
        const newCredits = searchParams.get("new_credits")
        const totalCredits = searchParams.get("total_credits")
        const billingCycle = searchParams.get("billing_cycle") || "monthly"
        const currency = searchParams.get("currency") || "USD"
        const subscriptionId = searchParams.get("subscription_id")
        const status = searchParams.get("status") || "active"
        const price = searchParams.get("price")

        // Collect all parameters for debugging
        const allParams = Object.fromEntries([...searchParams.entries()])
        setDebugInfo(allParams)

        // Validate required parameters
        if (!userId || !planId || !totalCredits) {
          console.error("Missing required parameters:", { userId, planId, totalCredits })
          setError("Missing required payment information. Please contact support.")
          setLoading(false)
          return
        }

        console.log("Processing payment success with params:", {
          userId,
          planId,
          existingCredits,
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
          console.error("Authentication error:", authError)
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
          console.error("User ID mismatch:", { urlUserId: userId, authUserId: user.id })
          setError("User ID mismatch. Please contact support.")
          setLoading(false)
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

        // Get price information from URL parameters
        const monthlyPrice = searchParams.get("monthly_price")
          ? Number.parseFloat(searchParams.get("monthly_price")!)
          : undefined

        const annualPrice = searchParams.get("annual_price")
          ? Number.parseFloat(searchParams.get("annual_price")!)
          : undefined

        const annualDiscount = searchParams.get("annual_discount")
          ? Number.parseInt(searchParams.get("annual_discount")!, 10)
          : undefined

        const subscriptionData = {
          user_id: user.id,
          plan_id: planId,
          credits: Number.parseInt(totalCredits, 10),
          status: status,
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
          price: price ? Number.parseFloat(price) : undefined,
        }

        console.log("Subscription data:", subscriptionData)

        // First, check if subscription already exists
        const { data: existingSubscription, error: subCheckError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle()

        if (subCheckError) {
          console.error("Error checking existing subscription:", subCheckError)
        }

        // Update or insert subscription directly with Supabase
        let subscriptionResult
        if (existingSubscription) {
          // Update existing subscription
          const { data, error: updateError } = await supabase
            .from("subscriptions")
            .update(subscriptionData)
            .eq("user_id", user.id)
            .select()
            .single()

          if (updateError) {
            console.error("Error updating subscription:", updateError)
            throw new Error(`Failed to update subscription: ${updateError.message}`)
          }

          subscriptionResult = data
        } else {
          // Insert new subscription
          const { data, error: insertError } = await supabase
            .from("subscriptions")
            .insert(subscriptionData)
            .select()
            .single()

          if (insertError) {
            console.error("Error creating subscription:", insertError)
            throw new Error(`Failed to create subscription: ${insertError.message}`)
          }

          subscriptionResult = data
        }

        console.log("Subscription saved:", subscriptionResult)

        // Update onboarding status
        const { error: onboardingError } = await supabase
          .from("userssignuped")
          .update({
            onboarding_completed: true,
            website_onboarding_completed: true,
          })
          .eq("user_id", user.id)

        if (onboardingError) {
          console.warn("Error updating onboarding status:", onboardingError)
        }

        // Record payment in payment_history
        const paymentData = {
          user_id: user.id,
          plan_id: planId,
          amount: price ? Number.parseFloat(price) : null,
          currency: currency,
          credits: Number.parseInt(newCredits || totalCredits, 10),
          billing_cycle: billingCycle,
          payment_date: currentDate.toISOString(),
          payment_status: "completed",
        }

        const { error: paymentError } = await supabase.from("payment_history").insert(paymentData)

        if (paymentError) {
          console.warn("Error recording payment:", paymentError)
        }

        setSuccess(true)
        setLoading(false)

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
      } catch (err) {
        console.error("Payment processing error:", err)
        if (err instanceof Error) {
          setError(`Failed to process payment: ${err.message}`)
        } else {
          setError("An unknown error occurred while processing your payment.")
        }
        setLoading(false)
      }
    }

    processPayment()
  }, [router, searchParams, supabase])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 max-w-md w-full">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 border-t-4 border-[#294df6] rounded-full animate-spin"></div>
              <div className="absolute inset-0 border-t-4 border-[#7733ee] rounded-full animate-spin-slow opacity-70"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Payment</h1>
            <p className="text-gray-600 text-center">Please wait while we confirm your subscription details...</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center">
            <div className="bg-green-50 p-4 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 text-center mb-6">
              Your subscription has been activated successfully. You will be redirected to your dashboard in a moment.
            </p>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#294df6] to-[#7733ee] h-2 animate-progress"></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-red-50 p-4 rounded-full mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h1>
            <p className="text-red-600 text-center mb-6">{error}</p>
            <div className="space-y-3 w-full">
              <button
                onClick={() => router.push("/account")}
                className="w-full bg-gradient-to-r from-[#294df6] to-[#3a5bff] text-white px-6 py-3 rounded-lg font-medium hover:from-[#1a3ca8] hover:to-[#2a4ac8] transition-colors"
              >
                Return to Account
              </button>
              <Link
                href="/contact"
                className="block w-full text-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Contact Support
              </Link>
            </div>

            {/* Debug information for development - remove in production */}
            {process.env.NODE_ENV === "development" && debugInfo && (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg w-full">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Information:</h3>
                <pre className="text-xs text-gray-600 overflow-auto max-h-40">{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        .animate-progress {
          animation: progress 3s linear forwards;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  )
}
