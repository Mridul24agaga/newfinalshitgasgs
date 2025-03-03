"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/utitls/supabase/client"
import { Menu, CreditCard } from "lucide-react"
import { Sidebar } from "@/app/components/sidebar"
import Link from "next/link"
import { PaymentPage } from "@/app/components/PaymentPage"

interface DashboardShellProps {
  user: User
}

interface Subscription {
  plan_id: string
  credits: number
  status?: string
  current_period_end?: string
}

export function DashboardShell({ user }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [showPaymentPage, setShowPaymentPage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      await fetchSubscription()
      setIsLoading(false)
    }

    const userId = searchParams.get("user_id")
    const plan = searchParams.get("plan")
    const credits = searchParams.get("credits")

    if (userId && plan && credits) {
      handlePaymentSuccess(userId, plan, parseInt(credits))
    } else {
      fetchData()
    }
  }, [searchParams])

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("plan_id, credits, status, current_period_end")
        .eq("user_id", user.id)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          console.log("No subscription found for user")
          setShowPaymentPage(true)
        } else {
          console.error("Error fetching subscription:", error.message, error.details)
        }
        return
      }

      if (data) {
        setSubscription({
          plan_id: data.plan_id,
          credits: data.credits || 0,
          status: data.status,
          current_period_end: data.current_period_end,
        })
        setShowPaymentPage(false)
      } else {
        console.log("No subscription data returned")
        setShowPaymentPage(true)
      }
    } catch (err) {
      console.error("Unexpected error while fetching subscription:", err)
    }
  }

  const handlePaymentSuccess = async (userId: string, plan: string, credits: number) => {
    try {
      const subscriptionData = {
        user_id: userId,
        plan_id: plan,
        credits: credits,
        status: "active",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }

      const { error } = await supabase.from("subscriptions").upsert(subscriptionData)

      if (error) throw error

      await fetchSubscription()
      router.replace("/dashboard") // Remove query params from URL
    } catch (error) {
      console.error("Error updating subscription after payment:", error)
    }
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await supabase.auth.signOut()
      router.refresh()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (showPaymentPage) {
    return <PaymentPage />
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        <Sidebar subscription={subscription} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-gray-500 hover:text-gray-700 mr-3"
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <Menu size={24} />
              </button>
              <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                {isSigningOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-md p-6 mb-8 text-white">
              <h1 className="text-2xl font-bold mb-2">Welcome to Blogosocial 👋</h1>
              <p className="opacity-90">Your ultimate tool for AI-powered blogging and social media management.</p>
            </div>

            {/* Subscription Info */}
            {subscription && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Your Subscription</h2>
                    <p className="text-gray-600">Plan: {subscription.plan_id.charAt(0).toUpperCase() + subscription.plan_id.slice(1)}</p>
                    <p className="text-gray-600">Credits Remaining: {subscription.credits}</p>
                    {subscription.status && <p className="text-gray-600">Status: {subscription.status}</p>}
                    {subscription.current_period_end && (
                      <p className="text-gray-600">
                        Expires: {new Date(subscription.current_period_end).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Link
                    href="/upgrade"
                    className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Upgrade Plan
                  </Link>
                </div>
              </div>
            )}

            {/* Main Dashboard Content */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Overview</h2>
              <p className="text-gray-600">
                Welcome to your Blogosocial dashboard. Here you can manage your blog posts, track your performance, and
                access all the tools you need to create engaging content.
              </p>
              {/* Add more dashboard content here */}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}