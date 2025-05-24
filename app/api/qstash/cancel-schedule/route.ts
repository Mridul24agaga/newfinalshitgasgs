import { NextResponse } from "next/server"
import { cancelQStashSchedule } from "@/lib/qstash"

export async function POST(request: Request) {
  try {
    const { messageId } = await request.json()

    console.log(`🗑️ Cancelling QStash schedule: ${messageId}`)

    const success = await cancelQStashSchedule(messageId)

    if (success) {
      console.log(`✅ QStash schedule cancelled successfully: ${messageId}`)
      return NextResponse.json({
        success: true,
        message: "QStash schedule cancelled successfully! 🗑️",
      })
    } else {
      console.error(`❌ Failed to cancel QStash schedule: ${messageId}`)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to cancel QStash schedule",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ Error cancelling QStash schedule:", error)
    return NextResponse.json(
      {
        error: "Failed to cancel schedule",
        details: String(error),
      },
      { status: 500 },
    )
  }
}
