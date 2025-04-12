"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { PlusCircle, FileText, Loader2, AlertCircle, Search, PenTool, Menu } from "lucide-react"
import { AppSidebar } from "@/app/components/sidebar"
import { ProfileDropdown } from "@/app/components/profile-dropdown"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import Link from "next/link"

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

        // Fetch blogs from the headlinetoblog table for the current user
        const { data: headlineToBlogData, error: headlineToBlogError } = await supabase
          .from("headlinetoblog")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (headlineToBlogError) {
          throw new Error(headlineToBlogError.message)
        }

        // Combine both datasets
        const combinedBlogs = [...(blogsData || []), ...(headlineToBlogData || [])]

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

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AppSidebar />

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
              <h2 className="text-xl font-bold text-gray-900">Published Articles</h2>
            </div>

            <ProfileDropdown user={user} onSignOut={handleSignOut} />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Blog Posts Section */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center">
                      <span className="text-[#294fd6] mr-2">★</span>
                      Published Articles
                    </h2>
                    <p className="ml-4 text-sm text-slate-500">
                      Your published articles, ready to inspire your audience
                    </p>
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
                    <Link
                      href="/generate-blog"
                      onClick={() => router.push("/blog-generatoriknjmu89-")}
                      className="px-4 py-2 bg-[#294fd6] text-white rounded-lg hover:bg-[#1e3eb8] transition-all duration-300 text-sm font-medium flex items-center"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create New Blog
                    </Link>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-end mb-4 space-x-4">
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                  <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Export
                  </button>
                  <div className="flex items-center">
                    <span className="mr-2 text-sm text-gray-600">Show Published</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
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
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"
                          >
                            <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                          </th>
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
                            Keywords
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Published Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBlogs.map((blog) => (
                          <tr key={blog.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-wrap gap-1">
                                {blog.tags &&
                                  blog.tags.map((tag, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => router.push(`/generated/${blog.id}`)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                title="View blog"
                              >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(blog.created_at)}
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
