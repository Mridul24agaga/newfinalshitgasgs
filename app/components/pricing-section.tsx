"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { Clock, Check, Coffee, TrendingUp, DollarSign, BarChart3, Search } from "lucide-react"
import { Poppins } from "next/font/google"
import Link from "next/link"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

// Use the test mode URL for Dodo Payments
const DODO_URL = "https://checkout.dodopayments.com/buy"

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
  popularChoice?: boolean
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for individuals and startups building their online presence",
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
      "Basic SEO optimization",
      "Content calendar planning",
    ],
    tier: 1,
    showOnAnnual: false, // Don't show on annual billing
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
    popularChoice: true,
    showOnAnnual: true, // Show on annual billing
    features: [
      "30 professionally crafted articles/month",
      "Advanced keyword research for enhanced visibility",
      "Priority support & unlimited support calls",
      "Comprehensive SEO strategy",
      "Content performance analytics",
      "Social media promotion templates",
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
    showOnAnnual: true, // Show on annual billing
    features: [
      "60 professionally crafted articles/month",
      "Premium SEO optimization with custom keyword research",
      "Dedicated account manager for personalized strategies",
      "Unlimited priority support",
      "Competitor content analysis",
      "Monthly strategy calls",
      "Custom content calendar",
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
    showOnAnnual: false, // Don't show on annual billing
    features: [
      "120 professionally crafted articles/month (daily publishing)",
      "Enterprise-grade SEO strategies and bespoke keyword research",
      "Custom integrations tailored to your business needs",
      "Dedicated account team for strategic guidance",
      "24/7 priority support for ultimate reliability and service",
      "White-labeled content solutions",
      "Multi-site content management",
    ],
    tier: 2,
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually") // Default to annually for better value perception
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubscribe = async (plan: Plan) => {
    setLoading(true)
    setError(null)
    setSelectedPlan(plan.id)

    try {
      // Check if user exists in userssignuped table
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) throw new Error(`Authentication error: ${authError.message}`)
      if (!user) throw new Error("User not authenticated")

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

      // Redirect to Dodo Payments checkout
      window.location.href = checkoutUrl
    } catch (err) {
      console.error("Subscription error:", err)
      if (err instanceof Error) {
        setError(`Failed to process subscription: ${err.message}`)
      } else {
        setError("Failed to process subscription. Please try again.")
      }
    } finally {
      setLoading(false)
      setSelectedPlan(null)
    }
  }

  // Calculate per article cost
  const calculatePerArticleCost = (plan: Plan) => {
    const price = billingCycle === "annually" ? plan.priceUSD.annually : plan.priceUSD.monthly
    return (price / plan.credits).toFixed(2)
  }

  // Filter plans based on billing cycle
  const filteredPlans = billingCycle === "annually" ? plans.filter((plan) => plan.showOnAnnual) : plans

  // Get the Growth plan for value comparison
  const growthPlan = plans.find((plan) => plan.id === "growth")
  const growthArticleCost = growthPlan ? Number.parseFloat(calculatePerArticleCost(growthPlan)) : 0

  return (
    <div className={`min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 ${poppins.variable} font-sans`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">Choose the perfect plan for your content needs</p>

          {/* Billing toggle */}
          <div className="mt-8 flex justify-center items-center">
            <span
              className={`mr-3 text-base ${billingCycle === "monthly" ? "font-semibold text-gray-900" : "text-gray-500"}`}
            >
              Monthly billing
            </span>
            <div className="relative inline-block w-14 h-7 transition duration-200 ease-in-out">
              <input
                type="checkbox"
                id="billing-toggle"
                className="absolute w-0 h-0 opacity-0"
                checked={billingCycle === "annually"}
                onChange={(e) => setBillingCycle(e.target.checked ? "annually" : "monthly")}
              />
              <label
                htmlFor="billing-toggle"
                className={`block h-7 overflow-hidden rounded-full cursor-pointer ${
                  billingCycle === "annually" ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`block h-7 w-7 rounded-full bg-white border border-gray-200 shadow transform transition-transform duration-200 ${
                    billingCycle === "annually" ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </label>
            </div>
            <span
              className={`ml-3 text-base ${billingCycle === "annually" ? "font-semibold text-gray-900" : "text-gray-500"}`}
            >
              Annual billing
            </span>
            {billingCycle === "annually" && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Save up to 68%
              </span>
            )}
          </div>
        </div>

        {/* Pricing cards */}
        <div
          className={`grid grid-cols-1 ${
            billingCycle === "annually" ? "md:grid-cols-2 max-w-4xl mx-auto" : "md:grid-cols-2 lg:grid-cols-4"
          } gap-6 mb-16`}
        >
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl border ${
                plan.popularChoice ? "border-blue-200 ring-1 ring-blue-500" : "border-gray-200"
              } overflow-hidden transition-all duration-200 flex flex-col`}
            >
              {/* Plan header */}
              <div className="p-6 border-b border-gray-100">
                {plan.popularChoice && (
                  <div className="inline-block px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full mb-3">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-gray-500 h-12">{plan.description}</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${billingCycle === "annually" ? plan.priceUSD.annually : plan.priceUSD.monthly}
                  </span>
                  <span className="ml-1 text-xl text-gray-500">/mo</span>
                </div>

                {/* Add total annual price for yearly billing */}
                {billingCycle === "annually" && (
                  <p className="mt-1 text-sm text-gray-500">${plan.priceUSD.yearlyTotal} billed annually</p>
                )}

                <p className="mt-1 text-sm text-gray-500">${calculatePerArticleCost(plan)} per article</p>
                {plan.discount && billingCycle === "annually" && (
                  <div className="mt-2 text-xs text-green-600 font-medium">
                    Save {plan.annualDiscountPercentage}% with annual billing
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="p-6 flex-grow">
                <h4 className="text-sm font-medium text-gray-900 mb-4">What's included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="p-6 border-t border-gray-100">
                <button
                  className={`w-full py-3 px-4 rounded-lg transition-colors ${
                    plan.popularChoice
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-white border border-blue-600 text-blue-600 hover:bg-blue-50"
                  } font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  onClick={() => router.push("/signup")}
                >
                  Get started
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Limited time offer banner */}
        {billingCycle === "annually" && (
          <div className="max-w-3xl mx-auto bg-amber-50 border border-amber-200 rounded-lg p-4 mb-16 flex items-center justify-center">
            <Clock className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              <span className="font-medium">Limited time offer:</span> Lock in current pricing before our upcoming price
              increase.
            </p>
          </div>
        )}

        {/* Value comparison section */}
        <div className="max-w-5xl mx-auto py-16 border-t border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Less than the price of a coffee</h2>
            <p className="mt-4 text-xl text-gray-500 max-w3xl mx-auto">
              Our content costs a fraction of what you'd pay elsewhere, with exponentially higher returns
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Cost comparison */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">${growthArticleCost}</h3>
              <p className="text-gray-500 mb-4">Per article with our Growth plan</p>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-600">
                  Compared to $50-$500 per article with traditional content agencies or freelancers
                </p>
              </div>
            </div>

            {/* Coffee comparison */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Coffee className="h-8 w-8 text-amber-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">$5.25</h3>
              <p className="text-gray-500 mb-4">Average price of a specialty coffee</p>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-600">
                  One coffee costs <span className="font-semibold">9x more</span> than a professionally written,
                  SEO-optimized article
                </p>
              </div>
            </div>

            {/* ROI comparison */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">1,500%</h3>
              <p className="text-gray-500 mb-4">Average ROI on content marketing</p>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-600">
                  Content marketing generates 3x more leads than paid search advertising
                </p>
              </div>
            </div>
          </div>

          {/* Why invest in content */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why invest in our content platform?</h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Rank higher on Google</h4>
                  <p className="text-gray-600">
                    Our AI-powered content is strategically optimized for search engines, helping you climb rankings and
                    attract organic traffic that converts.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Save countless hours</h4>
                  <p className="text-gray-600">
                    Stop spending 5-10 hours per article. Our platform delivers professionally written content in
                    minutes, freeing you to focus on growing your business.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Consistent publishing</h4>
                  <p className="text-gray-600">
                    Websites that publish consistently see 2-3x more traffic. Our platform ensures you never run out of
                    high-quality content to share with your audience.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Incredible ROI</h4>
                  <p className="text-gray-600">
                    For less than $0.60 per article, you get content that can generate thousands in revenue through
                    increased traffic, leads, and sales.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-xl font-medium text-gray-900 mb-6">
                For the price of a coffee per week, you can have a content marketing machine that works 24/7
              </p>
              <Link
                href="/signup"
                className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Get one Article Free
              </Link>
            </div>
          </div>
        </div>

        {/* Feature highlights section */}
        <div className="max-w-6xl mx-auto py-16 border-t border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need for SEO success</h2>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools you need to dominate search rankings
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 transition-all hover:shadow-md">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Effortless Onboarding</h3>
              <p className="text-gray-600">Simply enter your URL and click "Go"—we handle the rest.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 transition-all hover:shadow-md">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Automated SEO Research</h3>
              <p className="text-gray-600">Comprehensive analysis of your site, audience, and strategic keywords.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 transition-all hover:shadow-md">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Weekly Content Production</h3>
              <p className="text-gray-600">
                Automated planning and regular article publishing tailored for SEO success.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 transition-all hover:shadow-md">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Article Management</h3>
              <p className="text-gray-600">
                Easy approval or moderation options and automated internal linking to boost your site's SEO.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 transition-all hover:shadow-md">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Rich Media Content</h3>
              <p className="text-gray-600">
                Articles up to 4000 words, enhanced with AI-generated images, YouTube embeds, and more.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 transition-all hover:shadow-md">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Accuracy Guaranteed</h3>
              <p className="text-gray-600">
                Advanced anti-hallucination system with rigorous fact-checking and source citations.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 transition-all hover:shadow-md">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Optimized for SEO</h3>
              <p className="text-gray-600">Fully keyword-targeted and SEO-optimized content that ranks.</p>
            </div>

            {/* Feature 8 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 transition-all hover:shadow-md">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Seamless Integrations</h3>
              <p className="text-gray-600">Effortlessly connect with WordPress, Webflow, Shopify, and more.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
