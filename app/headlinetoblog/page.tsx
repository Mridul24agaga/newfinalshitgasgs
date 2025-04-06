"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" // Add this for redirect
import { createClient } from "@/utitls/supabase/client" // Adjust path based on your setup
import { generateBlog } from "../headlinetoblog"

interface BlogPost {
  id: string
  user_id: string
  blog_post: string
  citations: string[]
  created_at: string
  title: string
  timestamp: string
  reveal_date: string
  url: string | null
}

export default function HeadlineToBlog() {
  const [headline, setHeadline] = useState("")
  const [website, setWebsite] = useState("")
  const [humanizeLevel, setHumanizeLevel] = useState<"normal" | "hardcore">("normal")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedPosts, setGeneratedPosts] = useState<BlogPost[]>([])
  const [existingPosts, setExistingPosts] = useState<BlogPost[]>([])
  const supabase = createClient()
  const router = useRouter() // Initialize router for redirect

  // Fetch existing posts on mount
  useEffect(() => {
    fetchExistingPosts()
  }, [])

  const fetchExistingPosts = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError("Please log in to view your posts.")
      return
    }

    const { data, error } = await supabase
      .from("headlinetoblog")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching posts:", error.message)
      setError("Failed to load existing posts.")
    } else {
      setExistingPosts(data || [])
    }
  }

  const handleGenerateBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setGeneratedPosts([])

    try {
      const posts = await generateBlog(headline, humanizeLevel, website || undefined)
      setGeneratedPosts(posts)

      // Redirect to the generated post's page using the first post's id
      if (posts.length > 0) {
        const postId = posts[0].id // Use the UUID from the Supabase table
        router.push(`/generate/${postId}`)
      }

      await fetchExistingPosts() // Refresh existing posts after generation
    } catch (err: any) {
      console.error("Error generating blog:", err.message)
      setError(`Failed to generate blog: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 font-saira">
      <header className="bg-gray-900 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Headline to Blog Generator</h1>
          <p className="mt-2">Turn a headline into a full blog post with AI magic.</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Input Form */}
        <form onSubmit={handleGenerateBlog} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="mb-4">
            <label htmlFor="headline" className="block text-gray-700 font-semibold mb-2">
              Headline (Required)
            </label>
            <input
              type="text"
              id="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., AI Revolution in 2025"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="website" className="block text-gray-700 font-semibold mb-2">
              Website URL (Optional)
            </label>
            <input
              type="url"
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., https://example.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Humanize Level</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="humanizeLevel"
                  value="normal"
                  checked={humanizeLevel === "normal"}
                  onChange={() => setHumanizeLevel("normal")}
                  className="mr-2"
                />
                Normal
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="humanizeLevel"
                  value="hardcore"
                  checked={humanizeLevel === "hardcore"}
                  onChange={() => setHumanizeLevel("hardcore")}
                  className="mr-2"
                />
                Hardcore
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md text-white font-semibold transition-colors duration-200 ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {loading ? "Generating..." : "Generate Blog Post"}
          </button>
        </form>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-8">
            <p>{error}</p>
          </div>
        )}

        {/* Generated Posts (Optional: Keep this if you want a preview before redirect) */}
        {generatedPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Generated Blog Post</h2>
            {generatedPosts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: post.blog_post }}
                />
                {post.url && (
                  <p className="mt-4 text-gray-600">
                    Source Website: <a href={post.url} className="text-orange-600 underline">{post.url}</a>
                  </p>
                )}
                <p className="mt-2 text-gray-500 text-sm">Generated on: {new Date(post.created_at).toLocaleString()}</p>
              </div>
            ))}
          </section>
        )}

        {/* Existing Posts */}
        {existingPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Previous Posts</h2>
            <div className="grid gap-6">
              {existingPosts.map((post) => (
                <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <a href={`/generate/${post.id}`} className="text-orange-600 hover:underline">
                      {post.title}
                    </a>
                  </h3>
                  <div
                    className="prose max-w-none text-gray-700 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: post.blog_post }}
                  />
                  {post.url && (
                    <p className="mt-4 text-gray-600">
                      Source Website: <a href={post.url} className="text-orange-600 underline">{post.url}</a>
                    </p>
                  )}
                  <p className="mt-2 text-gray-500 text-sm">Created on: {new Date(post.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}