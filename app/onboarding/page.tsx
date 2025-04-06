"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { Globe, ArrowLeft, ArrowRight, HelpCircle, Loader2 } from "lucide-react"

export default function OnboardingPage() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
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

      // Update the onboarding status with the website URL
      await supabase.from("onboarding_status").upsert({
        user_id: userData.user.id,
        website_url: url,
        updated_at: new Date().toISOString(),
      })

      // Store the URL in localStorage as a backup
      localStorage.setItem("websiteUrl", url)

      // Redirect to the summary page
      router.push(`/onboarding/summary?url=${encodeURIComponent(url)}`)
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
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-[#294fd6] animate-spin" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-[#294fd6] opacity-20 animate-ping"></div>
        </div>
        <p className="mt-6 text-gray-600 font-medium">Preparing your experience...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(#e0e0e0_1px,transparent_1px),linear-gradient(to_right,#e0e0e0_1px,transparent_1px)] bg-[size:40px_40px] -z-10"></div>

      <header className="p-4 sm:p-6 relative z-10">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-4 py-2 text-[#294fd6] bg-[#f0f4ff] rounded-md hover:bg-[#e0e8ff] transition-colors shadow-sm hover:shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 relative z-10">
        <div className="w-full max-w-xl mx-auto text-center">
          <div className="inline-block mb-6 relative">
            <div className="absolute inset-0 bg-[#294fd6] blur-lg opacity-20 rounded-full transform scale-150"></div>
            <div className="relative bg-white p-3 rounded-full shadow-md">
              <div className="bg-[#f0f4ff] p-3 rounded-full">
                <Globe className="h-8 w-8 text-[#294fd6]" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Enter your{" "}
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-[#294fd6] opacity-10 rounded-lg transform skew-x-3"></span>
              <span className="relative bg-[#294fd6] text-white px-3 py-1 rounded-lg">domain URL</span>
            </span>
            ,
            <br />
            and we do the rest
          </h1>

          <p className="text-gray-600 max-w-md mx-auto mb-8">
            We'll analyze your website and provide personalized insights to help you improve your online presence.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 relative">
            <div className="relative flex items-center group">
              <div className="absolute left-4 text-[#294fd6] group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-5 w-5" />
              </div>

              <input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-12 pr-16 py-4 text-lg rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#294fd6] focus:border-transparent w-full shadow-sm transition-all duration-300 hover:shadow-md focus:shadow-md"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-1.5 bg-[#294fd6] hover:bg-[#1e3ca8] text-white rounded-md h-11 w-11 flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow transform hover:scale-105 active:scale-95"
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
        </div>
      </main>

      <footer className="p-6 text-center relative z-10">
        <button className="flex items-center justify-center gap-1 mx-auto text-gray-500 hover:text-[#294fd6] transition-colors bg-white/80 backdrop-blur-sm py-2 px-4 rounded-full shadow-sm hover:shadow">
          <HelpCircle className="w-4 h-4" />
          <span>Need help? Contact support</span>
        </button>
      </footer>

      {/* Custom styles for animations */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

