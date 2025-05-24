"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { CheckCircle, Shield, Clock, Star, Award, Users, TrendingUp, Zap, ChevronDown, ChevronUp } from "lucide-react"

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
    showOnAnnual: true,
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
    showOnAnnual: true,
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

// Testimonials to add social proof
const testimonials = [
  {
    quote:
      "This platform has transformed our content strategy. We've seen a 43% increase in organic traffic in just 3 months.",
    author: "Sarah Johnson",
    title: "Marketing Director, TechGrowth",
    avatar: "/professional-woman-headshot.png",
  },
  {
    quote: "The ROI is incredible. For every $1 we spend, we're getting back $7 in customer acquisition value.",
    author: "Michael Chen",
    title: "CEO, Startup Ventures",
    avatar: "/asian-business-professional.png",
  },
  {
    quote: "We've been able to scale our content production without sacrificing quality. Game changer for our SEO.",
    author: "Jessica Williams",
    title: "SEO Specialist, Digital First",
    avatar: "/young-professional-woman.png",
  },
]

// FAQ data
const faqItems = [
  {
    question: "How does the article generation work?",
    answer:
      "Our AI analyzes your website, identifies content gaps, and generates SEO-optimized articles tailored to your audience. The process involves three simple steps: 1) We analyze your website and target keywords, 2) Our AI creates high-quality, original content optimized for search engines, and 3) You review, approve, and publish with one click to your CMS.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, to cancel your Subscription. Please email us at hi@mridulthareja.com. Our team will get with you!",
  },
  
  {
    question: "What type of content can be generated?",
    answer:
      "Our platform can generate a wide variety of content types including blog posts, product descriptions, landing pages, how-to guides, listicles, comparison articles, and more. All content is SEO-optimized and can include custom images, tables, and formatting to match your brand style.",
  },
  {
    question: "How does the platform integrate with my website?",
    answer:
      "We offer seamless integrations with popular content management systems including WordPress, Shopify, Webflow, Wix, and more. Our one-click publishing feature allows you to push content directly to your CMS without any manual copying and pasting.",
  },
  {
    question: "What makes your content different from other AI solutions?",
    answer:
      "Unlike basic AI tools, our platform combines advanced AI with SEO expertise to create content that's not just well-written but strategically optimized to rank. We include proper keyword placement, semantic relevance, and content structure that search engines reward. Additionally, our anti-hallucination system ensures factual accuracy with proper citations.",
  },
  {
    question: "How much does each article cost?",
    answer:
      "The cost per article varies by plan. With our Growth plan at $17.25/month (annual billing), you get 30 articles monthly, which works out to just $0.58 per article. This is significantly more cost-effective than hiring freelance writers ($50-200 per article) or traditional content agencies ($100-500 per article).",
  },
]

