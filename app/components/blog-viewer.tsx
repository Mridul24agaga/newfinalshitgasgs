"use client"

import { useState } from "react"

type Blog = {
  id: string
  title: string
  blog_post: string
  created_at: string
  user_id: string
}

export default function BlogViewer() {
  const [apiKey, setApiKey] = useState("")
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const fetchBlogs = async () => {
    if (!apiKey) {
      setError("Please enter an API key")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Trim the API key to remove any whitespace
      const trimmedApiKey = apiKey.trim()

      const response = await fetch("/api/blogs", {
        headers: {
          "x-api-key": trimmedApiKey,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to fetch blogs")
      }

      setBlogs(data.blogs)

      if (data.blogs.length === 0) {
        setSuccess("API key is valid, but no blogs were found for this user")
      } else {
        setSuccess(`Successfully fetched ${data.blogs.length} blogs`)
      }
    } catch (error: any) {
      setError(error.message)
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">View Your Blogs</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Enter your API key</label>
        <div className="flex">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Your API key"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
          />
          <button
            onClick={fetchBlogs}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-r-md"
          >
            {loading ? "Loading..." : "Fetch Blogs"}
          </button>
        </div>

        {error && <div className="mt-2 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

        {success && <div className="mt-2 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}
      </div>

      {blogs.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Blogs</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {blogs.map((blog) => (
              <div key={blog.id} className="border border-gray-200 rounded-md p-4">
                <h4 className="font-bold">{blog.title}</h4>
                <p className="text-sm text-gray-500 mb-2">{new Date(blog.created_at).toLocaleDateString()}</p>
                <p className="text-gray-700">{blog.blog_post}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Enter your API key and click "Fetch Blogs" to view your blogs.</p>
      )}
    </div>
  )
}

