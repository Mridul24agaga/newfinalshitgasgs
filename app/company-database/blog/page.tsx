"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import {
  Menu,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  BookOpen,
  Users,
  MessageSquare,
  Globe,
  Languages,
  ExternalLink,
  LinkIcon,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react"
import { Sidebar } from "@/app/components/layout/sidebar"
import { Saira } from "next/font/google"

// Initialize the Saira font
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-saira",
})

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
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBlogPreference((prev) => ({ ...prev, [name]: value }))

    // Clear success message when user starts editing
    if (success) setSuccess(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await supabase.from("blog_preferences").upsert(blogPreference)
      if (error) throw new Error(`Failed to save blog preferences: ${error.message}`)
      setSuccess("Blog preferences saved successfully! Your settings will be applied to all future content.")

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  // Helper function to render form fields with consistent styling
  const renderField = (
    label: string,
    name: keyof BlogPreference,
    placeholder: string,
    icon: React.ReactNode,
    type: "input" | "textarea" | "select" = "input",
    options?: string[],
  ) => {
    return (
      <div className="relative">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
          {icon}
          <span className="ml-2">{label}</span>
        </label>
        {type === "input" && (
          <input
            type="text"
            id={name}
            name={name}
            value={blogPreference[name] || ""}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            disabled={isSaving}
          />
        )}
        {type === "textarea" && (
          <textarea
            id={name}
            name={name}
            value={blogPreference[name] || ""}
            onChange={handleInputChange}
            placeholder={placeholder}
            rows={3}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            disabled={isSaving}
          />
        )}
        {type === "select" && options && (
          <select
            id={name}
            name={name}
            value={blogPreference[name] || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            disabled={isSaving}
          >
            <option value="">Select an option</option>
            {options.map((option) => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`${saira.className} flex min-h-screen bg-gray-50`}>
        <div className="fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform md:translate-x-0 -translate-x-full">
          <Sidebar subscription={subscription} />
        </div>
        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <div className="text-center p-8">
            <Loader2 className="h-10 w-10 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your blog preferences...</p>
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
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <BookOpen className="h-6 w-6 text-orange-500 mr-2" />
                    Blog Settings
                  </h1>
                  <p className="text-gray-500 mt-1 max-w-2xl">
                    Configure how your blog content will be generated. These settings will be applied to all future
                    content.
                  </p>
                </div>
                <div className="hidden md:block">
                  <button
                    type="button"
                    onClick={() => router.push("/company-database")}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back to Database
                  </button>
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

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Content Section */}
              <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white p-5">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Sparkles className="h-5 w-5 text-orange-500 mr-2" />
                    Content Strategy
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Define the purpose and style of your blog content</p>
                </div>

                <div className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {renderField(
                      "Purpose of Blogging",
                      "purpose_of_blogging",
                      "e.g., Educate, Promote, Engage",
                      <Info className="h-4 w-4 text-orange-500" />,
                    )}

                    {renderField(
                      "Blog Types",
                      "blog_types",
                      "e.g., How-to, Listicle, Review",
                      <BookOpen className="h-4 w-4 text-orange-500" />,
                    )}

                    {renderField(
                      "Tone of Blog",
                      "tone_of_blog",
                      "e.g., Friendly, Professional, Humorous",
                      <MessageSquare className="h-4 w-4 text-orange-500" />,
                    )}

                    {renderField(
                      "Creativity Level",
                      "creativity_level",
                      "",
                      <Sparkles className="h-4 w-4 text-orange-500" />,
                      "select",
                      ["Low", "Medium", "High"],
                    )}
                  </div>
                </div>
              </div>

              {/* Audience Section */}
              <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white p-5">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Users className="h-5 w-5 text-orange-500 mr-2" />
                    Audience & Targeting
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Define who your content is for and how to reach them</p>
                </div>

                <div className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {renderField(
                      "Target Audience",
                      "select_audience_group",
                      "e.g., Tech Enthusiasts, Business Owners",
                      <Users className="h-4 w-4 text-orange-500" />,
                    )}

                    {renderField(
                      "Target Countries",
                      "target_countries",
                      "e.g., USA, UK, Global",
                      <Globe className="h-4 w-4 text-orange-500" />,
                    )}

                    {renderField(
                      "Language",
                      "language",
                      "e.g., English, Spanish",
                      <Languages className="h-4 w-4 text-orange-500" />,
                    )}

                    {renderField(
                      "Point of View",
                      "point_of_view",
                      "e.g., First Person, Third Person",
                      <MessageSquare className="h-4 w-4 text-orange-500" />,
                    )}
                  </div>
                </div>
              </div>

              {/* Structure Section */}
              <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white p-5">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <BookOpen className="h-5 w-5 text-orange-500 mr-2" />
                    Structure & Links
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Define how your content is structured and connected</p>
                </div>

                <div className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {renderField(
                      "Content Structure",
                      "structure",
                      "e.g., Intro-Body-Conclusion, List Format",
                      <BookOpen className="h-4 w-4 text-orange-500" />,
                    )}

                    {renderField(
                      "Call to Action",
                      "call_to_action",
                      "e.g., 'Subscribe Now!', 'Learn More'",
                      <ArrowRight className="h-4 w-4 text-orange-500" />,
                    )}

                    {renderField(
                      "Internal Linking",
                      "internal_linking",
                      "e.g., /blog/tips, /resources/guide",
                      <LinkIcon className="h-4 w-4 text-orange-500" />,
                      "textarea",
                    )}

                    {renderField(
                      "External Linking",
                      "external_linking",
                      "e.g., https://example.com, https://source.org",
                      <ExternalLink className="h-4 w-4 text-orange-500" />,
                      "textarea",
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-4 z-20 shadow-lg md:static md:bg-transparent md:border-0 md:shadow-none md:p-0">
                <button
                  type="button"
                  onClick={() => router.push("/company-database")}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center shadow-sm"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Blog Preferences
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

