"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Switch } from "@/app/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Calendar, Clock, Trash2, Loader2 } from "lucide-react"

// Create Supabase client
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  return createClient(supabaseUrl, supabaseKey)
}

export default function SimpleScheduler() {
  const [schedules, setSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("daily")
  const [dayOfWeek, setDayOfWeek] = useState<number>(1) // Monday
  const [dayOfMonth, setDayOfMonth] = useState<number>(1)
  const [timeOfDay, setTimeOfDay] = useState("09:00")
  const [isCreating, setIsCreating] = useState(false)

  // Fetch user's schedules on component mount
  useEffect(() => {
    fetchSchedules()
    fetchUserWebsite()
  }, [])

  // Fetch user's website URL
  const fetchUserWebsite = async () => {
    try {
      const supabase = createSupabaseClient()
      const { data: userData } = await supabase.auth.getUser()

      if (userData?.user) {
        // Try to get the website from the database
        const { data } = await supabase
          .from("user_websites")
          .select("website_url")
          .eq("user_id", userData.user.id)
          .single()

        if (data?.website_url) {
          setWebsiteUrl(data.website_url)
        } else {
          // Fallback to a default URL
          setWebsiteUrl("https://example.com")
        }
      }
    } catch (error) {
      console.error("Error fetching user website:", error)
    }
  }

  // Fetch user's scheduled blog generations
  const fetchSchedules = async () => {
    try {
      setLoading(true)
      const supabase = createSupabaseClient()
      const { data: userData } = await supabase.auth.getUser()

      if (userData?.user) {
        const { data, error } = await supabase
          .from("blog_schedules")
          .select("*")
          .eq("user_id", userData.user.id)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching schedules:", error)
          alert("Failed to fetch your scheduled blog generations.")
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

  // Create a new scheduled blog generation
  const createSchedule = async () => {
    try {
      setIsCreating(true)
      const supabase = createSupabaseClient()
      const { data: userData } = await supabase.auth.getUser()

      if (!userData?.user) {
        alert("Please log in to schedule blog generations.")
        return
      }

      // Calculate the next run time
      const nextRun = calculateNextRunTime(frequency, dayOfWeek, dayOfMonth, timeOfDay)

      // Create the schedule
      const { error } = await supabase.from("blog_schedules").insert({
        user_id: userData.user.id,
        website_url: websiteUrl,
        frequency,
        day_of_week: frequency === "weekly" ? dayOfWeek : null,
        day_of_month: frequency === "monthly" ? dayOfMonth : null,
        time_of_day: timeOfDay,
        is_active: true,
        created_at: new Date().toISOString(),
        next_run: nextRun.toISOString(),
      })

      if (error) {
        console.error("Error creating schedule:", error)
        alert("Failed to create scheduled blog generation.")
        return
      }

      alert("Your scheduled blog generation has been created successfully.")
      fetchSchedules()
    } catch (error) {
      console.error("Error in createSchedule:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  // Toggle a schedule's active status
  const toggleScheduleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const supabase = createSupabaseClient()
      const { error } = await supabase.from("blog_schedules").update({ is_active: !currentStatus }).eq("id", id)

      if (error) {
        console.error("Error toggling schedule status:", error)
        alert("Failed to update schedule status.")
        return
      }

      // Update local state
      setSchedules(
        schedules.map((schedule) => (schedule.id === id ? { ...schedule, is_active: !currentStatus } : schedule)),
      )

      alert(`Schedule ${!currentStatus ? "activated" : "paused"} successfully.`)
    } catch (error) {
      console.error("Error in toggleScheduleStatus:", error)
    }
  }

  // Delete a schedule
  const deleteSchedule = async (id: string) => {
    try {
      const supabase = createSupabaseClient()
      const { error } = await supabase.from("blog_schedules").delete().eq("id", id)

      if (error) {
        console.error("Error deleting schedule:", error)
        alert("Failed to delete schedule.")
        return
      }

      // Update local state
      setSchedules(schedules.filter((schedule) => schedule.id !== id))
      alert("Your scheduled blog generation has been deleted.")
    } catch (error) {
      console.error("Error in deleteSchedule:", error)
    }
  }

  // Calculate the next run time based on frequency and time settings
  const calculateNextRunTime = (
    frequency: "daily" | "weekly" | "monthly",
    dayOfWeek: number,
    dayOfMonth: number,
    timeOfDay: string,
  ): Date => {
    const now = new Date()
    const [hours, minutes] = timeOfDay.split(":").map(Number)

    const nextRun = new Date(now)
    nextRun.setHours(hours, minutes, 0, 0)

    // If the time is in the past today, move to tomorrow
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1)
    }

    if (frequency === "weekly") {
      // Set to the next occurrence of the specified day of week (0 = Sunday, 6 = Saturday)
      const currentDay = nextRun.getDay()
      const daysUntilTarget = (dayOfWeek - currentDay + 7) % 7

      if (daysUntilTarget > 0 || (daysUntilTarget === 0 && nextRun <= now)) {
        nextRun.setDate(nextRun.getDate() + daysUntilTarget)
      }
    } else if (frequency === "monthly") {
      // Set to the specified day of the month
      nextRun.setDate(dayOfMonth)

      // If that day has already passed this month, move to next month
      if (nextRun <= now) {
        nextRun.setMonth(nextRun.getMonth() + 1)
      }
    }

    return nextRun
  }

  // Format date for display
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

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Blog Scheduler</h1>

      {/* Create Schedule Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website-url">Website URL</Label>
              <Input
                id="website-url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={frequency} onValueChange={(value: "daily" | "weekly" | "monthly") => setFrequency(value)}>
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {frequency === "weekly" && (
              <div className="space-y-2">
                <Label htmlFor="day-of-week">Day of Week</Label>
                <Select value={dayOfWeek.toString()} onValueChange={(value) => setDayOfWeek(Number.parseInt(value))}>
                  <SelectTrigger id="day-of-week">
                    <SelectValue placeholder="Select day of week" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sunday</SelectItem>
                    <SelectItem value="1">Monday</SelectItem>
                    <SelectItem value="2">Tuesday</SelectItem>
                    <SelectItem value="3">Wednesday</SelectItem>
                    <SelectItem value="4">Thursday</SelectItem>
                    <SelectItem value="5">Friday</SelectItem>
                    <SelectItem value="6">Saturday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {frequency === "monthly" && (
              <div className="space-y-2">
                <Label htmlFor="day-of-month">Day of Month</Label>
                <Select value={dayOfMonth.toString()} onValueChange={(value) => setDayOfMonth(Number.parseInt(value))}>
                  <SelectTrigger id="day-of-month">
                    <SelectValue placeholder="Select day of month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="time-of-day">Time of Day</Label>
              <Input id="time-of-day" type="time" value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-gray-500 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Next run: {formatDate(calculateNextRunTime(frequency, dayOfWeek, dayOfMonth, timeOfDay).toISOString())}
            </div>
            <Button onClick={createSchedule} disabled={isCreating} className="bg-blue-600 hover:bg-blue-700">
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Schedule"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Schedules */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Your Scheduled Generations</h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading your schedules...</span>
          </div>
        ) : schedules.length > 0 ? (
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <Card key={schedule.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">{schedule.website_url}</h3>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {schedule.frequency === "daily" && "Daily"}
                            {schedule.frequency === "weekly" &&
                              `Weekly on ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][schedule.day_of_week || 0]}`}
                            {schedule.frequency === "monthly" && `Monthly on day ${schedule.day_of_month}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {new Date(`2000-01-01T${schedule.time_of_day}`).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        {schedule.last_run && <div>Last run: {formatDate(schedule.last_run)}</div>}
                        {schedule.next_run && schedule.is_active && (
                          <div>Next run: {formatDate(schedule.next_run)}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={schedule.is_active}
                          onCheckedChange={() => toggleScheduleStatus(schedule.id, schedule.is_active)}
                        />
                        <span className="text-sm">{schedule.is_active ? "Active" : "Paused"}</span>
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => deleteSchedule(schedule.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Schedules Yet</h3>
              <p className="text-gray-600 mb-4">
                You haven't created any scheduled blog generations yet. Create your first schedule above.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
