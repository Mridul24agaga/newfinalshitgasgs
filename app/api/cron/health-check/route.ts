import { NextResponse } from "next/server";
import { createClient } from "@/utitls/supabase/server";

export async function GET(request: Request) {
  try {
    console.log("🔍 Cron health check running...");
    
    // Verify the request is from Vercel cron
    const authHeader = request.headers.get("Authorization");
    if (process.env.CRON_SECRET && (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`)) {
      console.error("🔒 Unauthorized access attempt to cron endpoint");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const supabase = await createClient();
    const now = new Date();
    
    // Get count of active schedules
    const { count: activeSchedules, error: countError } = await supabase
      .from("blog_schedules")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);
      
    // Get count of schedules due in the next 24 hours
    const tomorrow = new Date(now);
    tomorrow.setHours(tomorrow.getHours() + 24);
    
    const { count: upcomingSchedules, error: upcomingError } = await supabase
      .from("blog_schedules")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .lte("next_run", tomorrow.toISOString())
      .gt("next_run", now.toISOString());
      
    if (countError || upcomingError) {
      console.error("❌ Error fetching schedule counts:", countError || upcomingError);
      return NextResponse.json({ 
        error: "Database error", 
        message: (countError || upcomingError)?.message 
      }, { status: 500 });
    }

    // Log system health status
    await supabase
      .from("system_logs")
      .insert({
        event: "cron_health_check",
        details: {
          active_schedules: activeSchedules,
          upcoming_schedules: upcomingSchedules,
          timestamp: now.toISOString()
        },
        created_at: now.toISOString()
      });
      
    return NextResponse.json({
      status: "healthy",
      timestamp: now.toISOString(),
      active_schedules: activeSchedules || 0,
      upcoming_schedules: upcomingSchedules || 0
    });
  } catch (error) {
    console.error("❌ Error in cron health check:", error);
    
    return NextResponse.json({
      status: "error",
      error: String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
