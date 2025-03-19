"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { Check } from "lucide-react"

// Use the live mode URL for Dodo Payments
const DODO_URL = "https://test.checkout.dodopayments.com/buy"

interface Plan {
  id: string
  name: string
  description: string
  priceUSD: {
    monthly: number
    annually: number
    yearlyTotal: number
  }
  priceINR: {
    monthly: number
    annually: number
    yearlyTotal: number
  }
  credits: number
  dodoProductId: string
  features: string[]
  discount?: string
  isBestValue?: boolean
  annualDiscountPercentage?: number
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Ideal for growing your online presence",
    priceUSD: {
      monthly: 147,
      annually: 119,
      yearlyTotal: 1427,
    },
    priceINR: {
      monthly: 10000,
      annually: 8500,
      yearlyTotal: 102000,
    },
    credits: 30,
    dodoProductId: "pdt_aKk7uYTudrZ8lzrpba34K",
    discount: "NET 67% OFF",
    annualDiscountPercentage: 20,
    features: [
      "30 professionally written blog posts per month",
      "Comprehensive content strategy",
      "Advanced SEO optimization",
      "Social media integration",
      "Monthly performance reports",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    description: "For businesses serious about content marketing",
    priceUSD: {
      monthly: 227,
      annually: 179,
      yearlyTotal: 2197,
    },
    priceINR: {
      monthly: 16000,
      annually: 13000,
      yearlyTotal: 156000,
    },
    credits: 60,
    dodoProductId: "pdt_aKk7uYTudrZ8lzrpba34K",
    discount: "NET 67% OFF",
    annualDiscountPercentage: 20,
    isBestValue: true,
    features: [
      "60 professionally written blog posts per month",
      "Advanced content strategy and planning",
      "Premium SEO tools and optimization",
      "Full suite of social media integrations",
      "Content performance analytics",
      "Dedicated account manager",
      "Priority support",
    ],
  },
]

