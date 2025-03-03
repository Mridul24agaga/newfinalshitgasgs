"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { Menu } from "lucide-react"
import { Sidebar } from "@/app/components/sidebar"

interface BlogPreference {
  id?: number
  user_id: string
  purpose_of_blogging: string | null
  blog_types: string | null
  tone_of_blog: string | null
  select_audience_group: string | null
  point_of_view: string | null
  creativity_level: string | null
  structure: string | null
  target_countries: string | null
  language: string | null
  call_to_action: string | null
  internal_linking: string | null
  external_linking: string | null
}

interface Subscription {
  plan_id: string
  credits: number
}

export default function BlogPreferencesPage() {
  const [blogPreference, setBlogPreference] = useState<BlogPreference>({
    user_id: "",
    purpose_of_blogging: "",
    blog_types: "",
    tone_of_blog: "",
    select_audience_group: "",
    point_of_view: "",
    creativity_level: "",
    structure: "",
    target_countries: "",
    language: "",
    call_to_action: "",
    internal_linking: "",
    external_linking: "",
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()
        if (authError || !user) {
          throw new Error("You must be logged in to view this page.")
        }

        const [blogPreferencesResponse, subscriptionResponse] = await Promise.all([
          supabase.from("blog_preferences").select("*").eq("user_id", user.id).single(),
          supabase.from("subscriptions").select("*").eq("user_id", user.id).single(),
        ])

        if (blogPreferencesResponse.error && blogPreferencesResponse.error.code !== "PGRST116") {
          throw new Error(`Failed to fetch blog preferences: ${blogPreferencesResponse.error.message}`)
        }

        if (subscriptionResponse.error) {
          throw new Error(`Failed to fetch subscription: ${subscriptionResponse.error.message}`)
        }

        if (blogPreferencesResponse.data) {
          setBlogPreference({ ...blogPreferencesResponse.data, user_id: user.id })
        } else {
          setBlogPreference((prev) => ({ ...prev, user_id: user.id }))
        }

        if (subscriptionResponse.data) {
          setSubscription(subscriptionResponse.data)
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setBlogPreference((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await supabase.from("blog_preferences").upsert(blogPreference)
      if (error) throw new Error(`Failed to save blog preferences: ${error.message}`)
      setSuccess("Blog preferences saved successfully!")
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
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
          className="fixed top-4 left-4 z-40 md:hidden bg-orange-500 text-white p-2 rounded-md"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">{isSidebarOpen ? "Close menu" : "Open menu"}</span>
        </button>

        {/* Main Content */}
        <main className="p-6 pt-16 md:pt-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Create Blog Setting</h1>
              <p className="text-sm text-gray-500 mt-1">
                Create a new blog setting to automatically generate & publish articles to your website.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6 bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900">Content</h2>

                <div className="grid gap-6 md:grid-cols-2">
                  {[
                    {
                      label: "Purpose of Blogging",
                      name: "purpose_of_blogging",
                      placeholder: "e.g., Educate, Promote, Engage",
                    },
                    { label: "Blog Types", name: "blog_types", placeholder: "e.g., How-to, Listicle, Review" },
                    {
                      label: "Tone of Blog",
                      name: "tone_of_blog",
                      placeholder: "e.g., Friendly, Professional, Humorous",
                    },
                    {
                      label: "Select Audience Group",
                      name: "select_audience_group",
                      placeholder: "e.g., Tech Enthusiasts, Business Owners",
                    },
                    { label: "Point of View", name: "point_of_view", placeholder: "e.g., First Person, Third Person" },
                    { label: "Structure", name: "structure", placeholder: "e.g., Intro-Body-Conclusion, List Format" },
                    { label: "Target Countries", name: "target_countries", placeholder: "e.g., USA, UK, Global" },
                    { label: "Language", name: "language", placeholder: "e.g., English, Spanish" },
                    {
                      label: "Call to Action",
                      name: "call_to_action",
                      placeholder: "e.g., 'Subscribe Now!', 'Learn More'",
                    },
                    {
                      label: "Setup Internal Linking",
                      name: "internal_linking",
                      placeholder: "e.g., /blog/tips, /resources/guide",
                    },
                    {
                      label: "Setup External Linking",
                      name: "external_linking",
                      placeholder: "e.g., https://example.com, https://source.org",
                    },
                  ].map((field) => (
                    <div key={field.name}>
                      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={blogPreference[field.name as keyof BlogPreference] || ""}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                        disabled={isLoading}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label htmlFor="creativity_level" className="block text-sm font-medium text-gray-700 mb-1">
                    Creativity Level
                  </label>
                  <select
                    id="creativity_level"
                    name="creativity_level"
                    value={blogPreference.creativity_level || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    disabled={isLoading}
                  >
                    <option value="">Select creativity level</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/company-database")}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Blog Preferences"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

