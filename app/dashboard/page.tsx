import { redirect } from "next/navigation"
import { createClient } from "@/utitls/supabase/server"
import { DashboardShell } from "./dashboard-shell"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    console.error("Authentication error:", error)
    redirect("/login")
  }

  return <DashboardShell user={user} />
}

