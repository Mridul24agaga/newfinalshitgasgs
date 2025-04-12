"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  Globe,
  Sparkles,
  Zap,
  Clock,
  FileText,
  Search,
  BookOpen,
  BarChart,
  PenTool,
  CheckCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react"

interface BlogGeneratorProps {
  onGenerate: (url: string, humanizeLevel: "normal" | "hardcore") => void
  loading: boolean
}

const BlogGenerator: React.FC<BlogGeneratorProps> = ({ onGenerate, loading }) => {
  const [url, setUrl] = useState("")
  const [humanizeLevel, setHumanizeLevel] = useState<"normal" | "hardcore">("normal")
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes in seconds
  const [urlEntered, setUrlEntered] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [generationStarted, setGenerationStarted] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  const stepRef = useRef<NodeJS.Timeout | null>(null)

  const steps = [
    { icon: <Search className="w-4 h-4" />, text: "Extracting website content" },
    { icon: <BarChart className="w-4 h-4" />, text: "Analyzing key topics" },
    { icon: <FileText className="w-4 h-4" />, text: "Generating blog structure" },
    { icon: <PenTool className="w-4 h-4" />, text: "Writing content with humanization" },
    { icon: <CheckCircle className="w-4 h-4" />, text: "Finalizing blog post" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) {
      alert("Please enter a valid URL")
      return
    }
    setUrlEntered(true)
    setGenerationStarted(true)
    onGenerate(url, humanizeLevel)
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
  }, [loading]) // Only depend on loading state

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
          // Initial form view
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-lg flex flex-col items-center w-full">
            <div className="flex items-center gap-2 mb-6 justify-center">
              <FileText className="w-5 h-5 text-[#294fd6]" />
              <h2 className="text-xl font-bold text-gray-800">Generate Your Blog</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              <div className="text-center">
                <label htmlFor="url" className="flex items-center gap-2 text-gray-700 font-medium mb-2 justify-center">
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
                    disabled={loading}
                  />
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="text-center">
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-3 justify-center">
                  <Sparkles className="w-4 h-4 text-[#294fd6]" />
                  Humanization Level
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setHumanizeLevel("normal")}
                    className={`py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                      humanizeLevel === "normal"
                        ? "bg-[#294fd6] text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                    disabled={loading}
                  >
                    <Sparkles className={`w-4 h-4 ${humanizeLevel === "normal" ? "text-white" : "text-[#294fd6]"}`} />
                    <span>Normal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHumanizeLevel("hardcore")}
                    className={`py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                      humanizeLevel === "hardcore"
                        ? "bg-[#294fd6] text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                    disabled={loading}
                  >
                    <Zap className={`w-4 h-4 ${humanizeLevel === "hardcore" ? "text-white" : "text-[#294fd6]"}`} />
                    <span>Hardcore</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-4 font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
                  loading ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-[#294fd6] hover:bg-blue-700 text-white"
                }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    <span>Generate Blog</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          // Generation in progress view
          <div className="w-full max-w-6xl mx-auto">
            {/* Main content area with Notion embed - Heading removed */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg mb-6">
              {/* Improved iframe implementation with better loading state */}
              <div className="relative w-full h-[600px] border border-gray-200 rounded-xl overflow-hidden shadow-md">
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
            </div>

            {/* Floating generation status panel */}
            <div className="fixed bottom-6 right-6 bg-white rounded-xl border border-gray-200 p-5 shadow-xl max-w-sm w-full z-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#294fd6] rounded-full animate-pulse"></div>
                  <h3 className="font-semibold text-gray-800">Blog Generation in Progress</h3>
                </div>
                <span className="text-[#294fd6] font-medium flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  <Clock className="w-4 h-4" />
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

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
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
                className="mt-4 text-sm text-[#294fd6] hover:underline flex items-center gap-1 ml-auto font-medium"
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
