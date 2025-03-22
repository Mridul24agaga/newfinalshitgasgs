"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { CheckCircle, AlertCircle, Loader2, ArrowRight, CreditCard, Calendar, Clock, Shield, Home } from "lucide-react"
import Image from "next/image"
import { Saira } from "next/font/google"

// Initialize the Saira font
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-saira",
})

export default function PaymentSuccessPage() {
  const [message, setMessage] = useState("Processing your payment...")
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)
  const [success, setSuccess] = useState(false)
  const [planDetails, setPlanDetails] = useState<{
    name: string
    cycle: string
    credits: number
    price?: string | null
  } | null>(null)
  const [countdown, setCountdown] = useState(5)
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

        // Check if we have the minimum required parameters
        if (!userId || !planId) {
          setError("Missing required payment information. Please contact support.")
          setIsProcessing(false)
          return
        }

        // Verify the user exists in the auth.users table
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError) {
          throw new Error(`User verification failed: ${userError.message}`)
        }

        if (!userData || !userData.user) {
          throw new Error("User not found")
        }

        // Determine if this is an annual subscription - ONLY if explicitly set to annual/annually
        // Default to monthly if not specified
        const isAnnual = billingCycle === "annually" || billingCycle === "annual"
        const billingCycleValue = isAnnual ? "annually" : "monthly"
        const subscriptionTypeValue = isAnnual ? "annual" : "monthly"

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

        // Format plan name for display
        const formattedPlanName =
          planId === "basic"
            ? "Starter"
            : planId === "pro"
              ? "Professional"
              : planId === "starter"
                ? "Starter"
                : planId === "professional"
                  ? "Professional"
                  : planId.charAt(0).toUpperCase() + planId.slice(1)

        // Format price for display
        const currencySymbol = currency === "INR" ? "₹" : "$"
        const priceValue = isAnnual
          ? annualPrice
            ? `${currencySymbol}${annualPrice}/year`
            : null
          : monthlyPrice
            ? `${currencySymbol}${monthlyPrice}/month`
            : null

        // Set plan details for display
        setPlanDetails({
          name: formattedPlanName,
          cycle: isAnnual ? "yearly" : "monthly",
          credits: creditAmount,
          price: priceValue,
        })

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

        // Update the subscription in your database
        const { error } = await supabase.from("subscriptions").upsert(subscriptionData)

        if (error) throw error

        setMessage(
          `Your payment was successful! You've subscribed to the ${formattedPlanName} plan with ${creditAmount} credits.`,
        )
        setSuccess(true)
        setIsProcessing(false)

        // Start countdown for redirect
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              router.push("/dashboard")
              return 0
            }
            return prev - 1
          })
        }, 1000)

        return () => clearInterval(timer)
      } catch (error) {
        console.error("Error updating subscription:", error)
        setError(
          error instanceof Error
            ? error.message
            : "There was an error processing your payment. Please contact support.",
        )
        setIsProcessing(false)
      }
    }

    updateSubscription()
  }, [searchParams, router, supabase])

  if (error) {
    return (
      <div
        className={`${saira.className} min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100`}
      >
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-red-100">
            <div className="bg-gradient-to-r from-red-50 to-white p-6 border-b border-red-100">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-center text-gray-900">Payment Error</h1>
              <p className="mt-2 text-center text-gray-600">We couldn't process your payment</p>
            </div>

            <div className="p-6">
              <div className="bg-red-50 rounded-xl p-4 border border-red-200 mb-6">
                <p className="text-red-800 text-sm">{error}</p>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  If you believe this is a mistake, please contact our support team for assistance.
                </p>

                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center"
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Return to Dashboard
                  </button>

                  <button
                    onClick={() => router.push("/support")}
                    className="w-full bg-white text-gray-700 py-3 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-300"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div
        className={`${saira.className} min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100`}
      >
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
            <div className="bg-gradient-to-r from-green-50 to-white p-6 border-b border-green-100">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-center text-gray-900">Payment Successful!</h1>
              <p className="mt-2 text-center text-gray-600">Your subscription has been activated</p>
            </div>

            <div className="p-6">
              {planDetails && (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-orange-500" />
                    Subscription Details
                  </h2>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium text-gray-900">{planDetails.name}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Billing Cycle:</span>
                      <span className="font-medium text-gray-900 flex items-center">
                        {planDetails.cycle === "yearly" ? (
                          <>
                            Yearly <Calendar className="ml-1 h-4 w-4 text-orange-500" />
                          </>
                        ) : (
                          "Monthly"
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Credits:</span>
                      <span className="font-medium text-gray-900">{planDetails.credits}</span>
                    </div>

                    {planDetails.price && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium text-gray-900">{planDetails.price}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-6">
                <p className="text-green-800 text-sm">{message}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Redirecting to dashboard in {countdown} seconds...</span>
                </div>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center"
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Go to Dashboard Now
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center">
                <Shield className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-xs text-gray-500">Your payment is secure and encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${saira.className} min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100`}
    >
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white">
            <div className="flex justify-center mb-4">
              <Image src="/logo.png" alt="Logo" width={120} height={40} className="h-10 object-contain" priority />
            </div>
            <h1 className="text-2xl font-bold text-center text-gray-900">Processing Payment</h1>
            <p className="mt-2 text-center text-gray-600">Please wait while we confirm your subscription</p>
          </div>

          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-orange-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-orange-500 rounded-full animate-spin border-t-transparent"></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-start">
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-3 mt-0.5" />
                  <div>
                    <p className="text-blue-800 text-sm font-medium">Activating your subscription</p>
                    <p className="text-blue-700 text-xs mt-1">This may take a few moments...</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Verifying payment</span>
                  <span>Activating subscription</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center">
              <Shield className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-xs text-gray-500">Your payment is secure and encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

