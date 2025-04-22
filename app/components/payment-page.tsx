"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { Check } from "lucide-react"

// Use the test mode URL for Dodo Payments
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
  credits: number
  dodoProductId: string
  features: string[]
  discount?: string
  isBestValue?: boolean
  annualDiscountPercentage?: number
  showOnAnnual?: boolean
}

const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Perfect for individuals just getting started",
    priceUSD: {
      monthly: 7,
      annually: 6,
      yearlyTotal: 72,
    },
    credits: 2,
    dodoProductId: "pdt_aKk7uYTudrZ8lzrpba34K",
    annualDiscountPercentage: 15,
    features: [
      "2 professionally written blog posts per month",
      "Basic SEO optimization",
      "Content calendar",
      "Email support",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    description: "Great for small businesses and startups",
    priceUSD: {
      monthly: 25,
      annually: 21,
      yearlyTotal: 252,
    },
    credits: 15,
    dodoProductId: "pdt_aKk7uYTudrZ8lzrpba34K",
    annualDiscountPercentage: 15,
    features: [
      "15 professionally written blog posts per month",
      "Standard SEO optimization",
      "Content strategy",
      "Social media integration",
      "Email and chat support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    description: "Ideal for growing your online presence",
    priceUSD: {
      monthly: 40,
      annually: 25, // $300/year ÷ 12 months = $25/month
      yearlyTotal: 66,
    },
    credits: 30,
    dodoProductId: "pdt_aKk7uYTudrZ8lzrpba34K",
    discount: "SAVE 68% WITH ANNUAL BILLING",
    annualDiscountPercentage: 68,
    isBestValue: true,
    showOnAnnual: true,
    features: [
      "30 professionally written blog posts per month",
      "Advanced SEO optimization",
      "Comprehensive content strategy",
      "Social media integration",
      "Content performance analytics",
      "Priority support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    description: "For businesses serious about content marketing",
    priceUSD: {
      monthly: 70,
      annually: 50, // $600/year ÷ 12 months = $50/month
      yearlyTotal: 132,
    },
    credits: 60,
    dodoProductId: "pdt_aKk7uYTudrZ8lzrpba34K",
    discount: "SAVE 68% WITH ANNUAL BILLING",
    annualDiscountPercentage: 68,
    showOnAnnual: true,
    features: [
      "60 professionally written blog posts per month",
      "Premium SEO optimization",
      "Advanced content strategy and planning",
      "Full suite of social media integrations",
      "Content performance analytics",
      "Dedicated account manager",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with extensive content needs",
    priceUSD: {
      monthly: 100,
      annually: 85,
      yearlyTotal: 1020,
    },
    credits: 120,
    dodoProductId: "pdt_aKk7uYTudrZ8lzrpba34K",
    discount: "SAVE 15% WITH ANNUAL BILLING",
    annualDiscountPercentage: 15,
    features: [
      "120 professionally written blog posts per month",
      "Enterprise-grade SEO optimization",
      "Custom content strategy",
      "Multi-channel content distribution",
      "Advanced analytics and reporting",
      "Dedicated account team",
      "24/7 priority support",
      "Custom integrations",
    ],
  },
]

export default function PaymentPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setDebugInfo("Checking user authentication...")

        // Check if user exists in userssignuped table
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError) {
          throw new Error(`Authentication error: ${authError.message}`)
        }

        if (!user) {
          setDebugInfo("No authenticated user found.")
          setError("You must be logged in to purchase a subscription.")
          return
        }

        setDebugInfo(`User authenticated. Checking userssignuped table for user ID: ${user.id}`)

        // Check if user exists in userssignuped table
        const { data: signupUser, error: signupError } = await supabase
          .from("userssignuped")
          .select("*")
          .eq("id", user.id)
          .single()

        if (signupError && signupError.code !== "PGRST116") {
          throw new Error(`Error checking userssignuped table: ${signupError.message}`)
        }

        // If user doesn't exist in userssignuped, create an entry
        if (!signupUser) {
          setDebugInfo("User not found in userssignuped table, creating entry...")
          // Generate a default username from the email
          const defaultUsername = user.email ? user.email.split("@")[0] : `user_${user.id.substring(0, 8)}`

          const { error: insertError } = await supabase.from("userssignuped").insert({
            id: user.id,
            email: user.email,
            username: defaultUsername,
          })

          if (insertError) {
            throw new Error(`Failed to create user record: ${insertError.message}`)
          }

          setDebugInfo("Created new user in userssignuped table")
        } else {
          setDebugInfo(`User found in userssignuped table: ${JSON.stringify(signupUser)}`)
        }

        // Check if user already has a subscription
        const { data: subscription, error: subError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (subError && subError.code !== "PGRST116") {
          throw new Error(`Error checking subscription: ${subError.message}`)
        }

        if (subscription) {
          setDebugInfo(`Subscription found: ${JSON.stringify(subscription)}`)
          // IMPORTANT: Don't redirect to dashboard here, just show a message
          setError(
            `You already have an active ${subscription.plan_id} subscription. You can manage it from your dashboard.`,
          )
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
      // Check if user exists in userssignuped table
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) throw new Error(`Authentication error: ${authError.message}`)
      if (!user) throw new Error("User not authenticated")

      setDebugInfo(`User authenticated. User ID: ${user.id}`)

      // Verify user exists in userssignuped table
      const { data: signupUser, error: signupError } = await supabase
        .from("userssignuped")
        .select("*")
        .eq("id", user.id)
        .single()

      if (signupError && signupError.code !== "PGRST116") {
        throw new Error(`Error checking userssignuped table: ${signupError.message}`)
      }

      // If user doesn't exist in userssignuped, create an entry
      if (!signupUser) {
        setDebugInfo("User not found in userssignuped table, creating entry...")
        // Generate a default username from the email
        const defaultUsername = user.email ? user.email.split("@")[0] : `user_${user.id.substring(0, 8)}`

        const { error: insertError } = await supabase.from("userssignuped").insert({
          id: user.id,
          email: user.email,
          username: defaultUsername,
        })

        if (insertError) {
          throw new Error(`Failed to create user record: ${insertError.message}`)
        }
      }

      // Get price information based on currency and billing cycle
      const prices = plan.priceUSD
      const price = billingCycle === "annually" ? prices.annually : prices.monthly
      const monthlyPrice = prices.monthly
      const annualPrice = prices.annually
      const annualDiscountPercentage = plan.annualDiscountPercentage || 20

      // Make sure billing cycle is correctly formatted
      const billingCycleValue = billingCycle === "annually" ? "annually" : "monthly"

      // Record the checkout attempt in Supabase
      await supabase.from("checkout_attempts").insert({
        user_id: user.id,
        plan_id: plan.id,
        timestamp: new Date().toISOString(),
      })

      // Construct the checkout URL with redirect and include billing cycle and price information
      const successUrl = encodeURIComponent(
        `${window.location.origin}/payment-success?` +
          `user_id=${user.id}&` +
          `plan_id=${plan.id}&` +
          `plan_name=${plan.name}&` +
          `price=${price}&` +
          `credits=${plan.credits}&` +
          `billing_cycle=${billingCycleValue}&` +
          `monthly_price=${monthlyPrice}&` +
          `annual_price=${annualPrice}&` +
          `annual_discount=${annualDiscountPercentage}`,
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
    return `${amount}`
  }

  const getPriceDisplay = (plan: Plan) => {
    if (billingCycle === "monthly") {
      return formatCurrency(plan.priceUSD.monthly)
    } else {
      return formatCurrency(plan.priceUSD.annually)
    }
  }

  const getYearlyTotal = (plan: Plan) => {
    return formatCurrency(plan.priceUSD.yearlyTotal)
  }

  // Filter plans based on billing cycle
  const filteredPlans = billingCycle === "annually" ? plans.filter((plan) => plan.showOnAnnual) : plans

  return (
    <div className="w-full mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">We've got a plan that's perfect for you.</h1>
      </div>

      {/* Billing Toggle */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12">
        <div className="inline-flex rounded-full bg-gray-100 p-1.5 shadow-sm">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2.5 rounded-full font-medium transition-all ${
              billingCycle === "monthly" ? "bg-[#294fd6] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annually")}
            className={`px-6 py-2.5 rounded-full font-medium transition-all ${
              billingCycle === "annually" ? "bg-[#294fd6] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Annually
          </button>
          {billingCycle === "annually" && (
            <span className="ml-2 bg-blue-50 text-[#294fd6] text-xs font-medium px-2 py-1 rounded-full self-center">
              SAVE UP TO 68%
            </span>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-[1400px] mx-auto px-4">
        <div
          className={`grid grid-cols-1 ${
            billingCycle === "annually"
              ? "md:grid-cols-2 max-w-[700px] mx-auto gap-6"
              : "md:grid-cols-3 lg:grid-cols-5 gap-6"
          }`}
        >
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`border border-gray-200 rounded-md overflow-hidden ${plan.isBestValue ? "relative" : ""}`}
            >
              {plan.isBestValue && (
                <div className="bg-[#294fd6] text-white text-center py-1 font-medium text-sm">BEST VALUE</div>
              )}

              <div className={`p-6 ${plan.isBestValue ? "" : "pt-7"}`}>
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                  <p className="text-gray-600 text-sm mb-4 h-10">{plan.description}</p>
                </div>

                {billingCycle === "annually" && (
                  <div className="bg-blue-50 rounded-md py-1.5 px-2 mb-4 flex items-center justify-center">
                    <Check className="h-4 w-4 text-[#294fd6] mr-1.5" />
                    <span className="text-[#294fd6] text-xs font-medium">
                      SAVE {plan.annualDiscountPercentage}% ANNUALLY
                    </span>
                  </div>
                )}

                <div className="text-center mb-1">
                  <div className="flex items-center justify-center">
                    <span className="text-3xl font-bold">$</span>
                    <span className="text-4xl font-bold">{getPriceDisplay(plan)}</span>
                  </div>
                  <div className="text-gray-500 text-sm">/month</div>
                </div>

                {billingCycle === "annually" && (
                  <div className="text-center mb-4 text-sm text-gray-600">
                    ${getYearlyTotal(plan)} billed yearly ({plan.annualDiscountPercentage}% off)
                  </div>
                )}

                <div className="bg-blue-50 rounded-md py-2 px-2 mb-4 text-center">
                  <span className="text-[#294fd6] font-medium">{plan.credits} credits/month</span>
                </div>

                <button
                  className={`w-full py-2.5 rounded-md font-medium mb-6 transition-all ${
                    plan.isBestValue
                      ? "bg-[#294fd6] text-white hover:bg-[#1e3eb8]"
                      : "border border-[#294fd6] text-[#294fd6] hover:bg-blue-50"
                  }`}
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading && selectedPlan === plan.id}
                >
                  {loading && selectedPlan === plan.id ? "Processing..." : `Choose ${plan.name}`}
                </button>

                <div>
                  <p className="font-medium mb-3">Includes:</p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-4 w-4 text-[#294fd6] mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-gray-50 rounded-xl p-8 border border-gray-200 mt-16 shadow-sm">
        <h3 className="text-xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">What happens when I run out of credits?</h4>
            <p className="text-gray-600">
              You can purchase additional credits at any time or upgrade to a higher plan for more credits.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Can I cancel my subscription?</h4>
            <p className="text-gray-600">
              Yes, you can cancel your subscription at any time. Your plan will remain active until the end of your
              billing period.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              What's the difference between monthly and annual billing?
            </h4>
            <p className="text-gray-600">
              Annual billing offers significant savings compared to monthly billing. You'll be charged once per year
              instead of monthly, with discounts of up to 68% depending on the plan.
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
