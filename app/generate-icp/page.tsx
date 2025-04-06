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
        router.push(`/summary?url=${encodeURIComponent(storedUrl)}`)
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <header className="p-4 sm:p-6 bg-white shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push(`/summary?url=${encodeURIComponent(url)}`)}
            className="text-[#294fd6] hover:text-[#1a3ca8] flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Summary
          </button>
          <div className="text-lg font-semibold text-gray-700">ICP Generator</div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-4xl mx-auto animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Target className="text-[#294fd6]" size={28} />
                Ideal Customer Profile Generator
              </h1>
            </div>

            <div className="bg-white rounded-2xl border border-blue-200 overflow-hidden transition-all duration-300 mb-8">
              <div className="p-6">
                <div className="space-y-3">
                  <label htmlFor="url" className="block text-sm font-semibold text-blue-900">
                    Website URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Link2 className="h-5 w-5 text-[#294fd6]" />
                    </div>
                    <input
                      type="url"
                      id="url"
                      value={url}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#294fd6] focus:border-[#294fd6] bg-blue-50 text-blue-800 transition-all duration-200 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {isLoadingIcp ? (
              <div className="py-16 flex flex-col items-center justify-center">
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-[#294fd6] border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={28} className="text-[#294fd6] animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl font-medium text-blue-900 mb-4">AI is analyzing your website</h3>
                <p className="text-blue-700 max-w-md text-center mb-8">
                  Our AI is analyzing your website content to create a detailed Ideal Customer Profile tailored to your
                  business.
                </p>
                <div className="w-full max-w-md">
                  <div className="h-3 w-full bg-blue-100 rounded-full overflow-hidden border border-blue-200">
                    <div className="h-full bg-[#294fd6] rounded-full animate-pulse-width"></div>
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
                    className="px-6 py-3 bg-[#294fd6] text-white rounded-xl hover:bg-[#1a3ca8] transition-colors font-medium border border-[#294fd6] hover:shadow-lg"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : showIcpSection && icpData ? (
              <div>
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <Target size={22} className="mr-2 text-[#294fd6]" />
                    AI-Generated Ideal Customer Profile
                  </h2>
                  <div className="flex items-center text-sm text-[#294fd6] bg-[#294fd6]/10 px-3 py-1.5 rounded-full">
                    <Sparkles size={16} className="mr-2" />
                    Powered by AI
                  </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  <div className="bg-white rounded-xl border border-blue-200 overflow-hidden p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <Building className="text-[#294fd6] mr-3" size={22} />
                      <h3 className="font-semibold text-[#294fd6] text-lg">Industries</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {icpData.industries.map((industry, i) => (
                        <li key={i} className="text-base">
                          {industry}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl border border-blue-200 overflow-hidden p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <PieChart className="text-[#294fd6] mr-3" size={22} />
                      <h3 className="font-semibold text-[#294fd6] text-lg">Company Size</h3>
                    </div>
                    <p className="text-gray-700 text-base">{icpData.companySize}</p>
                  </div>

                  <div className="bg-white rounded-xl border border-blue-200 overflow-hidden p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <User className="text-[#294fd6] mr-3" size={22} />
                      <h3 className="font-semibold text-[#294fd6] text-lg">Key Decision Makers</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {icpData.jobTitles.map((title, i) => (
                        <li key={i} className="text-base">
                          {title}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl border border-blue-200 overflow-hidden p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <AlertCircle className="text-[#294fd6] mr-3" size={22} />
                      <h3 className="font-semibold text-[#294fd6] text-lg">Pain Points</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {icpData.painPoints.map((point, i) => (
                        <li key={i} className="text-base">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl border border-blue-200 overflow-hidden p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <Goal className="text-[#294fd6] mr-3" size={22} />
                      <h3 className="font-semibold text-[#294fd6] text-lg">Goals</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {icpData.goals.map((goal, i) => (
                        <li key={i} className="text-base">
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl border border-blue-200 overflow-hidden p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <DollarSign className="text-[#294fd6] mr-3" size={22} />
                      <h3 className="font-semibold text-[#294fd6] text-lg">Budget Range</h3>
                    </div>
                    <p className="text-gray-700 text-base">{icpData.budget}</p>
                  </div>

                  <div className="bg-white rounded-xl border border-blue-200 overflow-hidden p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <Laptop className="text-[#294fd6] mr-3" size={22} />
                      <h3 className="font-semibold text-[#294fd6] text-lg">Technology Stack</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {icpData.technographics.map((tech, i) => (
                        <li key={i} className="text-base">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl border border-blue-200 overflow-hidden p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <MapPin className="text-[#294fd6] mr-3" size={22} />
                      <h3 className="font-semibold text-[#294fd6] text-lg">Geographic Focus</h3>
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

                <div className="mt-8 bg-white rounded-lg border border-gray-200 overflow-hidden p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <ShoppingCart className="text-[#294fd6] mr-3" size={22} />
                    <h3 className="font-semibold text-[#294fd6] text-lg">Buying Process</h3>
                  </div>
                  <p className="text-gray-700 text-base">{icpData.buyingProcess}</p>
                </div>

                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-medium text-[#294fd6] text-lg mb-4">How to Use This ICP</h4>
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
                    className="bg-[#294fd6] hover:bg-[#1a3ca8] text-white px-10 py-4 rounded-xl transition-colors flex items-center shadow-lg shadow-[#294fd6]/20 hover:shadow-xl hover:shadow-[#294fd6]/30 transform hover:translate-y-[-2px] active:translate-y-[0px] font-medium text-lg border border-[#294fd6]"
                  >
                    <FileText size={22} className="mr-3" />
                    Continue to Blog Generator
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center">
                <Sparkles size={48} className="text-[#294fd6] mb-6" />
                <h3 className="text-xl font-medium text-gray-800 mb-4">Generate Your Ideal Customer Profile</h3>
                <p className="text-gray-600 max-w-md text-center mb-8">
                  Click the button below to generate an AI-powered Ideal Customer Profile based on your website content.
                </p>
                <button
                  onClick={generateICP}
                  className="bg-[#294fd6] hover:bg-[#1a3ca8] text-white px-8 py-3 rounded-lg transition-colors flex items-center shadow-lg shadow-[#294fd6]/20 hover:shadow-xl hover:shadow-[#294fd6]/30 transform hover:translate-y-[-2px] active:translate-y-[0px] font-medium"
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
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-xl ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white flex items-center animate-fadeIn`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={22} className="mr-3" />
          ) : (
            <AlertCircle size={22} className="mr-3" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  )
}

