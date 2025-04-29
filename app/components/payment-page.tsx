"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"

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
  dodoProductId: {
    monthly: string
    annually: string
  }
  features: string[]
  discount?: string
  isBestValue?: boolean
  annualDiscountPercentage?: number
  showOnAnnual?: boolean
  tier?: 1 | 2 // To control which row the plan appears in
}

const plans: Plan[] = [
  {
    id: "trial",
    name: "Trial",
    description: "Ideal for testing our platform's potential",
    priceUSD: {
      monthly: 7,
      annually: 7,
      yearlyTotal: 7,
    },
    credits: 2,
    dodoProductId: {
      monthly: "pdt_z3XRRMgR6dGV5Z66ElFhm",
      annually: "pdt_z3XRRMgR6dGV5Z66ElFhm",
    },
    features: ["2 professionally crafted articles", "Basic keyword research", "Standard email support"],
    tier: 1,
  },
  {
    id: "starter",
    name: "Starter",
    description: "Ideal for individuals and startups aiming to boost visibility",
    priceUSD: {
      monthly: 25,
      annually: 21,
      yearlyTotal: 252,
    },
    credits: 15,
    dodoProductId: {
      monthly: "pdt_lm80fduM23lgLSCJhXQBf",
      annually: "pdt_lm80fduM23lgLSCJhXQBf",
    },
    annualDiscountPercentage: 15,
    features: [
      "15 professionally crafted articles/month",
      "Standard keyword research",
      "Standard email & chat support",
    ],
    tier: 1,
  },
  {
    id: "growth",
    name: "Growth",
    description: "Ideal for growing businesses seeking substantial online growth",
    priceUSD: {
      monthly: 40,
      annually: 17.25, // $300/year ÷ 12 months = $25/month
      yearlyTotal: 207,
    },
    credits: 30,
    dodoProductId: {
      monthly: "pdt_P2vmzA58J1kOlgHBKlGNN",
      annually: "pdt_aKk7uYTudrZ8lzrpba34K", // Replace with actual annual product ID
    },
    discount: "SAVE 57% WITH ANNUAL BILLING",
    annualDiscountPercentage: 68,
    isBestValue: true,
    showOnAnnual: true,
    features: [
      "30 professionally crafted articles/month",
      "Advanced keyword research for enhanced visibility",
      "Priority support & unlimited support calls",
    ],
    tier: 1,
  },
  {
    id: "professional",
    name: "Professional",
    description: "Perfect for established businesses aiming for high-impact results",
    priceUSD: {
      monthly: 70,
      annually: 30, // $600/year ÷ 12 months = $50/month
      yearlyTotal: 362,
    },
    credits: 60,
    dodoProductId: {
      monthly: "pdt_09SSladZHqE5hTjxb2Pst",
      annually: "pdt_EaLdjsytLh65LQmAECiJ2", // Replace with actual annual product ID
    },
    discount: "SAVE 57% WITH ANNUAL BILLING",
    annualDiscountPercentage: 68,
    showOnAnnual: true,
    features: [
      "60 professionally crafted articles/month",
      "Premium SEO optimization with custom keyword research",
      "Dedicated account manager for personalized strategies",
      "Unlimited priority support",
    ],
    tier: 2,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Designed specifically for large organizations with extensive content requirements",
    priceUSD: {
      monthly: 100,
      annually: 85,
      yearlyTotal: 1020,
    },
    credits: 120,
    dodoProductId: {
      monthly: "pdt_w3Fr4POKROMWHzMnEueLq",
      annually: "pdt_w3Fr4POKROMWHzMnEueLq",
    },
    discount: "SAVE 15% WITH ANNUAL BILLING",
    annualDiscountPercentage: 15,
    features: [
      "120 professionally crafted articles/month (daily publishing)",
      "Enterprise-grade SEO strategies and bespoke keyword research",
      "Custom integrations tailored to your business needs",
      "Dedicated account team for strategic guidance",
      "24/7 priority support for ultimate reliability and service",
    ],
    tier: 2,
  },
]