export default function PaymentPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually") // Default to annually for better value perception
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [sliderValue, setSliderValue] = useState(1) // Default to Growth plan (index 1 after removing trial)
  const [showTooltip, setShowTooltip] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Toggle FAQ item
  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  // Rotate testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

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

  // Fixed features list for the right side with icons
  const features = [
    {
      icon: <Zap className="h-5 w-5 text-blue-600" />,
      title: "Effortless Onboarding",
      description: 'Simply enter your URL and click "Go"—we handle the rest.',
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
      title: "Automated SEO Research",
      description: "Comprehensive analysis of your site, audience, and strategic keywords.",
    },
    {
      icon: <Clock className="h-5 w-5 text-blue-600" />,
      title: "Weekly Content Production",
      description: "Automated planning and regular article publishing tailored for SEO success.",
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-blue-600" />,
      title: "Article Management",
      description: "Easy approval or moderation options and automated internal linking to boost your site's SEO.",
    },
    {
      icon: <Star className="h-5 w-5 text-blue-600" />,
      title: "Rich Media Content",
      description: "Articles up to 4000 words, enhanced with AI-generated images, YouTube embeds, and more.",
    },
    {
      icon: <Shield className="h-5 w-5 text-blue-600" />,
      title: "Accuracy Guaranteed",
      description: "Advanced anti-hallucination system with rigorous fact-checking and source citations.",
    },
    {
      icon: <Award className="h-5 w-5 text-blue-600" />,
      title: "Optimized for SEO",
      description: "Fully keyword-targeted and SEO-optimized content that ranks.",
    },
    {
      icon: <Users className="h-5 w-5 text-blue-600" />,
      title: "Seamless Integrations",
      description: "Effortlessly connect with WordPress, Webflow, Shopify, and more.",
    },
  ]

  // Calculate savings amount for the current plan
  const calculateSavings = () => {
    if (billingCycle === "annually") {
      const monthlyCost = currentPlan.priceUSD.monthly * 12
      const annualCost = currentPlan.priceUSD.yearlyTotal
      return monthlyCost - annualCost
    }
    return 0
  }

  const savings = calculateSavings()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Invest in your content strategy
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Join thousands of businesses growing their traffic with AI-powered content
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Pricing with slider */}
          <div className="bg-white rounded-2xl p-8 lg:sticky lg:top-8 transition-all duration-300 transform hover:shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentPlan.name} Plan
                {currentPlan.popularChoice && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Most Popular
                  </span>
                )}
              </h2>

              {/* Custom toggle switch with savings callout */}
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-2 mb-1">
                  <label
                    htmlFor="billing-toggle"
                    className={`cursor-pointer text-sm ${billingCycle === "monthly" ? "font-bold" : ""}`}
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
                    className={`cursor-pointer text-sm ${billingCycle === "annually" ? "font-bold" : ""}`}
                  >
                    Annual
                  </label>
                </div>

                {billingCycle === "annually" && (
                  <div className="text-xs text-green-600 font-medium">Save ${savings} per year</div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-600">{currentPlan.description}</p>
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

            {/* Limited time offer banner */}
            {billingCycle === "annually" && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 flex items-center">
                <Clock className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  <span className="font-medium">Limited time offer:</span> Lock in current pricing before our upcoming
                  price increase.
                </p>
              </div>
            )}

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
              className={`w-full py-4 text-lg text-white font-medium rounded-lg transition-all ${
                loading
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
              onClick={() => handleSubscribe(currentPlan)}
              disabled={loading}
            >
              {loading && selectedPlan === currentPlan.id ? "Processing..." : `Get started with ${currentPlan.name}`}
            </button>

     
          </div>

          {/* Right side - Features */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Everything you need for SEO success</h2>

            <ul className="space-y-6">
              {features.map((feature, index) => (
                <li key={index} className="grid gap-2">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">{feature.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* ROI calculator */}
            <div className="mt-10 bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">See your potential ROI</h3>
              <p className="text-gray-600 mb-4">
                With our {currentPlan.name} plan, you'll get {currentPlan.credits} articles per month. Based on industry
                averages:
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-gray-700">
                    <span className="font-medium">+{currentPlan.credits * 50}</span> monthly organic visitors
                  </span>
                </li>
                <li className="flex items-center">
                  <Users className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-gray-700">
                    <span className="font-medium">+{Math.round(currentPlan.credits * 50 * 0.03)}</span> new leads per
                    month
                  </span>
                </li>
                <li className="flex items-center">
                  <Award className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-gray-700">
                    <span className="font-medium">${Math.round(currentPlan.credits * 50 * 0.03 * 100)}</span> potential
                    monthly revenue
                  </span>
                </li>
              </ul>
              <div className="text-sm text-gray-500">
                *Based on industry averages. Results may vary based on your industry, website authority, and
                implementation.
              </div>
            </div>
          </div>
        </div>

        {/* FAQ section with accordion */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-2 text-gray-600">Everything you need to know about our content platform</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg border overflow-hidden transition-all duration-200 ${
                  openFaqIndex === index ? "shadow-md" : "shadow-sm"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  aria-expanded={openFaqIndex === index}
                >
                  <h3 className="font-bold text-lg text-gray-900">{item.question}</h3>
                  {openFaqIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                <div
                  className={`px-6 overflow-hidden transition-all duration-200 ease-in-out ${
                    openFaqIndex === index ? "max-h-96 pb-6" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Support CTA */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Still have questions? We're here to help.</p>
            <button className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
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
                className="mr-2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
