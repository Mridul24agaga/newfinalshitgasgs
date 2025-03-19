"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/utitls/supabase/client"
import {
  Menu,
  CreditCard,
  FileText,
  Lightbulb,
  Users,
  ArrowRight,
  Check,
  Sparkles,
  Target,
  Settings,
  Key,
  LogOut,
  Calendar,
} from "lucide-react"
import { Sidebar } from "@/app/components/sidebar"
import { PaymentPage } from "@/app/components/PaymentPage"

interface DashboardShellProps {
  user: User
}

interface Subscription {
  plan_id: string
  credits: number
  status?: string
  current_period_end?: string
  billing_cycle?: string
  subscription_type?: string
  monthly_price?: number
  annual_price?: number
  annual_discount_percentage?: number
  currency?: string
  onboarding_completed?: boolean
}

export function DashboardShell({ user }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [showPaymentPage, setShowPaymentPage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [completionStatus, setCompletionStatus] = useState({
    contentIdeas: false,
    blogSettings: false,
    audienceKeywords: false,
  })
  const [stats, setStats] = useState({
    postsCreated: 0,
    ideasGenerated: 0,
    creditsUsed: 0,
  })
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Plan credits mapping
  const planCreditsMap: { [key: string]: number } = {
    trial: 2,
    starter: 30,
    professional: 60,
    basic: 30, // Map basic to starter
    pro: 60, // Map pro to professional
  }

  // Add debug info function
  const addDebugInfo = (info: string) => {
    console.log(info)
    // Only add to debug info in development and inside effects/handlers
    if (process.env.NODE_ENV === "development") {
      setDebugInfo((prev) => [...prev, info])
    }
  }

  // Handle window resize for sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle initial data loading
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      await setupRealtimeSubscription()
      await checkOnboardingStatus()
      setIsLoading(false)
    }

    const userId = searchParams.get("user_id")
    const plan = searchParams.get("plan")
    const credits = searchParams.get("credits")
    const billingCycle = searchParams.get("billing_cycle")
    const monthlyPrice = searchParams.get("monthly_price")
    const annualPrice = searchParams.get("annual_price")
    const currency = searchParams.get("currency")

    if (userId && plan && credits) {
      handlePaymentSuccess(
        userId,
        plan,
        Number.parseInt(credits),
        billingCycle || "monthly",
        monthlyPrice ? Number.parseFloat(monthlyPrice) : undefined,
        annualPrice ? Number.parseFloat(annualPrice) : undefined,
        currency || "USD",
      )
    } else {
      fetchData()
    }
  }, [searchParams])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Check if the click is outside the dropdown and its trigger button
      if (
        isProfileOpen &&
        !target.closest('[aria-haspopup="true"]') &&
        !target.closest(".absolute") // Don't close when clicking inside the dropdown
      ) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isProfileOpen])

  // Check onboarding status
  const checkOnboardingStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("onboarding_completed")
        .eq("user_id", user.id)
        .single()

      if (error) {
        console.error("Error checking onboarding status:", error.message)
        return
      }

      if (data && data.onboarding_completed) {
        setCompletionStatus({
          contentIdeas: true,
          blogSettings: true,
          audienceKeywords: true,
        })
      }
    } catch (err) {
      console.error("Error checking onboarding status:", err)
    }
  }

  // Add this function after the checkOnboardingStatus function
  const fetchBlogsCount = async () => {
    try {
      const { data, error } = await supabase.from("blogs").select("id", { count: "exact" }).eq("user_id", user.id)

      if (error) {
        console.error("Error fetching blogs count:", error.message)
        return 0
      }

      const count = data?.length || 0
      console.log(`Fetched ${count} blogs for user ${user.id}`)
      return count
    } catch (err) {
      console.error("Error in fetchBlogsCount:", err)
      return 0
    }
  }

  // Modify the setupRealtimeSubscription function to include blog count
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

      // Initial fetch of subscription and blogs count
      const [subscriptionResult, blogsCount] = await Promise.all([
        supabase
          .from("subscriptions")
          .select(
            "plan_id, credits, status, current_period_end, billing_cycle, subscription_type, monthly_price, annual_price, annual_discount_percentage, currency, onboarding_completed",
          )
          .eq("user_id", userId)
          .single(),
        fetchBlogsCount(),
      ])

      const { data: subscriptionData, error: fetchError } = subscriptionResult

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          console.log("No subscription found for user")
          setShowPaymentPage(true)
        } else {
          console.error("Error fetching subscription:", fetchError.message, fetchError.details)
        }
        return
      }

      if (subscriptionData) {
        addDebugInfo(`Subscription data: ${JSON.stringify(subscriptionData)}`)

        const planId = subscriptionData.plan_id.toLowerCase()
        const maxPosts = planCreditsMap[planId] || 0

        // Reset credits if they don't match the plan's max or are null
        if (subscriptionData.credits === null || subscriptionData.credits !== maxPosts) {
          const { error: updateError } = await supabase
            .from("subscriptions")
            .update({ credits: maxPosts })
            .eq("user_id", userId)
          if (updateError) {
            console.error("Failed to reset credits:", updateError)
          } else {
            subscriptionData.credits = maxPosts
          }
        }

        // Ensure subscription_type is set based on billing_cycle if it's not already set
        if (!subscriptionData.subscription_type && subscriptionData.billing_cycle) {
          const subType = subscriptionData.billing_cycle === "annually" ? "annual" : "monthly"
          addDebugInfo(
            `Setting subscription_type to ${subType} based on billing_cycle ${subscriptionData.billing_cycle}`,
          )

          const { error: updateError } = await supabase
            .from("subscriptions")
            .update({ subscription_type: subType })
            .eq("user_id", userId)
          if (updateError) {
            console.error("Failed to set default subscription type:", updateError)
          } else {
            subscriptionData.subscription_type = subType
          }
        }

        setSubscription(subscriptionData)
        setStats((prev) => ({
          ...prev,
          postsCreated: blogsCount,
          creditsUsed: blogsCount, // Set credits used based on actual blog count
        }))
        setShowPaymentPage(false)
      }

      // Set up real-time subscription
      const subscriptionChannel = supabase
        .channel("subscriptions-changes")
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
              const updatedSubscription = payload.new as Subscription
              const planId = updatedSubscription.plan_id.toLowerCase()
              const maxPosts = planCreditsMap[planId] || 0

              if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
                const shouldResetCredits =
                  payload.eventType === "INSERT" ||
                  (payload.old && payload.old.plan_id !== updatedSubscription.plan_id) ||
                  updatedSubscription.credits !== maxPosts

                if (shouldResetCredits) {
                  console.log(`Resetting credits to ${maxPosts} for plan ${planId}`)
                  const { error: updateError } = await supabase
                    .from("subscriptions")
                    .update({ credits: maxPosts })
                    .eq("user_id", userId)
                  if (updateError) {
                    console.error("Failed to reset credits:", updateError)
                  } else {
                    updatedSubscription.credits = maxPosts
                  }
                }
              }

              // Get updated blog count when subscription changes
              const currentBlogsCount = await fetchBlogsCount()

              setSubscription(updatedSubscription)
              setStats((prev) => ({
                ...prev,
                postsCreated: currentBlogsCount,
                creditsUsed: currentBlogsCount,
              }))
            }
          },
        )
        .subscribe()

      // Also listen for blog changes
      const blogsChannel = supabase
        .channel("blogs-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "blogs",
            filter: `user_id=eq.${userId}`,
          },
          async () => {
            console.log("Blog change detected, updating count")
            const currentBlogsCount = await fetchBlogsCount()
            setStats((prev) => ({
              ...prev,
              postsCreated: currentBlogsCount,
              creditsUsed: currentBlogsCount,
            }))
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(subscriptionChannel)
        supabase.removeChannel(blogsChannel)
      }
    } catch (err) {
      console.error("Unexpected error while setting up subscription:", err)
    }
  }

  // Handle payment success
  const handlePaymentSuccess = async (
    userId: string,
    plan: string,
    credits: number,
    billingCycle: string,
    monthlyPrice?: number,
    annualPrice?: number,
    currency = "USD",
  ) => {
    try {
      addDebugInfo(
        `Processing payment success: Plan=${plan}, Billing=${billingCycle}, Credits=${credits}, Monthly=${monthlyPrice}, Annual=${annualPrice}, Currency=${currency}`,
      )

      // Calculate period end based on billing cycle
      const currentDate = new Date()
      const periodEnd = new Date(currentDate)

      // Explicitly check for annual billing cycle
      const isAnnual = billingCycle === "annually" || billingCycle === "annual"
      const billingCycleValue = isAnnual ? "annually" : "monthly"
      const subscriptionTypeValue = isAnnual ? "annual" : "monthly"

      addDebugInfo(
        `Billing cycle determination: billingCycle=${billingCycle}, isAnnual=${isAnnual}, billingCycleValue=${billingCycleValue}`,
      )

      if (isAnnual) {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1)
      } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1)
      }

      const subscriptionData = {
        user_id: userId,
        plan_id: plan,
        credits: credits,
        status: "active",
        billing_cycle: billingCycleValue,
        subscription_type: subscriptionTypeValue,
        monthly_price: monthlyPrice || 0,
        annual_price: annualPrice || 0,
        currency: currency,
        current_period_start: currentDate.toISOString(),
        current_period_end: periodEnd.toISOString(),
      }

      addDebugInfo(`Saving subscription data: ${JSON.stringify(subscriptionData)}`)

      const { error } = await supabase.from("subscriptions").upsert(subscriptionData)

      if (error) {
        console.error("Error updating subscription after payment:", error)
        throw error
      }

      await setupRealtimeSubscription()
      router.replace("/dashboard")
    } catch (error) {
      console.error("Error updating subscription after payment:", error)
    }
  }

  // Handle sign out
  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await supabase.auth.signOut()
      router.refresh()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  // Mark step as completed
  const markStepAsCompleted = async (step: keyof typeof completionStatus) => {
    try {
      setCompletionStatus((prev) => ({
        ...prev,
        [step]: true,
      }))

      const updatedStatus = {
        ...completionStatus,
        [step]: true,
      }

      if (Object.values(updatedStatus).every(Boolean)) {
        const { error } = await supabase
          .from("subscriptions")
          .update({ onboarding_completed: true })
          .eq("user_id", user.id)

        if (error) {
          console.error("Error marking onboarding as completed:", error.message)
        }
      }
    } catch (error) {
      console.error(`Error marking ${step} as completed:`, error)
    }
  }

  // Mark all steps as completed
  const markAllAsCompleted = async () => {
    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({ onboarding_completed: true })
        .eq("user_id", user.id)

      if (error) {
        console.error("Error marking onboarding as completed:", error.message)
        return
      }

      setCompletionStatus({
        contentIdeas: true,
        blogSettings: true,
        audienceKeywords: true,
      })
    } catch (error) {
      console.error("Error marking onboarding as completed:", error)
    }
  }

  // Navigate to a page and close the profile dropdown
  const navigateTo = (path: string) => {
    setIsProfileOpen(false)
    router.push(path)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Payment page
  if (showPaymentPage) {
    return <PaymentPage />
  }

  // Calculate subscription metrics
  const totalCredits = subscription ? planCreditsMap[subscription.plan_id.toLowerCase()] || 0 : 0
  const creditsRemaining = subscription?.credits || 0
  const creditsUsagePercentage = totalCredits ? ((totalCredits - creditsRemaining) / totalCredits) * 100 : 0

  // Format plan name for display
  const formatPlanName = (planId: string) => {
    const plan = planId.toLowerCase()
    if (plan === "basic") return "Starter"
    if (plan === "pro") return "Professional"
    return planId.charAt(0).toUpperCase() + planId.slice(1)
  }

  // Determine subscription type - check both fields to be safe
  // Only consider it annual if explicitly set to annual/annually
  const isAnnual =
    subscription?.subscription_type === "annual" ||
    subscription?.subscription_type === "annually" ||
    subscription?.billing_cycle === "annual" ||
    subscription?.billing_cycle === "annually"

  // REMOVE THIS LINE that's causing the infinite loop:
  // addDebugInfo(`Subscription type determination: subscription_type=${subscription?.subscription_type}, billing_cycle=${subscription?.billing_cycle}, isAnnual=${isAnnual}`)

  // Replace with a console.log that doesn't update state:
  console.log(
    `Subscription type: ${subscription?.subscription_type}, billing_cycle=${subscription?.billing_cycle}, isAnnual=${isAnnual}`,
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out lg:translate-x-0`}
      >
        <Sidebar subscription={subscription} />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-gray-500 hover:text-gray-700 mr-3"
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                type="button"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
            </div>

            {/* Profile dropdown */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md hover:shadow-lg transition-all duration-200"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  type="button"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url || "/placeholder.svg"}
                      alt="Profile"
                      className="w-10 h-10 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-medium">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 overflow-hidden transition-all duration-200 ease-in-out">
                    {/* Profile header */}
                    <div className="px-5 py-4 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-100">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md mr-4">
                          {user.user_metadata?.avatar_url ? (
                            <img
                              src={user.user_metadata.avatar_url || "/placeholder.svg"}
                              alt="Profile"
                              className="w-12 h-12 object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-medium text-lg">
                              {user.email?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-lg">
                            {user.user_metadata?.name || user.email?.split("@")[0] || "User"}
                          </p>
                          <p className="text-sm text-gray-600 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-2 px-1">
                      <div className="grid grid-cols-1 gap-0.5">
                        <button
                          onClick={() => navigateTo("/settings")}
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 rounded-lg mx-1 transition-colors duration-150 text-left"
                        >
                          <Settings className="h-4 w-4 mr-3 text-orange-500" />
                          Account Settings
                        </button>

                        <button
                          onClick={() => navigateTo("/apigenerate")}
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 rounded-lg mx-1 transition-colors duration-150 text-left"
                        >
                          <Key className="h-4 w-4 mr-3 text-orange-500" />
                          API Keys
                        </button>
                      </div>
                    </div>

                    {/* Sign out button */}
                    <div className="mt-1 pt-2 border-t border-gray-100">
                      <button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg mx-1 transition-colors duration-150 disabled:opacity-50 text-left"
                      >
                        <LogOut className="h-4 w-4 mr-3 text-red-500" />
                        {isSigningOut ? "Signing out..." : "Log out"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            {/* Welcome banner */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
                    Welcome to Blogosocial <Sparkles className="h-6 w-6" />
                  </h1>
                  <p className="text-orange-100 text-lg">
                    Your AI-powered content creation platform is ready to help you create amazing content.
                  </p>
                </div>
              </div>
            </div>

            {/* Subscription info */}
            {subscription && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Your Subscription</h2>
                  <button
                    onClick={() => router.push("/upgrade")}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Upgrade Plan
                  </button>
                </div>
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Plan</p>
                      <p className="text-2xl font-bold">{formatPlanName(subscription.plan_id)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                      <p className="text-2xl font-bold capitalize">{subscription.status || "Active"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Billing</p>
                      <p className="text-2xl font-bold capitalize flex items-center">
                        {isAnnual ? (
                          <>
                            Yearly <Calendar className="ml-2 h-4 w-4 text-orange-500" />
                          </>
                        ) : (
                          "Monthly"
                        )}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-500">Credits Remaining</p>
                      <p className="text-sm font-medium">
                        {Math.max(0, totalCredits - stats.creditsUsed)} / {totalCredits} credits
                      </p>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4 border border-gray-200">
                      <div
                        className="bg-gradient-to-r from-orange-400 to-orange-500 h-4 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                        style={{ width: `${Math.min(100, (stats.creditsUsed / totalCredits) * 100)}%` }}
                      >
                        {stats.creditsUsed > 0 && (stats.creditsUsed / totalCredits) * 100 > 15 && (
                          <span className="text-xs font-medium text-white">
                            {Math.round((stats.creditsUsed / totalCredits) * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span className="font-medium text-orange-600">{stats.creditsUsed} credits used</span>
                      <span>{Math.max(0, totalCredits - stats.creditsUsed)} remaining</span>
                    </div>
                  </div>
                  {subscription.current_period_end && (
                    <p className="text-sm text-gray-500">
                      {isAnnual ? "Renews yearly on" : "Renews on"}{" "}
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Quick Actions</h2>
              <p className="text-sm text-gray-500 mb-4">Get started with these common tasks</p>
              <div className="grid gap-4 md:grid-cols-2">
                <button
                  onClick={() => router.push("/dashboard/summarizer")}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center">
                    <Target className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Create New Content</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
                <button
                  onClick={() => router.push("/company-database/ideas")}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center">
                    <Lightbulb className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Generate Ideas</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Setup progress */}
            {!subscription?.onboarding_completed && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Setup Progress</h2>
                </div>
                <div className="px-6 py-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700">Completion Status</span>
                    <span className="text-sm font-medium text-gray-700">
                      {Object.values(completionStatus).filter(Boolean).length} of 3 completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                    <div
                      className="bg-orange-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${(Object.values(completionStatus).filter(Boolean).length / 3) * 100}%` }}
                    ></div>
                  </div>
                  <div className="space-y-4">
                    {/* Content Ideas */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              completionStatus.contentIdeas ? "bg-green-100" : "bg-orange-100"
                            }`}
                          >
                            {completionStatus.contentIdeas ? (
                              <Check className="w-5 h-5 text-green-500" />
                            ) : (
                              <Lightbulb className="w-5 h-5 text-orange-500" />
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">Content Ideas</h3>
                          <p className="text-sm text-gray-500">Set up your content idea sources and preferences</p>
                        </div>
                      </div>
                      <button
                        onClick={() => router.push("/company-database/ideas")}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                          completionStatus.contentIdeas
                            ? "text-gray-700 bg-gray-200 hover:bg-gray-300"
                            : "text-white bg-orange-500 hover:bg-orange-600"
                        }`}
                      >
                        {completionStatus.contentIdeas ? "Edit Settings" : "Complete Setup"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>

                    {/* Blog Settings */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              completionStatus.blogSettings ? "bg-green-100" : "bg-orange-100"
                            }`}
                          >
                            {completionStatus.blogSettings ? (
                              <Check className="w-5 h-5 text-green-500" />
                            ) : (
                              <FileText className="w-5 h-5 text-orange-500" />
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">Blog Settings</h3>
                          <p className="text-sm text-gray-500">
                            Configure your blog preferences and publishing strategy
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => router.push("/company-database/blog")}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                          completionStatus.blogSettings
                            ? "text-gray-700 bg-gray-200 hover:bg-gray-300"
                            : "text-white bg-orange-500 hover:bg-orange-600"
                        }`}
                      >
                        {completionStatus.blogSettings ? "Edit Settings" : "Complete Setup"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>

                    {/* Audience and Keywords */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              completionStatus.audienceKeywords ? "bg-green-100" : "bg-orange-100"
                            }`}
                          >
                            {completionStatus.audienceKeywords ? (
                              <Check className="w-5 h-5 text-green-500" />
                            ) : (
                              <Users className="w-5 h-5 text-orange-500" />
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">Audience and Keywords</h3>
                          <p className="text-sm text-gray-500">Define your target audience and important keywords</p>
                        </div>
                      </div>
                      <button
                        onClick={() => router.push("/settings")}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                          completionStatus.audienceKeywords
                            ? "text-gray-700 bg-gray-200 hover:bg-gray-300"
                            : "text-white bg-orange-500 hover:bg-orange-600"
                        }`}
                      >
                        {completionStatus.audienceKeywords ? "Edit Settings" : "Complete Setup"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>

                    {/* Mark all as completed */}
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={markAllAsCompleted}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                      >
                        Mark All Steps as Completed
                        <Check className="ml-2 h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Debug Info (only in development) */}
            {debugInfo.length > 0 && process.env.NODE_ENV === "development" && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                <h3 className="text-sm font-bold mb-2">Debug Information:</h3>
                <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-60">{debugInfo.join("\n")}</pre>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

