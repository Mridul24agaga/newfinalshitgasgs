"use server"

import { tavily } from "@tavily/core"
import { v4 as uuidv4 } from "uuid"
import OpenAI from "openai"
import { createClient } from "@/utitls/supabase/server"

// Add this new function at the top of the file, right after the formatUtils declaration
// This will be our aggressive link fixer that runs before any other processing

function aggressivelyFixMarkdownLinks(content: string): string {
  let processedContent = content

  // Find all markdown links with any amount of whitespace between ] and (
  const markdownLinkRegex = /\[([^\]]+)\]\s*$$([^)]+)$$/g

  // Replace them with actual HTML <a> tags
  processedContent = processedContent.replace(markdownLinkRegex, (match, text, url) => {
    // Ensure text and url are defined and convert to string if needed
    const textStr = text ? String(text) : ""
    const urlStr = url ? String(url) : ""

    // Clean up any extra whitespace
    const cleanText = textStr.trim()
    const cleanUrl = urlStr.trim()

    if (cleanUrl.startsWith("http") || cleanUrl.startsWith("https")) {
      return `<a href="${cleanUrl}" class="text-orange-600 underline hover:text-orange-700 font-saira font-normal transition-colors duration-200" target="_blank" rel="noopener noreferrer">${cleanText}</a>`
    } else if (cleanUrl.startsWith("/")) {
      return `<a href="${cleanUrl}" class="text-blue-600 hover:text-blue-800 font-normal transition-colors duration-200">${cleanText}</a>`
    } else {
      return `<a href="${cleanUrl}" class="text-blue-600 hover:text-blue-800 font-normal transition-colors duration-200">${cleanText}</a>`
    }
  })

  return processedContent
}

const formatUtils = {
  convertMarkdownToHtml: (markdown: string) => {
    // First, directly convert markdown links to HTML <a> tags
    let html = aggressivelyFixMarkdownLinks(markdown)

    // Then normalize all line breaks to ensure consistent processing
    html = html.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n")

    // Process the markdown with updated bullet point styling
    html = html
      // Headings with improved typography, font family, and proper spacing
      .replace(/^###### (.*$)/gim, '<h6 class="font-saira text-lg font-bold mt-6 mb-3 text-gray-800">$1</h6>')
      .replace(/^##### (.*$)/gim, '<h5 class="font-saira text-xl font-bold mt-6 mb-3 text-gray-800">$1</h5>')
      .replace(/^#### (.*$)/gim, '<h4 class="font-saira text-2xl font-bold mt-7 mb-4 text-gray-800">$1</h4>')
      .replace(/^### (.*$)/gim, '<h3 class="font-saira text-3xl font-bold mt-8 mb-4 text-gray-800">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="font-saira text-4xl font-bold mt-10 mb-5 text-gray-900">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="font-saira text-5xl font-bold mt-8 mb-6 text-gray-900 border-b pb-2">$1</h1>')

      // Bold and italic text handling
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic font-normal">$1</em>')

      // Remove bullet point handling - convert to paragraphs instead
      .replace(
        /^- (.*?):\s*(.*$)/gim,
        '<p class="font-saira text-gray-700 leading-relaxed font-normal my-4"><strong class="font-bold">$1</strong>: $2</p>',
      )
      .replace(
        /^[*] (.*?):\s*(.*$)/gim,
        '<p class="font-saira text-gray-700 leading-relaxed font-normal my-4"><strong class="font-bold">$1</strong>: $2</p>',
      )
      .replace(
        /^- ([^:]+)$/gim,
        '<p class="font-saira text-gray-700 leading-relaxed font-normal my-4"><strong class="font-bold">$1</strong></p>',
      )
      .replace(
        /^[*] ([^:]+)$/gim,
        '<p class="font-saira text-gray-700 leading-relaxed font-normal my-4"><strong class="font-bold">$1</strong></p>',
      )

      // Remove these sections that group list items

      // Paragraphs with better typography and font family
      .replace(/\n{2,}/g, '</p><p class="font-saira text-gray-700 leading-relaxed font-normal my-4">')

    // Wrap in paragraph with better typography
    html = `<p class="font-saira text-gray-700 leading-relaxed font-normal my-4">${html}</p>`

    // Ensure no double paragraph tags
    html = html.replace(
      /<\/p>\s*<p class="font-saira text-gray-700 leading-relaxed font-normal my-4">\s*<\/p>/g,
      "</p>",
    )

    // Ensure no empty paragraphs
    html = html.replace(/<p class="font-saira text-gray-700 leading-relaxed font-normal my-4">\s*<\/p>/g, "")

    return html
  },

  sanitizeHtml: (html: string) => {
    // First, directly handle any remaining markdown-style links
    let sanitized = aggressivelyFixMarkdownLinks(html)

    // Ensure all paragraphs have better typography and font family
    sanitized = sanitized
      .replace(/<p[^>]*>/g, '<p class="font-saira text-gray-700 leading-relaxed font-normal my-4">')

      // Updated list styling to match single-line format
      .replace(/<ul[^>]*>/g, '<ul class="pl-4 my-4">')

      // Ensure list items are single-line with proper styling
      .replace(/<li[^>]*>([^<]*)<\/li>/g, '<li class="ml-4 text-gray-700 leading-relaxed font-normal">$1</li>')

      // Special handling for list items with bold terms
      .replace(
        /<li[^>]*><strong[^>]*>([^<]+)<\/strong>:\s*([^<]*)<\/li>/g,
        '<li class="ml-4 text-gray-700 leading-relaxed font-normal"><strong class="font-bold">$1</strong>: $2</li>',
      )

      // Handle list items with just a bold term (no colon)
      .replace(
        /<li[^>]*><strong[^>]*>([^<:]+)<\/strong><\/li>/g,
        '<li class="ml-4 text-gray-700 leading-relaxed font-normal"><strong class="font-bold">$1</strong></li>',
      )

      // Ensure all headings have better typography, font family, and proper spacing
      .replace(/<h1[^>]*>/g, '<h1 class="font-saira text-5xl font-bold mt-8 mb-6 text-gray-900 border-b pb-2">')
      .replace(/<h2[^>]*>/g, '<h2 class="font-saira text-4xl font-bold mt-10 mb-5 text-gray-900">')
      .replace(/<h3[^>]*>/g, '<h3 class="font-saira text-3xl font-bold mt-8 mb-4 text-gray-800">')
      .replace(/<h4[^>]*>/g, '<h4 class="font-saira text-2xl font-bold mt-7 mb-4 text-gray-800">')
      .replace(/<h5[^>]*>/g, '<h5 class="font-saira text-xl font-bold mt-6 mb-3 text-gray-800">')
      .replace(/<h6[^>]*>/g, '<h6 class="font-saira text-lg font-bold mt-6 mb-3 text-gray-800">')

      // Ensure all blockquotes have better styling
      .replace(
        /<blockquote[^>]*>/g,
        '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4 font-saira">',
      )

      // Ensure all external links have orange styling with underline and hover effect
      .replace(
        /<a[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>/g,
        '<a href="$1" class="text-orange-600 underline hover:text-orange-700 font-saira font-normal transition-colors duration-200" target="_blank" rel="noopener noreferrer">',
      )

      // Ensure all internal links have blue styling with hover effect
      .replace(
        /<a[^>]*href=["'](\/[^"']+)["'][^>]*>/g,
        '<a href="$1" class="text-blue-600 hover:text-blue-800 font-normal transition-colors duration-200">',
      )

      // Ensure all figures have consistent styling with better spacing
      .replace(/<figure[^>]*>/g, '<figure class="my-6">')
      .replace(/<figcaption[^>]*>/g, '<figcaption class="text-sm text-center text-gray-500 mt-2 font-saira">')

    // Remove any empty paragraphs
    sanitized = sanitized.replace(/<p[^>]*>\s*<\/p>/g, "")

    return sanitized
  },

  // Rest of the formatUtils object remains the same
  generateToc: (htmlContent: string) => {
    // Extract headings using regex for server-side compatibility
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi
    const headings: Array<{ id: string; text: string; level: number }> = []
    let match: RegExpExecArray | null
    let index = 0

    while ((match = headingRegex.exec(htmlContent)) !== null) {
      const level = Number.parseInt(match[1])
      const text = match[2].replace(/<[^>]+>/g, "").trim()
      const id = `heading-${index}`

      // Add id to the heading in the HTML
      const classMatch = match[0].match(/class="([^"]*)"/)
      const headingWithId = `<h${level} id="${id}" class="${classMatch ? classMatch[1] : ""}">${match[2]}</h${level}>`
      htmlContent = htmlContent.replace(match[0], headingWithId)

      headings.push({
        id,
        text,
        level,
      })

      index++
    }

    return headings
  },
}

// Define types
interface TavilySearchResult {
  url: string
  rawContent?: string
  content?: string
  title?: string
}

interface Keyword {
  keyword: string
  relevance: number
  difficulty?: string // Add this if difficulty is optional
}

interface BlogResult {
  blogPost: string
  seoScore: number
  headings: string[]
  keywords: { keyword: string; difficulty: string }[]
  citations: string[]
  tempFileName: string
  title: string
  difficulty?: string // Make it optional if not always present
  timestamp: string
}

interface ScrapedData {
  initialUrl: string
  initialResearchSummary: string
  researchResults: { url: string; content: string; title: string }[]
  researchSummary: string
  coreTopic: string
  brandInfo: string
  youtubeVideo: string | null
  internalLinks: string[]
  references: string[]
  existingPosts: string
  targetKeywords: string[]
  timestamp: string
  nudge: string
  extractedKeywords: { keyword: string; relevance: number }[]
}

interface ScheduleResult {
  success: boolean
  message: string
  scheduleId: string
}

interface GenerationError extends Error {
  message: string
  code?: string
}

interface BlogPost {
  id: string
  user_id: string
  blog_post: string
  citations: string[]
  created_at: string
  title: string
  timestamp: string
  reveal_date: string
  url: string
}

interface ArticleResult {
  blogPost: string
  seoScore: number
  headings: string[]
  keywords: { keyword: string; difficulty: string }[]
  citations: string[]
  tempFileName: string
  title: string
  timestamp: string
}

interface Subscription {
  plan_id: string
  credits: number
  user_id: string
}

// Define the DataPoint interface
interface DataPoint {
  type: "percentage" | "statistic" | "year" | "comparison" | "count"
  value: string
  context: string
  source: string
}

// Tavily and OpenAI setup
const TAVILY_API_KEY: string = process.env.TAVILY_API_KEY || "***API_KEY_HIDDEN***"
console.log(`Starting blog generation process with Tavily...`)
const tavilyClient = tavily({ apiKey: TAVILY_API_KEY })

const configuration = {
  apiKey: process.env.AZURE_OPENAI_API_KEY || "",
  basePathGPT4oMini: process.env.AZURE_OPENAI_API_BASE_PATH_GPT4O_MINI || "",
}

console.log("Initializing Azure OpenAI client...")

const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY as string,
  baseURL: configuration.basePathGPT4oMini,
  defaultQuery: { "api-version": "2024-02-15-preview" },
  defaultHeaders: { "api-key": "***API_KEY_HIDDEN***" },
})

// Helper Functions
async function callAzureOpenAI(prompt: string, maxTokens: number): Promise<string> {
  try {
    // Only log the first 100 chars to reduce console output
    console.log(`Calling OpenAI: ${prompt.slice(0, 100)}${prompt.length > 100 ? "..." : ""}`)
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      max_tokens: maxTokens,
      temperature: 0.9,
      n: 1,
    })
    // Fix for line 111: Add null check before accessing property
    const result = completion.choices[0]?.message?.content || ""
    console.log(`OpenAI response: ${result.slice(0, 100)}${result.length > 100 ? "..." : ""}`)
    return result
  } catch (error: any) {
    console.error("Error calling Azure OpenAI:", error.message)
    return `Fallback: Couldn't generate this part due to ${error.message}. Let's roll with what we've got!`
  }
}

// Enhanced scraping function with better content extraction
async function scrapeWithTavily(url: string): Promise<string> {
  console.log(`\nScraping URL with Tavily: ${url}`)
  try {
    const tavilyResponse = await tavilyClient.search(url, {
      searchDepth: "advanced",
      max_results: 1,
      include_raw_content: true,
    })
    const data = tavilyResponse.results[0] as TavilySearchResult
    if (data?.rawContent) {
      console.log(`Tavily raw content (first 200 chars): ${data.rawContent.slice(0, 200)}...`)

      // Enhanced content extraction - better paragraph handling
      const cleanText = data.rawContent
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ") // Remove scripts
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ") // Remove styles
        .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, " ") // Remove headers
        .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, " ") // Remove footers
        .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, " ") // Remove navigation
        .replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, " ") // Remove asides
        .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, " ") // Remove forms
        .replace(/<[^>]+>/g, " ") // Remove remaining HTML tags
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim()

      console.log(`Enhanced cleaned Tavily content (first 200 chars): ${cleanText.slice(0, 200)}...`)
      console.log(`Total content length: ${cleanText.length} characters`)
      return cleanText.length > 100 ? cleanText : "No content available"
    }

    console.warn("No raw content from Tavily, falling back to summary...")
    if (data?.content) {
      const cleanText = data.content
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
      console.log(`Cleaned summary content (first 200 chars): ${cleanText.slice(0, 200)}...`)
      return cleanText.length > 100 ? cleanText : "No content available"
    }
    throw new Error("Tavily failed to fetch usable content")
  } catch (error: any) {
    console.error(`Error scraping ${url} with Tavily:`, error)
    if (error.response?.status === 401 || error.status === 401) {
      console.log("Tavily 401 detected—falling back to OpenAI summary.")
      const fallbackPrompt = `
  Tavily returned a 401 error for ${url}. Based on the URL alone, create a natural, human-like summary of what the site's probably about (up to 500 chars). Keep it conversational but professional.
  Return plain text.
`
      const fallbackContent = await callAzureOpenAI(fallbackPrompt, 200)
      console.log(`OpenAI fallback content (first 200 chars): ${fallbackContent.slice(0, 200)}...`)
      return fallbackContent || "No content available"
    }
    return "No content available"
  }
}

// Enhanced initial URL scraping with more detailed extraction
async function scrapeInitialUrlWithTavily(url: string): Promise<string> {
  console.log(`\nGenerating detailed initial summary for URL with OpenAI: ${url}`)

  try {
    // First try to get actual content with Tavily
    const tavilyResponse = await tavilyClient.search(url, {
      searchDepth: "advanced",
      max_results: 1,
      include_raw_content: true,
    })

    const data = tavilyResponse.results[0] as TavilySearchResult
    if (data?.rawContent && data.rawContent.length > 500) {
      console.log(`Successfully scraped content from ${url} with Tavily`)

      // Enhanced content extraction
      const mainContent = data.rawContent
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
        .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, " ")
        .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, " ")
        .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, " ")
        .replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, " ")
        .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()

      // Use OpenAI to create a structured summary from the raw content
      const summaryPrompt = `
  I need a detailed breakdown of this website content. Keep it conversational but professional.
  Provide a comprehensive analysis - what's this site about, what's their main point, what are they selling or talking about.
  Break it down in a clear, engaging way. Include any key topics, products, or services mentioned.
  
  Website content: "${mainContent.slice(0, 10000)}"
  
  Return a detailed summary (up to 2000 words) that captures ALL the important info from this site.
  Format with paragraph breaks for readability. Keep it conversational but informative.
`

      const enhancedSummary = await callAzureOpenAI(summaryPrompt, 2000)
      console.log(`Enhanced summary generated (first 200 chars): ${enhancedSummary.slice(0, 200)}...`)
      return enhancedSummary || mainContent.slice(0, 10000)
    }

    // Fallback to OpenAI if Tavily doesn't return good content
    console.log(`Tavily didn't return good content, using OpenAI to generate summary for ${url}`)
    const prompt = `
  I need to analyze this URL: ${url}. 
  Based on just the URL structure and any domain knowledge you have, give me a detailed guess about:
  1. What's this site probably about?
  2. What's their likely business model or purpose?
  3. What kind of content would I expect to find there?
  4. Who's their target audience?
  
  Be conversational yet professional and detailed in your analysis.
  Return a multi-paragraph analysis (up to 1500 words).
`

    const summary = await callAzureOpenAI(prompt, 4000)
    const cleanSummary = summary.replace(/\s+/g, " ").trim().slice(0, 10000)
    console.log(`OpenAI-generated summary (first 200 chars): ${cleanSummary.slice(0, 200)}...`)
    return cleanSummary || "No content available"
  } catch (error: any) {
    console.error(`Error generating summary for ${url} with OpenAI:`, error)
    return "No content available"
  }
}

