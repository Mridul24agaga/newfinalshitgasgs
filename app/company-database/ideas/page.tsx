"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { Menu } from "lucide-react"
import { Sidebar } from "@/app/components/sidebar"

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
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
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
  }, [supabase])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setContentIdea((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedGiveIdeas = contentIdea.give_ideas?.trim()
    const trimmedGiveTopics = contentIdea.give_topics?.trim()

    if (!trimmedGiveIdeas && !trimmedGiveTopics) {
      setMessage("Give us some ideas or topics to generate more for your blog, dude!")
      return
    }

    setIsLoading(true)
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

      if (trimmedGiveIdeas || trimmedGiveTopics) {
        const ideaPrompt = `
          Based on this user input for blog ideas: "${trimmedGiveIdeas || ""} ${trimmedGiveTopics || ""}", generate 5 unique, creative blog ideas or topics. Keep it natural and engaging, like you're brainstorming with a friend. Return a JSON array, e.g., ["Idea 1", "Idea 2"].
        `
        const additionalIdeas = await callAzureOpenAI(ideaPrompt, 200)
        const cleanedIdeas = additionalIdeas.replace(/```json\n?|\n?```/g, "").trim()
        let ideas: string[] = []
        try {
          ideas = JSON.parse(cleanedIdeas) || []
        } catch (parseError) {
          console.error("Error parsing additional ideas:", parseError)
          ideas = ["Default Idea 1", "Default Idea 2"]
        }

        const updatedGiveIdeas = `${trimmedGiveIdeas || ""} ${ideas.join(", ")}`.trim()

        const { error: updateError } = await supabase
          .from("content_ideas")
          .update({ give_ideas: updatedGiveIdeas })
          .eq("user_id", user.id)

        if (updateError) {
          throw new Error(`Failed to update content ideas with additional ideas: ${updateError.message}`)
        }

        setContentIdea((prev) => ({ ...prev, give_ideas: updatedGiveIdeas }))
      }

      console.log(`Content ideas saved/updated for user_id ${user.id}`)
      setSuccess("Content ideas saved/updated, bro! Ready for blog inspiration.")
    } catch (error: unknown) {
      console.error(`Error saving content ideas: ${error instanceof Error ? error.message : "Unknown error"}`)
      setError(`Failed to save content ideas: ${error instanceof Error ? error.message : "Unknown error"}`)
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
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Content Ideas</h1>
            <p className="mb-6 text-gray-600">
              Add content ideas and topics to inspire your blogs, tied to your account!
            </p>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
              {[
                {
                  id: "youtube_videos",
                  label: "YouTube Videos",
                  placeholder: "e.g., https://youtube.com/video1, https://youtube.com/video2",
                },
                { id: "posts", label: "Posts", placeholder: "e.g., https://blog.com/post1, Interesting post text" },
                {
                  id: "reddit",
                  label: "Reddit",
                  placeholder: "e.g., https://reddit.com/r/topic, Interesting Reddit thread",
                },
                { id: "quora", label: "Quora", placeholder: "e.g., https://quora.com/question, Useful Quora answer" },
                { id: "document", label: "Document", placeholder: "e.g., https://docs.com/file.pdf, /path/to/doc" },
                { id: "give_ideas", label: "Give Ideas", placeholder: "e.g., AI innovations, Marketing tips" },
                { id: "give_topics", label: "Give Topics", placeholder: "e.g., Future of AI, SEO Strategies" },
                { id: "etc", label: "Etc", placeholder: "e.g., Other ideas, https://extra.com" },
              ].map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label} {field.id !== "document" && "(comma-separated)"}
                  </label>
                  <input
                    type="text"
                    id={field.id}
                    name={field.id}
                    value={contentIdea[field.id as keyof ContentIdea] || ""}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    disabled={isLoading}
                  />
                </div>
              ))}
              {message && <p className="text-orange-500 mt-2">{message}</p>}
              {error && <p className="text-red-500 mt-2">{error}</p>}
              {success && <p className="text-green-500 mt-2">{success}</p>}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => router.push("/company-database")}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving Content Ideas..." : "Save Content Ideas"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

