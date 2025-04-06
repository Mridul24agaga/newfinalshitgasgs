"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Link2, AlertCircle, Loader2, ArrowRight, ArrowLeft, FileText } from "lucide-react"
import { generateBlog } from "../actions" // Adjust path to your generateBlog function

export default function GenerateBlogContent() {
  const [url, setUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [generatedBlogId, setGeneratedBlogId] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  // Load URL from localStorage or query params on mount
  useEffect(() => {
    const storedUrl = localStorage.getItem("websiteSummaryUrl")
    const queryUrl = searchParams.get("url")
    if (storedUrl) setUrl(storedUrl)
    else if (queryUrl) setUrl(queryUrl)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setGeneratedBlogId(null) // Reset previous ID

    try {
      console.log("Starting blog generation for URL:", url)
      const blogPosts = await generateBlog(url) // Call generateBlog from actions
      console.log("Raw response from generateBlog:", blogPosts)

      // Robust check for blogPosts
      if (!blogPosts || !Array.isArray(blogPosts)) {
        console.error("generateBlog did not return an array:", blogPosts)
        throw new Error("Invalid response from blog generation")
      }

      if (blogPosts.length === 0) {
        console.error("generateBlog returned an empty array")
        throw new Error("No blog posts were generated")
      }

      const firstBlogPost = blogPosts[0]
      if (!firstBlogPost?.id) {
        console.warn("Generated blog post has no ID:", firstBlogPost)
        throw new Error("Generated blog post is missing an ID")
      }

      console.log(`Successfully generated blog post with ID: ${firstBlogPost.id}`, firstBlogPost)
      setGeneratedBlogId(firstBlogPost.id)

      // Store in localStorage (optional, for persistence)
      localStorage.setItem("generatedBlogPosts", JSON.stringify(blogPosts))
      console.log("Stored blog post in localStorage")

      // Mark as success
      setSuccess(true)

      // Redirect to /generated/[id] after 3 seconds
      setTimeout(() => {
        console.log(`Redirecting to /generated/${firstBlogPost.id}`)
        router.push(`/generated/${firstBlogPost.id}`)
      }, 3000)
    } catch (error: any) {
      console.error("Error in handleSubmit:", error.message, error.stack)
      setError(`Failed to generate content: ${error.message || "An unexpected error occurred"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-4 sm:p-6 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push("/dashboard/blogs")}
            className="text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="text-lg font-semibold text-gray-700">Blog Post Generator</div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-4xl mx-auto animate-fadeIn">
          <div className="bg-white rounded-lg p-6 sm:p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FileText className="text-[#2563eb]" size={28} />
                Generate Blog Post
              </h1>
            </div>

            {success ? (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 border border-green-200">
                  <ArrowRight size={32} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog Post Generated!</h2>
                <p className="text-gray-600 mb-6 max-w-md">
                  Successfully generated a blog post based on your website content. Redirecting you to your new blog
                  post...
                </p>
                <div className="w-16 h-1 bg-[#2563eb] animate-pulse rounded-full"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 mb-8">
                <div className="p-8 pt-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <label htmlFor="url" className="block text-sm font-semibold text-gray-700">
                        Website URL
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Link2 className="h-5 w-5 text-[#2563eb]" />
                        </div>
                        <input
                          type="url"
                          id="url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://example.com"
                          disabled={isLoading}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] disabled:bg-gray-50 disabled:text-gray-400 transition-all duration-200 placeholder:text-gray-300"
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-[#2563eb] mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">About Blog Generation</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Our AI will analyze your website and generate a blog post tailored to your audience. The
                            generated content will be based on your website's topic, style, and target audience.
                          </p>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                          <div>
                            <h3 className="text-sm font-medium text-red-800">Oops! Something went wrong</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {isLoading && (
                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Loader2 className="animate-spin h-5 w-5 text-[#2563eb] mr-3" />
                          <span className="text-sm font-medium text-gray-800">
                            Generating blog post... This may take a few minutes.
                          </span>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className={`w-full px-6 py-3 rounded-lg text-white font-bold flex items-center justify-center transition-all duration-300 border ${
                        isLoading
                          ? "bg-blue-400 border-blue-500 cursor-not-allowed"
                          : "bg-[#2563eb] border-[#2563eb] hover:bg-[#1d4ed8] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2"
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin mr-3 h-5 w-5 text-white" />
                          <span>Generating Blog Post...</span>
                        </>
                      ) : (
                        <>
                          <span>Generate Blog Post</span>
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

