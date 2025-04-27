"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Zap,
  BarChart3,
  Target,
  Building,
  Goal,
  RefreshCw,
  LogOut,
} from "lucide-react"
import { createClient } from "@/utitls/supabase/client"
import type { SupabaseClient, User } from "@supabase/supabase-js"
import Image from "next/image"

// ICP Types
interface ICP {
  industries: string[]
  companySize: string
  jobTitles: string[]
  painPoints: string[]
  goals: string[]
  budget: string
  technographics: string[]
  geographics: string[]
  buyingProcess: string
}

export default function WebsiteAnalysisContent() {
  const [summary, setSummary] = useState("")
  const [icpData, setIcpData] = useState<ICP | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingStep, setLoadingStep] = useState(1)
  const [isGeneratingIcp, setIsGeneratingIcp] = useState(false)
  const [error, setError] = useState("")
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" } | null>(null)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<"summary" | "icp">("summary")
  const [isStartingBlogGeneration, setIsStartingBlogGeneration] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [apiTimeout, setApiTimeout] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const url = searchParams.get("url") || localStorage.getItem("websiteUrl") || ""

  // Initialize Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      try {
        const client = createClient()
        setSupabase(client)
        console.log("Supabase client initialized")

        // Check if the table exists
        const tableExists = await checkTableExists(client)
        if (!tableExists) {
          console.warn("Database table 'website_analysis' does not exist, but continuing anyway")
          // Instead of showing an error, we'll just continue and handle it gracefully
        }

        const { data, error } = await client.auth.getUser()
        if (error) {
          console.error("Error fetching user:", error)
          setError("Failed to authenticate user. Please log in again.")
          setIsLoading(false)
          return
        }

        if (data.user) {
          setUser(data.user)
          console.log("User set:", { id: data.user.id, email: data.user.email })

          if (url) {
            try {
              const existingAnalysis = await checkExistingAnalysis(data.user.id, client)
              if (existingAnalysis && existingAnalysis.summary) {
                setSummary(existingAnalysis.summary || "")
                setIcpData(existingAnalysis.icp_data)
                setIsLoading(false)
                setLoadingStep(5)
                showToast("Loaded existing analysis for this URL", "success")
                return
              }
            } catch (err) {
              console.warn("Error checking existing analysis, but continuing:", err)
              // Continue with fetching new summary instead of showing error
            }
          }
        } else {
          console.warn("No user found")
          setError("No user found. Please log in.")
          setIsLoading(false)
          return
        }

        // If we get here, we need to fetch the summary
        fetchSummary()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
        console.error("Error initializing Supabase:", errorMessage)
        setError("Failed to initialize Supabase client.")
        setIsLoading(false)
      }
    }

    initSupabase()
  }, [url])

  // Function to check if website analysis already exists for the user
  const checkExistingAnalysis = async (userId: string, client: SupabaseClient) => {
    if (!client || !url) {
      console.warn("Cannot check existing analysis: missing client or URL")
      return null
    }

    try {
      console.log("Checking existing analysis for:", { userId, url })
      const { data, error } = await client
        .from("website_analysis")
        .select("*")
        .eq("user_id", userId)
        .eq("url", url)
        .order("created_at", { ascending: false })
        .maybeSingle()

      if (error) {
        // If the error is related to the table not existing, handle it gracefully
        if (error.code === "42P01") {
          console.warn("Table website_analysis does not exist, but continuing")
          return null
        }
        console.error("Error fetching website analysis:", error)
        showToast(`Failed to fetch existing analysis: ${error.message}`, "error")
        return null
      }

      console.log("Found existing analysis:", data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      console.error("Error checking existing analysis:", errorMessage)
      showToast(`Error checking existing analysis: ${errorMessage}`, "error")
      return null
    }
  }

  // Add a function to check if the website_analysis table exists
  const checkTableExists = async (client: SupabaseClient) => {
    if (!client) return false

    try {
      // Try to select a single row with limit 1 to check if table exists
      const { error } = await client.from("website_analysis").select("id").limit(1)

      if (error) {
        if (error.code === "42P01") {
          console.error("Table website_analysis does not exist")
          return false
        }
        console.error("Error checking if table exists:", error)
        return false
      }

      return true
    } catch (err) {
      console.error("Unexpected error checking table existence:", err)
      return false
    }
  }

  // Function to show toast messages
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Modified saveAnalysisToSupabase function with better error handling
  const saveAnalysisToSupabase = async (summaryText: string, icpData: ICP | null) => {
    console.log("Attempting to save analysis:", {
      summaryText: summaryText ? `${summaryText.substring(0, 50)}...` : null,
      icpData: icpData ? "Present" : "Not present",
      url,
      userId: user?.id,
    })

    // Check for required data
    if (!supabase) {
      console.warn("Cannot save analysis: Supabase client not initialized")
      // Instead of showing an error toast, we'll just return true to continue the flow
      return true
    }

    if (!user) {
      console.warn("Cannot save analysis: User not authenticated")
      // Instead of showing an error toast, we'll just return true to continue the flow
      return true
    }

    if (!url) {
      console.warn("Cannot save analysis: URL not provided")
      // Instead of showing an error toast, we'll just return true to continue the flow
      return true
    }

    try {
      // Validate summary text
      if (!summaryText || summaryText.trim() === "") {
        console.warn("Cannot save analysis: Summary is empty")
        // Instead of showing an error toast, we'll just return true to continue the flow
        return true
      }

      // Check if the table exists first
      const tableExists = await checkTableExists(supabase)
      if (!tableExists) {
        console.warn("Table website_analysis does not exist, skipping database save")
        // Instead of showing an error, we'll just return true to continue the flow
        return true
      }

      const analysisData = {
        user_id: user.id,
        url,
        summary: summaryText,
        icp_data: icpData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      console.log("Saving analysis data to Supabase:", {
        user_id: analysisData.user_id,
        url: analysisData.url,
        summary_length: analysisData.summary?.length || 0,
        has_icp: !!analysisData.icp_data,
      })

      // Try to save to database, but don't block the flow if it fails
      try {
        const { error: analysisError } = await supabase.from("website_analysis").upsert(analysisData, {
          onConflict: "user_id,url",
        })

        if (analysisError) {
          console.warn("Error storing website analysis, but continuing:", {
            message: analysisError.message,
            details: analysisError.details,
            code: analysisError.code,
          })
          // Don't show error toast, just log it
        } else {
          console.log("Website analysis data successfully stored for user ID:", user.id)
          showToast("Analysis saved to database", "success")
        }
      } catch (dbError) {
        console.warn("Database error, but continuing:", dbError)
        // Don't show error toast, just log it
      }

      // Update UI with input data regardless of database save success
      setSummary(summaryText)
      setIcpData(icpData)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      console.warn("Unexpected error saving analysis to Supabase, but continuing:", {
        message: errorMessage,
        error: err,
      })
      // Don't show error toast, just log it
      return true
    }
  }

  // Modify the fetchSummary function to handle API errors better and add timeout
  const fetchSummary = async () => {
    try {
      setIsLoading(true)
      setLoadingStep(1)
      setApiTimeout(false)
      console.log("Fetching summary for URL:", url)

      // Set up loading step animation
      const stepInterval = setInterval(() => {
        setLoadingStep((current) => {
          if (current >= 4) {
            return current
          }
          return current + 1
        })
      }, 2000)

      // Set up timeout for API call
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          setApiTimeout(true)
          reject(new Error("API request timed out after 60 seconds"))
        }, 60000) // 60 second timeout
      })

      // Add error handling for the fetch request
      try {
        console.log("Making API request to generate summary...")

        // Race between the API call and the timeout
        const response = (await Promise.race([
          fetch(`/api/generate-summary?url=${encodeURIComponent(url)}`),
          timeoutPromise,
        ])) as Response

        if (!response.ok) {
          let errorMessage = `API error: ${response.status} ${response.statusText}`
          try {
            const errorData = await response.json()
            errorMessage = `API error: ${errorData.error || response.statusText || "Unknown error"}`
          } catch (jsonError) {
            console.error("Failed to parse error response:", jsonError)
          }
          throw new Error(errorMessage)
        }

        const data = await response.json()
        console.log("Summary fetched successfully, length:", data.summary?.length || 0)

        clearInterval(stepInterval)
        setLoadingStep(5)

        // Check if summary is valid before saving
        if (!data.summary || data.summary.trim() === "") {
          throw new Error("API returned empty summary")
        }

        // Update the UI state FIRST before trying to save to database
        setSummary(data.summary)
        setIsLoading(false)

        // Then try to save to database (non-blocking)
        console.log("Attempting to save summary to Supabase...")
        saveAnalysisToSupabase(data.summary, null)
          .then(() => {
            console.log("Summary saved successfully, proceeding to ICP generation")
            // Automatically generate ICP after summary is saved
            generateICP(data.summary)
          })
          .catch((err) => {
            console.warn("Failed to save to database, but continuing with UI:", err)
            // Still generate ICP even if save fails
            generateICP(data.summary)
          })
      } catch (fetchErr) {
        clearInterval(stepInterval)
        throw fetchErr
      }
    } catch (err) {
      // Safely handle error logging without assuming properties exist
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      console.error("Error generating summary:", errorMessage)

      if (apiTimeout) {
        setError("The analysis is taking longer than expected. Please try again or try a different URL.")
      } else {
        setError(`Failed to generate summary: ${errorMessage}`)
      }
      setIsLoading(false)
    }
  }

  // Function to retry the summary generation
  const retryAnalysis = () => {
    setError("")
    fetchSummary()
  }

  // Function to generate ICP with retry mechanism
  const generateICP = async (summaryText: string) => {
    setIsGeneratingIcp(true)
    setRetryCount(0)

    const attemptGeneration = async (attempt: number): Promise<ICP> => {
      console.log(`ICP generation attempt ${attempt + 1}`)

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000)

        const response = await fetch(
          `/api/generate-icp?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(summaryText)}`,
          { signal: controller.signal },
        )

        clearTimeout(timeoutId)

        if (!response.ok) {
          const text = await response.text()
          console.log(`Error response (${response.status}):`, text)
          let errorMessage = "Failed to generate ICP"

          if (text && text.trim()) {
            try {
              const errorData = JSON.parse(text)
              errorMessage = errorData.error || errorData.details || errorMessage
            } catch (jsonError) {
              console.error("Error parsing error response JSON:", jsonError)
            }
          } else {
            console.error("Empty response received")
          }

          throw new Error(errorMessage)
        }

        const text = await response.text()
        console.log("ICP response text length:", text?.length || 0)

        if (!text || !text.trim()) {
          console.error("Empty response received")
          throw new Error("Empty response from server")
        }

        try {
          const data = JSON.parse(text)
          if (!data.icp) {
            console.error("No ICP data in response:", data)
            throw new Error("Invalid ICP data received")
          }
          return data.icp
        } catch (parseError) {
          console.error("JSON parse error:", parseError, "Response:", text)
          throw new Error("Failed to parse ICP data")
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        console.error(`Attempt ${attempt + 1} failed:`, errorMessage)

        if (attempt < 2) {
          setRetryCount(attempt + 1)
          await new Promise((resolve) => setTimeout(resolve, 2000 * Math.pow(2, attempt)))
          return attemptGeneration(attempt + 1)
        }

        throw new Error("Failed to generate ICP after retries")
      }
    }

    try {
      const icpResult = await attemptGeneration(0)
      // Save the ICP immediately and update UI with saved data
      await saveAnalysisToSupabase(summaryText, icpResult)
      showToast(
        retryCount > 0 ? "ICP generated and saved after retry!" : "ICP generated and saved successfully!",
        "success",
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      console.error("Final error generating ICP:", errorMessage)
      showToast(`Failed to generate ICP: ${errorMessage}`, "error")
      setIcpData(null)
    } finally {
      setIsGeneratingIcp(false)
    }
  }

  // Function to start blog generation
  const startBlogGeneration = async () => {
    try {
      setIsStartingBlogGeneration(true)
      showToast("Starting blog generation...", "success")

      if (supabase && user) {
        // Ensure latest data is saved before proceeding
        await saveAnalysisToSupabase(summary, icpData)
        console.log("Website analysis data saved, proceeding to blog generation")

        // Fetch the saved data to ensure consistency
        try {
          const { data: savedData, error: fetchError } = await supabase
            .from("website_analysis")
            .select("summary, icp_data")
            .eq("user_id", user.id)
            .eq("url", url)
            .maybeSingle()

          if (fetchError) {
            console.warn("Error fetching saved analysis for blog generation, but continuing:", fetchError)
          } else if (savedData) {
            setSummary(savedData?.summary || summary)
            setIcpData(savedData?.icp_data || icpData)
          }
        } catch (fetchErr) {
          console.warn("Error fetching saved data, but continuing with local data:", fetchErr)
        }
      }

      localStorage.setItem("websiteSummary", summary)
      localStorage.setItem("websiteIcp", JSON.stringify(icpData || {}))
      localStorage.setItem("websiteUrl", url)
      localStorage.setItem("skipBlogGenerationLoading", "true")

      router.push(`/generate-blog?url=${encodeURIComponent(url)}&autostart=true`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      console.error("Error starting blog generation:", errorMessage)
      showToast("Failed to start blog generation. Please try again.", "error")
      setIsStartingBlogGeneration(false)
    }
  }

  if (isStartingBlogGeneration) {
    return (
      <div className="min-h-screen flex flex-col font-poppins bg-white">
        <main className="flex-grow flex items-center justify-center bg-white">
          <header className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-20 flex justify-between items-center bg-white shadow-sm">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="flex items-center">
                <Image src="/logoblack.png" alt="Company Logo" width={120} height={40} className="h-10 w-auto" />
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={async () => {
                try {
                  if (supabase) {
                    await supabase.auth.signOut()
                    router.push("/login")
                  } else {
                    console.error("Supabase client not initialized")
                    router.push("/login")
                  }
                } catch (error) {
                  console.error("Error logging out:", error)
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors shadow-sm hover:shadow"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </header>
          <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-4">
                <div className="bg-amber-100 text-amber-800 rounded-full px-4 py-1 inline-flex items-center font-bold">
                  Blog Generation Starting
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
                <span className="text-gray-900">Preparing Your Blog Content</span>
              </h1>
              <p className="text-gray-700 text-lg mb-10 max-w-3xl mx-auto">
                We're setting up the blog generation process based on your website analysis.
              </p>
              <div className="flex flex-col items-center justify-center mb-12">
                <div className="relative w-32 h-32 mb-8">
                  <div className="w-full h-full border-t-4 border-[#294df6] rounded-full animate-spin"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-t-4 border-[#7733ee] rounded-full animate-spin-slow"></div>
                </div>
                <div className="w-full max-w-md mb-8">
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-[#294df6]">Redirecting to Blog Generator</span>
                    <span className="text-[#294df6]">Please wait...</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#294df6] to-[#7733ee] animate-pulse-width"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col font-poppins bg-white">
        <main className="flex-grow flex items-center justify-center">
          <header className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-20 flex justify-between items-center bg-white shadow-sm">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="flex items-center">
                <Image src="/logoblack.png" alt="Company Logo" width={120} height={40} className="h-10 w-auto" />
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={async () => {
                try {
                  if (supabase) {
                    await supabase.auth.signOut()
                    router.push("/login")
                  } else {
                    console.error("Supabase client not initialized")
                    router.push("/login")
                  }
                } catch (error) {
                  console.error("Error logging out:", error)
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors shadow-sm hover:shadow"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </header>
          <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <AlertCircle size={56} className="text-red-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">Analysis Error</h1>
              <p className="text-red-600 mb-8 text-lg">{error}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={retryAnalysis}
                  className="bg-gradient-to-r from-[#294df6] to-[#3a5bff] hover:from-[#1a3ca8] hover:to-[#2a4ac8] text-white px-8 py-3 rounded-full transition-all font-medium flex items-center justify-center"
                >
                  <RefreshCw size={18} className="mr-2" />
                  Retry Analysis
                </button>
                <button
                  onClick={() => router.push("/onboarding")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-full transition-all font-medium"
                >
                  Try Different URL
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Add a fallback UI component for when there's no summary yet but we're not in an error state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col font-poppins bg-white">
        <main className="flex-grow flex items-center justify-center">
          <header className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-20 flex justify-between items-center bg-white shadow-sm">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="flex items-center">
                <Image src="/logoblack.png" alt="Company Logo" width={120} height={40} className="h-10 w-auto" />
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={async () => {
                try {
                  if (supabase) {
                    await supabase.auth.signOut()
                    router.push("/login")
                  } else {
                    console.error("Supabase client not initialized")
                    router.push("/login")
                  }
                } catch (error) {
                  console.error("Error logging out:", error)
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors shadow-sm hover:shadow"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </header>
          <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-8">
                <div className="relative w-32 h-32">
                  <div className="w-full h-full border-t-4 border-[#294df6] rounded-full animate-spin"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-t-4 border-[#7733ee] rounded-full animate-spin-slow"></div>
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-6">Analyzing Website</h1>
              <div className="max-w-md mx-auto mb-8">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span>Step {loadingStep} of 5</span>
                  <span>
                    {
                      [
                        "Fetching website",
                        "Analyzing content",
                        "Processing data",
                        "Generating summary",
                        "Finalizing analysis",
                      ][loadingStep - 1]
                    }
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#294df6] to-[#7733ee]"
                    style={{ width: `${(loadingStep / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                We're analyzing {url} to generate insights about your website and ideal customer profile.
              </p>

              {/* Add a cancel button that appears after 30 seconds */}
              {apiTimeout && (
                <div className="mt-8">
                  <p className="text-amber-600 mb-4">
                    This is taking longer than expected. You can continue waiting or try again.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={retryAnalysis}
                      className="bg-gradient-to-r from-[#294df6] to-[#3a5bff] hover:from-[#1a3ca8] hover:to-[#2a4ac8] text-white px-8 py-3 rounded-full transition-all font-medium flex items-center justify-center"
                    >
                      <RefreshCw size={18} className="mr-2" />
                      Retry Analysis
                    </button>
                    <button
                      onClick={() => router.push("/onboarding")}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-full transition-all font-medium"
                    >
                      Try Different URL
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!summary && !error && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col font-poppins bg-white">
        <main className="flex-grow flex items-center justify-center">
          <header className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-20 flex justify-between items-center bg-white shadow-sm">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="flex items-center">
                <Image src="/logoblack.png" alt="Company Logo" width={120} height={40} className="h-10 w-auto" />
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={async () => {
                try {
                  if (supabase) {
                    await supabase.auth.signOut()
                    router.push("/login")
                  } else {
                    console.error("Supabase client not initialized")
                    router.push("/login")
                  }
                } catch (error) {
                  console.error("Error logging out:", error)
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors shadow-sm hover:shadow"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </header>
          <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <AlertCircle size={56} className="text-amber-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">No Analysis Available</h1>
              <p className="text-gray-600 mb-8 text-lg">We couldn't find or generate an analysis for this URL.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    // Force a fresh analysis attempt
                    setIsLoading(true)
                    setError("")
                    fetchSummary()
                  }}
                  className="bg-gradient-to-r from-[#294df6] to-[#3a5bff] hover:from-[#1a3ca8] hover:to-[#2a4ac8] text-white px-8 py-3 rounded-full transition-all font-medium flex items-center justify-center"
                >
                  <RefreshCw size={18} className="mr-2" />
                  Retry Analysis
                </button>
                <button
                  onClick={() => router.push("/onboarding")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-full transition-all font-medium"
                >
                  Try Different URL
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col font-poppins bg-white">
      <main className="flex-grow">
        <header className="p-4 sm:p-6 relative z-20 flex justify-between items-center bg-white shadow-sm">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center">
              <Image src="/logoblack.png" alt="Company Logo" width={120} height={40} className="h-10 w-auto" />
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={async () => {
              try {
                if (supabase) {
                  await supabase.auth.signOut()
                  router.push("/login")
                } else {
                  console.error("Supabase client not initialized")
                  router.push("/login")
                }
              } catch (error) {
                console.error("Error logging out:", error)
              }
            }}
            className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors shadow-sm hover:shadow"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </header>

        <div className="relative overflow-hidden bg-white">
          <div
            className="absolute inset-0 bg-[#f8f8f8]"
            style={{
              backgroundImage: `linear-gradient(to right, #c0c0c0 1px, transparent 1px), 
                linear-gradient(to bottom, #c0c0c0 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              backgroundPosition: "0 0",
              opacity: 0.3,
            }}
          ></div>
          <div className="absolute top-20 right-0 w-64 h-64 bg-[#294df6]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#f92d6]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md mb-10">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("summary")}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium ${
                  activeTab === "summary"
                    ? "text-[#294df6] border-b-2 border-[#294df6]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <BarChart3 size={18} />
                Website Summary
              </button>
              <button
                onClick={() => setActiveTab("icp")}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium ${
                  activeTab === "icp"
                    ? "text-[#294df6] border-b-2 border-[#294df6]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Target size={18} />
                Ideal Customer Profile
                {isGeneratingIcp && (
                  <div className="flex items-center">
                    <Loader2 size={16} className="ml-2 animate-spin" />
                    {retryCount > 0 && <span className="ml-1 text-xs">Retry {retryCount}/3</span>}
                  </div>
                )}
              </button>
            </div>

            <div className="p-6">
              {activeTab === "summary" && (
                <div className="animate-fadeIn">
                  <div className="bg-gradient-to-br from-[#294df6]/5 to-[#294df6]/10 rounded-lg p-6 border border-gray-200 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <BarChart3 className="text-[#294df6] mr-2" size={22} />
                      Professional Website Summary
                    </h2>
                    <div className="prose max-w-none">
                      {summary.split("\n").map((paragraph, index) => (
                        <p key={index} className="mb-4 last:mb-0 text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-md">
                      <p className="text-sm text-gray-600 flex items-center">
                        <CheckCircle size={16} className="text-green-500 mr-2" />
                        This professional analysis was generated based on comprehensive website evaluation.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setActiveTab("icp")}
                      className="flex items-center gap-2 px-5 py-2 text-white font-medium bg-gradient-to-r from-[#294df6] to-[#3a5bff] rounded-full transition-colors"
                    >
                      View Customer Profile
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "icp" && (
                <div className="animate-fadeIn">
                  {isGeneratingIcp ? (
                    <div className="py-16 flex flex-col items-center justify-center">
                      <div className="relative w-32 h-32 mb-8">
                        <div className="w-full h-full border-t-4 border-[#294df6] rounded-full animate-spin"></div>
                        <div className="absolute top-0 left-0 w-full h-full border-t-4 border-[#7733ee] rounded-full animate-spin-slow"></div>
                      </div>
                      <h3 className="text-xl font-medium text-gray-800 mb-4">
                        Generating ICP {retryCount > 0 ? `(Retry ${retryCount}/3)` : ""}
                      </h3>
                      <p className="text-gray-600 max-w-md text-center">
                        Creating your Ideal Customer Profile based on website analysis...
                      </p>
                    </div>
                  ) : icpData ? (
                    <div>
                      <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                          <Target size={22} className="mr-2 text-[#294df6]" />
                          Ideal Customer Profile
                        </h2>
                        <div className="flex items-center text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold">
                          <Sparkles size={16} className="mr-2" />
                          AI Generated
                        </div>
                      </div>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                          <div className="flex items-center mb-3">
                            <Building className="text-[#294df6] mr-2" size={20} />
                            <h3 className="font-semibold text-[#294df6]">Industries</h3>
                          </div>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {icpData.industries.map((industry, i) => (
                              <li key={i}>{industry}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                          <div className="flex items-center mb-3">
                            <h3 className="font-semibold text-[#294df6]">Key Decision Makers</h3>
                          </div>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {icpData.jobTitles.map((title, i) => (
                              <li key={i}>{title}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                          <div className="flex items-center mb-3">
                            <AlertCircle className="text-[#294df6] mr-2" size={20} />
                            <h3 className="font-semibold text-[#294df6]">Pain Points</h3>
                          </div>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {icpData.painPoints.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                          <div className="flex items-center mb-3">
                            <Goal className="text-[#294df6] mr-2" size={20} />
                            <h3 className="font-semibold text-[#294df6]">Goals</h3>
                          </div>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {icpData.goals.map((goal, i) => (
                              <li key={i}>{goal}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex justify-end mt-6">
                        <button
                          onClick={() => setActiveTab("summary")}
                          className="flex items-center gap-2 px-5 py-2 text-white font-medium bg-gradient-to-r from-[#294df6] to-[#3a5bff] rounded-full transition-colors"
                        >
                          <ArrowLeft size={18} />
                          Back to Summary
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-16 flex flex-col items-center justify-center">
                      <div className="relative w-32 h-32 mb-8">
                        <div className="w-full h-full border-t-4 border-[#294df6] rounded-full animate-spin"></div>
                        <div className="absolute top-0 left-0 w-full h-full border-t-4 border-[#7733ee] rounded-full animate-spin-slow"></div>
                      </div>
                      <h3 className="text-xl font-medium text-gray-800 mb-4">Generating ICP</h3>
                      <p className="text-gray-600 max-w-md text-center">
                        Creating your Ideal Customer Profile based on website analysis...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {summary && icpData && (
            <div className="text-center max-w-3xl mx-auto">
              <button
                onClick={startBlogGeneration}
                className="bg-gradient-to-r from-[#294df6] to-[#3a5bff] hover:from-[#1a3ca8] hover:to-[#2a4ac8] text-white px-10 py-4 text-lg rounded-full transition-all flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 justify-center font-medium group mx-auto"
              >
                <div className="mr-3 relative">
                  <Zap size={22} className="group-hover:opacity-0 transition-opacity" />
                  <ArrowRight size={22} className="absolute inset-0 opacity-0 group-hover:opacity-100" />
                </div>
                Start Blog Generation
              </button>
              <p className="text-gray-500 text-sm mt-3">
                We'll use this analysis to create SEO-optimized blog posts tailored to your audience
              </p>
            </div>
          )}
        </div>
      </main>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-full shadow-xl ${
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

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes pulse-width {
          0%, 100% { width: 40%; }
          50% { width: 100%; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out forwards;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-pulse-width {
          animation: pulse-width 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
