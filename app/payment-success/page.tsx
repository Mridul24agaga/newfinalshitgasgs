"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [debugInfo, setDebugInfo] = useState<Record<string, any> | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get all URL parameters as an object for debugging
        const allParams = Object.fromEntries([...searchParams.entries()])
        setDebugInfo(allParams)
        console.log("URL parameters:", allParams)

        // Get the payment type (upgrade or new subscription)
        const paymentType = searchParams.get("payment_type") || "subscription"
        const isUpgrade = paymentType === "upgrade"

        // Extract common parameters
        const userId = searchParams.get("user_id")
        const planId = searchParams.get("plan_id")
        const billingCycle = searchParams.get("billing_cycle") || "monthly"
        const currency = searchParams.get("currency") || "USD"
        const price = searchParams.get("price")
        const status = searchParams.get("status") || "active"

        // Credits handling
        const existingCredits = searchParams.get("existing_credits")
          ? Number.parseInt(searchParams.get("existing_credits")!, 10)
          : 0
        const newCredits = searchParams.get("new_credits") ? Number.parseInt(searchParams.get("new_credits")!, 10) : 0
        const totalCredits = searchParams.get("total_credits")
          ? Number.parseInt(searchParams.get("total_credits")!, 10)
          : existingCredits + newCredits

        // Validate required parameters
        if (!userId || !planId) {
          throw new Error("Missing required parameters: user_id and plan_id are required")
        }

        if (isUpgrade) {
          // For upgrades, use the record-payment route with the expected format
          console.log("Processing as an upgrade using record-payment")

          const response = await fetch("/api/record-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              plan_id: planId,
              credits: newCredits || totalCredits,
              billing_cycle: billingCycle,
              amount: price ? Number.parseFloat(price) : null,
              currency: currency,
              timestamp: new Date().toISOString(),
            }),
          })

          const result = await response.json()

          if (!response.ok) {
            console.error("Payment recording failed:", result)
            throw new Error(result.error || "Failed to record payment")
          }

          console.log("Payment recorded successfully:", result)
        } else {
          // For new subscriptions, use the create-subscription route with the expected format
          console.log("Processing as a new subscription using create-subscription")

          // Calculate period dates
          const currentDate = new Date()
          const periodEnd = new Date(currentDate)
          const isAnnual = billingCycle === "annually" || billingCycle === "annual"

          if (isAnnual) {
            periodEnd.setFullYear(periodEnd.getFullYear() + 1)
          } else {
            periodEnd.setMonth(periodEnd.getMonth() + 1)
          }

          // Prepare subscription data in the format expected by the backend
          const subscriptionData = {
            user_id: userId,
            plan_id: planId,
            credits: totalCredits,
            status: status,
            billing_cycle: billingCycle,
            subscription_type: isAnnual ? "annual" : "monthly",
            currency: currency,
            current_period_start: currentDate.toISOString(),
            current_period_end: periodEnd.toISOString(),
            onboarding_completed: true,
            website_onboarding_completed: true,
            price: price ? Number.parseFloat(price) : null,
            monthly_price: searchParams.get("monthly_price")
              ? Number.parseFloat(searchParams.get("monthly_price")!)
              : null,
            annual_price: searchParams.get("annual_price")
              ? Number.parseFloat(searchParams.get("annual_price")!)
              : null,
            annual_discount_percentage: searchParams.get("annual_discount")
              ? Number.parseInt(searchParams.get("annual_discount")!, 10)
              : null,
            created_at: currentDate.toISOString(),
            updated_at: currentDate.toISOString(),
          }

          console.log("Subscription data:", subscriptionData)

          const response = await fetch("/api/create-subscription", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subscriptionData,
              userId,
            }),
          })

          const result = await response.json()

          if (!response.ok) {
            console.error("Subscription creation failed:", result)
            throw new Error(result.error || "Failed to create subscription")
          }

          console.log("Subscription created/updated successfully:", result)

          // Also record the payment for new subscriptions
          try {
            const paymentResponse = await fetch("/api/record-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: userId,
                plan_id: planId,
                credits: totalCredits,
                billing_cycle: billingCycle,
                amount: price ? Number.parseFloat(price) : null,
                currency: currency,
                timestamp: currentDate.toISOString(),
              }),
            })

            const paymentResult = await paymentResponse.json()

            if (!paymentResponse.ok) {
              console.warn("Payment recording failed, but subscription was created:", paymentResult)
            } else {
              console.log("Payment recorded successfully:", paymentResult)
            }
          } catch (paymentError) {
            console.warn("Error recording payment, but subscription was created:", paymentError)
          }
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
  }, [router, searchParams])

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

            {/* Debug information - always show for troubleshooting */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg w-full">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Information:</h3>
              <pre className="text-xs text-gray-600 overflow-auto max-h-40">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
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