async function generateMetaDescription(url: string, content: string): Promise<string> {
  const prompt = `
    Craft a natural, engaging meta description (up to 160 chars) for this URL and content. Make it feel like a passionate expert wrote it—no clichés like "game-changer," just real talk.
    URL: ${url}
    Content: "${content.slice(0, 2000)}"
    Return plain text.
  `
  const metaDescription = await callAzureOpenAI(prompt, 200)
  console.log(`Generated meta description: ${metaDescription}`)
  return metaDescription.trim().slice(0, 160)
}

// Find the generateSearchQueries function and replace it with this improved version that focuses more on the specific website content:

async function generateSearchQueries(metaDescription: string, topic: string): Promise<string[]> {
  const prompt = `
    I need to generate search queries for researching content about a website focused on "${topic}".
    
    IMPORTANT: These queries MUST be specifically tailored to this exact website and what it's about.
    
    Website description: "${metaDescription}"
    
    Based on this specific website's content and purpose:
    
    1. What are the MAIN TOPICS this specific website focuses on?
    2. What UNIQUE SERVICES or PRODUCTS does this specific website offer?
    3. What SPECIFIC INDUSTRY PROBLEMS does this website address?
    4. What UNIQUE SELLING POINTS or DIFFERENTIATORS does this website have?
    5. What SPECIFIC AUDIENCE or CUSTOMER SEGMENTS does this website target?
    
    Generate 8 highly specific search queries that will find information directly relevant to THIS SPECIFIC WEBSITE'S content, not generic industry topics.
    
    Each query should target a different aspect of what makes THIS SPECIFIC WEBSITE unique in its space.
    
    Return a JSON array of search queries, e.g., ["query1", "query2"].
  `
  const response = await callAzureOpenAI(prompt, 300)
  const cleanedResponse = response.replace(/```json\n?|\n?```/g, "").trim()
  try {
    const queries = (JSON.parse(cleanedResponse) as string[]) || []
    console.log(`Generated WEBSITE-SPECIFIC search queries: ${JSON.stringify(queries)}`)
    return queries
  } catch (error) {
    console.error("Error parsing queries:", error)
    return [
      `${topic} specific website analysis`,
      `${topic} unique features and offerings`,
      `${topic} website competitive advantages`,
      `${topic} target audience needs`,
      `${topic} website specific solutions`,
      `${topic} specialized services`,
      `${topic} website differentiation`,
      `${topic} customer pain points addressed`,
    ]
  }
}

// Also update the performTavilySearch function to be more website-specific:

async function performTavilySearch(query: string): Promise<string[]> {
  console.log(`\nPerforming targeted Tavily search for WEBSITE-SPECIFIC: ${query}`)
  try {
    // Make the search more focused on the specific website content
    const response = await tavilyClient.search(query, {
      searchDepth: "advanced",
      max_results: 20,
      include_raw_content: true,
      search_mode: "comprehensive",
    })

    // Filter for higher quality URLs that are more relevant to the specific website
    const urls = response.results
      .filter((result: any) => {
        const url = result.url || ""
        const hasGoodDomain =
          !url.includes("pinterest") &&
          !url.includes("instagram") &&
          !url.includes("facebook") &&
          !url.includes("twitter") &&
          !url.includes("tiktok")

        // Check if it has substantial content
        const hasContent = result.rawContent && result.rawContent.length > 500

        // Check if content is relevant to the specific query (basic relevance check)
        const isRelevant =
          result.rawContent &&
          result.rawContent.toLowerCase().includes(query.toLowerCase().split(" ").slice(0, 3).join(" "))

        return url.match(/^https?:\/\/.+/) && hasGoodDomain && hasContent && isRelevant
      })
      .map((result: any) => result.url)

    console.log(`Tavily found ${urls.length} high-quality URLs for WEBSITE-SPECIFIC query "${query}"`)
    return urls
  } catch (error) {
    console.error(`Tavily search error for WEBSITE-SPECIFIC query "${query}":`, error)
    return []
  }
}

// Update the findYouTubeVideo function to use Tavily for better video search
async function findYouTubeVideo(topic: string, content: string): Promise<string | null> {
  console.log(`Finding YouTube video for topic: ${topic}`)

  try {
    // First try to use Tavily to search for a relevant YouTube video
    const tavilyQuery = `best youtube video about ${topic} ${content.slice(0, 200)}`
    console.log(`Searching Tavily with query: ${tavilyQuery.slice(0, 100)}...`)

    const tavilyResponse = await tavilyClient.search(tavilyQuery, {
      searchDepth: "advanced",
      max_results: 5,
      include_raw_content: false,
      search_mode: "comprehensive",
    })

    // Look for YouTube URLs in the results
    const youtubeUrls = tavilyResponse.results
      .filter((result: any) => {
        const url = result.url || ""
        return url.includes("youtube.com/watch") || url.includes("youtu.be/")
      })
      .map((result: any) => result.url)

    if (youtubeUrls.length > 0) {
      console.log(`Found YouTube video via Tavily: ${youtubeUrls[0]}`)
      return youtubeUrls[0]
    }

    // If Tavily doesn't find a YouTube video, fall back to OpenAI
    console.log("No YouTube videos found via Tavily, falling back to OpenAI")
    const prompt = `
      Find the most relevant, high-quality YouTube video about "${topic}" based on this content.
      The video should be from a reputable channel with good production value.
      Return ONLY the full YouTube URL (like https://www.youtube.com/watch?v=xxxx) and nothing else.
      If you can't find a good match, return "No video found".
      
      Content excerpt: "${content.slice(0, 1000)}..."
    `
    const videoUrl = await callAzureOpenAI(prompt, 100)
    const cleanedUrl = videoUrl.trim().split("\n")[0].trim()

    // Validate that it's a YouTube URL
    if (cleanedUrl.includes("youtube.com/watch") || cleanedUrl.includes("youtu.be/")) {
      console.log(`Found YouTube video via OpenAI: ${cleanedUrl}`)
      return cleanedUrl
    } else {
      console.log("No valid YouTube video found")
      return null
    }
  } catch (error) {
    console.error("Error finding YouTube video:", error)
    return null
  }
}

// Add a function to generate tables related to the blog content
async function generateContentTables(topic: string, content: string): Promise<string[]> {
  console.log(`Generating unique content tables for topic: ${topic}`)

  try {
    // Extract key concepts from the content to make tables more specific to this particular blog
    const extractConceptsPrompt = `
      Extract 5-7 key concepts, terms, or themes that are specific to this content about "${topic}".
      These should be unique aspects that would make tables about this content different from other content on similar topics.
      
      Content excerpt: "${content.slice(0, 3000)}..."
      
      Return just a comma-separated list of these key concepts or themes.
    `

    const keyConceptsResponse = await callAzureOpenAI(extractConceptsPrompt, 300)
    const keyConcepts = keyConceptsResponse.split(",").map((c) => c.trim())

    // Use a random seed based on content to ensure different table types for different blogs
    const contentHash = content
      .slice(0, 100)
      .split("")
      .reduce((a, b) => a + b.charCodeAt(0), 0)
    const randomSeed = contentHash % 5 // Use modulo to get a number between 0-4

    // Define different table types based on the random seed
    const tableTypes = ["comparison", "statistics", "timeline", "pros_cons", "features"]

    // Select two different table types for this specific blog
    const firstTableType = tableTypes[randomSeed]
    const secondTableType = tableTypes[(randomSeed + 2) % 5] // Ensure second type is different

    // First table prompt - create a table specific to this blog's content
    const firstTablePrompt = `
      Create a unique "${firstTableType}" table specifically for this blog about "${topic}".
      
      MAKE THIS TABLE UNIQUE:
      - Focus on these specific concepts from this blog: ${keyConcepts.slice(0, 3).join(", ")}
      - Extract actual data points, statistics, or comparisons directly from the content
      - Do NOT use generic information that could apply to any blog on this topic
      - The table should directly reference specific points made in this particular blog
      
      Content excerpt: "${content.slice(0, 3000)}..."
      
      Table type: "${firstTableType}"
      
      Return ONLY the HTML table with proper styling. Use this format:
      <div class="overflow-x-auto my-8">
        <table class="w-full border-collapse bg-white text-gray-800">
          <thead class="bg-gray-100">
            <tr>
              <th class="border border-gray-200 px-4 py-2 text-left font-semibold">Statistic</th>
              <th class="border border-gray-200 px-4 py-2 text-left font-semibold">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td class="border border-gray-200 px-4 py-2">Average savings on production costs with AI</td>
              <td class="border border-gray-200 px-4 py-2">40%</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border border-gray-200 px-4 py-2">Marketers agreeing that video increases conversion rates</td>
              <td class="border border-gray-200 px-4 py-2">70%</td>
            </tr>
            <tr class="bg-white">
              <td class="border border-gray-200 px-4 py-2">Engagement increase from personalized videos</td>
              <td class="border border-gray-200 px-4 py-2">200%</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border border-gray-200 px-4 py-2">AI's role in analyzing performance metrics for video</td>
              <td class="border border-gray-200 px-4 py-2">Acts as a performance guide</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      Make sure the table contains ONLY information that is specific to this particular blog content.
      DO NOT include any markdown or code formatting symbols in your response, just the pure HTML.
    `

    // Second table prompt - create a different type of table specific to this blog
    const secondTablePrompt = `
      Create a unique "${secondTableType}" table specifically for this blog about "${topic}".
      
      MAKE THIS TABLE UNIQUE:
      - Focus on these specific concepts from this blog: ${keyConcepts.slice(3, 6).join(", ")}
      - Extract actual data points, statistics, or comparisons directly from the content
      - Do NOT use generic information that could apply to any blog on this topic
      - The table should directly reference specific points made in this particular blog
      - This table must be COMPLETELY DIFFERENT from the first table
      
      Content excerpt: "${content.slice(3000, 6000)}..."
      
      Table type: "${secondTableType}"
      
      Return ONLY the HTML table with proper styling. Use this format:
      <div class="overflow-x-auto my-8">
        <table class="w-full border-collapse bg-white text-gray-800">
          <thead class="bg-gray-100">
            <tr>
              <th class="border border-gray-200 px-4 py-2 text-left font-semibold">Column 1</th>
              <th class="border border-gray-200 px-4 py-2 text-left font-semibold">Column 2</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td class="border border-gray-200 px-4 py-2">Data 1</td>
              <td class="border border-gray-200 px-4 py-2">Data 2</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border border-gray-200 px-4 py-2">Data 3</td>
              <td class="border border-gray-200 px-4 py-2">Data 4</td>
            </tr>
            <!-- More rows as needed -->
          </tbody>
        </table>
      </div>
      
      Make sure the table contains ONLY information that is specific to this particular blog content.
      DO NOT include any markdown or code formatting symbols in your response, just the pure HTML.
    `

    // Generate both tables in parallel
    const [firstTable, secondTable] = await Promise.all([
      callAzureOpenAI(firstTablePrompt, 1000),
      callAzureOpenAI(secondTablePrompt, 1000),
    ])

    // Process tables to ensure they're clean HTML without markdown or code formatting
    const cleanFirstTable = cleanTableHTML(firstTable)
    const cleanSecondTable = cleanTableHTML(secondTable)

    // Add a unique identifier to each table to track which blog it belongs to
    const blogId = content.slice(0, 50).replace(/[^a-zA-Z0-9]/g, "")
    const firstTableWithId = cleanFirstTable.replace(
      '<div class="overflow-x-auto my-8">',
      `<div class="overflow-x-auto my-8" data-blog-id="${blogId}-table1">`,
    )
    const secondTableWithId = cleanSecondTable.replace(
      '<div class="overflow-x-auto my-8">',
      `<div class="overflow-x-auto my-8" data-blog-id="${blogId}-table2">`,
    )

    return [firstTableWithId, secondTableWithId]
  } catch (error) {
    console.error("Error generating unique content tables:", error)
    return []
  }
}

// Add a new function to clean table HTML
function cleanTableHTML(tableHTML: string): string {
  // Remove any markdown code block indicators
  let cleanHTML = tableHTML.replace(/```html\s*|\s*```/g, "")

  // Remove any HTML comments
  cleanHTML = cleanHTML.replace(/<!--[\s\S]*?-->/g, "")

  // Ensure proper spacing in HTML attributes
  cleanHTML = cleanHTML.replace(/\s{2,}/g, " ")

  // Fix any broken HTML tags
  cleanHTML = cleanHTML.replace(/<\/td\s*<td/g, "</td><td")
  cleanHTML = cleanHTML.replace(/<\/tr\s*<tr/g, "</tr><tr")

  return cleanHTML
}

// Add a function to create a YouTube embed HTML
function createYouTubeEmbed(youtubeUrl: string): string {
  try {
    // Extract video ID from YouTube URL
    let videoId = ""

    if (youtubeUrl.includes("youtube.com/watch")) {
      const url = new URL(youtubeUrl)
      videoId = url.searchParams.get("v") || ""
    } else if (youtubeUrl.includes("youtu.be/")) {
      videoId = youtubeUrl.split("youtu.be/")[1].split("?")[0]
    }

    if (!videoId) {
      console.error("Could not extract video ID from YouTube URL:", youtubeUrl)
      return ""
    }

    // Create responsive YouTube embed
    return `
      <div class="relative my-8 w-full pt-[56.25%]">
        <iframe 
          class="absolute top-0 left-0 w-full h-full rounded-lg shadow-md" 
          src="https://www.youtube.com/embed/${videoId}"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
    `
  } catch (error) {
    console.error("Error creating YouTube embed:", error)
    return ""
  }
}

