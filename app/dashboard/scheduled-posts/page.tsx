"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Blog = {
  id: string
  title: string
  blog_post: string
  scheduled_for?: string
  published_at?: string
  status?: "draft" | "scheduled" | "published"
}

export default function ScheduledPostsDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null)
  const [editingDate, setEditingDate] = useState("")
  const [editingTime, setEditingTime] = useState("")
  const apiKey = "568feb6f19a409d73c11de7e3ce5cd702aca55a4590f5ccd9c4f89e92ec1c6a9" // Replace with actual API key

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:3000/api/user-blogs", {
        headers: { Authorization: `Bearer ${apiKey}` },
      })

      if (!res.ok) {
        throw new Error(`Error fetching blogs: ${res.status}`)
      }

      const data = await res.json()

      // Filter to only show scheduled posts
      const scheduledPosts = data.filter((blog: Blog) => blog.status === "scheduled" || blog.scheduled_for)

      setBlogs(scheduledPosts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch blogs")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (blog: Blog) => {
    if (!blog.scheduled_for) return

    const date = new Date(blog.scheduled_for)
    setEditingBlogId(blog.id)
    setEditingDate(date.toISOString().split("T")[0])

    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    setEditingTime(`${hours}:${minutes}`)
  }

  const cancelEditing = () => {
    setEditingBlogId(null)
  }

  const updateSchedule = async (blogId: string) => {
    if (!editingDate || !editingTime) return

    try {
      // Combine date and time
      const scheduledDateTime = new Date(`${editingDate}T${editingTime}:00`)

      const res = await fetch(`http://localhost:3000/api/schedule-blog`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogId,
          scheduledFor: scheduledDateTime.toISOString(),
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || `Error: ${res.status}`)
      }

      // Refresh blogs after updating
      await fetchBlogs()
      setEditingBlogId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update schedule")
      console.error(err)
    }
  }

  const cancelSchedule = async (blogId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/cancel-schedule`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blogId }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || `Error: ${res.status}`)
      }

      // Refresh blogs after canceling
      await fetchBlogs()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel schedule")
      console.error(err)
    }
  }

  if (loading) return <div className="text-center p-8">Loading scheduled posts...</div>
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Scheduled Posts</h1>
        <Link href="/dashboard" className="px-4 py-2 border rounded hover:bg-gray-50">
          Back to Dashboard
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No scheduled posts found.</p>
          <Link href="/dashboard/create" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Create New Post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Scheduled For
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingBlogId === blog.id ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="date"
                          value={editingDate}
                          onChange={(e) => setEditingDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="p-1 text-sm border rounded w-32"
                        />
                        <input
                          type="time"
                          value={editingTime}
                          onChange={(e) => setEditingTime(e.target.value)}
                          className="p-1 text-sm border rounded w-24"
                        />
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        {blog.scheduled_for ? formatDate(blog.scheduled_for) : "Not scheduled"}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Scheduled</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingBlogId === blog.id ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={cancelEditing} className="text-gray-500 hover:text-gray-700">
                          Cancel
                        </button>
                        <button onClick={() => updateSchedule(blog.id)} className="text-blue-500 hover:text-blue-700">
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-4">
                        <button onClick={() => startEditing(blog)} className="text-blue-500 hover:text-blue-700">
                          Edit
                        </button>
                        <button onClick={() => cancelSchedule(blog.id)} className="text-red-500 hover:text-red-700">
                          Cancel Schedule
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

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

