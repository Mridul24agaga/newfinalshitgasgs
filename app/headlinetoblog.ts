"use server"

import { tavily } from "@tavily/core"
import { v4 as uuidv4 } from "uuid"
import OpenAI from "openai"
import { createClient } from "@/utitls/supabase/server"

// Aggressive link fixer
function aggressivelyFixMarkdownLinks(content: string): string {
  let processedContent = content
  const markdownLinkRegex = /\[([^\]]+)\]\s*\(([^)]+)\)/g
  processedContent = processedContent.replace(markdownLinkRegex, (match, text, url) => {
    const textStr = text ? String(text) : ""
    const urlStr = url ? String(url) : ""
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
    let html = aggressivelyFixMarkdownLinks(markdown)
    html = html.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n")
    html = html
      .replace(/^###### (.*$)/gim, '<h6 class="font-saira text-lg font-bold mt-6 mb-3 text-gray-800">$1</h6>')
      .replace(/^##### (.*$)/gim, '<h5 class="font-saira text-xl font-bold mt-6 mb-3 text-gray-800">$1</h5>')
      .replace(/^#### (.*$)/gim, '<h4 class="font-saira text-2xl font-bold mt-7 mb-4 text-gray-800">$1</h4>')
      .replace(/^### (.*$)/gim, '<h3 class="font-saira text-3xl font-bold mt-8 mb-4 text-gray-800">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="font-saira text-4xl font-bold mt-10 mb-5 text-gray-900">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="font-saira text-5xl font-bold mt-8 mb-6 text-gray-900 border-b pb-2">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic font-normal">$1</em>')
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
      .replace(/\n{2,}/g, '</p><p class="font-saira text-gray-700 leading-relaxed font-normal my-4">')
    html = `<p class="font-saira text-gray-700 leading-relaxed font-normal my-4">${html}</p>`
    html = html.replace(
      /<\/p>\s*<p class="font-saira text-gray-700 leading-relaxed font-normal my-4">\s*<\/p>/g,
      "</p>",
    )
    html = html.replace(/<p class="font-saira text-gray-700 leading-relaxed font-normal my-4">\s*<\/p>/g, "")
    return html
  },

  sanitizeHtml: (html: string) => {
    let sanitized = aggressivelyFixMarkdownLinks(html)
    sanitized = sanitized
      .replace(/<p[^>]*>/g, '<p class="font-saira text-gray-700 leading-relaxed font-normal my-4">')
      .replace(/<ul[^>]*>/g, '<ul class="pl-4 my-4">')
      .replace(/<li[^>]*>([^<]*)<\/li>/g, '<li class="ml-4 text-gray-700 leading-relaxed font-normal">$1</li>')
      .replace(
        /<li[^>]*><strong[^>]*>([^<]+)<\/strong>:\s*([^<]*)<\/li>/g,
        '<li class="ml-4 text-gray-700 leading-relaxed font-normal"><strong class="font-bold">$1</strong>: $2</li>',
      )
      .replace(
        /<li[^>]*><strong[^>]*>([^<:]+)<\/strong><\/li>/g,
        '<li class="ml-4 text-gray-700 leading-relaxed font-normal"><strong class="font-bold">$1</strong></li>',
      )
      .replace(/<h1[^>]*>/g, '<h1 class="font-saira text-5xl font-bold mt-8 mb-6 text-gray-900 border-b pb-2">')
      .replace(/<h2[^>]*>/g, '<h2 class="font-saira text-4xl font-bold mt-10 mb-5 text-gray-900">')
      .replace(/<h3[^>]*>/g, '<h3 class="font-saira text-3xl font-bold mt-8 mb-4 text-gray-800">')
      .replace(/<h4[^>]*>/g, '<h4 class="font-saira text-2xl font-bold mt-7 mb-4 text-gray-800">')
      .replace(/<h5[^>]*>/g, '<h5 class="font-saira text-xl font-bold mt-6 mb-3 text-gray-800">')
      .replace(/<h6[^>]*>/g, '<h6 class="font-saira text-lg font-bold mt-6 mb-3 text-gray-800">')
      .replace(
        /<blockquote[^>]*>/g,
        '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4 font-saira">',
      )
      .replace(
        /<a[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>/g,
        '<a href="$1" class="text-orange-600 underline hover:text-orange-700 font-saira font-normal transition-colors duration-200" target="_blank" rel="noopener noreferrer">',
      )
      .replace(
        /<a[^>]*href=["'](\/[^"']+)["'][^>]*>/g,
        '<a href="$1" class="text-blue-600 hover:text-blue-800 font-normal transition-colors duration-200">',
      )
      .replace(/<figure[^>]*>/g, '<figure class="my-6">')
      .replace(/<figcaption[^>]*>/g, '<figcaption class="text-sm text-center text-gray-500 mt-2 font-saira">')
    sanitized = sanitized.replace(/<p[^>]*>\s*<\/p>/g, "")
    return sanitized
  },

  generateToc: (htmlContent: string) => {
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi
    const headings: Array<{ id: string; text: string; level: number }> = []
    let match: RegExpExecArray | null
    let index = 0
    while ((match = headingRegex.exec(htmlContent)) !== null) {
      const level = Number.parseInt(match[1])
      const text = match[2].replace(/<[^>]+>/g, "").trim()
      const id = `heading-${index}`
      const classMatch = match[0].match(/class="([^"]*)"/)
      const headingWithId = `<h${level} id="${id}" class="${classMatch ? classMatch[1] : ""}">${match[2]}</h${level}>`
      htmlContent = htmlContent.replace(match[0], headingWithId)
      headings.push({ id, text, level })
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
  difficulty?: string
}

interface BlogResult {
  blogPost: string
  seoScore: number
  headings: string[]
  keywords: { keyword: string; difficulty: string }[]
  citations: string[]
  tempFileName: string
  title: string
  difficulty?: string
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
  url: string | null // Updated to allow null since website is optional
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
    console.log(`Calling OpenAI: ${prompt.slice(0, 100)}${prompt.length > 100 ? "..." : ""}`)
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      max_tokens: maxTokens,
      temperature: 0.9,
      n: 1,
    })
    const result = completion.choices[0]?.message?.content || ""
    console.log(`OpenAI response: ${result.slice(0, 100)}${result.length > 100 ? "..." : ""}`)
    return result
  } catch (error: any) {
    console.error("Error calling Azure OpenAI:", error.message)
    return `Fallback: Couldn't generate this part due to ${error.message}. Let's roll with what we've got!`
  }
}

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
      const cleanText = data.rawContent
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

async function scrapeInitialUrlWithTavily(url: string): Promise<string> {
  console.log(`\nGenerating detailed initial summary for URL with OpenAI: ${url}`)
  try {
    const tavilyResponse = await tavilyClient.search(url, {
      searchDepth: "advanced",
      max_results: 1,
      include_raw_content: true,
    })
    const data = tavilyResponse.results[0] as TavilySearchResult
    if (data?.rawContent && data.rawContent.length > 500) {
      console.log(`Successfully scraped content from ${url} with Tavily`)
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

async function generateSearchQueries(metaDescription: string, topic: string): Promise<string[]> {
  const prompt = `
    I need to generate search queries for researching content about "${topic}".
    Website description: "${metaDescription}"
    Based on this specific content and purpose:
    1. What are the MAIN TOPICS this focuses on?
    2. What UNIQUE SERVICES or PRODUCTS are offered?
    3. What SPECIFIC INDUSTRY PROBLEMS are addressed?
    4. What UNIQUE SELLING POINTS or DIFFERENTIATORS are present?
    5. What SPECIFIC AUDIENCE or CUSTOMER SEGMENTS are targeted?
    Generate 8 highly specific search queries that will find information directly relevant to this content.
    Each query should target a different aspect of what makes this unique.
    Return a JSON array of search queries, e.g., ["query1", "query2"].
  `
  const response = await callAzureOpenAI(prompt, 300)
  const cleanedResponse = response.replace(/```json\n?|\n?```/g, "").trim()
  try {
    const queries = (JSON.parse(cleanedResponse) as string[]) || []
    console.log(`Generated search queries: ${JSON.stringify(queries)}`)
    return queries
  } catch (error) {
    console.error("Error parsing queries:", error)
    return [
      `${topic} specific analysis`,
      `${topic} unique features`,
      `${topic} competitive advantages`,
      `${topic} target audience needs`,
      `${topic} specific solutions`,
      `${topic} specialized services`,
      `${topic} differentiation`,
      `${topic} customer pain points`,
    ]
  }
}

async function performTavilySearch(query: string): Promise<string[]> {
  console.log(`\nPerforming targeted Tavily search: ${query}`)
  try {
    const response = await tavilyClient.search(query, {
      searchDepth: "advanced",
      max_results: 20,
      include_raw_content: true,
      search_mode: "comprehensive",
    })
    const urls = response.results
      .filter((result: any) => {
        const url = result.url || ""
        const hasGoodDomain =
          !url.includes("pinterest") &&
          !url.includes("instagram") &&
          !url.includes("facebook") &&
          !url.includes("twitter") &&
          !url.includes("tiktok")
        const hasContent = result.rawContent && result.rawContent.length > 500
        const isRelevant =
          result.rawContent &&
          result.rawContent.toLowerCase().includes(query.toLowerCase().split(" ").slice(0, 3).join(" "))
        return url.match(/^https?:\/\/.+/) && hasGoodDomain && hasContent && isRelevant
      })
      .map((result: any) => result.url)
    console.log(`Tavily found ${urls.length} high-quality URLs for query "${query}"`)
    return urls
  } catch (error) {
    console.error(`Tavily search error for query "${query}":`, error)
    return []
  }
}

async function findYouTubeVideo(topic: string, content: string): Promise<string | null> {
  console.log(`Finding YouTube video for topic: ${topic}`)
  try {
    const tavilyQuery = `best youtube video about ${topic} ${content.slice(0, 200)}`
    console.log(`Searching Tavily with query: ${tavilyQuery.slice(0, 100)}...`)
    const tavilyResponse = await tavilyClient.search(tavilyQuery, {
      searchDepth: "advanced",
      max_results: 5,
      include_raw_content: false,
      search_mode: "comprehensive",
    })
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

async function generateContentTables(topic: string, content: string): Promise<string[]> {
  console.log(`Generating unique content tables for topic: ${topic}`)
  try {
    const extractConceptsPrompt = `
      Extract 5-7 key concepts, terms, or themes that are specific to this content about "${topic}".
      Content excerpt: "${content.slice(0, 3000)}..."
      Return just a comma-separated list of these key concepts or themes.
    `
    const keyConceptsResponse = await callAzureOpenAI(extractConceptsPrompt, 300)
    const keyConcepts = keyConceptsResponse.split(",").map((c) => c.trim())
    const contentHash = content
      .slice(0, 100)
      .split("")
      .reduce((a, b) => a + b.charCodeAt(0), 0)
    const randomSeed = contentHash % 5
    const tableTypes = ["comparison", "statistics", "timeline", "pros_cons", "features"]
    const firstTableType = tableTypes[randomSeed]
    const secondTableType = tableTypes[(randomSeed + 2) % 5]
    const firstTablePrompt = `
      Create a unique "${firstTableType}" table specifically for this blog about "${topic}".
      Focus on these specific concepts: ${keyConcepts.slice(0, 3).join(", ")}
      Extract actual data points directly from the content: "${content.slice(0, 3000)}..."
      Return ONLY the HTML table with proper styling:
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
              <td class="border border-gray-200 px-4 py-2">Data 1</td>
              <td class="border border-gray-200 px-4 py-2">Value 1</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
    const secondTablePrompt = `
      Create a unique "${secondTableType}" table specifically for this blog about "${topic}".
      Focus on these specific concepts: ${keyConcepts.slice(3, 6).join(", ")}
      Extract actual data points directly from the content: "${content.slice(3000, 6000)}..."
      Return ONLY the HTML table with proper styling:
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
          </tbody>
        </table>
      </div>
    `
    const [firstTable, secondTable] = await Promise.all([
      callAzureOpenAI(firstTablePrompt, 1000),
      callAzureOpenAI(secondTablePrompt, 1000),
    ])
    const cleanFirstTable = cleanTableHTML(firstTable)
    const cleanSecondTable = cleanTableHTML(secondTable)
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

function cleanTableHTML(tableHTML: string): string {
  let cleanHTML = tableHTML.replace(/```html\s*|\s*```/g, "")
  cleanHTML = cleanHTML.replace(/<!--[\s\S]*?-->/g, "")
  cleanHTML = cleanHTML.replace(/\s{2,}/g, " ")
  cleanHTML = cleanHTML.replace(/<\/td\s*<td/g, "</td><td")
  cleanHTML = cleanHTML.replace(/<\/tr\s*<tr/g, "</tr><tr")
  return cleanHTML
}

function createYouTubeEmbed(youtubeUrl: string): string {
  try {
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

async function deepHumanizeContent(content: string, coreTopic: string): Promise<string> {
  console.log(`🔥🔥 DEEP HUMANIZING content for topic: ${coreTopic}`)
  const introPrompt = `
    Create a unique, conversational intro hook about "${coreTopic}" that sounds like a real person talking.
    Make it casual, edgy, authentic, and slightly provocative - like someone who's passionate and opinionated about this topic.
    Include slang, personal anecdotes, and natural speech patterns with some verbal tics.
    Keep it under 200 characters and don't use any AI-sounding phrases.
    Return just the intro text with no quotes or formatting.
  `
  const randomIntro = await callAzureOpenAI(introPrompt, 300)
  const prompt = `
    Start with this hook: "${randomIntro}". 
    I need you to completely transform this blog content about "${coreTopic}" into something that sounds like I'm talking to my best friend at 1 AM after a few drinks.
    SPECIAL REQUIREMENTS:
    - The blog should primarily focus on the main topic (${coreTopic})
    - Add frequent personal anecdotes that feel genuine
    - Include casual phrases like "man, you know what I mean?", "like, seriously though", "I'm not even kidding"
    - Add occasional tangents that circle back to the main point
    - Use contractions, slang, and conversational grammar
    - Include rhetorical questions to the reader
    - Add humor, personality, and occasional mild profanity throughout
    - Vary sentence length dramatically
    - Include occasional self-corrections like "wait, that's not right"
    - Add emphasis words like "literally", "absolutely", "seriously", "honestly"
    - Include 3-5 personal opinions that sound authentic and slightly controversial
    - Occasionally mix in related topics or tangents that connect back naturally
    - STRICTLY ENSURE there is NO repetitive content
    - Include at least 3-5 aggressive facts or shocking statistics
    - Make sure the total word count is around 1500-2000 words
    - INCLUDE AT LEAST 5-7 EXTERNAL LINKS to authoritative sources
    - Use natural anchor text for links
    - INCLUDE AT LEAST 3-4 INTERNAL LINKS (use relative URLs like "/blog/another-post")
    - NEVER include meta-commentary
    - INCLUDE A CLEAR CALL-TO-ACTION at the end of each major section
    KEEP ALL THESE INTACT:
    - The H1 title (# Title)
    - All H2 headings (## Heading)
    - All H3 subheadings (### Subheading)
    - All bullet points and lists - Format bullet points as "- Term: Description" with the term in bold
    - All links and references
    FORMAT REQUIREMENTS:
    - H1 (#): text-5xl font-bold
    - H2 (##): text-4xl font-bold
    - H3 (###): text-3xl font-bold
    - Paragraphs: text-gray-700 leading-relaxed, no bolding, blank lines between
    - Lists: Use bullet points with term-colon format like "- **Term**: Description"
    - External Links: [text](https://example.com), class="text-orange-600 underline hover:text-orange-700 font-saira font-normal transition-colors duration-200"
    - Internal Links: [text](/internal-path), text-blue-600 hover:text-blue-800
    - ALWAYS end with a strong, personal call-to-action paragraph
    Content: "${content}"
    Return pure content, no HTML or extra bolding, and NEVER use the word "markdown".
    AVOID AI-FLAGGED WORDS like "unleash".
    STRICTLY ENSURE there is NO repetition of content within the blog post.
  `
  content = fixMarkdownLinks(content)
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
  return humanizedContent
    .replace(/<[^>]+>/g, "")
    .replace(/\*\*(.*?)\*\*/g, "- $1\n\n")
    .replace(/\n{1,}/g, "\n\n")
    .replace(/markdown/gi, "content")
    .trim()
}

async function generateArticleFromScrapedData(
  scrapedData: ScrapedData,
  userId: string,
  humanizeLevel: "normal" | "hardcore" = "normal",
): Promise<ArticleResult> {
  console.log(`Generating article from scraped data for topic: ${scrapedData.coreTopic}`)
  const now = new Date().toISOString().split("T")[0]
  const tempFileName = uuidv4() + ".md"
  try {
    console.log("Generating simple title based on scraped data")
    const simpleTitle = await generateEnhancedTitle(scrapedData.coreTopic, userId, scrapedData)
    console.log(`Generated title: ${simpleTitle}`)
    console.log("Waiting 15 seconds before generating first part...")
    await new Promise((resolve) => setTimeout(resolve, 15000))
    const researchData = scrapedData.researchResults || []
    console.log(`Found ${researchData.length} research results to process`)
    const formattedResearch = researchData
      .map((item, index) => `Source ${index + 1}: ${item.url}\nContent: ${item.content.slice(0, 300)}...`)
      .join("\n\n")
      .slice(0, 15000)
    console.log(`Using ${researchData.length} research sources, including Tavily search results`)
    console.log("Finding authoritative external links for the topic...")
    const externalLinks = await findAuthorityExternalLinks(scrapedData.coreTopic, 10)
    const formattedExternalLinks = externalLinks.join(", ")
    console.log("Generating first part of the article")
    const firstPartPrompt = `
      Write the FIRST HALF (introduction and first 3-4 sections) of a comprehensive blog post about "${scrapedData.coreTopic}" with title "${simpleTitle}".
      USE THIS RESEARCH DATA:
      - Core Topic: ${scrapedData.coreTopic}
      - Initial Research: ${scrapedData.initialResearchSummary.slice(0, 500)}...
      - Keywords to Include: ${scrapedData.extractedKeywords.slice(0, 5).map((k) => k.keyword).join(", ")}
      - Research Summary: ${scrapedData.researchSummary.slice(0, 1000)}...
      - Brand Info: ${scrapedData.brandInfo}
      - YouTube Video to Reference: ${scrapedData.youtubeVideo || "None"}
      - Research Details: ${formattedResearch}
      - External Links to Include: ${formattedExternalLinks}
      CRITICAL REQUIREMENTS:
      - Target word count: 700-750 words for this FIRST HALF
      - Focus primarily on the main topic
      - Occasionally mix in related topics or industry insights
      - ABSOLUTELY NO REPETITION
      - Use varied sentence structures and transitions
      - Include specific examples and data points from the research
      - Cite at least 3 different sources from the research data
      - Make each section distinct with its own focus
      - Use natural language that flows conversationally
      - NEVER start paragraphs with colons (:)
      - NEVER use phrases like "In this section we will discuss"
      - Include at least 2-3 aggressive facts or shocking statistics
      - INCLUDE AT LEAST 3-4 EXTERNAL LINKS to authoritative sources
      - Format external links as [anchor text](https://example.com)
      - INCLUDE AT LEAST 2-3 INTERNAL LINKS (use relative URLs like "/blog/another-post")
      - Format internal links as [anchor text](/internal-path)
      - NEVER include meta-commentary
      - INCLUDE A CLEAR CALL-TO-ACTION at the end of each major section
      Structure for this FIRST HALF:
      - H1 title at top (# ${simpleTitle})
      - Strong introduction that hooks the reader
      - 3-4 H2 sections with detailed content
      - H3 subsections where appropriate
      - Include bullet lists and blockquotes where appropriate
      IMPORTANT: 
      - This is ONLY THE FIRST HALF
      - Do NOT include a conclusion or call-to-action yet
      - Use natural, conversational language
      - AVOID AI-FLAGGED WORDS like "unleash"
      Return complete formatted content for the FIRST HALF only.
    `
    const firstPartContent = await callAzureOpenAI(firstPartPrompt, 16384)
    console.log(`First part generated (${countWords(firstPartContent)} words).`)
    console.log("Waiting 20 seconds before generating second part...")
    await new Promise((resolve) => setTimeout(resolve, 20000))
    console.log("Checking first part for any repetition...")
    const firstPartDeduped = await removeRepetitiveContent(firstPartContent, scrapedData.coreTopic)
    console.log("Generating second part of the article")
    const secondPartPrompt = `
      Write the SECOND HALF (remaining sections, FAQs, and conclusion) of a comprehensive blog post about "${scrapedData.coreTopic}" with title "${simpleTitle}".
      THE FIRST HALF OF THE ARTICLE: ${firstPartDeduped.slice(0, 500)}...
      USE THIS RESEARCH DATA:
      - Core Topic: ${scrapedData.coreTopic}
      - Keywords to Include: ${scrapedData.extractedKeywords.slice(5, 10).map((k) => k.keyword).join(", ")}
      - Research Sources: ${scrapedData.researchResults.map((r) => r.url).slice(0, 3).join(", ")}
      - Brand Info: ${scrapedData.brandInfo}
      - YouTube Video to Reference: ${scrapedData.youtubeVideo || "None"}
      - Research Details: ${formattedResearch}
      - External Links to Include: ${formattedExternalLinks}
      CRITICAL REQUIREMENTS:
      - Target word count: 700-750 words for this SECOND HALF
      - Focus primarily on the main topic
      - ABSOLUTELY NO REPETITION
      - Use varied sentence structures and transitions
      - Include specific examples and data points from the research
      - Cite at least 3 different sources from the research data
      - Make each section distinct with its own focus
      - Use natural language that flows conversationally
      - NEVER start paragraphs with colons (:)
      - NEVER use phrases like "In this section we will discuss"
      - Include at least 2-3 more aggressive facts or shocking statistics
      - INCLUDE AT LEAST 3-4 MORE EXTERNAL LINKS to authoritative sources
      - Format external links as [anchor text](https://example.com)
      - INCLUDE AT LEAST 2-3 MORE INTERNAL LINKS (use relative URLs like "/blog/another-post")
      - Format internal links as [anchor text](/internal-path)
      - NEVER include meta-commentary
      - INCLUDE A CLEAR CALL-TO-ACTION at the end of each major section
      Structure for this SECOND HALF:
      - 3-4 more H2 sections with detailed content
      - H3 subsections where appropriate
      - Include bullet lists and blockquotes where appropriate
      - INCLUDE A COMPREHENSIVE FAQ SECTION with at least 5 questions and detailed answers
      - Format the FAQ section as "## Frequently Asked Questions" followed by each question as "### Question?"
      - Each FAQ answer MUST include at least one external link
      - Use these authoritative external links: ${formattedExternalLinks}
      - A strong conclusion section
      - A compelling call-to-action section at the very end
      IMPORTANT: 
      - This is the SECOND HALF
      - Use natural, conversational language
      - DO NOT repeat the title or introduction
      - ALWAYS end with a compelling call-to-action section
      - AVOID AI-FLAGGED WORDS like "unleash"
      Return complete formatted content for the SECOND HALF only.
    `
    const secondPartContent = await callAzureOpenAI(secondPartPrompt, 16384)
    console.log(`Second part generated (${countWords(secondPartContent)} words).`)
    console.log("Waiting 10 seconds before combining parts...")
    await new Promise((resolve) => setTimeout(resolve, 10000))
    console.log("Combining parts...")
    const combinedContent = `${firstPartDeduped}\n\n${secondPartContent}`
    console.log(`Combined content: ${countWords(combinedContent)} words.`)
    console.log("Waiting 15 seconds before formatting...")
    await new Promise((resolve) => setTimeout(resolve, 15000))
    console.log("Applying deep formatting...")
    const formattedContent = await formatContentWithOpenAI(combinedContent, scrapedData.coreTopic, simpleTitle)
    console.log(`Formatted content: ${countWords(formattedContent)} words.`)
    console.log("Aggressively checking for repetitive content...")
    const deduplicatedContent = await removeRepetitiveContent(formattedContent, scrapedData.coreTopic)
    console.log(`Deduplicated content: ${countWords(deduplicatedContent)} words.`)
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
        - Use these authoritative external links: ${formattedExternalLinks}
        Blog post content: ${contentWithFAQs.slice(0, 5000)}...
        Return the COMPLETE blog post with the FAQ section added at the end (before the conclusion if one exists).
      `
      contentWithFAQs = await callAzureOpenAI(faqPrompt, 16384)
      console.log("FAQs added successfully.")
    }
    console.log("Checking if content has sufficient links...")
    const externalLinkRegex = /\[([^\]]+)\]\s*\((https?:\/\/[^)]+)\)/g
    const internalLinkRegex = /\[([^\]]+)\]\s*\(\/[^)]+\)/g
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
        - Add more internal links to other pages on the same website
        - Format internal links as [anchor text](/internal-path)
        - Insert links naturally within the existing text where they're most relevant
        - Use descriptive anchor text
        - Do NOT change any existing links or content structure
        Blog post content: ${contentWithLinks}
        Return the COMPLETE blog post with additional links added naturally throughout the content.
      `
      contentWithLinks = await callAzureOpenAI(linksPrompt, 16384)
      console.log("Additional links added successfully.")
    }
    console.log("Removing any leading colons from paragraphs...")
    const contentWithoutColons = removeLeadingColons(contentWithLinks)
    console.log("Applying deep humanization to the content...")
    const humanizedContent = humanizeLevel === "hardcore" ? 
      await hardcoreHumanizeContent(contentWithoutColons, scrapedData.coreTopic) : 
      await deepHumanizeContent(contentWithoutColons, scrapedData.coreTopic)
    console.log(`Humanized content: ${countWords(humanizedContent)} words.`)
    console.log("Fixing markdown link formatting...")
    const fixedMarkdownLinks = fixMarkdownLinks(humanizedContent)
    console.log("Finding a YouTube video related to the content...")
    const youtubeVideo = await findYouTubeVideo(scrapedData.coreTopic, fixedMarkdownLinks)
    let youtubeEmbed = ""
    if (youtubeVideo) {
      console.log(`Found YouTube video: ${youtubeVideo}`)
      youtubeEmbed = createYouTubeEmbed(youtubeVideo)
    }
    console.log("Generating tables related to the content...")
    const contentTables = await generateContentTables(scrapedData.coreTopic, fixedMarkdownLinks)
    console.log("Waiting 8 seconds before converting to HTML...")
    await new Promise((resolve) => setTimeout(resolve, 8000))
    const embedCode: string = youtubeEmbed ?? ""
    console.log("Converting to HTML with improved typography...")
    let htmlContent = formatUtils.convertMarkdownToHtml(fixedMarkdownLinks) || ""
    if (embedCode) {
      const headingMatches = htmlContent.match(/<h[23][^>]*>.*?<\/h[23]>/gi) || []
      if (headingMatches.length >= 2) {
        const secondHeading = headingMatches[1] ?? ""
        const secondHeadingPos = htmlContent.indexOf(secondHeading) + secondHeading.length
        htmlContent = htmlContent.slice(0, secondHeadingPos) + embedCode + htmlContent.slice(secondHeadingPos)
      } else if (headingMatches.length >= 1) {
        const firstHeading = headingMatches[0] ?? ""
        const firstHeadingPos = htmlContent.indexOf(firstHeading) + firstHeading.length
        htmlContent = htmlContent.slice(0, firstHeadingPos) + embedCode + htmlContent.slice(firstHeadingPos)
      }
    }
    if (contentTables.length > 0) {
      const paragraphs = htmlContent.match(/<\/p>/g) || []
      if (paragraphs.length >= 6 && contentTables[0]) {
        const thirdParagraphPos = findNthOccurrence(htmlContent, "</p>", 3)
        if (thirdParagraphPos !== -1) {
          htmlContent = htmlContent.slice(0, thirdParagraphPos + 4) + contentTables[0] + htmlContent.slice(thirdParagraphPos + 4)
        }
      }
      if (paragraphs.length >= 10 && contentTables[1]) {
        const eighthParagraphPos = findNthOccurrence(htmlContent, "</p>", 8)
        if (eighthParagraphPos !== -1) {
          htmlContent = htmlContent.slice(0, eighthParagraphPos + 4) + contentTables[1] + htmlContent.slice(eighthParagraphPos + 4)
        }
      }
    }
    let finalHtmlContent = htmlContent
      .replace(/<p[^>]*>\s*:\s*/g, '<p class="font-saira text-gray-700 leading-relaxed font-normal my-4">')
      .replace(/<li[^>]*>\s*:\s*/g, '<li class="ml-6 pl-2 list-disc text-gray-700 mb-2">')
    finalHtmlContent = await styleExternalLinks(finalHtmlContent)
    finalHtmlContent = processContentBeforeSaving(finalHtmlContent)
    const headings = formattedContent.match(/^#{1,3}\s+(.+)$/gm)?.map((h) => h.replace(/^#{1,3}\s+/, "")) || []
    const keywords = scrapedData.extractedKeywords
      ? scrapedData.extractedKeywords.slice(0, 5).map((k) => ({
          keyword: k.keyword,
          difficulty: k.relevance > 7 ? "High" : k.relevance > 4 ? "Medium" : "Low",
        }))
      : []
    return {
      blogPost: finalHtmlContent,
      seoScore: 85,
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

function findNthOccurrence(text: string, searchString: string, n: number): number {
  let index = -1
  for (let i = 0; i < n; i++) {
    index = text.indexOf(searchString, index + 1)
    if (index === -1) break
  }
  return index
}

async function generateFAQsWithExternalLinks(content: string, topic: string): Promise<string> {
  console.log(`Generating comprehensive FAQs with external links for topic: ${topic}`)
  const externalLinks = await findAuthorityExternalLinks(topic, 8)
  const prompt = `
    Generate 5-7 frequently asked questions (FAQs) related to the content about "${topic}".
    REQUIREMENTS:
    - Questions must be highly relevant to the main topic
    - Answers must be detailed, informative, and valuable (at least 2-3 sentences each)
    - Include a mix of basic and advanced questions
    - Format each question as a markdown heading (## Question) followed by a comprehensive answer
    - IMPORTANT: Each answer MUST include at least one external link to an authoritative source
    - Use these authoritative external links: ${externalLinks.join(", ")}
    Content: ${content.slice(0, 5000)}
    Return a complete FAQ section with 5-7 questions and detailed answers.
    Start with "## Frequently Asked Questions" as the main heading.
  `
  const faqs = await callAzureOpenAI(prompt, 16384)
  if (!faqs.trim().startsWith("## Frequently Asked Questions")) {
    return `\n\n## Frequently Asked Questions\n\n${faqs.trim()}`
  }
  return `\n\n${faqs.trim()}`
}

async function ensureFAQsExist(content: string, topic: string): Promise<string> {
  console.log("Ensuring FAQs with external links are properly included...")
  if (content.includes("## Frequently Asked Questions") || content.includes("## FAQ") || content.includes("## FAQs")) {
    console.log("FAQs already exist in content, ensuring they're properly formatted...")
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
      Content: ${content}
      Return the full content with properly formatted FAQs included.
      Make sure the FAQ section starts with "## Frequently Asked Questions" as the main heading.
    `
    try {
      const checkedContent = await callAzureOpenAI(faqCheckPrompt, 16384)
      return checkedContent
    } catch (error) {
      console.error("Error checking existing FAQs:", error)
      const newFAQs = await generateFAQsWithExternalLinks(content, topic)
      return `${content}\n\n${newFAQs}`
    }
  } else {
    console.log("No FAQs found, generating and adding them...")
    const faqs = await generateFAQsWithExternalLinks(content, topic)
    return `${content}\n\n${faqs}`
  }
}

async function addExternalLinksToSections(content: string, topic: string): Promise<string> {
  console.log("Adding external links to specific sections...")
  const externalLinks = await findAuthorityExternalLinks(topic, 10)
  if (externalLinks.length === 0) {
    console.log("No external links found, returning original content")
    return content
  }
  const sections = content.split(/(<h[1-6][^>]*>.*?<\/h[1-6]>)/g).filter(Boolean)
  if (sections.length <= 1) {
    return await ensureExternalLinks(content, topic, 7)
  }
  let result = ""
  let linkIndex = 0
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    if (section.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/)) {
      result += section
      continue
    }
    const linkRegex = /\[([^\]]+)\]\s*\((https?:\/\/[^)]+)\)/g
    const existingLinks = section.match(linkRegex) || []
    if (existingLinks.length >= 1) {
      result += section
      continue
    }
    if (section.length > 200 && linkIndex < externalLinks.length) {
      const prompt = `
        Add exactly ONE external link to this section about "${topic}".
        REQUIREMENTS:
        - Use this external link: ${externalLinks[linkIndex]}
        - Insert the link naturally within the existing text where it's most relevant
        - Use descriptive anchor text that relates to the linked content
        - Do NOT change any existing content structure
        - Format link as [anchor text](URL)
        Section content: ${section}
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

async function fetchStockImages(topic: string, count = 3): Promise<string[]> {
  try {
    const apiKey = process.env.RUNWARE_API_KEY || ""
    console.log(`Generating ${count} images with Runware AI for topic: ${topic}`)
    const { Runware } = await import("@runware/sdk-js")
    const runware = new Runware({ apiKey })
    console.log(`Initializing Runware AI for image generation...`)
    await runware.ensureConnection()
    const enhancedPrompt = `Professional, high-quality image of ${topic}. Photorealistic, detailed, perfect lighting, 8k resolution, commercial quality.`
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
    })
    if (!images || !Array.isArray(images)) {
      console.warn("Runware AI returned no images or an invalid response, falling back to placeholders")
      return generatePlaceholderImages(count, topic)
    }
    console.log(`Successfully generated ${images.length} images with Runware AI for "${topic}"`)
    const imageUrls = images.map((img: any) => img.imageURL || "").filter((url: string) => url)
    if (imageUrls.length === 0) {
      console.warn("No valid image URLs were generated by Runware AI, falling back to placeholders")
      return generatePlaceholderImages(count, topic)
    }
    return imageUrls
  } catch (error) {
    console.error("Error generating images with Runware AI:", error)
    try {
      const apiKey = process.env.RUNWARE_API_KEY || ""
      console.log("Trying with alternative model 'sdxl'...")
      const { Runware } = await import("@runware/sdk-js")
      const runware = new Runware({ apiKey })
      await runware.ensureConnection()
      const enhancedPrompt = `Professional, high-quality image of ${topic}. Photorealistic, detailed, perfect lighting, 8k resolution, commercial quality.`
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
      })
      if (!images || !Array.isArray(images)) {
        console.warn("Runware AI (fallback) returned no images or an invalid response, falling back to placeholders")
        return generatePlaceholderImages(count, topic)
      }
      console.log(`Successfully generated ${images.length} images with fallback model for "${topic}"`)
      const imageUrls = images.map((img: any) => img.imageURL || "").filter((url: string) => url)
      if (imageUrls.length > 0) {
        return imageUrls
      }
    } catch (fallbackError) {
      console.error("Error with fallback model:", fallbackError)
    }
    return generatePlaceholderImages(count, topic)
  }
}

function updateClassNames(cls: string): string {
  const cleanedClasses = cls
    .split(" ")
    .filter((className) => !className.match(/^m[trblxy]?-\d+$/) && !className.match(/^p[trblxy]?-\d+$/))
    .join(" ")
  return `${cleanedClasses} my-2`
}

async function determineImagePlacements(
  blogContent: string,
  topic: string,
  imageCount = 2,
): Promise<{ content: string; imageUrls: string[] }> {
  try {
    const headingMatches = blogContent.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi) || []
    const headings = headingMatches.map((h) => h.replace(/<\/?[^>]+>/g, "").trim())
    const textContent = blogContent.replace(/<[^>]+>/g, " ").slice(0, 10000)
    const imageUrls = await fetchStockImages(topic, imageCount)
    if (!imageUrls.length) {
      return { content: blogContent, imageUrls: [] }
    }
    const prompt = `
      I have a blog post about "${topic}" and ${imageCount} relevant images to place within it.
      The blog post contains these main sections: ${headings.join(", ")}.
      Based on the content, determine the best ${imageCount} locations to insert these images.
      For each image, provide:
      1. A very specific description of what the image should show (for alt text)
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
      return insertImagesAtRegularIntervals(blogContent, imageUrls, topic)
    }
    return insertImagesAtPlacements(blogContent, imageUrls, placements, topic)
  } catch (error) {
    console.error("Error determining image placements:", error)
    return { content: blogContent, imageUrls: [] }
  }
}

function insertImagesAtRegularIntervals(
  content: string,
  imageUrls: string[],
  topic: string,
): { content: string; imageUrls: string[] } {
  if (!imageUrls.length) return { content, imageUrls: [] }
  const paragraphs = content.match(/<\/p>/g) || []
  if (paragraphs.length < imageUrls.length) {
    return { content, imageUrls }
  }
  const interval = Math.floor(paragraphs.length / (imageUrls.length + 1))
  let modifiedContent = content
  let lastIndex = 0
  const usedImageUrls: string[] = []
  imageUrls.forEach((imageUrl, i) => {
    const targetIndex = (i + 1) * interval
    if (targetIndex >= paragraphs.length) return
    let count = 0
    let position = -1
    while (count <= targetIndex) {
      position = modifiedContent.indexOf("</p>", position + 1)
      if (position === -1) break
      count++
    }
    if (position !== -1) {
      const imageHtml = `</p><figure class="my-6 mx-auto max-w-full"><img src="${imageUrl}" alt="${topic} image ${i + 1}" class="w-full rounded-lg shadow-md" /><figcaption class="text-sm text-center text-gray-500 mt-2 font-saira">${topic} - related image</figcaption></figure><p class="font-saira text-gray-700 leading-relaxed font-normal my-4">`
      modifiedContent = modifiedContent.slice(0, position + 4) + imageHtml + modifiedContent.slice(position + 4)
      lastIndex = position + imageHtml.length
      usedImageUrls.push(imageUrl)
    }
  })
  return { content: modifiedContent, imageUrls: usedImageUrls }
}

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
  placements.forEach((placement, index) => {
    if (index >= imageUrls.length) return
    const imageUrl = imageUrls[index]
    const insertAfter = placement.insertAfter || ""
    const description = placement.description || `Image related to ${topic}`
    const caption = placement.caption || `Figure ${index + 1}: Related to ${topic}`
    const position = modifiedContent.indexOf(insertAfter)
    if (position !== -1 && insertAfter.length > 0) {
      const endPosition = position + insertAfter.length
      const imageHtml = `<figure class="my-6 mx-auto max-w-full"><img src="${imageUrl}" alt="${description}" class="w-full rounded-lg shadow-md" /><figcaption class="text-sm text-center text-gray-500 mt-2 font-saira">${caption}</figcaption></figure>`
      modifiedContent = modifiedContent.slice(0, endPosition) + imageHtml + modifiedContent.slice(endPosition)
      usedImageUrls.push(imageUrl)
    }
  })
  if (usedImageUrls.length < imageUrls.length) {
    const remainingImages = imageUrls.filter((url) => !usedImageUrls.includes(url))
    const result = insertImagesAtRegularIntervals(modifiedContent, remainingImages, topic)
    modifiedContent = result.content
    usedImageUrls.push(...result.imageUrls)
  }
  return { content: modifiedContent, imageUrls: usedImageUrls }
}

async function styleExternalLinksEnhanced(htmlContent: string): Promise<string> {
  let updatedContent = htmlContent.replace(
    /<a\s+(?:[^>]*?\s+)?href=["'](https?:\/\/[^"']*)["'][^>]*>(.*?)<\/a>/gi,
    (match, url, text) => {
      return `<a href="${url}" class="text-orange-600 underline hover:text-orange-700 font-saira font-normal transition-colors duration-200" target="_blank" rel="noopener noreferrer">${text}</a>`
    },
  )
  updatedContent = updatedContent.replace(
    /<a\s+(?:[^>]*?\s+)?href=["'](\/[^"']*)["'][^>]*>(.*?)<\/a>/gi,
    (match, url, text) => {
      return `<a href="${url}" class="text-blue-600 hover:text-blue-800 font-normal transition-colors duration-200">${text}</a>`
    },
  )
  return updatedContent
}

async function enhanceBlogWithImages(blogContent: string, topic: string, imageCount = 2): Promise<string> {
  console.log(`Enhancing blog post with ${imageCount} images related to: ${topic}`)
  const { content } = await determineImagePlacements(blogContent, topic, imageCount)
  let finalContent = formatUtils.sanitizeHtml(content)
  finalContent = finalContent
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .replace(/<\/figure><p/g, "</figure><p")
    .replace(/<h1[^>]*>/g, '<h1 class="font-saira text-5xl font-bold mt-8 mb-6 text-gray-900">')
    .replace(/<h2[^>]*>/g, '<h2 class="font-saira text-4xl font-bold mt-10 mb-5 text-gray-900">')
    .replace(/<h3[^>]*>/g, '<h3 class="font-saira text-3xl font-bold mt-8 mb-4 text-gray-800">')
    .replace(/<p[^>]*>/g, '<p class="font-saira text-gray-700 leading-relaxed font-normal my-4">')
    .replace(/<ul[^>]*>/g, '<ul class="pl-6 my-6 space-y-1">')
    .replace(
      /<li[^>]*><span[^>]*>•<\/span><div>-\s*([^<]+)<\/div><\/li>/g,
      '<li class="flex items-start mb-4"><span class="text-gray-800 mr-2">•</span><div><strong class="font-bold">$1</strong></div></li>',
    )
    .replace(
      /<li[^>]*>([^<]*)<\/li>/g,
      '<li class="flex items-start mb-4"><span class="text-gray-800 mr-2">•</span><div>$1</div></li>',
    )
    .replace(
      /<li[^>]*><strong[^>]*>([^<]+)<\/strong>:\s*([^<]*)<\/li>/g,
      '<li class="flex items-start mb-4"><span class="text-gray-800 mr-2">•</span><div><strong class="font-bold">$1</strong>: $2</div></li>',
    )
    .replace(/<strong[^>]*>/g, '<strong class="font-bold">')
    .replace(/<figure[^>]*>/g, '<figure class="my-6 mx-auto max-w-full">')
    .replace(/<figcaption[^>]*>/g, '<figcaption class="text-sm text-center text-gray-500 mt-2 font-saira">')
    .replace(/<a([^>]*)>/g, '<a$1 target="_blank" rel="noopener noreferrer">')
  finalContent = await styleExternalLinksEnhanced(finalContent)
  const linkValidation = validateLinks(finalContent)
  console.log(
    `Final styling check: ${linkValidation.externalLinkCount} external links and ${linkValidation.internalLinkCount} internal links styled.`,
  )
  if (!linkValidation.hasExternalLinks && finalContent.includes('href="http')) {
    console.log("Found external links without styling, applying enhanced styling...")
    finalContent = await styleExternalLinksEnhanced(finalContent)
  }
  if (!hasFAQSection(finalContent)) {
    console.log("No FAQ section found, adding one...")
    const faqPrompt = `
      Generate 4 frequently asked questions (FAQs) related to "${topic}".
      REQUIREMENTS:
      - Questions must be highly relevant to the main topic
      - Answers must be detailed and informative (2-3 sentences each)
      - Include a mix of basic and advanced questions
      - Each answer should include at least one relevant link
      - Format as HTML with proper classes matching the blog styling
      Return complete HTML for a FAQ section with 4 questions and answers.
    `
    const faqContent = await callAzureOpenAI(faqPrompt, 2000)
    const faqSection = `
      <h2 class="font-saira text-4xl font-bold mt-10 mb-5 text-gray-900">Frequently Asked Questions</h2>
      ${faqContent}
    `
    finalContent = finalContent + faqSection
  }
  finalContent = `<div class="blog-content font-saira">${finalContent}</div>`
  finalContent = finalContent.replace(
    /<a\s+(?:[^>]*?\s+)?href=["'](https?:\/\/[^"']*)["'][^>]*>(.*?)<\/a>/gi,
    (match, url, text) => {
      return `<a href="${url}" class="text-orange-600 underline hover:text-orange-700 font-saira font-normal transition-colors duration-200" target="_blank" rel="noopener noreferrer">${text}</a>`
    },
  )
  finalContent = processContentBeforeSaving(finalContent)
  finalContent = removeDuplicateContentAfterConclusion(finalContent)
  finalContent = finalContent.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
  return finalContent
}

function processContentBeforeSaving(content: string): string {
    let processedContent = content.replace(/\[([^\]]+)\]\s*\(([^)]+)\)/g, (match, text, url) => {
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
    processedContent = processedContent
      .replace(/<p[^>]*>\s*:\s*/g, '<p class="font-saira text-gray-700 leading-relaxed font-normal my-4">')
      .replace(/<li[^>]*>\s*:\s*/g, '<li class="ml-6 pl-2 list-disc text-gray-700 mb-2">')
      .replace(/<[^>]+>\s*:\s*/g, (match) => match.replace(/\s*:\s*/, " "))
      .replace(/\n{3,}/g, "\n\n")
      .replace(/<p[^>]*>\s*<\/p>/g, "")
    return processedContent.trim()
  }
  
  
  
  async function generateEnhancedTitle(
    coreTopic: string,
    userId: string,
    scrapedData: ScrapedData,
  ): Promise<string> {
    console.log(`Generating enhanced title for topic: ${coreTopic}`)
    const prompt = `
      Create a compelling, SEO-friendly blog post title based on this topic: "${coreTopic}".
      Use these keywords if relevant: ${scrapedData.extractedKeywords.map((k) => k.keyword).join(", ")}.
      REQUIREMENTS:
      - Keep it conversational and engaging
      - Make it specific and unique
      - Aim for 60-70 characters
      - Avoid generic phrases like "ultimate guide"
      - Include a hook or angle that grabs attention
      Return just the title as plain text, no quotes or formatting.
    `
    const title = await callAzureOpenAI(prompt, 100)
    return title.trim()
  }
  
  function fixMarkdownLinks(content: string): string {
    return content.replace(/\[([^\]]+)\]\s*\(([^)]+)\)/g, (match, text, url) => {
      const cleanText = text.trim()
      const cleanUrl = url.trim()
      if (cleanUrl.startsWith("http") || cleanUrl.startsWith("https")) {
        return `[${cleanText}](${cleanUrl})`
      } else if (cleanUrl.startsWith("/")) {
        return `[${cleanText}](${cleanUrl})`
      } else {
        return `[${cleanText}](${cleanUrl})`
      }
    })
  }
  
  async function formatContentWithOpenAI(
    content: string,
    coreTopic: string,
    title: string,
  ): Promise<string> {
    console.log(`Formatting content with OpenAI for topic: ${coreTopic}`)
    const prompt = `
      Format this blog post content about "${coreTopic}" with proper structure and styling.
      Content: ${content}
      Title: ${title}
      REQUIREMENTS:
      - H1 for title (# ${title})
      - H2 for main sections (## Heading)
      - H3 for subsections (### Subheading)
      - Use bullet points for lists in "- **Term**: Description" format
      - External links as [text](https://example.com)
      - Internal links as [text](/internal-path)
      - Ensure consistent spacing (blank lines between paragraphs and sections)
      - Remove any duplicate content
      - Preserve all existing content and links
      - Add a conclusion if missing
      Return the fully formatted content.
    `
    const formattedContent = await callAzureOpenAI(prompt, 16384)
    return formattedContent
  }
  
  async function removeRepetitiveContent(content: string, coreTopic: string): Promise<string> {
    console.log(`Removing repetitive content for topic: ${coreTopic}`)
    const prompt = `
      Review this blog post content about "${coreTopic}" and remove ALL repetitive sentences, phrases, or ideas.
      Content: ${content}
      REQUIREMENTS:
      - Preserve the structure (headings, lists, links)
      - Keep the meaning intact
      - Remove exact or near-exact duplicates
      - Adjust transitions to maintain flow
      - Return the cleaned content
    `
    const cleanedContent = await callAzureOpenAI(prompt, 16384)
    return cleanedContent
  }
  
  function countWords(text: string): number {
    return text.split(/\s+/).filter((word) => word.length > 0).length
  }
  
  function splitContentIntoChunks(content: string, maxLength: number): string[] {
    const chunks: string[] = []
    let currentChunk = ""
    const lines = content.split("\n")
    for (const line of lines) {
      if ((currentChunk + line).length > maxLength && currentChunk.length > 0) {
        chunks.push(currentChunk.trim())
        currentChunk = line
      } else {
        currentChunk += (currentChunk.length > 0 ? "\n" : "") + line
      }
    }
    if (currentChunk.length > 0) {
      chunks.push(currentChunk.trim())
    }
    return chunks
  }
  
  async function hardcoreHumanizeContent(content: string, coreTopic: string): Promise<string> {
    console.log(`Applying hardcore humanization to content for topic: ${coreTopic}`)
    const prompt = `
      Transform this blog content about "${coreTopic}" into an ultra-casual, edgy, human-sounding piece.
      Content: ${content}
      REQUIREMENTS:
      - Sound like a passionate expert ranting to a friend
      - Use heavy slang, mild profanity, and raw emotion
      - Add wild personal anecdotes
      - Include tangents that loop back
      - Vary sentence length wildly
      - Add 5-7 bold opinions
      - Include 3-5 shocking stats
      - Keep all headings, lists, and links
      - Aim for 1500-2000 words
      - End with a raw call-to-action
      Return the transformed content.
    `
    const humanizedContent = await callAzureOpenAI(prompt, 16384)
    return humanizedContent
  }
  
  async function checkContentSimilarity(
    newContent: string,
    existingContent: string[],
    existingTitles: string[],
  ): Promise<{ isTooSimilar: boolean; similarToTitle: string }> {
    console.log("Checking content similarity...");
    const prompt = `
      Compare this new blog content with existing content to check for similarity.
      New Content: "${newContent.slice(0, 2000)}..."
      Existing Content: ${existingContent.map((c, i) => `Post ${i + 1}: "${c.slice(0, 1000)}..."`).join("\n")}
      Existing Titles: ${existingTitles.join(", ")}
      REQUIREMENTS:
      - Check for overlapping ideas, phrases, or structure
      - Return JSON: {"isTooSimilar": boolean, "similarToTitle": string}
      - Set isTooSimilar to true if >50% overlap with any existing post
      - Ensure the response is valid JSON, even if analysis fails
    `;
    const response = await callAzureOpenAI(prompt, 500);
    console.log(`Raw OpenAI response: ${response}`); // Log raw response for debugging
  
    try {
      const cleanedResponse = response.replace(/```json\n?|\n?```/g, "").trim();
      const result = JSON.parse(cleanedResponse);
      return {
        isTooSimilar: result.isTooSimilar || false,
        similarToTitle: result.similarToTitle || "",
      };
    } catch (error) {
      console.error("Error parsing OpenAI response as JSON:", error);
      console.error("Response received:", response);
      // Fallback to a default safe response
      return {
        isTooSimilar: false,
        similarToTitle: "",
      };
    }
  }
  function removeLeadingColons(content: string): string {
    return content.replace(/^:\s*/gm, "")
  }
  
  async function findAuthorityExternalLinks(topic: string, count: number): Promise<string[]> {
    console.log(`Finding ${count} authoritative external links for topic: ${topic}`)
    const urls = await performTavilySearch(topic)
    return urls.slice(0, count)
  }
  
  function validateLinks(content: string): { hasExternalLinks: boolean; externalLinkCount: number; internalLinkCount: number } {
    const externalLinkRegex = /<a\s+href=["'](https?:\/\/[^"']+)["'][^>]*>/gi
    const internalLinkRegex = /<a\s+href=["'](\/[^"']+)["'][^>]*>/gi
    const externalLinks = content.match(externalLinkRegex) || []
    const internalLinks = content.match(internalLinkRegex) || []
    return {
      hasExternalLinks: externalLinks.length > 0,
      externalLinkCount: externalLinks.length,
      internalLinkCount: internalLinks.length,
    }
  }
  
  function hasFAQSection(content: string): boolean {
    return (
      content.includes("<h2>Frequently Asked Questions</h2>") ||
      content.includes("<h2>FAQ</h2>") ||
      content.includes("<h2>FAQs</h2>")
    )
  }
 
  // Main generateBlog function updated for headlinetoblog table
  export async function generateBlog(
    headline: string,
    humanizeLevel: "normal" | "hardcore" = "normal",
    website?: string,
  ): Promise<BlogPost[]> {
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
    const existingContent: string[] = []
    const existingTitles: string[] = []
  
    const reformatExistingPosts = async (supabase: any, userId: string): Promise<void> => {
      const { data: postsToReformat } = await supabase
        .from("headlinetoblog") // Updated to new table name
        .select("id, blog_post")
        .eq("user_id", userId)
        .not("blog_post", "like", "<div%")
      if (postsToReformat && postsToReformat.length > 0) {
        console.log(`Found ${postsToReformat.length} posts to reformat for user ${userId}`)
        for (const post of postsToReformat) {
          const reformattedPost = formatUtils.convertMarkdownToHtml(post.blog_post)
          const { error: updateError } = await supabase
            .from("headlinetoblog") // Updated to new table name
            .update({ blog_post: reformattedPost })
            .eq("id", post.id)
          if (updateError) {
            console.error(`Error reformatting post ${post.id}: ${updateError.message}`)
          } else {
            console.log(`Reformatted post ${post.id} successfully`)
          }
        }
      }
    }
  
    try {
      console.log(`Checking for posts that need reformatting for user ${userId}`)
      await reformatExistingPosts(supabase, userId)
  
      const { data: existingPosts } = await supabase
        .from("headlinetoblog") // Updated to new table name
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
  
      const postsToGenerate = 1
      console.log(`Generating ${postsToGenerate} posts based on headline "${headline}"${website ? ` and website "${website}"` : ""} for user ${userId} - ONE AT A TIME, VERY SLOWLY`)
  
      for (let i = 0; i < postsToGenerate; i++) {
        try {
          console.log(`\n\n========== STARTING BLOG POST ${i + 1} OF ${postsToGenerate} ==========\n\n`)
  
          console.log(`Waiting 10 seconds before starting blog post ${i + 1}...`)
          await new Promise((resolve) => setTimeout(resolve, 10000))
  
          console.log(`🔍 Researching headline "${headline}"${website ? ` with website "${website}"` : ""} for blog ${i + 1}`)
          const scrapedData = await researchHeadlineAndSaveToJson(headline, userId, website)
          if (!scrapedData) {
            throw new Error(`Failed to research data for blog ${i + 1} based on headline "${headline}"`)
          }
          console.log(`✅ Researched headline and got ${scrapedData.researchResults.length} sources for blog ${i + 1}`)
  
          console.log(`Waiting 8 seconds after research for blog post ${i + 1}...`)
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
  
          const coreTopic = result.title || headline
  
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
            url: website || null, // Updated to null if no website provided
          }
  
          const { error: insertError } = await supabase
            .from("headlinetoblog") // Updated to new table name
            .insert(blogData)
  
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
          break
        }
      }
  
      const successfulPosts = blogPosts.length
      console.log(`✅ Generated ${successfulPosts} blog posts for user ${userId}`)
      return blogPosts
    } catch (error: any) {
      console.error(`Failed to generate blogs: ${error.message}`)
      throw new Error(`Blog generation failed: ${error.message}`)
    }
  }
  
  // Research function for headline + optional website
  async function researchHeadlineAndSaveToJson(
    headline: string,
    userId: string,
    website?: string,
  ): Promise<ScrapedData | null> {
    console.log(`Researching headline "${headline}"${website ? ` with website "${website}"` : ""} for user ${userId}`)
  
    try {
      // Extract keywords from the headline
      const keywordsPrompt = `
        Extract 5-10 key phrases from this headline: "${headline}".
        Focus on specific, unique terms that capture its essence.
        Return as JSON: [{"keyword": "term1"}, {"keyword": "term2"}]
      `
      const keywordsResponse = await callAzureOpenAI(keywordsPrompt, 200)
      let keywords = []
      try {
        keywords = JSON.parse(keywordsResponse.replace(/```json\n?|\n?```/g, "").trim()).map((k: { keyword: string }) => k.keyword)
      } catch (error) {
        console.error("Error parsing keywords:", error)
        keywords = [headline] // Fallback to headline if parsing fails
      }
      console.log(`Extracted keywords: ${keywords.join(", ")}`)
  
      // Generate an initial summary based on the headline
      const initialSummaryPrompt = `
        Based on this headline: "${headline}", generate a detailed, conversational summary (300-500 words) of what this blog post might be about.
        Assume you're an expert and provide a plausible overview based on industry knowledge.
        Return plain text, no formatting.
      `
      const initialResearchSummary = await callAzureOpenAI(initialSummaryPrompt, 800)
  
      // Define core topic as the headline for simplicity
      const coreTopic = headline
  
      // Perform Tavily searches based on keywords
      const searchQuery = keywords.join(" ")
      const tavilyResults = await performTavilySearch(searchQuery)
      let researchResults = await Promise.all(
        tavilyResults.slice(0, 5).map(async (url) => { // Limit to 5 for efficiency
          const content = await scrapeWithTavily(url)
          return { url, content, title: url.split("/").pop() || url }
        }),
      )
  
      // If website is provided, scrape it and add to results
      let brandInfo = ""
      if (website) {
        const websiteContent = await scrapeWithTavily(website)
        researchResults.push({ url: website, content: websiteContent, title: website.split("/").pop() || website })
        brandInfo = `Content from ${website}`
      }
  
      // Filter out failed scrapes
      researchResults = researchResults.filter((r) => r.content && r.content !== "No content available")
      console.log(`Scraped ${researchResults.length} sources`)
  
      // Save to JSON (in-memory for now)
      const jsonData = {
        headline,
        keywords,
        researchResults,
        timestamp: new Date().toISOString(),
      }
      const researchSummary = JSON.stringify(jsonData, null, 2)
      console.log(`Research data saved to JSON: ${researchSummary.slice(0, 200)}...`)
  
      // Prepare ScrapedData
      const scrapedData: ScrapedData = {
        initialUrl: website || "",
        initialResearchSummary,
        researchResults,
        researchSummary,
        coreTopic,
        brandInfo,
        youtubeVideo: null,
        internalLinks: [],
        references: researchResults.map((r) => r.url),
        existingPosts: "",
        targetKeywords: keywords,
        timestamp: jsonData.timestamp,
        nudge: "",
        extractedKeywords: keywords.map((k) => ({ keyword: k, relevance: 8 })),
      }
  
      console.log(`Prepared ScrapedData for: ${coreTopic}`)
      return scrapedData
    } catch (error: any) {
      console.error(`Researching headline "${headline}" failed: ${error.message}`)
      return null
    }
  }
  
  // Helper function to style external links
  async function styleExternalLinks(htmlContent: string): Promise<string> {
    return htmlContent.replace(
      /<a\s+(?:[^>]*?\s+)?href=["'](https?:\/\/[^"']*)["'][^>]*>(.*?)<\/a>/gi,
      '<a href="$1" class="text-orange-600 underline hover:text-orange-700 font-saira font-normal transition-colors duration-200" target="_blank" rel="noopener noreferrer">$2</a>',
    )
  }
  
  async function ensureExternalLinks(content: string, topic: string, minLinks: number): Promise<string> {
    const externalLinkRegex = /\[([^\]]+)\]\s*\((https?:\/\/[^)]+)\)/g
    const existingLinks = content.match(externalLinkRegex) || []
    if (existingLinks.length >= minLinks) {
      return content
    }
    const additionalLinksNeeded = minLinks - existingLinks.length
    const externalLinks = await findAuthorityExternalLinks(topic, additionalLinksNeeded)
    let updatedContent = content
    let linkIndex = 0
    externalLinks.forEach((link) => {
      if (linkIndex >= additionalLinksNeeded) return
      const anchorText = `Learn more about ${topic.split(" ").slice(0, 2).join(" ")}`
      const linkMarkdown = `[${anchorText}](${link})`
      const lastParagraphIndex = updatedContent.lastIndexOf("\n\n")
      if (lastParagraphIndex !== -1) {
        updatedContent = updatedContent.slice(0, lastParagraphIndex) + ` ${linkMarkdown}` + updatedContent.slice(lastParagraphIndex)
      } else {
        updatedContent += `\n\n${linkMarkdown}`
      }
      linkIndex++
    })
    return updatedContent
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
  
  function generatePlaceholderImages(count: number, topic: string): string[] {
    const placeholderImages: string[] = []
    for (let i = 0; i < count; i++) {
      placeholderImages.push(`https://via.placeholder.com/640x360?text=${encodeURIComponent(topic)}+${i + 1}`)
    }
    return placeholderImages
  }
  
  // Dummy function to remove duplicate content after conclusion
  function removeDuplicateContentAfterConclusion(content: string): string {
    // Implement your logic here to remove any duplicate content after the conclusion
    // For now, let's just return the original content
    return content
  }
  
  // Updated function to scrape website and save to JSON with website-specific data
  async function scrapeWebsiteAndSaveToJson(url: string, userId: string): Promise<ScrapedData | null> {
    console.log(`Scraping ${url} and extracting website-specific data for user ${userId}`)
  
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
  
  // END OF FILE