// Update the humanizeContent function to be more aggressive with humanization
async function deepHumanizeContent(content: string, coreTopic: string): Promise<string> {
  console.log(`🔥🔥 DEEP HUMANIZING content for topic: ${coreTopic}`)

  // Generate a dynamic intro with more personality
  const introPrompt = `
    Create a unique, conversational intro hook about "${coreTopic}" that sounds like a real person talking.
    Make it casual, edgy, authentic, and slightly provocative - like someone who's passionate and opinionated about this topic.
    Include slang, personal anecdotes, and natural speech patterns with some verbal tics.
    Keep it under 200 characters and don't use any AI-sounding phrases.
    Return just the intro text with no quotes or formatting.
  `
  const randomIntro = await callAzureOpenAI(introPrompt, 300)

  // Create a more detailed humanization prompt
  const prompt = `
    Start with this hook: "${randomIntro}". 
    
    I need you to completely transform this blog content about "${coreTopic}" into something that sounds like I'm talking to my best friend at 1 AM after a few drinks. I want EXTREMELY HUMAN vibes - messy, authentic, occasionally off-topic, with natural speech patterns and verbal tics.
    
    SPECIAL REQUIREMENTS:
    - The blog should primarily focus on the main topic (${coreTopic}) from the scraped website
    - Add frequent personal anecdotes that feel genuine (like "reminds me of that time I...")
    - Include casual phrases like "man, you know what I mean?", "like, seriously though", "I'm not even kidding", "look, here's the thing"
    - Add occasional tangents that circle back to the main point
    - Use contractions, slang, and conversational grammar
    - Include rhetorical questions to the reader
    - Add humor, personality, and occasional mild profanity throughout
    - Vary sentence length dramatically - mix short punchy sentences with longer rambling ones
    - Include occasional self-corrections like "wait, that's not right" or "actually, let me back up"
    - Add emphasis words like "literally", "absolutely", "seriously", "honestly"
    - Include 3-5 personal opinions that sound authentic and slightly controversial
    - Occasionally mix in related topics or tangents that feel natural to the conversation
    - Sometimes briefly mention other related topics in the industry to show broader knowledge
    - These tangents should always connect back to the main topic naturally
    - STRICTLY ENSURE there is NO repetitive content - each paragraph must contain unique information
    - Include at least 3-5 aggressive facts or shocking statistics that will grab attention
    - Make sure the total word count is around 1500-2000 words
    - INCLUDE AT LEAST 5-7 EXTERNAL LINKS to authoritative sources throughout the content
    - Use natural anchor text for links that flows with the conversation
    - INCLUDE AT LEAST 3-4 INTERNAL LINKS to other pages on the same website (use relative URLs like "/blog/another-post")
    - NEVER include meta-commentary like "Here's the revised blog post..." or similar text
    - INCLUDE A CLEAR CALL-TO-ACTION at the end of each major section
    - Each CTA should be relevant to that specific section's topic
    - CTAs should be action-oriented and compelling (e.g., "Try this approach today" or "Start implementing these strategies now")
    
    KEEP ALL THESE INTACT:
    - The H1 title (# Title)
    - All H2 headings (## Heading)
    - All H3 subheadings (### Subheading)
    - All bullet points and lists - IMPORTANT: Format bullet points as "- Term: Description" with the term in bold
    - All links and references
    - The overall structure and information
    
    FORMAT REQUIREMENTS:
    - H1 (#): text-5xl font-bold
    - H2 (##): text-4xl font-bold
    - H3 (###): text-3xl font-bold
    - Paragraphs: text-gray-700 leading-relaxed, no bolding, blank lines between (use \n\n)
    - Lists: Use bullet points with term-colon format like "- **Term**: Description"
    - External Links: [text](https://example.com), class="text-orange-600 underline hover:text-orange-700 font-saira font-normal transition-colors duration-200"
    - Internal Links: [text](/internal-path), text-blue-600 hover:text-blue-800
    - ALWAYS end with a strong, personal call-to-action paragraph
    
    Content: "${content}"
    
    Return pure content, no HTML or extra bolding, and NEVER use the word "markdown" anywhere.
    AVOID AI-FLAGGED WORDS like "unleash" or similar marketing jargon.
    STRICTLY ENSURE there is NO repetition of content within the blog post.
  `

  // Pre-process content to fix any markdown links with spaces
  content = fixMarkdownLinks(content)

  // Process in chunks if content is very large
  let humanizedContent = ""
  if (content.length > 10000) {
    console.log("Content too large, processing in chunks...")
    const chunks = splitContentIntoChunks(content, 8000)
    const humanizedChunks = await Promise.all(
      chunks.map(async (chunk, index) => {
        console.log(`Processing chunk ${index + 1} of ${chunks.length}`)
        const chunkPrompt = prompt.replace('Content: "${content}"', `Content: "${chunk}"`)
        const result = await callAzureOpenAI(chunkPrompt, 16384)
        return result
          .replace(/<[^>]+>/g, "")
          .replace(/\*\*(.*?)\*\*/g, "- $1\n\n")
          .replace(/markdown/gi, "content")
          .trim()
      }),
    )
    humanizedContent = humanizedChunks.join("\n\n")
  } else {
    humanizedContent = await callAzureOpenAI(prompt, 16384)
  }

  console.log(`Deep humanized content (first 200 chars): ${humanizedContent.slice(0, 200)}...`)

  // Clean up the humanized content
  return humanizedContent
    .replace(/<[^>]+>/g, "")
    .replace(/\*\*(.*?)\*\*/g, "- $1\n\n")
    .replace(/\n{1,}/g, "\n\n")
    .replace(/markdown/gi, "content")
    .trim()
}

// Update the generateArticleFromScrapedData function to include YouTube video and tables
async function generateArticleFromScrapedData(
  scrapedData: ScrapedData,
  userId: string,
  humanizeLevel: "normal" | "hardcore" = "normal",
): Promise<ArticleResult> {
  console.log(`Generating article from scraped data for topic: ${scrapedData.coreTopic}`)
  const now = new Date().toISOString().split("T")[0]
  const tempFileName = uuidv4() + ".md"
  const supabase = await createClient()

  try {
    // Use the scraped data to generate a simple title
    console.log("Generating simple title based on scraped data")
    const simpleTitle = await generateEnhancedTitle(scrapedData.coreTopic, userId, scrapedData, supabase)

    console.log(`Generated title: ${simpleTitle}`)

    // Add natural timing between generation steps - INCREASED DELAY
    console.log("Waiting 15 seconds before generating first part...")
    await new Promise((resolve) => setTimeout(resolve, 15000))

    // Extract research results properly
    const researchData = scrapedData.researchResults || []
    console.log(`Found ${researchData.length} research results to process`)

    // Format research data for better OpenAI processing
    const formattedResearch = researchData
      .map((item, index) => `Source ${index + 1}: ${item.url}\nContent: ${item.content.slice(0, 300)}...`)
      .join("\n\n")
      .slice(0, 15000)
    console.log(`Using ${researchData.length} research sources, including Tavily search results`)

    // Get authoritative external links for the topic
    console.log("Finding authoritative external links for the topic...")
    const externalLinks = await findAuthorityExternalLinks(scrapedData.coreTopic, 10)
    const formattedExternalLinks = externalLinks.join(", ")

    // IMPROVED: Generate first part of the article with better research utilization
    console.log("Generating first part of the article")
    const firstPartPrompt = `
      Write the FIRST HALF (introduction and first 3-4 sections) of a comprehensive blog post about "${scrapedData.coreTopic}" with title "${simpleTitle}".
      
      USE THIS RESEARCH DATA:
      - Core Topic: ${scrapedData.coreTopic}
      - Initial Research: ${scrapedData.initialResearchSummary.slice(0, 500)}...
      - Keywords to Include: ${scrapedData.extractedKeywords
        .slice(0, 5)
        .map((k) => k.keyword)
        .join(", ")}
      - Research Summary: ${scrapedData.researchSummary.slice(0, 1000)}...
      - Brand Info: ${scrapedData.brandInfo}
      - YouTube Video to Reference: ${scrapedData.youtubeVideo || "None"}
      - Research Details:
      ${formattedResearch}
      - External Links to Include: ${formattedExternalLinks}
      
      CRITICAL REQUIREMENTS:
      - Target word count: 700-750 words for this FIRST HALF
      - Focus primarily on the main topic from the scraped website
      - Occasionally mix in related topics or industry insights to make content feel more natural
      - ABSOLUTELY NO REPETITION - each paragraph must contain unique information
      - Use varied sentence structures and transitions
      - Include specific examples and data points from the research
      - Cite at least 3 different sources from the research data
      - Make each section distinct with its own focus
      - Use natural language that flows conversationally
      - NEVER start paragraphs with colons (:)
      - NEVER use phrases like "In this section we will discuss" or similar meta-commentary
      - Include at least 2-3 aggressive facts or shocking statistics that will grab attention
      - INCLUDE AT LEAST 3-4 EXTERNAL LINKS to authoritative sources from the provided list
      - Format external links as [anchor text](https://example.com) in markdown
      - Make sure external links have descriptive anchor text and are relevant to the content
      - INCLUDE AT LEAST 2-3 INTERNAL LINKS to other pages on the same website (use relative URLs like "/blog/another-post")
      - Format internal links as [anchor text](/internal-path) in markdown
      - Use natural, contextual anchor text for links that flows with the content
      - NEVER include meta-commentary like "Here's the revised blog post..." or similar text
      - INCLUDE A CLEAR CALL-TO-ACTION at the end of each major section
      - Each CTA should be relevant to that specific section's topic
      - CTAs should be action-oriented and compelling (e.g., "Try this approach today" or "Start implementing these strategies now")
      
      Structure for this FIRST HALF:
      - H1 title at top (# ${simpleTitle})
      - Strong introduction that hooks the reader
      - 3-4 H2 sections with detailed content
      - H3 subsections where appropriate
      - Include bullet lists and blockquotes where appropriate
      
      IMPORTANT: 
      - This is ONLY THE FIRST HALF of the article
      - Do NOT include a conclusion or call-to-action yet
      - NEVER use the word "markdown" anywhere in the content
      - Use natural, conversational language
      - AVOID AI-FLAGGED WORDS like "unleash", "revolutionize", "transform", etc.
      
      Return complete formatted content for the FIRST HALF only.
    `

    const firstPartContent = await callAzureOpenAI(firstPartPrompt, 16384)

    console.log(`First part generated (${countWords(firstPartContent)} words).`)

    // Add a significant delay to simulate natural writing time
    console.log("Waiting 20 seconds before generating second part...")
    await new Promise((resolve) => setTimeout(resolve, 20000))

    // Check first part for repetition before proceeding
    console.log("Checking first part for any repetition...")
    const firstPartDeduped = await removeRepetitiveContent(firstPartContent, scrapedData.coreTopic)

    // IMPROVED: Generate second part with better research utilization and less repetition
    console.log("Generating second part of the article")
    const secondPartPrompt = `
      Write the SECOND HALF (remaining sections, FAQs, and conclusion) of a comprehensive blog post about "${scrapedData.coreTopic}" with title "${simpleTitle}".
      
      THE FIRST HALF OF THE ARTICLE:
      ${firstPartDeduped.slice(0, 500)}...
      
      USE THIS RESEARCH DATA:
      - Core Topic: ${scrapedData.coreTopic}
      - Keywords to Include: ${scrapedData.extractedKeywords
        .slice(5, 10)
        .map((k) => k.keyword)
        .join(", ")}
      - Research Sources: ${scrapedData.researchResults
        .map((r) => r.url)
        .slice(0, 3)
        .join(", ")}
      - Brand Info: ${scrapedData.brandInfo}
      - YouTube Video to Reference: ${scrapedData.youtubeVideo || "None"}
      - Research Details:
      ${formattedResearch}
      - External Links to Include: ${formattedExternalLinks}
      
      CRITICAL REQUIREMENTS:
      - Target word count: 700-750 words for this SECOND HALF (total article 1400-1500 words)
      - Focus primarily on the main topic from the scraped website
      - Occasionally mix in related topics or industry insights to make content feel more natural
      - ABSOLUTELY NO REPETITION - do not repeat information from the first half
      - Each paragraph must contain unique information
      - Use varied sentence structures and transitions
      - Include specific examples and data points from the research
      - Cite at least 3 different sources from the research data
      - Make each section distinct with its own focus
      - Use natural language that flows conversationally
      - NEVER start paragraphs with colons (:)
      - NEVER use phrases like "In this section we will discuss" or similar meta-commentary
      - Include at least 2-3 more aggressive facts or shocking statistics that will grab attention
      - INCLUDE AT LEAST 3-4 MORE EXTERNAL LINKS to authoritative sources from the provided list
      - Format external links as [anchor text](https://example.com) - these will have orange styling and underline with hover effect
      - Make sure external links have descriptive anchor text and are relevant to the content
      - INCLUDE AT LEAST 2-3 MORE INTERNAL LINKS to other pages on the same website (use relative URLs like "/blog/another-post")
      - Format internal links as [anchor text](/internal-path) in markdown
      - Use natural, contextual anchor text for links that flows with the content
      - NEVER include meta-commentary like "Here's the revised blog post..." or similar text
      - INCLUDE A CLEAR CALL-TO-ACTION at the end of each major section
      - Each CTA should be relevant to that specific section's topic
      - CTAs should be action-oriented and compelling (e.g., "Try this approach today" or "Start implementing these strategies now")
      
      Structure for this SECOND HALF:
      - 3-4 more H2 sections with detailed content (different from first half)
      - H3 subsections where appropriate
      - Include bullet lists and blockquotes where appropriate
      - INCLUDE A COMPREHENSIVE FAQ SECTION with at least 5 questions and detailed answers
      - Format the FAQ section as "## Frequently Asked Questions" followed by each question as "### Question?"
      - Each FAQ answer MUST include at least one external link to an authoritative source
      - Use these authoritative external links in your answers: ${formattedExternalLinks}
      
      A strong conclusion section
      - A compelling call-to-action section at the very end
      
      IMPORTANT: 
      - This is the SECOND HALF that completes the article
      - NEVER use the word "markdown" anywhere in the content
      - Use natural, conversational language
      - DO NOT repeat the title or introduction
      - ALWAYS end with a compelling call-to-action section
      - AVOID AI-FLAGGED WORDS like "unleash", "revolutionize", "transform", etc.
      
      Return complete formatted content for the SECOND HALF only.
    `

    const secondPartContent = await callAzureOpenAI(secondPartPrompt, 16384)

    console.log(`Second part generated (${countWords(secondPartContent)} words).`)

    // Add another delay before combining
    console.log("Waiting 10 seconds before combining parts...")
    await new Promise((resolve) => setTimeout(resolve, 10000))

    // Combine both parts
    console.log("Combining parts...")
    const combinedContent = `${firstPartDeduped}\n\n${secondPartContent}`

    console.log(`Combined content: ${countWords(combinedContent)} words.`)

    // Add a delay to simulate natural formatting time
    console.log("Waiting 15 seconds before formatting...")
    await new Promise((resolve) => setTimeout(resolve, 15000))

    // Apply formatting to the combined content
    console.log("Applying deep formatting...")
    const formattedContent = await formatContentWithOpenAI(combinedContent, scrapedData.coreTopic, simpleTitle)

    console.log(`Formatted content: ${countWords(formattedContent)} words.`)

    // ENHANCED: Aggressively check for and remove any repetitive content
    console.log("Aggressively checking for repetitive content...")
    const deduplicatedContent = await removeRepetitiveContent(formattedContent, scrapedData.coreTopic)
    console.log(`Deduplicated content: ${countWords(deduplicatedContent)} words.`)

    // ENHANCED: Check if FAQs exist, if not, ensure they are added
    console.log("Checking if FAQs exist in the content...")
    let contentWithFAQs = deduplicatedContent
    if (
      !contentWithFAQs.includes("## Frequently Asked Questions") &&
      !contentWithFAQs.includes("## FAQ") &&
      !contentWithFAQs.includes("## FAQs")
    ) {
      console.log("No FAQs found, adding them directly with OpenAI...")
      const faqPrompt = `
        The following blog post about "${scrapedData.coreTopic}" is missing a FAQ section.
        
        Please add a comprehensive FAQ section with 5-7 questions and detailed answers.
        
        REQUIREMENTS:
        - Start with "## Frequently Asked Questions"
        - Each question should be formatted as "### Question?"
        - Answers must be detailed and informative (2-3 sentences each)
        - Include a mix of basic and advanced questions
        - EACH ANSWER MUST include at least one external link to an authoritative source
        - Use these authoritative external links in your answers: ${formattedExternalLinks}
        - Format external links as [anchor text](https://example.com)
        - Make sure external links have descriptive anchor text
        - Also include at least 2 internal links formatted as [anchor text](/internal-path)
        
        Blog post content:
        ${contentWithFAQs.slice(0, 5000)}...
        
        Return the COMPLETE blog post with the FAQ section added at the end (before the conclusion if one exists).
      `
      contentWithFAQs = await callAzureOpenAI(faqPrompt, 16384)
      console.log("FAQs added successfully.")
    }

    // ENHANCED: Check if there are enough external and internal links
    console.log("Checking if content has sufficient links...")
    const externalLinkRegex = /\[([^\]]+)\][ \t]*$$https?:\/\/[^)]+$$/g
    const internalLinkRegex = /\[([^\]]+)\][ \t]*$$\/[^)]+$$/g
    const existingExternalLinks = contentWithFAQs.match(externalLinkRegex) || []
    const internalLinks = contentWithFAQs.match(internalLinkRegex) || []

    let contentWithLinks = contentWithFAQs

    if (existingExternalLinks.length < 7 || internalLinks.length < 5) {
      console.log(
        `Found ${existingExternalLinks.length} external links and ${internalLinks.length} internal links. Adding more...`,
      )
      const linksPrompt = `
    This blog post about "${scrapedData.coreTopic}" needs more links.
    
    Current stats:
    - External links: ${existingExternalLinks.length} (need at least 7)
    - Internal links: ${internalLinks.length} (need at least 5)
    
    REQUIREMENTS:
    - Add more external links from this list: ${formattedExternalLinks}
    - Format external links as [anchor text](https://example.com)
    - External links should have orange styling with underline and hover effect in the final HTML
    - Add more internal links to other pages on the same website
    - Format internal links as [anchor text](/internal-path)
    - Internal links should have blue styling with hover effect in the final HTML
    - Insert links naturally within the existing text where they're most relevant
    - Use descriptive anchor text that relates to the linked content
    - Do NOT change any existing links or content structure
    - Do NOT add any new paragraphs or sections just for links
    
    Blog post content:
    ${contentWithLinks}
    
    Return the COMPLETE blog post with additional links added naturally throughout the content.
  `
      contentWithLinks = await callAzureOpenAI(linksPrompt, 16384)
      console.log("Additional links added successfully.")
    }

    // ENHANCED: Remove any leading colons from paragraphs
    console.log("Removing any leading colons from paragraphs...")
    const contentWithoutColons = removeLeadingColons(contentWithLinks)

    // NEW: Apply deep humanization to the content
    console.log("Applying deep humanization to the content...")
    const humanizedContent = await deepHumanizeContent(contentWithoutColons, scrapedData.coreTopic)
    console.log(`Humanized content: ${countWords(humanizedContent)} words.`)

    // Fix any markdown links with spaces between brackets and parentheses
    console.log("Fixing markdown link formatting...")
    const fixedMarkdownLinks = fixMarkdownLinks(humanizedContent)

    // NEW: Find a YouTube video related to the content
    console.log("Finding a YouTube video related to the content...")
    const youtubeVideo = await findYouTubeVideo(scrapedData.coreTopic, fixedMarkdownLinks)
    let youtubeEmbed = ""
    if (youtubeVideo) {
      console.log(`Found YouTube video: ${youtubeVideo}`)
      youtubeEmbed = createYouTubeEmbed(youtubeVideo)
    }

    // NEW: Generate tables related to the content
    console.log("Generating tables related to the content...")
    const contentTables = await generateContentTables(scrapedData.coreTopic, fixedMarkdownLinks)

    // Add a delay before converting to HTML
    console.log("Waiting 8 seconds before converting to HTML...")
    await new Promise((resolve) => setTimeout(resolve, 8000))

    const embedCode: string = youtubeEmbed ?? ""

    // Convert to HTML with improved typography
    console.log("Converting to HTML with improved typography...")
    let htmlContent = formatUtils.convertMarkdownToHtml(fixedMarkdownLinks) || ""

    // Insert YouTube video after the first or second heading
    if (embedCode) {
      const headingMatches = htmlContent.match(/<h[23][^>]*>.*?<\/h[23]>/gi) || []

      if (headingMatches.length >= 2) {
        // Insert after the second heading
        const secondHeading = headingMatches[1] ?? "" // Ensure it's a string
        const secondHeadingPos = htmlContent.indexOf(secondHeading) + secondHeading.length
        htmlContent = htmlContent.slice(0, secondHeadingPos) + embedCode + htmlContent.slice(secondHeadingPos)
      } else if (headingMatches.length >= 1) {
        // Insert after the first heading
        const firstHeading = headingMatches[0] ?? "" // Ensure it's a string
        const firstHeadingPos = htmlContent.indexOf(firstHeading) + firstHeading.length
        htmlContent = htmlContent.slice(0, firstHeadingPos) + embedCode + htmlContent.slice(firstHeadingPos)
      }
    }

    // Insert tables at strategic points in the content
    if (contentTables.length > 0) {
      const paragraphs = htmlContent.match(/<\/p>/g) || []
      if (paragraphs.length >= 6 && contentTables[0]) {
        // Insert first table after the 3rd paragraph
        const thirdParagraphPos = findNthOccurrence(htmlContent, "</p>", 3)
        if (thirdParagraphPos !== -1) {
          htmlContent =
            htmlContent.slice(0, thirdParagraphPos + 4) + contentTables[0] + htmlContent.slice(thirdParagraphPos + 4)
        }
      }

      if (paragraphs.length >= 10 && contentTables[1]) {
        // Insert second table after the 8th paragraph
        const eighthParagraphPos = findNthOccurrence(htmlContent, "</p>", 8)
        if (eighthParagraphPos !== -1) {
          htmlContent =
            htmlContent.slice(0, eighthParagraphPos + 4) + contentTables[1] + htmlContent.slice(eighthParagraphPos + 4)
        }
      }
    }

    // Final check for colons in HTML content
    let finalHtmlContent = htmlContent
      .replace(/<p[^>]*>\s*:\s*/g, '<p class="font-saira text-gray-700 leading-relaxed font-normal my-4">')
      .replace(/<li[^>]*>\s*:\s*/g, '<li class="ml-6 pl-2 list-disc text-gray-700 mb-2">')

    // Apply orange styling to external links and blue styling to internal links
    finalHtmlContent = await styleExternalLinks(finalHtmlContent)

    // Apply final processing to ensure all links are properly formatted
    finalHtmlContent = processContentBeforeSaving(finalHtmlContent)

    // Extract headings and use the keywords from scraped data
    const headings = formattedContent.match(/^#{1,3}\s+(.+)$/gm)?.map((h) => h.replace(/^#{1,3}\s+/, "")) || []
    const keywords = scrapedData.extractedKeywords
      ? scrapedData.extractedKeywords.slice(0, 5).map((k) => ({
          keyword: k.keyword,
          difficulty: k.relevance > 7 ? "High" : k.relevance > 4 ? "Medium" : "Low",
        }))
      : []

    return {
      blogPost: finalHtmlContent,
      seoScore: 85, // Improved default score
      headings,
      keywords,
      citations: scrapedData.references,
      tempFileName,
      title: simpleTitle,
      timestamp: now,
    }
  } catch (error: any) {
    console.error(`Error generating article from scraped data: ${error.message}`)
    throw new Error(`Article generation failed: ${error.message}`)
  }
}