export function PaymentPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly")
  const [currency, setCurrency] = useState<"USD" | "INR">("USD")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setDebugInfo("Checking user authentication...")
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError) {
          throw new Error(`Authentication error: ${authError.message}`)
        }

        if (!user) {
          setDebugInfo("No authenticated user found.")
          return
        }

        setDebugInfo(`User authenticated. Checking subscription for user ID: ${user.id}`)

        const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).single()

        if (error) {
          if (error.code === "PGRST116") {
            setDebugInfo("No subscription found for user.")
            return
          }
          throw error
        }

        if (data) {
          setDebugInfo(`Subscription found: ${JSON.stringify(data)}`)
          router.push("/dashboard")
        } else {
          setDebugInfo("No active subscription found.")
        }
      } catch (err) {
        console.error("Error checking subscription:", err)
        if (err instanceof Error) {
          setError(`Failed to check subscription status: ${err.message}`)
          setDebugInfo(`Error details: ${JSON.stringify(err)}`)
        } else {
          setError("An unknown error occurred while checking subscription status.")
          setDebugInfo(`Unknown error: ${JSON.stringify(err)}`)
        }
      }
    }

    checkSubscription()
  }, [router, supabase])

  const handleSubscribe = async (plan: Plan) => {
    setLoading(true)
    setError(null)
    setDebugInfo(null)
    setSelectedPlan(plan.id)

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) throw new Error(`Authentication error: ${authError.message}`)
      if (!user) throw new Error("User not authenticated")

      setDebugInfo(`User authenticated. User ID: ${user.id}`)

      // Get price information based on currency and billing cycle
      const prices = currency === "USD" ? plan.priceUSD : plan.priceINR
      const monthlyPrice = prices.monthly
      const annualPrice = prices.annually
      const annualDiscountPercentage = plan.annualDiscountPercentage || 20

      // Make sure billing cycle is correctly formatted
      const billingCycleValue = billingCycle === "annually" ? "annually" : "monthly"

      // Construct the checkout URL with redirect and include billing cycle and price information
      const successUrl = encodeURIComponent(
        `${window.location.origin}/payment-success?user_id=${user.id}&plan=${plan.id}&credits=${plan.credits}&billing_cycle=${billingCycleValue}&monthly_price=${monthlyPrice}&annual_price=${annualPrice}&annual_discount=${annualDiscountPercentage}&currency=${currency}`,
      )
      const checkoutUrl = `${DODO_URL}/${plan.dodoProductId}?quantity=1&redirect_url=${successUrl}`

      setDebugInfo(`Redirecting to checkout URL: ${checkoutUrl}`)

      // Redirect to Dodo Payments checkout
      window.location.href = checkoutUrl
    } catch (err) {
      console.error("Subscription error:", err)
      if (err instanceof Error) {
        setError(`Failed to process subscription: ${err.message}`)
        setDebugInfo(`Error details: ${JSON.stringify(err)}`)
      } else {
        setError("Failed to process subscription. Please try again.")
        setDebugInfo(`Unknown error: ${JSON.stringify(err)}`)
      }
    } finally {
      setLoading(false)
      setSelectedPlan(null)
    }
  }

  const formatCurrency = (amount: number) => {
    if (currency === "USD") {
      return `$${amount}`
    } else {
      return `₹${amount >= 1000 ? `${amount / 1000}K` : amount}`
    }
  }

  const getPriceDisplay = (plan: Plan) => {
    const prices = currency === "USD" ? plan.priceUSD : plan.priceINR

    if (billingCycle === "monthly") {
      return formatCurrency(prices.monthly)
    } else {
      return formatCurrency(prices.annually)
    }
  }

  const getYearlyTotal = (plan: Plan) => {
    const prices = currency === "USD" ? plan.priceUSD : plan.priceINR
    return formatCurrency(prices.yearlyTotal)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3 text-gray-900">We've got a plan that's perfect for you.</h1>
      </div>

      {/* Currency and Billing Toggle */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
        <div className="inline-flex rounded-full bg-gray-100 p-1 shadow-sm">
          <button
            onClick={() => setCurrency("USD")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              currency === "USD" ? "bg-orange-500 text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            USD
          </button>
          <button
            onClick={() => setCurrency("INR")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              currency === "INR" ? "bg-orange-500 text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            INR
          </button>
        </div>

        <div className="inline-flex rounded-full bg-gray-100 p-1 shadow-sm">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              billingCycle === "monthly" ? "bg-orange-500 text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annually")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              billingCycle === "annually" ? "bg-orange-500 text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Annually
          </button>
          {billingCycle === "annually" && (
            <span className="ml-2 text-orange-500 font-medium self-center">SAVE 20%</span>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`border rounded-lg overflow-hidden ${
              plan.isBestValue ? "border-orange-200 relative" : "border-gray-200"
            }`}
          >
            {plan.isBestValue && (
              <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rotate-45 translate-x-8 -translate-y-1 w-36 text-center">
                BEST VALUE
              </div>
            )}

            <div className="p-6">
              <h2 className="text-2xl font-bold text-center mb-1">{plan.name}</h2>
              <p className="text-gray-600 text-center text-sm mb-6 h-12">{plan.description}</p>

              {plan.discount && (
                <div className="text-center mb-2">
                  <span className="text-orange-500 text-sm font-medium">{plan.discount}</span>
                </div>
              )}

              <div className="text-center mb-2">
                <span className="text-4xl font-bold">{getPriceDisplay(plan)}</span>
                <span className="text-gray-500 text-sm">/{billingCycle === "monthly" ? "Month" : "Month"}</span>
              </div>

              {billingCycle === "annually" && (
                <div className="text-center mb-4">
                  <span className="text-sm text-gray-600">{getYearlyTotal(plan)} billed yearly</span>
                </div>
              )}

              {billingCycle === "monthly" && (
                <div className="text-center mb-4">
                  <span className="text-sm text-gray-600">Billed monthly, cancel anytime</span>
                </div>
              )}

              <button
                className={`w-full py-3 rounded-lg font-medium mb-6 ${
                  plan.isBestValue
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "border border-orange-500 text-orange-500 hover:bg-orange-50"
                }`}
                onClick={() => handleSubscribe(plan)}
                disabled={loading && selectedPlan === plan.id}
              >
                {loading && selectedPlan === plan.id ? "Processing..." : `Choose ${plan.name}`}
              </button>

              <div>
                <p className="font-medium mb-3">Includes:</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto bg-gray-50 rounded-xl p-8 border border-gray-200 mt-12">
        <h3 className="text-xl font-bold mb-4 text-gray-900">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">What happens when I run out of credits?</h4>
            <p className="text-gray-600 text-sm">
              You can purchase additional credits at any time or upgrade to a higher plan for more credits.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Can I cancel my subscription?</h4>
            <p className="text-gray-600 text-sm">
              Yes, you can cancel your subscription at any time. Your plan will remain active until the end of your
              billing period.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">
              What's the difference between monthly and annual billing?
            </h4>
            <p className="text-gray-600 text-sm">
              Annual billing offers a 20% discount compared to monthly billing. You'll be charged once per year instead
              of monthly.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-8 p-4 bg-red-50 border-l-4 border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {debugInfo && (
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm font-mono text-gray-600 whitespace-pre-wrap">{debugInfo}</p>
        </div>
      )}
    </div>
  )
}

