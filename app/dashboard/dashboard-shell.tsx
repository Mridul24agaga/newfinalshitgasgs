"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/utitls/supabase/client" // Fixed typo in path
import {
  Menu,
  FileText,
  Lightbulb,
  Users,
  Check,
  Sparkles,
  Target,
  Settings,
  Key,
  LogOut,
  Calendar,
  BarChart3,
  ChevronRight,
  Bell,
  PlusCircle,
  CreditCard,
} from "lucide-react"
import { PaymentPage } from "@/app/components/PaymentPage"
import { Saira } from "next/font/google"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { PenLine, LayoutGrid, BarChart2, Database, Home, ChevronDown, Link2, ExternalLink, Zap } from "lucide-react"

const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-saira",
})

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
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [openSubmenu, setOpenSubmenu] = useState("Company Database")
  const pathname = usePathname()

  const formatPlanName = (planId: string | undefined) => {
    if (!planId) return "No Plan"
    const plan = planId.toLowerCase()
    if (plan === "basic") return "Starter"
    if (plan === "pro") return "Professional"
    return planId.charAt(0).toUpperCase() + planId.slice(1)
  }

  const planName = formatPlanName(subscription?.plan_id)

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Content Planner", href: "/dashboard/summarizer", icon: PenLine },
    {
      name: "Company Database",
      icon: Database,
      subItems: [
        { name: "Content Ideas", href: "/company-database/ideas", icon: Lightbulb },
        { name: "Brand Profile", href: "/company-database/brand", icon: FileText },
        { name: "Blog Settings", href: "/company-database/blog", icon: LayoutGrid },
        { name: "Audience and Keywords", href: "/settings", icon: BarChart2 },
      ],
    },
    {
      name: "Integrations",
      icon: Link2,
      subItems: [{ name: "GetMoreBacklinks", href: "/integrations", icon: ExternalLink }],
    },
  ]

  const planCreditsMap: { [key: string]: number } = {
    trial: 2,
    starter: 30,
    professional: 60,
    basic: 30,
    pro: 60,
  }

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (
        isProfileOpen &&
        !target.closest('[aria-haspopup="true"]') &&
        !target.closest(".absolute")
      ) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isProfileOpen])

  const checkOnboardingStatus = async () => {
    try {
      // Fetch subscriptions, expecting 0 or 1 row
      const { data, error } = await supabase
        .from("subscriptions")
        .select("onboarding_completed")
        .eq("user_id", user.id)
        .limit(1) // Ensure only one row is returned
        .maybeSingle() // Use maybeSingle() instead of single() to handle no rows gracefully

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
      } else if (!data) {
        console.log("No subscription found for user, assuming onboarding not completed")
        // Optionally initialize a default subscription here if needed
      }
    } catch (err) {
      console.error("Unexpected error in checkOnboardingStatus:", err)
    }
  }

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

  const setupRealtimeSubscription = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        console.error("Failed to get user for real-time subscription:", error)
        return
      }

      const userId = user.id
      const [subscriptionResult, blogsCount] = await Promise.all([
        supabase
          .from("subscriptions")
          .select(
            "plan_id, credits, status, current_period_end, billing_cycle, subscription_type, monthly_price, annual_price, annual_discount_percentage, currency, onboarding_completed",
          )
          .eq("user_id", userId)
          .limit(1)
          .maybeSingle(),
        fetchBlogsCount(),
      ])

      const { data: subscriptionData, error: fetchError } = subscriptionResult

      if (fetchError) {
        console.error("Error fetching subscription:", fetchError.message, fetchError.details)
        setShowPaymentPage(true)
        return
      }

      if (subscriptionData) {
        console.log(`Subscription data: ${JSON.stringify(subscriptionData)}`)
        const planId = subscriptionData.plan_id.toLowerCase()
        const maxPosts = planCreditsMap[planId] || 0

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

        if (!subscriptionData.subscription_type && subscriptionData.billing_cycle) {
          const subType = subscriptionData.billing_cycle === "annually" ? "annual" : "monthly"
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
          creditsUsed: blogsCount,
        }))
        setShowPaymentPage(false)
      } else {
        setShowPaymentPage(true)
      }

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
      const currentDate = new Date()
      const periodEnd = new Date(currentDate)
      const isAnnual = billingCycle === "annually" || billingCycle === "annual"
      const billingCycleValue = isAnnual ? "annually" : "monthly"
      const subscriptionTypeValue = isAnnual ? "annual" : "monthly"

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

  const navigateTo = (path: string) => {
    setIsProfileOpen(false)
    router.push(path)
  }

  if (isLoading) {
    return (
      <div className={`${saira.className} min-h-screen flex items-center justify-center bg-gray-100`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (showPaymentPage) {
    return <PaymentPage />
  }

  const totalCredits = subscription ? planCreditsMap[subscription.plan_id.toLowerCase()] || 0 : 0
  const creditsRemaining = subscription?.credits || 0
  const creditsUsagePercentage = totalCredits ? ((totalCredits - creditsRemaining) / totalCredits) * 100 : 0

  const isAnnual =
    subscription?.subscription_type === "annual" ||
    subscription?.subscription_type === "annually" ||
    subscription?.billing_cycle === "annual" ||
    subscription?.billing_cycle === "annually"

  return (
    <div className={`${saira.className} flex h-screen overflow-hidden bg-gray-50`}>
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 h-screen ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out lg:translate-x-0`}
      >
        <div
          className={`${saira.className} w-64 bg-white flex flex-col h-screen text-gray-900 border-r border-gray-200`}
        >
          <div className="flex items-center justify-center p-5 border-b border-gray-200">
            <Image src="/logo.png" alt="Texta.ai Logo" width={140} height={40} className="object-contain" />
          </div>

          <div className="px-5 mt-6 mb-8">
            <Link href="/dashboard/summarizer">
              <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-3.5 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border border-orange-600 shadow-[0_2px_10px_rgba(234,88,12,0.2)]">
                Create Content
              </button>
            </Link>
          </div>

          <nav className="flex-1 px-4 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href || (item.subItems && item.subItems.some((subItem) => pathname === subItem.href))

              if (item.href && !item.subItems) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-[15px] font-medium rounded-xl transition-all duration-200 mb-2 group",
                      isActive
                        ? "text-orange-600 bg-orange-50 border border-orange-100"
                        : "text-gray-700 hover:text-orange-600 hover:bg-orange-50/50 border border-transparent hover:border-orange-100",
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-[18px] h-[18px] mr-3 flex-shrink-0 stroke-[1.5px] transition-colors duration-200",
                        isActive ? "text-orange-500" : "text-gray-500 group-hover:text-orange-500",
                      )}
                    />
                    {item.name}
                    {item.name === "Dashboard" && (
                      <span className="ml-auto text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full border border-orange-200">
                        Home
                      </span>
                    )}
                  </Link>
                )
              }

              return (
                <div key={item.name} className="mb-2">
                  <div
                    className={cn(
                      "flex items-center px-4 py-3 text-[15px] font-medium rounded-xl transition-all duration-200 group",
                      item.href ? "cursor-pointer" : "cursor-default",
                      isActive
                        ? "text-orange-600 bg-orange-50 border border-orange-100"
                        : "text-gray-700 hover:text-orange-600 hover:bg-orange-50/50 border border-transparent hover:border-orange-100",
                    )}
                    onClick={() => item.subItems && setOpenSubmenu(openSubmenu === item.name ? "" : item.name)}
                  >
                    <Icon
                      className={cn(
                        "w-[18px] h-[18px] mr-3 flex-shrink-0 stroke-[1.5px] transition-colors duration-200",
                        isActive ? "text-orange-500" : "text-gray-500 group-hover:text-orange-500",
                      )}
                    />
                    {item.name}
                    {item.subItems && (
                      <ChevronDown
                        className={cn(
                          "ml-auto w-4 h-4 transition-transform duration-300 text-gray-400 group-hover:text-gray-600",
                          openSubmenu === item.name ? "transform rotate-180" : "",
                        )}
                      />
                    )}
                  </div>
                  {item.subItems && openSubmenu === item.name && (
                    <div className="ml-6 space-y-1 mt-1 mb-2">
                      {item.subItems.map((subItem) => {
                        const SubIcon = subItem.icon
                        const isSubActive = pathname === subItem.href

                        if (subItem.name === "GetMoreBacklinks") {
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={cn(
                                "flex flex-col px-4 py-2.5 text-[14px] font-medium rounded-lg transition-all duration-200 group",
                                isSubActive
                                  ? "text-orange-600 bg-orange-50 border border-orange-100"
                                  : "text-gray-600 hover:text-orange-600 hover:bg-orange-50/50 border border-transparent hover:border-orange-100",
                              )}
                            >
                              <div className="flex items-center">
                                <SubIcon
                                  className={cn(
                                    "w-[16px] h-[16px] mr-3 flex-shrink-0 stroke-[1.5px] transition-colors duration-200",
                                    isSubActive ? "text-orange-500" : "text-gray-500 group-hover:text-orange-500",
                                  )}
                                />
                                {subItem.name}
                                <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full border border-green-200 flex items-center">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                                  Active
                                </span>
                              </div>
                              <div className="ml-9 mt-1 text-xs text-gray-500">
                                Auto-publishing blogs to external sites
                              </div>
                            </Link>
                          )
                        }

                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={cn(
                              "flex items-center px-4 py-2.5 text-[14px] font-medium rounded-lg transition-all duration-200 group",
                              isSubActive
                                ? "text-orange-600 bg-orange-50 border border-orange-100"
                                : "text-gray-600 hover:text-orange-600 hover:bg-orange-50/50 border border-transparent hover:border-orange-100",
                            )}
                          >
                            <SubIcon
                              className={cn(
                                "w-[16px] h-[16px] mr-3 flex-shrink-0 stroke-[1.5px] transition-colors duration-200",
                                isSubActive ? "text-orange-500" : "text-gray-500 group-hover:text-orange-500",
                              )}
                            />
                            {subItem.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          <div className="p-5 mt-auto border-t border-gray-200 bg-gradient-to-b from-white to-gray-50">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-2 text-orange-500" />
                  <p className="text-sm font-medium text-gray-800">Credits</p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-bold text-gray-800">{creditsRemaining}</span>
                  <span className="text-xs text-gray-500 ml-1">remaining</span>
                </div>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2.5 border border-gray-200">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-2.5 rounded-full transition-all duration-300 relative"
                  style={{ width: `${totalCredits > 0 ? (stats.creditsUsed / totalCredits) * 100 : 0}%` }}
                >
                  {totalCredits > 0 && stats.creditsUsed / totalCredits > 0.8 && (
                    <span className="absolute -right-1 -top-1 w-3 h-3 bg-orange-500 rounded-full animate-ping opacity-75"></span>
                  )}
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-500 px-1">
                <span>{stats.creditsUsed} used</span>
                <span>{totalCredits} total</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  {subscription && (planName === "Professional" || planName === "Pro") ? (
                    <div className="flex items-center">
                      <Sparkles className="w-4 h-4 mr-1.5 text-orange-500" />
                      <span className="text-sm font-semibold text-orange-500">{planName}</span>
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-gray-700">{planName}</span>
                  )}
                </div>
                <Link
                  href="/upgrade"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-1 transform hover:scale-105 border border-orange-600"
                >
                  <Zap className="w-3.5 h-3.5 mr-1" />
                  Upgrade
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 w-full lg:pl-64">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
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
              <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                <Bell size={20} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-200"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  type="button"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url || "/placeholder.svg"}
                      alt="Profile"
                      className="w-9 h-9 object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-black flex items-center justify-center text-white font-medium">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-md py-1 z-50 border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 mr-3">
                          {user.user_metadata?.avatar_url ? (
                            <img
                              src={user.user_metadata.avatar_url || "/placeholder.svg"}
                              alt="Profile"
                              className="w-10 h-10 object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-medium text-lg">
                              {user.email?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.user_metadata?.name || user.email?.split("@")[0] || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => navigateTo("/settings")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 mr-3 text-gray-500" />
                        Account Settings
                      </button>

                      <button
                        onClick={() => navigateTo("/apigenerate")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Key className="h-4 w-4 mr-3 text-gray-500" />
                        API Keys
                      </button>
                    </div>

                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
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

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
            <div className="bg-black rounded-lg p-6 text-white border border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-orange-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-radial from-orange-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2"></div>
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight mb-2 flex items-center gap-2">
                    Welcome to Blogosocial <Sparkles className="h-5 w-5 text-orange-500" />
                  </h1>
                  <p className="text-gray-300 text-sm">
                    Your professional content creation platform is ready to help you craft engaging content.
                  </p>
                </div>
                <button
                  onClick={() => router.push("/dashboard/summarizer")}
                  className="hidden sm:flex items-center px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-all duration-300 text-sm font-medium border border-orange-600 transform hover:scale-105"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Content
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscription && (
                <div className="md:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium text-gray-900 flex items-center">
                        <span className="text-orange-500 mr-2">★</span>
                        Your Subscription
                      </h2>
                      <button
                        onClick={() => router.push("/upgrade")}
                        className="px-4 py-1.5 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300 text-xs font-medium border border-black transform hover:scale-105"
                      >
                        Upgrade Plan
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Current Plan</p>
                        <p className="text-xl font-bold text-black">{formatPlanName(subscription.plan_id)}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Status</p>
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                          <p className="text-xl font-bold text-black capitalize">{subscription.status || "Active"}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Billing Cycle</p>
                        <p className="text-xl font-bold text-black capitalize flex items-center">
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
                    <div className="mt-6 bg-orange-50 p-4 rounded-lg border border-orange-100">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700 flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-orange-500" />
                          Credits Usage
                        </p>
                        <p className="text-sm font-medium bg-white px-2 py-1 rounded-full border border-orange-200">
                          {Math.max(0, totalCredits - stats.creditsUsed)} / {totalCredits} credits
                        </p>
                      </div>
                      <div className="w-full bg-white rounded-full h-3 overflow-hidden border border-orange-200">
                        <div
                          className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (stats.creditsUsed / totalCredits) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-600">
                        <span className="font-medium text-orange-600">{stats.creditsUsed} credits used</span>
                        <span className="font-medium">{Math.max(0, totalCredits - stats.creditsUsed)} remaining</span>
                      </div>
                    </div>
                    {subscription.current_period_end && (
                      <div className="flex items-center justify-end mt-4 text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        <span>
                          {isAnnual ? "Renews yearly on" : "Renews on"}{" "}
                          <span className="font-medium">
                            {new Date(subscription.current_period_end).toLocaleDateString()}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-orange-500" />
                    Stats
                  </h2>
                </div>
                <div className="p-5">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Posts Created</p>
                      <p className="text-2xl font-bold">{stats.postsCreated}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Credits Used</p>
                      <p className="text-2xl font-bold">{stats.creditsUsed}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <span className="bg-black text-white p-1 rounded-md mr-2 text-xs">PRO</span>
                  Quick Actions
                </h2>
              </div>
              <div className="p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <button
                    onClick={() => router.push("/dashboard/summarizer")}
                    className="flex items-center justify-between p-4 border border-orange-200 rounded-lg hover:border-orange-400 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="flex items-center relative z-10">
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-3 border border-orange-200 group-hover:bg-orange-200 transition-colors duration-300">
                        <Target className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="text-left">
                        <span className="font-medium text-gray-900 text-base">Create New Content</span>
                        <p className="text-xs text-gray-500 mt-1">Craft professional blog posts and articles</p>
                      </div>
                    </span>
                    <ChevronRight className="h-5 w-5 text-orange-400 group-hover:text-orange-600 transition-colors relative z-10" />
                  </button>
                  <button
                    onClick={() => router.push("/company-database/ideas")}
                    className="flex items-center justify-between p-4 border border-orange-200 rounded-lg hover:border-orange-400 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="flex items-center relative z-10">
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-3 border border-orange-200 group-hover:bg-orange-200 transition-colors duration-300">
                        <Lightbulb className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="text-left">
                        <span className="font-medium text-gray-900 text-base">Generate Ideas</span>
                        <p className="text-xs text-gray-500 mt-1">Discover trending content topics</p>
                      </div>
                    </span>
                    <ChevronRight className="h-5 w-5 text-orange-400 group-hover:text-orange-600 transition-colors relative z-10" />
                  </button>
                </div>
              </div>
            </div>

            {!subscription?.onboarding_completed && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-900">Setup Progress</h2>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Completion Status</span>
                    <span className="text-sm font-medium text-gray-700">
                      {Object.values(completionStatus).filter(Boolean).length} of 3 completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-6 border border-gray-200">
                    <div
                      className="bg-black h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(Object.values(completionStatus).filter(Boolean).length / 3) * 100}%` }}
                    ></div>
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                              completionStatus.contentIdeas
                                ? "bg-green-100 border-green-200"
                                : "bg-orange-100 border-orange-200"
                            }`}
                          >
                            {completionStatus.contentIdeas ? (
                              <Check className="w-5 h-5 text-green-600" />
                            ) : (
                              <Lightbulb className="w-5 h-5 text-orange-600" />
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-base font-medium text-gray-900">Content Ideas</h3>
                          <p className="text-xs text-gray-500">Set up your content idea sources and preferences</p>
                        </div>
                      </div>
                      <button
                        onClick={() => router.push("/company-database/ideas")}
                        className={`px-3 py-1.5 text-xs font-medium rounded border ${
                          completionStatus.contentIdeas
                            ? "text-gray-700 bg-gray-100 hover:bg-gray-200 border-gray-300"
                            : "text-white bg-black hover:bg-gray-800 border-black"
                        } transition-colors`}
                      >
                        {completionStatus.contentIdeas ? "Edit" : "Complete"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                              completionStatus.blogSettings
                                ? "bg-green-100 border-green-200"
                                : "bg-orange-100 border-orange-200"
                            }`}
                          >
                            {completionStatus.blogSettings ? (
                              <Check className="w-5 h-5 text-green-600" />
                            ) : (
                              <FileText className="w-5 h-5 text-orange-600" />
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-base font-medium text-gray-900">Blog Settings</h3>
                          <p className="text-xs text-gray-500">
                            Configure your blog preferences and publishing strategy
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => router.push("/company-database/blog")}
                        className={`px-3 py-1.5 text-xs font-medium rounded border ${
                          completionStatus.blogSettings
                            ? "text-gray-700 bg-gray-100 hover:bg-gray-200 border-gray-300"
                            : "text-white bg-black hover:bg-gray-800 border-black"
                        } transition-colors`}
                      >
                        {completionStatus.blogSettings ? "Edit" : "Complete"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                              completionStatus.audienceKeywords
                                ? "bg-green-100 border-green-200"
                                : "bg-orange-100 border-orange-200"
                            }`}
                          >
                            {completionStatus.audienceKeywords ? (
                              <Check className="w-5 h-5 text-green-600" />
                            ) : (
                              <Users className="w-5 h-5 text-orange-600" />
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-base font-medium text-gray-900">Audience and Keywords</h3>
                          <p className="text-xs text-gray-500">Define your target audience and important keywords</p>
                        </div>
                      </div>
                      <button
                        onClick={() => router.push("/settings")}
                        className={`px-3 py-1.5 text-xs font-medium rounded border ${
                          completionStatus.audienceKeywords
                            ? "text-gray-700 bg-gray-100 hover:bg-gray-200 border-gray-300"
                            : "text-white bg-black hover:bg-gray-800 border-black"
                        } transition-colors`}
                      >
                        {completionStatus.audienceKeywords ? "Edit" : "Complete"}
                      </button>
                    </div>

                    <div className="flex justify-center pt-4">
                      <button
                        onClick={markAllAsCompleted}
                        className="px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors flex items-center border border-black"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Mark All Steps as Completed
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}