// Helper function to find the nth occurrence of a substring
function findNthOccurrence(text: string, searchString: string, n: number): number {
  let index = -1
  for (let i = 0; i < n; i++) {
    index = text.indexOf(searchString, index + 1)
    if (index === -1) break
  }
  return index
}

// Add a new function to generate FAQs with external links
async function generateFAQsWithExternalLinks(content: string, topic: string): Promise<string> {
  console.log(`Generating comprehensive FAQs with external links for topic: ${topic}`)

  // First, get authoritative external links for the topic
  const externalLinks = await findAuthorityExternalLinks(topic, 8)

  const prompt = `
    Generate 5-7 frequently asked questions (FAQs) related to the content about "${topic}".
    
    REQUIREMENTS:
    - Questions must be highly relevant to the main topic
    - Questions should address common concerns, misconceptions, or interests
    - Answers must be detailed, informative, and valuable (at least 2-3 sentences each)
    - Include a mix of basic and advanced questions
    - Format each question as a markdown heading (## Question) followed by a comprehensive answer
    - IMPORTANT: Each answer MUST include at least one external link to an authoritative source
    - Use these authoritative external links in your answers: ${externalLinks.join(", ")}
    - Make sure each question is properly formatted with ## prefix
    - Ensure the questions are properly spaced with blank lines between them
    
    Content: ${content.slice(0, 5000)}
    
    Return a complete FAQ section with 5-7 questions and detailed answers.
    Start with "## Frequently Asked Questions" as the main heading.
  `
  const faqs = await callAzureOpenAI(prompt, 16384)

  // Ensure the FAQ section starts with the proper heading if it doesn't already
  if (!faqs.trim().startsWith("## Frequently Asked Questions")) {
    return `\n\n## Frequently Asked Questions\n\n${faqs.trim()}`
  }

  return `\n\n${faqs.trim()}`
}

// Modify the ensureFAQsExist function to use our new function with external links
async function ensureFAQsExist(content: string, topic: string): Promise<string> {
  console.log("Ensuring FAQs with external links are properly included...")

  // Check if FAQs already exist in the content
  if (content.includes("## Frequently Asked Questions") || content.includes("## FAQ") || content.includes("## FAQs")) {
    console.log("FAQs already exist in content, ensuring they're properly formatted...")

    // Ensure the existing FAQs are properly formatted
    const faqCheckPrompt = `
      Review the FAQ section in this content about "${topic}".
      
      CRITICAL REQUIREMENTS:
      - There MUST be at least 4-5 high-quality, relevant FAQs with clear answers
      - Each FAQ question MUST be formatted as a proper markdown heading with ## prefix
      - Each question must be followed by a comprehensive answer (2-3 paragraphs)
      - If the FAQ section exists but is inadequate, improve it
      - If questions aren't properly formatted as ## headings, fix them
      - Ensure proper spacing between questions and answers
      - Do NOT use colons at the beginning of paragraphs in the answers
      - Include at least 1-2 external links to authoritative sources in the FAQ answers
      - NEVER include meta-commentary like "Here's the revised blog post..." or similar text
      
      Content: ${content}
      
      Return the full content with properly formatted FAQs included.
      Make sure the FAQ section starts with "## Frequently Asked Questions" as the main heading.
    `

    try {
      const checkedContent = await callAzureOpenAI(faqCheckPrompt, 16384)
      return checkedContent
    } catch (error) {
      console.error("Error checking existing FAQs:", error)
      // If error, generate new FAQs and append
      const newFAQs = await generateFAQsWithExternalLinks(content, topic)
      return `${content}\n\n${newFAQs}`
    }
  } else {
    console.log("No FAQs found, generating and adding them...")
    const faqs = await generateFAQsWithExternalLinks(content, topic)
    return `${content}\n\n${faqs}`
  }
}

// Add a new function to add external links to specific sections
async function addExternalLinksToSections(content: string, topic: string): Promise<string> {
  console.log("Adding external links to specific sections...")

  // Get authoritative external links
  const externalLinks = await findAuthorityExternalLinks(topic, 10)

  if (externalLinks.length === 0) {
    console.log("No external links found, returning original content")
    return content
  }

  // Extract sections from content
  const sections = content.split(/(<h[1-6][^>]*>.*?<\/h[1-6]>)/g).filter(Boolean)

  if (sections.length <= 1) {
    // If no clear sections, add links to paragraphs
    return await ensureExternalLinks(content, topic, 7)
  }

  // Process each section to add external links
  let result = ""
  let linkIndex = 0

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]

    // If this is a heading, add it as is
    if (section.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/)) {
      result += section
      continue
    }

    // If this section already has links, keep it as is
    const linkRegex = /\[([^\]]+)\][ \t]*$$https?:\/\/[^)]+$$/g
    const existingLinks = section.match(linkRegex) || []

    if (existingLinks.length >= 1) {
      result += section
      continue
    }

    // If this is a substantial section without links, add one
    if (section.length > 200 && linkIndex < externalLinks.length) {
      const prompt = `
        Add exactly ONE external link to this section about "${topic}".
        
        REQUIREMENTS:
        - Use this external link: ${externalLinks[linkIndex]}
        - Insert the link naturally within the existing text where it's most relevant
        - Use descriptive anchor text that relates to the linked content
        - Do NOT change any existing content structure
        - Format link as [anchor text](URL) in markdown
        
        Section content:
        ${section}
        
        Return the enhanced section with the added external link.
      `

      const enhancedSection = await callAzureOpenAI(prompt, 16384)
      result += enhancedSection
      linkIndex++
    } else {
      result += section
    }
  }

  return result
}

// NEW FUNCTIONS FOR IMAGE INTEGRATION

async function fetchStockImages(topic: string, count = 3): Promise<string[]> {
  try {
    const apiKey = process.env.RUNWARE_API_KEY || "";
    console.log(`Generating ${count} images with Runware AI for topic: ${topic}`);

    const { Runware } = await import("@runware/sdk-js");
    const runware = new Runware({ apiKey });
    console.log(`Initializing Runware AI for image generation...`);

    await runware.ensureConnection();

    const enhancedPrompt = `Professional, high-quality image of ${topic}. Photorealistic, detailed, perfect lighting, 8k resolution, commercial quality.`;

    const images = await runware.requestImages({
      positivePrompt: enhancedPrompt,
      negativePrompt: "blurry, low quality, distorted, watermark, text, signature, low resolution, nsfw",
      width: 1024,
      height: 768,
      model: "runware:100@1",
      numberResults: count,
      outputType: "URL",
      outputFormat: "PNG",
      steps: 25,
      CFGScale: 4.0,
      checkNSFW: true,
    });

    // Check if images is defined and is an array
    if (!images || !Array.isArray(images)) {
      console.warn("Runware AI returned no images or an invalid response, falling back to placeholders");
      return generatePlaceholderImages(count, topic);
    }

    console.log(`Successfully generated ${images.length} images with Runware AI for "${topic}"`);

    const imageUrls = images.map((img: any) => img.imageURL || "").filter((url: string) => url);

    if (imageUrls.length === 0) {
      console.warn("No valid image URLs were generated by Runware AI, falling back to placeholders");
      return generatePlaceholderImages(count, topic);
    }

    return imageUrls;
  } catch (error) {
    console.error("Error generating images with Runware AI:", error);
    try {
      const apiKey = process.env.RUNWARE_API_KEY || "";
      console.log("Trying with alternative model 'sdxl'...");
      const { Runware } = await import("@runware/sdk-js");

      const runware = new Runware({ apiKey });
      await runware.ensureConnection();

      const enhancedPrompt = `Professional, high-quality image of ${topic}. Photorealistic, detailed, perfect lighting, 8k resolution, commercial quality.`;

      const images = await runware.requestImages({
        positivePrompt: enhancedPrompt,
        negativePrompt: "blurry, low quality, distorted, watermark, text, signature, low resolution",
        width: 1024,
        height: 768,
        model: "runware:sdxl@1",
        numberResults: count,
        outputType: "URL",
        outputFormat: "PNG",
        steps: 25,
        CFGScale: 4.0,
        checkNSFW: true,
      });

      // Check if images is defined and is an array
      if (!images || !Array.isArray(images)) {
        console.warn("Runware AI (fallback) returned no images or an invalid response, falling back to placeholders");
        return generatePlaceholderImages(count, topic);
      }

      console.log(`Successfully generated ${images.length} images with fallback model for "${topic}"`);

      const imageUrls = images.map((img: any) => img.imageURL || "").filter((url: string) => url);

      if (imageUrls.length > 0) {
        return imageUrls;
      }
    } catch (fallbackError) {
      console.error("Error with fallback model:", fallbackError);
    }

    return generatePlaceholderImages(count, topic);
  }
}

// Fix for line 1054: Add type annotation for 'cls' parameter
function updateClassNames(cls: string): string {
  // Remove any margin or padding classes
  const cleanedClasses = cls
    .split(" ")
    .filter((className) => !className.match(/^m[trblxy]?-\d+$/) && !className.match(/^p[trblxy]?-\d+$/))
    .join(" ")
  return `${cleanedClasses} my-2`
}

