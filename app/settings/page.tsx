"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/app/components/sidebar"
import { createClient } from "@/utitls/supabase/client"
import { Menu } from "lucide-react"

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
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
  }, [supabase, router])

  // Handle audience settings form submission
  const handleAudienceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!user) return

    const settings = {
      user_id: user.id,
      target_audience: audienceSettings.target_audience,
      reading_level: audienceSettings.reading_level,
      tone_preference: audienceSettings.tone_preference,
      audience_goals: audienceSettings.audience_goals || null,
      updated_at: new Date().toISOString(),
    }

    const { data: existing, error: fetchError } = await supabase
      .from("audience_settings")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      setError("Failed to check existing settings: " + fetchError.message)
      return
    }

    if (existing) {
      const { error } = await supabase.from("audience_settings").update(settings).eq("user_id", user.id)
      if (error) {
        setError("Failed to update audience settings: " + error.message)
      } else {
        setSuccess("Audience settings updated!")
      }
    } else {
      const { error } = await supabase.from("audience_settings").insert(settings)
      if (error) {
        setError("Failed to save audience settings: " + error.message)
      } else {
        setSuccess("Audience settings saved!")
      }
    }
  }

  // Handle keyword form submission
  const handleKeywordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!user) return

    const keywordData = {
      user_id: user.id,
      keyword: newKeyword.keyword,
      priority: newKeyword.priority,
      difficulty: newKeyword.difficulty,
      usage_context: newKeyword.usage_context || null,
    }

    const { error } = await supabase.from("keywords_to_be_used").insert(keywordData)
    if (error) {
      setError("Failed to save keyword: " + error.message)
    } else {
      setSuccess("Keyword added!")
      setKeywords([...keywords, { ...keywordData, id: Date.now().toString() }]) // Temp ID until refresh
      setNewKeyword({ keyword: "", priority: 3, difficulty: "medium", usage_context: "" })
      // Fetch updated keywords to get real ID
      const { data: updatedKeywords } = await supabase.from("keywords_to_be_used").select("*").eq("user_id", user.id)
      setKeywords(updatedKeywords || [])
    }
  }

  // Handle keyword deletion
  const handleDeleteKeyword = async (keywordId: string) => {
    setError(null)
    setSuccess(null)

    if (!user) return

    const { error } = await supabase.from("keywords_to_be_used").delete().eq("id", keywordId).eq("user_id", user.id)
    if (error) {
      setError("Failed to delete keyword: " + error.message)
    } else {
      setSuccess("Keyword deleted!")
      setKeywords(keywords.filter((k) => k.id !== keywordId))
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">Loading settings...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <button
        className="fixed top-4 left-4 z-40 md:hidden bg-orange-500 text-white p-2 rounded-md"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
      </button>
      <div
        className={`fixed left-0 top-0 h-full w-64 transition-transform duration-300 ease-in-out transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-30 bg-white shadow-lg`}
      >
        <Sidebar subscription={subscription} />
      </div>
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
      <div className="flex-1 md:ml-64 p-6 pt-16 md:pt-6 overflow-auto transition-all duration-300 ease-in-out">
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-3xl font-bold mb-8">Blog Settings</h1>

          {error && <p className="text-red-600 mb-4">{error}</p>}
          {success && <p className="text-green-600 mb-4">{success}</p>}

          {/* Audience Settings Form */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Audience Settings</h2>
            <form onSubmit={handleAudienceSubmit} className="space-y-6 bg-gray-100 p-6 rounded-lg shadow">
              <div>
                <label htmlFor="target_audience" className="block text-sm font-medium text-gray-700">
                  Target Audience (e.g., "small business owners", "tech entrepreneurs")
                </label>
                <input
                  type="text"
                  name="target_audience"
                  id="target_audience"
                  value={audienceSettings.target_audience}
                  onChange={(e) => setAudienceSettings({ ...audienceSettings, target_audience: e.target.value })}
                  placeholder="Who's your crew?"
                  className="mt-1 block w-full border rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="reading_level" className="block text-sm font-medium text-gray-700">
                  Reading Level
                </label>
                <select
                  name="reading_level"
                  id="reading_level"
                  value={audienceSettings.reading_level}
                  onChange={(e) => setAudienceSettings({ ...audienceSettings, reading_level: e.target.value })}
                  className="mt-1 block w-full border rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label htmlFor="tone_preference" className="block text-sm font-medium text-gray-700">
                  Tone Preference
                </label>
                <select
                  name="tone_preference"
                  id="tone_preference"
                  value={audienceSettings.tone_preference}
                  onChange={(e) => setAudienceSettings({ ...audienceSettings, tone_preference: e.target.value })}
                  className="mt-1 block w-full border rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                  <option value="humorous">Humorous</option>
                  <option value="inspirational">Inspirational</option>
                </select>
              </div>

              <div>
                <label htmlFor="audience_goals" className="block text-sm font-medium text-gray-700">
                  Audience Goals (optional)
                </label>
                <input
                  type="text"
                  name="audience_goals"
                  id="audience_goals"
                  value={audienceSettings.audience_goals}
                  onChange={(e) => setAudienceSettings({ ...audienceSettings, audience_goals: e.target.value })}
                  placeholder="What do they want? (e.g., grow revenue)"
                  className="mt-1 block w-full border rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Save Audience Settings
              </button>
            </form>
          </section>

          {/* Keywords Form */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Keywords to Use</h2>
            <form onSubmit={handleKeywordSubmit} className="space-y-6 bg-gray-100 p-6 rounded-lg shadow">
              <div>
                <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">
                  Keyword
                </label>
                <input
                  type="text"
                  name="keyword"
                  id="keyword"
                  value={newKeyword.keyword}
                  onChange={(e) => setNewKeyword({ ...newKeyword, keyword: e.target.value })}
                  placeholder="e.g., startup growth"
                  className="mt-1 block w-full border rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority (1-5)
                </label>
                <input
                  type="number"
                  name="priority"
                  id="priority"
                  min="1"
                  max="5"
                  value={newKeyword.priority}
                  onChange={(e) => setNewKeyword({ ...newKeyword, priority: Number.parseInt(e.target.value) || 3 })}
                  className="mt-1 block w-full border rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  id="difficulty"
                  value={newKeyword.difficulty}
                  onChange={(e) => setNewKeyword({ ...newKeyword, difficulty: e.target.value })}
                  className="mt-1 block w-full border rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="usage_context" className="block text-sm font-medium text-gray-700">
                  Usage Context (optional)
                </label>
                <input
                  type="text"
                  name="usage_context"
                  id="usage_context"
                  value={newKeyword.usage_context}
                  onChange={(e) => setNewKeyword({ ...newKeyword, usage_context: e.target.value })}
                  placeholder="e.g., use in headers"
                  className="mt-1 block w-full border rounded-md p-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Add Keyword
              </button>
            </form>

            {/* Display Existing Keywords */}
            {keywords.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-medium mb-2">Your Keywords</h3>
                <ul className="space-y-4">
                  {keywords.map((keyword) => (
                    <li key={keyword.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                      <div>
                        <p>
                          <strong>{keyword.keyword}</strong>
                        </p>
                        <p className="text-sm text-gray-600">
                          Priority: {keyword.priority} | Difficulty: {keyword.difficulty} | Context:{" "}
                          {keyword.usage_context || "None"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteKeyword(keyword.id)}
                        className="text-red-600 hover:text-red-800 focus:outline-none"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
;<style jsx global>{`
  @media (max-width: 768px) {
    body {
      overflow-x: hidden;
    }
  }
`}</style>

