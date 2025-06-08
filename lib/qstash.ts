import { Client } from "@upstash/qstash"

// Initialize QStash client with your credentials
const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
})

export { qstash }

// Helper function to create a schedule in QStash
export async function createQStashSchedule(scheduleId: string, nextRun: Date, websiteUrl: string) {
  try {
    if (!process.env.QSTASH_TOKEN) {
      console.log("QStash token not found, skipping QStash schedule creation")
      return null
    }

    // Validate inputs
    if (!scheduleId || typeof scheduleId !== 'string') {
      console.error("❌ Invalid scheduleId provided:", scheduleId)
      return null
    }

    if (!(nextRun instanceof Date) || isNaN(nextRun.getTime())) {
      console.error("❌ Invalid nextRun date provided:", nextRun)
      return null
    }

    if (!websiteUrl || typeof websiteUrl !== 'string') {
      console.error("❌ Invalid websiteUrl provided:", websiteUrl)
      return null
    }

    const now = new Date()
    const delayInSeconds = Math.max(0, Math.floor((nextRun.getTime() - now.getTime()) / 1000))

    console.log(`🚀 Creating QStash schedule for ${scheduleId}`)
    console.log(`⏰ Delay: ${delayInSeconds} seconds (${Math.floor(delayInSeconds / 60)} minutes)`)
    console.log(`📅 Next run: ${nextRun.toISOString()}`)

    // Use your actual domain URL for the webhook
    const webhookUrl = `${process.env.VERCEL_URL || process.env.NEXT_PUBLIC_SITE_URL}/api/qstash/execute-schedule`
    console.log(`🔗 Webhook URL: ${webhookUrl}`)

    const payload = {
      scheduleId,
      websiteUrl,
      scheduledTime: nextRun.toISOString(),
      type: "one-time",
    }

    console.log(`📦 Payload:`, payload)

    const response = await qstash.publishJSON({
      url: webhookUrl,
      body: payload,
      delay: delayInSeconds,
    })

    console.log("✅ QStash schedule created successfully:", response)
    console.log(`📝 Message ID: ${response.messageId}`)

    return response.messageId
  } catch (error) {
    console.error("❌ Error creating QStash schedule:", error)
    return null
  }
}

// Helper function to create recurring QStash schedule with cron
export async function createQStashCronSchedule(scheduleId: string, cronExpression: string, websiteUrl: string) {
  try {
    if (!process.env.QSTASH_TOKEN) {
      console.log("QStash token not found, skipping QStash cron schedule creation")
      return null
    }

    console.log(`🚀 Creating QStash cron schedule for ${scheduleId}`)
    console.log(`⏰ Cron expression: ${cronExpression}`)

    const webhookUrl = `${process.env.VERCEL_URL || process.env.NEXT_PUBLIC_SITE_URL}/api/qstash/execute-schedule`
    console.log(`🔗 Webhook URL: ${webhookUrl}`)

    const payload = {
      scheduleId,
      websiteUrl,
      type: "recurring",
    }

    console.log(`📦 Payload:`, payload)

    const response = await fetch("https://qstash.upstash.io/v2/schedules", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        destination: webhookUrl,
        cron: cronExpression,
        body: JSON.stringify(payload),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`QStash API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("✅ QStash cron schedule created:", data)
    console.log(`📝 Schedule ID: ${data.scheduleId}`)

    return data.scheduleId
  } catch (error) {
    console.error("❌ Error creating QStash cron schedule:", error)
    return null
  }
}

// Helper function to cancel a QStash schedule
export async function cancelQStashSchedule(messageId: string) {
  try {
    if (!process.env.QSTASH_TOKEN || !messageId) {
      return false
    }

    console.log("🗑️ Cancelling QStash schedule:", messageId)

    // Try to delete as a message first
    try {
      await qstash.messages.delete(messageId)
      console.log("✅ QStash message cancelled:", messageId)
      return true
    } catch (messageError) {
      // If it fails, try to delete as a schedule
      const response = await fetch(`https://qstash.upstash.io/v2/schedules/${messageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
        },
      })

      if (response.ok) {
        console.log("✅ QStash schedule cancelled:", messageId)
        return true
      } else {
        const errorText = await response.text()
        console.error("❌ Failed to cancel QStash schedule:", response.status, errorText)
        return false
      }
    }
  } catch (error) {
    console.error("❌ Error cancelling QStash schedule:", error)
    return false
  }
}

// Helper function to convert frequency to cron expression
export function frequencyToCron(
  frequency: "daily" | "weekly" | "monthly",
  timeOfDay: string,
  dayOfWeek?: number,
  dayOfMonth?: number,
): string {
  const [hours, minutes] = timeOfDay.split(":").map(Number)

  switch (frequency) {
    case "daily":
      return `${minutes} ${hours} * * *`
    case "weekly":
      return `${minutes} ${hours} * * ${dayOfWeek || 0}`
    case "monthly":
      return `${minutes} ${hours} ${dayOfMonth || 1} * *`
    default:
      return `${minutes} ${hours} * * *`
  }
}

// Test QStash connection
export async function testQStashConnection() {
  try {
    if (!process.env.QSTASH_TOKEN) {
      throw new Error("QStash token not configured")
    }

    // Test with QStash topics endpoint (supports GET)
    const response = await fetch("https://qstash.upstash.io/v2/topics", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`QStash API error: ${response.status} - ${errorText}`)
    }

    // If we get here, the connection is working
    return { success: true, message: "QStash connection successful" }
  } catch (error) {
    console.error("QStash connection test failed:", error)
    return { success: false, error: String(error) }
  }
}

// Test function to manually trigger a schedule (for debugging)
export async function testScheduleExecution(scheduleId: string, websiteUrl: string) {
  try {
    console.log(`🧪 Testing schedule execution for ${scheduleId}`)

    const webhookUrl = `${process.env.VERCEL_URL || process.env.NEXT_PUBLIC_SITE_URL}/api/qstash/execute-schedule`

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Upstash-Signature": "test", // This will be ignored in test mode
      },
      body: JSON.stringify({
        scheduleId,
        websiteUrl,
        scheduledTime: new Date().toISOString(),
        type: "test",
      }),
    })

    const result = await response.json()
    console.log("🧪 Test execution result:", result)

    return result
  } catch (error) {
    console.error("❌ Test execution failed:", error)
    return { error: String(error) }
  }
}