// Update the determineImagePlacements function to create more specific prompts and limit to 2 images
async function determineImagePlacements(
  blogContent: string,
  topic: string,
  imageCount = 2,
): Promise<{ content: string; imageUrls: string[] }> {
  try {
    // Extract headings to understand the structure
    const headingMatches = blogContent.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi) || []
    const headings = headingMatches.map((h) => h.replace(/<\/?[^>]+>/g, "").trim())

    // Extract text content from HTML
    const textContent = blogContent.replace(/<[^>]+>/g, " ").slice(0, 10000)

    // Fetch stock images
    const imageUrls = await fetchStockImages(topic, imageCount)

    // If we couldn't get any images, return original content
    if (!imageUrls.length) {
      return { content: blogContent, imageUrls: [] }
    }

    // Use OpenAI to determine optimal image placement with more specific context
    const prompt = `
      I have a blog post about "${topic}" and ${imageCount} relevant images to place within it.
      The blog post contains these main sections: ${headings.join(", ")}.
      
      Based on the content, determine the best ${imageCount} locations to insert these images.
      
      For each image, provide:
      1. A very specific description of what the image should show (for alt text) - be precise about the subject matter
      2. The exact heading or paragraph after which it should appear (use exact text from the content)
      3. A detailed caption that explains what the image shows and how it relates to the surrounding content
      
      Content excerpt: "${textContent.slice(0, 3000)}..."
      
      Return a JSON array with ${imageCount} objects, each with:
      {
        "description": "Detailed description for alt text",
        "insertAfter": "Exact text to insert after",
        "caption": "Detailed image caption"
      }
      
      Make sure each image is placed in a different section of the content for better distribution.
    `

    const placementResult = await callAzureOpenAI(prompt, 1000)
    let placements = []

    try {
      placements = JSON.parse(placementResult.replace(/```json\n?|\n?```/g, "").trim())
    } catch (error) {
      console.error("Error parsing image placements:", error)
      // Fallback to simple placement if parsing fails
      return insertImagesAtRegularIntervals(blogContent, imageUrls, topic)
    }

    // Insert images at the determined locations
    return insertImagesAtPlacements(blogContent, imageUrls, placements, topic)
  } catch (error) {
    console.error("Error determining image placements:", error)
    return { content: blogContent, imageUrls: [] }
  }
}

// Update the image insertion functions to use better spacing
function insertImagesAtRegularIntervals(
  content: string,
  imageUrls: string[],
  topic: string,
): { content: string; imageUrls: string[] } {
  if (!imageUrls.length) return { content, imageUrls: [] }

  // Find all paragraph closing tags
  const paragraphs = content.match(/<\/p>/g) || []

  if (paragraphs.length < imageUrls.length) {
    return { content, imageUrls }
  }

  // Calculate interval for even distribution
  const interval = Math.floor(paragraphs.length / (imageUrls.length + 1))

  // Insert images after selected paragraphs
  let modifiedContent = content
  let lastIndex = 0
  const usedImageUrls: string[] = []

  imageUrls.forEach((imageUrl, i) => {
    const targetIndex = (i + 1) * interval
    if (targetIndex >= paragraphs.length) return

    // Find the position of the nth paragraph closing tag
    let count = 0
    let position = -1

    while (count <= targetIndex) {
      position = modifiedContent.indexOf("</p>", position + 1)
      if (position === -1) break
      count++
    }

    if (position !== -1) {
      // Better spacing image HTML with improved typography
      const imageHtml = `</p><figure class="my-6 mx-auto max-w-full"><img src="${imageUrl}" alt="${topic} image ${i + 1}" class="w-full rounded-lg shadow-md" /><figcaption class="text-sm text-center text-gray-500 mt-2 font-saira">${topic} - related image</figcaption></figure><p class="font-saira text-gray-700 leading-relaxed font-normal my-4">`

      modifiedContent = modifiedContent.slice(0, position + 4) + imageHtml + modifiedContent.slice(position + 4)
      lastIndex = position + imageHtml.length
      usedImageUrls.push(imageUrl)
    }
  })

  return { content: modifiedContent, imageUrls: usedImageUrls }
}

// Update the image placement function with better spacing
function insertImagesAtPlacements(
  content: string,
  imageUrls: string[],
  placements: any[],
  topic: string,
): { content: string; imageUrls: string[] } {
  if (!imageUrls.length || !placements.length) {
    return { content, imageUrls }
  }

  let modifiedContent = content
  const usedImageUrls: string[] = []

  // Process each placement
  placements.forEach((placement, index) => {
    if (index >= imageUrls.length) return

    const imageUrl = imageUrls[index]
    const insertAfter = placement.insertAfter || ""
    const description = placement.description || `Image related to ${topic}`
    const caption = placement.caption || `Figure ${index + 1}: Related to ${topic}`

    // Find the text to insert after
    const position = modifiedContent.indexOf(insertAfter)

    if (position !== -1 && insertAfter.length > 0) {
      const endPosition = position + insertAfter.length

      // Better spacing image HTML with improved typography
      const imageHtml = `<figure class="my-6 mx-auto max-w-full"><img src="${imageUrl}" alt="${description}" class="w-full rounded-lg shadow-md" /><figcaption class="text-sm text-center text-gray-500 mt-2 font-saira">${caption}</figcaption></figure>`

      modifiedContent = modifiedContent.slice(0, endPosition) + imageHtml + modifiedContent.slice(endPosition)
      usedImageUrls.push(imageUrl)
    }
  })

  // If we couldn't place all images using AI suggestions, add remaining at regular intervals
  if (usedImageUrls.length < imageUrls.length) {
    const remainingImages = imageUrls.filter((url) => !usedImageUrls.includes(url))
    const result = insertImagesAtRegularIntervals(modifiedContent, remainingImages, topic)
    modifiedContent = result.content
    usedImageUrls.push(...result.imageUrls)
  }

  return { content: modifiedContent, imageUrls: usedImageUrls }
}

// Enhanced function to ensure both external and internal links have proper styling
async function styleExternalLinksEnhanced(htmlContent: string): Promise<string> {
  // First pass: Style external links with orange color, underline, and hover effect
  let updatedContent = htmlContent.replace(
    /<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi,
    (match, url, text) => {
      // Check if it's an external link
      if (url.startsWith("http") || url.startsWith("https")) {
        return `<a href="${url}" class="text-orange-600 underline hover:text-orange-700 font-saira font-normal transition-colors duration-200" target="_blank" rel="noopener noreferrer">${text}</a>`
      }
      return match // Keep internal links for second pass
    },
  )

  // Second pass: Style internal links with blue color and hover effect
  updatedContent = updatedContent.replace(
    /<a\s+(?:[^>]*?\s+)?href=["'](\/[^"']*)["'][^>]*>(.*?)<\/a>/gi,
    (match, url, text) => {
      // This matches only internal links that start with /
      return `<a href="${url}" class="text-blue-600 hover:text-blue-800 font-normal transition-colors duration-200">${text}</a>`
    },
  )

  return updatedContent
}

// Update the enhanceBlogWithImages function to fix bullet point styling
async function enhanceBlogWithImages(blogContent: string, topic: string, imageCount = 2): Promise<string> {
  console.log(`Enhancing blog post with ${imageCount} images related to: ${topic}`)

  // Determine image placements and insert images
  const { content } = await determineImagePlacements(blogContent, topic, imageCount)

  // Final pass to ensure better typography
  let finalContent = formatUtils.sanitizeHtml(content)

  // Additional typography improvements
  finalContent = finalContent
    .replace(/>\s+</g, "><") // Remove excessive whitespace between tags
    .replace(/\s{2,}/g, " ") // Replace multiple spaces with single space
    .replace(/<\/figure><p/g, "</figure><p") // Ensure no space after figures
    // Improve typography for headings with Saira font
    .replace(/<h1[^>]*>/g, '<h1 class="font-saira text-5xl font-bold mt-8 mb-6 text-gray-900">')
    .replace(/<h2[^>]*>/g, '<h2 class="font-saira text-4xl font-bold mt-10 mb-5 text-gray-900">')
    .replace(/<h3[^>]*>/g, '<h3 class="font-saira text-3xl font-bold mt-8 mb-4 text-gray-800">')
    // Improve typography for paragraphs with Saira font
    .replace(/<p[^>]*>/g, '<p class="font-saira text-gray-700 leading-relaxed font-normal my-4">')
    // Improve typography for lists with proper spacing and bullet styling
    .replace(/<ul[^>]*>/g, '<ul class="pl-6 my-6 space-y-1">')

    // Fix bullet points with dash format (• - Term)
    .replace(
      /<li[^>]*><span[^>]*>•<\/span><div>-\s*([^<]+)<\/div><\/li>/g,
      '<li class="flex items-start mb-4"><span class="text-gray-800 mr-2">•</span><div><strong class="font-bold">$1</strong></div></li>',
    )

    // Ensure bullet points have the exact styling from the example
    .replace(
      /<li[^>]*>([^<]*)<\/li>/g,
      '<li class="flex items-start mb-4"><span class="text-gray-800 mr-2">•</span><div>$1</div></li>',
    )

    // Special handling for list items with bold terms
    .replace(
      /<li[^>]*><strong[^>]*>([^<]+)<\/strong>:\s*([^<]*)<\/li>/g,
      '<li class="flex items-start mb-4"><span class="text-gray-800 mr-2">•</span><div><strong class="font-bold">$1</strong>: $2</div></li>',
    )

    // Ensure bold text is properly styled
    .replace(/<strong[^>]*>/g, '<strong class="font-bold">')
    // Improve typography for figures with better spacing
    .replace(/<figure[^>]*>/g, '<figure class="my-6 mx-auto max-w-full">')
    .replace(/<figcaption[^>]*>/g, '<figcaption class="text-sm text-center text-gray-500 mt-2 font-saira">')
    // Ensure all links have target="_blank" and rel attributes for external links
    .replace(/<a([^>]*)>/g, '<a$1 target="_blank" rel="noopener noreferrer">')

  // Apply orange styling to external links
  finalContent = await styleExternalLinksEnhanced(finalContent)

  // Double-check that all links have proper styling - sometimes they can be missed
  const linkValidation = validateLinks(finalContent)
  console.log(
    `Final styling check: ${linkValidation.externalLinkCount} external links and ${linkValidation.internalLinkCount} internal links styled.`,
  )

  if (!linkValidation.hasExternalLinks && finalContent.includes('href="http')) {
    console.log("Found external links without styling, applying enhanced styling...")
    finalContent = await styleExternalLinksEnhanced(finalContent)
  }

  // Check if FAQ section exists, if not, add it
  if (!hasFAQSection(finalContent)) {
    console.log("No FAQ section found, adding one...")

    // Generate FAQs with OpenAI
    const faqPrompt = `
      Generate 4 frequently asked questions (FAQs) related to "${topic}".
      
      REQUIREMENTS:
      - Questions must be highly relevant to the main topic
      - Questions should address common concerns, misconceptions, or interests
      - Answers must be detailed and informative (2-3 sentences each)
      - Include a mix of basic and advanced questions
      - Each answer should include at least one relevant link
      - Format as HTML with proper classes matching the blog styling
      
      Return complete HTML for a FAQ section with 4 questions and answers.
    `

    const faqContent = await callAzureOpenAI(faqPrompt, 2000) // Create a properly formatted FAQ section
    const faqSection = `
<h2 class="font-saira text-4xl font-bold mt-10 mb-5 text-gray-900">Frequently Asked Questions</h2>

${faqContent}
`

    // Add the FAQ section to the end of the content
    finalContent = finalContent + faqSection
  }

  // Add a wrapper div with font-family declaration to ensure Saira font is applied
  finalContent = `<div class="blog-content font-saira">${finalContent}</div>`

  // Final pass to ensure external links have the right formatting
  finalContent = finalContent.replace(
    /<a\s+(?:[^>]*?\s+)?href=["'](https?:\/\/[^"']*)["'][^>]*>(.*?)<\/a>/gi,
    (match, url, text) => {
      return `<a href="${url}" class="text-orange-600 underline hover:text-orange-700 font-saira font-normal transition-colors duration-200" target="_blank" rel="noopener noreferrer">${text}</a>`
    },
  )

  // Final processing to ensure all links are properly formatted
  finalContent = processContentBeforeSaving(finalContent)

  // Remove any duplicate content after conclusion
  finalContent = removeDuplicateContentAfterConclusion(finalContent)

  // Ensure bold text is properly rendered
  finalContent = finalContent.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')

  return finalContent
}

// Update processContentBeforeSaving to fix bullet point styling
function processContentBeforeSaving(content: string): string {
  // First, directly convert any markdown links in the HTML content to HTML <a> tags
  let processedContent = content.replace(/\[([^\]]+)\]\s*$$([^)]+)$$/g, (match, text, url) => {
    // Clean up any extra whitespace
    const cleanText = text.trim()
    const cleanUrl = url.trim()

    if (cleanUrl.startsWith("http") || cleanUrl.startsWith("https")) {
      return `<a href="${cleanUrl}" class="text-orange-600 underline hover:text-orange-700 font-saira font-normal transition-colors duration-200" target="_blank" rel="noopener noreferrer">${cleanText}</a>`
    } else if (cleanUrl.startsWith("/")) {
      return `<a href="${cleanUrl}" class="text-blue-600 hover:text-blue-800 font-normal transition-colors duration-200">${cleanText}</a>`
    } else {
      return `<a href="${cleanUrl}" class="text-blue-600 hover:text-blue-800 font-normal transition-colors duration-200">${cleanText}</a>`
    }
  })

  // Also ensure all external links have the right styling
  processedContent = processedContent.replace(
    /<a\s+(?:[^>]*?\s+)?href=["'](https?:\/\/[^"']*)["'][^>]*>(.*?)<\/a>/gi,
    (match, url, text) => {
      return `<a href="${url}" class="text-orange-600 underline hover:text-orange-700 font-saira font-normal transition-colors duration-200" target="_blank" rel="noopener noreferrer">${text}</a>`
    },
  )

  // Ensure bold text is properly rendered
  processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')

  // Remove bullet points and convert them to regular paragraphs
  processedContent = processedContent.replace(
    /<li[^>]*>(?:<span[^>]*>•<\/span>)?<div>(.*?)<\/div><\/li>/g,
    '<p class="font-saira text-gray-700 leading-relaxed font-normal my-4">$1</p>',
  )

  // Convert any remaining list items to paragraphs
  processedContent = processedContent.replace(
    /<li[^>]*>(.*?)<\/li>/g,
    '<p class="font-saira text-gray-700 leading-relaxed font-normal my-4">$1</p>',
  )

  // Remove any ul/ol tags
  processedContent = processedContent.replace(/<\/?ul[^>]*>/g, "")
  processedContent = processedContent.replace(/<\/?ol[^>]*>/g, "")

  return processedContent
}

