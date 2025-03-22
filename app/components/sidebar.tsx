"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { cn } from "@/lib/utils"
import {
  PenLine,
  LayoutGrid,
  Lightbulb,
  BarChart2,
  FileText,
  Database,
  Home,
  ChevronDown,
  Link2,
  ExternalLink,
  Sparkles,
  CreditCard,
  Zap,
} from "lucide-react"
import { Saira } from "next/font/google"

// Initialize the Saira font
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-saira",
})

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

interface SidebarProps {
  subscription: {
    plan_id: string
    credits: number
  } | null
}

export function Sidebar({ subscription: initialSubscription }: SidebarProps) {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState("Company Database")
  const [subscription, setSubscription] = useState(initialSubscription)
  const [totalCredits, setTotalCredits] = useState(0)
  const [creditsUsed, setCreditsUsed] = useState(0)
  const supabase = createClient()

  // Plan credits mapping - consistent with URLForm
  const planCreditsMap: { [key: string]: number } = {
    trial: 2,
    starter: 30,
    professional: 60,
    basic: 30, // Map basic to starter
    pro: 60, // Map pro to professional
  }

  useEffect(() => {
    if (initialSubscription) {
      setSubscription(initialSubscription)
      updateCreditInfo(initialSubscription)
    } else {
      fetchSubscriptionData()
    }

    setupRealtimeSubscription()
  }, [initialSubscription])

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
        .channel("sidebar-subscription")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "subscriptions",
            filter: `user_id=eq.${userId}`,
          },
          async (payload) => {
            console.log("Sidebar detected subscription change:", payload)
            if (payload.new) {
              await fetchSubscriptionData()
            }
          },
        )
        .subscribe()

      // Also listen for blog changes to update used credits
      const blogsChannel = supabase
        .channel("sidebar-blogs")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "blogs",
            filter: `user_id=eq.${userId}`,
          },
          async () => {
            console.log("Sidebar detected blog change, updating credit info")
            await fetchSubscriptionData()
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(subscription)
        supabase.removeChannel(blogsChannel)
      }
    } catch (error) {
      console.error("Error setting up sidebar realtime subscription:", error)
    }
  }

  const fetchSubscriptionData = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        console.error("No authenticated user found for sidebar:", authError)
        return
      }

      const userId = user.id

      // Get subscription data
      const { data: subscriptionData, error: subError } = await supabase
        .from("subscriptions")
        .select("plan_id, credits")
        .eq("user_id", userId)
        .single()

      if (subError) {
        console.error("Sidebar subscription fetch error:", subError)
        return
      }

      if (subscriptionData) {
        setSubscription(subscriptionData)
        updateCreditInfo(subscriptionData)
      }
    } catch (error) {
      console.error("Error fetching sidebar subscription data:", error)
    }
  }

  const updateCreditInfo = async (subscriptionData: { plan_id: string; credits: number }) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const planId = subscriptionData.plan_id.toLowerCase()
      const maxCredits = planCreditsMap[planId] || 0

      // Get blog count to calculate used credits
      const { data: blogs, error: blogsError } = await supabase
        .from("blogs")
        .select("id", { count: "exact" })
        .eq("user_id", user.id)

      if (blogsError) {
        console.error("Error fetching blogs count for sidebar:", blogsError)
      }

      const blogsCount = blogs?.length || 0
      const used = Math.min(blogsCount, maxCredits)

      setTotalCredits(maxCredits)
      setCreditsUsed(used)

      console.log(
        `Sidebar credit info updated: Total=${maxCredits}, Used=${used}, Remaining=${subscriptionData.credits}`,
      )
    } catch (error) {
      console.error("Error updating sidebar credit info:", error)
    }
  }

  // Format plan name for display
  const formatPlanName = (planId: string | undefined) => {
    if (!planId) return "No Plan"
    const plan = planId.toLowerCase()
    if (plan === "basic") return "Starter"
    if (plan === "pro") return "Professional"
    return planId.charAt(0).toUpperCase() + planId.slice(1)
  }

  const remainingCredits = subscription?.credits || 0
  const planName = formatPlanName(subscription?.plan_id)
  const isPro = planName === "Professional" || planName === "Pro"

  return (
    <div className={`${saira.className} w-64 bg-white flex flex-col h-screen text-gray-900 border-r border-gray-200`}>
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

                    // Special case for GetMoreBacklinks to show it's auto-publishing blogs
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
                          <div className="ml-9 mt-1 text-xs text-gray-500">Auto-publishing blogs to external sites</div>
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
              <span className="text-sm font-bold text-gray-800">{remainingCredits}</span>
              <span className="text-xs text-gray-500 ml-1">remaining</span>
            </div>
          </div>

          {/* Credit progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-2.5 border border-gray-200">
            <div
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-2.5 rounded-full transition-all duration-300 relative"
              style={{ width: `${totalCredits > 0 ? (creditsUsed / totalCredits) * 100 : 0}%` }}
            >
              {totalCredits > 0 && creditsUsed / totalCredits > 0.8 && (
                <span className="absolute -right-1 -top-1 w-3 h-3 bg-orange-500 rounded-full animate-ping opacity-75"></span>
              )}
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-500 px-1">
            <span>{creditsUsed} used</span>
            <span>{totalCredits} total</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center">
              {isPro ? (
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
  )
}