export default function PaymentPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [sliderValue, setSliderValue] = useState(2) // Default to Growth plan (index 2)
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
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
          // Don't set error message for unauthenticated users
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
          // Don't set error message for existing subscriptions
        } else {
          setDebugInfo("No active subscription found.")
        }
      } catch (err) {
        console.error("Error checking subscription:", err)
        // Don't set error messages for any errors
      }
    }

    checkSubscription()
  }, [router, supabase])

  // Close tooltip when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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

      // Calculate credits based on billing cycle
      let credits = plan.credits
      if (billingCycle === "annually") {
        if (plan.id === "growth") {
          credits = 30 * 12 // 360 credits for yearly Growth plan
        } else if (plan.id === "professional") {
          credits = 60 * 12 // 720 credits for yearly Professional plan
        }
      }

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
          `credits=${credits}&` +
          `billing_cycle=${billingCycleValue}&` +
          `monthly_price=${monthlyPrice}&` +
          `annual_price=${annualPrice}&` +
          `annual_discount=${annualDiscountPercentage}`,
      )

      // Use the correct product ID based on billing cycle
      const productId = billingCycle === "annually" ? plan.dodoProductId.annually : plan.dodoProductId.monthly
      const checkoutUrl = `${DODO_URL}/${productId}?quantity=1&redirect_url=${successUrl}`

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

  // Filter plans based on billing cycle
  const getFilteredPlans = () => {
    // When in annual mode, only show Growth and Professional plans
    if (billingCycle === "annually") {
      return plans.filter((plan) => plan.id === "growth" || plan.id === "professional")
    }
    // In monthly mode, show all plans
    return plans
  }

  const filteredPlans = getFilteredPlans()
  const currentPlan = filteredPlans[Math.min(sliderValue, filteredPlans.length - 1)]

  // Fixed features list for the right side
  const features = [
    'Effortless Onboarding: Simply enter your URL and click "Go"—we handle the rest.',
    "Automated SEO Research: Comprehensive analysis of your site, audience, and strategic keywords.",
    "Weekly Content Production: Automated planning and regular article publishing tailored for SEO success.",
    "Article Management: Easy approval or moderation options and automated internal linking to boost your site's SEO.",
    "Rich Media Content: Articles up to 4000 words, enhanced with AI-generated images, YouTube embeds, Google Image insertions, tables, and lists.",
    "Accuracy Guaranteed: Advanced anti-hallucination system with rigorous fact-checking and source citations.",
    "Optimized for SEO: Fully keyword-targeted and SEO-optimized content.",
    "Seamless Integrations: Effortlessly connect with WordPress, Webflow, Shopify, and more.",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">Choose the perfect plan for your content needs</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Pricing with slider */}
          <div className="bg-white rounded-2xl p-8 lg:sticky lg:top-8 transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">{currentPlan.name} Plan</h2>

              {/* Custom toggle switch */}
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="billing-toggle"
                  className={`cursor-pointer ${billingCycle === "monthly" ? "font-bold" : ""}`}
                >
                  Monthly
                </label>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                  <input
                    type="checkbox"
                    id="billing-toggle"
                    className="absolute w-0 h-0 opacity-0"
                    checked={billingCycle === "annually"}
                    onChange={(e) => setBillingCycle(e.target.checked ? "annually" : "monthly")}
                  />
                  <label
                    htmlFor="billing-toggle"
                    className={`block h-6 overflow-hidden rounded-full cursor-pointer ${
                      billingCycle === "annually" ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ${
                        billingCycle === "annually" ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </label>
                </div>
                <label
                  htmlFor="billing-toggle"
                  className={`cursor-pointer ${billingCycle === "annually" ? "font-bold" : ""}`}
                >
                  Annually
                </label>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-500">{currentPlan.description}</p>
            </div>

            <div className="flex items-baseline mb-8">
              <span className="text-5xl font-extrabold text-gray-900">
                ${billingCycle === "annually" ? currentPlan.priceUSD.annually : currentPlan.priceUSD.monthly}
              </span>
              <span className="ml-2 text-xl text-gray-500">/month</span>

              {currentPlan.discount && billingCycle === "annually" && (
                <span className="ml-4 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  SAVE {currentPlan.annualDiscountPercentage}%
                </span>
              )}
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Basic</span>
                <span className="text-sm font-medium text-gray-500">Enterprise</span>
              </div>

              {/* Custom slider */}
              <div className="relative mb-6">
                <input
                  type="range"
                  min="0"
                  max={filteredPlans.length - 1}
                  step="1"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #2563eb 0%, #2563eb ${
                      (sliderValue / (filteredPlans.length - 1)) * 100
                    }%, #e5e7eb ${(sliderValue / (filteredPlans.length - 1)) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <style jsx>{`
                  input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #2563eb;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                  }
                  input[type="range"]::-moz-range-thumb {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #2563eb;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                  }
                `}</style>
              </div>

              <div className="flex justify-between items-center">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {currentPlan.credits} articles/month
                </div>

                {/* Custom tooltip */}
                <div className="relative">
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={() => setShowTooltip(!showTooltip)}
                    aria-label="More info"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </button>
                  {showTooltip && (
                    <div
                      ref={tooltipRef}
                      className="absolute right-0 z-10 w-64 p-2 mt-2 text-sm text-gray-600 bg-white border rounded shadow-lg"
                    >
                      Adjust the slider to see different pricing plans. All plans include the full feature set.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 flex-shrink-0 mr-2 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-4 text-lg text-white font-medium rounded-lg transition-colors ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={() => handleSubscribe(currentPlan)}
              disabled={loading}
            >
              {loading && selectedPlan === currentPlan.id ? "Processing..." : `Get started with ${currentPlan.name}`}
            </button>
          </div>

          {/* Right side - Features */}
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Everything you need for SEO success</h2>

            <ul className="space-y-6">
              {features.map((feature, index) => {
                const [title, description] = feature.split(": ")
                return (
                  <li key={index} className="grid gap-2">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                        <svg
                          className="h-5 w-5 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{title}</h3>
                        <p className="text-gray-600">{description}</p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