export async function generateBlog(url: string, humanizeLevel: "normal" | "hardcore" = "normal"): Promise<BlogPost[]> {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error("You need to be authenticated to generate blog posts!")
  }

  const userId = user.id
  const blogPosts: BlogPost[] = []
  const firstRevealDate = new Date()
  const existingContent: string[] = [] // Track content to avoid repetition
  const existingTitles: string[] = [] // Track titles to avoid repetition

  const reformatExistingPosts = async (supabase: any, userId: string): Promise<void> => {
    try {
      const { data: postsToReformat, error: selectError } = await supabase
        .from("blogs")
        .select("id, blog_post")
        .eq("user_id", userId)
        .is("needs_reformatting", true)

      if (selectError) {
        console.error("Error selecting posts to reformat:", selectError.message)
        return
      }

      if (!postsToReformat || postsToReformat.length === 0) {
        console.log("No posts need reformatting.")
        return
      }

      for (const post of postsToReformat) {
        try {
          const formattedContent = formatUtils.convertMarkdownToHtml(post.blog_post)

          const { error: updateError } = await supabase
            .from("blogs")
            .update({ blog_post: formattedContent, needs_reformatting: false })
            .eq("id", post.id)

          if (updateError) {
            console.error(`Error updating post ${post.id}:`, updateError.message)
          } else {
            console.log(`Successfully reformatted post ${post.id}`)
          }
        } catch (reformatError: any) {
          console.error(`Error reformatting post ${post.id}:`, reformatError.message)
        }
      }
    } catch (error: any) {
      console.error("Error in reformatExistingPosts:", error.message)
    }
  }

  try {
    // Reformat existing posts if needed
    console.log(`Checking for posts that need reformatting for user ${userId}`)
    await reformatExistingPosts(supabase, userId)

    // Get existing posts to check for content similarity
    const { data: existingPosts } = await supabase
      .from("blogs")
      .select("title, blog_post, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20)

    if (existingPosts && existingPosts.length > 0) {
      existingPosts.forEach((post: any) => {
        existingTitles.push(post.title)
        const textContent = post.blog_post
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
        existingContent.push(textContent)
      })
    }

    // Fetch subscription details
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("plan_id, credits, last_renewed")
      .eq("user_id", userId)
      .single()

    if (subscriptionError || !subscription) {
      throw new Error(`Failed to fetch subscription: ${subscriptionError?.message || "No subscription found"}`)
    }

    if (!subscription.plan_id) {
      throw new Error("No active subscription plan found for this user")
    }

    // Define plan limits
    const planCreditsMap: { [key: string]: number } = {
      trial: 2,
      starter: 30,
      pro: 30,
      professional: 60,
    }

    const maxPosts = planCreditsMap[subscription.plan_id.toLowerCase()] || 0
    if (!maxPosts) {
      throw new Error(`Invalid subscription plan: ${subscription.plan_id}`)
    }

    // Check and renew credits if it's a new month
    const currentDate = new Date()
    const lastRenewed = subscription.last_renewed ? new Date(subscription.last_renewed) : new Date(0) // Default to epoch if null
    const isNewMonth =
      currentDate.getMonth() !== lastRenewed.getMonth() || currentDate.getFullYear() !== lastRenewed.getFullYear()
    const isPastFirst = currentDate.getDate() >= 1 && currentDate > lastRenewed

    let availableCredits = subscription.credits !== undefined ? subscription.credits : maxPosts

    if (isNewMonth && isPastFirst) {
      console.log(`Renewing credits for ${subscription.plan_id} on ${currentDate.toISOString().split("T")[0]}`)
      availableCredits = maxPosts // Reset to max credits
      const { error: renewError } = await supabase
        .from("subscriptions")
        .update({
          credits: maxPosts,
          last_renewed: currentDate.toISOString(),
        })
        .eq("user_id", userId)

      if (renewError) {
        console.error(`Failed to renew credits: ${renewError.message}`)
      } else {
        console.log(`Credits renewed to ${maxPosts} for ${subscription.plan_id}`)
      }
    }

    if (availableCredits <= 0) {
      throw new Error("No credits remaining to generate blog posts!")
    }

    // Count blogs generated since last renewal
    const renewalDateStart = new Date(lastRenewed)
    renewalDateStart.setDate(1) // Start of the renewal month
    renewalDateStart.setHours(0, 0, 0, 0)

    const { data: blogsThisMonth, error: blogsError } = await supabase
      .from("blogs")
      .select("id")
      .eq("user_id", userId)
      .gte("created_at", renewalDateStart.toISOString())
      .lte("created_at", currentDate.toISOString())

    if (blogsError) {
      console.error(`Error fetching blogs this month: ${blogsError.message}`)
    }

    const blogsGeneratedThisMonth = blogsThisMonth ? blogsThisMonth.length : 0
    console.log(`User has generated ${blogsGeneratedThisMonth} blogs since last renewal`)

    // Calculate remaining posts to generate this month
    const remainingCredits = Math.max(0, maxPosts - blogsGeneratedThisMonth)
    const postsToGenerate = Math.min(remainingCredits, availableCredits)
    console.log(`Can generate ${postsToGenerate} more posts this month with ${availableCredits} credits available`)

    if (postsToGenerate <= 0) {
      console.log("No more posts can be generated this month based on remaining credits.")
      return blogPosts // Return empty array if no posts can be generated
    }

    console.log(`Generating ${postsToGenerate} posts for user ${userId} - ONE AT A TIME, VERY SLOWLY`)

    // Generate posts sequentially
    for (let i = 0; i < postsToGenerate; i++) {
      try {
        console.log(`\n\n========== STARTING BLOG POST ${i + 1} OF ${postsToGenerate} ==========\n\n`)

        console.log(`Waiting 10 seconds before starting blog post ${i + 1}...`)
        await new Promise((resolve) => setTimeout(resolve, 10000))

        console.log(`🔍 Scraping ${url} with Tavily and searching broader topic for blog ${i + 1}`)
        const scrapedData = await scrapeWebsiteAndSaveToJson(url, userId)
        if (!scrapedData) {
          throw new Error(`Failed to scrape data for blog ${i + 1}`)
        }
        console.log(`✅ Scraped ${url} and got ${scrapedData.researchResults.length} extra sources for blog ${i + 1}`)

        console.log(`Waiting 8 seconds after scraping for blog post ${i + 1}...`)
        await new Promise((resolve) => setTimeout(resolve, 8000))

        console.log(`Starting content generation for blog post ${i + 1}...`)
        let result = await generateArticleFromScrapedData(scrapedData, userId, humanizeLevel)

        const contentSimilarityCheck = await checkContentSimilarity(
          result.blogPost
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim(),
          existingContent,
          existingTitles,
        )

        if (contentSimilarityCheck.isTooSimilar) {
          console.log(
            `⚠️ Generated content too similar to existing post "${contentSimilarityCheck.similarToTitle}". Regenerating with more diversity...`,
          )
          scrapedData.nudge = `IMPORTANT: Make this content COMPLETELY DIFFERENT from your previous post about "${contentSimilarityCheck.similarToTitle}". Use different examples, structure, and approach.`
          result = await generateArticleFromScrapedData(scrapedData, userId, humanizeLevel)
        }

        const coreTopic = result.title || "blog topic"

        console.log(`Waiting 5 seconds before adding images to blog post ${i + 1}...`)
        await new Promise((resolve) => setTimeout(resolve, 5000))

        console.log(`Enhancing blog post ${i + 1} with images related to: ${coreTopic}`)
        const enhancedBlogPost = await enhanceBlogWithImages(result.blogPost, coreTopic, 2)

        const blogId = uuidv4()
        const revealDate = new Date(firstRevealDate)
        revealDate.setDate(revealDate.getDate() + i)

        console.log(`Waiting 3 seconds before saving blog post ${i + 1} to database...`)
        await new Promise((resolve) => setTimeout(resolve, 3000))

        const blogData: BlogPost = {
          id: blogId,
          user_id: userId,
          blog_post: enhancedBlogPost,
          citations: result.citations,
          created_at: new Date().toISOString(),
          title: result.title,
          timestamp: result.timestamp,
          reveal_date: revealDate.toISOString(),
          url: url,
        }

        const { error: insertError } = await supabase.from("blogs").insert(blogData)

        if (insertError) {
          throw new Error(`Failed to save blog ${i + 1} to Supabase: ${insertError.message}`)
        }

        existingTitles.push(result.title)
        existingContent.push(
          enhancedBlogPost
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim(),
        )

        console.log(`\n\n✅ COMPLETED BLOG POST ${i + 1} OF ${postsToGenerate}\n\n`)
        blogPosts.push(blogData)

        if (i < postsToGenerate - 1) {
          const delaySeconds = 20
          console.log(`Waiting ${delaySeconds} seconds before starting the next blog post...`)
          await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000))
        }
      } catch (error: any) {
        console.error(`Error generating post ${i + 1}:`, error)
        console.log(`Stopping generation due to error, ${blogPosts.length} posts completed...`)
        break // Stop generation on error, keep successful posts
      }
    }

    // Deduct credits for successful posts only
    const successfulPosts = blogPosts.length
    const newCredits = availableCredits - successfulPosts

    if (successfulPosts > 0) {
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({ credits: newCredits })
        .eq("user_id", userId)

      if (updateError) {
        console.error(`Failed to deduct credits: ${updateError.message}`)
      } else {
        console.log(`Deducted ${successfulPosts} credits. New balance: ${newCredits}`)
      }
    }

    console.log(`✅ Generated ${successfulPosts} blog posts for user ${userId}`)
    return blogPosts
  } catch (error: any) {
    console.error(`Failed to generate blogs: ${error.message}`)
    throw new Error(`Blog generation failed: ${error.message}`)
  }
}

// New function to check content similarity
async function checkContentSimilarity(
  newContent: string,
  existingContents: string[],
  existingTitles: string[],
): Promise<{ isTooSimilar: boolean; similarToTitle: string; similarityScore: number }> {
  if (existingContents.length === 0) {
    return { isTooSimilar: false, similarToTitle: "", similarityScore: 0 }
  }

  // Extract significant words (longer than 4 chars) for comparison
  const getSignificantWords = (text: string): string[] => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 4)
  }

  const newContentWords = getSignificantWords(newContent)

  let highestSimilarity = 0
  let mostSimilarTitle = ""

  for (let i = 0; i < existingContents.length; i++) {
    const existingWords = getSignificantWords(existingContents[i])

    // Count matching words
    let matchCount = 0
    for (const word of newContentWords) {
      if (existingWords.includes(word)) {
        matchCount++
      }
    }

    // Calculate similarity as percentage of matching words
    const similarity = (matchCount / newContentWords.length) * 100

    if (similarity > highestSimilarity) {
      highestSimilarity = similarity
      mostSimilarTitle = existingTitles[i] || "previous post"
    }
  }

  // If more than 40% of significant words match, consider it too similar
  return {
    isTooSimilar: highestSimilarity > 40,
    similarToTitle: mostSimilarTitle,
    similarityScore: highestSimilarity,
  }
}

// Helper functions that are missing
function splitContentIntoChunks(content: string, chunkSize: number): string[] {
  const chunks: string[] = []
  for (let i = 0; i < content.length; i += chunkSize) {
    chunks.push(content.slice(i, i + chunkSize))
  }
  return chunks
}

// NEW: Function to extract data points from research for data-driven titles and content
async function extractDataPointsFromResearch(
  researchResults: { url: string; content: string; title: string }[],
  topic: string,
): Promise<DataPoint[]> {
  console.log(`Extracting data points from research for topic: ${topic}`)

  // Combine research content for analysis
  const combinedResearch = researchResults
    .map((result) => `Source: ${result.url}\nContent: ${result.content.slice(0, 1000)}`)
    .join("\n\n")
    .slice(0, 15000) // Limit total size

  const prompt = `
  Extract 10-15 specific, compelling data points from this research about "${topic}" that would make great hooks for clickbait-style headlines.
  
  FOCUS ON:
  - Specific percentages (e.g., "72% of marketers failed at...")
  - Specific years (especially ${new Date().getFullYear() + 1} for future-focused content)
  - Specific counts (e.g., "The 7 deadly sins of...")
  - Specific comparisons (e.g., "Why X is 3x better than Y")
  - Shocking statistics or claims that grab attention
  - Data that challenges conventional wisdom
  
  For each data point, provide:
  1. The type (percentage, statistic, year, comparison, count)
  2. The specific value (the number, percentage, or year)
  3. Brief context about what this data point means
  4. Source URL if available
  
  Research content:
  ${combinedResearch}
  
  Return as JSON array:
  [
    {
      "type": "percentage",
      "value": "72%",
      "context": "marketers who failed to achieve ROI from content marketing in 2024",
      "source": "example.com"
    },
    ...
  ]
  
  If you can't find real data points, create plausible ones based on industry trends and knowledge.
`

  try {
    const response = await callAzureOpenAI(prompt, 2000)
    const cleanedResponse = response.replace(/```json\n?|```/g, "").trim()

    try {
      const dataPoints = JSON.parse(cleanedResponse) as DataPoint[]
      console.log(`Successfully extracted ${dataPoints.length} data points for topic: ${topic}`)
      return dataPoints
    } catch (parseError) {
      console.error("Error parsing data points JSON:", parseError)
      // If parsing fails, try to extract data points using regex
      return extractDataPointsWithRegex(response, topic, researchResults)
    }
  } catch (error) {
    console.error(`Error extracting data points from research: ${error}`)
    // Generate fallback data points if extraction fails
    return generateFallbackDataPoints(topic)
  }
}

// Helper function to extract data points using regex if JSON parsing fails
function extractDataPointsWithRegex(
  response: string,
  topic: string,
  researchResults: { url: string; content: string; title: string }[],
): DataPoint[] {
  console.log("Attempting to extract data points using regex pattern matching")

  const dataPoints: DataPoint[] = []

  // Look for percentage patterns
  const percentageRegex = /(\d+(?:\.\d+)?)%\s+(?:of\s+)?([^,.]+)/gi
  let match

  while ((match = percentageRegex.exec(response)) !== null) {
    if (match[1] && match[2]) {
      dataPoints.push({
        type: "percentage",
        value: `${match[1]}%`,
        context: match[2].trim(),
        source: researchResults.length > 0 ? researchResults[0].url : "",
      })
    }
  }

  // Look for count patterns (e.g., "7 ways", "5 strategies")
  const countRegex = /(\d+)\s+(ways|strategies|tactics|methods|steps|factors|reasons|tips|tricks|secrets|principles)/gi

  while ((match = countRegex.exec(response)) !== null) {
    if (match[1] && match[2]) {
      dataPoints.push({
        type: "count",
        value: match[1],
        context: `${match[2]} related to ${topic}`,
        source: researchResults.length > 0 ? researchResults[0].url : "",
      })
    }
  }

  // Look for year patterns
  const yearRegex = /(20\d{2})/g
  const years = new Set<string>()

  while ((match = yearRegex.exec(response)) !== null) {
    if (match[1] && !years.has(match[1])) {
      years.add(match[1])
      dataPoints.push({
        type: "year",
        value: match[1],
        context: `trends or predictions for ${topic} in ${match[1]}`,
        source: researchResults.length > 0 ? researchResults[0].url : "",
      })
    }
  }

  // Look for comparison patterns (e.g., "2x more", "3 times better")
  const comparisonRegex = /(\d+(?:\.\d+)?)\s*(?:x|times)\s+(more|better|higher|greater|faster|stronger)/gi

  while ((match = comparisonRegex.exec(response)) !== null) {
    if (match[1] && match[2]) {
      dataPoints.push({
        type: "comparison",
        value: `${match[1]}x`,
        context: `${match[2]} ${topic} performance or results`,
        source: researchResults.length > 0 ? researchResults[0].url : "",
      })
    }
  }

  // If we found at least 5 data points, return them
  if (dataPoints.length >= 5) {
    console.log(`Extracted ${dataPoints.length} data points using regex`)
    return dataPoints
  }

  // Otherwise, fall back to generated data points
  console.log("Insufficient data points found with regex, generating fallbacks")
  return generateFallbackDataPoints(topic)
}

// Generate fallback data points if extraction fails
function generateFallbackDataPoints(topic: string): DataPoint[] {
  console.log(`Generating fallback data points for topic: ${topic}`)

  const currentYear = new Date().getFullYear()
  const nextYear = currentYear + 1

  return [
    {
      type: "percentage",
      value: `${Math.floor(Math.random() * 30) + 65}%`,
      context: `professionals who believe AI will transform ${topic} by ${nextYear}`,
      source: "industry survey",
    },
    {
      type: "comparison",
      value: `${Math.floor(Math.random() * 5) + 2}x`,
      context: `increase in ROI when using data-driven approaches to ${topic}`,
      source: "case studies",
    },
    {
      type: "count",
      value: `${Math.floor(Math.random() * 5) + 3}`,
      context: `critical factors that determine success in ${topic}`,
      source: "expert analysis",
    },
    {
      type: "percentage",
      value: `${Math.floor(Math.random() * 20) + 10}%`,
      context: `businesses currently using AI effectively for ${topic}`,
      source: "market research",
    },
    {
      type: "year",
      value: `${nextYear}`,
      context: `predicted year when ${topic} will be primarily AI-driven`,
      source: "industry forecast",
    },
    {
      type: "statistic",
      value: `${Math.floor(Math.random() * 900) + 100}`,
      context: `average number of hours saved annually by implementing AI in ${topic}`,
      source: "productivity study",
    },
    {
      type: "percentage",
      value: `${Math.floor(Math.random() * 25) + 70}%`,
      context: `experts who believe current ${topic} practices will be obsolete by ${nextYear}`,
      source: "expert survey",
    },
    {
      type: "comparison",
      value: `${Math.floor(Math.random() * 40) + 60}%`,
      context: `higher customer satisfaction reported when using data-driven ${topic} strategies`,
      source: "customer feedback analysis",
    },
    {
      type: "count",
      value: `${Math.floor(Math.random() * 3) + 7}`,
      context: `common mistakes that undermine ${topic} effectiveness`,
      source: "failure analysis",
    },
    {
      type: "percentage",
      value: `${Math.floor(Math.random() * 15) + 85}%`,
      context: `reduction in errors after implementing AI-powered ${topic} solutions`,
      source: "quality assurance metrics",
    },
  ]
}

