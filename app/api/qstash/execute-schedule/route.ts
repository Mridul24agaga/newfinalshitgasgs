import { NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { createClient } from "@/utitls/supabase/server"; // Note: Fix typo "utitls" to "utils" in your project
import { generateBlog } from "@/app/actions";
import { createQStashSchedule } from "@/lib/qstash";

// QStash webhook to execute scheduled blog generation
async function handler(request: Request) {
  try {
    console.log("🚀 QStash webhook triggered!");
    console.log("📅 Request headers:", Object.fromEntries(request.headers.entries()));

    const body = await request.json();
    const { scheduleId, websiteUrl, scheduledTime, type } = body;

    console.log(`🎯 QStash executing schedule ${scheduleId} for ${websiteUrl}`);
    console.log(`📅 Scheduled time: ${scheduledTime}, Type: ${type || "one-time"}`);
    console.log(`🔗 Website URL: ${websiteUrl}`);

    if (!scheduleId || !websiteUrl) {
      console.error("❌ Missing required parameters:", { scheduleId, websiteUrl });
      return NextResponse.json({ error: "Missing scheduleId or websiteUrl" }, { status: 400 });
    }

    const supabase = await createClient();

    // Get the schedule details
    const { data: schedule, error: scheduleError } = await supabase
      .from("blog_schedules")
      .select("*")
      .eq("id", scheduleId)
      .single();

    if (scheduleError || !schedule) {
      console.error("❌ Schedule not found:", scheduleId, scheduleError);
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
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
      await supabase.from("blog_schedules").update({ is_active: false }).eq("id", scheduleId);

      // Log the error
      await logScheduleExecution(supabase, {
        schedule_id: scheduleId,
        user_id: schedule.user_id,
        status: "failed",
        message: "Insufficient credits - schedule paused",
      });

      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }

    // 🎯 Execute blog generation
    console.log(`🤖 Calling generateBlog for ${websiteUrl}...`);
    const startTime = Date.now();
    const result = await generateBlog(websiteUrl);
    const endTime = Date.now();

    console.log(`⏱️ Blog generation took ${endTime - startTime}ms`);
    console.log("📝 Blog generation result:", JSON.stringify(result, null, 2));

    // Check if there was an error in the result
    if (result && typeof result === "object" && "error" in result && result.error) {
      console.error(`❌ Error generating blog for schedule ${scheduleId}:`, result.error);

      // Log the error
      await logScheduleExecution(supabase, {
        schedule_id: scheduleId,
        user_id: schedule.user_id,
        status: "failed",
        message: `Blog generation failed: ${result.error}`,
      });

      throw new Error(result.error as string);
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
    if (schedule.frequency === "daily" || type === "one-time") {
      console.log(`📅 Creating next QStash schedule for ${schedule.frequency} execution...`);
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
      const body = await request.json();
      const { scheduleId } = body;

      if (scheduleId) {
        const supabase = await createClient();
        const { data: schedule } = await supabase.from("blog_schedules").select("user_id").eq("id", scheduleId).single();

        if (schedule) {
          await logScheduleExecution(supabase, {
            schedule_id: scheduleId,
            user_id: schedule.user_id,
            status: "failed",
            message: `Execution failed: ${String(error)}`,
          });
        }
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