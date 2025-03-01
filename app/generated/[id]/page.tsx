"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import CustomEditor from "@/app/components/CustomEditor"
import { createClient } from "@/utitls/supabase/client"
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
          setBlogPost(data.blog_post)
          setCitations(JSON.parse(data.citations))
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{error}</h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <CustomEditor
      initialValue={blogPost}
      onChange={handleContentChange}
      images={[]}
      onGenerateMore={handleGenerateMore}
      citations={citations}
    />
  )
}

