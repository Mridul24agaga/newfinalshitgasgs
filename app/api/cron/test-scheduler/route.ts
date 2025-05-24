import { createClient } from "@/utitls/supabase/server"
import { NextResponse } from "next/server"

// Test endpoint to manually trigger the scheduler for debugging
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const now = new Date()

    console.log(`Testing scheduler at ${now.toISOString()}`)

    // Get all active schedules
    const { data: schedules, error } = await supabase.from("blog_schedules").select("*").eq("is_active", true)

    if (error) {
      console.error("Error fetching schedules:", error)
      return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 })
    }

    // Check which schedules are due
    const dueSchedules =
      schedules?.filter((schedule) => {
        const nextRun = new Date(schedule.next_run)
        const bufferTime = new Date(now.getTime() + 5 * 60 * 1000) // 5 minutes buffer
        return nextRun <= bufferTime
      }) || []

    return NextResponse.json({
      message: "Scheduler test completed",
      current_time: now.toISOString(),
      total_schedules: schedules?.length || 0,
      active_schedules: schedules?.filter((s) => s.is_active).length || 0,
      due_schedules: dueSchedules.length,
      schedules: schedules?.map((s) => ({
        id: s.id,
        website_url: s.website_url,
        frequency: s.frequency,
        next_run: s.next_run,
        is_due: new Date(s.next_run) <= new Date(now.getTime() + 5 * 60 * 1000),
        is_active: s.is_active,
      })),
    })
  } catch (error) {
    console.error("Error in test scheduler:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
