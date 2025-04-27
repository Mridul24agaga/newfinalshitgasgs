"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Globe,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  RefreshCw,
  BarChart3,
  Target,
  Building,
  Goal,
} from "lucide-react"
import { createClient } from "@/utitls/supabase/client"
import type { SupabaseClient, User } from "@supabase/supabase-js"
import { AppSidebar } from "@/app/components/sidebar"

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

interface WebsiteAnalysis {
  id: string
  user_id: string
  url: string
  summary: string
  icp_data: ICP | null
  created_at: string
  updated_at: string
}

// Restrict field to array-typed keys
type ArrayFieldKeys = {
  [K in keyof ICP]: ICP[K] extends string[] ? K : never
}[keyof ICP]

export default function SettingsPage() {
  const [analyses, setAnalyses] = useState<WebsiteAnalysis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" } | null>(null)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [editingAnalysis, setEditingAnalysis] = useState<WebsiteAnalysis | null>(null)
  const [editedSummary, setEditedSummary] = useState("")
  const [editedICP, setEditedICP] = useState<ICP | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState<"summary" | "icp">("summary")
  const [isEditMode, setIsEditMode] = useState(false)

  const router = useRouter()

  // Initialize Supabase client and fetch data
  useEffect(() => {
    const initSupabase = async () => {
      try {
        const client = createClient()
        setSupabase(client)
        console.log("Supabase client initialized")

        // Check if the table exists
        const tableExists = await checkTableExists(client)
        if (!tableExists) {
          setError("Database table 'website_analysis' does not exist. Please contact support.")
          setIsLoading(false)
          return
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
          await fetchAnalyses(client, data.user.id)
        } else {
          console.warn("No user found")
          setError("No user found. Please log in.")
          setIsLoading(false)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
        console.error("Error initializing Supabase:", errorMessage)
        setError("Failed to initialize Supabase client.")
        setIsLoading(false)
      }
    }

    initSupabase()
  }, [])

  // Function to check if the website_analysis table exists
  const checkTableExists = async (client: SupabaseClient) => {
    if (!client) return false

    try {
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

  // Function to fetch all analyses for the user
  const fetchAnalyses = async (client: SupabaseClient, userId: string) => {
    try {
      setIsLoading(true)
      console.log("Fetching analyses for user:", userId)

      const { data, error } = await client
        .from("website_analysis")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching analyses:", error)
        setError(`Failed to fetch analyses: ${error.message}`)
        setIsLoading(false)
        return
      }

      // Validate and transform icp_data
      const validatedData = data.map((item) => ({
        ...item,
        icp_data: item.icp_data
          ? {
              industries: Array.isArray(item.icp_data.industries) ? item.icp_data.industries : [],
              companySize: typeof item.icp_data.companySize === "string" ? item.icp_data.companySize : "",
              jobTitles: Array.isArray(item.icp_data.jobTitles) ? item.icp_data.jobTitles : [],
              painPoints: Array.isArray(item.icp_data.painPoints) ? item.icp_data.painPoints : [],
              goals: Array.isArray(item.icp_data.goals) ? item.icp_data.goals : [],
              budget: typeof item.icp_data.budget === "string" ? item.icp_data.budget : "",
              technographics: Array.isArray(item.icp_data.technographics) ? item.icp_data.technographics : [],
              geographics: Array.isArray(item.icp_data.geographics) ? item.icp_data.geographics : [],
              buyingProcess: typeof item.icp_data.buyingProcess === "string" ? item.icp_data.buyingProcess : "",
            }
          : null,
      }))

      console.log(`Found ${validatedData.length} analyses`)
      setAnalyses(validatedData || [])
      setIsLoading(false)

      // Automatically select the first analysis after fetching
      if (validatedData && validatedData.length > 0) {
        startEditing(validatedData[0])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      console.error("Error fetching analyses:", errorMessage)
      setError(`Failed to fetch analyses: ${errorMessage}`)
      setIsLoading(false)
    }
  }

  // Function to show toast messages
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Function to start editing an analysis
  const startEditing = (analysis: WebsiteAnalysis) => {
    setEditingAnalysis(analysis)
    setEditedSummary(analysis.summary || "")
    setEditedICP(analysis.icp_data)
    setActiveTab("summary")
  }

  // Function to cancel editing
  const cancelEditing = () => {
    setEditingAnalysis(null)
    setEditedSummary("")
    setEditedICP(null)
  }

  // Function to save edited analysis
  const saveAnalysis = async () => {
    if (!supabase || !editingAnalysis) return

    try {
      setIsSaving(true)
      console.log("Saving edited analysis:", {
        id: editingAnalysis.id,
        summary_length: editedSummary.length,
        has_icp: !!editedICP,
      })

      const { error } = await supabase
        .from("website_analysis")
        .update({
          summary: editedSummary,
          icp_data: editedICP,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingAnalysis.id)

      if (error) {
        console.error("Error updating analysis:", error)
        showToast(`Failed to save changes: ${error.message}`, "error")
        setIsSaving(false)
        return
      }

      // Update the local state
      setAnalyses((prev) =>
        prev.map((a) =>
          a.id === editingAnalysis.id
            ? {
                ...a,
                summary: editedSummary,
                icp_data: editedICP,
                updated_at: new Date().toISOString(),
              }
            : a,
        ),
      )

      showToast("Analysis saved successfully", "success")
      setEditingAnalysis(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      console.error("Error saving analysis:", errorMessage)
      showToast(`Failed to save changes: ${errorMessage}`, "error")
    } finally {
      setIsSaving(false)
    }
  }

  // Function to delete an analysis
  const deleteAnalysis = async (analysisId: string) => {
    if (!supabase) return

    try {
      setIsDeleting(true)
      console.log("Deleting analysis:", analysisId)

      const { error } = await supabase.from("website_analysis").delete().eq("id", analysisId)

      if (error) {
        console.error("Error deleting analysis:", error)
        showToast(`Failed to delete analysis: ${error.message}`, "error")
        setIsDeleting(false)
        return
      }

      // Update the local state
      setAnalyses((prev) => prev.filter((a) => a.id !== analysisId))
      showToast("Analysis deleted successfully", "success")

      // If we were editing this analysis, cancel editing
      if (editingAnalysis?.id === analysisId) {
        cancelEditing()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      console.error("Error deleting analysis:", errorMessage)
      showToast(`Failed to delete analysis: ${errorMessage}`, "error")
    } finally {
      setIsDeleting(false)
    }
  }

  // Function to refresh analyses
  const refreshAnalyses = async () => {
    if (!supabase || !user) return
    await fetchAnalyses(supabase, user.id)
  }

  // Function to update ICP field
  const updateICPField = (field: ArrayFieldKeys, index: number, value: string) => {
    if (!editedICP) return

    setEditedICP((prev) => {
      if (!prev) return prev
      const newICP = { ...prev }
      const fieldArray = [...newICP[field]]
      fieldArray[index] = value
      newICP[field] = fieldArray
      return newICP
    })
  }

  // Function to add item to ICP field array
  const addICPItem = (field: ArrayFieldKeys) => {
    if (!editedICP) return

    setEditedICP((prev) => {
      if (!prev) return prev
      const newICP = { ...prev }
      const fieldArray = [...newICP[field]]
      fieldArray.push("")
      newICP[field] = fieldArray
      return newICP
    })
  }

  // Function to remove item from ICP field array
  const removeICPItem = (field: ArrayFieldKeys, index: number) => {
    if (!editedICP) return

    setEditedICP((prev) => {
      if (!prev) return prev
      const newICP = { ...prev }
      const fieldArray = [...newICP[field]]
      fieldArray.splice(index, 1)
      newICP[field] = fieldArray
      return newICP
    })
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col font-poppins bg-white">
        <main className="flex-grow flex items-center justify-center">
          <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <AlertCircle size={56} className="text-red-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">Error</h1>
              <p className="text-red-600 mb-8 text-lg">{error}</p>
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-gradient-to-r from-[#294df6] to-[#3a5bff] hover:from-[#1a3ca8] hover:to-[#2a4ac8] text-white px-8 py-3 rounded-full transition-all font-medium"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col font-poppins bg-white">
        <main className="flex-grow flex items-center justify-center">
          <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-8">
                <div className="relative w-32 h-32">
                  <div className="w-full h-full border-t-4 border-[#294df6] rounded-full animate-spin"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-t-4 border-[#7733ee] rounded-full animate-spin-slow"></div>
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-6">Loading Website Analyses</h1>
              <p className="text-gray-600 max-w-md mx-auto">
                We're retrieving your saved website analyses. This will only take a moment.
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col font-poppins bg-white">
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Website Analysis Settings</h1>
                <p className="text-gray-600 mt-2">View and edit your saved website analyses</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={refreshAnalyses}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                  Refresh
                </button>
                {analyses.length > 0 && !isEditMode && (
                  <button
                    onClick={() => {
                      setIsEditMode(true)
                      if (!editingAnalysis && analyses.length > 0) {
                        startEditing(analyses[0])
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            {analyses.length === 0 ? (
              <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-50 rounded-full">
                    <Globe size={32} className="text-[#294df6]" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">No Website Analyses Found</h2>
                <p className="text-gray-600 mb-6">
                  You haven't analyzed any websites yet. Go to the website analysis tool to get started.
                </p>
                <button
                  onClick={() => router.push("/onboarding")}
                  className="bg-gradient-to-r from-[#294df6] to-[#3a5bff] hover:from-[#1a3ca8] hover:to-[#2a4ac8] text-white px-6 py-2 rounded-full transition-all font-medium"
                >
                  Analyze a Website
                </button>
              </div>
            ) : (
              <div className="mb-10">
                {isEditMode && analyses.length > 1 && (
                  <div className="mb-6">
                    <label htmlFor="analysis-select" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Website Analysis
                    </label>
                    <select
                      id="analysis-select"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#294df6] focus:border-[#294df6]"
                      onChange={(e) => {
                        const selectedAnalysis = analyses.find((a) => a.id === e.target.value)
                        if (selectedAnalysis) {
                          startEditing(selectedAnalysis)
                        }
                      }}
                      value={editingAnalysis?.id || ""}
                    >
                      <option value="" disabled>
                        Select a website to edit
                      </option>
                      {analyses.map((analysis) => (
                        <option key={analysis.id} value={analysis.id}>
                          {analysis.url} ({new Date(analysis.updated_at).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {editingAnalysis ? (
                  <>
                    <div className="mb-4 flex justify-between items-center">
                      <div className="inline-flex items-center bg-blue-50 px-4 py-2 rounded-full text-[#294df6] font-medium">
                        <Globe size={18} className="mr-2" />
                        {editingAnalysis.url}
                      </div>
                      {isEditMode && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => deleteAnalysis(editingAnalysis.id)}
                            className="flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium"
                            disabled={isDeleting}
                          >
                            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex border-b border-gray-200 mb-6">
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
                      </button>
                    </div>

                    {activeTab === "summary" && (
                      <div className="animate-fadeIn">
                        {isEditMode ? (
                          <>
                            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
                              Website Summary
                            </label>
                            <textarea
                              id="summary"
                              rows={12}
                              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-[#294df6] focus:border-[#294df6] resize-none"
                              value={editedSummary}
                              onChange={(e) => setEditedSummary(e.target.value)}
                              placeholder="Enter website summary..."
                            />
                          </>
                        ) : (
                          <div className="prose max-w-none">
                            <h3 className="text-xl font-semibold mb-4">Website Summary</h3>
                            <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap">
                              {editingAnalysis.summary || "No summary available."}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "icp" && editingAnalysis.icp_data && (
                      <div className="animate-fadeIn">
                        <div className="grid gap-6 md:grid-cols-2">
                          {/* Industries */}
                          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <Building className="text-[#294df6] mr-2" size={20} />
                                <h3 className="font-semibold text-[#294df6]">Industries</h3>
                              </div>
                              {isEditMode && (
                                <button
                                  onClick={() => addICPItem("industries")}
                                  className="text-[#294df6] hover:text-[#1d4ed8] p-1 rounded-full hover:bg-blue-50"
                                >
                                  + Add
                                </button>
                              )}
                            </div>
                            <div className="space-y-2">
                              {isEditMode ? (
                                editedICP?.industries.map((industry, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                                      value={industry}
                                      onChange={(e) => updateICPField("industries", i, e.target.value)}
                                    />
                                    <button
                                      onClick={() => removeICPItem("industries", i)}
                                      className="text-red-500 hover:text-red-700 p-1"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <ul className="list-disc pl-5 space-y-1">
                                  {editingAnalysis.icp_data.industries.map((industry, i) => (
                                    <li key={i} className="text-gray-700">
                                      {industry}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>

                          {/* Job Titles */}
                          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold text-[#294df6]">Key Decision Makers</h3>
                              {isEditMode && (
                                <button
                                  onClick={() => addICPItem("jobTitles")}
                                  className="text-[#294df6] hover:text-[#1d4ed8] p-1 rounded-full hover:bg-blue-50"
                                >
                                  + Add
                                </button>
                              )}
                            </div>
                            <div className="space-y-2">
                              {isEditMode ? (
                                editedICP?.jobTitles.map((title, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                                      value={title}
                                      onChange={(e) => updateICPField("jobTitles", i, e.target.value)}
                                    />
                                    <button
                                      onClick={() => removeICPItem("jobTitles", i)}
                                      className="text-red-500 hover:text-red-700 p-1"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <ul className="list-disc pl-5 space-y-1">
                                  {editingAnalysis.icp_data.jobTitles.map((title, i) => (
                                    <li key={i} className="text-gray-700">
                                      {title}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>

                          {/* Pain Points */}
                          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <AlertCircle className="text-[#294df6] mr-2" size={20} />
                                <h3 className="font-semibold text-[#294df6]">Pain Points</h3>
                              </div>
                              {isEditMode && (
                                <button
                                  onClick={() => addICPItem("painPoints")}
                                  className="text-[#294df6] hover:text-[#1d4ed8] p-1 rounded-full hover:bg-blue-50"
                                >
                                  + Add
                                </button>
                              )}
                            </div>
                            <div className="space-y-2">
                              {isEditMode ? (
                                editedICP?.painPoints.map((point, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                                      value={point}
                                      onChange={(e) => updateICPField("painPoints", i, e.target.value)}
                                    />
                                    <button
                                      onClick={() => removeICPItem("painPoints", i)}
                                      className="text-red-500 hover:text-red-700 p-1"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <ul className="list-disc pl-5 space-y-1">
                                  {editingAnalysis.icp_data.painPoints.map((point, i) => (
                                    <li key={i} className="text-gray-700">
                                      {point}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>

                          {/* Goals */}
                          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <Goal className="text-[#294df6] mr-2" size={20} />
                                <h3 className="font-semibold text-[#294df6]">Goals</h3>
                              </div>
                              {isEditMode && (
                                <button
                                  onClick={() => addICPItem("goals")}
                                  className="text-[#294df6] hover:text-[#1d4ed8] p-1 rounded-full hover:bg-blue-50"
                                >
                                  + Add
                                </button>
                              )}
                            </div>
                            <div className="space-y-2">
                              {isEditMode ? (
                                editedICP?.goals.map((goal, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                                      value={goal}
                                      onChange={(e) => updateICPField("goals", i, e.target.value)}
                                    />
                                    <button
                                      onClick={() => removeICPItem("goals", i)}
                                      className="text-red-500 hover:text-red-700 p-1"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <ul className="list-disc pl-5 space-y-1">
                                  {editingAnalysis.icp_data.goals.map((goal, i) => (
                                    <li key={i} className="text-gray-700">
                                      {goal}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {isEditMode && (
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          onClick={() => {
                            setIsEditMode(false)
                            if (analyses.length > 1) {
                              cancelEditing()
                            }
                          }}
                          className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                          disabled={isSaving}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            saveAnalysis()
                            setIsEditMode(false)
                          }}
                          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#294df6] to-[#3a5bff] hover:from-[#1a3ca8] hover:to-[#2a4ac8] text-white rounded-lg transition-colors"
                          disabled={isSaving}
                        >
                          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                          {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-600">No analysis selected. Please refresh or try again.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

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
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
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
      `}</style>
    </div>
  )
}