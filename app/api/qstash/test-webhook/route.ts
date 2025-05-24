import { NextResponse } from "next/server"
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"

// Test webhook for QStash[^4]
async function handler(request: Request) {
  try {
    const body = await request.json()
    console.log("🧪 QStash test webhook received:", body)

    return NextResponse.json({
      success: true,
      message: "Test webhook received successfully! ✅",
      receivedAt: new Date().toISOString(),
      body,
    })
  } catch (error) {
    console.error("❌ Error in test webhook:", error)
    return NextResponse.json({ error: "Test webhook failed" }, { status: 500 })
  }
}

export const POST = verifySignatureAppRouter(handler)
