"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { PlusCircle, FileText, Loader2, AlertCircle, Search, PenTool, Menu, Eye } from "lucide-react"
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

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [user, setUser] = useState<SupabaseUser | null>(null)
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

  useEffect(() => {
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
      }
    }

    if (user) {
      fetchBlogs()
    }
  }, [supabase, user])

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

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    document.addEventListener("contextmenu", handleContextMenu)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [])

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

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.email) return "U"
    return user.email.charAt(0).toUpperCase()
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* AppSidebar is already handling its own positioning */}
      <AppSidebar />

      <div className="flex flex-col flex-1 w-full">
        {/* Improved top navigation bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
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
              <h2 className="text-xl font-bold text-gray-900">Content Library</h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:flex items-center bg-gray-100 rounded-full pl-3 pr-1 py-1">
                <Search className="h-4 w-4 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="bg-transparent border-none focus:outline-none text-sm w-40 lg:w-60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-8">
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
                  href="/generate-blog"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Article
                </Link>
              </div>
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
                {filteredBlogs.length === 0 ? (
                  // Empty State
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-12 text-center rounded-lg border border-blue-100">
                    <div className="bg-white rounded-full p-4 inline-flex mb-6 border border-blue-100 shadow-sm">
                      <FileText className="h-12 w-12 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">Your Content Canvas Awaits</h2>
                    <p className="text-slate-600 mb-8 max-w-md mx-auto">
                      {searchQuery
                        ? "No articles match your search criteria. Try a different search term or create a new article."
                        : "Start your content creation journey by generating your first AI-powered article."}
                    </p>
                    <button
                      onClick={() => router.push("/generate-blog")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md transition-colors flex items-center justify-center mx-auto shadow-sm"
                    >
                      <PlusCircle className="h-5 w-5 mr-2" />
                      <span>Create Your First Article</span>
                    </button>
                  </div>
                ) : (
                  // Blog Table
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Article Title
                          </th>

                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Published Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBlogs.map((blog) => (
                          <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900 line-clamp-1">{blog.title}</div>
                              {blog.summary && (
                                <div className="text-xs text-gray-500 mt-1 line-clamp-1">{blog.summary}</div>
                              )}
                              <div className="mt-1">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    blog.source === "headline_to_blog"
                                      ? "bg-purple-50 text-purple-700"
                                      : "bg-green-50 text-green-700"
                                  }`}
                                >
                                  {blog.source === "headline_to_blog" ? "Headline to Blog" : "Blog Generator"}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(blog.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    if (blog.source === "headline_to_blog") {
                                      router.push(`/generate/${blog.id}`)
                                    } else {
                                      router.push(`/generated/${blog.id}`)
                                    }
                                  }}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                  title="View article"
                                >
                                  <Eye className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
