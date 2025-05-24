import { NextResponse } from "next/server"
import { testQStashConnection } from "@/lib/qstash"

// Test QStash connection
export async function GET() {
  try {
    console.log("🧪 Testing QStash connection...")

    // Check if environment variables are set
    const hasToken = !!process.env.QSTASH_TOKEN
    const hasCurrentKey = !!process.env.QSTASH_CURRENT_SIGNING_KEY
    const hasNextKey = !!process.env.QSTASH_NEXT_SIGNING_KEY

    if (!hasToken) {
      return NextResponse.json(
        {
          status: "error",
          message: "QStash token not configured",
          error: "QSTASH_TOKEN environment variable is missing",
          troubleshooting: [
            "Add QSTASH_TOKEN to your environment variables",
            "Get your token from https://console.upstash.com/qstash",
            "Redeploy your application after adding the token",
          ],
        },
        { status: 500 },
      )
    }

    const result = await testQStashConnection()

    if (result.success) {
      console.log("✅ QStash connection test successful!")
      return NextResponse.json({
        status: "success",
        message: "QStash connection successful! 🚀",
        timestamp: new Date().toISOString(),
        config: {
          qstash_url: "https://qstash.upstash.io",
          webhook_url: `${process.env.VERCEL_URL || process.env.NEXT_PUBLIC_SITE_URL}/api/qstash/execute-schedule`,
          has_token: hasToken,
          has_current_signing_key: hasCurrentKey,
          has_next_signing_key: hasNextKey,
        },
      })
    } else {
      console.error("❌ QStash connection test failed:", result.error)
      return NextResponse.json(
        {
          status: "error",
          message: "QStash connection failed",
          error: result.error,
          config: {
            has_token: hasToken,
            has_current_signing_key: hasCurrentKey,
            has_next_signing_key: hasNextKey,
          },
          troubleshooting: [
            "Check if QSTASH_TOKEN is correct",
            "Verify your QStash account is active",
            "Ensure your app is deployed (webhooks need public URLs)",
            "Check if your token has the necessary permissions",
          ],
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ QStash test failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "QStash connection failed",
        error: String(error),
      },
      { status: 500 },
    )
  }
}
