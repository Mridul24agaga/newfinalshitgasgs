import { NextResponse } from "next/server";
import { createClient } from "@/utitls/supabase/server";

export async function POST(request: Request) {
  try {
    // Parse and log the request body
    let reqBody;
    try {
      reqBody = await request.json();
      console.log(`📦 Request body:`, JSON.stringify(reqBody, null, 2));
    } catch (parseError) {
      console.error("❌ Error parsing request body:", parseError);
      return NextResponse.json({ 
        success: false, 
        error: "Invalid request body",
        message: "Could not parse the request body as JSON."
      }, { status: 400 });
    }
    
    const { scheduleId, nextRun, websiteUrl, frequency, timeOfDay, dayOfWeek, dayOfMonth, useRecurring } = reqBody;

    // Validate required parameters
    if (!scheduleId || !websiteUrl) {
      console.error("❌ Missing required parameters:", { scheduleId, websiteUrl });
      return NextResponse.json({ 
        success: false, 
        error: "Missing required parameters",
        message: "scheduleId and websiteUrl are required."
      }, { status: 400 });
    }

    // Validate nextRun for one-time schedules
    if (!useRecurring && (!nextRun || isNaN(new Date(nextRun).getTime()))) {
      console.error("❌ Invalid nextRun date:", nextRun);
      return NextResponse.json({ 
        success: false, 
        error: "Invalid nextRun date",
        message: "A valid nextRun date is required for one-time schedules."
      }, { status: 400 });
    }
    
    console.log(`🚀 Creating schedule for ${scheduleId}`);
    console.log(`📅 Next run: ${nextRun}`);
    console.log(`🔄 Type: ${useRecurring ? "recurring" : "one-time"}`);
    
    const supabase = await createClient();
    
    // Calculate next run time if using recurring schedule
    let finalNextRun;
    if (useRecurring && frequency && timeOfDay) {
      const calculatedNextRun = calculateNextRunTime(
        frequency,
        dayOfWeek,
        dayOfMonth,
        timeOfDay
      );
      finalNextRun = calculatedNextRun.toISOString();
    } else {
      finalNextRun = new Date(nextRun).toISOString();
    }
      // Update the existing schedule or insert a new one
    const { data: updatedSchedule, error: updateError } = await supabase
      .from("blog_schedules")
      .upsert({
        id: scheduleId,
        website_url: websiteUrl,
        is_active: true,
        next_run: finalNextRun,
        frequency: useRecurring ? frequency : "one-time",
        time_of_day: timeOfDay || "12:00",
        day_of_week: dayOfWeek,
        day_of_month: dayOfMonth,
        schedule_type: useRecurring ? "recurring" : "one-time",
        qstash_message_id: null // Clear any QStash message ID
      })
      .select()
      .single();
      
    if (updateError) {
      console.error(`❌ Error updating schedule in database:`, updateError);
      return NextResponse.json({ 
        success: false,
        error: "Failed to update schedule",
        message: updateError.message,
        scheduleId,
        websiteUrl
      }, { status: 500 });
    }
    
    if (updatedSchedule) {
      console.log(`✅ Schedule created/updated successfully: ${scheduleId}`);
      return NextResponse.json({
        success: true,
        schedule: updatedSchedule,
        message: `Schedule created successfully! 🚀`,
      });
    } else {
      console.error(`❌ Failed to create/update schedule - no data returned`);
      return NextResponse.json({ 
        success: false,
        error: `Failed to create/update schedule`,
        message: "No data was returned from the database.",
        scheduleId,
        websiteUrl
      }, { status: 500 });
    }
  } catch (error) {
    console.error("❌ Error creating schedule:", error);
    console.error("❌ Stack trace:", (error as Error).stack);
    
    return NextResponse.json({ 
      success: false,
      error: "Failed to create schedule", 
      message: String(error),
      details: (error as Error).stack
    }, { status: 500 });
  }
}

// Function to calculate the next run time
function calculateNextRunTime(
  frequency: "daily" | "weekly" | "monthly",
  dayOfWeek: number | null,
  dayOfMonth: number | null,
  timeOfDay: string
): Date {
  const now = new Date();
  const [hours, minutes] = timeOfDay.split(":").map(Number);
  const nextRun = new Date(now);
  nextRun.setHours(hours, minutes, 0, 0);

  if (frequency === "daily") {
    // Add 1 day
    nextRun.setDate(nextRun.getDate() + 1);
  } else if (frequency === "weekly" && dayOfWeek !== null) {
    // Find next occurrence of the day
    const currentDay = now.getDay();
    let daysUntilTarget = (dayOfWeek - currentDay + 7) % 7;
    if (daysUntilTarget === 0) daysUntilTarget = 7; // Next week
    nextRun.setDate(now.getDate() + daysUntilTarget);
  } else if (frequency === "monthly" && dayOfMonth !== null) {
    // Next month, same day
    nextRun.setMonth(nextRun.getMonth() + 1);
    nextRun.setDate(dayOfMonth);

    // Handle months with fewer days
    const targetMonth = nextRun.getMonth();
    const daysInTargetMonth = new Date(nextRun.getFullYear(), targetMonth + 1, 0).getDate();
    if (dayOfMonth > daysInTargetMonth) {
      nextRun.setDate(daysInTargetMonth);
    }
  }

  // If the calculated time is in the past, add one more period
  if (nextRun <= now) {
    if (frequency === "daily") {
      nextRun.setDate(nextRun.getDate() + 1);
    } else if (frequency === "weekly") {
      nextRun.setDate(nextRun.getDate() + 7);
    } else if (frequency === "monthly") {
      nextRun.setMonth(nextRun.getMonth() + 1);
    }
  }

  return nextRun;
}
