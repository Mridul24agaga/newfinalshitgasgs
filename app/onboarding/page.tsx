"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { Globe, ArrowRight, Loader2, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function OnboardingPage() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Check authentication and onboarding status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsCheckingAuth(true)

        // Check if user is authenticated
        const { data, error } = await supabase.auth.getUser()

        if (error || !data.user) {
          console.error("Auth error or no user:", error)
          router.push("/login")
          return
        }

        const userId = data.user.id
        console.log("Checking onboarding status for user:", userId)

        // Check if user has already completed onboarding
        const { data: onboardingData, error: onboardingError } = await supabase
          .from("onboarding_status")
          .select("is_completed")
          .eq("user_id", userId)
          .single()

        if (onboardingData && onboardingData.is_completed) {
          console.log("User has already completed onboarding, redirecting to dashboard")
          router.push("/dashboard")
          return
        }

        // If no onboarding record exists, create one
        if (onboardingError && onboardingError.code === "PGRST116") {
          console.log("No onboarding record found, creating one")
          await supabase.from("onboarding_status").insert({
            user_id: userId,
            is_completed: false,
          })
        }

        setIsCheckingAuth(false)
      } catch (err) {
        console.error("Onboarding auth error:", err)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router, supabase])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setError("Please enter a website URL")
      return
    }

    // Basic URL validation
    if (!url.match(/^(http|https):\/\/[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}(\/.*)?$/)) {
      setError("Please enter a valid URL (e.g., https://example.com)")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        throw new Error("User not authenticated")
      }

      // Save the website URL to the user_websites table
      await supabase.from("user_websites").upsert({
        user_id: userData.user.id,
        website_url: url,
        updated_at: new Date().toISOString(),
      })

      // Store the URL in localStorage as a backup
      localStorage.setItem("websiteUrl", url)

      // Redirect to the website analysis page
      router.push(`/onboarding/website-analysis?url=${encodeURIComponent(url)}`)
    } catch (err) {
      console.error("Error:", err)
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-24 h-24 border-t-4 border-[#294df6] rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-[#7733ee] rounded-full animate-spin-slow"></div>
        </div>
        <div className="mt-8 flex flex-col items-center">
          <Image
            src="/logoblack.png"
            alt="GetMoreSEO Logo"
            width={150}
            height={150}
            className="object-contain animate-pulse"
          />
          <p className="text-gray-600 mt-4 font-medium">Loading amazing content...</p>
        </div>
        <style jsx>{`
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col font-poppins bg-white">
      {/* Header - Matching the website-analysis page header */}
      <header className="p-4 sm:p-6 relative z-20 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <Image src="/logoblack.png" alt="Company Logo" width={120} height={40} className="h-10 w-auto" />
          </div>
          <Link href="/" className="text-[#294fd6] hover:text-[#1e3ca8] transition-colors font-medium">
            Back to Home
          </Link>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors shadow-sm hover:shadow"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
          {isLoggingOut && <Loader2 className="h-4 w-4 animate-spin ml-1" />}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-4">
              <div className="bg-amber-100 text-amber-800 rounded-full px-4 py-1 inline-flex items-center font-bold">
                Website Analysis Tool
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              <span className="text-gray-900">Enter your website URL</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-700 text-lg mb-10 max-w-3xl mx-auto">
              We'll analyze your website and provide personalized insights to help you improve your online presence.
            </p>

            {/* URL Input Form */}
            <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto">
              <div className="relative flex items-center group">
                <div className="absolute left-4 text-[#294df6] group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-5 w-5" />
                </div>

                <input
                  type="text"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-12 pr-16 py-4 text-lg rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#294df6] focus:border-transparent w-full shadow-sm transition-all duration-300 hover:shadow-md focus:shadow-md"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-1.5 bg-[#294df6] hover:bg-[#1e3ca8] text-white rounded-md h-11 w-11 flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow transform hover:scale-105 active:scale-95"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                </button>
              </div>

              {error && (
                <div className="mt-3 text-red-500 text-sm bg-red-50 p-2 rounded-md border border-red-100 animate-pulse">
                  {error}
                </div>
              )}

              <div className="mt-4 text-xs text-gray-500">Enter any website URL to get started with our analysis</div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Link
                href="#examples"
                className="flex items-center justify-center bg-white border border-gray-300 rounded-full py-3 px-6 text-gray-800 font-medium hover:shadow-md transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                View Sample Reports
              </Link>
              <Link
                href="/help"
                className="bg-[#294fd6] hover:bg-[#7733ee] text-white rounded-full py-3 px-6 font-medium transition-all flex items-center justify-center"
              >
                Need Help?
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
