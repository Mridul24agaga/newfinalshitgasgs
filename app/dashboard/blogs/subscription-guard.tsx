"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"

export default function SubscriptionGuard({ children }: { children: React.ReactNode }) {
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

        if (authError) {
          throw new Error(`Authentication error: ${authError.message}`)
        }

        if (!user) {
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

        if (subError && subError.code !== "PGRST116") {
          console.error(`Error checking subscription: ${subError.message}`)
        }

        // If no subscription or plan_id is "free", redirect to payment page
        if (!subscription || subscription.plan_id === "free") {
          console.log("User has free plan or no subscription, redirecting to payment page")
          router.push("/payment")
          return
        }

        // User has a paid subscription, allow access to dashboard
        setIsChecking(false)
      } catch (err) {
        console.error("Error checking subscription:", err)
        // On error, we'll still show the dashboard, but log the error
        setIsChecking(false)
      }
    }

    checkSubscription()
  }, [router, supabase])

  // While checking subscription, return null to let Suspense handle loading
  if (isChecking) return null

  // Once checked, render children
  return <>{children}</>
}
