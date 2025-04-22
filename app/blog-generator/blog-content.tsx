"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  Globe,
  FileText,
  Search,
  BarChart,
  PenTool,
  CheckCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  Info,
  HelpCircle,
  ArrowRight,
  X,
  CreditCard,
  Settings,
  Clock,
} from "lucide-react"
import { AppSidebar } from "../components/sidebar"
import { createClient } from "@/utitls/supabase/client"
import { generateBlog } from "@/app/actions"

type ProgressTimerRef = NodeJS.Timeout | null

interface BlogGeneratorProps {
  onGenerate?: (url: string) => void
  loading?: boolean
}

interface UrlEntry {
  id: string
  url: string
  status: "pending" | "generating" | "completed" | "error"
  progress?: number
}

interface BlogGenerationResult {
  error?: string
  content?: string
  updatedCredits?: number
}

const BlogGenerator: React.FC<BlogGeneratorProps> = ({ onGenerate, loading: externalLoading }) => {
  const [url, setUrl] = useState("")
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes in seconds
  const [urlEntered, setUrlEntered] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [generationStarted, setGenerationStarted] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [bulkMode, setBulkMode] = useState(false)
  const [urlList, setUrlList] = useState<UrlEntry[]>([])
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [userCredits, setUserCredits] = useState(0)
  const [subscription, setSubscription] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [bulkQuantity, setBulkQuantity] = useState(1) // Number of blogs to generate at once
  const [loading, setLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<ProgressTimerRef>(null)
  const stepRef = useRef<NodeJS.Timeout | null>(null)
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true)

  const steps = [
    { icon: <Search className="w-4 h-4" />, text: "Extracting website content" },
    { icon: <BarChart className="w-4 h-4" />, text: "Analyzing key topics" },
    { icon: <FileText className="w-4 h-4" />, text: "Generating blog structure" },
    { icon: <PenTool className="w-4 h-4" />, text: "Writing content" },
    { icon: <CheckCircle className="w-4 h-4" />, text: "Finalizing blog post" },
  ]

  const usageSteps = [
    {
      title: "Enter Website URL",
      description: "Paste the URL of the website you want to create content about.",
    },
    {
      title: "Set Quantity",
      description: "Choose how many blogs to generate based on your available credits.",
    },
    {
      title: "Generate Content",
      description: "Click 'Generate Blog' and wait for the AI to create your content.",
    },
    {
      title: "Review and Edit",
      description: "Once generated, review the content and make any necessary edits.",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (bulkMode) {
      // Start the first pending URL in bulk mode
      const pendingUrl = urlList.find((item) => item.status === "pending")
      if (pendingUrl) {
        startGeneration(pendingUrl.id)
      } else {
        alert("Please add at least one URL to the bulk list")
      }
    } else {
      if (!url.trim()) {
        alert("Please enter a valid URL")
        return
      }
      setUrlEntered(true)
      setGenerationStarted(true)

      // If external onGenerate is provided, use it
      if (onGenerate) {
        onGenerate(url)
      } else {
        // Otherwise use the server action directly
        await generateSingleBlog(url)
      }
    }
  }

  const generateSingleBlog = async (blogUrl: string) => {
    setLoading(true)
    try {
      // Call the server action to generate the blog
      // The server action will handle credit deduction
      const result = await generateBlog(blogUrl)

      if (result.error) {
        alert(`Error: ${result.error}`)
        return
      }

      // Update local state with the new credits from the server
      if (result.updatedCredits !== undefined) {
        setUserCredits(result.updatedCredits)
      }

      // Set the generated content
      if (result.content) {
        setGeneratedContent(result.content)
      }

      // Refresh subscription data to get updated credits
      fetchUserAndSubscription()
    } catch (error) {
      console.error("Error generating blog:", error)
      alert("Failed to generate blog. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const addUrlToBulkList = () => {
    if (!url.trim()) {
      alert("Please enter a valid URL")
      return
    }

    // Check if adding this URL would exceed available credits
    if (urlList.length >= userCredits) {
      alert(`You only have ${userCredits} credits available. Cannot add more URLs.`)
      return
    }

    const newEntry: UrlEntry = {
      id: Date.now().toString(),
      url: url.trim(),
      status: "pending",
    }

    setUrlList((prev) => [...prev, newEntry])
    setUrl("")
  }

  const removeUrlFromList = (id: string) => {
    setUrlList((prev) => prev.filter((item) => item.id !== id))
  }

  // Start generation for a specific URL in the list
  const startGeneration = async (id: string) => {
    // Check if user has enough credits
    if (userCredits <= 0) {
      alert("You don't have enough credits to generate blogs. Please purchase more credits.")
      return
    }

    // Update UI state
    setUrlList((prev) => prev.map((item) => (item.id === id ? { ...item, status: "generating", progress: 0 } : item)))

    // Get the URL from the list
    const urlItem = urlList.find((item) => item.id === id)
    if (urlItem) {
      setGenerationStarted(true)

      try {
        // Call the server action to generate the blog
        const result = await generateBlog(urlItem.url)

        if (result.error) {
          // Handle error
          setUrlList((prev) => prev.map((item) => (item.id === id ? { ...item, status: "error" } : item)))
          console.error("Error generating blog:", result.error)
          return
        }

        // Update local state with the new credits from the server
        if (result.updatedCredits !== undefined) {
          setUserCredits(result.updatedCredits)
        }

        // Set the generated content if this is the active blog
        if (result.content) {
          setGeneratedContent(result.content)
        }

        // Mark this URL as completed
        setUrlList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: "completed", progress: 100 } : item)),
        )

        // Check if there are more pending URLs to process
        const nextPending = urlList.find((item) => item.status === "pending")
        if (nextPending) {
          // Start the next one after a short delay
          setTimeout(() => startGeneration(nextPending.id), 1000)
        }
      } catch (error) {
        console.error("Error in startGeneration:", error)
        // Mark as error in the UI
        setUrlList((prev) => prev.map((item) => (item.id === id ? { ...item, status: "error" } : item)))
      }
    }
  }

  // Generate multiple blogs at once
  const generateBulkBlogs = () => {
    if (!url.trim()) {
      alert("Please enter a valid URL")
      return
    }

    // Check if user has enough credits
    if (userCredits < bulkQuantity) {
      alert(`You only have ${userCredits} credits available. Please reduce the quantity or purchase more credits.`)
      return
    }

    // Create multiple entries for the same URL
    const newEntries: UrlEntry[] = []
    for (let i = 0; i < bulkQuantity; i++) {
      newEntries.push({
        id: `${Date.now()}-${i}`,
        url: url.trim(),
        status: "pending",
      })
    }

    setUrlList(newEntries)
    setBulkMode(true)

    // Start the first one
    if (newEntries.length > 0) {
      startGeneration(newEntries[0].id)
    }
  }

  // Update urlEntered state when URL changes
  useEffect(() => {
    setUrlEntered(url.trim() !== "")
  }, [url])

  // Handle progress and timer during loading
  useEffect(() => {
    // Use either external loading state or internal
    const isLoading = externalLoading !== undefined ? externalLoading : loading

    // Clear any existing intervals when loading state changes
    if (timerRef.current) clearInterval(timerRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
    if (stepRef.current) clearInterval(stepRef.current)

    if (isLoading) {
      // Reset states when loading starts
      setProgress(0)
      setTimeRemaining(300)
      setCurrentStep(0)

      // Update progress every 3 seconds
      progressRef.current = setInterval(() => {
        setProgress((prev) => {
          const newProgress = Math.min(prev + 1, 100)
          return newProgress
        })
      }, 3000) as unknown as ProgressTimerRef

      // Update timer every second
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev <= 0 ? 0 : prev - 1
          return newTime
        })
      }, 1000) as unknown as ProgressTimerRef

      // Update current step based on progress
      stepRef.current = setInterval(() => {
        setProgress((currentProgress) => {
          if (currentProgress < 20) setCurrentStep(0)
          else if (currentProgress < 40) setCurrentStep(1)
          else if (currentProgress < 60) setCurrentStep(2)
          else if (currentProgress < 80) setCurrentStep(3)
          else setCurrentStep(4)
          return currentProgress
        })
      }, 5000) as unknown as ProgressTimerRef
    }

    // Cleanup function
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
      if (stepRef.current) clearInterval(stepRef.current)
    }
  }, [externalLoading, loading]) // Depend on both loading states

  // Handle iframe loading and errors
  const handleIframeLoad = () => {
    setIframeLoaded(true)
    setIframeError(false)
  }

  const handleIframeError = () => {
    setIframeLoaded(false)
    setIframeError(true)
  }

  const reloadIframe = () => {
    setIframeLoaded(false)
    setIframeError(false)
    if (iframeRef.current) {
      const src = iframeRef.current.src
      iframeRef.current.src = ""
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = src
        }
      }, 100)
    }
  }

  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Fetch user subscription data and credits
  const fetchUserAndSubscription = async () => {
    setIsLoadingSubscription(true)
    try {
      // Get the current user
      const supabase = createClient()
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError || !userData.user) {
        console.error("Error fetching user:", userError)
        setIsLoadingSubscription(false)
        return
      }

      setUser(userData.user)

      // Try different approaches to get subscription data
      let { data: subscriptionData, error: subscriptionError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userData.user.id)
        .single()

      // If that fails, try a direct query without filtering
      if (subscriptionError && subscriptionError.code !== "PGRST116") {
        console.log("First query failed, trying alternative approach")
        const { data: allSubscriptions, error: allSubsError } = await supabase.from("subscriptions").select("*")

        if (!allSubsError && allSubscriptions && allSubscriptions.length > 0) {
          // Find the subscription for this user
          subscriptionData = allSubscriptions.find((sub) => sub.user_id === userData.user.id)
          subscriptionError = null
        }
      }

      if (subscriptionError && subscriptionError.code !== "PGRST116") {
        console.error("Error fetching subscription:", subscriptionError)
        setIsLoadingSubscription(false)
        return
      }

      if (subscriptionData) {
        console.log("Subscription data found:", subscriptionData)

        // Store the full subscription object
        setSubscription(subscriptionData)

        // Try multiple possible field names for credits
        let credits = 0
        if (typeof subscriptionData.credits_available !== "undefined") {
          credits = Number(subscriptionData.credits_available)
        } else if (typeof subscriptionData.credits !== "undefined") {
          credits = Number(subscriptionData.credits)
        } else if (typeof subscriptionData.available_credits !== "undefined") {
          credits = Number(subscriptionData.available_credits)
        }

        // Ensure it's a valid number
        credits = isNaN(credits) ? 0 : credits

        console.log("Setting credits to:", credits)
        setUserCredits(credits)
      } else {
        console.log("No subscription found for user")
        setUserCredits(0)
      }
    } catch (error) {
      console.error("Error in fetchUserAndSubscription:", error)
    } finally {
      setIsLoadingSubscription(false)
    }
  }

  // Fetch user and subscription data on component mount
  useEffect(() => {
    fetchUserAndSubscription()
  }, [])

  return (
    <div className="flex min-h-screen bg-white">
      <AppSidebar />
      <div className="flex-1 overflow-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Font import */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
        `}</style>

        {/* Header */}
        <header className="h-16 border-b border-gray-200 flex items-center px-6 bg-white sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-800">Blog Generator</h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
              <CreditCard className="w-4 h-4 text-[#294fd6]" />
              {isLoadingSubscription ? (
                <span className="text-sm font-medium text-[#294fd6] flex items-center">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Loading...
                </span>
              ) : (
                <span className="text-sm font-medium text-[#294fd6]">
                  {userCredits} Credit{userCredits !== 1 ? "s" : ""}
                  {subscription?.plan_name && ` • ${subscription.plan_name}`}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowHelpModal(true)}
              className="flex items-center gap-1 text-gray-500 hover:text-[#294fd6] transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              <span className="text-sm font-medium">How it works</span>
            </button>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto">
          {!isLoadingSubscription && userCredits === 0 && !subscription && (
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-[#294fd6]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Subscription</h3>
                <p className="text-gray-600 mb-6">
                  You don't have any credits available. Upgrade to a subscription plan to start generating blogs.
                </p>
                <button
                  onClick={() => (window.location.href = "/pricing")}
                  className="px-6 py-3 bg-[#294fd6] text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Subscription Plans
                </button>
              </div>
            </div>
          )}
          {!generationStarted ? (
            // Initial form view - improved rectangular layout
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column - Form */}
              <div className="lg:col-span-2">
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#294fd6]" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Generate Your Blog</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* URL Input */}
                    <div>
                      <label htmlFor="url" className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                        <Globe className="w-4 h-4 text-[#294fd6]" />
                        Website URL
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          id="url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://example.com"
                          className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294fd6] focus:border-transparent transition-all"
                          disabled={loading || externalLoading}
                        />
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                        {bulkMode && (
                          <button
                            type="button"
                            onClick={addUrlToBulkList}
                            disabled={!url.trim() || loading || externalLoading || urlList.length >= userCredits}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-[#294fd6] text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Enter the URL of the website you want to generate a blog from
                      </p>
                    </div>

                    {/* Bulk Generation Settings */}
                    <div className="p-5 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-800 flex items-center gap-2">
                          <Settings className="w-4 h-4 text-[#294fd6]" />
                          Generation Settings
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Bulk Mode</span>
                          <button
                            type="button"
                            onClick={() => setBulkMode(!bulkMode)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#294fd6] focus:ring-offset-2 ${
                              bulkMode ? "bg-[#294fd6]" : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                bulkMode ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {bulkMode ? (
                        // Bulk mode - URL list
                        <div>
                          <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                              URLs to process ({urlList.length}/{userCredits} credits)
                            </label>
                            {urlList.length > 0 ? (
                              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                                {urlList.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between px-4 py-3 border-b border-gray-200 last:border-0"
                                  >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <div
                                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                          item.status === "pending"
                                            ? "bg-gray-400"
                                            : item.status === "generating"
                                              ? "bg-blue-500 animate-pulse"
                                              : item.status === "completed"
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                        }`}
                                      />
                                      <span className="text-sm text-gray-700 truncate">{item.url}</span>
                                    </div>

                                    {item.status === "generating" && item.progress !== undefined && (
                                      <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden mr-2">
                                        <div
                                          className="h-full bg-blue-500 rounded-full"
                                          style={{ width: `${item.progress}%` }}
                                        />
                                      </div>
                                    )}

                                    {item.status === "pending" && (
                                      <button
                                        type="button"
                                        onClick={() => removeUrlFromList(item.id)}
                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}

                                    {item.status === "completed" && (
                                      <span className="text-xs text-green-600 font-medium">Completed</span>
                                    )}

                                    {item.status === "error" && (
                                      <span className="text-xs text-red-600 font-medium">Failed</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                                <p className="text-sm text-gray-500">Add URLs to the list using the input above</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        // Single mode - Quantity selector
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Number of blogs to generate (1-{userCredits} credits available)
                          </label>
                          <div className="flex items-center">
                            <input
                              type="range"
                              min="1"
                              max={Math.max(1, userCredits)}
                              value={bulkQuantity}
                              onChange={(e) => setBulkQuantity(Number.parseInt(e.target.value))}
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="ml-3 w-10 text-center font-medium text-gray-700">{bulkQuantity}</span>
                          </div>
                          <p className="mt-2 text-xs text-gray-500">
                            This will generate {bulkQuantity} blog{bulkQuantity > 1 ? "s" : ""} from the same URL, using{" "}
                            {bulkQuantity} credit{bulkQuantity > 1 ? "s" : ""}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Credit Information */}
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#294fd6]" />
                        <div>
                          <p className="font-medium text-gray-800">Available Credits</p>
                          <p className="text-sm text-gray-600">
                            You can generate up to {userCredits} blog{userCredits !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-[#294fd6]">{userCredits}</div>
                    </div>

                    {/* Submit Button */}
                    {bulkMode ? (
                      <button
                        type="submit"
                        className={`w-full py-4 px-4 font-medium rounded-lg flex items-center justify-center gap-2 transition-all text-base ${
                          loading || externalLoading || urlList.length === 0
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-[#294fd6] hover:bg-blue-700 text-white"
                        }`}
                        disabled={loading || externalLoading || urlList.length === 0}
                      >
                        {loading || externalLoading ? (
                          <>
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-5 h-5" />
                            <span>Start Bulk Generation ({urlList.length} URLs)</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={generateBulkBlogs}
                        className={`w-full py-4 px-4 font-medium rounded-lg flex items-center justify-center gap-2 transition-all text-base ${
                          loading || externalLoading || !url.trim() || userCredits < bulkQuantity
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-[#294fd6] hover:bg-blue-700 text-white"
                        }`}
                        disabled={loading || externalLoading || !url.trim() || userCredits < bulkQuantity}
                      >
                        {loading || externalLoading ? (
                          <>
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-5 h-5" />
                            <span>
                              Generate {bulkQuantity > 1 ? `${bulkQuantity} Blogs` : "Blog"} ({bulkQuantity} credit
                              {bulkQuantity > 1 ? "s" : ""})
                            </span>
                          </>
                        )}
                      </button>
                    )}
                  </form>
                </div>
              </div>

              {/* Right column - How to use */}
              <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <Info className="w-5 h-5 text-[#294fd6]" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">How to Use</h2>
                  </div>

                  <div className="space-y-6">
                    {usageSteps.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-[#294fd6] flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800 mb-1">{step.title}</h3>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Credit system tip */}
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-[#294fd6] flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4" />
                      Credit System
                    </h3>
                    <p className="text-sm text-gray-700">
                      Each blog generation uses 1 credit. You can generate multiple blogs at once based on your
                      available credits. Add more credits to increase your generation capacity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Generation in progress view - improved layout
            <div className="w-full mx-auto">
              {/* Main content area with Notion embed */}
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8 max-w-[1200px] mx-auto">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Generated Blog Preview</h2>
                {/* Improved iframe implementation with better loading state */}
                <div className="relative w-full h-[650px] border border-gray-200 rounded-lg overflow-hidden shadow-md">
                  {!iframeLoaded && !iframeError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
                      <div className="relative w-16 h-16 mb-6">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-t-[#294fd6] animate-spin"></div>
                      </div>
                      <p className="text-gray-700 font-medium">Loading content...</p>
                      <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
                    </div>
                  )}

                  {iframeError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
                      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-50 mb-6">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                      </div>
                      <p className="text-gray-800 font-medium text-lg mb-2">Failed to load content</p>
                      <p className="text-gray-600 text-sm mb-6 max-w-md text-center">
                        The Notion embed couldn't be loaded. This might be due to connection issues or content
                        restrictions.
                      </p>
                      <button
                        onClick={reloadIframe}
                        className="flex items-center gap-2 px-6 py-3 bg-[#294fd6] text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Try Again</span>
                      </button>
                    </div>
                  )}

                  {generatedContent ? (
                    <div className="h-full overflow-auto p-6">
                      <div dangerouslySetInnerHTML={{ __html: generatedContent }} />
                    </div>
                  ) : (
                    <iframe
                      ref={iframeRef}
                      src="https://v2-embednotion.com/18ac8ab792fa8047ab4bda7b6e3474e4"
                      style={{ width: "100%", height: "100%", border: "none" }}
                      onLoad={handleIframeLoad}
                      onError={handleIframeError}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
              </div>

              {/* Floating generation status panel - improved design */}
              <div className="fixed bottom-6 right-6 bg-white rounded-lg border border-gray-200 p-6 shadow-xl max-w-sm w-full z-50">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <div className="w-3 h-3 bg-[#294fd6] rounded-full animate-pulse"></div>
                    </div>
                    <h3 className="font-semibold text-gray-800">Blog Generation</h3>
                  </div>
                  <span className="text-[#294fd6] font-medium flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    <Clock className="w-4 h-4" />
                    {formatTime(timeRemaining)}
                  </span>
                </div>

                <div className="mb-5">
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-[#294fd6] h-full rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-600">
                    <span>Progress: {Math.round(progress)}%</span>
                    <span>~{Math.ceil(timeRemaining / 60)} min remaining</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#294fd6] text-white flex items-center justify-center text-sm font-medium">
                    {currentStep + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{steps[currentStep].text}</p>
                    <div className="w-full bg-blue-200 h-1.5 mt-2 rounded-full overflow-hidden">
                      <div className="bg-[#294fd6] h-full rounded-full w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                  <Loader2 className="w-6 h-6 text-[#294fd6] animate-spin" />
                </div>

                {bulkMode && (
                  <div className="mt-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Bulk Progress</span>
                      <span className="text-xs text-gray-500">
                        {urlList.filter((item) => item.status === "completed").length}/{urlList.length} completed
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500 h-full rounded-full"
                        style={{
                          width: `${(urlList.filter((item) => item.status === "completed").length / urlList.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <button
                  className="mt-4 text-sm text-[#294fd6] hover:underline flex items-center gap-1 ml-auto font-medium"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* How it works modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">How to Use the Blog Generator</h2>
              <button onClick={() => setShowHelpModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-3">Getting Started</h3>
                <p className="text-gray-600">
                  Our AI-powered Blog Generator creates high-quality, engaging content based on any website URL you
                  provide. Follow these steps to generate your blog posts efficiently.
                </p>
              </div>

              <div className="space-y-4">
                {usageSteps.map((step, index) => (
                  <div key={index} className="flex gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#294fd6] text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-lg text-gray-800 mb-3">Bulk Generation</h3>
                <p className="text-gray-600 mb-4">
                  Need to create multiple blog posts? Our bulk generation feature allows you to:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Generate multiple blogs at once based on your available credits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Monitor progress for each blog in the queue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Save time by automating the entire content generation process</span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-lg text-gray-800 mb-3">Credit System</h3>
                <p className="text-gray-600 mb-4">Our credit system is designed to be simple and transparent:</p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Each blog generation uses 1 credit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>You can generate multiple blogs at once based on your available credits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Purchase more credits to increase your generation capacity</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-[#294fd6] text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogGenerator

// This tells TypeScript what the generateBlog function returns
declare module "@/app/actions" {
  export function generateBlog(url: string): Promise<BlogGenerationResult>
}
