"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/app/components/layout/sidebar"
import { createClient } from "@/utitls/supabase/client"
import {
  Menu,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
  Users,
  BookOpen,
  MessageSquare,
  ArrowLeft,
  Tag,
  Trash2,
  PlusCircle,
  Target,
  Sparkles,
  Sliders,
} from "lucide-react"
import { Saira } from "next/font/google"

// Initialize the Saira font
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-saira",
})

export default function SettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [audienceSettings, setAudienceSettings] = useState({
    target_audience: "",
    reading_level: "intermediate",
    tone_preference: "casual",
    audience_goals: "",
  })
  const [keywords, setKeywords] = useState<any[]>([])
  const [newKeyword, setNewKeyword] = useState({
    keyword: "",
    priority: 3,
    difficulty: "medium",
    usage_context: "",
  })
  const [loading, setLoading] = useState(true)
  const [savingAudience, setSavingAudience] = useState(false)
  const [savingKeyword, setSavingKeyword] = useState(false)
  const [deletingKeyword, setDeletingKeyword] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [subscription, setSubscription] = useState<{
    plan_id: string
    credits: number
  } | null>(null)

  // Fetch user and data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Get authenticated user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !user) {
        setError("Not authenticated. Redirecting to login...")
        setTimeout(() => router.push("/login"), 2000)
        return
      }
      setUser(user)

      // Fetch subscription data
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from("subscriptions")
        .select("plan_id, credits")
        .eq("user_id", user.id)
        .single()

      if (subscriptionError) {
        if (subscriptionError.code !== "PGRST116") {
          console.error("Subscription fetch error:", subscriptionError)
        }
        setSubscription(null)
      } else if (subscriptionData) {
        setSubscription({
          plan_id: subscriptionData.plan_id,
          credits: subscriptionData.credits || 0,
        })
      }

      // Fetch audience settings
      const { data: audienceData, error: audienceError } = await supabase
        .from("audience_settings")
        .select("*")
        .eq("user_id", user.id)
        .single()
      if (audienceError && audienceError.code !== "PGRST116") {
        console.error("Audience fetch error:", audienceError)
        setError("Failed to load audience settings.")
      } else if (audienceData) {
        setAudienceSettings({
          target_audience: audienceData.target_audience,
          reading_level: audienceData.reading_level,
          tone_preference: audienceData.tone_preference,
          audience_goals: audienceData.audience_goals || "",
        })
      }

      // Fetch keywords
      const { data: keywordsData, error: keywordsError } = await supabase
        .from("keywords_to_be_used")
        .select("*")
        .eq("user_id", user.id)
      if (keywordsError) {
        console.error("Keywords fetch error:", keywordsError)
        setError("Failed to load keywords.")
      } else {
        setKeywords(keywordsData || [])
      }

      setLoading(false)
    }

    fetchData()

    // Handle window resize for sidebar
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [supabase, router])

  // Handle audience settings form submission
  const handleAudienceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSavingAudience(true)

    if (!user) return

    const settings = {
      user_id: user.id,
      target_audience: audienceSettings.target_audience,
      reading_level: audienceSettings.reading_level,
      tone_preference: audienceSettings.tone_preference,
      audience_goals: audienceSettings.audience_goals || null,
      updated_at: new Date().toISOString(),
    }

    try {
      const { data: existing, error: fetchError } = await supabase
        .from("audience_settings")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (fetchError && fetchError.code !== "PGRST116") {
        throw new Error("Failed to check existing settings: " + fetchError.message)
      }

      if (existing) {
        const { error } = await supabase.from("audience_settings").update(settings).eq("user_id", user.id)
        if (error) {
          throw new Error("Failed to update audience settings: " + error.message)
        }
        setSuccess("Audience settings updated successfully!")
      } else {
        const { error } = await supabase.from("audience_settings").insert(settings)
        if (error) {
          throw new Error("Failed to save audience settings: " + error.message)
        }
        setSuccess("Audience settings saved successfully!")
      }

      // Mark audience settings as completed in subscriptions table
      await supabase.from("subscriptions").update({ audience_keywords_completed: true }).eq("user_id", user.id)

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setSavingAudience(false)
    }
  }

  // Handle keyword form submission
  const handleKeywordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSavingKeyword(true)

    if (!user) return

    try {
      const keywordData = {
        user_id: user.id,
        keyword: newKeyword.keyword,
        priority: newKeyword.priority,
        difficulty: newKeyword.difficulty,
        usage_context: newKeyword.usage_context || null,
      }

      const { error } = await supabase.from("keywords_to_be_used").insert(keywordData)
      if (error) {
        throw new Error("Failed to save keyword: " + error.message)
      }

      setSuccess("Keyword added successfully!")
      setKeywords([...keywords, { ...keywordData, id: Date.now().toString() }]) // Temp ID until refresh
      setNewKeyword({ keyword: "", priority: 3, difficulty: "medium", usage_context: "" })

      // Fetch updated keywords to get real ID
      const { data: updatedKeywords } = await supabase.from("keywords_to_be_used").select("*").eq("user_id", user.id)
      setKeywords(updatedKeywords || [])

      // Mark audience settings as completed in subscriptions table
      await supabase.from("subscriptions").update({ audience_keywords_completed: true }).eq("user_id", user.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setSavingKeyword(false)
    }
  }

  // Handle keyword deletion
  const handleDeleteKeyword = async (keywordId: string) => {
    setError(null)
    setSuccess(null)
    setDeletingKeyword(keywordId)

    if (!user) return

    try {
      const { error } = await supabase.from("keywords_to_be_used").delete().eq("id", keywordId).eq("user_id", user.id)
      if (error) {
        throw new Error("Failed to delete keyword: " + error.message)
      }
      setSuccess("Keyword deleted successfully!")
      setKeywords(keywords.filter((k) => k.id !== keywordId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setDeletingKeyword(null)
    }
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Get priority color
  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "bg-gray-100 text-gray-800 border-gray-200"
      case 2:
        return "bg-blue-100 text-blue-800 border-blue-200"
      case 3:
        return "bg-purple-100 text-purple-800 border-purple-200"
      case 4:
        return "bg-orange-100 text-orange-800 border-orange-200"
      case 5:
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className={`${saira.className} flex min-h-screen bg-gray-50`}>
        <div className="fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform md:translate-x-0 -translate-x-full">
          <Sidebar subscription={subscription} />
        </div>
        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <div className="text-center p-8">
            <Loader2 className="h-10 w-10 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your settings...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={`${saira.className} flex min-h-screen bg-gray-50`}>
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${saira.className} flex min-h-screen bg-gray-50`}>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <Sidebar subscription={subscription} />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 transition-all duration-300 ease-in-out">
        {/* Hamburger Menu */}
        <button
          className="fixed top-4 left-4 z-40 md:hidden bg-orange-500 text-white p-2 rounded-md shadow-md hover:bg-orange-600 transition-colors"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">{isSidebarOpen ? "Close menu" : "Open menu"}</span>
        </button>

        {/* Main Content */}
        <main className="p-6 pt-16 md:pt-6 pb-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <button
                    onClick={() => router.push("/company-database")}
                    className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-2"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span className="text-sm">Back to Company Database</span>
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Sliders className="h-6 w-6 text-orange-500 mr-2" />
                    Audience & Keywords
                  </h1>
                  <p className="text-gray-500 mt-1 max-w-2xl">
                    Define your target audience and important keywords to help the AI create more relevant content.
                  </p>
                </div>
              </div>

              {/* Success message */}
              {success && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Audience Settings Form */}
            <div className="mb-8">
              <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white p-5">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Users className="h-5 w-5 text-orange-500 mr-2" />
                    Audience Settings
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Define who your content is for and how it should be written
                  </p>
                </div>

                <div className="p-6">
                  <form onSubmit={handleAudienceSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="target_audience"
                          className="block text-sm font-medium text-gray-700 flex items-center"
                        >
                          <Target className="h-4 w-4 text-orange-500 mr-2" />
                          Target Audience
                        </label>
                        <input
                          type="text"
                          name="target_audience"
                          id="target_audience"
                          value={audienceSettings.target_audience}
                          onChange={(e) =>
                            setAudienceSettings({ ...audienceSettings, target_audience: e.target.value })
                          }
                          placeholder="e.g., small business owners, tech entrepreneurs"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                          required
                          disabled={savingAudience}
                        />
                        <p className="text-xs text-gray-500">Who is your content primarily created for?</p>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="audience_goals"
                          className="block text-sm font-medium text-gray-700 flex items-center"
                        >
                          <Target className="h-4 w-4 text-orange-500 mr-2" />
                          Audience Goals
                        </label>
                        <input
                          type="text"
                          name="audience_goals"
                          id="audience_goals"
                          value={audienceSettings.audience_goals}
                          onChange={(e) => setAudienceSettings({ ...audienceSettings, audience_goals: e.target.value })}
                          placeholder="e.g., grow revenue, learn new skills"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                          disabled={savingAudience}
                        />
                        <p className="text-xs text-gray-500">What does your audience want to achieve?</p>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="reading_level"
                          className="block text-sm font-medium text-gray-700 flex items-center"
                        >
                          <BookOpen className="h-4 w-4 text-orange-500 mr-2" />
                          Reading Level
                        </label>
                        <select
                          name="reading_level"
                          id="reading_level"
                          value={audienceSettings.reading_level}
                          onChange={(e) => setAudienceSettings({ ...audienceSettings, reading_level: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                          disabled={savingAudience}
                        >
                          <option value="basic">Basic - Simple language, short sentences</option>
                          <option value="intermediate">Intermediate - Balanced complexity</option>
                          <option value="advanced">Advanced - Sophisticated vocabulary</option>
                        </select>
                        <p className="text-xs text-gray-500">How complex should the language be?</p>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="tone_preference"
                          className="block text-sm font-medium text-gray-700 flex items-center"
                        >
                          <MessageSquare className="h-4 w-4 text-orange-500 mr-2" />
                          Tone Preference
                        </label>
                        <select
                          name="tone_preference"
                          id="tone_preference"
                          value={audienceSettings.tone_preference}
                          onChange={(e) =>
                            setAudienceSettings({ ...audienceSettings, tone_preference: e.target.value })
                          }
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                          disabled={savingAudience}
                        >
                          <option value="casual">Casual - Friendly and conversational</option>
                          <option value="formal">Formal - Professional and authoritative</option>
                          <option value="humorous">Humorous - Light-hearted and entertaining</option>
                          <option value="inspirational">Inspirational - Motivating and uplifting</option>
                        </select>
                        <p className="text-xs text-gray-500">What tone should your content have?</p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={savingAudience}
                        className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center shadow-sm"
                      >
                        {savingAudience ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Audience Settings
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Keywords Form */}
            <div className="mb-8">
              <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white p-5">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Tag className="h-5 w-5 text-orange-500 mr-2" />
                    Keywords to Use
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Add important keywords that should be included in your content
                  </p>
                </div>

                <div className="p-6">
                  <form onSubmit={handleKeywordSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 flex items-center">
                          <Tag className="h-4 w-4 text-orange-500 mr-2" />
                          Keyword
                        </label>
                        <input
                          type="text"
                          name="keyword"
                          id="keyword"
                          value={newKeyword.keyword}
                          onChange={(e) => setNewKeyword({ ...newKeyword, keyword: e.target.value })}
                          placeholder="e.g., startup growth, digital marketing"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                          required
                          disabled={savingKeyword}
                        />
                        <p className="text-xs text-gray-500">Enter a keyword or phrase to include in your content</p>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="usage_context"
                          className="block text-sm font-medium text-gray-700 flex items-center"
                        >
                          <MessageSquare className="h-4 w-4 text-orange-500 mr-2" />
                          Usage Context
                        </label>
                        <input
                          type="text"
                          name="usage_context"
                          id="usage_context"
                          value={newKeyword.usage_context}
                          onChange={(e) => setNewKeyword({ ...newKeyword, usage_context: e.target.value })}
                          placeholder="e.g., use in headers, intro paragraph"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                          disabled={savingKeyword}
                        />
                        <p className="text-xs text-gray-500">How or where should this keyword be used?</p>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 flex items-center">
                          <Sparkles className="h-4 w-4 text-orange-500 mr-2" />
                          Priority (1-5)
                        </label>
                        <input
                          type="range"
                          name="priority"
                          id="priority"
                          min="1"
                          max="5"
                          step="1"
                          value={newKeyword.priority}
                          onChange={(e) =>
                            setNewKeyword({ ...newKeyword, priority: Number.parseInt(e.target.value) || 3 })
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                          disabled={savingKeyword}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Low (1)</span>
                          <span className="font-medium text-orange-600">Current: {newKeyword.priority}</span>
                          <span>High (5)</span>
                        </div>
                        <p className="text-xs text-gray-500">How important is this keyword?</p>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="difficulty"
                          className="block text-sm font-medium text-gray-700 flex items-center"
                        >
                          <Target className="h-4 w-4 text-orange-500 mr-2" />
                          Difficulty
                        </label>
                        <select
                          name="difficulty"
                          id="difficulty"
                          value={newKeyword.difficulty}
                          onChange={(e) => setNewKeyword({ ...newKeyword, difficulty: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                          disabled={savingKeyword}
                        >
                          <option value="low">Low - Easy to rank for</option>
                          <option value="medium">Medium - Moderate competition</option>
                          <option value="high">High - Very competitive</option>
                        </select>
                        <p className="text-xs text-gray-500">How difficult is it to rank for this keyword?</p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={savingKeyword}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center shadow-sm"
                      >
                        {savingKeyword ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Keyword
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Display Existing Keywords */}
                  {keywords.length > 0 && (
                    <div className="mt-8 border-t border-gray-100 pt-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <Tag className="h-4 w-4 text-orange-500 mr-2" />
                        Your Keywords ({keywords.length})
                      </h3>
                      <div className="grid gap-3 md:grid-cols-2">
                        {keywords.map((keyword) => (
                          <div
                            key={keyword.id}
                            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-gray-900">{keyword.keyword}</h4>
                              <button
                                onClick={() => handleDeleteKeyword(keyword.id)}
                                disabled={deletingKeyword === keyword.id}
                                className="text-red-600 hover:text-red-800 focus:outline-none transition-colors p-1 rounded-full hover:bg-red-50"
                                aria-label="Delete keyword"
                              >
                                {deletingKeyword === keyword.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span
                                className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(keyword.priority)}`}
                              >
                                Priority: {keyword.priority}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(keyword.difficulty)}`}
                              >
                                {keyword.difficulty.charAt(0).toUpperCase() + keyword.difficulty.slice(1)} difficulty
                              </span>
                            </div>
                            {keyword.usage_context && (
                              <p className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">Context:</span> {keyword.usage_context}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

