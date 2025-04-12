"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Sparkles,
  Zap,
  Clock,
  FileText,
  Search,
  BarChart,
  PenTool,
  CheckCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Link2,
  ArrowLeft,
} from "lucide-react"
import { AppSidebar } from "../components/sidebar"

export default function BlogGeneratorPage() {
  const [url, setUrl] = useState("")
  const [humanizeLevel, setHumanizeLevel] = useState<"normal" | "hardcore">("normal")
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes in seconds
  const [urlEntered, setUrlEntered] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [generationStarted, setGenerationStarted] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [isUrlValid, setIsUrlValid] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadingDots, setLoadingDots] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  const stepRef = useRef<NodeJS.Timeout | null>(null)

  const generationSteps = [
    { icon: <Search className="w-5 h-5 text-blue-500" />, text: "Extracting website content" },
    { icon: <BarChart className="w-5 h-5 text-purple-500" />, text: "Analyzing key topics" },
    { icon: <FileText className="w-5 h-5 text-emerald-500" />, text: "Generating blog structure" },
    { icon: <PenTool className="w-5 h-5 text-amber-500" />, text: "Writing content with humanization" },
    { icon: <CheckCircle className="w-5 h-5 text-rose-500" />, text: "Finalizing blog post" },
  ]

  // Validate URL as user types
  const validateUrl = (input: string) => {
    const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*\/?$/
    const isValid = urlPattern.test(input)
    setIsUrlValid(isValid || input === "")
    return isValid
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    setUrl(newUrl)
    validateUrl(newUrl)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) {
      alert("Please enter a valid URL")
      return
    }
    if (!isUrlValid) {
      alert("Please enter a valid URL (e.g., https://example.com)")
      return
    }

    // Ensure URL has protocol
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`
    setUrl(formattedUrl)

    setUrlEntered(true)
    setGenerationStarted(true)
    setLoading(true)

    // Simulate the generation process
    generateBlogPost(formattedUrl, humanizeLevel)
  }

  // Function to handle blog post generation
  const generateBlogPost = (url: string, humanizeLevel: "normal" | "hardcore") => {
    // Reset states when loading starts
    setProgress(0)
    setTimeRemaining(300)
    setCurrentStep(0)

    // Update progress every 3 seconds
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + 1, 100)
        if (newProgress === 100) {
          // When progress reaches 100%, stop loading
          setLoading(false)
          clearAllIntervals()
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

  // Clear all intervals
  const clearAllIntervals = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
    if (stepRef.current) clearInterval(stepRef.current)
  }

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

  // Generate loading dots
  const renderLoadingDots = () => {
    return ".".repeat(loadingDots)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Include the AppSidebar component */}
      <AppSidebar />

      {/* Font import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
        
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-pulse-ring:before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: #294fd6;
          animation: pulse-ring 2s infinite;
          z-index: -1;
        }
        
        .gradient-progress {
          background: linear-gradient(90deg, #294fd6, #4f7df2, #294fd6);
          background-size: 200% 100%;
          animation: gradient-shift 2s infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes moveParticle {
          0% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(var(--tx, 100px), var(--ty, 100px)); opacity: 0; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .particle {
          --tx: ${Math.random() * 200 - 100}px;
          --ty: ${Math.random() * 200 - 100}px;
          animation: moveParticle 8s ease-in-out infinite;
        }
      `}</style>

      {/* Header with back button */}
      <header className="p-4 sm:p-6 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="text-lg font-semibold text-gray-700">Blog Post Generator</div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-4xl mx-auto animate-fadeIn">
          {!generationStarted ? (
            // Initial form view - Using the new UI style
            <div className="bg-white rounded-lg p-6 sm:p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <FileText className="text-[#294fd6]" size={28} />
                  Generate Blog Post
                </h1>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 mb-8">
                <div className="p-8 pt-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <label htmlFor="url" className="block text-sm font-semibold text-gray-700">
                        Your Website URL
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Link2 className="h-5 w-5 text-[#294fd6]" />
                        </div>
                        <input
                          type="text"
                          id="url"
                          value={url}
                          onChange={handleUrlChange}
                          placeholder="Enter your website (e.g., https://example.com)"
                          disabled={loading}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 placeholder:text-gray-400 ${
                            isUrlValid
                              ? "border-gray-200 focus:ring-[#294fd6] focus:border-[#294fd6]"
                              : "border-red-300 focus:ring-red-500 focus:border-red-500"
                          } disabled:bg-gray-50 disabled:text-gray-400`}
                        />
                        {!isUrlValid && url && (
                          <p className="mt-1 text-sm text-red-600">
                            Please enter a valid URL (e.g., https://example.com)
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Enter your website URL to generate a blog post based on its content.
                      </p>
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
                          <Sparkles
                            className={`w-4 h-4 ${humanizeLevel === "normal" ? "text-white" : "text-[#294fd6]"}`}
                          />
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
                          <Zap
                            className={`w-4 h-4 ${humanizeLevel === "hardcore" ? "text-white" : "text-[#294fd6]"}`}
                          />
                          <span>Hardcore</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-[#294fd6] mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">How It Works</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Simply provide your website URL, and our AI will analyze its content to create a unique,
                            engaging blog post tailored to your site's audience and style.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className={`w-full px-6 py-3 rounded-lg text-white font-bold flex items-center justify-center transition-all duration-300 border ${
                        loading || !isUrlValid
                          ? "bg-blue-400 border-blue-500 cursor-not-allowed"
                          : "bg-[#294fd6] border-[#294fd6] hover:bg-[#1d4ed8] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#294fd6] focus:ring-offset-2"
                      }`}
                      disabled={loading || !isUrlValid}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin mr-3 h-5 w-5 text-white" />
                          <span>Generating Blog Post...</span>
                        </>
                      ) : (
                        <>
                          <span>Generate Blog Post</span>
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            // Generation in progress view - Using the advanced loading UI
            <div className="py-10 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md mx-auto mb-12">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-20 blur-xl animate-pulse"></div>
                <div className="relative bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="particle absolute w-2 h-2 rounded-full bg-blue-500 opacity-70"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 5}s`,
                          animationDuration: `${5 + Math.random() * 10}s`,
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full border-8 border-gray-100 flex items-center justify-center mb-6 relative">
                      <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 100 100">
                        <circle
                          className="text-gray-200"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="46"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-blue-600 transition-all duration-300"
                          strokeWidth="8"
                          strokeDasharray={46 * 2 * Math.PI}
                          strokeDashoffset={46 * 2 * Math.PI * (1 - progress / 100)}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="46"
                          cx="50"
                          cy="50"
                        />
                      </svg>
                      <div className="text-2xl font-bold text-gray-800">{progress}%</div>
                    </div>
                    <div className="flex items-center justify-center mb-4 animate-bounce">
                      {generationSteps[currentStep].icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 animate-fadeIn">
                      {generationSteps[currentStep].text}
                    </h3>
                    <p className="text-gray-600 text-center max-w-xs animate-fadeIn">
                      Our AI is hard at work creating an amazing blog post for your website.
                    </p>
                    <div className="flex space-x-2 mt-8">
                      {generationSteps.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentStep ? "bg-blue-600 scale-125" : "bg-gray-300"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-md mx-auto animate-slideUp">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                  <Sparkles className="h-4 w-4 text-amber-500 mr-2" />
                  Did you know?
                </h4>
                <p className="text-sm text-gray-600">
                  Blogs with images get 94% more views than those without. Your AI-generated blog will include
                  suggestions for relevant imagery.
                </p>
              </div>

              {/* Notion embed section */}
              <div className="w-full max-w-4xl mx-auto mt-12">
                <div className="relative w-full h-[500px] border border-gray-200 rounded-xl overflow-hidden shadow-md">
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

              <div className="mt-8 text-center text-sm text-gray-500 max-w-md animate-fadeIn">
                <p>Please don't close this page. You'll be automatically redirected when your blog is ready.</p>
              </div>
            </div>
          )}
        </div>

        {/* Floating generation status panel */}
        {generationStarted && (
          <div className="fixed bottom-6 right-6 bg-white rounded-xl border border-gray-200 p-5 shadow-xl max-w-sm w-full z-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative w-4 h-4">
                  <div
                    className="absolute inset-0 bg-[#294fd6] rounded-full animate-ping opacity-75"
                    style={{ animationDuration: "1.5s" }}
                  ></div>
                  <div className="relative w-4 h-4 bg-[#294fd6] rounded-full"></div>
                </div>
                <h3 className="font-semibold text-gray-800">Blog Generation in Progress</h3>
              </div>
              <div className="text-[#294fd6] font-medium flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <Clock className="w-4 h-4" />
                <span className="tabular-nums">{formatTime(timeRemaining)}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full gradient-progress rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span className="font-medium">
                  Progress: <span className="tabular-nums">{Math.round(progress)}%</span>
                </span>
                <span className="font-medium">
                  ~<span className="tabular-nums">{Math.ceil(timeRemaining / 60)}</span> min remaining
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="relative flex-shrink-0 w-10 h-10 rounded-full bg-[#294fd6] text-white flex items-center justify-center text-sm font-medium">
                {currentStep + 1}
                <div className="absolute inset-0 rounded-full border-2 border-[#294fd6] scale-110 opacity-50 animate-pulse"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  {generationSteps[currentStep].icon}
                  <p className="text-gray-800 font-medium ml-2">{generationSteps[currentStep].text}</p>
                </div>
                <div className="w-full bg-blue-200 h-1.5 mt-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#294fd6] h-full rounded-full animate-pulse"
                    style={{
                      width: `${(progress % 20) * 5}%`,
                      transition: "width 0.5s ease-out",
                    }}
                  ></div>
                </div>
              </div>
              <div className="relative">
                <Loader2 className="w-6 h-6 text-[#294fd6] animate-spin" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
