"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

type Blog = {
  id: string
  title: string
  blog_post: string
  scheduled_for?: string
  published_at?: string
  status?: "draft" | "scheduled" | "published"
}

export default function BlogDetail() {
  const params = useParams()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const apiKey = "568feb6f19a409d73c11de7e3ce5cd702aca55a4590f5ccd9c4f89e92ec1c6a9" // Replace with actual API key

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true)
      try {
        // First get all blogs
        const res = await fetch("http://localhost:3000/api/user-blogs", {
          headers: { Authorization: `Bearer ${apiKey}` },
        })

        if (!res.ok) {
          throw new Error(`Error fetching blogs: ${res.status}`)
        }

        const blogs = await res.json()

        // Find the specific blog by ID
        const foundBlog = blogs.find((b: Blog) => b.id === params.id)

        if (!foundBlog) {
          throw new Error("Blog not found")
        }

        setBlog(foundBlog)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch blog")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchBlog()
    }
  }, [params.id])

  // Function to safely render HTML content
  const renderHtmlContent = (htmlContent: string) => {
    return { __html: htmlContent }
  }

  if (loading) return <div className="text-center p-8">Loading blog...</div>
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>
  if (!blog) return <div className="text-center p-8">Blog not found</div>

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <button
        className="mb-6 px-4 py-2 border rounded flex items-center hover:bg-gray-50"
        onClick={() => window.history.back()}
      >
        <span className="mr-2">←</span>
        Back to blogs
      </button>

      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {blog.status && (
            <span className={`px-2 py-1 rounded-full ${getStatusClass(blog)}`}>{getStatusText(blog)}</span>
          )}

          {blog.scheduled_for && (
            <div className="flex items-center">
              <span>Scheduled for: {formatDate(blog.scheduled_for)}</span>
            </div>
          )}

          {blog.published_at && (
            <div className="flex items-center">
              <span>Published: {formatDate(blog.published_at)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        {/* Render HTML content safely */}
        <div dangerouslySetInnerHTML={renderHtmlContent(blog.blog_post)} />
      </div>
    </div>
  )

  // Helper functions
  function getStatusClass(blog: Blog) {
    if (blog.status === "published" || blog.published_at) {
      return "bg-green-100 text-green-800"
    } else if (blog.status === "scheduled" || blog.scheduled_for) {
      return "bg-blue-100 text-blue-800"
    } else {
      return "bg-gray-100 text-gray-800"
    }
  }

  function getStatusText(blog: Blog) {
    if (blog.status === "published" || blog.published_at) {
      return "Published"
    } else if (blog.status === "scheduled" || blog.scheduled_for) {
      return "Scheduled"
    } else {
      return "Draft"
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }
}

