"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import {
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Plus,
  CalendarDays,
  AlertCircle,
} from "lucide-react"
import {
  format,
  addDays,
  isSameDay,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isWeekend,
} from "date-fns"
import { Saira } from "next/font/google"

// Initialize the Saira font
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

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

  // Calculate the first day of the month to add empty cells before
  const firstDayOfMonth = startOfMonth(currentMonth)
  const startingDayOfWeek = getDay(firstDayOfMonth)

  if (isLoading) {
    return (
      <div className={`${saira.className} flex flex-col items-center justify-center min-h-[400px] py-16`}>
        <Loader2 className="h-10 w-10 text-gray-500 animate-spin" />
        <p className="text-base font-normal text-gray-600 mt-4">Loading content data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${saira.className} max-w-3xl mx-auto my-8 border border-gray-300 bg-white shadow-sm`}>
        <div className="border-l-4 border-red-600 p-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-base font-medium text-gray-900">Error</h3>
              <p className="text-sm text-gray-600 mt-1">{error}</p>
              <button
                onClick={() => router.push("/")}
                className="mt-3 px-4 py-1.5 bg-gray-100 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${saira.className} max-w-7xl mx-auto px-4 py-6`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 tracking-tight">Content Planner</h1>
          <p className="text-sm text-gray-500 mt-1">Plan and schedule your content publication strategy</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="px-3 py-1.5 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors tracking-wide"
            onClick={() => fetchBlogPosts()}
          >
            Refresh
          </button>
          <button
            className="px-3 py-1.5 bg-black border border-black text-sm font-medium text-white hover:bg-gray-800 transition-colors tracking-wide"
            onClick={() => router.push("/generate")}
          >
            <span className="flex items-center">
              <Plus className="h-4 w-4 mr-1.5" />
              New Content
            </span>
          </button>
        </div>
      </div>

      {blogPosts.length === 0 ? (
        <div className="bg-white border border-gray-300 p-8 text-center">
          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-medium text-gray-900 mb-2 tracking-tight">No Content Available</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-5">
            Your content calendar is currently empty. Create your first post to begin planning your content strategy.
          </p>
          <button
            onClick={() => router.push("/generate")}
            className="px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors inline-flex items-center tracking-wide"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Create Content
          </button>
        </div>
      ) : (
        <>
          {/* Calendar View */}
          <div className="bg-white border border-gray-300 mb-6">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 bg-gray-50">
              <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-200 transition-colors">
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h2 className="text-base font-medium text-gray-900 tracking-tight">
                {format(currentMonth, "MMMM yyyy")}
              </h2>
              <button onClick={handleNextMonth} className="p-1 hover:bg-gray-200 transition-colors">
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border-b border-gray-300">
              {weekdays.map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-xs font-medium text-gray-600 border-r border-gray-300 last:border-r-0 tracking-wide"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {/* Empty cells for days before the first day of month */}
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="h-[110px] border-r border-b border-gray-300 bg-gray-50 last:border-r-0"
                ></div>
              ))}

              {/* Actual days of the month */}
              {days.map((day, index) => {
                const postsForDay = getPostsForDay(day)
                const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
                const isToday = isSameDay(day, new Date())
                const isWeekendDay = isWeekend(day)

                return (
                  <div
                    key={index}
                    className={`h-[110px] border-r border-b border-gray-300 last:border-r-0 ${
                      isCurrentMonth ? (isWeekendDay ? "bg-gray-50" : "bg-white") : "bg-gray-100"
                    } ${isToday ? "border-l-2 border-l-black" : ""}`}
                  >
                    <div className="p-1 border-b border-gray-200">
                      <div
                        className={`text-xs font-medium ${
                          isToday
                            ? "text-black font-semibold"
                            : isCurrentMonth
                              ? isWeekendDay
                                ? "text-gray-500"
                                : "text-gray-900"
                              : "text-gray-400"
                        }`}
                      >
                        {format(day, "d")}
                      </div>
                    </div>

                    <div className="p-1 overflow-y-auto h-[85px]">
                      {postsForDay.map((post) => (
                        <div
                          key={post.id}
                          onClick={() => handleViewPost(post)}
                          className="mb-1 px-1.5 py-1 text-xs border-l-2 border-l-black bg-gray-50 text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors flex items-center"
                        >
                          <span className="truncate">{post.title || "Blog Post"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* All Posts List */}
          <div className="bg-white border border-gray-300">
            <div className="px-4 py-3 border-b border-gray-300 bg-gray-50 flex items-center justify-between">
              <h2 className="text-base font-medium text-gray-900 flex items-center tracking-tight">
                <CalendarDays className="h-4 w-4 mr-2 text-gray-600" />
                Scheduled Content
              </h2>
              <span className="text-xs text-gray-500">{blogPosts.length} items</span>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50 text-left">
                  <th className="px-4 py-2 text-xs font-medium text-gray-600 tracking-wide">Title</th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-600 tracking-wide">Publication Date</th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-600 hidden md:table-cell tracking-wide">
                    Source URL
                  </th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-600 w-24 tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {blogPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                          {post.title || "Untitled Blog Post"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {format(parseISO(post.reveal_date), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                      {post.url ? (
                        <div className="flex items-center">
                          <ExternalLink className="h-3 w-3 mr-1.5 text-gray-400" />
                          <span className="truncate max-w-[250px]">{post.url}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViewPost(post)}
                        className="px-3 py-1 text-xs bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 transition-colors inline-flex items-center tracking-wide"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

