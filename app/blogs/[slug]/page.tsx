"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeftIcon, CalendarIcon, ClockIcon, UserIcon, BookmarkIcon, ShareIcon } from "lucide-react"

type Blog = {
  id: string
  title: string
  content?: string
  blog_post: string // The actual content is in blog_post field
}

export default function BlogPost() {
  const params = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const slug = params.slug as string
  const apiKey = "568feb6f19a409d73c11de7e3ce5cd702aca55a4590f5ccd9c4f89e92ec1c6a9"

  useEffect(() => {
    // Fetch all blogs first
    fetch("http://localhost:3000/api/user-blogs", {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
      .then((res) => res.json())
      .then((data: Blog[]) => {
        // Find the blog that matches the slug
        const foundBlog = data.find((blog) => createSlug(blog.title) === slug)

        if (foundBlog) {
          console.log("Found blog:", foundBlog)
          setBlog(foundBlog)
        } else {
          console.log("No blog found for slug:", slug)
          console.log("Available blogs:", data)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching blog:", error)
        setLoading(false)
      })
  }, [slug])

  // Function to create a slug from the blog title
  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
  }

  // Function to render HTML content safely
  const renderHtmlContent = (htmlContent: string) => {
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-pulse space-y-8 w-full max-w-3xl px-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="text-center max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Blog Not Found</h1>
          <p className="mt-2 text-gray-600">We couldn't find the blog post you're looking for.</p>
          <button
            onClick={() => router.push("/blogs")}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Blogs
          </button>
        </div>
      </div>
    )
  }

  // Generate random reading time and date for the blog post
  const readingTime = Math.floor(Math.random() * 10) + 3 + " min read"
  const publishDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <button
          onClick={() => router.push("/blogs")}
          className="mb-8 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Blogs
        </button>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-1" />
                <span>Author</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{publishDate}</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>{readingTime}</span>
              </div>
            </div>

            <div className="flex space-x-4 mb-8">
              <button className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors">
                <BookmarkIcon className="h-4 w-4 mr-1" />
                Save
              </button>
              <button className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors">
                <ShareIcon className="h-4 w-4 mr-1" />
                Share
              </button>
            </div>

            <div className="prose max-w-none text-gray-700">
              {blog.blog_post ? renderHtmlContent(blog.blog_post) : <p>No content available</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

