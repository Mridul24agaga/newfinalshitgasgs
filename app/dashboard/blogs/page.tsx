"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import {
  PlusCircle,
  FileText,
  Loader2,
  AlertCircle,
  Search,
  Menu,
  Eye,
  ChevronDown,
  Filter,
  Calendar,
  X,
  RefreshCw,
  Tag,
  Clock,
} from "lucide-react"
import { AppSidebar } from "@/app/components/sidebar"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  summary?: string
  created_at: string
  tags?: string[]
  source?: string
}

type SortField = "title" | "created_at"
type SortDirection = "asc" | "desc"

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [sortField, setSortField] = useState<SortField>("created_at")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [sourceFilter, setSourceFilter] = useState<string | null>(null)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"card" | "compact">("card")
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null)
  const [editingDate, setEditingDate] = useState<string>("")

  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()
        if (error) {
          throw new Error("User not authenticated")
        }
        if (!user) {
          throw new Error("User not found")
        }
        setUser(user)
      } catch (err: any) {
        console.error("Error fetching user:", err)
        router.push("/login")
      }
    }

    fetchUser()
  }, [supabase, router])

  const fetchBlogs = async () => {
    try {
      setIsLoading(true)

      if (!user) return

      // Fetch blogs from the blogs table for the current user
      const { data: blogsData, error: blogsError } = await supabase
        .from("blogs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (blogsError) {
        throw new Error(blogsError.message)
      }

      // Add source identifier to blogs
      const blogsWithSource = (blogsData || []).map((blog) => ({
        ...blog,
        source: "blog_generator",
      }))

      // Fetch blogs from the headlinetoblog table for the current user
      const { data: headlineToBlogData, error: headlineToBlogError } = await supabase
        .from("headlinetoblog")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (headlineToBlogError) {
        throw new Error(headlineToBlogError.message)
      }

      // Add source identifier to headline to blog posts
      const headlineToBlogWithSource = (headlineToBlogData || []).map((blog) => ({
        ...blog,
        source: "headline_to_blog",
      }))

      // Create separate maps for each source to remove duplicates within each source
      const blogGeneratorMap = new Map()
      const headlineToBlogMap = new Map()

      // Process blog generator blogs and keep only the latest version of each title
      blogsWithSource.forEach((blog) => {
        const existingBlog = blogGeneratorMap.get(blog.title)
        if (!existingBlog || new Date(blog.created_at) > new Date(existingBlog.created_at)) {
          blogGeneratorMap.set(blog.title, blog)
        }
      })

      // Process headline to blog posts and keep only the latest version of each title
      headlineToBlogWithSource.forEach((blog) => {
        const existingBlog = headlineToBlogMap.get(blog.title)
        if (!existingBlog || new Date(blog.created_at) > new Date(existingBlog.created_at)) {
          headlineToBlogMap.set(blog.title, blog)
        }
      })

      // Combine both datasets
      const uniqueBlogGenerator = Array.from(blogGeneratorMap.values())
      const uniqueHeadlineToBlog = Array.from(headlineToBlogMap.values())
      const combinedBlogs = [...uniqueBlogGenerator, ...uniqueHeadlineToBlog]

      // Sort by created_at date (newest first)
      combinedBlogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setBlogs(combinedBlogs)
      setFilteredBlogs(combinedBlogs)
    } catch (err: any) {
      console.error("Error fetching blogs:", err)
      setError(err.message || "Failed to load blogs")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const updateBlogDate = async (blogId: string, newDate: string, source: string) => {
    try {
      const tableName = source === "headline_to_blog" ? "headlinetoblog" : "blogs"

      const { error } = await supabase.from(tableName).update({ created_at: newDate }).eq("id", blogId)

      if (error) {
        throw new Error(error.message)
      }

      // Update local state
      setBlogs((prevBlogs) => prevBlogs.map((blog) => (blog.id === blogId ? { ...blog, created_at: newDate } : blog)))

      // Reset editing state
      setEditingBlogId(null)
      setEditingDate("")
    } catch (err: any) {
      console.error("Error updating blog date:", err)
      setError(err.message || "Failed to update blog date")
    }
  }

  useEffect(() => {
    if (user) {
      fetchBlogs()
    }
  }, [supabase, user])

  // Refresh blogs data
  const refreshBlogs = async () => {
    setIsRefreshing(true)
    await fetchBlogs()
  }

  // Apply filters and sorting
  useEffect(() => {
    let result = [...blogs]

    // Apply source filter
    if (sourceFilter) {
      result = result.filter((blog) => blog.source === sourceFilter)
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      result = result.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (blog.summary && blog.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (blog.tags && blog.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))),
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortField === "title") {
        return sortDirection === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      } else {
        return sortDirection === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    setFilteredBlogs(result)
  }, [searchQuery, blogs, sortField, sortDirection, sourceFilter])

  // Toggle sort direction or change sort field
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setSourceFilter(null)
    setSortField("created_at")
    setSortDirection("desc")
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.refresh()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Helper function for conditional class names
  const cn = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ")
  }

  // Get source badge styles
  const getSourceBadgeStyles = (source: string) => {
    if (source === "headline_to_blog") {
      return "bg-purple-100 text-purple-700"
    }
    return "bg-green-100 text-green-700"
  }

  // Get source label
  const getSourceLabel = (source: string) => {
    return source === "headline_to_blog" ? "Headline to Blog" : "Blog Generator"
  }

  // Count blogs by source
  const blogCounts = useMemo(() => {
    const counts = {
      total: blogs.length,
      blog_generator: blogs.filter((blog) => blog.source === "blog_generator").length,
      headline_to_blog: blogs.filter((blog) => blog.source === "headline_to_blog").length,
    }
    return counts
  }, [blogs])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
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
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-sm"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* AppSidebar is already handling its own positioning */}
      <AppSidebar />

      <div className="flex flex-col flex-1 w-full">
        {/* Top navigation bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors mr-2"
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                type="button"
              >
                <Menu size={20} />
              </button>
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Content Library
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:flex items-center bg-gray-100 rounded-full pl-3 pr-1 py-1.5">
                <Search className="h-4 w-4 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="bg-transparent border-none focus:outline-none text-sm w-40 lg:w-60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="p-1 rounded-full hover:bg-gray-200">
                    <X className="h-3 w-3 text-gray-500" />
                  </button>
                )}
              </div>
              <Link
                href="/blog-generator"
                className="hidden sm:flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm"
              >
                <PlusCircle className="h-4 w-4 mr-1.5" />
                New Article
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-6">
            {/* Mobile search - only visible on small screens */}
            <div className="md:hidden mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Link
                  href="/blog-generator"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Article
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Articles</p>
                    <h3 className="text-2xl font-bold text-gray-900">{blogCounts.total}</h3>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Blog Generator</p>
                    <h3 className="text-2xl font-bold text-gray-900">{blogCounts.blog_generator}</h3>
                  </div>
                  <div className="bg-green-50 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Headline to Blog</p>
                    <h3 className="text-2xl font-bold text-gray-900">{blogCounts.headline_to_blog}</h3>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filter and Sort Controls */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-gray-500" />
                  Filters & Sorting
                </h2>

                <div className="flex flex-wrap gap-2">
                  {/* View Mode Toggle */}
                  <div className="flex rounded-lg overflow-hidden border border-gray-200">
                    <button
                      onClick={() => setViewMode("card")}
                      className={`px-3 py-1.5 text-sm ${
                        viewMode === "card" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Card View
                    </button>
                    <button
                      onClick={() => setViewMode("compact")}
                      className={`px-3 py-1.5 text-sm ${
                        viewMode === "compact"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Compact View
                    </button>
                  </div>

                  {/* Source Filter */}
                  <div className="relative">
                    <button
                      onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                      className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                    >
                      <span>Source</span>
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </button>

                    {isFilterMenuOpen && (
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <div className="p-2">
                          <button
                            onClick={() => {
                              setSourceFilter(null)
                              setIsFilterMenuOpen(false)
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${
                              sourceFilter === null ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
                            }`}
                          >
                            All Sources
                          </button>
                          <button
                            onClick={() => {
                              setSourceFilter("blog_generator")
                              setIsFilterMenuOpen(false)
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${
                              sourceFilter === "blog_generator" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
                            }`}
                          >
                            Blog Generator
                          </button>
                          <button
                            onClick={() => {
                              setSourceFilter("headline_to_blog")
                              setIsFilterMenuOpen(false)
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${
                              sourceFilter === "headline_to_blog" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
                            }`}
                          >
                            Headline to Blog
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sort Controls */}
                  <button
                    onClick={() => handleSort("title")}
                    className={`flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      sortField === "title"
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span>Title</span>
                    {sortField === "title" && (
                      <ChevronDown
                        className={`h-4 w-4 ml-1 transition-transform ${
                          sortDirection === "desc" ? "transform rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  <button
                    onClick={() => handleSort("created_at")}
                    className={`flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      sortField === "created_at"
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span>Date</span>
                    {sortField === "created_at" && (
                      <ChevronDown
                        className={`h-4 w-4 ml-1 transition-transform ${
                          sortDirection === "desc" ? "transform rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Refresh Button */}
                  <button
                    onClick={refreshBlogs}
                    disabled={isRefreshing}
                    className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                  >
                    <RefreshCw className={`h-4 w-4 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                  </button>

                  {/* Clear Filters */}
                  {(sourceFilter || searchQuery || sortField !== "created_at" || sortDirection !== "desc") && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-sm text-red-600 transition-colors"
                    >
                      <X className="h-4 w-4 mr-1.5" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Active Filters Display */}
              {(sourceFilter || searchQuery) && (
                <div className="mt-4 flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-gray-500">Active filters:</span>

                  {searchQuery && (
                    <div className="flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                      <span>Search: {searchQuery}</span>
                      <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-blue-900">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {sourceFilter && (
                    <div className="flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                      <span>Source: {sourceFilter === "blog_generator" ? "Blog Generator" : "Headline to Blog"}</span>
                      <button onClick={() => setSourceFilter(null)} className="ml-1 hover:text-blue-900">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Blog Posts Section */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8 shadow-sm">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                {/* Blog Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h2 className="text-lg font-bold text-gray-900">Your Articles</h2>
                    <span className="ml-3 text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {filteredBlogs.length} {filteredBlogs.length === 1 ? "article" : "articles"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {isLoading ? (
                  // Loading State
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600">Loading your articles...</p>
                  </div>
                ) : filteredBlogs.length === 0 ? (
                  // Empty State
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-12 text-center rounded-lg border border-blue-100">
                    <div className="bg-white rounded-full p-4 inline-flex mb-6 border border-blue-100 shadow-sm">
                      <FileText className="h-12 w-12 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">Your Content Canvas Awaits</h2>
                    <p className="text-slate-600 mb-8 max-w-md mx-auto">
                      {searchQuery || sourceFilter
                        ? "No articles match your current filters. Try adjusting your filters or create a new article."
                        : "Start your content creation journey by generating your first AI-powered article."}
                    </p>
                    {searchQuery || sourceFilter ? (
                      <button
                        onClick={clearFilters}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md transition-colors flex items-center justify-center mx-auto shadow-sm"
                      >
                        <X className="h-5 w-5 mr-2" />
                        <span>Clear Filters</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => router.push("/blog-generator")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md transition-colors flex items-center justify-center mx-auto shadow-sm"
                      >
                        <PlusCircle className="h-5 w-5 mr-2" />
                        <span>Create Your First Article</span>
                      </button>
                    )}
                  </div>
                ) : viewMode === "card" ? (
                  // Card View
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBlogs.map((blog) => (
                      <div
                        key={blog.id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col"
                        onClick={() => {
                          if (blog.source === "headline_to_blog") {
                            router.push(`/generate/${blog.id}`)
                          } else {
                            router.push(`/generated/${blog.id}`)
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        {/* Card Header with Source Badge */}
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                          <div className="flex justify-between items-center">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${getSourceBadgeStyles(
                                blog.source || "",
                              )}`}
                            >
                              {getSourceLabel(blog.source || "")}
                            </span>
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              {editingBlogId === blog.id ? (
                                <div className="flex items-center">
                                  <input
                                    type="datetime-local"
                                    value={editingDate}
                                    onChange={(e) => setEditingDate(e.target.value)}
                                    className="text-xs border border-gray-300 rounded px-1 py-0.5 w-40"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      updateBlogDate(blog.id, editingDate, blog.source || "")
                                    }}
                                    className="ml-1 text-green-600 hover:text-green-800"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setEditingBlogId(null)
                                    }}
                                    className="ml-1 text-red-600 hover:text-red-800"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <span
                                  className="cursor-pointer hover:underline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setEditingBlogId(blog.id)
                                    // Format the date for datetime-local input
                                    const date = new Date(blog.created_at)
                                    const formattedDate = date.toISOString().slice(0, 16)
                                    setEditingDate(formattedDate)
                                  }}
                                >
                                  {formatDate(blog.created_at)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="font-medium text-gray-900 text-lg mb-2">{blog.title}</h3>

                          {blog.summary && <p className="text-sm text-gray-600 line-clamp-3 mb-3">{blog.summary}</p>}

                          {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-auto">
                              {blog.tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              {blog.tags.length > 3 && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                  +{blog.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Card Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(blog.created_at)}
                          </div>
                          <button
                            onClick={() => {
                              if (blog.source === "headline_to_blog") {
                                router.push(`/generate/${blog.id}`)
                              } else {
                                router.push(`/generated/${blog.id}`)
                              }
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Compact View
                  <div className="space-y-2">
                    {filteredBlogs.map((blog) => (
                      <div
                        key={blog.id}
                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center gap-3"
                        onClick={() => {
                          if (blog.source === "headline_to_blog") {
                            router.push(`/generate/${blog.id}`)
                          } else {
                            router.push(`/generated/${blog.id}`)
                          }
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSourceBadgeStyles(
                                blog.source || "",
                              )}`}
                            >
                              {getSourceLabel(blog.source || "")}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {editingBlogId === blog.id ? (
                                <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="datetime-local"
                                    value={editingDate}
                                    onChange={(e) => setEditingDate(e.target.value)}
                                    className="text-xs border border-gray-300 rounded px-1 py-0.5 w-40"
                                  />
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      updateBlogDate(blog.id, editingDate, blog.source || "")
                                    }}
                                    className="ml-1 text-green-600 hover:text-green-800"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setEditingBlogId(null)
                                    }}
                                    className="ml-1 text-red-600 hover:text-red-800"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <span
                                  className="cursor-pointer hover:underline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setEditingBlogId(blog.id)
                                    // Format the date for datetime-local input
                                    const date = new Date(blog.created_at)
                                    const formattedDate = date.toISOString().slice(0, 16)
                                    setEditingDate(formattedDate)
                                  }}
                                >
                                  {formatDate(blog.created_at)}
                                </span>
                              )}
                            </span>
                          </div>
                          <h3 className="font-medium text-gray-900 truncate">{blog.title}</h3>
                          {blog.summary && <p className="text-xs text-gray-600 line-clamp-1 mt-1">{blog.summary}</p>}
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="hidden sm:flex items-center gap-1">
                              <Tag className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{blog.tags.length}</span>
                            </div>
                          )}
                          <button
                            onClick={() => {
                              if (blog.source === "headline_to_blog") {
                                router.push(`/generate/${blog.id}`)
                              } else {
                                router.push(`/generated/${blog.id}`)
                              }
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center px-3 py-1 bg-blue-50 rounded-lg"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
