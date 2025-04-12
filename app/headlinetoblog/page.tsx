"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { AppSidebar } from "../components/sidebar"
import {
  BookOpen,
  FileText,
  History,
  Home,
  Settings,
  PenTool,
  Sparkles,
  Loader2,
  AlertCircle,
  Globe,
  ChevronRight,
} from "lucide-react"

interface BlogPost {
  id: string
  user_id: string
  blog_post: string
  citations: string[]
  created_at: string
  title: string
  timestamp: string
  reveal_date: string
  url: string | null
  is_blurred?: boolean
  needs_formatting?: boolean
}

export default function HeadlineToBlog() {
  const [headline, setHeadline] = useState("")
  const [website, setWebsite] = useState("")
  const [humanizeLevel, setHumanizeLevel] = useState<"normal" | "hardcore">("normal")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedPosts, setGeneratedPosts] = useState<BlogPost[]>([])
  const [existingPosts, setExistingPosts] = useState<BlogPost[]>([])
  const [activeTab, setActiveTab] = useState<"generate" | "history">("generate")
  const supabase = createClient()
  const router = useRouter()
  const [loadingPosts, setLoadingPosts] = useState(false)

  // Sidebar navigation items
  const navItems = [
    { icon: PenTool, label: "Generate Blog", action: () => setActiveTab("generate"), active: activeTab === "generate" },
    { icon: History, label: "History", action: () => setActiveTab("history"), active: activeTab === "history" },
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  // Fetch existing posts on mount
  useEffect(() => {
    fetchExistingPosts()
  }, [])

  const fetchExistingPosts = async () => {
    try {
      setLoadingPosts(true)
      console.log("Fetching existing posts...")
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        console.log("No authenticated user found")
        setError("Please log in to view your posts.")
        return
      }

      console.log(`Fetching posts for user: ${user.id}`)
      const { data, error } = await supabase
        .from("headlinetoblog")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching posts:", error.message)
        setError("Failed to load existing posts. Please try again later.")
        return
      }

      console.log(`Found ${data?.length || 0} existing posts`)
      setExistingPosts(data || [])
    } catch (err: any) {
      console.error("Exception in fetchExistingPosts:", err.message)
      setError("An unexpected error occurred while loading your posts.")
    } finally {
      setLoadingPosts(false)
    }
  }

  const handleGenerateBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setGeneratedPosts([])

    try {
      // Prepare payload for API request
      const payload = {
        url: website || "", // Send empty string if no URL provided
        headline,
        humanizeLevel,
      }

      console.log(`Sending request to generate blog with payload:`, payload)

      // Call the API endpoint
      const response = await fetch("/api/generate-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      // Check for API errors
      if (!response.ok || data.error) {
        console.error("API error:", data.error || "Unknown error")
        throw new Error(data.error || "Failed to generate blog post")
      }

      // Get user data
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData.user?.id || ""

      // Extract blog posts from response
      const posts: BlogPost[] = data.blogPosts.map((post: any) => ({
        id: post.id,
        user_id: userId,
        blog_post: post.content,
        citations: post.citations,
        created_at: new Date().toISOString(), // API doesn't return created_at, using current time
        title: post.title,
        timestamp: post.timestamp,
        reveal_date: post.reveal_date,
        url: post.url || null,
        is_blurred: post.is_blurred || false,
        needs_formatting: post.needs_formatting || false,
      }))

      console.log(`Received ${posts.length} blog post(s) from API`)

      setGeneratedPosts(posts)

      // Redirect to the generated post's page using the first post's id
      if (posts.length > 0) {
        const postId = posts[0].id
        console.log(`Blog post generated with ID: ${postId}. Verifying existence before redirect...`)

        // Verify the post exists before redirecting
        const { data: postExists, error: postError } = await supabase
          .from("headlinetoblog")
          .select("id")
          .eq("id", postId)
          .eq("user_id", userId)

        if (postError || !postExists || postExists.length === 0) {
          console.error("Post verification failed:", postError?.message || "Post not found")
          throw new Error("Generated post could not be found in the database.")
        }

        console.log(`Post ${postId} verified. Redirecting to /generate/${postId}`)
        router.push(`/generate/${postId}`)
      } else {
        throw new Error("No posts were generated.")
      }

      await fetchExistingPosts()
    } catch (err: any) {
      console.error("Error generating blog:", err.message)
      setError(`Failed to generate blog: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const truncateHTML = (html: string, maxLength = 150) => {
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = html
    let text = tempDiv.textContent || tempDiv.innerText || ""
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + "..."
    }
    return text
  }

  const handleViewPost = async (postId: string) => {
    try {
      // Verify the post exists before navigating
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData.user?.id

      const { data: postExists, error: postError } = await supabase
        .from("headlinetoblog")
        .select("id")
        .eq("id", postId)
        .eq("user_id", userId)

      if (postError || !postExists || postExists.length === 0) {
        setError("Post not found or you do not have access to it.")
        return
      }
      router.push(`/generate/${postId}`)
    } catch (err: any) {
      console.error("Error viewing post:", err.message)
      setError(`Failed to view post: ${err.message}`)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed width sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <div className="bg-blue-600 text-white p-2 rounded-md mr-2">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-blue-600">Blogosocial</h2>
        </div>
        <AppSidebar />
      </div>

      {/* Main Content - with its own scrollbar */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 p-6 flex items-center">
          {/* Add header content if needed */}
        </header>

        <main className="p-6 pr-12">
          {activeTab === "generate" ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Create Your Blog Post</h2>
                  <p className="text-gray-500 mt-1">
                    Enter a headline and optionally a website URL to generate a blog post tailored to your input.
                  </p>
                </div>

                <div className="p-6">
                  <form onSubmit={handleGenerateBlog} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
                        Headline <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="headline"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="e.g., Why AI Will Dominate Marketing in 2025"
                        className="w-full h-12 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#294fd6] focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                        Website URL <span className="text-gray-400">(Optional)</span>
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-[#294fd6] focus-within:border-transparent">
                        <span className="pl-3">
                          <Globe className="h-5 w-5 text-gray-400" />
                        </span>
                        <input
                          id="website"
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="e.g., https://example.com"
                          className="w-full h-12 px-2 border-0 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Humanize Level</label>
                      <div className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="normal"
                            name="humanizeLevel"
                            value="normal"
                            checked={humanizeLevel === "normal"}
                            onChange={() => setHumanizeLevel("normal")}
                            className="h-4 w-4 text-[#294fd6] focus:ring-[#294fd6]"
                          />
                          <label htmlFor="normal" className="text-gray-700 cursor-pointer">
                            Normal
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="hardcore"
                            name="humanizeLevel"
                            value="hardcore"
                            checked={humanizeLevel === "hardcore"}
                            onChange={() => setHumanizeLevel("hardcore")}
                            className="h-4 w-4 text-[#294fd6] focus:ring-[#294fd6]"
                          />
                          <label htmlFor="hardcore" className="text-gray-700 cursor-pointer">
                            Hardcore
                          </label>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Hardcore mode creates more human-like content with varied sentence structures.
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Error</h3>
                          <p>{error}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end border-t border-gray-100 pt-6">
                      <button
                        type="submit"
                        disabled={loading || !headline.trim()}
                        className={`flex items-center px-8 py-3 rounded-md text-white font-medium ${
                          loading || !headline.trim()
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#294fd6] hover:bg-[#1e3eb8]"
                        } transition-colors`}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Generate Blog Post
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {generatedPosts.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Generated Blog Post</h2>
                    <p className="text-gray-500 mt-1">Your blog post has been successfully generated</p>
                  </div>

                  <div className="p-6">
                    {generatedPosts.map((post) => (
                      <div key={post.id} className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                        {post.is_blurred && (
                          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
                            <p>This post is blurred. Subscribe to an active plan to unlock it.</p>
                          </div>
                        )}
                        <div
                          className={`prose max-w-none text-gray-700 ${post.is_blurred ? "blur-sm" : ""}`}
                          dangerouslySetInnerHTML={{ __html: post.blog_post }}
                        />
                        {post.url && (
                          <p className="text-gray-600">
                            Source Website:{" "}
                            <a href={post.url} className="text-[#294fd6] underline">
                              {post.url}
                            </a>
                          </p>
                        )}
                        <p className="text-gray-500 text-sm">
                          Generated on: {new Date(post.created_at).toLocaleString()}
                        </p>
                        {post.needs_formatting && (
                          <p className="text-yellow-600 text-sm">This post needs formatting before publishing.</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold mb-6">Your Previous Posts</h2>

              {loadingPosts ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <Loader2 className="h-12 w-12 text-[#294fd6] mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-medium text-gray-700">Loading your posts...</h3>
                </div>
              ) : existingPosts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No posts yet</h3>
                    <p className="text-gray-500 mb-6">
                      You haven't generated any blog posts yet. Create your first one!
                    </p>
                    <button
                      onClick={() => setActiveTab("generate")}
                      className="px-4 py-2 bg-[#294fd6] hover:bg-[#1e3eb8] text-white rounded-md flex items-center justify-center mx-auto transition-colors"
                    >
                      <PenTool className="mr-2 h-4 w-4" />
                      Create New Post
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6">
                  {existingPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="bg-gradient-to-r from-[#294fd6]/5 to-[#294fd6]/10 p-6 pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold">
                              <a
                                href={`/generate/${post.id}`}
                                className="text-[#294fd6] hover:underline hover:text-[#1e3eb8] transition-colors"
                              >
                                {post.title}
                              </a>
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">{formatDate(post.created_at)}</p>
                          </div>
                          <div className="flex space-x-2">
                            {post.is_blurred && (
                              <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full border border-yellow-200">
                                Blurred
                              </span>
                            )}
                            {post.needs_formatting && (
                              <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full border border-yellow-200">
                                Needs Formatting
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 pt-4">
                        <p className={`text-gray-600 line-clamp-3 ${post.is_blurred ? "blur-sm" : ""}`}>
                          {truncateHTML(post.blog_post)}
                        </p>
                      </div>

                      <div className="flex justify-between items-center border-t border-gray-100 p-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>Full article</span>
                        </div>
                        <button
                          onClick={() => handleViewPost(post.id)}
                          className="flex items-center px-3 py-1 text-sm border border-[#294fd6] text-[#294fd6] rounded-md hover:bg-[#294fd6] hover:text-white transition-colors"
                        >
                          View Post
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
