"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
    let progressInterval: NodeJS.Timeout
    let timerInterval: NodeJS.Timeout

    if (loading) {
      setProgress(0)
      setTimeRemaining(300)
      setCurrentStep(0)

      // Update progress every 3 seconds
      progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 1, 100))
      }, 3000)

      // Update timer every second
      timerInterval = setInterval(() => {
        setTimeRemaining((prev) => (prev <= 0 ? 0 : prev - 1))
      }, 1000)

      // Update current step based on progress
      const stepInterval = setInterval(() => {
        if (progress < 20) setCurrentStep(0)
        else if (progress < 40) setCurrentStep(1)
        else if (progress < 60) setCurrentStep(2)
        else if (progress < 80) setCurrentStep(3)
        else setCurrentStep(4)
      }, 5000)

      return () => {
        clearInterval(progressInterval)
        clearInterval(timerInterval)
        clearInterval(stepInterval)
      }
    }
  }, [loading, progress])

  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Font import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      {/* Cool background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#294fd6] opacity-5 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#294fd6] opacity-5 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-400 opacity-5 blur-3xl"></div>

        {/* Animated floating circles */}
        <div className="absolute top-20 right-20 w-20 h-20 rounded-full bg-[#294fd6] opacity-10 blur-xl animate-pulse"></div>
        <div
          className="absolute bottom-40 left-20 w-16 h-16 rounded-full bg-[#294fd6] opacity-10 blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full bg-[#294fd6] opacity-10 blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBmaWxsPSIjMjk0ZmQ2IiBmaWxsLW9wYWNpdHk9Ii4wMiIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="bg-[#294fd6] p-3 rounded-full border border-gray-200">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-[#294fd6] to-blue-500">
              Blog Generator
            </h1>
          </div>
          <p className="text-gray-600 max-w-md text-center">
            Transform any website into a professionally written blog post with our AI-powered generator
          </p>
        </div>

        {!generationStarted ? (
          // Initial form view
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl border border-gray-200 flex flex-col items-center w-full">
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
            {/* Main content area with Notion embed */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 mb-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">While We Generate Your Blog Post...</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Check out our comprehensive guide on content creation, SEO optimization, and blogging best practices.
                  This will help you make the most of your generated blog post.
                </p>
              </div>

              {/* Using the exact iframe code provided by the user */}
              <div
                dangerouslySetInnerHTML={{
                  __html: `<iframe src="https://v2-embednotion.com/18ac8ab792fa8047ab4bda7b6e3474e4" style="width: 100%; height: 500px; border: 2px solid #ccc; border-radius: 10px; padding: none;"></iframe>`,
                }}
              />
            </div>

            {/* Floating generation status panel */}
            <div className="fixed bottom-6 right-6 bg-white rounded-xl border border-gray-200 p-4 shadow-lg max-w-sm w-full z-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#294fd6] rounded-full animate-pulse"></div>
                  <h3 className="font-semibold text-gray-800">Blog Generation in Progress</h3>
                </div>
                <span className="text-[#294fd6] font-medium flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full border border-gray-200">
                  <Clock className="w-4 h-4" />
                  {formatTime(timeRemaining)}
                </span>
              </div>

              <div className="mb-3">
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#294fd6] h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-600">
                  <span>Progress: {Math.round(progress)}%</span>
                  <span>~{Math.ceil(timeRemaining / 60)} min remaining</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#294fd6] text-white flex items-center justify-center text-xs">
                  {currentStep + 1}
                </div>
                <span>{steps[currentStep].text}</span>
                <Loader2 className="w-4 h-4 ml-auto text-[#294fd6] animate-spin" />
              </div>

              <button
                className="mt-3 text-xs text-[#294fd6] hover:underline flex items-center gap-1 ml-auto"
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
