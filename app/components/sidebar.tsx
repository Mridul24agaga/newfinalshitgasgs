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
} from "lucide-react"

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

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="flex items-center p-5">
        <Image src="/logo.png" alt="Texta.ai Logo" width={120} height={32} className="object-contain" />
      </div>

      <div className="px-4 mt-2 mb-8">
        <Link href="/dashboard/summarizer">
          <button className="w-full bg-orange-500 text-white font-medium py-3.5 rounded-xl hover:bg-orange-600 transition-colors">
            Get Started
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
                  "flex items-center px-4 py-3 text-[15px] font-medium rounded-xl transition-colors mb-2",
                  isActive ? "text-black bg-gray-100" : "text-gray-600 hover:text-black hover:bg-gray-50",
                )}
              >
                <Icon className="w-[18px] h-[18px] mr-3 flex-shrink-0 stroke-[1.5px]" />
                {item.name}
              </Link>
            )
          }

          return (
            <div key={item.name}>
              <div
                className={cn(
                  "flex items-center px-4 py-3 text-[15px] font-medium rounded-xl transition-colors mb-2",
                  item.href ? "cursor-pointer" : "cursor-default",
                  isActive ? "text-black bg-gray-100" : "text-gray-600 hover:text-black hover:bg-gray-50",
                )}
                onClick={() => item.subItems && setOpenSubmenu(openSubmenu === item.name ? "" : item.name)}
              >
                <Icon className="w-[18px] h-[18px] mr-3 flex-shrink-0 stroke-[1.5px]" />
                {item.name}
                {item.subItems && (
                  <ChevronDown
                    className={cn(
                      "ml-auto w-4 h-4 transition-transform",
                      openSubmenu === item.name ? "transform rotate-180" : "",
                    )}
                  />
                )}
              </div>
              {item.subItems && openSubmenu === item.name && (
                <div className="ml-6 space-y-2">
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
                            "flex flex-col px-4 py-2 text-[14px] font-medium rounded-lg transition-colors",
                            isSubActive ? "text-black bg-gray-100" : "text-gray-600 hover:text-black hover:bg-gray-50",
                          )}
                        >
                          <div className="flex items-center">
                            <SubIcon className="w-[16px] h-[16px] mr-3 flex-shrink-0 stroke-[1.5px]" />
                            {subItem.name}
                            <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
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
                          "flex items-center px-4 py-2 text-[14px] font-medium rounded-lg transition-colors",
                          isSubActive ? "text-black bg-gray-100" : "text-gray-600 hover:text-black hover:bg-gray-50",
                        )}
                      >
                        <SubIcon className="w-[16px] h-[16px] mr-3 flex-shrink-0 stroke-[1.5px]" />
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

      <div className="p-4 bg-gray-50 mt-auto border-t border-gray-200">
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-1">
            <div>
              <p className="text-sm font-medium text-black">Credits</p>
              <p className="text-sm text-gray-500">Used / Total</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-black">{remainingCredits}</p>
              <p className="text-sm text-gray-500">
                {creditsUsed} / {totalCredits}
              </p>
            </div>
          </div>

          {/* Credit progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalCredits > 0 ? (creditsUsed / totalCredits) * 100 : 0}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-medium text-black">{formatPlanName(subscription?.plan_id)}</span>
            <Link
              href="/upgrade"
              className="bg-black text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1"
            >
              Upgrade <span className="text-orange-500">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

