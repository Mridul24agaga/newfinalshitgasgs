"use client"

import { useState, useEffect } from "react"
import { Menu } from 'lucide-react'
import URLForm from "./url-form"
import { Sidebar } from "@/app/components/layout/sidebar"
import { createClient } from "@/utitls/supabase/client"
import ContentPlanner from "@/app/components/content-planner"

export default function SummarizerPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [subscription, setSubscription] = useState<{
    plan_id: string
    credits: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshPlanner, setRefreshPlanner] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        // Get the current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setIsLoading(false)
          return
        }

        // Fetch subscription data from the subscriptions table
        const { data, error } = await supabase
          .from("subscriptions")
          .select("plan_id, credits")
          .eq("user_id", user.id)
          .single()

        if (error) {
          if (error.code === "PGRST116") {
            console.log("No subscription found for user")
          } else {
            console.error("Error fetching subscription:", error.message)
          }
          setSubscription(null)
        } else if (data) {
          setSubscription({
            plan_id: data.plan_id,
            credits: data.credits || 0,
          })
        }
      } catch (err) {
        console.error("Unexpected error while fetching subscription:", err)
        setSubscription(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscription()
  }, [supabase])

  const handleContentGenerated = () => {
    // Toggle the refreshPlanner state to force ContentPlanner to refresh
    setRefreshPlanner(prev => !prev)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-orange-500 text-white p-2 rounded-md"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <Sidebar subscription={subscription} />
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64 transition-all duration-300 ease-in-out">
        <div className="bg-[#F8F9FB] min-h-screen">
          <header className="bg-[#F9FAFB] sticky top-0 z-30">
            <div className="flex flex-col md:flex-row md:items-center justify-between px-4 md:px-8 py-4 mt-14 md:mt-0"></div>
          </header>

          <main className="p-4 md:p-8 pt-20 md:pt-8">
            <div className="max-w-[1200px] mx-auto">
              {/* URL Form at the top */}
              <URLForm onGenerated={handleContentGenerated} />
              
              {/* Content Planner below the URL Form */}
              <div className="mt-8">
                <ContentPlanner key={refreshPlanner ? "refresh" : "initial"} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}