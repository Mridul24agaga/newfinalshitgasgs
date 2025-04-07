"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  FileText,
  Lightbulb,
  Sparkles,
  ChevronRight,
  PlusCircle,
  CreditCard,
  Globe,
  ChevronDown,
  PenLine,
  Home,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AppSidebarProps {
  user: any
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
    { name: "Content Planner", href: "/dashboard/summarizer", icon: PenLine },
    { name: "Blogs", href: "/dashboard/summarizer", icon: FileText },
    { name: "Sitemap Generator", href: "/dashboard/sitemap", icon: Globe },
    {
      name: "Blog Idea Generation",
      icon: Lightbulb,
      subItems: [
        { name: "Headline to Blog Generation", href: "/blog-ideas/headlines", icon: Sparkles },
        { name: "Blog Ideas Generation", href: "/blog-ideas/ideas", icon: FileText },
        { name: "Headline Generator", href: "/blog-ideas/ideas", icon: FileText },

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

  // Calculate credits
  const totalCredits = subscription ? planCreditsMap[subscription.plan_id.toLowerCase()] || 0 : 0
  const creditsRemaining = subscription?.credits || 0
  const creditsUsed = totalCredits - creditsRemaining > 0 ? totalCredits - creditsRemaining : 0

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 h-screen ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0`}
    >
      <div className="w-72 bg-white flex flex-col h-screen text-gray-800 border border-gray-200">
        <div className="flex items-center justify-center p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-[#294fd6] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#294fd6] to-[#6284e4] bg-clip-text text-transparent">
              Blogosocial
            </h1>
          </div>
        </div>

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
                <CreditCard className="w-4 h-4 mr-2 text-[#294fd6]" />
                <p className="text-sm font-medium text-gray-800">Credits</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-bold text-[#294fd6]">{creditsRemaining}</span>
                <span className="text-xs text-gray-500 ml-1">remaining</span>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#294fd6] h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalCredits > 0 ? (stats.creditsUsed / totalCredits) * 100 : 0}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-2 mb-3">
              <span>{stats.creditsUsed} used</span>
              <span>{totalCredits} total</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="flex items-center">
                {subscription && (planName === "Professional" || planName === "Enterprise") ? (
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-1.5 text-[#294fd6]" />
                    <span className="text-sm font-semibold text-[#294fd6]">{planName}</span>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-gray-700">{planName}</span>
                )}
              </div>
              {subscription &&
                subscription.plan_id.toLowerCase() !== "professional" &&
                subscription.plan_id.toLowerCase() !== "enterprise" && (
                  <Link
                    href="/upgrade"
                    className="bg-[#294fd6] text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#1e3eb8] transition-all duration-300 flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3" />
                    Upgrade
                  </Link>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

