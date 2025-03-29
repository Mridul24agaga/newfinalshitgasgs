"use client"

import { useEffect, useState } from "react"
import Link from "next/link"


type Blog = {
  id: string
  title: string
  status?: "draft" | "scheduled" | "published"
  scheduled_for?: string
  published_at?: string
}

type BlogStats = {
  total: number
  published: number
  scheduled: number
  draft: number
}

export default function Dashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [stats, setStats] = useState<BlogStats>({
    total: 0,
    published: 0,
    scheduled: 0,
    draft: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
      setBlogs(data)

      // Calculate stats
      const blogStats: BlogStats = {
        total: data.length,
        published: 0,
        scheduled: 0,
        draft: 0,
      }

      data.forEach((blog: Blog) => {
        if (blog.status === "published" || blog.published_at) {
          blogStats.published++
        } else if (blog.status === "scheduled" || blog.scheduled_for) {
          blogStats.scheduled++
        } else {
          blogStats.draft++
        }
      })

      setStats(blogStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch blogs")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center p-8">Loading dashboard...</div>
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>

  return (
    <div>

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-500">Total Posts</h2>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-500">Published</h2>
            <p className="text-3xl font-bold text-green-600">{stats.published}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-500">Scheduled</h2>
            <p className="text-3xl font-bold text-blue-600">{stats.scheduled}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-500">Drafts</h2>
            <p className="text-3xl font-bold text-gray-600">{stats.draft}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Recent Posts</h2>
          </div>

          {blogs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No posts found. Create your first post!</div>
          ) : (
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
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
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
                {blogs.slice(0, 5).map((blog) => (
                  <tr key={blog.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(blog)}`}>
                        {getStatusText(blog)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{getRelevantDate(blog)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/blog/${blog.id}`} className="text-blue-500 hover:text-blue-700 mr-4">
                        View
                      </Link>
                      <Link href={`/dashboard/edit/${blog.id}`} className="text-gray-500 hover:text-gray-700">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {blogs.length > 5 && (
            <div className="px-6 py-4 border-t">
              <Link href="/dashboard/posts" className="text-blue-500 hover:text-blue-700">
                View all posts
              </Link>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Link
            href="/dashboard/create"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-sm"
          >
            Create New Post
          </Link>
        </div>
      </div>
    </div>
  )

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

  function getRelevantDate(blog: Blog) {
    if (blog.published_at) {
      return `Published: ${formatDate(blog.published_at)}`
    } else if (blog.scheduled_for) {
      return `Scheduled: ${formatDate(blog.scheduled_for)}`
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
    })
  }
}

