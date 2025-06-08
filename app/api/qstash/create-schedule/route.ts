import { NextResponse } from "next/server"
import { createQStashSchedule, createQStashCronSchedule, frequencyToCron } from "@/lib/qstash"

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
    
    console.log(`🚀 Creating QStash schedule for ${scheduleId}`)
    console.log(`📅 Next run: ${nextRun}`)
    console.log(`🔄 Type: ${useRecurring ? "recurring" : "one-time"}`)
    
    let messageId = null
    let scheduleType = "one-time"

    try {
      if (useRecurring && frequency && timeOfDay) {
        // Create recurring schedule with cron
        const cronExpression = frequencyToCron(frequency, timeOfDay, dayOfWeek, dayOfMonth)
        console.log(`⏰ Cron expression: ${cronExpression}`)

        messageId = await createQStashCronSchedule(scheduleId, cronExpression, websiteUrl)
        scheduleType = "recurring"
      } else {
        // Create one-time schedule
        console.log(`⏰ Creating one-time schedule for date: ${new Date(nextRun).toISOString()}`);
        messageId = await createQStashSchedule(scheduleId, new Date(nextRun), websiteUrl)
        scheduleType = "one-time"
      }
    } catch (scheduleError) {
      console.error(`❌ Error creating QStash ${scheduleType} schedule:`, scheduleError);
      return NextResponse.json({ 
        success: false, 
        error: `Failed to create ${scheduleType} schedule`,
        message: String(scheduleError),
        scheduleId,
        websiteUrl
      }, { status: 500 });
    }

    if (messageId) {
      console.log(`✅ QStash ${scheduleType} schedule created successfully: ${messageId}`)
      return NextResponse.json({
        messageId,
        type: scheduleType,
        success: true,
        scheduleId,
        message: `QStash ${scheduleType} schedule created successfully! 🚀`,
      })
    } else {
      console.error(`❌ Failed to create QStash ${scheduleType} schedule - no message ID returned`)
      return NextResponse.json({ 
        success: false,
        error: `Failed to create ${scheduleType} schedule`,
        message: "No message ID was returned from QStash.",
        scheduleId,
        websiteUrl
      }, { status: 500 })
    }
  } catch (error) {
    console.error("❌ Error creating QStash schedule:", error);
    console.error("❌ Stack trace:", (error as Error).stack);
    
    return NextResponse.json({ 
      success: false,
      error: "Failed to create schedule", 
      message: String(error),
      details: (error as Error).stack
    }, { status: 500 });
  }
}
