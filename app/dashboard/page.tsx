"use client"

import type React from "react"

import { Suspense, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import DashboardContent from "./dashboard-content"

// Subscription guard component with loading animation
function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        // Check if user is authenticated
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
          // User is not authenticated, redirect to login
          router.push("/login")
          return
        }

        // Check if user has a subscription
        const { data: subscription, error: subError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single()

        // If no subscription or plan_id is "free", redirect to payment page
        if (!subscription || subscription.plan_id === "free") {
          router.push("/payment")
          return
        }

        // Finished checking, user has a paid subscription
        setIsChecking(false)
      } catch (err) {
        console.error("Error checking subscription:", err)
        // On error, still stop the loading animation
        setIsChecking(false)
      }
    }

    checkSubscription()
  }, [router, supabase])

  // Show a small loading animation while checking subscription
  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-3"></div>
          <p className="text-sm text-gray-500">Verifying subscription...</p>
        </div>
      </div>
    )
  }

  // Once checked, render children
  return <>{children}</>
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SubscriptionGuard>
        <DashboardContent />
      </SubscriptionGuard>
    </Suspense>
  )
}
