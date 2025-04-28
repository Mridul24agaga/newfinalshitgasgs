"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utitls/supabase/client"
import { AppSidebar } from "../components/sidebar"
import type { User } from "@supabase/supabase-js"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserProfile {
  username: string
  email: string
}

interface Subscription {
  id: string
  user_id: string
  plan_id: string
  credits: number
  status: string
  current_period_start: string
  billing_cycle?: string
  subscription_type?: string
}

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
  tier?: 1 | 2
  color?: string
  gradient?: string
}

// Use the test mode URL for Dodo Payments
const DODO_URL = "https://checkout.dodopayments.com/buy"

// Plans data with enhanced styling
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
    color: "bg-gray-100 text-gray-800",
    gradient: "from-gray-400 to-gray-500",
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
    color: "bg-blue-100 text-blue-800",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    id: "growth",
    name: "Growth",
    description: "Ideal for growing businesses seeking substantial online growth",
    priceUSD: {
      monthly: 40,
      annually: 17.25,
      yearlyTotal: 207,
    },
    credits: 30,
    dodoProductId: {
      monthly: "pdt_P2vmzA58J1kOlgHBKlGNN",
      annually: "pdt_u7QVCpYU5X4Ap16Ad2iP5",
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
    color: "bg-purple-100 text-purple-800",
    gradient: "from-purple-400 to-purple-600",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Perfect for established businesses aiming for high-impact results",
    priceUSD: {
      monthly: 70,
      annually: 30,
      yearlyTotal: 362,
    },
    credits: 60,
    dodoProductId: {
      monthly: "pdt_09SSladZHqE5hTjxb2Pst",
      annually: "pdt_EaLdjsytLh65LQmAECiJ2",
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
    color: "bg-amber-100 text-amber-800",
    gradient: "from-amber-400 to-amber-600",
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
    color: "bg-emerald-100 text-emerald-800",
    gradient: "from-emerald-400 to-emerald-600",
  },
]

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")
  const [showUpgradeOptions, setShowUpgradeOptions] = useState(false)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [processingUpgrade, setProcessingUpgrade] = useState(false)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true)

        // Create client and get current user
        const supabase = createClient()
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
          console.error("Authentication failed:", authError?.message)
          setLoading(false)
          return
        }

        setUser(user)

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("userssignuped")
          .select("username, email")
          .eq("user_id", user.id)
          .single()

        if (profileError && profileError.code !== "PGRST116") {
          console.error("Error fetching profile:", profileError)
        } else if (profileData) {
          setProfile(profileData)
        }

        // Fetch subscription
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from("subscriptions")
          .select("id, user_id, plan_id, credits, status, current_period_start, billing_cycle, subscription_type")
          .eq("user_id", user.id)
          .single()

        if (subscriptionError && subscriptionError.code !== "PGRST116") {
          console.error("Error fetching subscription:", subscriptionError)
        } else if (subscriptionData) {
          setSubscription(subscriptionData)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!profile?.username) return "U"
    return profile.username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Get plan color based on plan_id
  const getPlanColor = (planId: string) => {
    const plan = plans.find((p) => p.id === planId)
    return plan?.color || "bg-gray-100 text-gray-800"
  }

  // Get plan gradient based on plan_id
  const getPlanGradient = (planId: string) => {
    const plan = plans.find((p) => p.id === planId)
    return plan?.gradient || "from-gray-400 to-gray-500"
  }

  // Get plan name from ID
  const getPlanName = (planId: string) => {
    const plan = plans.find((p) => p.id === planId)
    return plan ? plan.name : planId
  }

  // Get plan icon from ID
  const getPlanIcon = (planId: string) => {
    const plan = plans.find((p) => p.id === planId)
    return null
  }

  // Update the getUpgradePlans function to show all plans for yearly billing
  const getUpgradePlans = () => {
    // If on annual billing, only show Growth and Professional plans
    if (billingCycle === "annually") {
      return plans.filter((plan) => plan.id === "growth" || plan.id === "professional")
    }

    // For monthly billing, use the original logic
    if (!subscription) {
      return plans
    }

    // Find the current plan index
    const currentPlanIndex = plans.findIndex((p) => p.id === subscription.plan_id)
    if (currentPlanIndex === -1) return plans

    // Only show plans above the current plan for monthly billing
    return plans.slice(currentPlanIndex + 1)
  }

  // Modify the shouldShowUpgradeButton function to check for yearly billing cycle
  const shouldShowUpgradeButton = () => {
    // If no subscription, always show upgrade button
    if (!subscription) return true

    // Don't show upgrade button for yearly/annual billing cycles
    if (
      subscription.billing_cycle === "annually" ||
      subscription.billing_cycle === "annual" ||
      subscription.subscription_type === "annually" ||
      subscription.subscription_type === "annual"
    ) {
      return false
    }

    // Check if there are higher tier plans available for monthly subscribers
    const currentPlanIndex = plans.findIndex((p) => p.id === subscription.plan_id)
    return currentPlanIndex < plans.length - 1
  }

  // Add a function to check if the user is on a yearly plan
  const isYearlyPlan = () => {
    if (!subscription) return false
    return (
      subscription.billing_cycle === "annually" ||
      subscription.billing_cycle === "annual" ||
      subscription.subscription_type === "annually" ||
      subscription.subscription_type === "annual"
    )
  }

  // Calculate credits for yearly plans (current + plan credits * 12)
  const calculateYearlyCredits = (plan: Plan) => {
    const existingCredits = subscription?.credits || 0
    const yearlyCredits = plan.credits * 12
    return existingCredits + yearlyCredits
  }

  // Calculate credits for monthly plans (current + plan credits)
  const calculateMonthlyCredits = (plan: Plan) => {
    const existingCredits = subscription?.credits || 0
    return existingCredits + plan.credits
  }

  // Handle subscription upgrade
  const handleUpgrade = async (plan: Plan) => {
    setProcessingUpgrade(true)
    setSelectedPlan(plan.id)

    try {
      const supabase = createClient()

      // Check if user exists
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) throw new Error(`Authentication error: ${authError.message}`)
      if (!user) throw new Error("User not authenticated")

      // Get price information based on billing cycle
      const prices = plan.priceUSD
      const price = billingCycle === "annually" ? prices.annually : prices.monthly
      const monthlyPrice = prices.monthly
      const annualPrice = prices.annually
      const annualDiscountPercentage = plan.annualDiscountPercentage || 20

      // Calculate total credits based on billing cycle
      const existingCredits = subscription?.credits || 0
      const newCredits = billingCycle === "annually" ? plan.credits * 12 : plan.credits
      const totalCredits = existingCredits + newCredits

      console.log(
        `Upgrading plan: Adding ${newCredits} credits (${billingCycle}) to existing ${existingCredits} credits. Total: ${totalCredits}`,
      )

      // Make sure billing cycle is correctly formatted
      const billingCycleValue = billingCycle === "annually" ? "annually" : "monthly"

      // Record the checkout attempt in Supabase
      await supabase.from("checkout_attempts").insert({
        user_id: user.id,
        plan_id: plan.id,
        timestamp: new Date().toISOString(),
        existing_credits: existingCredits,
        new_credits: newCredits,
        total_credits: totalCredits,
        billing_cycle: billingCycleValue,
      })

      // Build success URL with all necessary parameters
      const successUrl = encodeURIComponent(
        `${window.location.origin}/payment-upgrade?` +
          `user_id=${user.id}&` +
          `plan_id=${plan.id}&` +
          `price=${price}&` +
          `credits=${newCredits}&` +
          `existing_credits=${existingCredits}&` +
          `new_credits=${newCredits}&` +
          `total_credits=${totalCredits}&` +
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
    } catch (error) {
      console.error("Upgrade error:", error)
      alert("Failed to process upgrade. Please try again.")
    } finally {
      setProcessingUpgrade(false)
      setSelectedPlan(null)
    }
  }

  // Function to display credit calculation for a plan
  const renderCreditCalculation = (plan: Plan) => {
    if (!subscription) return null

    const existingCredits = subscription.credits || 0
    const newCredits = billingCycle === "annually" ? plan.credits * 12 : plan.credits
    const totalCredits = existingCredits + newCredits

    return (
      <div className="mt-2 p-3 bg-green-50 border border-green-100 rounded-lg">
        <div className="text-xs text-gray-600 mb-1">Credit Calculation</div>
        <div className="grid grid-cols-3 gap-1 text-sm">
          <div className="text-gray-600">Current</div>
          <div className="text-center">+</div>
          <div className="text-right text-gray-600">New Total</div>

          <div className="font-medium">{existingCredits}</div>
          <div className="text-center text-green-600">
            +{newCredits} {billingCycle === "annually" ? "(yearly)" : ""}
          </div>
          <div className="text-right font-bold text-green-700">{totalCredits}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AppSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Account
              </h1>
              <p className="text-gray-500 mt-1">Manage your account settings and subscription</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-6">
              <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="h-7 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mt-2"></div>
                </div>
                <div className="p-6 pt-0">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="grid gap-4 mt-6">
                    <div className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="h-7 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mt-2"></div>
                </div>
                <div className="p-6 pt-0">
                  <div className="space-y-4">
                    <div className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : !user ? (
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold">Authentication Required</h2>
                <p className="text-gray-500 text-sm mt-1">Please sign in to view your account details.</p>
              </div>
              <div className="p-6 pt-0">
                <button
                  onClick={() => router.push("/login")}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tabs */}
              <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
                <div className="border-b border-gray-200">
                  <div className="flex">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`px-6 py-4 text-sm font-medium transition-colors ${
                        activeTab === "profile"
                          ? "border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50"
                          : "text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => setActiveTab("subscription")}
                      className={`px-6 py-4 text-sm font-medium transition-colors ${
                        activeTab === "subscription"
                          ? "border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50"
                          : "text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Subscription
                    </button>
                  </div>
                </div>

                {/* Profile Tab Content */}
                {activeTab === "profile" && (
                  <div className="p-0">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">Your personal account details</p>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                        <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-white flex items-center justify-center text-xl font-semibold text-white overflow-hidden">
                          <img
                            src={`https://avatar.vercel.sh/${user.id}`}
                            alt={profile?.username || "User"}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                              const fallbackDiv = e.currentTarget.nextSibling as HTMLElement | null
                              if (fallbackDiv) {
                                fallbackDiv.style.display = "flex"
                              }
                            }}
                          />
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ display: "none" }}
                          >
                            {getUserInitials()}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            {profile?.username || "User"}
                          </h3>
                          <div className="flex items-center text-gray-500 mt-2">{profile?.email || user.email}</div>
                          <div className="flex items-center text-gray-500 mt-2">
                            Member since {formatDate(user.created_at || "")}
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-8 md:grid-cols-2">
                        <div className="bg-white rounded-lg border border-gray-100 p-6 hover:border-indigo-200 transition-colors">
                          <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">Email Address</h4>
                          <div className="flex items-center justify-between">
                            <p className="text-base font-medium">{profile?.email || user.email}</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Verified
                            </span>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-100 p-6 hover:border-indigo-200 transition-colors">
                          <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">Username</h4>
                          <p className="text-base font-medium">{profile?.username || "Not set"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subscription Tab Content */}
                {activeTab === "subscription" && !showUpgradeOptions && (
                  <div className="p-0">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Subscription Details</h2>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">Your current plan and usage</p>
                    </div>
                    {subscription ? (
                      <>
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div className="flex items-center">
                              <div
                                className={`h-14 w-14 rounded-full bg-gradient-to-br ${getPlanGradient(subscription.plan_id)} flex items-center justify-center text-white mr-4`}
                              >
                                {getPlanIcon(subscription.plan_id)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-xl font-bold text-gray-900">
                                    {getPlanName(subscription.plan_id)} Plan
                                  </h3>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanColor(
                                      subscription.plan_id,
                                    )}`}
                                  >
                                    {subscription.status}
                                  </span>
                                  {isYearlyPlan() && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                      Yearly Plan
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-500 mt-1 flex items-center">
                                  Renewed on {formatDate(subscription.current_period_start)}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {!isYearlyPlan() && (
                                <>
                                  <button
                                    onClick={() => {
                                      setBillingCycle("monthly")
                                      setShowUpgradeOptions(true)
                                    }}
                                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5"
                                  >
                                    Upgrade Plan
                                  </button>
                                  <button
                                    onClick={() => {
                                      setBillingCycle("annually")
                                      setShowUpgradeOptions(true)
                                    }}
                                    className="px-5 py-2.5 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5"
                                  >
                                    Yearly Plans
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="grid gap-8 md:grid-cols-2">
                            <div className="bg-white rounded-lg border border-gray-100 p-6 hover:border-indigo-200 transition-colors">
                              <h4 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                                Billing Information
                              </h4>
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Billing Cycle</span>
                                  <span className="font-medium text-gray-900">
                                    {isYearlyPlan() ? "Yearly" : "Monthly"}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Next Billing Date</span>
                                  <span className="font-medium text-gray-900">
                                    {formatDate(
                                      new Date(
                                        new Date(subscription.current_period_start).setMonth(
                                          new Date(subscription.current_period_start).getMonth() +
                                            (isYearlyPlan() ? 12 : 1),
                                        ),
                                      ).toISOString(),
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-100 p-6 hover:border-indigo-200 transition-colors">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-medium text-gray-500 flex items-center">
                                  Available Credits
                                </h4>
                                <div className="relative">
                                  <button
                                    className="text-gray-400 hover:text-gray-600"
                                    onMouseEnter={() => setShowTooltip("credits")}
                                    onMouseLeave={() => setShowTooltip(null)}
                                  >
                                    ?
                                  </button>
                                  {showTooltip === "credits" && (
                                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 z-10">
                                      Credits are used for generating content. Each credit equals one article.
                                      <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-baseline">
                                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500">
                                  {subscription.credits}
                                </span>
                                <span className="text-gray-500 ml-2">credits remaining</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-500 ease-out"
                                  style={{ width: `${Math.min(100, (subscription.credits / 100) * 100)}%` }}
                                ></div>
                              </div>
                              <button
                                onClick={() => {
                                  setBillingCycle("monthly")
                                  setShowUpgradeOptions(true)
                                }}
                                className="mt-6 w-full px-4 py-2.5 border border-indigo-300 text-indigo-600 rounded-lg text-sm font-medium bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center justify-center"
                              >
                                Add Credits
                              </button>
                            </div>
                          </div>

                          {isYearlyPlan() && (
                            <div className="mt-8 p-4 bg-purple-50 border border-purple-100 rounded-lg">
                              <h4 className="font-medium text-purple-800 mb-2">Yearly Plan Benefits</h4>
                              <p className="text-purple-700 text-sm">
                                You're on a yearly plan with {subscription.credits} credits. Yearly plans cannot be
                                upgraded mid-term. Your plan will renew on{" "}
                                {formatDate(
                                  new Date(
                                    new Date(subscription.current_period_start).setMonth(
                                      new Date(subscription.current_period_start).getMonth() + 12,
                                    ),
                                  ).toISOString(),
                                )}
                                .
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="p-6">
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                          <div className="h-24 w-24 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center mb-6">
                            No Plan
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            No Active Subscription
                          </h3>
                          <p className="text-gray-600 mb-8 max-w-md">
                            You don't have an active subscription. Choose a plan to get started with our services and
                            unlock premium features.
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setBillingCycle("monthly")
                                setShowUpgradeOptions(true)
                              }}
                              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 flex items-center"
                            >
                              Monthly Plans
                            </button>
                            <button
                              onClick={() => {
                                setBillingCycle("annually")
                                setShowUpgradeOptions(true)
                              }}
                              className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 flex items-center"
                            >
                              Yearly Plans
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Upgrade Options */}
                {activeTab === "subscription" && showUpgradeOptions && (
                  <div className="p-0">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-between">
                      <div className="flex items-center">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {billingCycle === "annually" ? "Yearly Plans" : "Upgrade Your Plan"}
                        </h2>
                      </div>
                      <button
                        onClick={() => setShowUpgradeOptions(false)}
                        className="flex items-center text-gray-500 hover:text-gray-700 transition-colors bg-white px-3 py-1.5 rounded-full hover:bg-gray-100"
                      >
                        <ArrowLeft className="mr-1.5 h-4 w-4" />
                        Back to Subscription
                      </button>
                    </div>

                    <div className="p-6">
                      {/* Billing Toggle */}
                      <div className="flex justify-center mb-12">
                        <div className="inline-flex rounded-full bg-white p-1.5 border border-gray-200">
                          <button
                            onClick={() => setBillingCycle("monthly")}
                            className={`px-8 py-3 rounded-full font-medium text-sm transition-all ${
                              billingCycle === "monthly"
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            Monthly
                          </button>
                          <button
                            onClick={() => setBillingCycle("annually")}
                            className={`px-8 py-3 rounded-full font-medium text-sm transition-all flex items-center ${
                              billingCycle === "annually"
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            Annually
                            <span className="ml-2 bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                              SAVE UP TO 57%
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Yearly Plan Highlight */}
                      {billingCycle === "annually" && (
                        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                          <h3 className="text-lg font-semibold text-amber-800 mb-2">Yearly Plan Benefits</h3>
                          <p className="!text-amber-700">
                            Get up to 57% discount and receive 12 months worth of credits upfront!
                          </p>
                        </div>
                      )}

                      {/* Plans Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {getUpgradePlans().map((plan) => (
                          <div
                            key={plan.id}
                            className={`bg-white rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                              plan.isBestValue ? "border-indigo-400" : "border-gray-200"
                            } hover:translate-y-[-8px] relative group`}
                          >
                            {/* Best Value Badge */}
                            {plan.id === "growth" && billingCycle === "annually" && (
                              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                                MOST POPULAR
                              </div>
                            )}

                            {/* Header */}
                            <div
                              className={`p-6 ${plan.isBestValue ? "bg-gradient-to-br from-indigo-50 to-purple-50" : ""}`}
                            >
                              <div className="mb-4">
                                <div>
                                  <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                                  <p className="text-gray-600 text-sm">{plan.description}</p>
                                </div>
                              </div>

                              {/* Annual discount badge */}
                              {billingCycle === "annually" && (plan.id === "growth" || plan.id === "professional") && (
                                <div className="bg-green-100 rounded-md py-2 px-3 mb-4 text-center border border-green-200">
                                  <span className="text-green-700 font-medium flex items-center justify-center">
                                    SAVE {plan.annualDiscountPercentage}% ANNUALLY
                                  </span>
                                </div>
                              )}

                              {/* Pricing */}
                              <div
                                className={`mb-6 ${
                                  plan.isBestValue
                                    ? "bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg p-5"
                                    : "bg-gray-50 rounded-lg p-5"
                                }`}
                              >
                                <div className="flex items-baseline justify-center">
                                  <span className="text-gray-500 mr-1">$</span>
                                  <span
                                    className={`text-4xl font-bold ${
                                      plan.isBestValue
                                        ? "bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {billingCycle === "annually" ? plan.priceUSD.annually : plan.priceUSD.monthly}
                                  </span>
                                  <span className="text-gray-500 ml-1">/mo</span>
                                </div>

                                {billingCycle === "annually" && (
                                  <div className="text-center mt-2">
                                    <span className="text-sm text-gray-600">
                                      ${plan.priceUSD.yearlyTotal} billed yearly ({plan.annualDiscountPercentage}% off)
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Credits */}
                              <div className="bg-gray-50 rounded-lg p-4 mb-3 text-center border border-gray-100 group-hover:border-indigo-100 transition-colors">
                                <span className="font-medium text-gray-900">
                                  {plan.credits} credits/month
                                  {billingCycle === "annually" && (
                                    <span className="ml-1 text-green-600">({plan.credits * 12} total)</span>
                                  )}
                                </span>
                              </div>

                              {/* Credit calculation - only show for existing subscribers */}
                              {subscription && renderCreditCalculation(plan)}

                              {/* CTA Button */}
                              <button
                                className={`w-full py-3.5 rounded-lg font-medium mb-6 transition-all ${
                                  plan.isBestValue
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                                    : "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                                }`}
                                onClick={() => handleUpgrade(plan)}
                                disabled={processingUpgrade && selectedPlan === plan.id}
                              >
                                {processingUpgrade && selectedPlan === plan.id ? (
                                  <span className="flex items-center justify-center">
                                    <svg
                                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    Processing...
                                  </span>
                                ) : (
                                  <span className="flex items-center justify-center">
                                    {billingCycle === "annually"
                                      ? `Get Yearly ${plan.name}`
                                      : plan.id === "trial"
                                        ? "Start Your Trial"
                                        : `Choose ${plan.name}`}
                                  </span>
                                )}
                              </button>

                              {/* Features */}
                              <div>
                                <p className="font-medium mb-3 text-gray-900">What's included:</p>
                                <ul className="space-y-3">
                                  {plan.features.map((feature, i) => (
                                    <li key={i}>
                                      <span className="text-gray-700 text-sm">{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Additional Information */}
                      <div className="mt-12 text-center bg-white p-6 rounded-xl border border-gray-100">
                        <p className="text-gray-600 text-sm flex items-center justify-center">
                          All plans include a 14-day money-back guarantee. No questions asked.
                        </p>
                        <p className="text-gray-600 text-sm mt-3 flex items-center justify-center">
                          Need a custom plan?{" "}
                          <a
                            href="/contact"
                            className="text-indigo-600 hover:underline ml-1 flex items-center font-medium"
                          >
                            Contact us
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
