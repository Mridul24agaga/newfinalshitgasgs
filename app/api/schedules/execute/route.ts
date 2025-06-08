import { NextResponse } from "next/server";
import { createClient } from "@/utitls/supabase/server";
import { generateBlog } from "@/app/actions";

// This endpoint will be called by Render cron job
export async function GET(request: Request) {
  try {
    console.log("🚀 Render cron job triggered for schedule execution");
    
    // Verify the request is from Render cron job using authorization header
    const authHeader = request.headers.get("Authorization");
    if (process.env.CRON_SECRET && (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`)) {
      console.error("🔒 Unauthorized access attempt to cron endpoint");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const supabase = await createClient();
    const now = new Date();
    
    // Find schedules that are due to run (next_run <= current time and is_active = true)
    const { data: schedules, error: schedulesError } = await supabase
      .from("blog_schedules")
      .select("*")
      .eq("is_active", true)
      .lte("next_run", now.toISOString())
      .order("next_run", { ascending: true });
      
    if (schedulesError) {
      console.error("❌ Error fetching due schedules:", schedulesError);
      return NextResponse.json({ 
        error: "Database error", 
        message: schedulesError.message 
      }, { status: 500 });
    }
    
    console.log(`📅 Found ${schedules?.length || 0} schedules to execute`);
    
    if (!schedules || schedules.length === 0) {
      return NextResponse.json({ 
        message: "No schedules due for execution", 
        timestamp: now.toISOString() 
      });
    }
    
    // Process each due schedule
    const results = await Promise.all(
      schedules.map(schedule => processSchedule(supabase, schedule))
    );
    
    return NextResponse.json({
      success: true,
      executed: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results: results
    });
  } catch (error) {
    console.error("❌ Error in execute-schedules cron:", error);
    
    return NextResponse.json({
      error: "Server error",
      message: String(error)
    }, { status: 500 });
  }
}

// Process a single schedule
async function processSchedule(supabase: any, schedule: any) {
  const scheduleId = schedule.id;
  const websiteUrl = schedule.website_url;
  const startTime = Date.now();

  console.log(`🎯 Processing schedule ${scheduleId} for ${websiteUrl}`);

  try {
    // Check user credits
    console.log(`💳 Checking credits for user ${schedule.user_id}...`);
    const { data: userData, error: userError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", schedule.user_id)
      .single();

    if (userError && userError.code !== "PGRST116") {
      console.error("❌ Error fetching user data:", userError);
      throw new Error("Failed to fetch user subscription data");
    }

    // Get available credits
    let availableCredits = 0;
    if (userData) {
      availableCredits = Number(
        userData.credits_available ?? userData.credits ?? userData.available_credits ?? 0
      );
    }

    if (isNaN(availableCredits)) availableCredits = 0;
    console.log(`💳 User has ${availableCredits} credits available`);

    // Check if user has enough credits
    if (availableCredits < 1) {
      console.log(`💳 User ${schedule.user_id} has insufficient credits for schedule ${scheduleId}`);
      // Pause the schedule if no credits
      await supabase
        .from("blog_schedules")
        .update({ 
          is_active: false,
          status_message: "Paused due to insufficient credits"
        })
        .eq("id", scheduleId);
      
      console.log("⏸️ Schedule paused due to insufficient credits");

      // Log the error
      await logScheduleExecution(supabase, {
        schedule_id: scheduleId,
        user_id: schedule.user_id,
        status: "failed",
        message: `Insufficient credits (${availableCredits}) - schedule paused`,
      });

      return { 
        success: false, 
        schedule_id: scheduleId,
        error: "Insufficient credits",
        message: "Schedule paused due to insufficient credits"
      };
    }    

    // 🎯 Execute blog generation
    console.log(`🤖 Calling generateBlog for ${websiteUrl}...`);
    let result;
    let error = null;
    
    try {
      result = await generateBlog(websiteUrl);
      
      if (!result || typeof result !== 'object') {
        throw new Error("Blog generation returned invalid result");
      }
    } catch (err) {
      error = err;
      console.error("❌ Error executing blog generation:", err);
    }
    
    const endTime = Date.now();
    console.log(`⏱️ Blog generation took ${endTime - startTime}ms`);
    
    if (error || (result && typeof result === 'object' && 'error' in result)) {
      const errorMessage = error ? String(error) : ((result as any)?.error || "Unknown error");
      console.error(`❌ Error generating blog for schedule ${scheduleId}:`, errorMessage);

      // Log the error
      await logScheduleExecution(supabase, {
        schedule_id: scheduleId,
        user_id: schedule.user_id,
        status: "failed",
        message: `Blog generation failed: ${errorMessage}`,
      });
      
      // Update schedule with error information but don't deactivate
      await supabase
        .from("blog_schedules")
        .update({ 
          last_error: errorMessage,
          last_run: new Date().toISOString(),
        })
        .eq("id", scheduleId);

      return { 
        success: false, 
        schedule_id: scheduleId,
        error: "Blog generation failed", 
        details: errorMessage,
        execution_time_ms: endTime - startTime
      };
    }

    console.log("✅ Blog generation completed successfully!");

    // Deduct credit
    const newCredits = availableCredits - 1;
    console.log(`💳 Deducting credit: ${availableCredits} → ${newCredits}`);

    // Update user credits
    if (userData) {
      const updateData: any = {};
      if (typeof userData.credits_available !== "undefined") {
        updateData.credits_available = newCredits;
      } else if (typeof userData.credits !== "undefined") {
        updateData.credits = newCredits;
      } else if (typeof userData.available_credits !== "undefined") {
        updateData.available_credits = newCredits;
      }

      if (Object.keys(updateData).length > 0) {
        const { error: creditError } = await supabase
          .from("subscriptions")
          .update(updateData)
          .eq("user_id", schedule.user_id);

        if (creditError) {
          console.error("❌ Error updating credits:", creditError);
        } else {
          console.log(`💳 Credits updated successfully: ${availableCredits} → ${newCredits}`);
        }
      }
    }

    // Calculate the next run time
    const nextRun = calculateNextRunTime(
      schedule.frequency,
      schedule.day_of_week,
      schedule.day_of_month,
      schedule.time_of_day
    );

    console.log(`📅 Next run calculated: ${nextRun.toISOString()}`);

    // Update the schedule with last run time and next run
    await supabase
      .from("blog_schedules")
      .update({
        last_run: new Date().toISOString(),
        next_run: nextRun.toISOString(),
        qstash_message_id: null, // Clear any existing QStash message ID
      })
      .eq("id", scheduleId);

    console.log("✅ Schedule updated with last_run and next_run");
    
    // Get job ID from result
    const jobId = (result as any)?.jobId || (result as any)?.blogPosts?.[0]?.id || null;
    console.log(`📝 Blog job ID: ${jobId || 'not available'}`);
    
    // Log successful execution
    await logScheduleExecution(supabase, {
      schedule_id: scheduleId,
      user_id: schedule.user_id,
      status: "success",
      blog_id: jobId,
      message: `Blog generated successfully in ${endTime - startTime}ms`,
    });
    
    // Update the schedule with success information
    const { data: scheduleData } = await supabase
      .from("blog_schedules")
      .select("success_count")
      .eq("id", scheduleId)
      .single();
      
    const successCount = (scheduleData?.success_count || 0) + 1;
    
    await supabase
      .from("blog_schedules")
      .update({
        last_success: new Date().toISOString(),
        last_error: null,
        status_message: `Last run: Success (${Math.round((endTime - startTime)/1000)}s)`,
        success_count: successCount,
      })
      .eq("id", scheduleId);

    console.log(`✅ Successfully processed schedule ${scheduleId}`);
    return {
      success: true,
      schedule_id: scheduleId,
      job_id: jobId,
      next_run: nextRun.toISOString(),
      credits_remaining: newCredits,
      execution_time_ms: endTime - startTime
    };
    
  } catch (error) {
    console.error(`❌ Error processing schedule ${scheduleId}:`, error);
    
    try {
      // Log the execution error
      await logScheduleExecution(supabase, {
        schedule_id: scheduleId,
        user_id: schedule.user_id,
        status: "failed",
        blog_id: null,
        message: `Execution error: ${String(error)}`,
      });
      
      // Update the schedule with the error
      await supabase
        .from("blog_schedules")
        .update({
          last_error: String(error),
          last_run: new Date().toISOString(),
          status_message: `Error: ${String(error).substring(0, 100)}${String(error).length > 100 ? '...' : ''}`
        })
        .eq("id", scheduleId);
    } catch (logError) {
      console.error("❌ Error logging execution failure:", logError);
    }
    
    return {
      success: false,
      schedule_id: scheduleId,
      error: String(error),
      website_url: websiteUrl
    };
  }
}

// Helper function to log schedule executions
async function logScheduleExecution(
  supabase: any,
  data: {
    schedule_id: string;
    user_id: string;
    status: "success" | "failed";
    message?: string;
    blog_id?: string | null;
  }
) {
  try {
    // Enhanced UUID validation to prevent database errors
    const isValidScheduleId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.schedule_id);
    const isValidUserId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.user_id) 
      || data.user_id === "system";
    
    // Validate blog_id if provided - must be either null, undefined, or a valid UUID
    const isValidBlogId = !data.blog_id || data.blog_id === null || 
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.blog_id);
    
    if (!isValidScheduleId) {
      console.warn(`⚠️ Not logging execution: Invalid schedule_id format: ${data.schedule_id}`);
      return;
    }
    
    if (!isValidUserId) {
      console.warn(`⚠️ Using system user ID instead of invalid user_id: ${data.user_id}`);
      data.user_id = "system";
    }
    
    if (!isValidBlogId && data.blog_id) {
      console.warn(`⚠️ Removing invalid blog_id from log: ${data.blog_id}`);
      data.blog_id = null; // Set to null instead of undefined to ensure it's properly handled
    }

    // Debug log before inserting
    console.log(`📝 Logging execution with data:`, {
      schedule_id: data.schedule_id,
      user_id: data.user_id,
      status: data.status,
      message: data.message,
      blog_id: data.blog_id,
    });

    const { error } = await supabase.from("schedule_logs").insert({
      schedule_id: data.schedule_id,
      user_id: data.user_id,
      status: data.status,
      message: data.message,
      blog_id: data.blog_id, // Will be null if invalid
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("❌ Error logging schedule execution:", error);
    } else {
      console.log("✅ Schedule execution logged successfully");
    }
  } catch (error) {
    console.error("❌ Error logging schedule execution:", error);
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
