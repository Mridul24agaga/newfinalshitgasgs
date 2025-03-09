"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import CustomEditor from "@/app/components/CustomEditor"
import { createClient } from "@/utitls/supabase/client"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft, Save } from "lucide-react"

export default function GeneratedBlogPage() {
  const params = useParams()
  const [blogPost, setBlogPost] = useState<string>("")
  const [citations, setCitations] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [title, setTitle] = useState<string>("")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()
        if (authError || !user) {
          setError("Authentication required")
          setBlogPost("<p>Please log in to continue.</p>")
          setCitations([])
          router.push("/auth")
          return
        }

        const { data, error: fetchError } = await supabase
          .from("blogs")
          .select("blog_post, citations, title, reveal_date")
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single()

        if (fetchError || !data) {
          setError("Blog not found")
          setBlogPost("<p>This blog post could not be found.</p>")
          setCitations([])
        } else {
          console.log("Raw data fetched:", data)
          console.log("Raw citations:", data.citations, "Type:", typeof data.citations)

          setBlogPost(data.blog_post)
          setTitle(data.title || "Untitled Blog Post")

          let parsedCitations: string[] = []
          if (typeof data.citations === "string") {
            try {
              parsedCitations = JSON.parse(data.citations)
              if (!Array.isArray(parsedCitations)) {
                parsedCitations = [data.citations]
              }
            } catch (parseError) {
              console.warn("Citations parsing failed, treating as plain string:", parseError)
              parsedCitations = data.citations.split(",").map((item: string) => item.trim())
            }
          } else if (Array.isArray(data.citations)) {
            parsedCitations = data.citations
          } else {
            console.warn("Unexpected citations format:", data.citations)
            parsedCitations = []
          }

          setCitations(parsedCitations)
        }
      } catch (err: unknown) {
        console.error(`Error fetching blog: ${err instanceof Error ? err.message : String(err)}`)
        setError("Failed to load blog")
        setBlogPost("<p>An error occurred while loading the blog.</p>")
        setCitations([])
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [params.id, router, supabase])

  const handleContentChange = async (newContent: string) => {
    setBlogPost(newContent)
    setSaving(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { error } = await supabase
          .from("blogs")
          .update({ blog_post: newContent })
          .eq("id", params.id)
          .eq("user_id", user.id)

        if (error) {
          console.error(`Failed to update blog: ${error.message}`)
        }
      }
    } catch (err: unknown) {
      console.error(`Error saving blog: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setTimeout(() => setSaving(false), 500)
    }
  }

  const handleGenerateMore = async () => {
    console.log("Generate More clicked")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading your blog post...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="bg-red-50 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{error}</h1>
          <p className="text-gray-600 mb-6">We couldn't load your blog post. Please try again later.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <header className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Saving changes...
                </span>
              ) : (
                "All changes saved automatically"
              )}
            </p>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleGenerateMore}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Generate More
            </button>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <CustomEditor
            initialValue={blogPost}
            onChange={handleContentChange}
            images={[]}
            onGenerateMore={handleGenerateMore}
            citations={citations}
          />
        </div>
      </div>
    </div>
  )
}

