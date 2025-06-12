"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utitls/supabase/client"
import { generateBlog } from "@/app/actions"
import { Badge } from "@/app/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"

// Enhanced interfaces
interface Schedule {
  id: string
  user_id: string
  website_url: string
  frequency: "daily" | "weekly" | "monthly"
  day_of_week?: number | null
  day_of_month?: number | null
  time_of_day: string
  is_active: boolean
  created_at: string
  last_run?: string | null
  next_run: string
  schedule_type?: "one-time" | "recurring"
}

interface ScheduleLog {
  id: string
  schedule_id: string
  status: "success" | "failed"
  message?: string
  blog_id?: string
  created_at: string
}

interface GenerateBlogResult {
  blogPosts?: any[]
  message?: string
  jobId?: string
  error?: string
}

export default function ScheduleManager() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [scheduleLogs, setScheduleLogs] = useState<ScheduleLog[]>([])
  const [loading, setLoading] = useState(true)
  const [logsLoading, setLogsLoading] = useState(false)
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("daily")
  const [dayOfWeek, setDayOfWeek] = useState<number>(1)
  const [dayOfMonth, setDayOfMonth] = useState<number>(1)
  const [timeOfDay, setTimeOfDay] = useState("09:00")
  const [isCreating, setIsCreating] = useState(false)
  const [userCredits, setUserCredits] = useState(0)
  const [isLoadingCredits, setIsLoadingCredits] = useState(true)
  const [runningSchedules, setRunningSchedules] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState("schedules")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  })
  const [useRecurringSchedule, setUseRecurringSchedule] = useState(false)

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Toast function
  const toast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 5000)
  }

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === "schedules") {
        fetchSchedules()
        fetchUserCredits()
      } else if (activeTab === "history") {
        fetchScheduleLogs()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [activeTab])

  useEffect(() => {
    fetchSchedules()
    fetchUserWebsite()
    fetchUserCredits()
  }, [])

  const fetchUserWebsite = async () => {
    try {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()

      if (userData?.user) {
        const { data, error } = await supabase
          .from("user_websites")
          .select("website_url")
          .eq("user_id", userData.user.id)
          .single()

        if (data && data.website_url) {
          setWebsiteUrl(data.website_url)
        } else if (error) {
          const savedUrl = localStorage.getItem("websiteUrl")
          if (savedUrl) {
            setWebsiteUrl(savedUrl)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user website:", error)
    }
  }

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()

      if (userData?.user) {
        const { data, error } = await supabase
          .from("blog_schedules")
          .select("*")
          .eq("user_id", userData.user.id)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching schedules:", error)
          toast("Failed to fetch your scheduled blog generations.", "error")
          return
        }

        setSchedules(data || [])
      }
    } catch (error) {
      console.error("Error in fetchSchedules:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchScheduleLogs = async () => {
    try {
      setLogsLoading(true)
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()

      if (userData?.user) {
        const { data, error } = await supabase
          .from("schedule_logs")
          .select("*")
          .eq("user_id", userData.user.id)
          .order("created_at", { ascending: false })
          .limit(50)

        if (error && error.code !== "42P01") {
          console.error("Error fetching schedule logs:", error)
        } else {
          setScheduleLogs(data || [])
        }
      }
    } catch (error) {
      console.error("Error in fetchScheduleLogs:", error)
    } finally {
      setLogsLoading(false)
    }
  }

  const fetchUserCredits = async () => {
    try {
      setIsLoadingCredits(true)
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()

      if (userData?.user) {
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", userData.user.id)
          .single()

        if (subscriptionError && subscriptionError.code !== "PGRST116") {
          console.error("Error fetching subscription:", subscriptionError)
          return
        }

        if (subscriptionData) {
          let credits = 0
          if (typeof subscriptionData.credits_available !== "undefined") {
            credits = Number(subscriptionData.credits_available)
          } else if (typeof subscriptionData.credits !== "undefined") {
            credits = Number(subscriptionData.credits)
          } else if (typeof subscriptionData.available_credits !== "undefined") {
            credits = Number(subscriptionData.available_credits)
          }

          credits = isNaN(credits) ? 0 : credits
          setUserCredits(credits)
        } else {
          setUserCredits(0)
        }
      }
    } catch (error) {
      console.error("Error fetching user credits:", error)
    } finally {
      setIsLoadingCredits(false)
    }
  }
  const createSchedule = async () => {
    try {
      if (!websiteUrl) {
        toast("Please enter a website URL for blog generation.", "error")
        return
      }

      setIsCreating(true)
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()

      if (!userData?.user) {
        toast("Please log in to schedule blog generations.", "error")
        return
      }

      // Calculate next run time
      const nextRun = calculateNextRunTime(frequency, dayOfWeek, dayOfMonth, timeOfDay, selectedDate, currentTime)

      console.log("🚀 Creating new schedule...")
      console.log("📅 Next run:", nextRun.toISOString())

      // Create schedule in database
      const { data: newSchedule, error } = await supabase
        .from("blog_schedules")
        .insert({
          user_id: userData.user.id,
          website_url: websiteUrl,
          frequency,
          day_of_week: frequency === "weekly" ? dayOfWeek : null,
          day_of_month: frequency === "monthly" ? dayOfMonth : null,
          time_of_day: timeOfDay,
          is_active: true,
          created_at: currentTime.toISOString(),
          next_run: nextRun.toISOString(),
          schedule_type: useRecurringSchedule ? "recurring" : "one-time",
        })
        .select()
        .single()

      if (error) {
        console.error("❌ Error creating schedule:", error)
        toast("Failed to create scheduled blog generation.", "error")
        return
      }

      console.log("✅ Schedule created in database:", newSchedule.id)

      // Update the database record to confirm creation
      try {
        const response = await fetch("/api/schedules/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scheduleId: newSchedule.id,
            nextRun: nextRun.toISOString(),
            websiteUrl,
            frequency,
            timeOfDay,
            dayOfWeek,
            dayOfMonth,
            useRecurring: useRecurringSchedule,
          }),
        })

        if (response.ok) {
          const { success, message } = await response.json()
          if (success) {
            console.log("🚀 Schedule created successfully")
          }
          toast(
            message || `Schedule created successfully! 🚀 The Render cron job will execute it automatically.`,
          )
        } else {
          const errorData = await response.json()
          console.error("❌ Schedule setup failed:", errorData)
          toast("Schedule created but setup failed. It may not execute automatically.", "error")
        }
      } catch (scheduleError) {
        console.error("❌ Error setting up schedule:", scheduleError)
        toast("Schedule created but setup failed. It may not execute automatically.", "error")
      }

      fetchSchedules()
    } catch (error) {
      console.error("❌ Error in createSchedule:", error)
      toast("An unexpected error occurred. Please try again.", "error")
    } finally {
      setIsCreating(false)
    }
  }
  const toggleScheduleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const supabase = createClient()
      const schedule = schedules.find((s) => s.id === id)

      if (!schedule) return

      console.log(`🔄 Toggling schedule ${id}: ${currentStatus ? "deactivating" : "activating"}`)

      // Update the database to toggle active status
      const { error } = await supabase
        .from("blog_schedules")
        .update({
          is_active: !currentStatus,
        })
        .eq("id", id)

      if (error) {
        console.error("❌ Error toggling schedule status:", error)
        toast("Failed to update schedule status.", "error")
        return
      }

      setSchedules(
        schedules.map((schedule) =>
          schedule.id === id ? { ...schedule, is_active: !currentStatus } : schedule,
        ),
      )

      toast(`Schedule ${!currentStatus ? "activated" : "paused"} successfully.`)
    } catch (error) {
      console.error("❌ Error in toggleScheduleStatus:", error)
    }
  }
  const deleteSchedule = async (id: string) => {
    try {
      const supabase = createClient()

      console.log(`🗑️ Deleting schedule ${id}`)

      // Cancel the schedule via our API
      try {
        await fetch("/api/schedules/cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scheduleId: id }),
        })
        console.log("🗑️ Schedule cancelled via API")
      } catch (error) {
        console.error("❌ Error cancelling schedule via API:", error)
      }

      const { error } = await supabase.from("blog_schedules").delete().eq("id", id)

      if (error) {
        console.error("❌ Error deleting schedule:", error)
        toast("Failed to delete schedule.", "error")
        return
      }

      setSchedules(schedules.filter((schedule) => schedule.id !== id))
      toast("Schedule deleted successfully.")
    } catch (error) {
      console.error("❌ Error in deleteSchedule:", error)
    }
  }
  const runScheduleManually = async (schedule: Schedule) => {
    try {
      if (userCredits < 1) {
        toast("You don't have enough credits to generate a blog.", "error")
        return
      }

      console.log(`🚀 Running schedule ${schedule.id} manually`)
      setRunningSchedules((prev) => new Set(prev).add(schedule.id))

      const result: GenerateBlogResult = await generateBlog(schedule.website_url)

      if (result.error) {
        toast(`Failed to generate blog: ${result.error}`, "error")
        return
      }

      const now = currentTime
      const lastRun = now.toISOString()
      const nextRun = calculateNextRunTime(
        schedule.frequency,
        schedule.day_of_week || 1,
        schedule.day_of_month || 1,
        schedule.time_of_day,
        currentTime.toISOString().split("T")[0],
        now,
      )

      const supabase = createClient()
      await supabase
        .from("blog_schedules")
        .update({
          last_run: lastRun,
          next_run: nextRun.toISOString(),
        })
        .eq("id", schedule.id)

      fetchSchedules()
      fetchUserCredits()

      toast("Blog generation started! 🚀 Check your content library for the result.")
    } catch (error) {
      console.error("❌ Error running schedule manually:", error)
      toast("Failed to generate blog. Please try again.", "error")
    } finally {
      setRunningSchedules((prev) => {
        const newSet = new Set(prev)
        newSet.delete(schedule.id)
        return newSet
      })
    }
  }

  // Updated function to use current time properly
  const calculateNextRunTime = (
    frequency: "daily" | "weekly" | "monthly",
    dayOfWeek: number,
    dayOfMonth: number,
    timeOfDay: string,
    startDate: string,
    fromTime?: Date,
  ): Date => {
    const now = fromTime || currentTime
    const [hours, minutes] = timeOfDay.split(":").map(Number)

    // Create the initial run time from the selected date and time
    const selectedDateTime = new Date(startDate + "T" + timeOfDay + ":00")

    // If the selected date/time is in the future, use it as the first run
    if (selectedDateTime > now) {
      return selectedDateTime
    }

    // Otherwise, calculate the next occurrence based on frequency from NOW
    const nextRun = new Date(now)
    nextRun.setHours(hours, minutes, 0, 0)

    if (frequency === "daily") {
      // If today's time has passed, schedule for tomorrow
      if (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 1)
      }
    } else if (frequency === "weekly") {
      // Find the next weekly occurrence
      const currentDay = now.getDay()
      let daysUntilTarget = (dayOfWeek - currentDay + 7) % 7

      // If it's the same day but time has passed, schedule for next week
      if (daysUntilTarget === 0 && nextRun <= now) {
        daysUntilTarget = 7
      }

      nextRun.setDate(now.getDate() + daysUntilTarget)
    } else if (frequency === "monthly") {
      // Set to the specified day of current month
      nextRun.setDate(dayOfMonth)

      // If this month's date has passed, move to next month
      if (nextRun <= now) {
        nextRun.setMonth(nextRun.getMonth() + 1)
        nextRun.setDate(dayOfMonth)
      }

      // Handle months with fewer days
      const targetMonth = nextRun.getMonth()
      const daysInTargetMonth = new Date(nextRun.getFullYear(), targetMonth + 1, 0).getDate()
      if (dayOfMonth > daysInTargetMonth) {
        nextRun.setDate(daysInTargetMonth)
      }
    }

    return nextRun
  }

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "Not scheduled"

    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getTimeUntilNext = (nextRun: string): string => {
    const now = currentTime
    const next = new Date(nextRun)
    const diff = next.getTime() - now.getTime()

    if (diff <= 0) return "Overdue"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }
  const getScheduleStats = () => {
    const total = schedules.length
    const active = schedules.filter((s) => s.is_active).length
    const successful = scheduleLogs.filter((log) => log.status === "success").length
    const failed = scheduleLogs.filter((log) => log.status === "failed").length

    return { total, active, successful, failed }
  }

  const stats = getScheduleStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg ${
              toastType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              {toastType === "success" ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="font-medium">{toastMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>                <h1 className="text-2xl font-bold text-gray-900">Blog Scheduler</h1>
                <p className="text-sm text-gray-600">
                  Powered by Render Cron • Current time: {currentTime.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a4 4 0 118 0v1a2 2 0 01-2 2H10a2 2 0 01-2-2zM12 14a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  {isLoadingCredits ? (
                    <span className="text-sm font-medium text-blue-600">Loading...</span>
                  ) : (
                    <span className="text-sm font-medium text-blue-600">
                      {userCredits} Credit{userCredits !== 1 ? "s" : ""} Available
                    </span>
                  )}
                </div>
              </div>              {/* System Status */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 rounded-lg border text-sm font-medium border-green-200 text-green-700">
                Render Cron: 🚀 Active
              </div>

              <button
                onClick={() => {
                  fetchSchedules()
                  fetchUserCredits()
                  if (activeTab === "history") fetchScheduleLogs()
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">        {/* System Status Alert */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-green-800">🚀 Render Cron Job Active</h3>
              <p className="text-sm text-green-700 mt-1">
                Your blog schedules are powered by Render's cron job system for reliable execution. 
                Schedules are checked every 15 minutes and executed automatically when due.
              </p>
            </div>
          </div>
        </div>        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Schedules</p>
                <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active</p>
                <p className="text-3xl font-bold text-green-700">{stats.active}</p>
              </div>
              <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Successful</p>
                <p className="text-3xl font-bold text-emerald-700">{stats.successful}</p>
              </div>
              <svg className="w-8 h-8 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Failed</p>
                <p className="text-3xl font-bold text-red-700">{stats.failed}</p>
              </div>
              <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedules" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Manage Schedules
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Execution History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedules" className="space-y-8 mt-6">
            {/* Create Schedule Form */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>                  Create New Schedule
                </h2>
                <p className="text-blue-100 text-sm mt-1">Set up automatic blog generation with reliable scheduling</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                        />
                      </svg>
                      <input
                        type="text"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="https://example.com"
                        disabled={true}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">URL configured during onboarding</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as "daily" | "weekly" | "monthly")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="daily">📅 Daily</option>
                      <option value="weekly">📆 Weekly</option>
                      <option value="monthly">🗓️ Monthly</option>
                    </select>
                  </div>

                  {frequency === "weekly" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Day of Week</label>
                      <select
                        value={dayOfWeek}
                        onChange={(e) => setDayOfWeek(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={0}>🌅 Sunday</option>
                        <option value={1}>💼 Monday</option>
                        <option value={2}>🔥 Tuesday</option>
                        <option value={3}>⚡ Wednesday</option>
                        <option value={4}>🚀 Thursday</option>
                        <option value={5}>🎉 Friday</option>
                        <option value={6}>🌟 Saturday</option>
                      </select>
                    </div>
                  )}

                  {frequency === "monthly" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Day of Month</label>
                      <select
                        value={dayOfMonth}
                        onChange={(e) => setDayOfMonth(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {Array.from({ length: 31 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time of Day</label>
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <input
                        type="time"
                        value={timeOfDay}
                        onChange={(e) => setTimeOfDay(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={currentTime.toISOString().split("T")[0]}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Choose when to start the schedule</p>
                  </div>
                </div>                {/* Schedule Type Toggle */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-blue-800">🚀 Schedule Type</h3>
                      <p className="text-xs text-blue-600 mt-1">
                        {useRecurringSchedule
                          ? "Recurring schedules repeat automatically based on your frequency settings"
                          : "One-time schedules run once at the specified time"}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useRecurringSchedule}
                        onChange={(e) => setUseRecurringSchedule(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-blue-700">
                        {useRecurringSchedule ? "🔄 Recurring" : "⚡ One-time"}
                      </span>
                    </label>
                  </div>
                </div>

                {userCredits === 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-amber-700 text-sm">
                        You need at least 1 credit to schedule blog generation. Please purchase credits to continue.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="bg-gray-50 px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-medium">Next run:</span>
                      <span className="text-blue-600 font-semibold">
                        {formatDate(
                          calculateNextRunTime(
                            frequency,
                            dayOfWeek,
                            dayOfMonth,
                            timeOfDay,
                            selectedDate,
                            currentTime,
                          ).toISOString(),
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={createSchedule}
                    disabled={isCreating || userCredits === 0}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Creating Schedule...
                      </>
                    ) : (                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Create Schedule
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Schedules List */}
            <div className="space-y-4">              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Your Schedules</h2>
                <div className="flex items-center gap-2"><Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {schedules.filter((s) => s.is_active).length} Active
                  </Badge>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="ml-2 text-gray-600">Loading your schedules...</span>
                </div>
              ) : schedules.length > 0 ? (
                <div className="space-y-4">
                  {schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className={`bg-white rounded-xl shadow-sm border-l-4 transition-all duration-200 hover:shadow-md ${
                        schedule.is_active
                          ? "border-l-green-500 bg-gradient-to-r from-green-50 to-white"
                          : "border-l-gray-300 bg-gradient-to-r from-gray-50 to-white"
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <svg
                                  className="w-4 h-4 text-gray-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                                  />
                                </svg>
                                {schedule.website_url}
                              </h3>                              <Badge
                                variant={schedule.is_active ? "default" : "secondary"}
                                className={
                                  schedule.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                }
                              >
                                {schedule.is_active ? "Active" : "Paused"}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                                <svg
                                  className="w-4 h-4 text-blue-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                <span className="font-medium text-blue-700">
                                  {schedule.frequency === "daily" && "Daily"}
                                  {schedule.frequency === "weekly" &&
                                    `Weekly on ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][schedule.day_of_week || 0]}`}
                                  {schedule.frequency === "monthly" && `Monthly on day ${schedule.day_of_month}`}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full">
                                <svg
                                  className="w-4 h-4 text-purple-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="font-medium text-purple-700">
                                  {new Date(`2000-01-01T${schedule.time_of_day}`).toLocaleTimeString([], {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </span>
                              </div>

                              {schedule.is_active && (
                                <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full">
                                  <svg
                                    className="w-4 h-4 text-orange-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                    />
                                  </svg>
                                  <span className="font-medium text-orange-700">
                                    Next in {getTimeUntilNext(schedule.next_run)}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                              {schedule.last_run && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Last run: {formatDate(schedule.last_run)}
                                </div>
                              )}
                              {schedule.next_run && schedule.is_active && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  Next run: {formatDate(schedule.next_run)}
                                </div>
                              )}                            </div>
                          </div>

                          <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                            <button
                              onClick={() => runScheduleManually(schedule)}
                              disabled={userCredits < 1 || runningSchedules.has(schedule.id)}
                              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {runningSchedules.has(schedule.id) ? (
                                <>
                                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    />
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                  </svg>
                                  Running...
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Run Now
                                </>
                              )}
                            </button>

                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={schedule.is_active}
                                    onChange={() => toggleScheduleStatus(schedule.id, schedule.is_active)}
                                    disabled={!schedule.is_active && userCredits === 0}
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                                <span className="text-sm font-medium">
                                  {schedule.is_active ? (
                                    <span className="text-green-600">Active</span>
                                  ) : (
                                    <span className="text-gray-500">Paused</span>
                                  )}
                                </span>
                              </div>

                              <button
                                onClick={() => deleteSchedule(schedule.id)}
                                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>                  <h3 className="text-xl font-medium text-gray-800 mb-2">No Schedules Yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    You haven't created any scheduled blog generations yet. Create your first schedule
                    above to automate your content creation with reliable Render cron jobs.
                  </p>
                  <button
                    onClick={() => (document.querySelector('input[type="text"]') as HTMLInputElement)?.focus()}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Create Your First Schedule
                  </button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Execution History</h2>
              <button
                onClick={fetchScheduleLogs}
                disabled={logsLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {logsLoading ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                )}
                Refresh History
              </button>
            </div>

            {logsLoading ? (
              <div className="flex justify-center items-center h-40">
                <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="ml-2 text-gray-600">Loading execution history...</span>
              </div>
            ) : scheduleLogs.length > 0 ? (
              <div className="space-y-3">
                {scheduleLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {log.status === "success" ? (
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                        <div>                          <p className="font-medium text-gray-800">
                            Schedule execution {log.status === "success" ? "completed successfully" : "failed"}
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(log.created_at)}</p>
                        </div>
                      </div>
                      <Badge
                        variant={log.status === "success" ? "default" : "destructive"}
                        className={log.status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                      >
                        {log.status === "success" ? "✅ Success" : "❌ Failed"}
                      </Badge>
                    </div>
                    {log.message && (
                      <p className="text-sm text-gray-600 mt-2 ml-11 bg-gray-50 p-2 rounded">{log.message}</p>
                    )}
                    {log.blog_id && (
                      <p className="text-xs text-blue-600 mt-1 ml-11 font-mono">Blog ID: {log.blog_id}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">No Execution History Yet</h3>                <p className="text-gray-600">
                  Execution history will appear here once your scheduled blogs start running. Create a schedule
                  to get started!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
