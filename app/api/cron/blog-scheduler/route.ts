import { createClient } from "@/utitls/supabase/server";
import { NextResponse } from "next/server";
import { generateBlog } from "@/app/actions";

// Interface for the schedule object from the blog_schedules table
interface BlogSchedule {
  id: string;
  website_url: string;
  is_active: boolean;
  next_run: string;
  frequency: "daily" | "weekly" | "monthly";
  day_of_week: number | null;
  day_of_month: number | null;
  time_of_day: string;
  last_run?: string;
}

// Interface for the generateBlog return type
interface GenerateBlogResult {
  headline?: string;
  content?: string;
  initialContent?: string;
  researchSummary?: string;
  imageUrls?: string[];
  is_blurred?: boolean;
  jobId?: string;
  error?: string;
}

// This endpoint will be called by a cron job
export async function GET(request: Request) {
  try {
    // Create Supabase client (await the promise)
    const supabase = await createClient();

    // Get current time
    const now = new Date();

    // Find all schedules that are due to run
    const { data: schedules, error } = await supabase
      .from("blog_schedules")
      .select("*")
      .eq("is_active", true)
      .lte("next_run", now.toISOString());

    if (error) {
      console.error("Error fetching schedules:", error);
      return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 });
    }

    if (!schedules || schedules.length === 0) {
      return NextResponse.json({ message: "No schedules to process" });
    }

    // Process each schedule
    const results = await Promise.all(
      schedules.map(async (schedule: BlogSchedule) => {
        try {
          // Use the same blog generation function as the UI
          const result: GenerateBlogResult = await generateBlog(schedule.website_url);

          if (result.error) {
            throw new Error(result.error);
          }

          // Update the schedule with last run time and calculate next run
          const nextRun = calculateNextRunTime(
            schedule.frequency,
            schedule.day_of_week,
            schedule.day_of_month,
            schedule.time_of_day,
          );

          await (await supabase)
            .from("blog_schedules")
            .update({
              last_run: now.toISOString(),
              next_run: nextRun.toISOString(),
            })
            .eq("id", schedule.id);

          return {
            schedule_id: schedule.id,
            status: "success",
            job_id: result.jobId,
          };
        } catch (error) {
          console.error(`Error processing schedule ${schedule.id}:`, error);
          return {
            schedule_id: schedule.id,
            status: "failed",
            error: String(error),
          };
        }
      }),
    );

    return NextResponse.json({
      message: `Processed ${schedules.length} schedules`,
      results,
    });
  } catch (error) {
    console.error("Error in blog scheduler cron job:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Calculate the next run time based on frequency and time settings
function calculateNextRunTime(
  frequency: "daily" | "weekly" | "monthly",
  dayOfWeek: number | null,
  dayOfMonth: number | null,
  timeOfDay: string,
): Date {
  const now = new Date();
  const [hours, minutes] = timeOfDay.split(":").map(Number);

  const nextRun = new Date(now);
  nextRun.setHours(hours, minutes, 0, 0);

  // If the time is in the past today, move to tomorrow
  if (nextRun <= now) {
    nextRun.setDate(nextRun.getDate() + 1);
  }

  if (frequency === "daily") {
    // For daily, we're already good with tomorrow's date
  } else if (frequency === "weekly" && dayOfWeek !== null) {
    // For weekly, find the next occurrence of the day of week
    const currentDay = nextRun.getDay();
    const daysUntilTarget = (dayOfWeek - currentDay + 7) % 7;
    nextRun.setDate(nextRun.getDate() + daysUntilTarget);
  } else if (frequency === "monthly" && dayOfMonth !== null) {
    // For monthly, set to the specified day of the month
    nextRun.setDate(dayOfMonth);

    // If that day has already passed this month, move to next month
    if (nextRun <= now) {
      nextRun.setMonth(nextRun.getMonth() + 1);
    }
  }

  return nextRun;
}