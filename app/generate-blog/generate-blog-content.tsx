"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Clock,
  FileText,
  Search,
  BarChart,
  PenTool,
  CheckCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  Globe,
  X,
  Sparkles,
  BookOpen,
  Zap,
  Share2,
  CreditCard,
} from "lucide-react"
import { createClient } from "@/utitls/supabase/client"

// Simple direct import
import PaymentPage from "@/app/components/payment-page"

interface BlogGeneratorProps {
  onGenerate: (url: string, humanizeLevel: "normal" | "hardcore") => Promise<any>
  loading: boolean
  subscriptionError?: boolean
  hasActiveSubscription?: boolean
}

const BlogGenerator: React.FC<BlogGeneratorProps> = ({
  onGenerate,
  loading,
  subscriptionError = false,
  hasActiveSubscription = false,
}) => {
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [humanizeLevel, setHumanizeLevel] = useState<"normal" | "hardcore">("normal")
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes in seconds
  const [urlEntered, setUrlEntered] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [generationStarted, setGenerationStarted] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [showSubscriptionError, setShowSubscriptionError] = useState(false)
  const [showPaymentPage, setShowPaymentPage] = useState(false)
  const [setupSubscriptionError, setSetupSubscriptionError] = useState(false)
  const [freeGenerationUsed, setFreeGenerationUsed] = useState(false)
  const [blogGenerated, setBlogGenerated] = useState(false)
  const [generatedBlogId, setGeneratedBlogId] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  const stepRef = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()

  // Check if free generation was used before (from localStorage)
  useEffect(() => {
    // Only check for free generation if user doesn't have an active subscription
    if (!hasActiveSubscription) {
      const usedFreeGeneration = localStorage.getItem("freeGenerationUsed") === "true"
      setFreeGenerationUsed(usedFreeGeneration)
    } else {
      // If user has an active subscription, they can always generate blogs
      setFreeGenerationUsed(false)
    }
  }, [hasActiveSubscription])

  // Handle subscription error from parent component
  useEffect(() => {
    // Only show subscription error if user doesn't have an active subscription
    if (subscriptionError && !hasActiveSubscription) {
      setSetupSubscriptionError(true)
    }
  }, [subscriptionError, hasActiveSubscription])

  // Save to localStorage when a blog is successfully generated
  useEffect(() => {
    if (blogGenerated && !hasActiveSubscription) {
      localStorage.setItem("freeGenerationUsed", "true")
      setFreeGenerationUsed(true)
    }
  }, [blogGenerated, hasActiveSubscription])

  // Redirect to generated blog page when blog is generated and ID is available
  useEffect(() => {
    if (blogGenerated && generatedBlogId) {
      router.push(`/generated/${generatedBlogId}`)
    }
  }, [blogGenerated, generatedBlogId, router])

  const steps = [
    { icon: <Search className="w-4 h-4" />, text: "Extracting website content" },
    { icon: <BarChart className="w-4 h-4" />, text: "Analyzing key topics" },
    { icon: <FileText className="w-4 h-4" />, text: "Generating blog structure" },
    { icon: <PenTool className="w-4 h-4" />, text: "Writing content with humanization" },
    { icon: <CheckCircle className="w-4 h-4" />, text: "Finalizing blog post" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) {
      alert("Please enter a valid URL")
      return
    }

    // Check if free generation has been used and user doesn't have an active subscription
    if (freeGenerationUsed && !hasActiveSubscription) {
      console.log("Free generation already used, showing subscription error")
      setSetupSubscriptionError(true)
      return
    }

    setUrlEntered(true)
    setGenerationStarted(true)
    setShowPopup(true)

    try {
      const result = await onGenerate(url, humanizeLevel)
      if (result && result.id) {
        setGeneratedBlogId(result.id)
        setBlogGenerated(true)
      }
    } catch (error) {
      console.error("Error generating blog:", error)
    }
  }

  const handleDismissPopup = () => {
    setShowPopup(false)
  }

  // Simplify the handleSubscriptionPurchase function
  const handleSubscriptionPurchase = () => {
    console.log("Opening payment page...")
    setShowSubscriptionError(false)
    setSetupSubscriptionError(false)
    setShowPaymentPage(true)
  }

  const handleClosePaymentPage = () => {
    console.log("Closing payment page...")
    setShowPaymentPage(false)
  }

  const dismissSetupSubscriptionError = () => {
    setSetupSubscriptionError(false)
  }

  // Update urlEntered state when URL changes
  useEffect(() => {
    setUrlEntered(url.trim() !== "")
  }, [url])

  // Handle progress and timer during loading
  useEffect(() => {
    // Clear any existing intervals when loading state changes
    if (timerRef.current) clearInterval(timerRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
    if (stepRef.current) clearInterval(stepRef.current)

    if (loading) {
      // Reset states when loading starts
      setProgress(0)
      setTimeRemaining(300)
      setCurrentStep(0)

      // Update progress every 3 seconds
      progressRef.current = setInterval(() => {
        setProgress((prev) => {
          const newProgress = Math.min(prev + 1, 100)
          // When progress reaches 100%, mark the blog as generated
          if (newProgress === 100 && !blogGenerated) {
            setBlogGenerated(true)
          }
          return newProgress
        })
      }, 3000)

      // Update timer every second
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev <= 0 ? 0 : prev - 1
          return newTime
        })
      }, 1000)

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
      }, 5000)
    }

    // Cleanup function
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
      if (stepRef.current) clearInterval(stepRef.current)
    }
  }, [loading, blogGenerated]) // Depend on loading state and blogGenerated

  // Handle iframe loading and errors
  const handleIframeLoad = () => {
    setIframeLoaded(true)
    setIframeError(false)
    // Mark blog as generated when iframe loads successfully
    if (!blogGenerated) {
      setBlogGenerated(true)
    }
  }

  const handleIframeError = () => {
    setIframeLoaded(false)
    setIframeError(true)
    // Simulate subscription error when iframe fails to load
    // Only show subscription error if user doesn't have an active subscription
    if (!hasActiveSubscription) {
      setShowSubscriptionError(true)
    }
  }

  const reloadIframe = () => {
    // Check if free generation has been used and user doesn't have an active subscription
    if (freeGenerationUsed && !hasActiveSubscription) {
      console.log("Free generation already used, showing subscription error")
      setShowSubscriptionError(true)
      return
    }

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

  // Reset the app to initial state
  const resetApp = () => {
    setGenerationStarted(false)
    setUrl("")
    setProgress(0)
    setTimeRemaining(300)
    setCurrentStep(0)
    setIframeLoaded(false)
    setIframeError(false)
  }

  // Try to generate a new blog
  const handleNewBlogGeneration = () => {
    // Check if free generation has been used and user doesn't have an active subscription
    if (freeGenerationUsed && !hasActiveSubscription) {
      console.log("Free generation already used, showing subscription error")
      setSetupSubscriptionError(true)
    } else {
      resetApp()
    }
  }

  // Update the handleSubscriptionPurchase function
  const handleBuySubscription = () => {
    console.log("Opening payment page...")
    // Close any open error modals
    setShowSubscriptionError(false)
    setSetupSubscriptionError(false)

    // Force a small delay to ensure state updates before showing payment page
    setTimeout(() => {
      setShowPaymentPage(true)
      console.log("Payment page should be visible now:", true)
    }, 50)
  }

  return (
    <div className="min-h-screen w-full bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Font import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        {!generationStarted ? (
          // Initial form view - translucent card with improved UI
          <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-md border border-gray-100 flex flex-col items-center w-full">
            {setupSubscriptionError && !hasActiveSubscription && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-md p-6 max-w-sm w-full mx-4 relative">
                  <button
                    onClick={dismissSetupSubscriptionError}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="text-center py-4">
                    <div className="w-16 h-16 flex items-center justify-center rounded bg-red-50 mb-6 mx-auto">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Subscription Required</h3>
                    <p className="text-gray-600 mb-6">
                      Blog generation failed: You need an active subscription to generate more blog posts.
                    </p>
                  </div>

                  <button
                    onClick={handleBuySubscription}
                    className="w-full py-3 bg-[#294fd6] text-white rounded-sm hover:bg-[#1e3eb8] transition-colors flex items-center justify-center mr-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Buy Your Subscription</span>
                  </button>
                </div>
              </div>
            )}
            <div className="w-full text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Website Setup</h2>
              <p className="text-gray-600 mt-2">Let's configure your website for optimal content generation.</p>
            </div>

            {/* Progress bar - improved styling */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full mb-10">
              <div className="h-full w-1/3 bg-[#294fd6] rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 w-full">
              <div className="text-left">
                <label htmlFor="url" className="block text-gray-700 font-medium mb-3">
                  Website Domain
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="example.com"
                    className="w-full p-4 pl-11 bg-white/90 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#294fd6]/50 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                  <Globe className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm mt-2.5">Enter your website domain without http:// or www</p>
              </div>

              {freeGenerationUsed && !hasActiveSubscription && (
                <div className="bg-amber-50 border border-amber-200 rounded-sm p-3 text-sm text-amber-800">
                  <p className="flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    You've used your free blog generation. Subscribe to generate more blogs.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 px-4 font-medium rounded-sm bg-[#294fd6] text-white hover:bg-[#1e3eb8] transition-all"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center mr-2">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span>{freeGenerationUsed && !hasActiveSubscription ? "Subscribe to Continue" : "Continue"}</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          // Generation in progress view
          <div className="w-full max-w-6xl mx-auto">
            {/* Header section above the embed */}
            <div className="bg-gradient-to-r from-[#294fd6]/10 to-[#294fd6]/5 p-8 rounded-md border border-gray-100 mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center mr-2">
                    <Sparkles className="w-5 h-5 text-[#294fd6]" />
                    Your AI-Generated Blog
                  </h2>
                  <p className="text-gray-600 mb-4">
                    We're creating high-quality, SEO-optimized content based on your website.
                  </p>

                  <div className="flex flex-wrap mt-4">
                    <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-sm border border-gray-100 flex items-center mr-2">
                      <BookOpen className="w-4 h-4 text-[#294fd6]" />
                      <span className="text-sm font-medium">SEO Optimized</span>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-sm border border-gray-100 flex items-center mr-2">
                      <Zap className="w-4 h-4 text-[#294fd6]" />
                      <span className="text-sm font-medium">AI-Powered</span>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-sm border border-gray-100 flex items-center mr-2">
                      <Share2 className="w-4 h-4 text-[#294fd6]" />
                      <span className="text-sm font-medium">Ready to Publish</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-md border border-gray-100 flex flex-col items-center justify-center min-w-[180px]">
                  <div className="text-center mb-3">
                    <div className="text-3xl font-bold text-[#294fd6]">{Math.round(progress)}%</div>
                    <div className="text-sm text-gray-500">Completion</div>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#294fd6] h-full rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Est. time: {Math.ceil(timeRemaining / 60)} min</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-[#294fd6] rounded-full animate-pulse mr-2"></div>
                  <span>Currently: {steps[currentStep].text}</span>
                </div>
              </div>
            </div>

            {/* Main content area with Notion embed */}
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-md border border-gray-100 mb-6">
              {/* Improved iframe implementation with better loading state */}
              <div className="relative w-full h-[600px] border border-gray-100 rounded-md overflow-hidden">
                {!iframeLoaded && !iframeError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
                    <div className="relative w-16 h-16 mb-6">
                      <div className="absolute inset-0 rounded border-4 border-gray-100"></div>
                      <div className="absolute inset-0 rounded border-4 border-t-[#294fd6] animate-spin"></div>
                    </div>
                    <p className="text-gray-700 font-medium">Loading content...</p>
                    <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
                  </div>
                )}

                {iframeError && !showSubscriptionError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
                    <div className="w-16 h-16 flex items-center justify-center rounded bg-red-50 mb-6">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-gray-800 font-medium text-lg mb-2">Failed to load content</p>
                    <p className="text-gray-600 text-sm mb-6 max-w-md text-center">
                      The Notion embed couldn't be loaded. This might be due to connection issues or content
                      restrictions.
                    </p>
                    <button
                      onClick={reloadIframe}
                      className="flex items-center px-6 py-3 bg-[#294fd6] text-white rounded-sm hover:bg-blue-700 transition-colors mr-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Try Again</span>
                    </button>
                  </div>
                )}

                <iframe
                  ref={iframeRef}
                  src="https://v2-embednotion.com/18ac8ab792fa8047ab4bda7b6e3474e4"
                  style={{ width: "100%", height: "100%", border: "none" }}
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Generate new blog button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNewBlogGeneration}
                  className="flex items-center px-6 py-3 bg-[#294fd6] text-white rounded-sm hover:bg-[#1e3eb8] transition-colors mr-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Generate New Blog</span>
                </button>
              </div>
            </div>

            {/* Loading time popup */}
            {showPopup && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-md p-6 max-w-sm w-full mx-4 relative">
                  <button
                    onClick={handleDismissPopup}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="text-center py-4">
                    <div className="w-20 h-20 mx-auto mb-6 relative">
                      <div className="absolute inset-0 rounded border-4 border-gray-100"></div>
                      <div className="absolute inset-0 rounded border-4 border-t-[#294fd6] border-r-[#294fd6]/30 animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Clock className="w-8 h-8 text-[#294fd6]" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Please Wait</h3>
                    <p className="text-gray-600">
                      Your blog is being generated. This process will take approximately 2-3 minutes to complete.
                    </p>
                  </div>

                  <button
                    onClick={handleDismissPopup}
                    className="w-full py-3 mt-4 bg-[#294fd6] text-white rounded-sm hover:bg-[#1e3eb8] transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Subscription error popup - only show if user doesn't have an active subscription */}
            {showSubscriptionError && !hasActiveSubscription && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-md p-6 max-w-sm w-full mx-4 relative">
                  <button
                    onClick={() => setShowSubscriptionError(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="text-center py-4">
                    <div className="w-16 h-16 flex items-center justify-center rounded bg-red-50 mb-6 mx-auto">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Subscription Required</h3>
                    <p className="text-gray-600 mb-6">
                      You don't have an active subscription to generate another blog. Please purchase a subscription to
                      continue.
                    </p>
                  </div>

                  <button
                    onClick={handleBuySubscription}
                    className="w-full py-3 bg-[#294fd6] text-white rounded-sm hover:bg-[#1e3eb8] transition-colors flex items-center justify-center mr-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Buy Your Subscription</span>
                  </button>
                </div>
              </div>
            )}

            {/* Payment page */}
            {showPaymentPage && (
              <div
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]"
                style={{ backdropFilter: "blur(5px)" }}
              >
                <div className="bg-white rounded-md shadow-2xl w-full max-w-3xl mx-4 overflow-hidden">
                  <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-[#294fd6]/10 to-white">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center mr-2">
                      <CreditCard className="w-5 h-5 text-[#294fd6] mr-2" />
                      Complete Your Subscription
                    </h3>
                    <button
                      onClick={handleClosePaymentPage}
                      className="rounded p-2 hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6">
                    <PaymentPage />
                  </div>
                </div>
              </div>
            )}

            {/* Floating generation status panel */}
            <div className="fixed bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-md border border-gray-100 p-5 max-w-sm w-full z-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#294fd6] rounded-full animate-pulse mr-2"></div>
                  <h3 className="font-semibold text-gray-800">Blog Generation in Progress</h3>
                </div>
                <span className="text-[#294fd6] font-medium flex items-center bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatTime(timeRemaining)}
                </span>
              </div>

              <div className="mb-4">
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

              <div className="flex items-center p-3 bg-blue-50 rounded-sm border border-blue-100">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#294fd6] text-white flex items-center justify-center text-sm font-medium">
                  {currentStep + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{steps[currentStep].text}</p>
                  <div className="w-full bg-blue-200 h-1 mt-2 rounded-full overflow-hidden">
                    <div className="bg-[#294fd6] h-full rounded-full w-1/2 animate-pulse"></div>
                  </div>
                </div>
                <Loader2 className="w-5 h-5 text-[#294fd6] animate-spin" />
              </div>

              <button
                className="mt-4 text-sm text-[#294fd6] hover:underline flex items-center ml-auto font-medium"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <span>View Details</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogGenerator
