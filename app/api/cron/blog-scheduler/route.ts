import { createClient } from "@/utitls/supabase/server"
import { NextResponse } from "next/server"
import { generateBlog } from "@/app/actions"

// Interface for the schedule object from the blog_schedules table
interface BlogSchedule {
  id: string
  user_id: string
  website_url: string
  is_active: boolean
  next_run: string
  frequency: "daily" | "weekly" | "monthly"
  day_of_week: number | null
  day_of_month: number | null
  time_of_day: string
  last_run?: string
}

// This endpoint will be called by Vercel Cron
export async function GET(request: Request) {
  try {
    // Create Supabase client
    const supabase = await createClient()

    // Get current time - using actual current time
    const now = new Date()
    const bufferTime = new Date(now.getTime() + 5 * 60 * 1000) // 5 minutes buffer

    console.log(`Running blog scheduler cron job at ${now.toISOString()}`)
    console.log(`Current time: ${now.toLocaleString()}`)
    console.log(`Buffer time: ${bufferTime.toLocaleString()}`)

    // Find all schedules that are due to run (including those slightly overdue)
    const { data: schedules, error } = await supabase
      .from("blog_schedules")
      .select("*")
      .eq("is_active", true)
      .lte("next_run", bufferTime.toISOString())

    if (error) {
      console.error("Error fetching schedules:", error)
      return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 })
    }

    if (!schedules || schedules.length === 0) {
      console.log("No schedules to process")
      return NextResponse.json({
        message: "No schedules to process",
        current_time: now.toISOString(),
        checked_schedules: 0,
      })
    }

    console.log(`Found ${schedules.length} schedules to process`)

    // Process each schedule
    const results = await Promise.allSettled(
      schedules.map(async (schedule: BlogSchedule) => {
        try {
          console.log(`Processing schedule ${schedule.id} for website ${schedule.website_url}`)
          console.log(`Schedule next_run: ${schedule.next_run}`)

          // Check if user has enough credits before generating
          const { data: userData, error: userError } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", schedule.user_id)
            .single()

          if (userError && userError.code !== "PGRST116") {
            console.error(`Error fetching user data for ${schedule.user_id}:`, userError)
            throw new Error("Failed to fetch user subscription data")
          }

          // Get available credits (handle different field names)
          let availableCredits = 0
          if (userData) {
            if (typeof userData.credits_available !== "undefined") {
              availableCredits = Number(userData.credits_available)
            } else if (typeof userData.credits !== "undefined") {
              availableCredits = Number(userData.credits)
            } else if (typeof userData.available_credits !== "undefined") {
              availableCredits = Number(userData.available_credits)
            }
          }

          // Ensure it's a valid number
          availableCredits = isNaN(availableCredits) ? 0 : availableCredits

          // Check if user has enough credits
          if (availableCredits < 1) {
            console.log(`User ${schedule.user_id} has insufficient credits for schedule ${schedule.id}`)

            // Pause the schedule if no credits
            await supabase.from("blog_schedules").update({ is_active: false }).eq("id", schedule.id)

            throw new Error("Insufficient credits - schedule paused")
          }

          // Generate the blog
          const result = await generateBlog(schedule.website_url)

          // Check if there was an error in the result
          if (result && typeof result === "object" && "error" in result && result.error) {
            console.error(`Error generating blog for schedule ${schedule.id}:`, result.error)
            throw new Error(result.error as string)
          }

          // Deduct credit
          const newCredits = availableCredits - 1

          // Update user credits (try multiple field names)
          if (userData) {
            const updateData: any = {}
            if (typeof userData.credits_available !== "undefined") {
              updateData.credits_available = newCredits
            } else if (typeof userData.credits !== "undefined") {
              updateData.credits = newCredits
            } else if (typeof userData.available_credits !== "undefined") {
              updateData.available_credits = newCredits
            }

            if (Object.keys(updateData).length > 0) {
              await supabase.from("subscriptions").update(updateData).eq("user_id", schedule.user_id)
            }
          }

          // Calculate the next run time from current time
          const nextRun = calculateNextRunTime(
            schedule.frequency,
            schedule.day_of_week,
            schedule.day_of_month,
            schedule.time_of_day,
            now, // Pass current time explicitly
          )

          console.log(`Next run calculated: ${nextRun.toISOString()}`)

          // Update the schedule with last run time and next run
          await supabase
            .from("blog_schedules")
            .update({
              last_run: now.toISOString(),
              next_run: nextRun.toISOString(),
            })
            .eq("id", schedule.id)

          // Get job ID from result
          const jobId = (result as any)?.jobId || (result as any)?.blogPosts?.[0]?.id || "unknown"

          // Log successful execution
          await logScheduleExecution(supabase, {
            schedule_id: schedule.id,
            user_id: schedule.user_id,
            status: "success",
            blog_id: jobId,
          })

          console.log(`Successfully processed schedule ${schedule.id}, next run at ${nextRun.toISOString()}`)

          return {
            schedule_id: schedule.id,
            status: "success",
            job_id: jobId,
            next_run: nextRun.toISOString(),
            current_time: now.toISOString(),
          }
        } catch (error) {
          console.error(`Error processing schedule ${schedule.id}:`, error)

          // Log the error
          await logScheduleExecution(supabase, {
            schedule_id: schedule.id,
            user_id: schedule.user_id,
            status: "failed",
            message: String(error),
          })

          return {
            schedule_id: schedule.id,
            status: "failed",
            error: String(error),
            current_time: now.toISOString(),
          }
        }
      }),
    )

    // Process results
    const processedResults = results.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value
      } else {
        return {
          schedule_id: schedules[index].id,
          status: "failed",
          error: result.reason?.message || "Unknown error",
          current_time: now.toISOString(),
        }
      }
    })

    const successCount = processedResults.filter((r) => r.status === "success").length
    const failureCount = processedResults.filter((r) => r.status === "failed").length

    console.log(`Processed ${schedules.length} schedules: ${successCount} successful, ${failureCount} failed`)

    return NextResponse.json({
      message: `Processed ${schedules.length} schedules`,
      success_count: successCount,
      failure_count: failureCount,
      current_time: now.toISOString(),
      results: processedResults,
    })
  } catch (error) {
    console.error("Error in blog scheduler cron job:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        current_time: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// Helper function to log schedule executions
async function logScheduleExecution(
  supabase: any,
  data: {
    schedule_id: string
    user_id: string
    status: "success" | "failed"
    message?: string
    blog_id?: string
  },
) {
  try {
    // Check if the schedule_logs table exists
    const { error: tableCheckError } = await supabase.from("schedule_logs").select("id").limit(1)

    // If table doesn't exist, create a simple log entry in console
    if (tableCheckError) {
      console.log(`Schedule execution log: ${JSON.stringify(data)}`)
      return
    }

    await supabase.from("schedule_logs").insert({
      schedule_id: data.schedule_id,
      user_id: data.user_id,
      status: data.status,
      message: data.message,
      blog_id: data.blog_id,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error logging schedule execution:", error)
    // Don't throw here, just log the error
  }
}

// Updated function to calculate the next run time from current time
function calculateNextRunTime(
  frequency: "daily" | "weekly" | "monthly",
  dayOfWeek: number | null,
  dayOfMonth: number | null,
  timeOfDay: string,
  currentTime?: Date,
): Date {
  const now = currentTime || new Date()
  const [hours, minutes] = timeOfDay.split(":").map(Number)

  console.log(`Calculating next run from: ${now.toISOString()}`)
  console.log(`Target time: ${hours}:${minutes}`)

  let nextRun = new Date(now)
  nextRun.setHours(hours, minutes, 0, 0)

  if (frequency === "daily") {
    // For daily: if time has passed today, schedule for tomorrow
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1)
    }
    console.log(`Daily schedule - next run: ${nextRun.toISOString()}`)
  } else if (frequency === "weekly" && dayOfWeek !== null) {
    // For weekly: find the next occurrence of the specified day
    const currentDay = now.getDay()
    let daysUntilTarget = (dayOfWeek - currentDay + 7) % 7

    // If it's the same day but time has passed, schedule for next week
    if (daysUntilTarget === 0 && nextRun <= now) {
      daysUntilTarget = 7
    }

    nextRun = new Date(now)
    nextRun.setDate(now.getDate() + daysUntilTarget)
    nextRun.setHours(hours, minutes, 0, 0)

    console.log(
      `Weekly schedule - current day: ${currentDay}, target day: ${dayOfWeek}, days until: ${daysUntilTarget}`,
    )
    console.log(`Weekly schedule - next run: ${nextRun.toISOString()}`)
  } else if (frequency === "monthly" && dayOfMonth !== null) {
    // For monthly: set to the specified day of the current month
    nextRun = new Date(now.getFullYear(), now.getMonth(), dayOfMonth, hours, minutes, 0, 0)

    // If the date has passed this month, move to next month
    if (nextRun <= now) {
      nextRun = new Date(now.getFullYear(), now.getMonth() + 1, dayOfMonth, hours, minutes, 0, 0)
    }

    // Handle months with fewer days (e.g., February 30th -> February 28th/29th)
    const targetMonth = nextRun.getMonth()
    const daysInTargetMonth = new Date(nextRun.getFullYear(), targetMonth + 1, 0).getDate()
    if (dayOfMonth > daysInTargetMonth) {
      nextRun.setDate(daysInTargetMonth)
    }

    console.log(`Monthly schedule - target day: ${dayOfMonth}, next run: ${nextRun.toISOString()}`)
  }

  return nextRun
}
