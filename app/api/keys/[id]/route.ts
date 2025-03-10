import { NextResponse } from "next/server"
import { createClient } from "@/utitls/supabase/server"

// Delete an API key
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    // Get the current user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete the API key
    const { error } = await supabase.from("keys").delete().eq("id", params.id).eq("user_id", session.user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting API key:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