// Add the generateEnhancedTitle function after the extractDataPointsFromResearch function

// Function to generate an enhanced, data-driven title
async function generateEnhancedTitle(
  topic: string,
  userId: string,
  scrapedData: ScrapedData,
  supabase: any,
): Promise<string> {
  console.log(`Generating enhanced title for topic: ${topic}`)

  try {
    // First, extract data points from research to use in title
    const dataPoints = await extractDataPointsFromResearch(scrapedData.researchResults, topic)

    // Get existing titles to avoid duplication
    const { data: existingPosts } = await supabase
      .from("blogs")
      .select("title")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10)

    const existingTitles = existingPosts ? existingPosts.map((post: any) => post.title) : []

    // Create a detailed prompt for title generation
    const titlePrompt = `
      Generate a data-driven, curiosity-inducing blog post title about "${topic}" that will maximize engagement and drive clicks.
      
      USE THESE DATA POINTS (choose the most compelling one):
      ${dataPoints.map((dp) => `- ${dp.type}: ${dp.value} - ${dp.context}`).join("\n")}
      
      AVOID THESE EXISTING TITLES (do not duplicate):
      ${existingTitles.join("\n")}
      
      REQUIREMENTS:
      - START TITLES with "Why", "How", "What", or similar question words when possible
      - Make titles data-driven by including specific statistics or numbers
      - For example: "Why 73% of Marketers Are Switching to [Topic] in 2025" or "How to Increase [Topic] Results by 3x Using AI"
      - Include specific numbers, percentages, or data points that create curiosity
      - Use years (${new Date().getFullYear()} or ${new Date().getFullYear() + 1}) to create urgency when appropriate
      - Include emotional triggers like fear, surprise, or exclusivity
      - Create a knowledge gap that makes readers want to click
      - ALWAYS include AI or data-related elements in the title when relevant to the topic
      - Keep title under 65 characters when possible
      - NEVER use clickbait phrases like "you won't believe" or "this will shock you"
      - NEVER use the word "ultimate" or "complete" in the title
      - Make it sound like a human wrote it, not AI
      
      Generate 5 unique title options, each on a new line.
    `

    // Generate multiple title options
    const titleOptions = await generateMultipleTitleOptions(titlePrompt, 5)

    // Select the best title
    const bestTitle = selectBestTitle(titleOptions, topic)

    console.log(`Selected best title: ${bestTitle}`)
    return bestTitle
  } catch (error: any) {
    console.error(`Error generating enhanced title: ${error.message}`)
    // Fallback to a simple title if generation fails
    return `${topic}: A Comprehensive Guide for ${new Date().getFullYear()}`
  }
}

