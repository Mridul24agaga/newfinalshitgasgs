"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarIcon, ClockIcon, ArrowRightIcon } from "lucide-react"
import { format } from "date-fns"

type Blog = {
  id: string
  title: string
  content?: string
  blog_post: string
  scheduled_date?: string | null
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const apiKey = "568feb6f19a409d73c11de7e3ce5cd702aca55a4590f5ccd9c4f89e92ec1c6a9" // Replace with your actual API key or get from env

  useEffect(() => {
    fetch("/api/user-blogs", {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
      .then((res) => res.json())
      .then((data: Blog[]) => {
        // Filter to only show published blogs (scheduled date is in the past)
        const publishedBlogs = data
          .filter((blog) => {
            if (!blog.scheduled_date) return false
            return new Date(blog.scheduled_date) <= new Date()
          })
          .map((blog) => ({
            ...blog,
            content: blog.blog_post?.substring(0, 150) || "", // Extract a preview from blog_post
          }))

        setBlogs(publishedBlogs)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error)
        setIsLoading(false)
      })
  }, [])

  // Function to create a slug from the blog title
  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
  }

  // Function to generate a random pastel color for blog cards
  const getRandomPastelColor = () => {
    const colors = [
      "bg-blue-50 border-blue-200 hover:bg-blue-100",
      "bg-green-50 border-green-200 hover:bg-green-100",
      "bg-purple-50 border-purple-200 hover:bg-purple-100",
      "bg-pink-50 border-pink-200 hover:bg-pink-100",
      "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
      "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Function to generate a random reading time
  const getRandomReadingTime = () => {
    return Math.floor(Math.random() * 10) + 3 + " min read"
  }

  // Format datetime for display
  const formatDateTime = (dateTimeStr: string): string => {
    const date = new Date(dateTimeStr)
    return `${format(date, "MMMM d, yyyy")} at ${format(date, "h:mm a")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Your Blog Collection</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your thoughts, ideas, and stories all in one place.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <h3 className="mt-2 text-xl font-medium text-gray-900">No published blogs found</h3>
            <p className="mt-1 text-gray-500">Check back later for new content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => {
              const slug = createSlug(blog.title)
              const cardColor = getRandomPastelColor()
              const readingTime = getRandomReadingTime()
              const publishDate = blog.scheduled_date ? formatDateTime(blog.scheduled_date) : "Published"

              return (
                <div
                  key={blog.id}
                  className={`rounded-xl border ${cardColor} overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1`}
                >
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{publishDate}</span>
                      <span className="mx-2">•</span>
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{readingTime}</span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{blog.title}</h2>

                    <p className="text-gray-600 mb-6 line-clamp-3">{blog.content}</p>

                    <Link
                      href={`/blogs/${slug}`}
                      className="mt-auto inline-flex items-center font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Read Full Article
                      <ArrowRightIcon className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

