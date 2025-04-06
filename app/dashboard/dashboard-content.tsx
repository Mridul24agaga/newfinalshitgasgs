"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { DashboardShell } from "./dashboard-shell"
import { Loader2 } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export default function DashboardContent() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication...")

        // Check if user is authenticated
        const { data, error } = await supabase.auth.getUser()

        if (error) {
          console.error("Auth error:", error)
          router.push("/login")
          return
        }

        if (!data.user) {
          console.log("No authenticated user found")
          router.push("/login")
          return
        }

        console.log("User authenticated:", data.user.id)
        setUser(data.user)

        // Always mark onboarding as completed in the database
        try {
          await supabase
            .from("subscriptions")
            .update({
              website_onboarding_completed: true,
              onboarding_completed: true,
            })
            .eq("user_id", data.user.id)
        } catch (updateError) {
          console.error("Error updating onboarding status:", updateError)
          // Continue anyway - we don't want to block access to the dashboard
        }

        // Always allow access to dashboard
        setLoading(false)
      } catch (err) {
        console.error("Dashboard auth error:", err)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router, supabase, searchParams])

  // Show a minimal loading indicator instead of null
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Only render dashboard if we have a user
  if (!user) {
    return null // This should rarely happen as we redirect in the useEffect
  }

  return <DashboardShell user={user} />
}

