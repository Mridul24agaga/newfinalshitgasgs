import { NextResponse } from "next/server";
import { createClient } from "@/utitls/supabase/server";

export async function POST(request: Request) {
  try {
    const { scheduleId } = await request.json();

    if (!scheduleId) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing scheduleId" 
      }, { status: 400 });
    }

    console.log(`🗑️ Cancelling schedule: ${scheduleId}`);

    const supabase = await createClient();
    
    // Update the database to set is_active to false
    const { error } = await supabase
      .from("blog_schedules")
      .update({ 
        is_active: false,
        status_message: "Cancelled by user",
        last_updated: new Date().toISOString()
      })
      .eq("id", scheduleId);

    if (error) {
      console.error(`❌ Failed to cancel schedule: ${scheduleId}`, error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to cancel schedule",
          message: error.message
        },
        { status: 500 }
      );
    }

    console.log(`✅ Schedule cancelled successfully: ${scheduleId}`);
    return NextResponse.json({
      success: true,
      message: "Schedule cancelled successfully! 🗑️",
    });
  } catch (error) {
    console.error("❌ Error cancelling schedule:", error);
    return NextResponse.json(
      {
        error: "Failed to cancel schedule",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
