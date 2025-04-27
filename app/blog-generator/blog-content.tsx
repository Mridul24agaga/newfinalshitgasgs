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
  Info,
  HelpCircle,
  ArrowRight,
  X,
  CreditCard,
  Settings,
  Clock,
  AlertTriangle,
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
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [userCredits, setUserCredits] = useState(0)
  const [subscription, setSubscription] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [bulkQuantity, setBulkQuantity] = useState(1) // Number of blogs to generate at once
  const [loading, setLoading] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<ProgressTimerRef>(null)
  const stepRef = useRef<NodeJS.Timeout | null>(null)
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true)
  const [nextCreditAdditionDate, setNextCreditAdditionDate] = useState<string | null>(null)
  const [dailyGeneratedCount, setDailyGeneratedCount] = useState(0)
  const [nextGenerationTime, setNextGenerationTime] = useState<Date | null>(null)
  const [dailyLimitReached, setDailyLimitReached] = useState(false)
  const [showLowCreditsModal, setShowLowCreditsModal] = useState(false)

  // Credit threshold for showing the low credits popup
  const LOW_CREDITS_THRESHOLD = 5

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

  // Load daily generation data from localStorage
  useEffect(() => {
    const storedCount = localStorage.getItem("dailyGeneratedCount")
    const storedNextGenTime = localStorage.getItem("nextGenerationTime")

    if (storedCount) {
      setDailyGeneratedCount(Number.parseInt(storedCount))
    }

    if (storedNextGenTime) {
      const nextGenDate = new Date(storedNextGenTime)
      setNextGenerationTime(nextGenDate)

      // Check if we're still within the limit period
      const now = new Date()
      if (nextGenDate > now) {
        setDailyLimitReached(true)
      } else {
        // Reset if the time has passed
        setDailyGeneratedCount(0)
        setNextGenerationTime(null)
        setDailyLimitReached(false)
        localStorage.removeItem("dailyGeneratedCount")
        localStorage.removeItem("nextGenerationTime")
      }
    }
  }, [])

  // Check if credits are low and show popup if needed
  useEffect(() => {
    // Only show the popup if:
    // 1. Credits are below threshold
    // 2. User is not already on a loading state
    // 3. We have a subscription (meaning we've loaded user data)
    // 4. We haven't shown the popup recently (check localStorage)
    if (
      userCredits <= LOW_CREDITS_THRESHOLD &&
      !loading &&
      !externalLoading &&
      subscription &&
      !isLoadingSubscription
    ) {
      // Check if we've shown this popup recently
      const lastShownTime = localStorage.getItem("lowCreditsPopupLastShown")
      const now = new Date().getTime()

      // Only show once every 24 hours
      if (!lastShownTime || now - Number.parseInt(lastShownTime) > 24 * 60 * 60 * 1000) {
        setShowLowCreditsModal(true)
        // Record that we've shown the popup
        localStorage.setItem("lowCreditsPopupLastShown", now.toString())
      }
    }
  }, [userCredits, loading, externalLoading, subscription, isLoadingSubscription])

  // Add this function to update the daily generation count
  const updateDailyGenerationCount = () => {
    const newCount = dailyGeneratedCount + bulkQuantity
    setDailyGeneratedCount(newCount)
    localStorage.setItem("dailyGeneratedCount", newCount.toString())

    // If this generation will reach or exceed the daily limit, set next generation time
    if (newCount >= 2) {
      const nextGenTime = new Date()
      nextGenTime.setHours(nextGenTime.getHours() + 24) // 24 hours from now
      setNextGenerationTime(nextGenTime)
      setDailyLimitReached(true)
      localStorage.setItem("nextGenerationTime", nextGenTime.toISOString())
    }
  }

  // Add this function to format the next generation time
  const formatNextGenerationTime = () => {
    if (!nextGenerationTime) return ""

    const now = new Date()
    const diffMs = nextGenerationTime.getTime() - now.getTime()
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${diffHrs}h ${diffMins}m`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) {
      alert("Please enter a valid URL")
      return
    }

    // Check if user has enough credits
    if (userCredits < bulkQuantity) {
      alert(`You only have ${userCredits} credits available. Please reduce the quantity or purchase more credits.`)
      return
    }

    // Check if this generation would exceed daily limit
    if (dailyGeneratedCount + bulkQuantity > 2) {
      alert(`You can only generate 2 articles per day. You have already generated ${dailyGeneratedCount} today.`)
      return
    }

    setUrlEntered(true)
    setGenerationStarted(true)

    // Update daily generation count
    updateDailyGenerationCount()

    // If external onGenerate is provided, use it
    if (onGenerate) {
      onGenerate(url)
    } else {
      // Generate blogs based on quantity
      setLoading(true)
      try {
        // Generate blogs one by one
        for (let i = 0; i < bulkQuantity; i++) {
          await generateSingleBlog(url)
        }
      } catch (error) {
        console.error("Error generating blogs:", error)
        alert("Failed to generate blogs. Please try again.")
      } finally {
        setLoading(false)
      }
    }
  }

  const generateSingleBlog = async (blogUrl: string) => {
    setLoading(true)
    try {
      // Call the server action to generate the blog
      // The server action will handle credit deduction and storage
      const result = await generateBlog(blogUrl)

      if (result.error) {
        alert(`Error: ${result.error}`)
        return
      }

      // Update local state with the new credits from the server
      if (result.updatedCredits !== undefined) {
        setUserCredits(result.updatedCredits)
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
  }, [externalLoading, loading])

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

        // Check if the subscription is yearly
        const isYearlyPlan =
          subscriptionData.plan_name?.toLowerCase().includes("yearly") ||
          subscriptionData.interval === "year" ||
          subscriptionData.billing_cycle === "yearly"

        // For yearly plans, ensure they have the correct number of credits
        if (isYearlyPlan) {
          // Determine the plan type and set appropriate yearly credits
          const isGrowthPlan = subscriptionData.plan_name?.toLowerCase().includes("growth")
          const isProfessionalPlan = subscriptionData.plan_name?.toLowerCase().includes("professional")

          // Calculate total yearly credits
          let yearlyCredits = 0
          if (isGrowthPlan) {
            yearlyCredits = 30 * 12 // 360 credits for yearly growth plan
          } else if (isProfessionalPlan) {
            yearlyCredits = 60 * 12 // 720 credits for yearly professional plan
          }

          console.log(`Yearly plan detected: ${subscriptionData.plan_name}, should have ${yearlyCredits} credits`)

          // Only update credits if the current credits are significantly lower
          // This prevents resetting credits if the user has already been using them
          if (credits < yearlyCredits * 0.9) {
            // If they have less than 90% of expected yearly credits
            console.log(`Updating credits from ${credits} to ${yearlyCredits}`)

            // Update credits in the database
            try {
              await supabase
                .from("subscriptions")
                .update({
                  credits_available: yearlyCredits,
                  credits: yearlyCredits,
                  available_credits: yearlyCredits,
                })
                .eq("user_id", userData.user.id)

              // Update local state
              credits = yearlyCredits
            } catch (updateError) {
              console.error("Error updating yearly credits:", updateError)
            }
          }

          // Remove the next credit addition date since all credits are given upfront
          setNextCreditAdditionDate(null)
        } else {
          setNextCreditAdditionDate(null)
        }
      } else {
        console.log("No subscription found for user")
        setUserCredits(0)
        setNextCreditAdditionDate(null)
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

  // Add this useEffect after the other useEffect hooks
  useEffect(() => {
    const fetchSavedWebsite = async () => {
      try {
        const supabase = createClient()
        const { data: userData } = await supabase.auth.getUser()

        if (userData?.user) {
          // Try to get the website from the database
          const { data, error } = await supabase
            .from("user_websites")
            .select("website_url")
            .eq("user_id", userData.user.id)
            .single()

          if (data && data.website_url) {
            setUrl(data.website_url)
            setUrlEntered(true)
          } else if (error) {
            // Fallback to localStorage if database fetch fails
            const savedUrl = localStorage.getItem("websiteUrl")
            if (savedUrl) {
              setUrl(savedUrl)
              setUrlEntered(true)
            } else {
              // If no URL is found, redirect to onboarding
              alert("Please complete the onboarding process first to set your website URL.")
              window.location.href = "/onboarding"
            }
          }
        }
      } catch (error) {
        console.error("Error fetching saved website:", error)
      }
    }

    fetchSavedWebsite()
  }, [])

  // Add this useEffect hook after the other useEffect hooks, before the formatTime function
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    document.addEventListener("contextmenu", handleContextMenu)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [])

  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleBulkQuantityChange = (value: number) => {
    // Don't allow setting quantity that would exceed daily limit
    const maxAllowed = Math.min(
      Math.max(1, userCredits), // Max based on credits
      dailyLimitReached ? 0 : 2 - dailyGeneratedCount, // Max based on daily limit
    )

    setBulkQuantity(Math.min(value, maxAllowed))
  }

  // Handle upgrade button click
  const handleUpgradeClick = () => {
    window.location.href = "/account"
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-white">
      <AppSidebar />
      <div className="flex-1 w-full overflow-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Font import */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
        `}</style>

        {/* Header */}
        <header className="h-16 border-b border-gray-200 flex items-center px-4 sm:px-6 bg-white sticky top-0 z-10 w-full">
          <h1 className="text-xl font-semibold text-gray-800">Blog Generator</h1>
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 bg-blue-50 px-2 sm:px-3 py-1.5 rounded">
              <CreditCard className="w-4 h-4 text-[#294fd6]" />
              {isLoadingSubscription ? (
                <span className="text-xs sm:text-sm font-medium text-[#294fd6] flex items-center">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Loading...
                </span>
              ) : (
                <span className="text-xs sm:text-sm font-medium text-[#294fd6]">
                  {userCredits} Credit{userCredits !== 1 ? "s" : ""}
                  {subscription?.plan_name && ` • ${subscription.plan_name}`}
                  {nextCreditAdditionDate && (
                    <span className="block text-xs">Next credit addition: {nextCreditAdditionDate}</span>
                  )}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowHelpModal(true)}
              className="flex items-center gap-1 text-gray-500 hover:text-[#294fd6] transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">How it works</span>
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 w-full max-w-7xl mx-auto">
          {!isLoadingSubscription && userCredits === 0 && !subscription && (
            <div className="bg-white p-4 sm:p-8 border border-gray-200 shadow-sm mb-6 w-full">
              <div className="text-center">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-6 sm:w-8 h-6 sm:h-8 text-[#294fd6]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">No Active Subscription</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6">
                  You don't have any credits available. Upgrade to a subscription plan to start generating blogs.
                </p>
                <button
                  onClick={() => (window.location.href = "/pricing")}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-[#294fd6] text-white hover:bg-blue-700 transition-colors"
                >
                  View Subscription Plans
                </button>
              </div>
            </div>
          )}
          {!generationStarted ? (
            // Initial form view - improved responsive layout
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 w-full">
              {/* Left column - Form */}
              <div className="lg:col-span-2 w-full">
                <div className="bg-white p-4 sm:p-8 border border-gray-200 shadow-sm h-full w-full">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-50 flex items-center justify-center">
                      <FileText className="w-4 sm:w-5 h-4 sm:h-5 text-[#294fd6]" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Generate Your Blog</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 w-full">
                    {/* URL Input */}
                    <div className="w-full">
                      <label htmlFor="url" className="flex items-center gap-2 text-gray-700 font-medium mb-2 sm:mb-3">
                        <Globe className="w-4 h-4 text-[#294fd6]" />
                        Website URL{" "}
                        <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Locked</span>
                      </label>
                      <div className="relative w-full">
                        <input
                          type="url"
                          id="url"
                          value={url}
                          readOnly
                          className="w-full p-2 sm:p-3 pl-8 sm:pl-10 border border-gray-200 bg-gray-50 cursor-not-allowed focus:outline-none transition-all"
                          disabled={true}
                        />
                        <Globe className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                        <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2">
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Locked
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                        This URL was set during onboarding and cannot be changed
                      </p>
                    </div>

                    {/* Generation Settings */}
                    <div className="p-3 sm:p-5 border border-gray-200 bg-gray-50 w-full">
                      <div className="mb-3 sm:mb-4">
                        <h3 className="font-medium text-gray-800 flex items-center gap-2">
                          <Settings className="w-4 h-4 text-[#294fd6]" />
                          Generation Settings
                        </h3>
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                          Number of blogs to generate{" "}
                          {dailyLimitReached
                            ? "(Daily limit reached)"
                            : `(${2 - dailyGeneratedCount} of 2 remaining today)`}
                        </label>
                        <div className="flex items-center">
                          <input
                            type="range"
                            min="1"
                            max={Math.min(Math.max(1, userCredits), dailyLimitReached ? 1 : 2 - dailyGeneratedCount)}
                            value={bulkQuantity}
                            onChange={(e) => handleBulkQuantityChange(Number.parseInt(e.target.value))}
                            className={`flex-1 h-2 bg-gray-200 appearance-none ${dailyLimitReached ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                            disabled={dailyLimitReached}
                          />
                          <span className="ml-3 w-8 sm:w-10 text-center font-medium text-gray-700">{bulkQuantity}</span>
                        </div>
                        <p className="mt-1 sm:mt-2 text-xs text-gray-500">
                          {dailyLimitReached
                            ? `Daily limit reached. You can generate more in ${formatNextGenerationTime()}.`
                            : `This will generate ${bulkQuantity} blog${bulkQuantity > 1 ? "s" : ""} from the same URL, using ${bulkQuantity} credit${bulkQuantity > 1 ? "s" : ""}`}
                        </p>
                      </div>
                    </div>

                    {/* Credit Information */}
                    <div className="flex flex-col p-3 sm:p-4 bg-blue-50 border border-blue-100 w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 sm:w-5 h-4 sm:h-5 text-[#294fd6]" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">Available Credits</p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              You can generate up to {userCredits} blog{userCredits !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-[#294fd6]">{userCredits}</div>
                      </div>

                      {/* Daily limit indicator */}
                      <div className="mt-3 pt-3 border-t border-blue-100">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#294fd6]" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">Daily Generation Limit</p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {dailyLimitReached
                                ? `Limit reached. Reset in ${formatNextGenerationTime()}.`
                                : `${dailyGeneratedCount}/2 articles generated today`}
                            </p>
                          </div>
                        </div>
                      </div>

                      {subscription?.plan_name?.toLowerCase().includes("yearly") && (
                        <div className="mt-3 pt-3 border-t border-blue-100">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-[#294fd6]" />
                            <div>
                              <p className="text-sm font-medium text-gray-800">Yearly Plan Benefits</p>
                              <p className="text-xs sm:text-sm text-gray-600">
                                {subscription.plan_name.toLowerCase().includes("growth")
                                  ? "You received 360 credits (30 × 12 months) with your yearly Growth plan"
                                  : "You received 720 credits (60 × 12 months) with your yearly Professional plan"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className={`w-full py-3 sm:py-4 px-4 font-medium flex items-center justify-center gap-2 transition-all text-sm sm:text-base ${
                        loading || externalLoading || !url.trim() || userCredits < bulkQuantity || dailyLimitReached
                          ? "bg-gray-300 cursor-not-allowed text-gray-500"
                          : "bg-[#294fd6] hover:bg-blue-700 text-white"
                      }`}
                      disabled={
                        loading || externalLoading || !url.trim() || userCredits < bulkQuantity || dailyLimitReached
                      }
                    >
                      {loading || externalLoading ? (
                        <>
                          <div className="animate-spin w-4 sm:w-5 h-4 sm:h-5 border-2 border-white border-t-transparent"></div>
                          <span>Generating...</span>
                        </>
                      ) : dailyLimitReached ? (
                        <>
                          <Clock className="w-4 sm:w-5 h-4 sm:h-5" />
                          <span>Daily Limit Reached</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 sm:w-5 h-4 sm:h-5" />
                          <span>
                            Generate {bulkQuantity > 1 ? `${bulkQuantity} Blogs` : "Blog"} ({bulkQuantity} credit
                            {bulkQuantity > 1 ? "s" : ""})
                          </span>
                        </>
                      )}
                    </button>
                    {dailyLimitReached && (
                      <div className="text-red-500 text-sm mt-2 text-center">
                        Daily limit reached. Next article available in {formatNextGenerationTime()}.
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Right column - can be used for tips or preview */}
              <div className="hidden lg:block">
                <div className="bg-white p-6 border border-gray-200 shadow-sm h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-50 flex items-center justify-center">
                      <Info className="w-5 h-5 text-[#294fd6]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Tips for Better Results</h3>
                  </div>

                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Use URLs with rich, well-structured content for better blog generation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Generate multiple variations to get different perspectives on the same topic</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Edit and personalize the generated content to match your brand voice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Add custom images and media to enhance your blog posts</span>
                    </li>
                  </ul>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-100">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Pro Tip:</span> For best results, use URLs from content-rich
                      websites with clear topics and well-structured information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Generation in progress view
            <div className="w-full mx-auto">
              {/* Main content area with success message */}
              <div className="bg-white p-4 sm:p-8 border border-gray-200 shadow-sm mb-6 sm:mb-8 max-w-[1200px] mx-auto w-full">
                <div className="text-center py-6 sm:py-12">
                  <div className="w-16 sm:w-20 h-16 sm:h-20 bg-green-50 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <CheckCircle className="w-8 sm:w-10 h-8 sm:h-10 text-green-500" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-gray-800">
                    Blog Generation in Progress
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto mb-4 sm:mb-6">
                    Your blog{bulkQuantity > 1 ? "s are" : " is"} being generated and will be stored for viewing in your
                    content library.
                  </p>
                  <button
                    onClick={() => (window.location.href = "/content-library")}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-[#294fd6] text-white hover:bg-blue-700 transition-colors shadow-md inline-flex items-center gap-2"
                  >
                    <FileText className="w-4 sm:w-5 h-4 sm:h-5" />
                    <span>View Content Library</span>
                  </button>
                </div>
              </div>

              {/* Floating generation status panel */}
              <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-white border border-gray-200 p-4 sm:p-6 shadow-xl max-w-sm w-[calc(100%-2rem)] sm:w-full z-50">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-50 flex items-center justify-center">
                      <div className="w-2 sm:w-3 h-2 sm:h-3 bg-[#294fd6] animate-pulse"></div>
                    </div>
                    <h3 className="text-sm sm:font-semibold text-gray-800">Blog Generation</h3>
                  </div>
                  <span className="text-[#294fd6] text-xs sm:text-sm font-medium flex items-center gap-1 bg-blue-50 px-2 sm:px-3 py-1 border border-blue-100">
                    <Clock className="w-3 sm:w-4 h-3 sm:h-4" />
                    {formatTime(timeRemaining)}
                  </span>
                </div>

                <div className="mb-4 sm:mb-5">
                  <div className="w-full bg-gray-100 h-2 sm:h-3 overflow-hidden">
                    <div
                      className="bg-[#294fd6] h-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 sm:mt-2 text-xs text-gray-600">
                    <span>Progress: {Math.round(progress)}%</span>
                    <span>~{Math.ceil(timeRemaining / 60)} min remaining</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-blue-50 border border-blue-100">
                  <div className="flex-shrink-0 w-8 sm:w-10 h-8 sm:h-10 bg-[#294fd6] text-white flex items-center justify-center text-xs sm:text-sm font-medium">
                    {currentStep + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-gray-800 font-medium">{steps[currentStep].text}</p>
                    <div className="w-full bg-blue-200 h-1 sm:h-1.5 mt-1 sm:mt-2 overflow-hidden">
                      <div className="bg-[#294fd6] h-full w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                  <Loader2 className="w-5 sm:w-6 h-5 sm:h-6 text-[#294fd6] animate-spin" />
                </div>

                {bulkQuantity > 1 && (
                  <div className="mt-3 sm:mt-4 p-2 sm:p-3 border border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center mb-1 sm:mb-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Generation Progress</span>
                      <span className="text-xs text-gray-500">
                        Blog {Math.min(Math.ceil(progress / 20), bulkQuantity)} of {bulkQuantity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-1 sm:h-1.5 overflow-hidden">
                      <div
                        className="bg-green-500 h-full"
                        style={{
                          width: `${(Math.min(Math.ceil(progress / 20), bulkQuantity) / bulkQuantity) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <button
                  className="mt-3 sm:mt-4 text-xs sm:text-sm text-[#294fd6] hover:underline flex items-center gap-1 ml-auto font-medium"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* How it works modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">How to Use the Blog Generator</h2>
              <button onClick={() => setShowHelpModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-2 sm:mb-3">Getting Started</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Our AI-powered Blog Generator creates high-quality, engaging content based on any website URL you
                  provide. Follow these steps to generate your blog posts efficiently.
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {usageSteps.map((step, index) => (
                  <div key={index} className="flex gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-100 bg-gray-50">
                    <div className="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 bg-[#294fd6] text-white flex items-center justify-center font-bold text-xs sm:text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm sm:text-base text-gray-800 mb-1">{step.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 sm:pt-6">
                <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-2 sm:mb-3">
                  Multiple Blog Generation
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Need to create multiple blog posts? You can:
                </p>
                <ul className="space-y-2 text-sm sm:text-base text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Select the number of blogs to generate based on your available credits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Generate multiple blogs from the same URL in one go</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Save time by automating the content generation process</span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-4 sm:pt-6">
                <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-2 sm:mb-3">Credit System</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Our credit system is designed to be simple and transparent:
                </p>
                <ul className="space-y-2 text-sm sm:text-base text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Each blog generation uses 1 credit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>You can generate multiple blogs at once based on your available credits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Purchase more credits to increase your generation capacity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Daily limit of 2 articles per 24-hour period to ensure quality content</span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-4 sm:pt-6">
                <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-2 sm:mb-3">
                  Daily Generation Limit
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  To ensure high-quality content and prevent overuse:
                </p>
                <ul className="space-y-2 text-sm sm:text-base text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>You can generate up to 2 articles per day</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>The limit resets 24 hours after you reach your daily maximum</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>A countdown timer shows when you can generate more articles</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-3 sm:px-4 py-2 bg-[#294fd6] text-white hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Low Credits Modal */}
      {showLowCreditsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded-lg overflow-hidden">
            <div className="p-5 sm:p-6 bg-amber-50 border-b border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Low Credits Alert</h2>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-gray-700 mb-4">
                You only have{" "}
                <span className="font-bold text-amber-600">
                  {userCredits} credit{userCredits !== 1 ? "s" : ""}
                </span>{" "}
                remaining. To continue generating high-quality blog content, we recommend upgrading your plan.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Credits Remaining</span>
                  <span className="text-sm font-bold text-amber-600">
                    {userCredits}/{subscription?.credits || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full"
                    style={{ width: `${Math.min(100, (userCredits / (subscription?.credits || 1)) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleUpgradeClick}
                  className="flex-1 py-2.5 px-4 bg-[#294fd6] text-white rounded hover:bg-blue-700 transition-colors font-medium"
                >
                  Upgrade Plan
                </button>
                <button
                  onClick={() => setShowLowCreditsModal(false)}
                  className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-medium"
                >
                  Continue
                </button>
              </div>
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
