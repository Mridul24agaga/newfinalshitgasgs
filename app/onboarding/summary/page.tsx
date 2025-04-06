"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Globe,
  ArrowLeft,
  Edit,
  RotateCcw,
  Check,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Zap,
  BarChart3,
  Search,
  Code,
} from "lucide-react"
import { createClient } from "@/utitls/supabase/server"

export default function SummaryPage() {
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [loadingStep, setLoadingStep] = useState(1)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccessfully, setSavedSuccessfully] = useState(false)
  const [error, setError] = useState("")
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" } | null>(null)
  const [supabase, setSupabase] = useState<any>(null)
  const [user, setUser] = useState<any>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const url = searchParams.get("url") || localStorage.getItem("websiteUrl") || ""

  // Define the custom blue color
  const blueColor = "#294fd6"

  // Initialize Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      try {
        const client = await createClient()
        setSupabase(client)

        // Get the current user
        const {
          data: { user },
        } = await client.auth.getUser()
        if (user) {
          setUser(user)
        }
      } catch (err) {
        console.error("Error getting user:", err)
      }
    }

    initSupabase()
  }, [])

  useEffect(() => {
    if (!url) {
      router.push("/onboarding")
      return
    }

    const fetchSummary = async () => {
      try {
        setIsLoading(true)
        setLoadingStep(1)
        console.log("Fetching summary for URL:", url)

        // Simulate step progression for better UX
        const stepInterval = setInterval(() => {
          setLoadingStep((current) => {
            if (current >= 4) {
              clearInterval(stepInterval)
              return current
            }
            return current + 1
          })
        }, 2500)

        // Call the API route directly
        const response = await fetch(`/api/generate-summary?url=${encodeURIComponent(url)}`)

        clearInterval(stepInterval)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(`API error: ${errorData.error || response.statusText}`)
        }

        const data = await response.json()
        console.log("Summary generated successfully")
        setSummary(data.summary)
        setLoadingStep(5) // Complete
      } catch (err) {
        console.error("Error generating summary:", err)
        setError("Failed to generate summary. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummary()
  }, [url, router])

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Function to handle anonymous save (without authentication)
  const handleAnonymousSave = async () => {
    setIsSaving(true)
    // Store the summary in localStorage
    try {
      localStorage.setItem("websiteSummary", summary)
      localStorage.setItem("websiteSummaryUrl", url)
      localStorage.setItem("websiteSummaryDate", new Date().toISOString())

      setSavedSuccessfully(true)
      showToast("Summary saved successfully!", "success")

      // Wait for toast to show before redirecting
      setTimeout(() => {
        router.push(`/generate-icp?url=${encodeURIComponent(url)}`)
      }, 1000)
    } catch (err) {
      console.error("Error saving summary locally:", err)
      showToast("Failed to save summary. Please try again.", "error")
      setIsSaving(false)
    }
  }

  // Enhanced loading steps with more detailed descriptions and better icons
  const loadingSteps = [
    {
      step: 1,
      text: "Accessing website content...",
      subtext: "Connecting to the server and retrieving page data",
      icon: Globe,
    },
    {
      step: 2,
      text: "Analyzing page structure...",
      subtext: "Examining HTML elements and content organization",
      icon: Code,
    },
    {
      step: 3,
      text: "Extracting key information...",
      subtext: "Identifying important content and business details",
      icon: Search,
    },
    {
      step: 4,
      text: "Generating professional summary...",
      subtext: "Creating a comprehensive analysis of your website",
      icon: BarChart3,
    },
    {
      step: 5,
      text: "Summary complete!",
      subtext: "Your website analysis is ready to review",
      icon: Sparkles,
    },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-4 sm:p-6 bg-white shadow-sm">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.push("/onboarding")}
            className="text-[#294fd6] hover:text-[#1a3ca8] flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to URL Input
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-4xl mx-auto animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 border border-gray-100 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#294fd6]/10 to-transparent rounded-bl-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#294fd6]/5 to-transparent rounded-tr-full -z-10"></div>

            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#294fd6]/20 rounded-full blur-md"></div>
                  <div className="relative bg-[#294fd6] text-white p-2 rounded-full">
                    <Globe size={24} />
                  </div>
                </div>
                Website Summary
              </h1>

              <div className="flex items-center gap-2">
                {!isLoading && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-[#294fd6] border border-[#294fd6]/30 rounded-md hover:bg-[#294fd6]/10 transition-colors text-sm font-medium flex items-center shadow-sm hover:shadow"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit
                  </button>
                )}

                {!isLoading && !isEditing && (
                  <button
                    onClick={() => {
                      // Regenerate functionality
                    }}
                    className="px-4 py-2 text-[#294fd6] border border-[#294fd6]/30 rounded-md hover:bg-[#294fd6]/10 transition-colors text-sm font-medium flex items-center shadow-sm hover:shadow"
                  >
                    <RotateCcw size={16} className="mr-2" />
                    Regenerate
                  </button>
                )}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center text-sm text-gray-600 mb-2 bg-gradient-to-r from-gray-50 to-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                <Globe size={18} className="mr-3 text-[#294fd6]" />
                <span className="font-medium mr-2">Website URL:</span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#294fd6] hover:underline truncate max-w-[300px] font-medium"
                >
                  {url}
                </a>
              </div>
            </div>

            {isLoading ? (
              <div className="py-16 flex flex-col items-center justify-center">
                {/* Enhanced loading animation */}
                <div className="relative w-48 h-48 mb-10">
                  {/* Outer glow */}
                  <div className="absolute inset-0 rounded-full bg-[#294fd6]/10 blur-xl animate-pulse"></div>

                  {/* Animated progress ring */}
                  <div className="absolute inset-0 rounded-full">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={blueColor}
                        strokeWidth="8"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (loadingStep / 5) * 283}
                        strokeLinecap="round"
                        className="transform -rotate-90 origin-center transition-all duration-1000 ease-out"
                      />
                    </svg>
                  </div>

                  {/* Spinning inner circle */}
                  <div className="absolute inset-4 rounded-full border-4 border-dashed border-[#294fd6]/30 animate-spin-slow"></div>

                  {/* Center content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-full w-28 h-28 flex flex-col items-center justify-center shadow-lg">
                      <div className="text-[#294fd6] font-bold text-3xl">
                        {Math.min(Math.round((loadingStep / 5) * 100), 99)}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">ANALYZING</div>
                    </div>
                  </div>

                  {/* Orbiting dots */}
                  <div className="absolute inset-0 animate-orbit">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#294fd6] rounded-full shadow-md shadow-[#294fd6]/30"></div>
                  </div>
                  <div className="absolute inset-0 animate-orbit animation-delay-1000">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#294fd6]/80 rounded-full shadow-md shadow-[#294fd6]/20"></div>
                  </div>
                  <div className="absolute inset-0 animate-orbit animation-delay-2000">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#294fd6]/60 rounded-full shadow-sm shadow-[#294fd6]/10"></div>
                  </div>
                </div>

                <div className="w-full max-w-lg">
                  <div className="relative pt-1 mb-8">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#294fd6] bg-[#294fd6]/10">
                          Analysis Progress
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-[#294fd6]">
                          Step {loadingStep} of 5
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-[#294fd6]/10">
                      <div
                        style={{ width: `${(loadingStep / 5) * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#294fd6] to-[#4361e1] transition-all duration-500 ease-in-out"
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {loadingSteps.map((step) => {
                      const StepIcon = step.icon
                      return (
                        <div
                          key={step.step}
                          className={`flex items-center ${
                            loadingStep >= step.step ? "text-gray-800" : "text-gray-400"
                          } transition-all duration-300 ease-in-out transform ${
                            loadingStep === step.step ? "scale-105" : "scale-100"
                          }`}
                        >
                          <div
                            className={`w-14 h-14 rounded-xl flex items-center justify-center mr-4 ${
                              loadingStep > step.step
                                ? "bg-[#294fd6]/10 text-[#294fd6] border border-[#294fd6]/30"
                                : loadingStep === step.step
                                  ? "bg-gradient-to-br from-[#294fd6] to-[#3b5bd9] text-white border border-[#294fd6] shadow-lg shadow-[#294fd6]/20"
                                  : "bg-gray-100 text-gray-400 border border-gray-200"
                            } transition-all duration-300`}
                          >
                            {loadingStep > step.step ? (
                              <Check size={24} />
                            ) : (
                              <StepIcon size={24} className={loadingStep === step.step ? "animate-pulse" : ""} />
                            )}
                          </div>
                          <div className="flex-1">
                            <span
                              className={`text-sm font-semibold ${loadingStep === step.step ? "text-[#294fd6]" : ""}`}
                            >
                              {step.text}
                            </span>
                            <div className="text-xs text-gray-500 mt-0.5">{step.subtext}</div>
                            {loadingStep === step.step && (
                              <div className="mt-2 h-1.5 w-full bg-[#294fd6]/10 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#294fd6] to-[#4361e1] rounded-full animate-pulse-width"></div>
                              </div>
                            )}
                          </div>
                          {loadingStep === step.step && (
                            <div className="ml-2 relative">
                              <div className="absolute inset-0 bg-[#294fd6]/20 rounded-full blur-md animate-pulse"></div>
                              <Loader2 size={24} className="text-[#294fd6] animate-spin relative" />
                            </div>
                          )}
                          {loadingStep > step.step && (
                            <div className="ml-2">
                              <div className="bg-green-100 p-1 rounded-full">
                                <CheckCircle size={20} className="text-green-500" />
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="py-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-md"></div>
                    <AlertCircle size={56} className="text-red-500 relative" />
                  </div>
                  <p className="text-red-600 mb-6 text-lg">{error}</p>
                  <button
                    onClick={() => router.push("/onboarding")}
                    className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium shadow-sm hover:shadow"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : isEditing ? (
              <div>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="min-h-[350px] w-full text-gray-700 p-5 border border-[#294fd6]/30 rounded-lg focus:border-[#294fd6] focus:ring-2 focus:ring-[#294fd6]/30 outline-none text-base shadow-inner"
                  placeholder="Edit the website summary..."
                ></textarea>

                <div className="flex justify-end mt-6 gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="px-5 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                    }}
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#294fd6] to-[#3b5bd9] hover:from-[#1a3ca8] hover:to-[#2a4ac8] text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium shadow-md hover:shadow-lg"
                  >
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-gradient-to-br from-[#294fd6]/5 to-[#294fd6]/10 rounded-lg p-6 border border-[#294fd6]/20 mb-8 relative overflow-hidden shadow-inner">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white to-transparent rounded-bl-full"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-white to-transparent rounded-tr-full"></div>

                  <div className="prose prose-blue max-w-none relative z-10">
                    {summary.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0 text-gray-700 text-base leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mt-10 flex justify-center">
                  <button
                    onClick={handleAnonymousSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-[#294fd6] to-[#3b5bd9] hover:from-[#1a3ca8] hover:to-[#2a4ac8] text-white px-10 py-4 text-lg rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-[#294fd6]/20 hover:shadow-xl hover:shadow-[#294fd6]/30 transform hover:translate-y-[-2px] active:translate-y-[0px] justify-center font-medium group"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={22} className="mr-3 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <div className="mr-3 relative">
                          <Zap size={22} className="group-hover:opacity-0 transition-opacity" />
                          <ArrowRight
                            size={22}
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                        Continue to ICP Generator
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Enhanced Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-xl ${
            toast.type === "success"
              ? "bg-gradient-to-r from-green-500 to-green-600"
              : "bg-gradient-to-r from-red-500 to-red-600"
          } text-white flex items-center animate-slideInRight`}
        >
          <div className="mr-3 bg-white/20 p-1.5 rounded-full">
            {toast.type === "success" ? <CheckCircle size={22} /> : <AlertCircle size={22} />}
          </div>
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes pulse-width {
          0%, 100% { width: 40%; }
          50% { width: 100%; }
        }
        
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out forwards;
        }
        
        .animate-pulse-width {
          animation: pulse-width 2s ease-in-out infinite;
        }
        
        .animate-orbit {
          animation: orbit 8s linear infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: -2.7s;
        }
        
        .animation-delay-2000 {
          animation-delay: -5.3s;
        }
      `}</style>
    </div>
  )
}

