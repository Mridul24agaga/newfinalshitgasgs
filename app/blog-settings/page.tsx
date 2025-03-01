"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utitls/supabase/client"
import { getUserBlogSettings } from "@/utitls/blogSettings"

interface BlogSettings {
  id: string
  user_id: string
  purpose: string
  blog_type: string
  tone: string
  audience_group: string
  point_of_view: string
  creativity_level: number
  blog_structure: string
  target_countries: string[]
  language: string
  call_to_action: string
  internal_links: string[]
  external_links: string[]
}

export default function BlogSettingsPage() {
  const [settings, setSettings] = useState<BlogSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Please sign in to access blog settings")
      }

      const userSettings = await getUserBlogSettings(user.id)
      setSettings(userSettings)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!settings) return

    try {
      setSaving(true)
      setError(null)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const { error } = await supabase.from("user_blog_settings").upsert({
        ...settings,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <svg
          className="animate-spin h-8 w-8 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="ml-2 text-lg">Loading settings...</span>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl py-10 px-4">
      <h1 className="mb-8 text-4xl font-bold">Blog Settings</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-8">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Purpose of Blogging</label>
          <select
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={settings?.purpose || ""}
            onChange={(e) => setSettings((prev) => ({ ...prev!, purpose: e.target.value }))}
          >
            <option value="">Select your blogging purpose</option>
            <option value="educate">Educate & Inform</option>
            <option value="entertain">Entertain</option>
            <option value="inspire">Inspire</option>
            <option value="sell">Sell Products/Services</option>
            <option value="build">Build Community</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Blog Type</label>
          <select
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={settings?.blog_type || ""}
            onChange={(e) => setSettings((prev) => ({ ...prev!, blog_type: e.target.value }))}
          >
            <option value="">Select blog type</option>
            <option value="personal">Personal Blog</option>
            <option value="business">Business Blog</option>
            <option value="niche">Niche Blog</option>
            <option value="news">News Blog</option>
            <option value="review">Review Blog</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Tone of Blog</label>
          <select
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={settings?.tone || ""}
            onChange={(e) => setSettings((prev) => ({ ...prev!, tone: e.target.value }))}
          >
            <option value="">Select blog tone</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="humorous">Humorous</option>
            <option value="authoritative">Authoritative</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Select Audience Group</label>
          <select
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={settings?.audience_group || ""}
            onChange={(e) => setSettings((prev) => ({ ...prev!, audience_group: e.target.value }))}
          >
            <option value="">Select target audience</option>
            <option value="general">General Public</option>
            <option value="professionals">Professionals</option>
            <option value="students">Students</option>
            <option value="experts">Industry Experts</option>
            <option value="beginners">Beginners</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Point of View</label>
          <select
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={settings?.point_of_view || ""}
            onChange={(e) => setSettings((prev) => ({ ...prev!, point_of_view: e.target.value }))}
          >
            <option value="">Select point of view</option>
            <option value="first">First Person (I, We)</option>
            <option value="second">Second Person (You)</option>
            <option value="third">Third Person (They, It)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Creativity Level</label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="100"
              value={settings?.creativity_level || 50}
              onChange={(e) => setSettings((prev) => ({ ...prev!, creativity_level: Number.parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="w-12 text-center">{settings?.creativity_level || 50}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Blog Structure</label>
          <select
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={settings?.blog_structure || ""}
            onChange={(e) => setSettings((prev) => ({ ...prev!, blog_structure: e.target.value }))}
          >
            <option value="">Select blog structure</option>
            <option value="howto">How-to Guide</option>
            <option value="listicle">Listicle</option>
            <option value="comparison">Comparison</option>
            <option value="case-study">Case Study</option>
            <option value="tutorial">Tutorial</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Target Countries</label>
          <input
            type="text"
            placeholder="Enter countries (comma-separated)"
            value={settings?.target_countries?.join(", ") || ""}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev!,
                target_countries: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              }))
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Language</label>
          <select
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={settings?.language || ""}
            onChange={(e) => setSettings((prev) => ({ ...prev!, language: e.target.value }))}
          >
            <option value="">Select language</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Call to Action</label>
          <textarea
            placeholder="Enter your default call to action"
            value={settings?.call_to_action || ""}
            onChange={(e) => setSettings((prev) => ({ ...prev!, call_to_action: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Internal Links</label>
          <textarea
            placeholder="Enter internal links (one per line)"
            value={settings?.internal_links?.join("\n") || ""}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev!,
                internal_links: e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              }))
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">External Links</label>
          <textarea
            placeholder="Enter external links (one per line)"
            value={settings?.external_links?.join("\n") || ""}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev!,
                external_links: e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              }))
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
          />
        </div>

        <button
          onClick={saveSettings}
          disabled={saving}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </div>
          ) : (
            "Save Settings"
          )}
        </button>
      </div>
    </div>
  )
}

