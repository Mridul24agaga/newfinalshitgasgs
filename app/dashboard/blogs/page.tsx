"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FileText, ArrowLeft, Tag, Calendar, Search, Plus, Filter, SortDesc, Trash2 } from "lucide-react"

interface BlogPost {
  title: string
  content: string
  tags: string[]
  createdAt?: string
}

export default function BlogsPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Load blog posts from localStorage
    const loadBlogPosts = () => {
      setIsLoading(true)
      try {
        const storedPosts = localStorage.getItem("generatedBlogPosts")
        if (storedPosts) {
          const posts = JSON.parse(storedPosts) as BlogPost[]
          // Add createdAt date if not present
          const postsWithDates = posts.map((post) => ({
            ...post,
            createdAt: post.createdAt || new Date().toISOString(),
          }))
          setBlogPosts(postsWithDates)
        }
      } catch (error) {
        console.error("Error loading blog posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBlogPosts()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <header className="p-4 sm:p-6 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push(`/dashboard`)}
            className="text-[#294fd6] hover:text-[#1a3ca8] flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="text-lg font-semibold text-gray-700">Your Blog Posts</div>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-8 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FileText className="text-[#294fd6]" size={28} />
            Blog Posts
          </h1>

          <button
            onClick={() => router.push("/generate-blog")}
            className="bg-[#294fd6] hover:bg-[#1a3ca8] text-white px-4 py-2 rounded-lg transition-colors flex items-center text-sm font-medium"
          >
            <Plus size={18} className="mr-2" />
            Generate New Posts
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search blog posts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#294fd6] focus:border-[#294fd6]"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center">
                <Filter size={16} className="mr-2" />
                Filter
              </button>
              <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center">
                <SortDesc size={16} className="mr-2" />
                Sort
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#294fd6] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-gray-600">Loading blog posts...</p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FileText size={24} className="text-[#294fd6]" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No blog posts yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Generate your first blog posts by analyzing your website content.
              </p>
              <button
                onClick={() => router.push("/generate-blog")}
                className="bg-[#294fd6] hover:bg-[#1a3ca8] text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center text-sm font-medium"
              >
                <Plus size={18} className="mr-2" />
                Generate Blog Posts
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {blogPosts.map((post, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            <Tag size={12} className="mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar size={14} className="mr-1" />
                        {post.createdAt ? formatDate(post.createdAt) : "Today"}
                      </div>
                      <button className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

