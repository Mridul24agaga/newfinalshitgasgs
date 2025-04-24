"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Home, FileText, Globe, Sparkles, Star, Menu, X, ChevronDown, ChevronRight, LogOut } from "lucide-react"
import { CreditCard } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { cn } from "@/lib/utils"

interface AppSidebarProps {
  user?: any
  onSignOut?: () => Promise<void>
}

// Navigation items grouped by category
const navigationGroups = [
  {
    label: "Main",
    items: [{ name: "Dashboard", href: "/dashboard", icon: Home }],
  },
  {
    label: "Content Tools",
    items: [
      { name: "Blog Generator", href: "/blog-generator", icon: FileText },
      { name: "Headline to Blog", href: "/headlinetoblog", icon: Sparkles },
      { name: "Headline Generator", href: "/generateheadlinesfromwebsite", icon: FileText },
    ],
  },
  {
    label: "SEO Tools",
    items: [{ name: "Sitemap Generator", href: "/sitemap-generator", icon: Globe }],
  },
  {
    label: "Settings",
    items: [
      { name: "Integration", href: "/api-key", icon: Star },
      { name: "Billing", href: "/billing", icon: CreditCard }

    ],
    
  },
]

export function AppSidebar({ user, onSignOut }: AppSidebarProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [isSigningOut, setIsSigningOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Initialize all groups as expanded
  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {}
    navigationGroups.forEach((group) => {
      initialExpandedState[group.label] = true
    })
    setExpandedGroups(initialExpandedState)
  }, [])

  // Toggle group expansion
  const toggleGroup = (groupLabel: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupLabel]: !prev[groupLabel],
    }))
  }

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle sign out with Supabase
  async function handleSignOut() {
    setIsSigningOut(true)
    try {
      // If custom onSignOut is provided, call it first
      if (onSignOut) {
        await onSignOut()
      } else {
        // Otherwise use Supabase's built-in signOut
        const { error } = await supabase.auth.signOut()
        if (error) {
          throw error
        }
        // Redirect to login page after successful sign out
        router.push("/login")
        router.refresh()
      }
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  // Handle click outside to close mobile sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isMobileSidebarOpen && !target.closest(".sidebar") && !target.closest(".sidebar-toggle")) {
        setIsMobileSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobileSidebarOpen])

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.email) return "U"
    const email = user.email as string
    return email.charAt(0).toUpperCase()
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="sidebar-toggle lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-white bg-[#294fd6] hover:bg-[#3a61e0] transition-colors shadow-md"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "sidebar fixed inset-y-0 left-0 z-40 bg-[#294fd6] text-white transition-all duration-300 ease-in-out flex flex-col",
          isCollapsed ? "w-16" : "w-64",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "shadow-xl",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo and collapse button */}
          <div className="flex items-center h-16 px-4 border-b border-[#3a61e0] justify-between">
            {!isCollapsed && <span className="text-xl font-bold text-white font-inter">GetmoreSEO</span>}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-md hover:bg-[#3a61e0] transition-colors hidden lg:block"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          </div>

          

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[#3a61e0] scrollbar-track-transparent">
            {navigationGroups.map((group) => (
              <div key={group.label} className="mb-4">
                {/* Group header */}
                <div
                  className={cn(
                    "flex items-center px-4 mb-1 cursor-pointer",
                    isCollapsed ? "justify-center" : "justify-between",
                  )}
                  onClick={() => !isCollapsed && toggleGroup(group.label)}
                >
                  {!isCollapsed && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/70">{group.label}</span>
                  )}
                  {!isCollapsed && (
                    <button className="p-1 rounded-md hover:bg-[#3a61e0] transition-colors">
                      {expandedGroups[group.label] ? (
                        <ChevronDown className="h-4 w-4 text-white/70" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-white/70" />
                      )}
                    </button>
                  )}
                </div>

                {/* Group items */}
                {(isCollapsed || expandedGroups[group.label]) && (
                  <ul className={cn("space-y-1 transition-all", isCollapsed ? "px-2" : "px-3")}>
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href

                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center rounded-lg transition-all",
                              isCollapsed ? "justify-center p-2" : "px-3 py-2",
                              isActive ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white",
                            )}
                            title={isCollapsed ? item.name : undefined}
                          >
                            <Icon className={cn("flex-shrink-0", isCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3")} />
                            {!isCollapsed && <span className="truncate">{item.name}</span>}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            ))}
          </nav>

          {/* Log out button */}
          <div className={cn("p-3 border-t border-[#3a61e0]", isCollapsed ? "flex justify-center" : "")}>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className={cn(
                "flex items-center rounded-lg transition-colors bg-[#3a61e0] hover:bg-[#4a71f0]",
                isCollapsed ? "p-2 justify-center" : "px-3 py-2 w-full",
                isSigningOut ? "opacity-50 cursor-not-allowed" : "",
              )}
              title={isCollapsed ? "Log out" : undefined}
            >
              <LogOut className={cn("flex-shrink-0", isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3")} />
              {!isCollapsed && <span>{isSigningOut ? "Logging out..." : "Log out"}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* Main content wrapper with padding when sidebar is expanded */}
      <div className={cn("transition-all duration-300 min-h-screen", isCollapsed ? "lg:pl-16" : "lg:pl-64")}>
        {/* This is where your main content would go */}
      </div>
    </>
  )
}

// ChevronLeft icon component
function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}
