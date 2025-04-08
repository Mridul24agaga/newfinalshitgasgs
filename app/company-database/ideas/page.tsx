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
  Youtube,
  FileText,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  ArrowLeft,
  RefreshCw,
  Link2,
  BookOpen,
  Sparkles,
  PlusCircle,
} from "lucide-react"
import { Sidebar } from "@/app/components/layout/sidebar"
import { Saira } from "next/font/google"

// Initialize the Saira font
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-saira",
})

// Define the ContentIdea interface
interface ContentIdea {
  id?: number
  user_id: string
  youtube_videos: string | null
  posts: string | null
  reddit: string | null
  quora: string | null
  document: string | null
  give_ideas: string | null
  give_topics: string | null
  etc: string | null
}

interface Subscription {
  plan_id: string
  credits: number
}

// Placeholder for callAzureOpenAI function (replace with actual implementation)
async function callAzureOpenAI(prompt: string, maxTokens: number): Promise<string> {
  return JSON.stringify([
    "AI in Healthcare",
    "Sustainable Tech",
    "Blockchain Basics",
    "Remote Work Trends",
    "Virtual Reality Future",
  ])
}

export default function ContentIdeasPage() {
  const [contentIdea, setContentIdea] = useState<ContentIdea>({
    user_id: "",
    youtube_videos: "",
    posts: "",
    reddit: "",
    quora: "",
    document: "",
    give_ideas: "",
    give_topics: "",
    etc: "",
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([])
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

        const [contentIdeasResponse, subscriptionResponse] = await Promise.all([
          supabase.from("content_ideas").select("*").eq("user_id", user.id),
          supabase.from("subscriptions").select("*").eq("user_id", user.id).single(),
        ])

        if (contentIdeasResponse.error) {
          throw new Error(`Failed to fetch content ideas: ${contentIdeasResponse.error.message}`)
        }

        if (subscriptionResponse.error) {
          throw new Error(`Failed to fetch subscription: ${subscriptionResponse.error.message}`)
        }

        if (contentIdeasResponse.data && contentIdeasResponse.data.length > 0) {
          const latestIdea = contentIdeasResponse.data.reduce((latest, current) =>
            latest.id && current.id && latest.id > current.id ? latest : current,
          )
          setContentIdea({ ...latestIdea, user_id: user.id })
        } else {
          setContentIdea((prev) => ({ ...prev, user_id: user.id }))
        }

        if (subscriptionResponse.data) {
          setSubscription(subscriptionResponse.data)
        }
      } catch (error) {
        console.error(`Error fetching data: ${error instanceof Error ? error.message : "Unknown error"}`)
        setError(`Failed to load data: ${error instanceof Error ? error.message : "Unknown error"}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // Handle window resize for sidebar
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [supabase])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContentIdea((prev) => ({ ...prev, [name]: value }))

    // Clear success message when user starts editing
    if (success) setSuccess(null)
    if (message) setMessage(null)
  }

  const generateAdditionalIdeas = async () => {
    const trimmedGiveIdeas = contentIdea.give_ideas?.trim()
    const trimmedGiveTopics = contentIdea.give_topics?.trim()

    if (!trimmedGiveIdeas && !trimmedGiveTopics) {
      setMessage("Please enter some ideas or topics to generate more suggestions.")
      return
    }

    setIsGenerating(true)
    setError(null)
    setMessage(null)

    try {
      const ideaPrompt = `
        Based on this user input for blog ideas: "${trimmedGiveIdeas || ""} ${trimmedGiveTopics || ""}", generate 5 unique, creative blog ideas or topics. Keep it natural and engaging, like you're brainstorming with a friend. Return a JSON array, e.g., ["Idea 1", "Idea 2"].
      `
      const additionalIdeas = await callAzureOpenAI(ideaPrompt, 200)
      const cleanedIdeas = additionalIdeas.replace(/```json\n?|\n?```/g, "").trim()
      let ideas: string[] = []
      try {
        ideas = JSON.parse(cleanedIdeas) || []
        setGeneratedIdeas(ideas)
      } catch (parseError) {
        console.error("Error parsing additional ideas:", parseError)
        setGeneratedIdeas(["Default Idea 1", "Default Idea 2"])
      }

      setMessage("New ideas generated! Click on any idea to add it to your list.")
    } catch (error) {
      console.error(`Error generating ideas: ${error instanceof Error ? error.message : "Unknown error"}`)
      setError(`Failed to generate ideas: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const addGeneratedIdea = (idea: string) => {
    const currentIdeas = contentIdea.give_ideas || ""
    const newIdeas = currentIdeas ? `${currentIdeas}, ${idea}` : idea
    setContentIdea((prev) => ({ ...prev, give_ideas: newIdeas }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedGiveIdeas = contentIdea.give_ideas?.trim()
    const trimmedGiveTopics = contentIdea.give_topics?.trim()

    if (!trimmedGiveIdeas && !trimmedGiveTopics) {
      setMessage("Please enter some ideas or topics to save.")
      return
    }

    setIsSaving(true)
    setError(null)
    setSuccess(null)
    setMessage(null)

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error("You must be logged in to save content ideas.")
      }

      const { error: upsertError } = await supabase.from("content_ideas").upsert({
        ...contentIdea,
        user_id: user.id,
      })

      if (upsertError) {
        throw new Error(`Failed to save content ideas: ${upsertError.message}`)
      }

      // Mark content ideas as completed in subscriptions table
      await supabase.from("subscriptions").update({ content_ideas_completed: true }).eq("user_id", user.id)

      console.log(`Content ideas saved/updated for user_id ${user.id}`)
      setSuccess("Content ideas saved successfully! Your ideas will be used to inspire your content.")

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error: unknown) {
      console.error(`Error saving content ideas: ${error instanceof Error ? error.message : "Unknown error"}`)
      setError(`Failed to save content ideas: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsSaving(false)
    }
  }

  // Helper function to render form fields with consistent styling
  const renderField = (
    label: string,
    name: keyof ContentIdea,
    placeholder: string,
    icon: React.ReactNode,
    type: "input" | "textarea" = "input",
    helpText?: string,
  ) => {
    return (
      <div className="space-y-2">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 flex items-center">
          {icon}
          <span className="ml-2">{label}</span>
        </label>
        {type === "input" && (
          <input
            type="text"
            id={name}
            name={name}
            value={contentIdea[name] || ""}
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
            value={contentIdea[name] || ""}
            onChange={handleInputChange}
            placeholder={placeholder}
            rows={3}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            disabled={isSaving}
          />
        )}
        {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
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
            <p className="text-gray-600">Loading your content ideas...</p>
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
                    <Lightbulb className="h-6 w-6 text-orange-500 mr-2" />
                    Content Ideas
                  </h1>
                  <p className="text-gray-500 mt-1 max-w-2xl">
                    Add content ideas and topics to inspire your blogs. Our AI will use these to generate more relevant
                    content.
                  </p>
                </div>
                <div className="hidden md:flex items-center bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
                  <Sparkles className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-sm font-medium text-orange-800">
                    {contentIdea.id ? "Ideas saved" : "New ideas"}
                  </span>
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

              {/* Info message */}
              {message && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                  <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">{message}</p>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Ideas & Topics Section */}
              <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white p-5">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Lightbulb className="h-5 w-5 text-orange-500 mr-2" />
                    Your Ideas & Topics
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Enter your own ideas or topics for content inspiration</p>
                </div>

                <div className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {renderField(
                      "Content Ideas",
                      "give_ideas",
                      "e.g., AI innovations, Marketing tips, SEO strategies",
                      <Lightbulb className="h-4 w-4 text-orange-500" />,
                      "textarea",
                      "Enter specific content ideas you'd like to write about (comma-separated)",
                    )}

                    {renderField(
                      "Content Topics",
                      "give_topics",
                      "e.g., Future of AI, Digital Marketing, Remote Work",
                      <BookOpen className="h-4 w-4 text-orange-500" />,
                      "textarea",
                      "Enter broader topics you'd like to cover (comma-separated)",
                    )}
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={generateAdditionalIdeas}
                      disabled={isGenerating || (!contentIdea.give_ideas && !contentIdea.give_topics)}
                      className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 flex items-center"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating Ideas...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Generate More Ideas
                        </>
                      )}
                    </button>

                    {/* Generated Ideas */}
                    {generatedIdeas.length > 0 && (
                      <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generated Ideas
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {generatedIdeas.map((idea, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => addGeneratedIdea(idea)}
                              className="px-3 py-1.5 bg-white text-blue-700 text-xs font-medium rounded-full border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors flex items-center"
                            >
                              <PlusCircle className="h-3 w-3 mr-1" />
                              {idea}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* External Sources Section */}
              <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white p-5">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Link2 className="h-5 w-5 text-orange-500 mr-2" />
                    External Sources
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Add links to external content that can inspire your blogs
                  </p>
                </div>

                <div className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {renderField(
                      "YouTube Videos",
                      "youtube_videos",
                      "e.g., https://youtube.com/video1, https://youtube.com/video2",
                      <Youtube className="h-4 w-4 text-orange-500" />,
                      "input",
                      "Links to YouTube videos related to your content (comma-separated)",
                    )}

                    {renderField(
                      "Blog Posts",
                      "posts",
                      "e.g., https://blog.com/post1, https://medium.com/article",
                      <FileText className="h-4 w-4 text-orange-500" />,
                      "input",
                      "Links to blog posts or articles for inspiration (comma-separated)",
                    )}

                    {renderField(
                      "Reddit Threads",
                      "reddit",
                      "e.g., https://reddit.com/r/topic, Interesting Reddit thread",
                      <MessageSquare className="h-4 w-4 text-orange-500" />,
                      "input",
                      "Links to Reddit threads or subreddits (comma-separated)",
                    )}

                    {renderField(
                      "Quora Questions",
                      "quora",
                      "e.g., https://quora.com/question, Useful Quora answer",
                      <HelpCircle className="h-4 w-4 text-orange-500" />,
                      "input",
                      "Links to Quora questions or answers (comma-separated)",
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Resources Section */}
              <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white p-5">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 text-orange-500 mr-2" />
                    Additional Resources
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Other resources that can help with content creation</p>
                </div>

                <div className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {renderField(
                      "Documents",
                      "document",
                      "e.g., https://docs.com/file.pdf, /path/to/doc",
                      <FileText className="h-4 w-4 text-orange-500" />,
                      "input",
                      "Links to documents or files with content ideas",
                    )}

                    {renderField(
                      "Other Resources",
                      "etc",
                      "e.g., Other ideas, https://extra.com",
                      <Lightbulb className="h-4 w-4 text-orange-500" />,
                      "input",
                      "Any other resources or ideas not covered above",
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
                      Save Content Ideas
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

