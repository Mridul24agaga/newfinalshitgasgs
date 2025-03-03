"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import CustomEditor from "@/app/components/CustomEditor"
import { createClient } from "@/utitls/supabase/client" // Fixed typo: "utitls" → "utils"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function GeneratedBlogPage() {
  const params = useParams()
  const [blogPost, setBlogPost] = useState<string>("")
  const [citations, setCitations] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
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
          .select("blog_post, citations")
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single()

        if (fetchError || !data) {
          setError("Blog not found")
          setBlogPost("<p>This blog post could not be found.</p>")
          setCitations([])
        } else {
          console.log("Raw data fetched:", data) // Debug raw data
          console.log("Raw citations:", data.citations, "Type:", typeof data.citations) // Debug citations

          setBlogPost(data.blog_post)

          // Safely parse citations
          let parsedCitations: string[] = []
          if (typeof data.citations === "string") {
            try {
              // Attempt to parse as JSON
              parsedCitations = JSON.parse(data.citations)
              if (!Array.isArray(parsedCitations)) {
                // If parsed result is not an array, treat it as a single string
                parsedCitations = [data.citations]
              }
            } catch (parseError) {
              console.warn("Citations parsing failed, treating as plain string:", parseError)
              // If JSON parsing fails, assume it's a single URL or comma-separated string
              parsedCitations = data.citations.split(",").map((item: string) => item.trim())
            }
          } else if (Array.isArray(data.citations)) {
            // If it's already an array, use it directly
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
    }
  }

  const handleGenerateMore = async () => {
    // Implementation for generating more content
    console.log("Generate More clicked")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <CustomEditor
        initialValue={blogPost}
        onChange={handleContentChange}
        images={[]}
        onGenerateMore={handleGenerateMore}
        citations={citations}
      />
    </div>
  )
}