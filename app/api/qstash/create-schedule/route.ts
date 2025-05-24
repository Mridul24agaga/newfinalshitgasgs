import { NextResponse } from "next/server"
import { createQStashSchedule, createQStashCronSchedule, frequencyToCron } from "@/lib/qstash"

export async function POST(request: Request) {
  try {
    const { scheduleId, nextRun, websiteUrl, frequency, timeOfDay, dayOfWeek, dayOfMonth, useRecurring } =
      await request.json()

    console.log(`🚀 Creating QStash schedule for ${scheduleId}`)
    console.log(`📅 Next run: ${nextRun}`)
    console.log(`🔄 Type: ${useRecurring ? "recurring" : "one-time"}`)

    let messageId = null
    let scheduleType = "one-time"

    if (useRecurring && frequency && timeOfDay) {
      // Create recurring schedule with cron
      const cronExpression = frequencyToCron(frequency, timeOfDay, dayOfWeek, dayOfMonth)
      console.log(`⏰ Cron expression: ${cronExpression}`)

      messageId = await createQStashCronSchedule(scheduleId, cronExpression, websiteUrl)
      scheduleType = "recurring"
    } else {
      // Create one-time schedule
      messageId = await createQStashSchedule(scheduleId, new Date(nextRun), websiteUrl)
      scheduleType = "one-time"
    }

    if (messageId) {
      console.log(`✅ QStash schedule created successfully: ${messageId}`)
      return NextResponse.json({
        messageId,
        type: scheduleType,
        success: true,
        message: `QStash ${scheduleType} schedule created successfully! 🚀`,
      })
    } else {
      console.error("❌ Failed to create QStash schedule")
      return NextResponse.json({ error: "Failed to create QStash schedule" }, { status: 500 })
    }
  } catch (error) {
    console.error("❌ Error creating QStash schedule:", error)
    return NextResponse.json({ error: "Failed to create schedule", details: String(error) }, { status: 500 })
  }
}
