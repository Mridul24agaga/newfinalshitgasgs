"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { Calendar, Clock, FileText, Loader2, ChevronLeft, ChevronRight, ExternalLink, Eye } from 'lucide-react'
import { format, addDays, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"

interface BlogPost {
  id: string
  user_id: string
  blog_post: string
  citations: string
  created_at: string
  title: string
  timestamp: string
  reveal_date: string
  url: string
}

export default function ContentPlanner() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      setIsLoading(true)
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        setError("You need to log in first")
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("user_id", user.id)
        .order("reveal_date", { ascending: true })

      if (error) {
        console.error("Error fetching blog posts:", error)
        setError("Failed to load your blog posts")
      } else {
        console.log("Fetched blog posts:", data)
        setBlogPosts(data || [])
      }
    } catch (error) {
      console.error("Error in fetchBlogPosts:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date)
    const end = endOfMonth(date)
    return eachDayOfInterval({ start, end })
  }

  const getPostsForDay = (day: Date) => {
    return blogPosts.filter((post) => {
      const revealDate = parseISO(post.reveal_date)
      return isSameDay(revealDate, day)
    })
  }

  const handlePrevMonth = () => {
    setCurrentMonth(addDays(currentMonth, -30))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addDays(currentMonth, 30))
  }

  const handleViewPost = (post: BlogPost) => {
    router.push(`/generated/${post.id}`)
  }

  const days = getDaysInMonth(currentMonth)
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-4" />
        <p className="text-lg text-gray-700">Loading your blog posts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl max-w-3xl mx-auto my-8">
        <h3 className="text-lg font-medium text-red-800">Error</h3>
        <p className="text-red-700 mt-2">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
        >
          Go Back Home
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Calendar className="mr-3 h-7 w-7 text-orange-600" />
          Content Planner
        </h1>
      </div>

      {blogPosts.length === 0 ? (
        <div className="bg-white rounded-xl border border-orange-200 shadow-md p-8 text-center">
          <div className="bg-orange-50 p-4 rounded-full inline-block mb-4">
            <FileText className="h-12 w-12 text-orange-500" />
          </div>
          <h3 className="text-xl font-semibold text-black mb-2">No Blog Posts Yet</h3>
          <p className="text-gray-700 max-w-md mx-auto mb-6">
            You haven't generated any blog posts yet. Enter a URL above to start generating awesome content!
          </p>
        </div>
      ) : (
        <>
          {/* Calendar Header */}
          <div className="bg-white rounded-xl border border-orange-200 shadow-md overflow-hidden mb-8">
            <div className="p-4 border-b border-orange-200 flex items-center justify-between">
              <button onClick={handlePrevMonth} className="p-2 rounded-lg hover:bg-orange-100 transition-colors">
                <ChevronLeft className="h-5 w-5 text-orange-700" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">{format(currentMonth, "MMMM yyyy")}</h2>
              <button onClick={handleNextMonth} className="p-2 rounded-lg hover:bg-orange-100 transition-colors">
                <ChevronRight className="h-5 w-5 text-orange-700" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 bg-orange-50">
              {weekdays.map((day) => (
                <div key={day} className="p-2 text-center font-medium text-orange-800">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((day, index) => {
                const postsForDay = getPostsForDay(day)
                const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
                const isToday = isSameDay(day, new Date())

                return (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border-t border-r border-orange-100 ${
                      isCurrentMonth ? "bg-white" : "bg-gray-50"
                    } ${isToday ? "ring-2 ring-orange-500 ring-inset" : ""}`}
                  >
                    <div
                      className={`text-sm font-medium ${
                        isCurrentMonth ? "text-gray-900" : "text-gray-400"
                      } ${isToday ? "text-orange-600" : ""}`}
                    >
                      {format(day, "d")}
                    </div>

                    {postsForDay.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => handleViewPost(post)}
                        className="mt-1 p-1 text-xs rounded bg-orange-100 text-orange-800 cursor-pointer hover:bg-orange-200 flex items-center"
                      >
                        <Eye className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{post.title || "Blog Post"}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>

          {/* All Posts List */}
          <div className="bg-white rounded-xl border border-orange-200 shadow-md overflow-hidden">
            <div className="p-4 border-b border-orange-200">
              <h2 className="text-xl font-semibold text-gray-900">All Posts</h2>
            </div>
            <div className="divide-y divide-orange-100">
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 flex items-center justify-between hover:bg-orange-50 cursor-pointer"
                  onClick={() => handleViewPost(post)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-orange-100">
                      <Eye className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{post.title || "Blog Post"}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{format(parseISO(post.reveal_date), "MMMM d, yyyy")}</span>
                      </div>
                      {post.url && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          <span className="truncate max-w-xs">{post.url}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}