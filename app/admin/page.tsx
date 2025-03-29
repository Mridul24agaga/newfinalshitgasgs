"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, CheckIcon, ClockIcon, AlertCircleIcon } from "lucide-react"
import { format, addDays } from "date-fns"

type Blog = {
  id: string
  title: string
  content?: string
  blog_post: string
  scheduled_date?: string | null
  published?: boolean
}

export default function AdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [publishTime, setPublishTime] = useState<string>("02:09") // Default to 2:09 AM
  const [schedulingInProgress, setSchedulingInProgress] = useState<boolean>(false)
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error" | "info"; message: string } | null>(
    null,
  )
  const apiKey = "568feb6f19a409d73c11de7e3ce5cd702aca55a4590f5ccd9c4f89e92ec1c6a9" // Replace with your actual API key or get from env

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      // Use the new admin API endpoint to fetch blogs
      const res = await fetch("http://localhost:3000/api/admin/blogs", {
        headers: { Authorization: `Bearer ${apiKey}` },
      })

      if (!res.ok) {
        throw new Error(`Error fetching blogs: ${res.status}`)
      }

      const data: Blog[] = await res.json()

      // Add published status and content if they don't exist
      const blogsWithStatus = data.map((blog) => ({
        ...blog,
        content: blog.blog_post?.substring(0, 150) || "", // Extract a preview from blog_post
        published: blog.scheduled_date ? new Date(blog.scheduled_date) <= new Date() : false,
      }))

      setBlogs(blogsWithStatus)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching blogs:", error)
      setStatusMessage({ type: "error", message: "Failed to load blogs. Please try again." })
      setIsLoading(false)
    }
  }

  const scheduleAllBlogs = async () => {
    const unscheduledBlogs = blogs.filter((blog) => !blog.scheduled_date)

    if (unscheduledBlogs.length === 0) {
      setStatusMessage({ type: "info", message: "No unscheduled blogs to schedule" })
      return
    }

    setSchedulingInProgress(true)
    setStatusMessage({ type: "info", message: "Scheduling blogs..." })

    try {
      // Create a schedule for each unscheduled blog
      const schedulingQueue = []
      let currentDate = new Date(startDate)

      for (const blog of unscheduledBlogs) {
        // Create a new date object for each blog to avoid modifying the original
        const publishDate = new Date(currentDate)

        // Get the date part in YYYY-MM-DD format
        const datePart = format(publishDate, "yyyy-MM-dd")

        // Combine the date with the exact time the user selected
        const scheduledDateTime = `${datePart}T${publishTime}:00`

        schedulingQueue.push({
          blogId: blog.id,
          scheduledDate: scheduledDateTime,
        })

        // Move to the next day
        currentDate = addDays(currentDate, 1)
      }

      // Use the new admin API endpoint to schedule blogs
      const response = await fetch(`http://localhost:3000/api/admin/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          action: "schedule_blogs",
          schedules: schedulingQueue,
        }),
      })

      if (response.ok) {
        // Update local state
        const updatedBlogs = [...blogs]

        for (let i = 0; i < unscheduledBlogs.length; i++) {
          const blogIndex = updatedBlogs.findIndex((blog) => blog.id === unscheduledBlogs[i].id)
          if (blogIndex !== -1) {
            updatedBlogs[blogIndex] = {
              ...updatedBlogs[blogIndex],
              scheduled_date: schedulingQueue[i].scheduledDate,
            }
          }
        }

        setBlogs(updatedBlogs)
        setStatusMessage({
          type: "success",
          message: `Successfully scheduled ${schedulingQueue.length} posts starting from ${format(startDate, "MMMM d, yyyy")} at ${formatTime(publishTime)}`,
        })

        // Refresh blogs from server to ensure we have the latest data
        fetchBlogs()
      } else {
        const errorData = await response.json()
        setStatusMessage({
          type: "error",
          message: errorData.error || "Failed to schedule posts",
        })
      }
    } catch (error) {
      console.error("Error scheduling blogs:", error)
      setStatusMessage({ type: "error", message: "Error scheduling blogs" })
    } finally {
      setSchedulingInProgress(false)
    }
  }

  // Format time for display (convert 24h to 12h format)
  const formatTime = (time24h: string): string => {
    const [hours, minutes] = time24h.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const hours12 = hours % 12 || 12 // Convert 0 to 12 for 12 AM
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  // Format datetime for display
  const formatDateTime = (dateTimeStr: string): string => {
    const date = new Date(dateTimeStr)
    return `${format(date, "MMMM d, yyyy")} at ${format(date, "h:mm a")}`
  }

  // Get unscheduled blogs
  const getUnscheduledBlogs = () => {
    return blogs.filter((blog) => !blog.scheduled_date)
  }

  // Get scheduled blogs
  const getScheduledBlogs = () => {
    return blogs
      .filter((blog) => blog.scheduled_date)
      .sort((a, b) => {
        if (!a.scheduled_date || !b.scheduled_date) return 0
        return new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
      })
  }

  // Get current system time
  const getCurrentSystemTime = () => {
    const now = new Date()
    return format(now, "HH:mm")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Blog Post Scheduler</h1>

      {statusMessage && (
        <div
          className={`mb-6 p-4 rounded-md ${
            statusMessage.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : statusMessage.type === "error"
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-blue-50 text-blue-800 border border-blue-200"
          }`}
        >
          <div className="flex items-center">
            {statusMessage.type === "error" && <AlertCircleIcon className="h-5 w-5 mr-2" />}
            {statusMessage.type === "success" && <CheckIcon className="h-5 w-5 mr-2" />}
            {statusMessage.type === "info" && <CalendarIcon className="h-5 w-5 mr-2" />}
            <p>{statusMessage.message}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Schedule All Unscheduled Posts</h2>

          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={format(startDate, "yyyy-MM-dd")}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  className="w-full p-2 border rounded-md"
                  min={format(new Date(), "yyyy-MM-dd")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publish Time</label>
                <div className="flex items-center">
                  <input
                    type="time"
                    value={publishTime}
                    onChange={(e) => setPublishTime(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setPublishTime(getCurrentSystemTime())}
                    className="ml-2 p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-md"
                    title="Use current time"
                  >
                    <ClockIcon className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Posts will be published at exactly {formatTime(publishTime)}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Posts will be scheduled one per day starting from this date and time
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-md font-medium mb-2">Unscheduled Posts ({getUnscheduledBlogs().length})</h3>
            {getUnscheduledBlogs().length === 0 ? (
              <p className="text-gray-500">No unscheduled posts available.</p>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
                {getUnscheduledBlogs().map((blog) => (
                  <li key={blog.id} className="p-2 border-b last:border-b-0">
                    <p className="font-medium">{blog.title}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={scheduleAllBlogs}
            disabled={getUnscheduledBlogs().length === 0 || schedulingInProgress}
            className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
              getUnscheduledBlogs().length === 0 || schedulingInProgress
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {schedulingInProgress ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Scheduling...
              </>
            ) : (
              <>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Schedule All Posts at {formatTime(publishTime)}
              </>
            )}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Scheduled Posts</h2>

          {getScheduledBlogs().length === 0 ? (
            <p className="text-gray-500">No posts have been scheduled yet.</p>
          ) : (
            <ul className="space-y-3 max-h-[500px] overflow-y-auto">
              {getScheduledBlogs().map((blog) => (
                <li key={blog.id} className="p-3 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{blog.title}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        <span>{blog.scheduled_date ? formatDateTime(blog.scheduled_date) : "Not scheduled"}</span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${blog.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {blog.published ? "Published" : "Scheduled"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

