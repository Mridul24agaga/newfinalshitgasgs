"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { generateBlog } from "../../actions"
import { createClient } from "@/utitls/supabase/client"
import { Link2, AlertCircle, Loader2, ArrowRight, Calendar, Clock, CreditCard } from "lucide-react"
import { Saira } from "next/font/google"

// Initialize the Saira font
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-saira",
})

interface URLFormProps {
  onContentGenerated?: () => void
}

interface Subscription {
  plan_id: string
  credits: number
  billing_cycle?: string
  subscription_type?: string
  monthly_price?: number
  annual_price?: number
  annual_discount_percentage?: number
  currency?: string
  current_period_end?: string
}

export default function URLForm({ onContentGenerated }: URLFormProps) {
  const [url, setUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [userPlan, setUserPlan] = useState<string | null>(null)
  const [subscriptionType, setSubscriptionType] = useState<string | null>(null)
  const [totalCredits, setTotalCredits] = useState<number>(0)
  const [remainingCredits, setRemainingCredits] = useState<number>(0)
  const [creditsUsed, setCreditsUsed] = useState<number>(0)
  const [renewalDate, setRenewalDate] = useState<string | null>(null)
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null)
  const [priceInfo, setPriceInfo] = useState<{
    monthlyPrice: number | null
    annualPrice: number | null
    currency: string
  }>({
    monthlyPrice: null,
    annualPrice: null,
    currency: "USD",
  })
  const supabase = createClient()

  // Plan credits mapping
  const planCreditsMap: { [key: string]: number } = {
    trial: 2,
    starter: 30,
    professional: 60,
    basic: 30, // Map basic to starter
    pro: 60, // Map pro to professional
  }

  // Calculate monthly credits for annual subscribers based on current month
  const getDaysInCurrentMonth = () => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  }

  useEffect(() => {
    fetchSubscriptionData()
    setupRealtimeSubscription()
  }, [])

  const setupRealtimeSubscription = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error || !user) {
        console.error("Failed to get user for real-time subscription:", error)
        return
      }

      const userId = user.id

      const subscription = supabase
        .channel("subscriptions")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "subscriptions",
            filter: `user_id=eq.${userId}`,
          },
          async (payload) => {
            console.log("Subscription change detected:", payload)
            if (payload.new) {
              await fetchSubscriptionData()
            }
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(subscription)
      }
    } catch (error) {
      console.error("Error setting up realtime subscription:", error)
    }
  }

  const fetchSubscriptionData = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        console.error("No authenticated user found:", authError)
        setError("Please log in to continue")
        return
      }

      const userId = user.id

      // Get subscription data with new columns
      const { data: subscription, error: subError } = await supabase
        .from("subscriptions")
        .select(
          "plan_id, credits, billing_cycle, subscription_type, monthly_price, annual_price, annual_discount_percentage, currency, current_period_end",
        )
        .eq("user_id", userId)
        .single()

      if (subError) {
        console.error("Subscription fetch error:", subError)
        setError("Could not fetch your subscription details")
        return
      }

      if (subscription && subscription.plan_id) {
        const planId = subscription.plan_id.toLowerCase()

        // Check if billing_cycle is exactly "annually" for annual subscriptions
        const isAnnual = subscription.billing_cycle === "annually"

        // Get the appropriate credit amount based on plan and billing cycle
        let maxCredits = planCreditsMap[planId] || 0

        // For annual plans, calculate monthly credits based on current month
        if (isAnnual) {
          maxCredits = getDaysInCurrentMonth()
        }

        // Get blog count to calculate used credits
        const { data: blogs, error: blogsError } = await supabase
          .from("blogs")
          .select("id", { count: "exact" })
          .eq("user_id", userId)

        if (blogsError) {
          console.error("Error fetching blogs count:", blogsError)
        }

        const blogsCount = blogs?.length || 0
        const used = Math.min(blogsCount, maxCredits)
        const remaining = subscription.credits || 0

        // Use subscription_type if available, otherwise fall back to billing_cycle
        const subType = isAnnual ? "annual" : "monthly"

        setUserPlan(planId)
        setSubscriptionType(subType)
        setTotalCredits(maxCredits)
        setRemainingCredits(remaining)
        setCreditsUsed(used)
        setRenewalDate(subscription.current_period_end || null)
        setCurrentSubscription(subscription)
        setPriceInfo({
          monthlyPrice: subscription.monthly_price || null,
          annualPrice: subscription.annual_price || null,
          currency: subscription.currency || "USD",
        })

        console.log(
          `Subscription data: Plan=${planId}, Type=${subType}, Total=${maxCredits}, Remaining=${remaining}, Used=${used}`,
        )
      } else {
        setError("No subscription found. Please upgrade your plan.")
      }
    } catch (error) {
      console.error("Error fetching subscription data:", error)
      setError("Something went wrong loading your plan")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }
    if (remainingCredits <= 0) {
      setError("No credits remaining! Upgrade your plan or wait for a reset.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await generateBlog(url)

      if (result && result.length > 0) {
        console.log(`Successfully generated ${result.length} blog posts`)

        // Refresh subscription data to get updated credits
        await fetchSubscriptionData()

        // Call the callback to refresh the content planner
        if (onContentGenerated) {
          onContentGenerated()
        }

        // Reset the form
        setUrl("")
      } else {
        throw new Error("No blog posts were generated")
      }
    } catch (error: any) {
      console.error(`Error generating content:`, error)
      setError(`Failed to generate content: ${error.message || "An unexpected error occurred"}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Format plan name for display
  const formatPlanName = (planId: string | null) => {
    if (!planId) return null
    const plan = planId.toLowerCase()
    if (plan === "basic") return "Starter"
    if (plan === "pro") return "Professional"
    return planId.charAt(0).toUpperCase() + planId.slice(1)
  }

  // Calculate percentage for progress bar
  const calculatePercentage = () => {
    if (totalCredits === 0) return 0
    return Math.min(100, (creditsUsed / totalCredits) * 100)
  }

  // Calculate days until renewal
  const getDaysUntilRenewal = () => {
    if (!renewalDate) return null

    const today = new Date()
    const renewalDateObj = new Date(renewalDate)
    const diffTime = renewalDateObj.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays > 0 ? diffDays : 0
  }

  // Format currency
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return ""

    const currency = priceInfo.currency || "USD"
    if (currency === "USD") {
      return `$${amount}`
    } else {
      return `₹${amount >= 1000 ? `${amount / 1000}K` : amount}`
    }
  }

  // Only consider it annual if billing_cycle is exactly "annually"
  const isAnnual = currentSubscription?.billing_cycle === "annually"

  const daysUntilRenewal = getDaysUntilRenewal()

  return (
    <div
      className={`${saira.className} bg-white rounded-2xl border border-orange-200 overflow-hidden transition-all duration-300 mb-8`}
    >
      <div className="p-8 pt-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="url" className="block text-sm font-semibold text-orange-900">
              Website URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Link2 className="h-5 w-5 text-orange-500" />
              </div>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-orange-50 disabled:text-orange-400 transition-all duration-200 placeholder:text-orange-300"
              />
            </div>
          </div>

          {userPlan && !isLoading && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-4 bg-orange-50 rounded-lg border border-orange-100">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-orange-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Your Plan:</p>
                    <p className="text-base font-semibold text-orange-600">
                      {formatPlanName(userPlan)}{" "}
                      {isAnnual && (
                        <span className="inline-flex items-center text-green-600 text-sm">
                          (Yearly <Calendar className="ml-1 h-3 w-3" />)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {(priceInfo.monthlyPrice || priceInfo.annualPrice) && (
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-700">{isAnnual ? "Annual Price:" : "Monthly Price:"}</p>
                    <p className="text-base font-semibold text-orange-600">
                      {isAnnual
                        ? formatCurrency(priceInfo.annualPrice) + "/month"
                        : formatCurrency(priceInfo.monthlyPrice) + "/month"}
                    </p>
                  </div>
                )}

                {daysUntilRenewal !== null && (
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-orange-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Renews in:</p>
                      <p className="text-base font-semibold text-orange-600">{daysUntilRenewal} days</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-500">
                    {isAnnual ? "Monthly Credits Remaining" : "Credits Remaining"}
                  </p>
                  <p className="text-sm font-medium">
                    {remainingCredits} / {totalCredits} credits
                  </p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 border border-gray-200">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-orange-500 h-4 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                    style={{ width: `${calculatePercentage()}%` }}
                  >
                    {calculatePercentage() > 15 && (
                      <span className="text-xs font-medium text-white">{Math.round(calculatePercentage())}%</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span className="font-medium text-orange-600">{creditsUsed} credits used</span>
                  <span>{remainingCredits} remaining</span>
                </div>

                {isAnnual && (
                  <div className="mt-2 text-xs text-gray-600">
                    <p>Annual plan: {totalCredits} credits this month (based on days in the month)</p>
                    <p>Total for the year: ~365 credits (unlocked monthly based on calendar days)</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Oops! Something went wrong</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <div className="flex items-center">
                <Loader2 className="animate-spin h-5 w-5 text-blue-500 mr-3" />
                <span className="text-sm font-medium text-blue-800">
                  Generating blog posts... This may take a few minutes.
                </span>
              </div>
            </div>
          )}

          {remainingCredits === 0 && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-amber-800">All credits used</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    You've used all your available credits for this month.
                    {isAnnual
                      ? " New credits will be unlocked at the beginning of next month."
                      : " Your credits will be refreshed at the beginning of your next billing cycle."}
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`w-full px-6 py-3 rounded-xl text-white font-bold flex items-center justify-center transition-all duration-300 border ${
              isLoading || remainingCredits === 0
                ? "bg-orange-400 border-orange-500 cursor-not-allowed"
                : "bg-orange-500 border-orange-600 hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            }`}
            disabled={isLoading || remainingCredits === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-3 h-5 w-5 text-white" />
                <span>Generating Blog Posts...</span>
              </>
            ) : (
              <>
                <span>Generate Blog Posts</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

