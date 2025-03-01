"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import type { User } from "@supabase/supabase-js"
import { ArrowLeft, Globe } from "lucide-react"
import Image from "next/image"
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
  const [youtubeVideos, setYoutubeVideos] = useState<string>("")
  const [posts, setPosts] = useState<string>("")
  const [reddit, setReddit] = useState<string>("")
  const [quora, setQuora] = useState<string>("")
  const [document, setDocument] = useState<string>("")
  const [giveIdeas, setGiveIdeas] = useState<string>("")
  const [giveTopics, setGiveTopics] = useState<string>("")
  const [etc, setEtc] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchContentIdeas = async () => {
      setIsLoading(true)
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()
        if (authError || !user) {
          throw new Error("You gotta log in first, man!")
        }

        const { data, error } = await supabase.from("content_ideas").select("*").eq("user_id", user.id)

        if (error) {
          throw new Error(`Failed to fetch content ideas: ${error.message}`)
        }

        if (data && data.length > 0) {
          const latestIdea = data.reduce((latest, current) =>
            latest.id && current.id && latest.id > current.id ? latest : current,
          )
          setYoutubeVideos(latestIdea.youtube_videos || "")
          setPosts(latestIdea.posts || "")
          setReddit(latestIdea.reddit || "")
          setQuora(latestIdea.quora || "")
          setDocument(latestIdea.document || "")
          setGiveIdeas(latestIdea.give_ideas || "")
          setGiveTopics(latestIdea.give_topics || "")
          setEtc(latestIdea.etc || "")
        } else {
          setYoutubeVideos("")
          setPosts("")
          setReddit("")
          setQuora("")
          setDocument("")
          setGiveIdeas("")
          setGiveTopics("")
          setEtc("")
        }
      } catch (error) {
        console.error(`Error fetching content ideas: ${error instanceof Error ? error.message : "Unknown error"}`)
        setError(`Failed to load content ideas: ${error instanceof Error ? error.message : "Unknown error"}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContentIdeas()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedYoutubeVideos = youtubeVideos.trim()
    const trimmedPosts = posts.trim()
    const trimmedReddit = reddit.trim()
    const trimmedQuora = quora.trim()
    const trimmedDocument = document.trim()
    const trimmedGiveIdeas = giveIdeas.trim()
    const trimmedGiveTopics = giveTopics.trim()
    const trimmedEtc = etc.trim()

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
        throw new Error("You gotta log in first, man!")
      }

      const contentIdeasData: ContentIdea = {
        user_id: (user as User).id,
        youtube_videos: trimmedYoutubeVideos || null,
        posts: trimmedPosts || null,
        reddit: trimmedReddit || null,
        quora: trimmedQuora || null,
        document: trimmedDocument || null,
        give_ideas: trimmedGiveIdeas || null,
        give_topics: trimmedGiveTopics || null,
        etc: trimmedEtc || null,
      }

      const { data: existingData, error: fetchError } = await supabase
        .from("content_ideas")
        .select("*")
        .eq("user_id", user.id)

      if (fetchError) {
        throw new Error(`Failed to check existing content ideas: ${fetchError.message}`)
      }

      let result
      if (existingData && existingData.length > 0) {
        const latestIdea = existingData.reduce((latest, current) =>
          latest.id && current.id && latest.id > current.id ? latest : current,
        )
        result = await supabase.from("content_ideas").update(contentIdeasData).eq("id", latestIdea.id)
      } else {
        result = await supabase.from("content_ideas").insert(contentIdeasData).select()
        if (!result.data || result.data.length === 0) {
          throw new Error("No data returned after insertion")
        }
      }

      if (result.error) {
        throw new Error(`Failed to save content ideas: ${result.error.message}`)
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

        console.log(`Generated additional ideas/topics for user ${(user as User).id}: ${JSON.stringify(ideas)}`)

        const updatedContentIdeasData: ContentIdea = {
          ...contentIdeasData,
          give_ideas: `${trimmedGiveIdeas || ""} ${ideas.join(", ")}`.trim(),
        }

        const { error: updateError } = await supabase
          .from("content_ideas")
          .update(updatedContentIdeasData)
          .eq(
            "id",
            existingData?.length > 0
              ? existingData[0].id
              : result.data && result.data.length > 0
                ? result.data[0].id
                : null,
          )

        if (updateError) {
          throw new Error(`Failed to update content ideas with additional ideas: ${updateError.message}`)
        }
      }

      const { data: updatedData, error: fetchUpdatedError } = await supabase
        .from("content_ideas")
        .select("*")
        .eq("user_id", user.id)

      if (fetchUpdatedError) {
        throw new Error(`Failed to re-fetch updated content ideas: ${fetchUpdatedError.message}`)
      }

      if (updatedData && updatedData.length > 0) {
        const latestIdea = updatedData.reduce((latest, current) =>
          latest.id && current.id && latest.id > current.id ? latest : current,
        )
        setYoutubeVideos(latestIdea.youtube_videos || "")
        setPosts(latestIdea.posts || "")
        setReddit(latestIdea.reddit || "")
        setQuora(latestIdea.quora || "")
        setDocument(latestIdea.document || "")
        setGiveIdeas(latestIdea.give_ideas || "")
        setGiveTopics(latestIdea.give_topics || "")
        setEtc(latestIdea.etc || "")
      } else {
        setYoutubeVideos("")
        setPosts("")
        setReddit("")
        setQuora("")
        setDocument("")
        setGiveIdeas("")
        setGiveTopics("")
        setEtc("")
      }

      console.log(`Content ideas saved/updated for user_id ${(user as User).id}`)
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
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <Globe className="h-5 w-5" />
                <Image src="/placeholder.svg" alt="US Flag" width={20} height={15} className="rounded" />
              </button>
              <button className="bg-[#2EF297] text-black font-medium px-4 py-1.5 rounded-full hover:bg-[#29DB89] transition-colors">
                Upgrade ✨
              </button>
              <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="sr-only">User menu</span>👤
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Content Ideas</h1>
            <p className="mb-6 text-gray-600">
              Add content ideas and topics to inspire your blogs, tied to your account!
            </p>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
              <div>
                <label htmlFor="youtubeVideos" className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube Videos (comma-separated URLs)
                </label>
                <input
                  type="text"
                  id="youtubeVideos"
                  value={youtubeVideos}
                  onChange={(e) => setYoutubeVideos(e.target.value)}
                  placeholder="e.g., https://youtube.com/video1, https://youtube.com/video2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="posts" className="block text-sm font-medium text-gray-700 mb-1">
                  Posts (comma-separated URLs or text)
                </label>
                <input
                  type="text"
                  id="posts"
                  value={posts}
                  onChange={(e) => setPosts(e.target.value)}
                  placeholder="e.g., https://blog.com/post1, Interesting post text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="reddit" className="block text-sm font-medium text-gray-700 mb-1">
                  Reddit (comma-separated URLs or text)
                </label>
                <input
                  type="text"
                  id="reddit"
                  value={reddit}
                  onChange={(e) => setReddit(e.target.value)}
                  placeholder="e.g., https://reddit.com/r/topic, Interesting Reddit thread"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="quora" className="block text-sm font-medium text-gray-700 mb-1">
                  Quora (comma-separated URLs or text)
                </label>
                <input
                  type="text"
                  id="quora"
                  value={quora}
                  onChange={(e) => setQuora(e.target.value)}
                  placeholder="e.g., https://quora.com/question, Useful Quora answer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">
                  Document (URL or path)
                </label>
                <input
                  type="text"
                  id="document"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  placeholder="e.g., https://docs.com/file.pdf, /path/to/doc"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="giveIdeas" className="block text-sm font-medium text-gray-700 mb-1">
                  Give Ideas (comma-separated)
                </label>
                <input
                  type="text"
                  id="giveIdeas"
                  value={giveIdeas}
                  onChange={(e) => setGiveIdeas(e.target.value)}
                  placeholder="e.g., AI innovations, Marketing tips"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="giveTopics" className="block text-sm font-medium text-gray-700 mb-1">
                  Give Topics (comma-separated)
                </label>
                <input
                  type="text"
                  id="giveTopics"
                  value={giveTopics}
                  onChange={(e) => setGiveTopics(e.target.value)}
                  placeholder="e.g., Future of AI, SEO Strategies"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="etc" className="block text-sm font-medium text-gray-700 mb-1">
                  Etc (additional notes or URLs)
                </label>
                <input
                  type="text"
                  id="etc"
                  value={etc}
                  onChange={(e) => setEtc(e.target.value)}
                  placeholder="e.g., Other ideas, https://extra.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  disabled={isLoading}
                />
              </div>
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

