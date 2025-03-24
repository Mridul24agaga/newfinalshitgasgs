"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
  CalendarIcon,
  X,
  Check,
  ChevronDown,
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
  isToday as isDateToday,
  isBefore,
  isSameMonth,
  addMonths,
  subMonths,
  getDate,
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
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState<boolean>(false)
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState<boolean>(false)
  const [postToReschedule, setPostToReschedule] = useState<BlogPost | null>(null)
  const [calendarDate, setCalendarDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRescheduling, setIsRescheduling] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  useEffect(() => {
    // Set initial selected date to next available date when posts are loaded
    if (blogPosts.length > 0 && !selectedDate) {
      const nextDate = findNextAvailableDate()
      setSelectedDate(nextDate)
    }
  }, [blogPosts])

  useEffect(() => {
    // Close calendar dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
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

  const isDateOccupied = (date: Date) => {
    return blogPosts.some((post) => {
      const revealDate = parseISO(post.reveal_date)
      return isSameDay(revealDate, date)
    })
  }

  const findNextAvailableDate = (startDate: Date = new Date()): Date => {
    let currentDate = new Date(startDate)

    // Look ahead up to 30 days to find an available slot
    for (let i = 0; i < 30; i++) {
      if (!isDateOccupied(currentDate)) {
        return currentDate
      }
      // Move to next day
      currentDate = addDays(currentDate, 1)
    }

    // If no date found in the next 30 days, return the day after the last checked date
    return currentDate
  }

  // Add this function after findNextAvailableDate
  const distributePostsAcrossDates = async (posts: BlogPost[]) => {
    if (posts.length === 0) return []

    // Sort posts by created_at date
    const sortedPosts = [...posts].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

    let currentDate = new Date()
    const distributedPosts: BlogPost[] = []

    for (const post of sortedPosts) {
      // Find the next available date
      currentDate = findNextAvailableDate(currentDate)

      // Update the post's reveal_date
      const updatedPost = { ...post, reveal_date: currentDate.toISOString() }

      try {
        // Update in database
        const { error } = await supabase
          .from("blogs")
          .update({ reveal_date: currentDate.toISOString() })
          .eq("id", post.id)

        if (error) {
          console.error("Error updating post date:", error)
        }
      } catch (err) {
        console.error("Error in distributePostsAcrossDates:", err)
      }

      distributedPosts.push(updatedPost)

      // Move to next day for the next post
      currentDate = addDays(currentDate, 1)
    }

    return distributedPosts
  }

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleCalendarPrevMonth = () => {
    setCalendarDate(subMonths(calendarDate, 1))
  }

  const handleCalendarNextMonth = () => {
    setCalendarDate(addMonths(calendarDate, 1))
  }

  const handleViewPost = (post: BlogPost) => {
    router.push(`/generated/${post.id}`)
  }

  const handleReschedulePost = (post: BlogPost) => {
    setPostToReschedule(post)
    setSelectedDate(parseISO(post.reveal_date))
    setIsRescheduleModalOpen(true)
  }

  const confirmReschedule = async () => {
    if (!postToReschedule || !selectedDate) return

    try {
      setIsRescheduling(true)

      // Check if the selected date is already occupied by another post
      const isOccupied = blogPosts.some(
        (post) => post.id !== postToReschedule.id && isSameDay(parseISO(post.reveal_date), selectedDate),
      )

      if (isOccupied) {
        setError(`A post is already scheduled for ${format(selectedDate, "MMMM d, yyyy")}`)
        setIsRescheduling(false)
        return
      }

      const { error } = await supabase
        .from("blogs")
        .update({ reveal_date: selectedDate.toISOString() })
        .eq("id", postToReschedule.id)

      if (error) {
        console.error("Error rescheduling blog post:", error)
        setError("Failed to reschedule the blog post")
      } else {
        // Update the post in state
        setBlogPosts(
          blogPosts.map((post) =>
            post.id === postToReschedule.id ? { ...post, reveal_date: selectedDate.toISOString() } : post,
          ),
        )
      }
    } catch (error) {
      console.error("Error in confirmReschedule:", error)
      setError("An unexpected error occurred while rescheduling")
    } finally {
      setIsRescheduling(false)
      setIsRescheduleModalOpen(false)
      setPostToReschedule(null)
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setError("Please enter a URL to generate content from")
      return
    }

    if (!selectedDate) {
      setError("Please select a publication date")
      return
    }

    // Check if the selected date already has a post
    if (isDateOccupied(selectedDate)) {
      setError(
        `You already have a blog post scheduled for ${format(selectedDate, "MMMM d, yyyy")}. Please select a different date.`,
      )
      return
    }

    try {
      setIsGenerating(true)

      // Mock generation for demo purposes
      // In a real app, you would call your API to generate content
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create a new blog post
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { data, error } = await supabase
        .from("blogs")
        .insert({
          user_id: user?.id,
          title: title || `Generated Post - ${format(selectedDate, "MMM d, yyyy")}`,
          blog_post: `<h1>Generated Blog Post</h1><p>This is a placeholder for generated content from ${url}</p>`,
          reveal_date: selectedDate.toISOString(),
          url: url,
          created_at: new Date().toISOString(),
        })
        .select()

      if (error) {
        throw new Error(error.message)
      }

      // Add the new post to state
      if (data && data.length > 0) {
        setBlogPosts([...blogPosts, data[0]])
      }

      // Reset form
      setUrl("")
      setTitle("")
      setSelectedDate(findNextAvailableDate(addDays(selectedDate, 1)))
      setIsGenerateModalOpen(false)
    } catch (error) {
      console.error("Error generating content:", error)
      setError("Failed to generate content. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const openGenerateModal = () => {
    // Set the next available date
    const nextDate = findNextAvailableDate()
    setSelectedDate(nextDate)
    setCalendarDate(nextDate)
    setIsGenerateModalOpen(true)
  }

  const days = getDaysInMonth(currentMonth)
  const calendarDays = getDaysInMonth(calendarDate)
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Calculate the first day of the month to add empty cells before
  const firstDayOfMonth = startOfMonth(currentMonth)
  const startingDayOfWeek = getDay(firstDayOfMonth)

  const calendarFirstDayOfMonth = startOfMonth(calendarDate)
  const calendarStartingDayOfWeek = getDay(calendarFirstDayOfMonth)

  if (isLoading) {
    return (
      <div className={`${saira.className} flex flex-col items-center justify-center min-h-[400px] py-16`}>
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
        <p className="text-base font-normal text-gray-600 mt-4">Loading content data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${saira.className} max-w-3xl mx-auto my-8 border border-gray-300 bg-white shadow-sm`}>
        <div className="border-l-4 border-orange-600 p-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-base font-medium text-gray-900">Error</h3>
              <p className="text-sm text-gray-600 mt-1">{error}</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => setError(null)}
                  className="px-4 py-1.5 bg-gray-100 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="px-4 py-1.5 bg-gray-100 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
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
          <h1 className="text-2xl font-medium text-orange-700 tracking-tight">Content Planner</h1>
          <p className="text-sm text-gray-500 mt-1">Plan and schedule your content publication strategy</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="px-3 py-1.5 border border-orange-300 bg-orange-50 text-sm font-medium text-orange-700 hover:bg-orange-100 transition-colors tracking-wide"
            onClick={() => fetchBlogPosts()}
          >
            Refresh
          </button>
          <button
            className="px-3 py-1.5 border border-orange-300 bg-orange-50 text-sm font-medium text-orange-700 hover:bg-orange-100 transition-colors tracking-wide"
            onClick={async () => {
              setIsLoading(true)
              const distributedPosts = await distributePostsAcrossDates(blogPosts)
              if (distributedPosts.length > 0) {
                setBlogPosts(distributedPosts)
              }
              setIsLoading(false)
            }}
          >
            Distribute Posts
          </button>
          <button
            className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 border border-orange-600 text-sm font-medium text-white hover:from-orange-600 hover:to-orange-700 transition-colors tracking-wide shadow-sm"
            onClick={openGenerateModal}
          >
            <span className="flex items-center">
              <Plus className="h-4 w-4 mr-1.5" />
              New Content
            </span>
          </button>
        </div>
      </div>

      {blogPosts.length === 0 ? (
        <div className="bg-orange-50 border border-orange-200 p-8 text-center">
          <FileText className="h-8 w-8 text-orange-500 mx-auto mb-3" />
          <h3 className="text-base font-medium text-orange-800 mb-2 tracking-tight">No Content Available</h3>
          <p className="text-sm text-orange-600/70 max-w-md mx-auto mb-5">
            Your content calendar is currently empty. Create your first post to begin planning your content strategy.
          </p>
          <button
            onClick={openGenerateModal}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium hover:from-orange-600 hover:to-orange-700 transition-colors inline-flex items-center tracking-wide shadow-sm"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Create Content
          </button>
        </div>
      ) : (
        <>
          {/* Calendar View */}
          <div className="bg-white border border-gray-300 mb-6">
            <div className="flex items-center justify-between px-4 py-3 border-b border-orange-200 bg-gradient-to-r from-orange-100 to-orange-50">
              <button onClick={handlePrevMonth} className="p-1 hover:bg-orange-200 rounded-full transition-colors">
                <ChevronLeft className="h-5 w-5 text-orange-600" />
              </button>
              <h2 className="text-base font-medium text-orange-800 tracking-tight">
                {format(currentMonth, "MMMM yyyy")}
              </h2>
              <button onClick={handleNextMonth} className="p-1 hover:bg-orange-200 rounded-full transition-colors">
                <ChevronRight className="h-5 w-5 text-orange-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border-b border-orange-200 bg-orange-50/50">
              {weekdays.map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-xs font-medium text-orange-700 border-r border-orange-100 last:border-r-0 tracking-wide"
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
                const isToday = isDateToday(day)
                const isWeekendDay = isWeekend(day)
                const hasPost = postsForDay.length > 0

                return (
                  <div
                    key={index}
                    className={`h-[110px] border-r border-b border-gray-300 last:border-r-0 ${
                      isCurrentMonth ? (isWeekendDay ? "bg-gray-50" : "bg-white") : "bg-gray-100"
                    } ${isToday ? "border-l-2 border-l-orange-500" : ""} ${hasPost ? "bg-orange-50/50" : ""}`}
                  >
                    <div className={`p-1 border-b ${hasPost ? "border-orange-200" : "border-gray-200"}`}>
                      <div
                        className={`text-xs font-medium ${
                          isToday
                            ? "text-orange-600 font-semibold"
                            : isCurrentMonth
                              ? hasPost
                                ? "text-orange-700"
                                : isWeekendDay
                                  ? "text-gray-500"
                                  : "text-gray-900"
                              : "text-gray-400"
                        }`}
                      >
                        {format(day, "d")}
                        {hasPost && <span className="ml-1 text-orange-500">•</span>}
                      </div>
                    </div>

                    <div className="p-1 overflow-y-auto h-[85px]">
                      {postsForDay.map((post) => (
                        <div
                          key={post.id}
                          className="mb-1 px-1.5 py-1 text-xs border-l-2 border-l-orange-500 bg-orange-50 text-gray-900 cursor-pointer hover:bg-orange-100 transition-colors flex items-center justify-between group"
                        >
                          <span className="truncate cursor-pointer" onClick={() => handleViewPost(post)}>
                            {post.title || "Blog Post"}
                          </span>
                          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleReschedulePost(post)
                              }}
                              className="p-0.5 text-gray-500 hover:text-orange-600 transition-colors"
                            >
                              <CalendarIcon className="h-3 w-3" />
                            </button>
                          </div>
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
            <div className="px-4 py-3 border-b border-orange-200 bg-gradient-to-r from-orange-100 to-orange-50 flex items-center justify-between">
              <h2 className="text-base font-medium text-orange-800 flex items-center tracking-tight">
                <CalendarDays className="h-4 w-4 mr-2 text-orange-600" />
                Scheduled Content
              </h2>
              <span className="text-xs text-orange-600/70">{blogPosts.length} items</span>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-orange-200 bg-orange-50 text-left">
                  <th className="px-4 py-2 text-xs font-medium text-orange-700 tracking-wide">Title</th>
                  <th className="px-4 py-2 text-xs font-medium text-orange-700 tracking-wide">Publication Date</th>
                  <th className="px-4 py-2 text-xs font-medium text-orange-700 hidden md:table-cell tracking-wide">
                    Source URL
                  </th>
                  <th className="px-4 py-2 text-xs font-medium text-orange-700 w-24 tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {blogPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-orange-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-orange-500 mr-2" />
                        <span
                          className="text-sm font-medium text-gray-900 truncate max-w-[200px] cursor-pointer hover:text-orange-700"
                          onClick={() => handleViewPost(post)}
                        >
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
                          <ExternalLink className="h-3 w-3 mr-1.5 text-orange-400" />
                          <span className="truncate max-w-[250px]">{post.url}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewPost(post)}
                          className="px-3 py-1 text-xs bg-orange-100 border border-orange-200 text-orange-700 hover:bg-orange-200 transition-colors inline-flex items-center tracking-wide"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Generate Content Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 max-w-md w-full mx-4 shadow-lg border border-gray-300 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Generate New Content</h3>
              <button onClick={() => setIsGenerateModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGenerate}>
              <div className="mb-4">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  Source URL
                </label>
                <input
                  type="url"
                  id="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the URL of the content you want to generate a blog post from
                </p>
              </div>

              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="My Blog Post Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank to auto-generate a title</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Publication Date</label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-orange-500"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  >
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
                      {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {isCalendarOpen && (
                    <div
                      ref={calendarRef}
                      className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg"
                    >
                      <div className="p-2">
                        <div className="flex items-center justify-between mb-2">
                          <button
                            type="button"
                            onClick={handleCalendarPrevMonth}
                            className="p-1 hover:bg-gray-100 rounded-full"
                          >
                            <ChevronLeft className="h-4 w-4 text-gray-600" />
                          </button>
                          <div className="text-sm font-medium">{format(calendarDate, "MMMM yyyy")}</div>
                          <button
                            type="button"
                            onClick={handleCalendarNextMonth}
                            className="p-1 hover:bg-gray-100 rounded-full"
                          >
                            <ChevronRight className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-1">
                          {weekdays.map((day, i) => (
                            <div key={i} className="text-center text-xs font-medium text-gray-500 py-1">
                              {day.substring(0, 1)}
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: calendarStartingDayOfWeek }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-8" />
                          ))}

                          {calendarDays.map((day, i) => {
                            const isSelected = selectedDate && isSameDay(day, selectedDate)
                            const isDisabled =
                              isDateOccupied(day) &&
                              (!postToReschedule || !isSameDay(day, parseISO(postToReschedule.reveal_date)))
                            const isPast = isBefore(day, new Date()) && !isDateToday(day)
                            const isCurrentMonth = isSameMonth(day, calendarDate)

                            return (
                              <button
                                key={i}
                                type="button"
                                disabled={isPast || isDisabled}
                                onClick={() => {
                                  setSelectedDate(day)
                                  setIsCalendarOpen(false)
                                }}
                                className={`
                                  h-8 w-8 flex items-center justify-center rounded-full text-sm
                                  ${isSelected ? "bg-orange-500 text-white" : ""}
                                  ${!isSelected && isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                                  ${isPast ? "opacity-50 cursor-not-allowed" : ""}
                                  ${isDisabled ? "bg-orange-100 text-orange-800 cursor-not-allowed" : ""}
                                  ${!isPast && !isDisabled && !isSelected ? "hover:bg-gray-100" : ""}
                                `}
                              >
                                {getDate(day)}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div className="p-2 border-t border-gray-200">
                        <div className="flex items-center text-xs text-gray-500">
                          <div className="w-3 h-3 bg-orange-100 rounded-full mr-2"></div>
                          <span>Date already has a scheduled post</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Only one blog post can be scheduled per day. Dates with existing posts are highlighted.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium hover:from-orange-600 hover:to-orange-700 transition-colors rounded flex items-center"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Content"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {isRescheduleModalOpen && postToReschedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 max-w-md w-full mx-4 shadow-lg border border-gray-300 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Reschedule Blog Post</h3>
              <button
                onClick={() => {
                  setIsRescheduleModalOpen(false)
                  setPostToReschedule(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Current publication date:</p>
              <div className="px-3 py-2 bg-orange-50 border border-orange-200 text-orange-800 rounded-md">
                {format(parseISO(postToReschedule.reveal_date), "MMMM d, yyyy")}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium mb-2">New publication date:</p>
              <div className="relative">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                >
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
                    {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {isCalendarOpen && (
                  <div
                    ref={calendarRef}
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg"
                  >
                    <div className="p-2">
                      <div className="flex items-center justify-between mb-2">
                        <button
                          type="button"
                          onClick={handleCalendarPrevMonth}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <ChevronLeft className="h-4 w-4 text-gray-600" />
                        </button>
                        <div className="text-sm font-medium">{format(calendarDate, "MMMM yyyy")}</div>
                        <button
                          type="button"
                          onClick={handleCalendarNextMonth}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <ChevronRight className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 mb-1">
                        {weekdays.map((day, i) => (
                          <div key={i} className="text-center text-xs font-medium text-gray-500 py-1">
                            {day.substring(0, 1)}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: calendarStartingDayOfWeek }).map((_, i) => (
                          <div key={`empty-${i}`} className="h-8" />
                        ))}

                        {calendarDays.map((day, i) => {
                          const isSelected = selectedDate && isSameDay(day, selectedDate)
                          const isCurrentPostDate = isSameDay(day, parseISO(postToReschedule.reveal_date))
                          const isDisabled = isDateOccupied(day) && !isCurrentPostDate
                          const isPast = isBefore(day, new Date()) && !isDateToday(day)
                          const isCurrentMonth = isSameMonth(day, calendarDate)

                          return (
                            <button
                              key={i}
                              type="button"
                              disabled={isPast || isDisabled}
                              onClick={() => {
                                setSelectedDate(day)
                                setIsCalendarOpen(false)
                              }}
                              className={`
                                h-8 w-8 flex items-center justify-center rounded-full text-sm
                                ${isSelected ? "bg-orange-500 text-white" : ""}
                                ${isCurrentPostDate && !isSelected ? "bg-orange-200 text-orange-800" : ""}
                                ${!isSelected && !isCurrentPostDate && isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                                ${isPast ? "opacity-50 cursor-not-allowed" : ""}
                                ${isDisabled ? "bg-orange-100 text-orange-800 cursor-not-allowed" : ""}
                                ${!isPast && !isDisabled && !isSelected ? "hover:bg-gray-100" : ""}
                              `}
                            >
                              {getDate(day)}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="p-2 border-t border-gray-200">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <div className="w-3 h-3 bg-orange-100 rounded-full mr-2"></div>
                        <span>Date already has a scheduled post</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <div className="w-3 h-3 bg-orange-200 rounded-full mr-2"></div>
                        <span>Current publication date</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsRescheduleModalOpen(false)
                  setPostToReschedule(null)
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmReschedule}
                disabled={
                  isRescheduling || !selectedDate || isSameDay(selectedDate, parseISO(postToReschedule.reveal_date))
                }
                className="px-4 py-2 bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors rounded flex items-center"
              >
                {isRescheduling ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

