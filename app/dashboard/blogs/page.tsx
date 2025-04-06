"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import Link from "next/link"
import {
  PlusCircle,
  FileText,
  Calendar,
  Loader2,
  AlertCircle,
  ArrowRight,
  Search,
  PenTool,
  Menu,
  Sparkles,
  Home,
  PenLine,
  Globe,
  Database,
  LayoutGrid,
  BarChart2,
  ChevronDown,
  Link2,
  ExternalLink,
  Lightbulb,
  Bell,
  Settings,
  Key,
  LogOut,
  ChevronRight,
  CreditCard,
  CheckCircle,
} from "lucide-react"

interface BlogPost {
  id: string
  title: string
  summary?: string
  created_at: string
  tags?: string[]
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState("Company Database")
  const [showSubscriptionBanner, setShowSubscriptionBanner] = useState(false)
  const [stats, setStats] = useState({
    postsCreated: 0,
    ideasGenerated: 0,
    creditsUsed: 0,
    websiteSummaries: 0,
  })
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  // Navigation items
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Content Planner", href: "/dashboard/summarizer", icon: PenLine },
    { name: "Website Summarizer", href: "/dashboard/summarizer", icon: Globe },
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

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true)

        // Get the current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          throw new Error("User not authenticated")
        }

        // Fetch blogs for the current user
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          throw new Error(error.message)
        }

        setBlogs(data || [])
        setFilteredBlogs(data || [])

        // Update stats
        setStats((prev) => ({
          ...prev,
          postsCreated: data?.length || 0,
          creditsUsed: data?.length || 0,
        }))
      } catch (err: any) {
        console.error("Error fetching blogs:", err)
        setError(err.message || "Failed to load blogs")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogs()
  }, [supabase])

  // Filter blogs based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBlogs(blogs)
    } else {
      const filtered = blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (blog.summary && blog.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (blog.tags && blog.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))),
      )
      setFilteredBlogs(filtered)
    }
  }, [searchQuery, blogs])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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

  const navigateTo = (path: string) => {
    setIsProfileOpen(false)
    router.push(path)
  }

  // Helper function for conditional class names
  const cn = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="text-center bg-white p-8 rounded-xl max-w-md w-full mx-4 border border-slate-200">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <Loader2 className="h-20 w-20 animate-spin text-[#2563eb] absolute" />
            <div className="absolute inset-0 flex items-center justify-center">
              <PenTool className="h-8 w-8 text-[#2563eb]/70" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Loading your content</h2>
          <p className="text-slate-500">Preparing your creative workspace...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border border-slate-200">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-4">Unable to Load Content</h2>
          <p className="text-slate-600 text-center mb-6">{error}</p>
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg transition-all duration-200"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 h-screen ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
        <div className="w-72 bg-white flex flex-col h-screen text-gray-800 border-r border-gray-200">
          <div className="flex items-center justify-center p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-[#294fd6] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#294fd6] to-[#6284e4] bg-clip-text text-transparent">
                PenPulse
              </h1>
            </div>
          </div>

          <div className="px-5 mt-8 mb-8">
            <Link href="/dashboard/summarizer">
              <button className="w-full bg-[#294fd6] text-white font-medium py-3.5 rounded-xl hover:bg-[#1e3eb8] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create New Content
              </button>
            </Link>
          </div>

          <div className="px-3 mb-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Main</div>
          </div>

          <nav className="flex-1 px-3 overflow-y-auto space-y-1">
            {navigation.slice(0, 3).map((item) => {
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
                    {item.name === "Website Summarizer" && (
                      <span className="ml-auto text-xs bg-[#294fd6]/10 text-[#294fd6] px-2 py-0.5 rounded-full">
                        New
                      </span>
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
            {navigation.slice(3).map((item) => {
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
                  <span className="text-sm font-bold text-[#294fd6]">25</span>
                  <span className="text-xs text-gray-500 ml-1">remaining</span>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#294fd6] h-2 rounded-full transition-all duration-300"
                  style={{ width: "30%" }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-gray-500 mt-2 mb-3">
                <span>5 used</span>
                <span>30 total</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">Growth</span>
                </div>
                <Link
                  href="/upgrade"
                  className="bg-[#294fd6] text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#1e3eb8] transition-all duration-300 flex items-center gap-1"
                >
                  Upgrade
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 w-full lg:pl-72">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-gray-500 hover:text-gray-700 mr-3"
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                type="button"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-[#294fd6]/20 hover:border-[#294fd6]/50 transition-all duration-200"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  type="button"
                >
                  <div className="w-10 h-10 bg-[#294fd6] flex items-center justify-center text-white font-medium">
                    U
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl py-1 z-50 border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#294fd6]/20 mr-3">
                          <div className="w-10 h-10 bg-[#294fd6] flex items-center justify-center text-white font-medium text-lg">
                            U
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">User</p>
                          <p className="text-xs text-gray-500 truncate">user@example.com</p>
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
          {showSubscriptionBanner && (
            <div className="bg-green-50 border-b border-green-200 p-3 text-center">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-green-800 font-medium">
                  Your subscription has been activated successfully! You now have access to all Growth features.
                </p>
                <button
                  onClick={() => setShowSubscriptionBanner(false)}
                  className="ml-4 text-green-600 hover:text-green-800"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#294fd6] to-[#6284e4] rounded-2xl p-8 text-white mb-8 border border-[#294fd6]/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3"></div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-6 md:mb-0">
                  <h1 className="text-3xl font-bold tracking-tight mb-3">Welcome to PenPulse</h1>
                  <p className="text-white/80 text-lg max-w-xl">
                    Your professional content creation platform is ready to help you craft engaging content that
                    resonates with your audience.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => router.push("/dashboard/summarizer")}
                    className="flex items-center justify-center px-6 py-3 bg-white text-[#294fd6] rounded-xl hover:bg-gray-100 transition-all duration-300 text-sm font-medium border border-white/10 transform hover:scale-105"
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Content
                  </button>
                  <button
                    onClick={() => router.push("/company-database/ideas")}
                    className="flex items-center justify-center px-6 py-3 bg-[#294fd6]/20 text-white rounded-xl hover:bg-[#294fd6]/30 transition-all duration-300 text-sm font-medium border border-white/20 transform hover:scale-105"
                  >
                    <Lightbulb className="mr-2 h-5 w-5" />
                    Generate Ideas
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-[#294fd6]/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Posts Created</h3>
                  <div className="p-2 bg-[#294fd6]/10 rounded-lg">
                    <FileText className="h-5 w-5 text-[#294fd6]" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.postsCreated}</p>
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <span className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    12% increase
                  </span>
                  <span className="text-gray-500 ml-2">from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-[#294fd6]/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Credits Used</h3>
                  <div className="p-2 bg-[#294fd6]/10 rounded-lg">
                    <CreditCard className="h-5 w-5 text-[#294fd6]" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.creditsUsed}</p>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <span>25 credits remaining</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-[#294fd6]/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Website Summaries</h3>
                  <div className="p-2 bg-[#294fd6]/10 rounded-lg">
                    <Globe className="h-5 w-5 text-[#294fd6]" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.websiteSummaries}</p>
                <div className="mt-2 flex items-center text-xs text-blue-600">
                  <span className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    New feature
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-[#294fd6]/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Current Plan</h3>
                  <div className="p-2 bg-[#294fd6]/10 rounded-lg">
                    <Sparkles className="h-5 w-5 text-[#294fd6]" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">Growth</p>
                <div className="mt-2 flex items-center text-xs">
                  <Link href="/upgrade" className="text-[#294fd6] font-medium flex items-center">
                    Upgrade your plan
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Blog Posts Section */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center">
                      <span className="text-[#294fd6] mr-2">★</span>
                      Your Blog Posts
                    </h2>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search blogs..."
                        className="pl-9 w-full sm:w-64 h-10 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={() => router.push("/generate-blog-content")}
                      className="px-4 py-2 bg-[#294fd6] text-white rounded-lg hover:bg-[#1e3eb8] transition-all duration-300 text-sm font-medium flex items-center"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create New Blog
                    </button>
                  </div>
                </div>
              </div>

              {filteredBlogs.length === 0 ? (
                <div className="bg-gradient-to-r from-[#2563eb]/5 to-[#2563eb]/10 p-12 text-center">
                  <div className="bg-white rounded-full p-4 inline-flex mb-6 border border-gray-100">
                    <FileText className="h-12 w-12 text-[#2563eb]" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-3">Your Content Canvas Awaits</h2>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    {searchQuery
                      ? "No blogs match your search criteria. Try a different search term or create a new blog."
                      : "Start your content creation journey by generating your first AI-powered blog post."}
                  </p>
                  <button
                    onClick={() => router.push("/generate-blog-content")}
                    className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-2.5 rounded-md transition-colors flex items-center justify-center mx-auto"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    <span>Create Your First Masterpiece</span>
                  </button>
                </div>
              ) : (
                <div className="p-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredBlogs.map((blog) => (
                      <div
                        key={blog.id}
                        className="group overflow-hidden bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:border-[#2563eb]/50 hover:bg-gradient-to-b hover:from-white hover:to-[#2563eb]/5"
                      >
                        {/* Featured Image Area */}
                        <div className="relative h-48 bg-gradient-to-r from-[#2563eb]/10 to-[#6284e4]/10 border-b border-gray-100 overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <div className="w-full h-full bg-[url('/placeholder.svg?height=400&width=600')] bg-center bg-cover"></div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center border border-gray-100">
                              <FileText className="h-8 w-8 text-[#2563eb]" />
                            </div>
                          </div>
                          <div className="absolute top-4 right-4 flex space-x-2">
                            {blog.tags &&
                              blog.tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2.5 py-1 bg-white/90 text-[#2563eb] text-xs rounded-full font-medium border border-[#2563eb]/10"
                                >
                                  {tag}
                                </span>
                              ))}
                            {blog.tags && blog.tags.length > 2 && (
                              <span className="px-2.5 py-1 bg-white/90 text-[#2563eb] text-xs rounded-full font-medium border border-[#2563eb]/10">
                                +{blog.tags.length - 2}
                              </span>
                            )}
                          </div>
                          <div className="absolute bottom-4 left-4 flex items-center">
                            <span className="px-3 py-1 bg-white/90 text-[#2563eb] text-xs rounded-full font-medium border border-[#2563eb]/10 flex items-center">
                              <Calendar className="h-3 w-3 mr-1.5" />
                              {formatDate(blog.created_at)}
                            </span>
                          </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-[#2563eb] transition-colors duration-200">
                            {blog.title}
                          </h3>

                          {blog.summary && (
                            <p className="text-slate-600 mb-5 line-clamp-3 text-sm leading-relaxed">{blog.summary}</p>
                          )}

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-[#2563eb]/10 flex items-center justify-center text-[#2563eb] font-medium text-sm">
                                AI
                              </div>
                              <span className="ml-2 text-xs text-slate-500">Generated with AI</span>
                            </div>

                            <Link
                              href={`/generated/${blog.id}`}
                              className="inline-flex items-center text-[#2563eb] hover:text-[#1d4ed8] font-medium text-sm"
                            >
                              <span>Read Post</span>
                              <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

