"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Target,
  User,
  Building,
  PieChart,
  Goal,
  DollarSign,
  Laptop,
  MapPin,
  ShoppingCart,
  Link2,
  FileText,
  Loader2,
  Search,
} from "lucide-react"
import { createClient } from "@/utitls/supabase/server"

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

export default function GenerateICPPage() {
  const [summary, setSummary] = useState("")
  const [icpData, setIcpData] = useState<ICP | null>(null)
  const [isLoadingIcp, setIsLoadingIcp] = useState(false)
  const [showIcpSection, setShowIcpSection] = useState(false)
  const [error, setError] = useState("")
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" } | null>(null)
  const [supabase, setSupabase] = useState<any>(null)
  const [user, setUser] = useState<any>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const url = searchParams.get("url") || localStorage.getItem("websiteUrl") || ""

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
    // First try to get URL from localStorage
    const storedUrl = localStorage.getItem("websiteSummaryUrl")

    // If we have a stored URL, use it
    if (storedUrl) {
      // Get the summary from localStorage
      const storedSummary = localStorage.getItem("websiteSummary")
      if (storedSummary) {
        setSummary(storedSummary)
      } else {
        router.push(`/onboarding`)
      }
    }
    // If no stored URL but URL from query params, use that
    else if (url) {
      // Get the summary from localStorage
      const storedSummary = localStorage.getItem("websiteSummary")
      if (storedSummary) {
        setSummary(storedSummary)
      } else {
        router.push(`/summary?url=${encodeURIComponent(url)}`)
      }
    }
    // If no URL at all, redirect to onboarding
    else {
      router.push("/onboarding")
    }
  }, [url, router])

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Function to generate ICP
  const generateICP = async () => {
    setIsLoadingIcp(true)
    try {
      // Call our ICP generation API with both URL and summary
      const response = await fetch(
        `/api/generate-icp?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(summary)}`,
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.details || "Failed to generate ICP")
      }

      const data = await response.json()
      setIcpData(data.icp)
      setShowIcpSection(true)
      showToast("ICP generated successfully!", "success")
    } catch (err: any) {
      console.error("Error generating ICP:", err)
      showToast(`Failed to generate ICP: ${err.message}`, "error")
      setError(err.message)
      // Reset loading state but don't show fallback data
      setShowIcpSection(false)
    } finally {
      setIsLoadingIcp(false)
    }
  }

  // Auto-generate ICP when the page loads
  useEffect(() => {
    if (summary && !icpData && !isLoadingIcp && !showIcpSection && !error) {
      generateICP()
    }
  }, [summary, icpData, isLoadingIcp, showIcpSection, error])

  // Function to continue to blog generation
  const continueToBlogGeneration = () => {
    // Store the URL in localStorage if it's not already there
    if (url) {
      localStorage.setItem("websiteUrl", url)
      localStorage.setItem("websiteSummaryUrl", url)
    }

    // Navigate to the blog generation page
    router.push(`/generate-blog?url=${encodeURIComponent(url)}`)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-4 sm:p-6 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push(`/summary?url=${encodeURIComponent(url)}`)}
            className="text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Summary
          </button>
          <div className="text-lg font-semibold text-gray-700">ICP Generator</div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-4xl mx-auto animate-fadeIn">
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Target className="text-[#2563eb]" size={28} />
                Ideal Customer Profile Generator
              </h1>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 mb-8">
              <div className="p-6">
                <div className="space-y-3">
                  <label htmlFor="url" className="block text-sm font-semibold text-gray-700">
                    Website URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Link2 className="h-5 w-5 text-[#2563eb]" />
                    </div>
                    <input
                      type="url"
                      id="url"
                      value={url}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] bg-gray-50 text-gray-800 transition-all duration-200 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {isLoadingIcp ? (
              <div className="py-16 flex flex-col items-center justify-center border border-gray-200 rounded-lg">
                <div className="relative w-32 h-32 mb-8">
                  {/* Clean circular loading animation */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5ff" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="8"
                      strokeDasharray="283"
                      strokeDashoffset="100"
                      strokeLinecap="round"
                      className="transform -rotate-90 origin-center animate-circle-loading"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[#2563eb] font-bold text-xl">60%</div>
                  </div>
                </div>

                <h3 className="text-xl font-medium text-gray-800 mb-4">Analyzing Website Data</h3>

                <div className="w-full max-w-md mb-8">
                  <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                    <span className="uppercase text-[#2563eb] bg-blue-50 px-3 py-1 rounded-full text-xs font-semibold">
                      Analysis Progress
                    </span>
                    <span className="text-[#2563eb]">Step 3 of 5</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                    <div className="h-full bg-[#2563eb] rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>

                <div className="w-full max-w-md space-y-4">
                  {/* Completed steps */}
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-blue-50 text-[#2563eb] border border-gray-200">
                      <CheckCircle size={20} />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium">Accessing website content...</span>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Connecting to the server and retrieving page data
                      </div>
                    </div>
                    <div className="ml-2">
                      <div className="bg-green-100 p-1 rounded-full">
                        <CheckCircle size={20} className="text-green-500" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-blue-50 text-[#2563eb] border border-gray-200">
                      <CheckCircle size={20} />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium">Analyzing page structure...</span>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Examining HTML elements and content organization
                      </div>
                    </div>
                    <div className="ml-2">
                      <div className="bg-green-100 p-1 rounded-full">
                        <CheckCircle size={20} className="text-green-500" />
                      </div>
                    </div>
                  </div>

                  {/* Current step */}
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-[#2563eb] text-white border border-gray-200">
                      <Search size={20} />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-[#2563eb]">Extracting key information...</span>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Identifying important content and business details
                      </div>
                      <div className="mt-2 h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#2563eb] rounded-full animate-pulse-width"></div>
                      </div>
                    </div>
                    <div className="ml-2">
                      <Loader2 size={24} className="text-[#2563eb] animate-spin" />
                    </div>
                  </div>

                  {/* Upcoming step */}
                  <div className="flex items-center text-gray-400">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-gray-100 border border-gray-200">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium">Generating professional summary...</span>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Creating a comprehensive analysis of your website
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="py-12 text-center">
                <div className="flex flex-col items-center">
                  <AlertCircle size={56} className="text-red-500 mb-6" />
                  <p className="text-red-600 mb-6 text-lg">{error}</p>
                  <button
                    onClick={generateICP}
                    className="px-6 py-3 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium border border-[#2563eb]"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : showIcpSection && icpData ? (
              <div>
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <Target size={22} className="mr-2 text-[#2563eb]" />
                    AI-Generated Ideal Customer Profile
                  </h2>
                  <div className="flex items-center text-sm text-[#2563eb] bg-[#2563eb]/10 px-3 py-1.5 rounded-full">
                    <Sparkles size={16} className="mr-2" />
                    Powered by AI
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-5">
                    <div className="flex items-center mb-4">
                      <Building className="text-[#2563eb] mr-3" size={22} />
                      <h3 className="font-semibold text-[#2563eb] text-lg">Industries</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {icpData.industries.map((industry, i) => (
                        <li key={i} className="text-base">
                          {industry}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-5">
                    <div className="flex items-center mb-4">
                      <PieChart className="text-[#2563eb] mr-3" size={22} />
                      <h3 className="font-semibold text-[#2563eb] text-lg">Company Size</h3>
                    </div>
                    <p className="text-gray-700 text-base">{icpData.companySize}</p>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-5">
                    <div className="flex items-center mb-4">
                      <User className="text-[#2563eb] mr-3" size={22} />
                      <h3 className="font-semibold text-[#2563eb] text-lg">Key Decision Makers</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {icpData.jobTitles.map((title, i) => (
                        <li key={i} className="text-base">
                          {title}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-5">
                    <div className="flex items-center mb-4">
                      <AlertCircle className="text-[#2563eb] mr-3" size={22} />
                      <h3 className="font-semibold text-[#2563eb] text-lg">Pain Points</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {icpData.painPoints.map((point, i) => (
                        <li key={i} className="text-base">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-5">
                    <div className="flex items-center mb-4">
                      <Goal className="text-[#2563eb] mr-3" size={22} />
                      <h3 className="font-semibold text-[#2563eb] text-lg">Goals</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {icpData.goals.map((goal, i) => (
                        <li key={i} className="text-base">
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-5">
                    <div className="flex items-center mb-4">
                      <DollarSign className="text-[#2563eb] mr-3" size={22} />
                      <h3 className="font-semibold text-[#2563eb] text-lg">Budget Range</h3>
                    </div>
                    <p className="text-gray-700 text-base">{icpData.budget}</p>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-5">
                    <div className="flex items-center mb-4">
                      <Laptop className="text-[#2563eb] mr-3" size={22} />
                      <h3 className="font-semibold text-[#2563eb] text-lg">Technology Stack</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {icpData.technographics.map((tech, i) => (
                        <li key={i} className="text-base">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-5">
                    <div className="flex items-center mb-4">
                      <MapPin className="text-[#2563eb] mr-3" size={22} />
                      <h3 className="font-semibold text-[#2563eb] text-lg">Geographic Focus</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {icpData.geographics.map((geo, i) => (
                        <li key={i} className="text-base">
                          {geo}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 bg-white rounded-lg border border-gray-200 overflow-hidden p-5">
                  <div className="flex items-center mb-4">
                    <ShoppingCart className="text-[#2563eb] mr-3" size={22} />
                    <h3 className="font-semibold text-[#2563eb] text-lg">Buying Process</h3>
                  </div>
                  <p className="text-gray-700 text-base">{icpData.buyingProcess}</p>
                </div>

                <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-[#2563eb] text-lg mb-4">How to Use This ICP</h4>
                  <ul className="grid md:grid-cols-2 gap-x-6 gap-y-3">
                    <li className="flex items-start">
                      <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Target your marketing campaigns to these specific industries and job titles
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Address these pain points in your messaging and content</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Align your product/service with these customer goals</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Price your offerings according to this budget range</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Focus your geographic targeting on these regions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Optimize your sales process based on their buying journey</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-10 flex justify-center">
                  <button
                    onClick={continueToBlogGeneration}
                    className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-10 py-4 rounded-lg transition-colors flex items-center font-medium text-lg border border-[#2563eb]"
                  >
                    <FileText size={22} className="mr-3" />
                    Continue to Blog Generator
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center">
                <Sparkles size={48} className="text-[#2563eb] mb-6" />
                <h3 className="text-xl font-medium text-gray-800 mb-4">Generate Your Ideal Customer Profile</h3>
                <p className="text-gray-600 max-w-md text-center mb-8">
                  Click the button below to generate an AI-powered Ideal Customer Profile based on your website content.
                </p>
                <button
                  onClick={generateICP}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-8 py-3 rounded-lg transition-colors flex items-center font-medium border border-[#2563eb]"
                >
                  <Sparkles size={20} className="mr-2" />
                  Generate AI-Powered ICP
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Custom Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg border ${
            toast.type === "success"
              ? "bg-white border-green-200 text-green-600"
              : "bg-white border-red-200 text-red-600"
          } flex items-center animate-fadeIn`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={22} className="mr-3" />
          ) : (
            <AlertCircle size={22} className="mr-3" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes pulse-width {
          0%, 100% { width: 40%; }
          50% { width: 100%; }
        }
        
        @keyframes circle-loading {
          0% { stroke-dashoffset: 283; }
          50% { stroke-dashoffset: 140; }
          100% { stroke-dashoffset: 283; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-pulse-width {
          animation: pulse-width 2s ease-in-out infinite;
        }
        
        .animate-circle-loading {
          animation: circle-loading 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

