"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import {
  FileText,
  Lightbulb,
  Sparkles,
  ChevronRight,
  PlusCircle,
  Globe,
  ChevronDown,
  PenLine,
  Home,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AppSidebarProps {
  user?: any
  subscription?: {
    plan_id: string
    credits: number
    status?: string
    current_period_start?: string
    current_period_end?: string
    billing_cycle?: string
    subscription_type?: string
    monthly_price?: number
    annual_price?: number
    annual_discount_percentage?: number
    currency?: string
    onboarding_completed?: boolean | null
    website_onboarding_completed?: boolean | null
  } | null
  stats?: {
    postsCreated: number
    ideasGenerated: number
    creditsUsed: number
    websiteSummaries: number
  }
  onSignOut?: () => Promise<void>
}

export function AppSidebar({
  user,
  subscription = null,
  stats = { postsCreated: 0, ideasGenerated: 0, creditsUsed: 0, websiteSummaries: 0 },
  onSignOut,
}: AppSidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState("Blog Idea Generation")
  const pathname = usePathname()
  const [showCreditAlert, setShowCreditAlert] = useState(false)
  const [creditAlertMessage, setCreditAlertMessage] = useState("")
  const supabase = createClient()

  // Format plan name function
  const formatPlanName = (planId: string | undefined) => {
    if (!planId) return "No Plan"
    const plan = planId.toLowerCase()
    if (plan === "basic") return "Basic"
    if (plan === "starter") return "Starter"
    if (plan === "growth") return "Growth"
    if (plan === "professional" || plan === "pro") return "Professional"
    if (plan === "enterprise") return "Enterprise"
    return planId.charAt(0).toUpperCase() + planId.slice(1)
  }

  const planName = formatPlanName(subscription?.plan_id)

  // Navigation items
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Content Planner", href: "/dashboard/blogs", icon: PenLine },
    { name: "Blogs Generation", href: "/dashboard/blogs", icon: FileText },
    { name: "Sitemap Generator", href: "/sitemap-generator", icon: Globe },
    {
      name: "Blog Idea Generation",
      icon: Lightbulb,
      subItems: [
        { name: "Headline to Blog Generation", href: "/headlinetoblog", icon: Sparkles },
        { name: "Headline Generator", href: "/blog-ideas/ideas", icon: FileText },
        { name: "Integration", href: "/api-key", icon: Star },
      ],
    },
  ]

  // Plan credits map
  const planCreditsMap: { [key: string]: number } = {
    trial: 2,
    basic: 2,
    starter: 15,
    growth: 30,
    professional: 60,
    enterprise: 120,
  }

  // Add this function after the planCreditsMap
  const getPlanTotalCredits = (planId: string, billingCycle?: string): number => {
    const normalizedPlanId = planId.toLowerCase()
    // All plans have the same number of credits regardless of billing cycle
    return planCreditsMap[normalizedPlanId] || 0
  }

  const setupRealtimeSubscription = async () => {
    if (!user?.id) return

    // Listen for changes to the subscriptions table
    const subscriptionChannel = supabase
      .channel("sidebar-subscription-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "subscriptions",
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          console.log("Subscription updated (sidebar):", payload)

          // Refresh subscription data
          const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).single()

          if (data && !error) {
            // Show credit alert if this was triggered by a blog post creation
            if (payload.old && payload.new && payload.old.credits !== payload.new.credits) {
              setCreditAlertMessage(`1 credit has been deducted. You have ${data.credits} credits remaining.`)
              setShowCreditAlert(true)

              // Hide the alert after 5 seconds
              setTimeout(() => setShowCreditAlert(false), 5000)
            }
          }
        },
      )
      .subscribe()

    // Listen for new blog posts
    const blogsChannel = supabase
      .channel("sidebar-blogs-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "blogs",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("New blog post created (sidebar):", payload)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscriptionChannel)
      supabase.removeChannel(blogsChannel)
    }
  }

  // Add this function after the setupRealtimeSubscription function
  const fetchBlogsCount = async () => {
    try {
      if (!user?.id) return { count: 0, creditsDeducted: 0 }

      const { data, error } = await supabase.from("blogs").select("id, credit_deducted").eq("user_id", user.id)

      if (error) {
        console.error("Error fetching blogs count:", error.message)
        return { count: 0, creditsDeducted: 0 }
      }

      const count = data?.length || 0
      console.log(`Fetched ${count} blogs for user ${user.id}`)

      // Count blogs with credit_deducted = true
      const creditsDeducted = data?.filter((blog) => blog.credit_deducted).length || 0

      return { count, creditsDeducted }
    } catch (err) {
      console.error("Error in fetchBlogsCount:", err)
      return { count: 0, creditsDeducted: 0 }
    }
  }

  // Set up a subscription to listen for changes to the user's subscription
  useEffect(() => {
    if (!user?.id) return

    // Listen for changes to the subscriptions table
    const subscriptionChannel = supabase
      .channel("sidebar-subscription-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "subscriptions",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Subscription updated (sidebar):", payload)

          // Show credit alert if this was triggered by a blog post creation
          if (payload.old && payload.new && payload.old.credits !== payload.new.credits) {
            const newCredits = payload.new.credits
            setCreditAlertMessage(`1 credit has been deducted. You have ${newCredits} credits remaining.`)
            setShowCreditAlert(true)

            // Hide the alert after 5 seconds
            setTimeout(() => setShowCreditAlert(false), 5000)
          }
        },
      )
      .subscribe()

    // Listen for new blog posts
    const blogsChannel = supabase
      .channel("sidebar-blogs-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "blogs",
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          console.log("New blog post created (sidebar):", payload)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscriptionChannel)
      supabase.removeChannel(blogsChannel)
    }
  }, [user?.id, supabase])

  // Add this effect after the existing useEffect hooks
  useEffect(() => {
    const initializeCreditSystem = async () => {
      if (!user?.id) return

      try {
        // Fetch blogs to get credit usage
        const { count, creditsDeducted } = await fetchBlogsCount()

        // Set up realtime subscription
        setupRealtimeSubscription()
      } catch (error) {
        console.error("Error initializing credit system:", error)
      }
    }

    initializeCreditSystem()
  }, [user?.id])

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle click outside for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isProfileOpen && !target.closest('[aria-haspopup="true"]') && !target.closest(".absolute")) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isProfileOpen])

  // Handle sign out
  const handleSignOut = async () => {
    if (onSignOut) {
      setIsSigningOut(true)
      try {
        await onSignOut()
      } catch (error) {
        console.error("Error signing out:", error)
      } finally {
        setIsSigningOut(false)
      }
    }
  }

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 h-screen ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0`}
    >
      <div className="w-72 bg-white flex flex-col h-screen text-gray-800 border border-gray-200">
        <div className="flex items-center justify-center p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
           
            {/* Placeholder logo image - replace with your actual logo */}
            <img src="/getmoreseo.png" alt="Logo" className="h-8 w-32 object-contain" />
          </div>
        </div>

        {/* Replace the existing credit deduction alert with this */}
        {showCreditAlert && (
          <div className="mx-4 mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center">
              {/* <CreditCard className="h-4 w-4 text-blue-500 mr-2" /> */}
              <p className="text-blue-800 text-sm font-medium">{creditAlertMessage}</p>
              <button onClick={() => setShowCreditAlert(false)} className="ml-2 text-blue-600 hover:text-blue-800">
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="px-5 mt-8 mb-8">
          <Link href="/dashboard/summarizer">
            <button className="w-full bg-[#294fd6] text-white font-medium py-3.5 rounded-xl hover:bg-[#1e3eb8] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[#294fd6]/20 flex items-center justify-center">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Content
            </button>
          </Link>
        </div>

        <div className="px-3 mb-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Main</div>
        </div>

        <nav className="flex-1 px-3 overflow-y-auto space-y-1">
          {navigation.slice(0, 4).map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href || (item.subItems && item.subItems.some((subItem) => pathname === subItem.href))

            if (item.href && !item.subItems) {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-[15px] font-medium rounded-xl transition-all duration-200 mb-1 group",
                    isActive
                      ? "text-[#294fd6] bg-[#294fd6]/10 border-l-4 border-[#294fd6]"
                      : "text-gray-700 hover:text-[#294fd6] hover:bg-[#294fd6]/5 border-l-4 border-transparent",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-[18px] h-[18px] mr-3 flex-shrink-0 stroke-[1.5px] transition-colors duration-200",
                      isActive ? "text-[#294fd6]" : "text-gray-500 group-hover:text-[#294fd6]",
                    )}
                  />
                  {item.name}
                  {item.name === "Dashboard" && (
                    <span className="ml-auto text-xs bg-[#294fd6]/10 text-[#294fd6] px-2 py-0.5 rounded-full">
                      Home
                    </span>
                  )}
                  {item.name === "Sitemap Generator" && (
                    <span className="ml-auto text-xs bg-[#294fd6]/10 text-[#294fd6] px-2 py-0.5 rounded-full">New</span>
                  )}
                </Link>
              )
            }

            return null
          })}
        </nav>

        <div className="px-3 mb-4 mt-6">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Workspace</div>
        </div>

        <nav className="px-3 overflow-y-auto space-y-1">
          {navigation.slice(4).map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href || (item.subItems && item.subItems.some((subItem) => pathname === subItem.href))

            return (
              <div key={item.name} className="mb-1">
                <div
                  className={cn(
                    "flex items-center px-4 py-3 text-[15px] font-medium rounded-xl transition-all duration-200 group",
                    item.href ? "cursor-pointer" : "cursor-default",
                    isActive
                      ? "text-[#294fd6] bg-[#294fd6]/10 border-l-4 border-[#294fd6]"
                      : "text-gray-700 hover:text-[#294fd6] hover:bg-[#294fd6]/5 border-l-4 border-transparent",
                  )}
                  onClick={() => item.subItems && setOpenSubmenu(openSubmenu === item.name ? "" : item.name)}
                >
                  <Icon
                    className={cn(
                      "w-[18px] h-[18px] mr-3 flex-shrink-0 stroke-[1.5px] transition-colors duration-200",
                      isActive ? "text-[#294fd6]" : "text-gray-500 group-hover:text-[#294fd6]",
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

                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={cn(
                            "flex items-center px-4 py-2.5 text-[14px] font-medium rounded-lg transition-all duration-200 group",
                            isSubActive
                              ? "text-[#294fd6] bg-[#294fd6]/10"
                              : "text-gray-600 hover:text-[#294fd6] hover:bg-[#294fd6]/5",
                          )}
                        >
                          <SubIcon
                            className={cn(
                              "w-[16px] h-[16px] mr-3 flex-shrink-0 stroke-[1.5px] transition-colors duration-200",
                              isSubActive ? "text-[#294fd6]" : "text-gray-500 group-hover:text-[#294fd6]",
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

        <div className="p-4 mt-auto">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2 text-[#294fd6]" />
                <p className="text-sm font-medium text-gray-800">API Support</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">New</span>
            </div>

            <div className="mb-3 flex items-center text-green-600 text-xs bg-green-50 p-2 rounded-lg">
              <Sparkles className="w-3 h-3 mr-1.5" />
              <span>API integration now available!</span>
            </div>

            <p className="text-sm text-gray-600 mb-3">
              Connect your applications directly to our platform with our new API endpoints.
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">Developer Tools</span>
              <Link
                href="/api-key"
                className="bg-[#294fd6] text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#1e3eb8] transition-all duration-300 flex items-center gap-1"
              >
                <ChevronRight className="w-3 h-3" />
                View Docs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
