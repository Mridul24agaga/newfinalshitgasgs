"use client"

import { useState } from "react"
import { scrapeWebsite } from "../utils/website-scraper"
import { scrapeReddit } from "../utils/reddit-scraper"
import { generateContent } from "../actions/generate-content"

export function SeoContentGenerator() {
  const [url, setUrl] = useState("")
  const [websiteSummary, setWebsiteSummary] = useState("")
  const [headlines, setHeadlines] = useState<string[]>([])
  const [blogPost, setBlogPost] = useState("")
  const [keywords, setKeywords] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setWebsiteSummary("")
    setHeadlines([])
    setBlogPost("")
    setKeywords([])

    try {
      console.log("Starting content generation process...")
      // Step 1: Scrape website and summarize
      const { summary, content: websiteContent } = await scrapeWebsite(url)
      setWebsiteSummary(summary)

      // Step 2: Scrape relevant Reddit posts
      console.log("Scraping Reddit...")
      let redditContent = ""
      let redditKeywords: string[] = []
      try {
        const redditData = await scrapeReddit(summary)
        redditContent = redditData.content
        redditKeywords = redditData.keywords
        setKeywords(redditKeywords)
      } catch (redditError) {
        console.error("Error scraping Reddit:", redditError)
        // Continue with the process even if Reddit scraping fails
      }

      // Step 3: Generate headlines and blog post
      console.log("Generating content...")
      const { headlines, blogPost } = await generateContent(summary, websiteContent, redditContent, redditKeywords)
      setHeadlines(headlines)
      setBlogPost(blogPost)
      console.log("Content generation complete")
    } catch (err) {
      console.error("Error in handleSubmit:", err)
      setError(`Failed to generate content: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL"
          required
          className="flex-grow p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {loading ? "Generating..." : "Generate Content"}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {websiteSummary && (
        <div>
          <h2 className="text-2xl font-semibold mb-2">Website Summary:</h2>
          <p>{websiteSummary}</p>
        </div>
      )}

      {keywords.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-2">Extracted Keywords:</h2>
          <p>{keywords.join(", ")}</p>
        </div>
      )}

      {headlines.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-2">Generated Headlines:</h2>
          <ul className="list-disc pl-5">
            {headlines.map((headline, index) => (
              <li key={index}>{headline}</li>
            ))}
          </ul>
        </div>
      )}

      {blogPost && (
        <div>
          <h2 className="text-2xl font-semibold mb-2">Generated Blog Post:</h2>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blogPost.replace(/\n/g, "<br>") }} />
        </div>
      )}
    </div>
  )
}