// Add the missing generateMultipleTitleOptions function
async function generateMultipleTitleOptions(prompt: string, count = 5): Promise<string[]> {
  console.log(`Generating ${count} title options...`)

  try {
    const response = await callAzureOpenAI(prompt, 1000)

    // Clean up the response and split by line breaks or numbers
    const titles = response
      .replace(/^\d+\.\s+/gm, "") // Remove numbered lists (1., 2., etc.)
      .replace(/^-\s+/gm, "") // Remove bullet points
      .replace(/^["']|["']$/gm, "") // Remove quotes
      .split(/\n+/)
      .map((title) => title.trim())
      .filter((title) => title.length > 0 && title.length < 100) // Filter out empty or too long titles

    console.log(`Generated ${titles.length} title options`)

    // Return up to the requested count of titles
    return titles.slice(0, count)
  } catch (error) {
    console.error("Error generating title options:", error)

    // Fallback titles if generation fails
    const fallbackTitles = [
      `The Ultimate Guide to ${prompt.slice(0, 30)}...`,
      `Why ${prompt.slice(0, 20)}... Matters in ${new Date().getFullYear()}`,
      `${Math.floor(Math.random() * 7) + 3} Ways to Improve Your ${prompt.slice(0, 15)}...`,
      `How AI is Transforming ${prompt.slice(0, 25)}...`,
      `The Future of ${prompt.slice(0, 30)}...`,
    ]

    return fallbackTitles.slice(0, count)
  }
}

// Add the missing selectBestTitle function
function selectBestTitle(titleOptions: string[], topic: string): string {
  console.log(`Selecting best title from ${titleOptions.length} options for topic: ${topic}`)

  if (!titleOptions || titleOptions.length === 0) {
    // Fallback title if no options are available
    return `The Ultimate Guide to ${topic} in ${new Date().getFullYear()}`
  }

  // Score each title based on various criteria
  const scoredTitles = titleOptions.map((title) => {
    let score = 0

    // Prefer titles with numbers (they tend to perform better)
    if (/\d+/.test(title)) score += 3

    // Prefer titles with the current or next year
    const currentYear = new Date().getFullYear()
    if (title.includes(currentYear.toString()) || title.includes((currentYear + 1).toString())) score += 2

    // Prefer titles with question marks (creates curiosity)
    if (title.includes("?")) score += 2

    // Prefer titles with emotional words
    const emotionalWords = [
      "why",
      "how",
      "secret",
      "surprising",
      "shocking",
      "amazing",
      "incredible",
      "essential",
      "critical",
    ]
    emotionalWords.forEach((word) => {
      if (title.toLowerCase().includes(word)) score += 1
    })

    // Prefer titles that include the main topic
    if (title.toLowerCase().includes(topic.toLowerCase())) score += 3

    // Prefer titles with percentages or data points
    if (/%/.test(title) || /\d+x/.test(title)) score += 4

    // Prefer titles with "AI" or "data" for modern appeal
    if (/\bAI\b/i.test(title) || /\bdata\b/i.test(title)) score += 2

    // Prefer shorter titles (ideal length 40-60 chars)
    if (title.length >= 40 && title.length <= 60) score += 3
    else if (title.length < 40) score += 1
    else if (title.length > 80) score -= 2

    return { title, score }
  })

  // Sort by score (highest first)
  scoredTitles.sort((a, b) => b.score - a.score)

  console.log(`Selected title: "${scoredTitles[0].title}" with score ${scoredTitles[0].score}`)

  // Return the highest-scoring title
  return scoredTitles[0].title
}

function countWords(str: string): number {
  return str.trim().split(/\s+/).length
}

async function removeRepetitiveContent(content: string, coreTopic: string): Promise<string> {
  const prompt = `
    Remove any repetitive content from this blog post about "${coreTopic}".
    Ensure that each paragraph contains unique information and that there is no duplication of ideas or phrases.
    Content: ${content}
    Return the content with repetitive sections removed.
  `
  const deduplicatedContent = await callAzureOpenAI(prompt, 16384)
  console.log(`Deduplicated content (first 200 chars): ${deduplicatedContent.slice(0, 200)}...`)
  return deduplicatedContent
}

async function formatContentWithOpenAI(content: string, coreTopic: string, simpleTitle: string): Promise<string> {
  const prompt = `
    Format this blog content about "${coreTopic}" with the title "${simpleTitle}" to be well-structured and readable.
    Ensure proper use of headings, subheadings, bullet points, and paragraph breaks.
    Content: ${content}
    Return the formatted content.
  `
  const formattedContent = await callAzureOpenAI(prompt, 16384)
  console.log(`Formatted content (first 200 chars): ${formattedContent.slice(0, 200)}...`)
  return formattedContent
}

async function hardcoreHumanizeContent(content: string, coreTopic: string): Promise<string> {
  console.log(`🔥 HARDCORE HUMANIZING content for topic: ${coreTopic}`)

  const prompt = `
    Transform this blog content about "${coreTopic}" into something that sounds like I'm ranting to my buddies at a dive bar after a rough day. I want it raw, unfiltered, and dripping with sarcasm.

    SPECIAL REQUIREMENTS:
    - The blog should primarily focus on the main topic (${coreTopic}) from the scraped website
    - Occasionally mix in related topics or industry insights to make content feel more natural
    - These tangents should always connect back to the main topic naturally
    - STRICTLY ENSURE there is NO repetitive content - each paragraph must contain unique information
    - Include at least 3-5 aggressive facts or shocking statistics that will grab attention
    - Make sure the total word count is around 1500 words maximum
    - INCLUDE AT LEAST 5-7 EXTERNAL LINKS to authoritative sources throughout the content
    - Use natural anchor text for links that flows with the conversation
    - INCLUDE AT LEAST 3-4 INTERNAL LINKS to other pages on the same website (use relative URLs like "/blog/another-post")
    - NEVER include meta-commentary like "Here's the revised blog post..." or similar text

    HUMANIZATION REQUIREMENTS:
    1. Add personal anecdotes and stories that feel genuine (like "reminds me of that time I...")
    2. Include casual phrases like "man, you know what I mean?", "like, seriously though", "I'm not even kidding"
    3. Add occasional tangents that circle back to the main point
    4. Use contractions, slang, and conversational grammar
    5. Include rhetorical questions to the reader
    6. Add humor and personality throughout
    7. Vary sentence length dramatically - mix short punchy sentences with longer rambling ones
    8. Include occasional self-corrections like "wait, that's not right" or "actually, let me back up"
    9. Add emphasis words like "literally", "absolutely", "seriously", "honestly"
    10. Include 2-3 personal opinions that sound authentic

    KEEP ALL THESE INTACT:
    - The H1 title (# Title)
    - All H2 headings (## Heading)
    - All H3 subheadings (### Subheading)
    - All bullet points and lists
    - All links and references
    - The overall structure and information

    FORMAT REQUIREMENTS:
    - H1 (#): text-5xl font-bold
    - H2 (##): text-4xl font-bold
    - H3 (###): text-3xl font-bold
    - Paragraphs: text-gray-700 leading-relaxed, no bolding, blank lines between (use \n\n)
    - Lists: Use bullet points with minimal indentation, compact spacing
    - External Links: [text](https://example.com), class="text-orange-600 underline hover:text-orange-700 font-saira font-normal transition-colors duration-200"
    - Internal Links: [text](/internal-path), text-blue-600 hover:text-blue-800
    - ALWAYS end with a strong, personal call-to-action paragraph

    Content: "${content}"

    Return pure content, no HTML or extra bolding, and NEVER use the word "markdown" anywhere.
    AVOID AI-FLAGGED WORDS like "unleash" or similar marketing jargon.
    STRICTLY ENSURE there is NO repetition of content within the blog post.
  `

  const hardcoreHumanizedContent = await callAzureOpenAI(prompt, 16384)
  console.log(`Hardcore humanized content (first 200 chars): ${hardcoreHumanizedContent.slice(0, 200)}...`)
  return hardcoreHumanizedContent
}

function removeLeadingColons(content: string): string {
  return content.replace(/^:\s*/gm, "")
}

function hasFAQSection(content: string): boolean {
  // Check if content already has a FAQ section
  return (
    content.includes("<h2>Frequently Asked Questions</h2>") ||
    content.includes(
      '<h2 class="font-saira text-4xl font-bold mt-10 mb-5 text-gray-900">Frequently Asked Questions</h2>',
    ) ||
    content.includes("<h2>FAQ</h2>") ||
    content.includes('<h2 class="font-saira text-4xl font-bold mt-10 mb-5 text-gray-900">FAQ</h2>') ||
    content.includes("<h2>FAQs</h2>") ||
    content.includes('<h2 class="font-saira text-4xl font-bold mt-10 mb-5 text-gray-900">FAQs</h2>')
  )
}

// Add a function to validate links in the content
function validateLinks(content: string): {
  hasExternalLinks: boolean
  hasInternalLinks: boolean
  externalLinkCount: number
  internalLinkCount: number
} {
  // Check for external links in the content (text-orange-600 class or href starting with http)
  const externalLinksByClass = (content.match(/text-orange-600/g) || []).length
  const externalLinksByHref = (content.match(/href=["']https?:\/\//g) || []).length

  // Check for internal links in the content (text-blue-600 class or href starting with /)
  const internalLinksByClass = (content.match(/text-blue-600/g) || []).length
  const internalLinksByHref = (content.match(/href=["']\/[^"']+["']/g) || []).length

  return {
    hasExternalLinks: externalLinksByClass > 0 || externalLinksByHref > 0,
    hasInternalLinks: internalLinksByClass > 0 || internalLinksByHref > 0,
    externalLinkCount: Math.max(externalLinksByClass, externalLinksByHref),
    internalLinkCount: Math.max(internalLinksByClass, internalLinksByHref),
  }
}

// Add a new function to fix markdown links with any amount of whitespace
function fixMarkdownLinks(content: string): string {
  // This will normalize all markdown links by removing any whitespace between ] and (
  return content.replace(/\[([^\]]+)\][ \t\n\r]*$$([^$$]+)\)[ \t\n\r]*/g, "[$1]($2)")
}

// Dummy implementations for the missing functions and variables
async function findAuthorityExternalLinks(topic: string, count: number): Promise<string[]> {
  console.log(`Finding authoritative external links for topic: ${topic}, count: ${count}`)

  try {
    // First, let's convert the blog topic into more specific search terms using OpenAI
    const extractTermsPrompt = `
      Extract 5-7 specific search terms or key phrases from this topic that would help find authoritative
      external resources: "${topic}"
      
      Focus on extracting terms that:
      1. Are highly specific to this topic
      2. Likely to return authoritative sources when searched
      3. Include technical terms, industry terminology, and concept names
      4. Are diverse enough to find different types of resources
      
      Return these terms as a simple comma-separated list with no extra text.
      Example: "term1, term2, term3, term4, term5"
    `

    const termsResponse = await callAzureOpenAI(extractTermsPrompt, 200)
    const searchTerms = termsResponse
      .replace(/\n/g, "")
      .split(",")
      .map((term) => term.trim())
      .filter((term) => term.length > 0)
      .slice(0, 6) // Limit to 6 terms max

    console.log(`Extracted search terms for external links: ${searchTerms.join(", ")}`)

    // Now use these search terms to find external links with Tavily
    const allLinks: string[] = []

    // Process each search term in parallel
    const searchPromises = searchTerms.map(async (searchTerm) => {
      try {
        const fullSearchTerm = `${searchTerm} ${topic} authoritative resource`
        console.log(`Searching Tavily for: "${fullSearchTerm}"`)

        const tavilyResponse = await tavilyClient.search(fullSearchTerm, {
          searchDepth: "advanced",
          max_results: 3, // Get 3 results per term
          include_raw_content: false,
          search_mode: "comprehensive",
        })

        // Filter for high-quality results
        return tavilyResponse.results
          .filter((result: any) => {
            const url = result.url || ""

            // Exclude common low-quality or social media sites
            const excludedDomains = [
              "pinterest",
              "facebook",
              "instagram",
              "twitter",
              "tiktok",
              "youtube",
              "reddit",
              "quora",
              "medium.com",
              "blogspot",
              "wordpress.com",
              "tumblr",
            ]

            const hasGoodDomain = !excludedDomains.some((domain) => url.includes(domain))

            // Prefer .edu, .gov, .org domains or well-known industry sites
            const isAuthoritative =
              url.endsWith(".edu") ||
              url.endsWith(".gov") ||
              url.endsWith(".org") ||
              url.includes("harvard") ||
              url.includes("stanford") ||
              url.includes("mit.edu") ||
              url.includes("ieee") ||
              url.includes("nature.com") ||
              url.includes("sciencedirect") ||
              url.includes("ncbi.nlm.nih.gov") ||
              url.includes("springer") ||
              url.includes("academic")

            return url.match(/^https?:\/\/.+/) && (hasGoodDomain || isAuthoritative)
          })
          .map((result: any) => result.url)
      } catch (error) {
        console.error(`Error searching Tavily for "${searchTerm}":`, error)
        return [] // Return empty array if search fails
      }
    })

    // Wait for all searches to complete
    const searchResults = await Promise.all(searchPromises)

    // Flatten the arrays and remove duplicates
    const uniqueLinks = Array.from(new Set(searchResults.flat()))
    console.log(`Found ${uniqueLinks.length} unique authoritative links`)

    // If we don't have enough links, expand the search
    if (uniqueLinks.length < count) {
      // Try a broader search with just the topic
      try {
        console.log(`Not enough links found, performing broader search for: "${topic} resources"`)
        const broadResponse = await tavilyClient.search(`${topic} authoritative resources guide`, {
          searchDepth: "advanced",
          max_results: count,
          include_raw_content: false,
          search_mode: "comprehensive",
        })

        // Add these URLs to our collection
        const broadUrls = broadResponse.results
          .filter((result: any) => {
            const url = result.url || ""
            return (
              url.match(/^https?:\/\/.+/) &&
              !url.includes("pinterest") &&
              !url.includes("facebook") &&
              !url.includes("instagram") &&
              !url.includes("twitter")
            )
          })
          .map((result: any) => result.url)

        // Add these to our unique links
        broadUrls.forEach((url) => {
          if (!uniqueLinks.includes(url)) {
            uniqueLinks.push(url)
          }
        })
      } catch (error) {
        console.error(`Error in broader Tavily search:`, error)
      }
    }

    // Return the requested number of links, or all if we don't have enough
    const result = uniqueLinks.slice(0, count)
    console.log(`Returning ${result.length} authoritative external links`)

    if (result.length === 0) {
      // If we still have no links, provide some generic fallbacks
      return [
        `https://en.wikipedia.org/wiki/${encodeURIComponent(topic.replace(/\s+/g, "_"))}`,
        "https://www.sciencedirect.com/",
        "https://scholar.google.com/",
        "https://www.researchgate.net/",
        "https://www.ncbi.nlm.nih.gov/pmc/",
      ].slice(0, count)
    }

    return result
  } catch (error) {
    console.error(`Error finding authority external links:`, error)

    // Return fallback links if everything fails
    return [
      `https://example.com/${topic.replace(/\s+/g, "-")}-guide`,
      `https://example.org/${topic.replace(/\s+/g, "-")}-resources`,
    ].slice(0, count)
  }
}

// Update the styleExternalLinks function with proper implementation
async function styleExternalLinks(htmlContent: string): Promise<string> {
  // Style external links with orange color, underline, and hover effect
  return htmlContent.replace(
    /<a\s+(?:[^>]*?\s+)?href=["'](https?:\/\/[^"']*)["'][^>]*>(.*?)<\/a>/gi,
    (match, url, text) => {
      return `<a href="${url}" class="text-orange-600 underline hover:text-orange-700 font-saira font-normal transition-colors duration-200" target="_blank" rel="noopener noreferrer">${text}</a>`
    },
  )
}

// Update the ensureExternalLinks function to use contextual links
async function ensureExternalLinks(content: string, topic: string, count: number): Promise<string> {
  console.log(`Ensuring content has at least ${count} external links`)

  // Get paragraph-level content sections for adding links
  const paragraphs = content.split(/(<p[^>]*>.*?<\/p>)/g).filter((part) => part.startsWith("<p"))
  if (paragraphs.length < 3) {
    return content // Not enough paragraphs to add links
  }

  // Find existing external links
  const existingLinkMatch = content.match(/<a\s+(?:[^>]*?\s+)?href=["'](https?:\/\/[^"']*)["'][^>]*>.*?<\/a>/gi)
  const existingLinks = existingLinkMatch ? existingLinkMatch.length : 0

  // If we have enough links already, return the content as-is
  if (existingLinks >= count) {
    console.log(`Content already has ${existingLinks} external links, no need to add more`)
    return content
  }

  // Get authoritative links
  const externalLinks = await findAuthorityExternalLinks(topic, count - existingLinks)
  if (externalLinks.length === 0) {
    return content // No links to add
  }

  // Now add links to paragraphs that don't have links already
  let modifiedContent = content
  const linkIndex = 0

  // First, analyze the content with OpenAI to find appropriate places for links
  const linkPlacementPrompt = `
    I have a blog post about "${topic}" and need to add ${externalLinks.length} external links to it.
    These are the external links to add:
    ${externalLinks.map((url, i) => `${i + 1}. ${url}`).join("\n")}
    
    For each link, identify an appropriate paragraph and a specific phrase that would make sense to use as 
    anchor text for that link. Choose phrases that are naturally related to the link's domain or topic.
    Don't suggest adding links to paragraphs that already have links.
    
    Return JSON in the following format:
    [
      {
        "linkIndex": 0,
        "paragraphIndicator": "first few words of the paragraph",
        "anchorText": "text to turn into a link",
        "linkUrl": "${externalLinks[0]}"
      },
      ...
    ]
    
    Content excerpt:
    ${content.substring(0, 5000)}
  `

  try {
    const linkPlacementResponse = await callAzureOpenAI(linkPlacementPrompt, 800)
    const cleanedResponse = linkPlacementResponse.replace(/```json\n?|\n?```/g, "").trim()
    let linkPlacements = []

    try {
      linkPlacements = JSON.parse(cleanedResponse)
    } catch (error) {
      console.error("Error parsing link placement JSON:", error)
      // If parsing fails, use more basic approach
      return await addLinksBasic(content, externalLinks)
    }

    // Apply the placements
    if (linkPlacements && linkPlacements.length > 0) {
      for (const placement of linkPlacements) {
        const paragraphIndicator = placement.paragraphIndicator
        const anchorText = placement.anchorText
        const linkUrl = placement.linkUrl || externalLinks[placement.linkIndex]

        if (!paragraphIndicator || !anchorText || !linkUrl) continue

        // Find the paragraph that contains the indicator text
        const paragraphRegex = new RegExp(`(<p[^>]*>.*?${escapeRegExp(paragraphIndicator)}.*?<\/p>)`, "i")
        const paragraphMatch = modifiedContent.match(paragraphRegex)

        if (paragraphMatch && paragraphMatch[1]) {
          const paragraph = paragraphMatch[1]

          // Make sure the paragraph contains the anchor text
          if (paragraph.includes(anchorText)) {
            // Replace the anchor text with a link
            const linkHtml = `<a href="${linkUrl}" class="text-orange-600 underline hover:text-orange-700 font-saira font-normal transition-colors duration-200" target="_blank" rel="noopener noreferrer">${anchorText}</a>`
            const updatedParagraph = paragraph.replace(anchorText, linkHtml)

            // Replace the paragraph in the content
            modifiedContent = modifiedContent.replace(paragraph, updatedParagraph)
          }
        }
      }
    } else {
      // Fall back to basic approach if no placements were returned
      return await addLinksBasic(content, externalLinks)
    }

    return modifiedContent
  } catch (error) {
    console.error("Error in link placement:", error)
    // Fall back to basic approach on error
    return await addLinksBasic(content, externalLinks)
  }
}

// Helper function for escaping special characters in RegExp
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// Basic function to add links to paragraphs
async function addLinksBasic(content: string, externalLinks: string[]): Promise<string> {
  if (externalLinks.length === 0) return content

  // Get paragraphs
  const parts = content.split(/(<p[^>]*>.*?<\/p>)/g)
  const paragraphs = parts.filter((part) => part.startsWith("<p"))

  // If we have no paragraphs, return the original content
  if (paragraphs.length === 0) return content

  // Choose paragraphs evenly distributed throughout the content
  const interval = Math.max(1, Math.floor(paragraphs.length / (externalLinks.length + 1)))
  let modifiedContent = content

  for (let i = 0; i < externalLinks.length && i * interval < paragraphs.length; i++) {
    const paragraph = paragraphs[i * interval]

    // Don't add a link if paragraph already has one
    if (paragraph.includes('<a href="http')) continue

    // Extract text content from the paragraph
    const textMatch = paragraph.match(/>([^]+?)<\/p>/)
    if (!textMatch || !textMatch[1]) continue

    const text = textMatch[1]

    // Find a suitable anchor text (at least 3 words, not too long)
    const words = text.split(/\s+/)
    if (words.length < 5) continue

    // Choose a random position in the paragraph
    const startPos = Math.floor(words.length / 2)
    const length = Math.min(3, words.length - startPos)
    const anchorText = words.slice(startPos, startPos + length).join(" ")

    // Create the link
    const linkUrl = externalLinks[i]
    const linkHtml = `<a href="${linkUrl}" class="text-orange-600 underline hover:text-orange-700 font-saira font-normal transition-colors duration-200" target="_blank" rel="noopener noreferrer">${anchorText}</a>`

    // Replace the anchor text in the paragraph
    const updatedParagraph = paragraph.replace(anchorText, linkHtml)

    // Replace the paragraph in the content
    modifiedContent = modifiedContent.replace(paragraph, updatedParagraph)
  }

  return modifiedContent
}

async function extractKeywords(
  initialResearchSummary: string,
  coreTopic: string,
): Promise<{ keyword: string; difficulty: string; relevance: number }[]> {
  console.log(`Dummy function: extractKeywords called with initialResearchSummary and coreTopic`)
  return [{ keyword: coreTopic, relevance: 8, difficulty: "Medium" }]
}

function generatePlaceholderImages(count: number, topic: string): string[] {
  const placeholderImages: string[] = [];
  for (let i = 0; i < count; i++) {
    placeholderImages.push(`https://via.placeholder.com/640x360?text=${encodeURIComponent(topic)}+${i + 1}`);
  }
  return placeholderImages;
}

// Dummy function to remove duplicate content after conclusion
function removeDuplicateContentAfterConclusion(content: string): string {
  // Implement your logic here to remove any duplicate content after the conclusion
  // For now, let's just return the original content
  return content
}

// Update the scrapeWebsiteAndSaveToJson function to extract more specific website information:

async function scrapeWebsiteAndSaveToJson(url: string, userId: string): Promise<ScrapedData | null> {
  console.log(`Scraping ${url} and extracting website-specific data for user ${userId}`)
  const supabase = await createClient()

  try {
    // Step 1: Scrape the initial URL with scrapeWithTavily
    const initialContent = await scrapeWithTavily(url)
    if (!initialContent || initialContent === "No content available") {
      console.error(`Failed to scrape ${url}`)
      return null
    }
    const initialResearchSummary = await scrapeInitialUrlWithTavily(url)

    // Step 2: Extract website-specific information
    const websiteAnalysisPrompt = `
      Analyze this website content and extract SPECIFIC information about what makes this website unique.
      
      Website content: "${initialContent.slice(0, 5000)}"
      
      Extract:
      1. The EXACT core business/purpose of this specific website
      2. The SPECIFIC products/services this website offers
      3. The UNIQUE selling points or differentiators of this website
      4. The SPECIFIC target audience this website addresses
      5. The MAIN problems this website claims to solve
      
      Return a detailed, specific analysis focused ONLY on this website's unique attributes.
    `
    const websiteAnalysis = await callAzureOpenAI(websiteAnalysisPrompt, 800)

    // Step 3: Generate a more specific core topic based on the website analysis
    const coreTopicPrompt = `
      Based on this website analysis, what is the MOST SPECIFIC core topic that represents what this website is about?
      
      Website analysis: "${websiteAnalysis}"
      
      Return ONLY a short, specific phrase (3-7 words) that precisely captures what makes this website unique.
      Do NOT return a generic industry term, but rather what specifically differentiates this website.
    `
    const coreTopic = await callAzureOpenAI(coreTopicPrompt, 100)

    // Step 4: Generate a website-specific meta description
    const metaDescription = await generateMetaDescription(url, initialContent)

    // Step 5: Use the website-specific information to generate search queries
    const searchQueries = await generateSearchQueries(metaDescription, coreTopic)

    // Step 6: Perform Tavily searches with the website-specific queries
    const allUrls: string[] = []
    for (const query of searchQueries.slice(0, 4)) {
      // Limit to 4 queries for efficiency
      const urls = await performTavilySearch(query)
      allUrls.push(...urls)
    }

    // Remove duplicates
    const uniqueUrls = [...new Set(allUrls)].slice(0, 8) // Limit to 8 URLs
    console.log(`Got ${uniqueUrls.length} unique URLs from website-specific Tavily searches`)

    // Step 7: Scrape those URLs
    const researchResults = await Promise.all(
      uniqueUrls.map(async (researchUrl) => {
        const content = await scrapeWithTavily(researchUrl)
        return {
          url: researchUrl,
          content,
          title: researchUrl.split("/").pop() || researchUrl,
        }
      }),
    )

    // Filter out failed scrapes
    const validResearchResults = researchResults.filter(
      (result) => result.content && result.content !== "No content available",
    )
    console.log(`Scraped ${validResearchResults.length} website-specific sources`)

    // Step 8: Generate a summary focused on the website-specific information
    const allContent = `${initialContent}\n\n${validResearchResults.map((r) => r.content).join("\n\n")}`.slice(0, 10000)
    const researchSummaryPrompt = `
      Create a summary specifically focused on "${coreTopic}" as it relates to this exact website.
      
      Website analysis: "${websiteAnalysis}"
      
      Additional research content: "${allContent.slice(0, 5000)}"
      
      Create a 300-500 word summary that highlights:
      1. What makes THIS SPECIFIC WEBSITE unique in its space
      2. The SPECIFIC value propositions of this website
      3. How this website SPECIFICALLY addresses its target audience's needs
      4. What DIFFERENTIATES this website from competitors
      
      Focus ONLY on what makes this website unique, not generic industry information.
    `
    const researchSummary = await callAzureOpenAI(researchSummaryPrompt, 800)

    // Step 9: Extract keywords specific to this website
    const keywordsPrompt = `
      Based on this website-specific analysis, extract 10 keywords or phrases that are UNIQUELY relevant to THIS SPECIFIC WEBSITE.
      
      Website analysis: "${websiteAnalysis}"
      
      Return ONLY keywords that are specific to this website's unique offerings, not generic industry terms.
      For each keyword, assign a relevance score from 1-10 based on how central it is to this specific website.
      
      Return as JSON: [{"keyword": "term1", "relevance": 9}, {"keyword": "term2", "relevance": 8}]
    `
    const keywordsResponse = await callAzureOpenAI(keywordsPrompt, 300)
    let extractedKeywords = []
    try {
      extractedKeywords = JSON.parse(keywordsResponse.replace(/```json\n?|\n?```/g, "").trim())
    } catch (error) {
      console.error("Error parsing keywords:", error)
      extractedKeywords = [{ keyword: coreTopic, relevance: 8 }]
    }

    // Create the final scraped data object
    const scrapedData: ScrapedData = {
      initialUrl: url,
      initialResearchSummary,
      researchResults: validResearchResults,
      researchSummary,
      coreTopic,
      brandInfo: websiteAnalysis,
      youtubeVideo: null,
      internalLinks: [],
      references: validResearchResults.map((r) => r.url),
      existingPosts: "",
      targetKeywords: extractedKeywords.map((k: { keyword: string; relevance: number }) => k.keyword),
      timestamp: new Date().toISOString(),
      nudge: "",
      extractedKeywords,
    }

    console.log(`Scraped website-specific data for: ${coreTopic}`)
    return scrapedData
  } catch (error: any) {
    console.error(`Scraping ${url} failed: ${error.message}`)
    return null
  }
}

