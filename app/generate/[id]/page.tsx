"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { ArrowLeft, Calendar, Globe, BookOpen, AlertCircle, Loader2, Clock } from "lucide-react"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
})

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
  is_blurred?: boolean // Optional property from server-side
}

export default function GeneratedBlogPost() {
  const { id } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [readTime, setReadTime] = useState<number>(0)
  const supabase = createClient()

  useEffect(() => {
    if (id) {
      fetchPost(id as string)
    }
  }, [id])

  useEffect(() => {
    if (post) {
      calculateReadTime(post.blog_post)
    }
  }, [post])

  const calculateReadTime = (htmlContent: string) => {
    // Create a temporary element to parse HTML
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = htmlContent

    // Get text content from HTML
    const text = tempDiv.textContent || tempDiv.innerText || ""

    // Count words (split by spaces and filter out empty strings)
    const words = text.split(/\s+/).filter((word) => word.length > 0)

    // Calculate read time based on average reading speed (225 words per minute)
    const wordsPerMinute = 225
    const minutes = Math.ceil(words.length / wordsPerMinute)

    setReadTime(minutes)
  }

  const fetchPost = async (postId: string) => {
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setError("Please log in to view this post.")
        setLoading(false)
        return
      }

      // Query the "blogs" table instead of "headlinetoblog"
      const { data, error } = await supabase
        .from("headlinetoblog") // Updated table name
        .select("*")
        .eq("id", postId)
        .eq("user_id", user.id)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      if (!data) {
        throw new Error("Post not found or you don't have access to it.")
      }

      setPost(data)
    } catch (err: any) {
      console.error("Error fetching post:", err.message)
      setError(`Failed to load post: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen bg-white flex items-center justify-center ${inter.className}`}>
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 text-lg font-medium">Loading your blog post...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-white flex items-center justify-center ${inter.className}`}>
        <div className="bg-red-50 text-red-700 p-6 rounded-md max-w-lg text-center border border-red-100 shadow-sm">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p className="font-medium">{error}</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className={`min-h-screen bg-white flex items-center justify-center ${inter.className}`}>
        <div className="text-center">
          <BookOpen className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 text-lg font-medium">No post found.</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatReadTime = (minutes: number) => {
    if (minutes < 1) return "Less than 1 min read"
    return `${minutes} min read`
  }

  return (
    <div className={`min-h-screen bg-white ${inter.className}`}>
      <header className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-200 py-12 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start">
            <a
              href="/headlinetoblog"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Generator
            </a>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-3">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center text-sm text-gray-500 mt-2 space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5 text-blue-500" />
                <time dateTime={post.created_at} className="font-medium">
                  {formatDate(post.created_at)}
                </time>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1.5 text-blue-500" />
                <span className="font-medium">{formatReadTime(readTime)}</span>
              </div>
              {post.url && (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1.5 text-blue-500" />
                  <a
                    href={post.url}
                    className="text-blue-600 hover:underline hover:text-blue-800 transition-colors font-medium"
                  >
                    Source
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <article className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {post.is_blurred ? (
            <div className="relative">
              <div
                className="prose prose-blue lg:prose-lg max-w-none text-gray-700 filter blur-md pointer-events-none p-6 sm:p-10"
                dangerouslySetInnerHTML={{ __html: post.blog_post }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
                <div className="text-center p-6 max-w-md">
                  <div className="bg-blue-100 text-blue-800 p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <p className="text-xl font-semibold text-gray-900 mb-2">Premium Content</p>
                  <p className="text-gray-600 mb-6">
                    Subscribe to an active plan to unlock this post and generate more content.
                  </p>
                  <a
                    href="/pricing"
                    className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Subscribe Now
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-10">
              <div
                className="prose prose-blue lg:prose-lg max-w-none text-gray-700 prose-headings:font-semibold prose-headings:text-gray-900 prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ __html: post.blog_post }}
              />
            </div>
          )}

          {post.citations.length > 0 && (
            <div className="px-6 sm:px-10 pt-6 pb-8 border-t border-gray-100 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Citations</h3>
              <ul className="space-y-3">
                {post.citations.map((citation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-xs bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 font-medium">
                      {index + 1}
                    </span>
                    <a href={citation} className="text-blue-600 hover:underline break-all">
                      {citation}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-6 sm:px-10 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="text-sm text-gray-500 space-y-1">
                <p className="flex items-center">
                  <span className="font-medium text-gray-700 mr-2">Generated:</span>
                  {new Date(post.created_at).toLocaleString()}
                </p>
                <p className="flex items-center">
                  <span className="font-medium text-gray-700 mr-2">Reveal Date:</span>
                  {new Date(post.reveal_date).toLocaleString()}
                </p>
              </div>
              <a
                href="/headlinetoblog"
                className="inline-flex items-center justify-center bg-blue-600 text-white py-2.5 px-5 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium shadow-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back to Generator
              </a>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}
