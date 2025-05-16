import { type NextRequest, NextResponse } from "next/server"
import { testSendEmail } from "@/app/actions/email"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    const result = await testSendEmail(email)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error in test-email route:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred while sending the test email",
        error: error.toString(),
      },
      { status: 500 },
    )
  }
}
