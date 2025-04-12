"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Home, FileText, Globe, Sparkles, Star, Menu, X } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { cn } from "@/lib/utils"

interface AppSidebarProps {
  user?: any
  onSignOut?: () => Promise<void>
}

export function AppSidebar({ user, onSignOut }: AppSidebarProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Flattened navigation items (including sub-items)
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Blog Generator", href: "/blog-generator", icon: FileText },
    { name: "Sitemap Generator", href: "/sitemap-generator", icon: Globe },
    { name: "Headline to Blog", href: "/headlinetoblog", icon: Sparkles },
    { name: "Headline Generator", href: "/generateheadlinesfromwebsite", icon: FileText },
    { name: "Integration", href: "/api-key", icon: Star },
  ]

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

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="sidebar-toggle lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-white bg-[#294fd6]"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {isMobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "sidebar fixed inset-y-0 left-0 z-40 w-64 bg-[#294fd6] text-white transition-transform duration-300 ease-in-out transform",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-[#3a61e0]">
            <span className="text-xl font-bold text-white font-inter">GetmoreSEO</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="px-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <li key={item.name} className="mb-1">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg transition-colors",
                        isActive ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Log out button */}
          <div className="p-2 border-t border-[#3a61e0]">
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className={cn(
                "w-full flex items-center px-3 py-2 rounded-lg transition-colors",
                isSigningOut ? "opacity-50 cursor-not-allowed" : "text-white/80 hover:bg-white/10 hover:text-white",
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mr-3 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>{isSigningOut ? "Logging out..." : "Log out"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      )}
    </>
  )
}
