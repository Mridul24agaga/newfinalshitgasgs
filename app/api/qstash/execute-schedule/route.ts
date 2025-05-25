import { NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { createClient } from "@/utitls/supabase/server";
import { generateBlog } from "@/app/actions";
import { createQStashSchedule } from "@/lib/qstash";

// QStash webhook to execute scheduled blog generation
async function handler(request: Request) {
  try {
    console.log("🚀 QStash webhook triggered!");
    console.log("📅 Request headers:", Object.fromEntries(request.headers.entries()));

    // Parse the request body with error handling
    let body;
    try {
      body = await request.json();
      console.log("📦 Request body:", JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error("❌ Error parsing request body:", parseError);
      return NextResponse.json({ 
        error: "Invalid request body", 
        message: "Could not parse the request body as JSON." 
      }, { status: 400 });
    }

    const { scheduleId, websiteUrl, scheduledTime, type } = body;

    console.log(`🎯 QStash executing schedule ${scheduleId} for ${websiteUrl}`);
    console.log(`📅 Scheduled time: ${scheduledTime}, Type: ${type || "one-time"}`);
    console.log(`🔗 Website URL: ${websiteUrl}`);

    if (!scheduleId || !websiteUrl) {
      console.error("❌ Missing required parameters:", { scheduleId, websiteUrl });
      return NextResponse.json({ 
        error: "Missing required parameters", 
        message: "Both scheduleId and websiteUrl are required." 
      }, { status: 400 });
    }

    // Validate UUID format for scheduleId
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(scheduleId);
    if (!isValidUUID) {
      console.error(`❌ Invalid schedule ID format: "${scheduleId}"`);
      return NextResponse.json({ 
        error: "Invalid schedule ID format", 
        message: "The schedule ID must be a valid UUID.",
        schedule_id: scheduleId
      }, { status: 400 });
    }

    const supabase = await createClient();

    // Log the schedule ID we're trying to find
    console.log(`🔍 Looking for schedule with ID: ${scheduleId}`);
    
    // Get the schedule details with more detailed error handling
    const { data: schedule, error: scheduleError } = await supabase
      .from("blog_schedules")
      .select("*")
      .eq("id", scheduleId)
      .single();

    if (scheduleError) {
      console.error(`❌ Error fetching schedule: ${scheduleError.message}`, scheduleError);
      
      // Check if it's a "not found" error or something else
      if (scheduleError.code === "PGRST116") {
        console.log(`⚠️ Schedule ${scheduleId} not found - it might have been deleted`);
        
        // Check if there's another schedule for the same website URL
        if (websiteUrl) {
          console.log(`🔍 Checking for any other schedules for ${websiteUrl}`);
          const { data: otherSchedules } = await supabase
            .from("blog_schedules")
            .select("id, user_id, website_url, is_active")
            .eq("website_url", websiteUrl)
            .limit(1);
            
          if (otherSchedules && otherSchedules.length > 0) {
            console.log(`✅ Found another schedule for ${websiteUrl}: ${otherSchedules[0].id}`);
            const validScheduleId = otherSchedules[0].id;
            
            // Log execution with the found schedule
            await logScheduleExecution(supabase, {
              schedule_id: validScheduleId,
              user_id: otherSchedules[0].user_id,
              status: "failed",
              message: `Original schedule ${scheduleId} not found, but found another schedule for the same website.`,
            });
            
            return NextResponse.json({ 
              error: "Original schedule not found", 
              message: "The original schedule was not found, but we found another schedule for the same website.",
              original_schedule_id: scheduleId,
              alternate_schedule_id: validScheduleId,
              website_url: websiteUrl
            }, { status: 404 });
          }
        }
        
        // Try to log the execution anyway with a system user ID
        try {
          await logScheduleExecution(supabase, {
            schedule_id: scheduleId,
            user_id: "system", // Use "system" which will be handled in the logScheduleExecution function
            status: "failed",
            message: `Schedule not found: ${scheduleId}`,
          });
        } catch (logError) {
          console.error("❌ Error logging missing schedule:", logError);
        }
        
        return NextResponse.json({ 
          error: "Schedule not found", 
          message: "The requested schedule no longer exists in the database. It may have been deleted.",
          schedule_id: scheduleId
        }, { status: 404 });
      }
      
      // If it's some other database error
      return NextResponse.json({ 
        error: "Database error", 
        message: `Error retrieving schedule: ${scheduleError.message}`,
        schedule_id: scheduleId
      }, { status: 500 });
    }

    if (!schedule) {
      console.error(`❌ Schedule ${scheduleId} not found, but no error was returned`);
      return NextResponse.json({ 
        error: "Schedule not found", 
        message: "The requested schedule could not be found in the database.",
        schedule_id: scheduleId
      }, { status: 404 });
    }

    console.log("✅ Schedule found:", {
      id: schedule.id,
      website_url: schedule.website_url,
      is_active: schedule.is_active,
      user_id: schedule.user_id,
      frequency: schedule.frequency,
    });

    // Check if schedule is still active
    if (!schedule.is_active) {
      console.log("⏸️ Schedule is inactive, skipping:", scheduleId);
      return NextResponse.json({ message: "Schedule inactive" });
    }

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
      const { error: pauseError } = await supabase
        .from("blog_schedules")
        .update({ 
          is_active: false,
          status_message: "Paused due to insufficient credits"
        })
        .eq("id", scheduleId);
      
      if (pauseError) {
        console.error("❌ Error pausing schedule:", pauseError);
      } else {
        console.log("⏸️ Schedule paused due to insufficient credits");
      }

      // Log the error
      await logScheduleExecution(supabase, {
        schedule_id: scheduleId,
        user_id: schedule.user_id,
        status: "failed",
        message: `Insufficient credits (${availableCredits}) - schedule paused`,
      });

      return NextResponse.json({ 
        error: "Insufficient credits", 
        message: "Blog generation schedule has been paused due to insufficient credits. Please add more credits to resume.",
        schedule_id: scheduleId,
        credits_available: availableCredits
      }, { status: 402 });
    }    

    // 🎯 Execute blog generation
    console.log(`🤖 Calling generateBlog for ${websiteUrl}...`);
    let result;
    let error = null;
    const startTime = Date.now();
    
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

      return NextResponse.json({ 
        error: "Blog generation failed", 
        details: errorMessage,
        schedule_id: scheduleId,
        execution_time_ms: endTime - startTime
      }, { status: 500 });
    }

    console.log("✅ Blog generation completed successfully!");
    console.log("📝 Blog generation result:", JSON.stringify(result, null, 2));

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
    const now = new Date();
    const nextRun = calculateNextRunTime(
      schedule.frequency,
      schedule.day_of_week,
      schedule.day_of_month,
      schedule.time_of_day,
      now
    );

    console.log(`📅 Next run calculated: ${nextRun.toISOString()}`);

    // Update the schedule with last run time and next run
    const { error: updateError } = await supabase
      .from("blog_schedules")
      .update({
        last_run: now.toISOString(),
        next_run: nextRun.toISOString(),
      })
      .eq("id", scheduleId);

    if (updateError) {
      console.error("❌ Error updating schedule:", updateError);
    } else {
      console.log("✅ Schedule updated with last_run and next_run");
    }
    
    // Schedule the next execution with QStash
    let nextMessageId = null;
    if (type === "one-time" || !schedule.use_recurring) {
      console.log(`📅 Creating next one-time QStash schedule for ${scheduleId} at ${nextRun.toISOString()}...`);
      nextMessageId = await createQStashSchedule(scheduleId, nextRun, websiteUrl);
      if (nextMessageId) {
        await supabase.from("blog_schedules").update({ qstash_message_id: nextMessageId }).eq("id", scheduleId);
        console.log(`📅 Next QStash schedule created: ${nextMessageId}`);
      } else {
        console.error("❌ Failed to create next QStash schedule");
      }
    } else {
      console.log("📅 Skipping QStash re-scheduling for recurring schedule (handled by QStash cron)");
    }
    
    // Get job ID from result
    const jobId = (result as any)?.jobId || (result as any)?.blogPosts?.[0]?.id || "unknown";
    console.log(`📝 Blog job ID: ${jobId}`);
    
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
        last_success: now.toISOString(),
        last_error: null,
        status_message: `Last run: Success (${Math.round((endTime - startTime)/1000)}s)`,
        success_count: successCount,
      })
      .eq("id", scheduleId);

    console.log(`✅ Successfully processed schedule ${scheduleId}`);
    console.log(`📅 Next run scheduled for: ${nextRun.toISOString()}`);
    console.log(`🎉 Blog generation action completed successfully!`);

    return NextResponse.json({
      success: true,
      schedule_id: scheduleId,
      job_id: jobId,
      next_run: nextRun.toISOString(),
      next_message_id: nextMessageId,
      credits_remaining: newCredits,
      execution_time_ms: endTime - startTime,
      message: "Blog generation completed successfully! 🎉",
      action_called: "generateBlog",
      website_url: websiteUrl,
    });
  } catch (error) {
    console.error("❌ Error in QStash schedule execution:", error);
    console.error("❌ Error stack:", (error as Error).stack);

    // Try to log the error if we have the schedule info
    try {
      // We need to re-parse the request body since we're in a catch block
      const rawBody = await request.text();
      const body = JSON.parse(rawBody);
      const { scheduleId, websiteUrl } = body;

      console.log(`⚠️ Attempted to process schedule ${scheduleId} for ${websiteUrl}`);

      // Enhanced UUID validation with detailed logging
      const isValidUUID = scheduleId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(scheduleId);
      
      if (!isValidUUID) {
        console.error(`❌ Invalid schedule ID format: "${scheduleId}". Cannot log execution.`);
        return NextResponse.json(
          {
            error: "Invalid schedule ID format",
            message: "The schedule ID is not in a valid UUID format",
            attempted_schedule_id: scheduleId
          },
          { status: 400 }
        );
      }
      
      const supabase = await createClient();
      
      // Check if the schedule exists
      const { data: schedule } = await supabase
        .from("blog_schedules")
        .select("user_id, website_url")
        .eq("id", scheduleId)
        .single();

      if (schedule) {
        console.log(`✅ Found schedule ${scheduleId} for logging the error`);
        
        await logScheduleExecution(supabase, {
          schedule_id: scheduleId,
          user_id: schedule.user_id,
          status: "failed",
          message: `Execution failed: ${String(error)}`,
        });
        
        // Update the schedule with error information
        await supabase
          .from("blog_schedules")
          .update({
            last_error: String(error),
            last_run: new Date().toISOString(),
            status_message: `Error: ${String(error).substring(0, 100)}${String(error).length > 100 ? '...' : ''}`
          })
          .eq("id", scheduleId);
      } else {
        console.error(`❌ Could not find schedule ${scheduleId} for logging`);
      }
    } catch (logError) {
      console.error("❌ Error logging failed execution:", logError);
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: String(error),
        action_attempted: "generateBlog",
      },
      { status: 500 }
    );
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
    blog_id?: string;
  }
) {
  try {
    // Enhanced UUID validation to prevent database errors
    const isValidScheduleId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.schedule_id);
    const isValidUserId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.user_id) 
      || data.user_id === "system";
    
    // Validate blog_id if provided
    const isValidBlogId = !data.blog_id || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.blog_id);
    
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
      data.blog_id = undefined;
    }

    const { error } = await supabase.from("schedule_logs").insert({
      schedule_id: data.schedule_id,
      user_id: data.user_id,
      status: data.status,
      message: data.message,
      blog_id: data.blog_id,
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
  timeOfDay: string,
  fromTime: Date
): Date {
  const [hours, minutes] = timeOfDay.split(":").map(Number);
  const nextRun = new Date(fromTime);
  nextRun.setHours(hours, minutes, 0, 0);

  if (frequency === "daily") {
    // Add 1 day
    nextRun.setDate(nextRun.getDate() + 1);
  } else if (frequency === "weekly" && dayOfWeek !== null) {
    // Find next occurrence of the day
    const currentDay = fromTime.getDay();
    let daysUntilTarget = (dayOfWeek - currentDay + 7) % 7;
    if (daysUntilTarget === 0) daysUntilTarget = 7; // Next week
    nextRun.setDate(fromTime.getDate() + daysUntilTarget);
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

  return nextRun;
}

// Verify QStash signature for security
export const POST = verifySignatureAppRouter(handler);