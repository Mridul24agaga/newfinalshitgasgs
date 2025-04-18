"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { generateBlog } from "../actions"

export default function GenerateBlogPage() {
  const [website, setWebsite] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [blog, setBlog] = useState<{
    headline: string
    content: string
  } | null>(null)
  const [error, setError] = useState("")
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isGenerating) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    } else {
      setTimer(0)
    }
    return () => clearInterval(interval)
  }, [isGenerating])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" + secs : secs}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!website) {
      setError("Please enter a website URL")
      return
    }

    // Basic URL validation
    let url = website
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url
      setWebsite(url)
    }

    try {
      setIsGenerating(true)
      setError("")

      // Add a timeout to automatically fail if it takes too long
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("Generation timed out after 2 minutes"))
        }, 120000) // 2 minutes timeout
      })

      const resultPromise = generateBlog(url)

      // Race between the actual request and the timeout
      const result = (await Promise.race([resultPromise, timeoutPromise])) as {
        headline: string
        content: string
      }

      setBlog(result)
    } catch (err: any) {
      console.error("Error:", err)
      setError(`Failed to generate blog: ${err.message || "Please try again"}`)
    } finally {
      setIsGenerating(false)
    }
  }

  // Function to convert markdown to HTML
  const renderMarkdown = (markdown: string) => {
    if (!markdown) return null

    // Remove the first heading (title) as we display it separately
    const contentWithoutTitle = markdown.replace(/^#\s+.+$/m, "").trim()

    // Process markdown to HTML
    return (
      contentWithoutTitle
        // Process headings
        .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-6 mb-2">$1</h3>')
        .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-8 mb-3">$1</h2>')
        .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-10 mb-4">$1</h1>')

        // Process lists
        .replace(/^\s*\*\s(.*)/gm, '<li class="ml-6 list-disc my-1">$1</li>')
        .replace(/^\s*\d\.\s(.*)/gm, '<li class="ml-6 list-decimal my-1">$1</li>')

        // Process emphasis and bold
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")

        // Process links
        .replace(
          /\[(.*?)\]$$(.*?)$$/g,
          '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>',
        )

        // Process paragraphs (must come last)
        .split("\n\n")
        .map((para) => {
          // Skip if it's already a heading or list
          if (para.startsWith("<h1") || para.startsWith("<h2") || para.startsWith("<h3") || para.startsWith("<li")) {
            return para
          }

          // Handle lists (wrap in ul/ol)
          if (para.includes('<li class="ml-6 list-disc')) {
            return `<ul class="my-4">${para}</ul>`
          }
          if (para.includes('<li class="ml-6 list-decimal')) {
            return `<ol class="my-4">${para}</ol>`
          }

          // Regular paragraph
          return `<p class="my-4">${para}</p>`
        })
        .join("")
    )
  }

  // Calculate estimated reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return readingTime
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AI Blog Generator</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="website" className="block text-sm font-medium mb-2">
            Enter Website URL
          </label>
          <input
            type="text"
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isGenerating ? `Generating... (${formatTime(timer)})` : "Generate Blog"}
        </button>

        {error && <p className="mt-2 text-red-600">{error}</p>}
      </form>

      {isGenerating && (
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse delay-75"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse delay-150"></div>
          </div>
          <div className="mt-4 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Generation Progress:</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full animate-pulse"
                style={{ width: `${Math.min((timer / 120) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-500">
              {timer < 60 ? "Researching website and generating content..." : "Finalizing your blog post..."}
            </p>
            <p className="text-center mt-2 text-xs text-gray-500">(This process should complete in under 2 minutes)</p>
          </div>
        </div>
      )}

      {blog && !isGenerating && (
        <div className="border border-gray-200 rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-6">{blog.headline}</h1>

          <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
            <span>{blog.content.split(/\s+/).length} words</span>
            <span>•</span>
            <span>{calculateReadingTime(blog.content)} min read</span>
          </div>

          <div
            className="blog-content prose max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(blog.content) }}
          />

          <div className="mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                navigator.clipboard.writeText(blog.content)
                alert("Blog content copied to clipboard!")
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Copy Blog Content
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
