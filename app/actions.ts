"use server"

import { tavily } from "@tavily/core"
import { v4 as uuidv4 } from "uuid"
import OpenAI from "openai"
import { createClient } from "@/utitls/supabase/server"
import fs from "fs/promises"
import path from "path"

// Updated formatUtils with better typography and spacing
const formatUtils = {
  convertMarkdownToHtml: (markdown: string) => {
    // First, normalize all line breaks to ensure consistent processing
    const normalizedMarkdown = markdown.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n")

    let html = normalizedMarkdown
      // Headings with improved typography and proper spacing
      .replace(/^###### (.*$)/gim, '<h6 class="text-lg font-bold mt-3 mb-2">$1</h6>')
      .replace(/^##### (.*$)/gim, '<h5 class="text-xl font-bold mt-3 mb-2">$1</h5>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-2xl font-bold mt-4 mb-2">$1</h4>')
      .replace(/^### (.*$)/gim, '<h3 class="text-3xl font-bold mt-5 mb-3 text-gray-800">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-4xl font-bold mt-6 mb-3 text-gray-900"></h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-5xl font-bold mt-6 mb-4 text-gray-900 border-b pb-1">$1</h1>')

      // Text formatting with better font weights
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')

      // Lists with compact spacing
      .replace(/^- (.*)$/gim, '<li class="ml-2 list-disc text-gray-700">$1</li>')
      .replace(/^[*] (.*)$/gim, '<li class="ml-2 list-disc text-gray-700">$1</li>')
      .replace(/(<li.*?>.*<\/li>)/gim, '<ul class="my-2">$1</ul>')

      // Paragraphs with better typography
      .replace(/\n{2,}/g, '</p><p class="text-gray-700 leading-relaxed font-normal my-2">')

      // Links with better styling
      .replace(/\[([^\]]+)\]$$([^)]+)$$/gim, '<a href="$2" class="text-blue-600 hover:underline font-normal">$1</a>')

      // Blockquotes with better styling
      .replace(
        /^>\s+(.*)$/gim,
        '<blockquote class="border-l-4 border-gray-300 pl-3 italic text-gray-600 my-2">$1</blockquote>',
      )

    // Wrap in paragraph with better typography
    html = `<p class="text-gray-700 leading-relaxed font-normal my-2">${html}</p>`

    // Ensure no double paragraph tags
    html = html.replace(/<\/p>\s*<p class="text-gray-700 leading-relaxed font-normal my-2">\s*<\/p>/g, "</p>")

    // Ensure no empty paragraphs
    html = html.replace(/<p class="text-gray-700 leading-relaxed font-normal my-2">\s*<\/p>/g, "")

    return html
  },

  sanitizeHtml: (html: string) => {
    // For server-side rendering, we need to use a different approach
    // This is a simplified version that uses string manipulation instead of DOM

    // Ensure all paragraphs have better typography
    let sanitized = html
      .replace(/<p[^>]*>/g, '<p class="text-gray-700 leading-relaxed font-normal my-2">')

      // Ensure all lists have compact spacing
      .replace(/<ul[^>]*>/g, '<ul class="my-2">')
      .replace(/<li[^>]*>/g, '<li class="ml-2 list-disc text-gray-700">')

      // Ensure all headings have better typography
      .replace(/<h1[^>]*>/g, '<h1 class="text-5xl font-bold mt-6 mb-4 text-gray-900 border-b pb-1">')
      .replace(/<h2[^>]*>/g, '<h2 class="text-4xl font-bold mt-6 mb-3 text-gray-900">')
      .replace(/<h3[^>]*>/g, '<h3 class="text-3xl font-bold mt-5 mb-3 text-gray-800">')
      .replace(/<h4[^>]*>/g, '<h4 class="text-2xl font-bold mt-4 mb-2">')
      .replace(/<h5[^>]*>/g, '<h5 class="text-xl font-bold mt-3 mb-2">')
      .replace(/<h6[^>]*>/g, '<h6 class="text-lg font-bold mt-3 mb-2">')

      // Ensure all blockquotes have better styling
      .replace(/<blockquote[^>]*>/g, '<blockquote class="border-l-4 border-gray-300 pl-3 italic text-gray-600 my-2">')

      // Ensure all links have consistent styling
      .replace(/<a[^>]*>/g, '<a class="text-blue-600 hover:underline font-normal">')

      // Ensure all figures have consistent styling
      .replace(/<figure[^>]*>/g, '<figure class="my-4">')
      .replace(/<figcaption[^>]*>/g, '<figcaption class="text-sm text-center text-gray-500 mt-1">')

    // Remove any empty paragraphs
    sanitized = sanitized.replace(/<p[^>]*>\s*<\/p>/g, "")

    return sanitized
  },

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

interface BlogResult {
  blogPost: string
  seoScore: number
  headings: string[]
  keywords: { keyword: string; difficulty: string }[]
  citations: string[]
  tempFileName: string
  title: string
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

// Tavily and OpenAI setup
const TAVILY_API_KEY: string = process.env.TAVILY_API_KEY || "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"
console.log(`Tavily API Key in use: ${TAVILY_API_KEY || "Not set! Check your env or hardcoded fallback."}`)
const tavilyClient = tavily({ apiKey: TAVILY_API_KEY })

const configuration = {
  apiKey: process.env.AZURE_OPENAI_API_KEY || "",
  basePathGPT4oMini: process.env.AZURE_OPENAI_API_BASE_PATH_GPT4O_MINI || "",
}

console.log("AZURE_OPENAI_API_KEY:", configuration.apiKey || "Not set!")
console.log("AZURE_OPENAI_API_BASE_PATH_GPT4O_MINI:", configuration.basePathGPT4oMini || "Not set!")

const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY as string,
  baseURL: configuration.basePathGPT4oMini,
  defaultQuery: { "api-version": "2024-02-15-preview" },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY as string },
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

// Update the generateSearchQueries function to create more topic-focused queries
async function generateSearchQueries(metaDescription: string, topic: string): Promise<string[]> {
  const prompt = `
    Using this meta description and topic, come up with 8 unique, natural search queries for deep research on a 3000-word blog post about "${topic}". 
    
    IMPORTANT: These queries should focus on the BROADER TOPIC, not just the specific website. Create diverse queries that will find different perspectives and information sources across the web.
    
    Mix different query types:
    - Some specific questions people would ask about ${topic}
    - Some comparison queries (${topic} vs alternatives)
    - Some "how to" queries related to the topic
    - Some industry-specific jargon queries
    - Some queries about recent trends or developments in ${topic}
    - Some queries about problems or challenges related to ${topic}
    
    Keep 'em fun and conversational—like you're asking a friend to dig in. No repeats from past topics, no AI buzzwords.
    Meta Description: "${metaDescription}"
    Topic: "${topic}"
    Return a JSON array, e.g., ["query1", "query2"].
  `
  const response = await callAzureOpenAI(prompt, 300)
  const cleanedResponse = response.replace(/```json\n?|\n?```/g, "").trim()
  try {
    const queries = (JSON.parse(cleanedResponse) as string[]) || []
    console.log(`Generated TOPIC-FOCUSED search queries: ${JSON.stringify(queries)}`)
    return queries
  } catch (error) {
    console.error("Error parsing queries:", error)
    return [
      `${topic} comprehensive guide`,
      `${topic} best practices`,
      `${topic} vs competitors`,
      `how to use ${topic} effectively`,
      `${topic} industry trends`,
      `common problems with ${topic}`,
      `${topic} expert tips`,
      `${topic} case studies`,
    ]
  }
}

// Update the performTavilySearch function to focus on topics rather than just URLs
async function performTavilySearch(query: string): Promise<string[]> {
  console.log(`\nPerforming advanced Tavily search for TOPIC: ${query}`)
  try {
    // Make sure we're searching the web for the topic, not just the website
    const response = await tavilyClient.search(query, {
      searchDepth: "advanced", // Use advanced depth for better results
      max_results: 20, // Increased from 15 to 20 for more comprehensive research
      include_raw_content: true,
      search_mode: "comprehensive", // Ensure we're doing a comprehensive web search
    })

    // Filter for higher quality URLs
    const urls = response.results
      .filter((result: any) => {
        // Filter out low-quality sources
        const url = result.url || ""
        const hasGoodDomain =
          !url.includes("pinterest") &&
          !url.includes("instagram") &&
          !url.includes("facebook") &&
          !url.includes("twitter") &&
          !url.includes("tiktok")

        // Check if it has substantial content
        const hasContent = result.rawContent && result.rawContent.length > 500

        return url.match(/^https?:\/\/.+/) && hasGoodDomain && hasContent
      })
      .map((result: any) => result.url)

    console.log(`Tavily found ${urls.length} high-quality URLs for TOPIC "${query}"`)
    return urls
  } catch (error) {
    console.error(`Tavily search error for TOPIC "${query}":`, error)
    return []
  }
}

async function findYouTubeVideo(topic: string): Promise<string | null> {
  const prompt = `
    Search for a relevant YouTube video URL for this topic. Make it specific, useful, and engaging—like something you'd recommend to a friend. Return just the URL as plain text, or "No video found" if nothing fits.
    Topic: "${topic}"
  `
  const videoUrl = await callAzureOpenAI(prompt, 100)
  console.log(`Found YouTube video: ${videoUrl}`)
  return videoUrl.trim() === "No video found" ? null : videoUrl.trim()
}

async function calculateSEOScore(content: string): Promise<number> {
  const prompt = `
    Check this content's SEO vibe (0-100)—keyword use, structure, readability, links, length—like an expert buddy sizing it up. Keep it chill and natural.
    Content: ${content.slice(0, 3000)}
    Return just the number.
  `
  const score = await callAzureOpenAI(prompt, 100)
  console.log(`Calculated SEO score: ${score}`)
  return Number(score) || 50
}

// Fix for extractHeadings function (line error in the for loop)
async function extractHeadings(content: string): Promise<string[]> {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
  const headings: string[] = []
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^(#{1,6})\s+.+/)) {
      const match = lines[i].match(/^(#{1,6})\s+(.+)/)
      if (match) headings.push(match[2])
    }
  }
  console.log(`Extracted headings: ${JSON.stringify(headings)}`)
  return headings.sort((a, b) => {
    const levelA = (content.match(new RegExp(`^#{1,6}\\s+${a}`)) || [])[0]?.match(/^#+/)?.[0].length || 1
    const levelB = (content.match(new RegExp(`^#{1,6}\\s+${b}`)) || [])[0]?.match(/^#+/)?.[0].length || 1
    return levelA - levelB
  })
}

// Enhanced keyword extraction with relevance scores
async function extractKeywords(
  content: string,
  topic: string,
): Promise<{ keyword: string; difficulty: string; relevance: number }[]> {
  const prompt = `
    Pull 8 key SEO keywords from this content tied to "${topic}". For each keyword:
    1. Give a difficulty score ("Low", "Medium", "High")
    2. Assign a relevance score (1-10) based on how central it is to the content
    3. Focus on specific, actionable keywords people actually search for
    
    Like you're hyping a friend—no AI jargon, just real talk. Avoid repeats from generic blog lists.
    Content: ${content.slice(0, 3000)}
    Return JSON: [{"keyword": "term", "difficulty": "score", "relevance": number}, ...]
  `
  const response = await callAzureOpenAI(prompt, 300)
  const cleanedResponse = response.replace(/```json\n?|\n?```/g, "").trim()
  try {
    const keywords = (JSON.parse(cleanedResponse) as { keyword: string; difficulty: string; relevance: number }[]) || []
    console.log(`Extracted keywords with relevance: ${JSON.stringify(keywords)}`)
    return keywords
  } catch (error) {
    console.error("Error extracting keywords:", error)
    return []
  }
}

async function factCheckContent(content: string, sources: string[]): Promise<string> {
  const prompt = `
    Fact-check this blog content against these sources. Fix any shaky bits to match the truth or call 'em out if they're off. Keep it natural, like a friend double-checking your work. Preserve every single word—do not shorten or remove content, only add clarifications or corrections as extra text if needed. Ensure the content remains in Markdown format with no HTML or bolding, following these rules exactly as in formatUtils.convertMarkdownToHtml:
    - H1 (#): text-5xl font-bold
    - H2 (##): text-4xl font-bold
    - H3 (###): text-3xl font-bold
    - Paragraphs: text-gray-700 leading-relaxed, no bolding, with blank lines between (use \n\n)
    - Lists: Use - or * for bullets, ml-2 list-disc, with blank lines between items (use \n\n)
    - Links: [text](url), text-blue-600 hover:underline
    Content: "${content}"
    Sources: ${sources.join(", ")}
  `
  const factCheckedContent = await callAzureOpenAI(prompt, 16384)
  console.log(`Fact-checked content (first 200 chars): ${factCheckedContent.slice(0, 200)}...`)
  return factCheckedContent
    .replace(/<[^>]+>/g, "")
    .replace(/\*\*(.*?)\*\*/g, "- $1\n\n")
    .replace(/\n{1,}/g, "\n\n")
    .trim()
}

// Enhance the humanizeContent function for more natural, conversational tone
async function humanizeContent(content: string, coreTopic: string): Promise<string> {
  console.log(`🔥 DEEP HUMANIZING content for topic: ${coreTopic}`)

  // Generate a dynamic intro with more personality
  const introPrompt = `
    Create a unique, conversational intro hook about "${coreTopic}" that sounds like a real person talking.
    Make it casual, slightly edgy, and authentic - like someone chatting at a coffee shop who's passionate about this topic.
    Include some slang, maybe a personal anecdote hint, and natural speech patterns.
    Keep it under 150 characters and don't use any AI-sounding phrases or words like "unleash".
    Return just the intro text with no quotes or formatting.
  `
  const randomIntro = await callAzureOpenAI(introPrompt, 200)

  // Create a more detailed humanization prompt
  const prompt = `
    Start with this hook: "${randomIntro}". 
    
    I need you to completely transform this blog content about "${coreTopic}" into something that sounds like I'm talking to my best friend at 1 AM after a few drinks. I want REAL human vibes - messy, authentic, occasionally off-topic, with natural speech patterns.
    
    SPECIAL REQUIREMENT:
    - The blog should primarily focus on the main topic (${coreTopic}) from the scraped website
    - Occasionally mix in related topics or tangents that feel natural to the conversation
    - Sometimes briefly mention other related topics in the industry to show broader knowledge
    - These tangents should always connect back to the main topic naturally
    - STRICTLY ENSURE there is NO repetitive content - each paragraph must contain unique information
    
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
    - Links: [text](url), text-blue-600 hover:underline
    - ALWAYS end with a strong, personal call-to-action paragraph
    
    Content: "${content}"
    
    Return pure content, no HTML or extra bolding, and NEVER use the word "markdown" anywhere.
    AVOID AI-FLAGGED WORDS like "unleash" or similar marketing jargon.
    STRICTLY ENSURE there is NO repetition of content within the blog post.
  `

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

  console.log(`Humanized content (first 200 chars): ${humanizedContent.slice(0, 200)}...`)

  // Clean up the humanized content
  return humanizedContent
    .replace(/<[^>]+>/g, "")
    .replace(/\*\*(.*?)\*\*/g, "- $1\n\n")
    .replace(/\n{1,}/g, "\n\n")
    .replace(/markdown/gi, "content")
    .trim()
}

// Enhance the hardcoreHumanizeContent function for even more personality
async function hardcoreHumanizeContent(content: string, coreTopic: string): Promise<string> {
  console.log(`🔥🔥 HARDCORE HUMANIZING content for topic: ${coreTopic}`)

  // Generate a dynamic hardcore intro
  const introPrompt = `
    Create a single, unique, EDGY intro hook about "${coreTopic}" that sounds like someone who's had a few drinks.
    Make it raw, uncensored, and authentic - with some mild swearing and attitude.
    Include slang, strong opinions, and natural speech patterns with interruptions.
    Keep it under 150 characters and don't use any AI-sounding phrases or words like "unleash".
    Return just the intro text with no quotes or formatting.
  `
  const randomIntro = await callAzureOpenAI(introPrompt, 200)

  const prompt = `
    Start with this hook: "${randomIntro}". 
    
    I need you to completely transform this blog content about "${coreTopic}" into something that sounds like I'm RANTING to my closest friend at 3 AM after WAY too many drinks. I want EXTREMELY AUTHENTIC human vibes - messy, raw, occasionally profane, with natural speech patterns.
    
    SPECIAL REQUIREMENT:
    - The blog should primarily focus on the main topic (${coreTopic}) from the scraped website
    - Occasionally go on tangents about related topics that would naturally come up in a drunk conversation
    - Sometimes compare the main topic to other things in the industry with strong opinions
    - These tangents should feel natural and eventually connect back to the main topic
    - ABSOLUTELY NO REPETITIVE CONTENT - each paragraph must contain unique information
    
    HARDCORE HUMANIZATION REQUIREMENTS:
    1. Add personal anecdotes that feel genuine and slightly chaotic
    2. Include casual phrases like "listen up", "I'm not even kidding", "you know what bugs me about this?"
    3. Add tangents that sometimes take a while to circle back to the main point
    4. Use contractions, slang, and conversational grammar with occasional mistakes
    5. Include rhetorical questions and then answer them yourself
    6. Add humor, personality, and mild profanity throughout
    7. Vary sentence length dramatically - mix short punchy sentences with longer rambling ones
    8. Include self-corrections like "wait, that's wrong" or "actually, scratch that"
    9. Add emphasis words like "literally", "absolutely", "seriously", "honestly"
    10. Include 3-5 strong personal opinions that sound authentic and passionate
    11. Add phrases like "this person at the gas station told me..." or "I forgot this part earlier"
    
    KEEP ALL THESE INTACT:
    - The H1 title (# Title)
    - All H2 headings (## Heading)
    - All H3 subheadings (### Subheading)
    - All bullet points and lists (but make them compact with minimal indentation)
    - All links and references
    - The overall structure and information
    
    FORMAT REQUIREMENTS:
    - H1 (#): text-5xl font-bold
    - H2 (##): text-4xl font-bold
    - H3 (###): text-3xl font-bold
    - Paragraphs: text-gray-700 leading-relaxed, no bolding, blank lines between (use \n\n)
    - Lists: Use bullet points with minimal indentation, compact spacing
    - Links: [text](url), text-blue-600 hover:underline
    - ALWAYS end with a hardcore call-to-action that pushes the reader to take action NOW
    
    Content: "${content}"
    
    Return pure content only—no HTML, no AI flags, total chaos, and NEVER use the word "markdown" anywhere.
    AVOID AI-FLAGGED WORDS like "unleash" or similar marketing jargon.
    STRICTLY ENSURE there is NO repetition of content within the blog post.
  `

  // Process in chunks if content is very large
  let hardcoreContent = ""
  if (content.length > 10000) {
    console.log("Content too large, processing in chunks...")
    const chunks = splitContentIntoChunks(content, 8000)
    const humanizedChunks = await Promise.all(
      chunks.map(async (chunk, index) => {
        console.log(`Processing hardcore chunk ${index + 1} of ${chunks.length}`)
        const chunkPrompt = prompt.replace('Content: "${content}"', `Content: "${chunk}"`)
        const result = await callAzureOpenAI(chunkPrompt, 16384)
        return result
          .replace(/<[^>]+>/g, "")
          .replace(/\*\*(.*?)\*\*/g, "- $1\n\n")
          .replace(/markdown/gi, "content")
          .trim()
      }),
    )
    hardcoreContent = humanizedChunks.join("\n\n")
  } else {
    hardcoreContent = await callAzureOpenAI(prompt, 16384)
  }

  console.log(`Hardcore humanized (first 200): ${hardcoreContent.slice(0, 200)}...`)

  // Clean up and enhance the hardcore content
  return hardcoreContent
    .replace(/<[^>]+>/g, "")
    .replace(/\*\*(.*?)\*\*/g, "- $1\n\n")
    .replace(/\n{1,}/g, "\n\n")
    .replace(/yes/gi, "hell yeah")
    .replace(/in summary/gi, "anyway")
    .replace(/indeed/gi, "for real")
    .replace(/markdown/gi, "content")
    .trim()
}

// Update the formatContentWithOpenAI function to better handle content mixing
async function formatContentWithOpenAI(content: string, topic: string, title: string): Promise<string> {
  const prompt = `
    Reformat this blog content about "${topic}" with the title "${title}" to be well-structured and readable.
    
    SPECIAL REQUIREMENT:
    - The blog should primarily focus on the main topic from the scraped website
    - Preserve any natural tangents or related topics that were included
    - Ensure all content flows naturally and transitions smoothly
    - STRICTLY ENSURE there is NO repetitive content - each paragraph must contain unique information
    
    IMPORTANT REQUIREMENTS:
    - Target word count: 2000-2500 words total
    - Use varied sentence structures and transitions
    - Include specific examples and data points
    - Make each section distinct with its own focus
    
    Ensure it includes:
    - Clear headings and subheadings (make them bold and slightly larger)
    - Paragraphs with proper spacing (not too much space between paragraphs)
    - Bullet points and lists with minimal indentation and compact spacing
    - A strong introduction and conclusion
    - Proper citations and references
    - No HTML or bolding
    - Use markdown format
    
    Content: ${content}
  `
  const formattedContent = await callAzureOpenAI(prompt, 16384)
  return formattedContent.trim()
}

function splitContentIntoChunks(content: string, chunkSize: number): string[] {
  const chunks: string[] = []
  for (let i = 0; i < content.length; i += chunkSize) {
    chunks.push(content.slice(i, i + chunkSize))
  }
  return chunks
}

// Helper function to count words in a string
function countWords(str: string): number {
  const words = str.trim().split(/\s+/)
  return words.length
}

// UPDATED: Modified generateEnhancedTitle function to create simple titles without how, when, why patterns
async function generateEnhancedTitle(
  coreTopic: string,
  userId: string,
  scrapedData: ScrapedData,
  supabase: any,
): Promise<string> {
  console.log(`Generating eye-catching titles for topic: ${coreTopic}`)

  // Generate multiple title options
  const prompt = `
    Create 5 different eye-catching titles for a blog post about "${coreTopic}".
    
    TITLE REQUIREMENTS:
    - Each title must be ONLY 5-7 words maximum
    - DO NOT start with "How", "Why", "When", "Where", "What"
    - DO NOT use numbers like "5 Ways..." or similar patterns
    - DO NOT use colons (:) in the title
    - Make them EXTREMELY eye-catching and attention-grabbing
    - Use powerful, emotional, and engaging language
    - Each title should be completely different from the others
    - Each word should be simple and easy to understand
    - AVOID AI-flagged words like "unleash", "revolutionize", "transform", etc.
    - Make them sound completely human and natural
    - Ensure they would make someone want to click and read
    
    Based on this scraped data:
    - Initial Research: ${scrapedData.initialResearchSummary.slice(0, 200)}...
    - Keywords: ${scrapedData.extractedKeywords
      .slice(0, 3)
      .map((k) => k.keyword)
      .join(", ")}
    
    Return a JSON array of 5 different title options, e.g., ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5"]
  `

  const titlesResponse = await callAzureOpenAI(prompt, 300)
  let titleOptions: string[] = []

  try {
    // Parse the JSON response
    const cleanedResponse = titlesResponse.replace(/```json\n?|\n?```/g, "").trim()
    titleOptions = JSON.parse(cleanedResponse)

    // Ensure we have at least one title
    if (!titleOptions || !titleOptions.length) {
      throw new Error("No title options generated")
    }

    console.log(`Generated ${titleOptions.length} title options:`)
    titleOptions.forEach((title, i) => console.log(`${i + 1}. ${title}`))

    // Now select the best title based on engagement potential
    const selectionPrompt = `
      From these ${titleOptions.length} blog post titles about "${coreTopic}", select the ONE that is most eye-catching, 
      engaging, and likely to get clicks. Consider uniqueness, emotional appeal, and clarity.
      
      Titles:
      ${titleOptions.map((t, i) => `${i + 1}. ${t}`).join("\n")}
      
      Return ONLY the number of the best title (1-${titleOptions.length}).
    `

    const selection = await callAzureOpenAI(selectionPrompt, 50)
    const selectedIndex = Number.parseInt(selection.trim()) - 1

    // Validate the selection
    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= titleOptions.length) {
      // Default to the first title if selection is invalid
      console.log(`Invalid selection, defaulting to first title option`)
      return titleOptions[0]
    }

    const selectedTitle = titleOptions[selectedIndex]
    console.log(`Selected title #${selectedIndex + 1}: "${selectedTitle}"`)

    // Ensure the title is within the word count limit
    const words = selectedTitle.trim().split(/\s+/)
    if (words.length > 7) {
      // Truncate to 7 words if too long
      return words.slice(0, 7).join(" ")
    }

    return selectedTitle.trim()
  } catch (error) {
    console.error("Error generating or selecting titles:", error)

    // Fallback to a simpler title generation if the complex approach fails
    const fallbackPrompt = `
      Create a short, eye-catching title for a blog post about "${coreTopic}".
      Keep it under 7 words, make it engaging, and avoid starting with How/Why/What.
      Return just the title as plain text.
    `
    const fallbackTitle = await callAzureOpenAI(fallbackPrompt, 100)
    console.log(`Using fallback title: ${fallbackTitle}`)

    // Ensure the fallback title is within the word count limit
    const words = fallbackTitle.trim().split(/\s+/)
    if (words.length > 7) {
      return words.slice(0, 7).join(" ")
    }

    return fallbackTitle.trim()
  }
}

// Update the removeRepetitiveContent function to be much more aggressive
async function removeRepetitiveContent(content: string, topic: string): Promise<string> {
  console.log("Aggressively checking and removing any repetitive content...")

  const prompt = `
  Analyze this blog post about "${topic}" and identify ANY repetitive content or redundant sections.
  
  CRITICAL REQUIREMENTS:
  - Identify ANY paragraphs that repeat similar information, even if worded differently
  - Identify ANY sections with overlapping content or ideas
  - Pay special attention to repeated concepts, examples, or explanations
  - Keep ONLY the most comprehensive version of any duplicated information
  - Ensure the content flows naturally after removing repetition
  - Do NOT remove unique information
  - Maintain all headings, subheadings, and structure
  - STRICTLY ENSURE there is ABSOLUTELY NO repetitive content in the final output
  - Be EXTREMELY thorough - this is the most important requirement
  - Remove ANY unnecessary repetition, even if subtle
  
  Return the improved content with ALL repetitive parts removed and consolidated.
  
  Content: ${content}
`

  try {
    const deduplicatedContent = await callAzureOpenAI(prompt, 16384)
    console.log(
      `Aggressively checked for repetitive content (first 200 chars): ${deduplicatedContent.slice(0, 200)}...`,
    )
    return deduplicatedContent
  } catch (error: any) {
    console.error("Error removing repetitive content:", error)
    return content
  }
}

// Add a new function to ensure FAQs are properly included
async function ensureFAQsExist(content: string, topic: string): Promise<string> {
  console.log("Ensuring FAQs are properly included...")

  // Check if FAQs already exist in the content
  if (content.includes("## Frequently Asked Questions") || content.includes("## FAQ") || content.includes("## FAQs")) {
    console.log("FAQs already exist in content, ensuring they're properly formatted...")

    // Ensure the existing FAQs are properly formatted
    const faqCheckPrompt = `
      Review the FAQ section in this content about "${topic}".
      Ensure there are at least 3-5 high-quality, relevant FAQs with clear answers.
      If the FAQ section exists but is inadequate, improve it.
      If no FAQ section exists, create one with 3-5 relevant questions and answers.
      
      Content: ${content}
      
      Return the full content with proper FAQs included.
    `

    try {
      const checkedContent = await callAzureOpenAI(faqCheckPrompt, 16384)
      return checkedContent
    } catch (error) {
      console.error("Error checking existing FAQs:", error)
      // If error, generate new FAQs and append
      const newFAQs = await generateFAQs(content, topic)
      return `${content}\n\n${newFAQs}`
    }
  } else {
    console.log("No FAQs found, generating and adding them...")
    const faqs = await generateFAQs(content, topic)
    return `${content}\n\n${faqs}`
  }
}

// Enhance the generateFAQs function to create better, more relevant FAQs
async function generateFAQs(content: string, topic: string): Promise<string> {
  console.log(`Generating comprehensive FAQs for topic: ${topic}`)

  const prompt = `
    Generate 4-6 frequently asked questions (FAQs) related to the content about "${topic}".
    
    REQUIREMENTS:
    - Questions must be highly relevant to the main topic
    - Questions should address common concerns, misconceptions, or interests
    - Answers must be detailed, informative, and valuable (at least 2-3 sentences each)
    - Include a mix of basic and advanced questions
    - Format each question as a markdown heading (## Question) followed by a comprehensive answer
    - Do NOT use colons at the beginning of paragraphs in the answers
    
    Content: ${content.slice(0, 5000)}
    
    Return a complete FAQ section with 4-6 questions and detailed answers.
  `
  const faqs = await callAzureOpenAI(prompt, 16384)
  return `\n\n## Frequently Asked Questions\n\n${faqs.trim()}`
}

// Add a new function to remove colons at the beginning of paragraphs
function removeLeadingColons(content: string): string {
  // Replace patterns like ": Text" at the beginning of paragraphs with just "Text"
  return content
    .replace(/(\n|^)\s*:\s+/g, "$1") // Remove colons at the start of paragraphs
    .replace(/<p[^>]*>\s*:\s*/g, "<p>") // Remove colons at the start of HTML paragraphs
    .replace(/(<li[^>]*>)\s*:\s*/g, "$1") // Remove colons at the start of list items
    .replace(/(<blockquote[^>]*>)\s*:\s*/g, "$1") // Remove colons at the start of blockquotes
}

// UPDATED: Modified generateArticleFromScrapedData function to use our new title generation and better handle research data
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
      
      CRITICAL REQUIREMENTS:
      - Target word count: 1000-1200 words for this FIRST HALF
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
      - AVOID AI-flagged words like "unleash", "revolutionize", "transform", etc.
      
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
      Write the SECOND HALF (remaining sections and conclusion) of a comprehensive blog post about "${scrapedData.coreTopic}" with title "${simpleTitle}".
      
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
      - Research Details:
      ${formattedResearch}
      
      CRITICAL REQUIREMENTS:
      - Target word count: 1000-1200 words for this SECOND HALF (total article 2000-2400 words)
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
      
      Structure for this SECOND HALF:
      - 3-4 more H2 sections with detailed content (different from first half)
      - H3 subsections where appropriate
      - Include bullet lists and blockquotes where appropriate
      - A strong conclusion section
      - A compelling call-to-action section at the very end
      
      IMPORTANT: 
      - This is the SECOND HALF that completes the article
      - NEVER use the word "markdown" anywhere in the content
      - Use natural, conversational language
      - DO NOT repeat the title or introduction
      - ALWAYS end with a compelling call-to-action section
      - AVOID AI-flagged words like "unleash", "revolutionize", "transform", etc.
      - DO NOT include an FAQ section - that will be added separately
      
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

    // ENHANCED: Ensure FAQs are properly included
    console.log("Ensuring FAQs are properly included...")
    const contentWithFAQs = await ensureFAQsExist(deduplicatedContent, scrapedData.coreTopic)
    console.log(`Content with FAQs: ${countWords(contentWithFAQs)} words.`)

    // Add a delay to simulate natural humanization time
    console.log("Waiting 15 seconds before humanizing...")
    await new Promise((resolve) => setTimeout(resolve, 15000))

    // Humanize the content before converting to HTML
    console.log(`Deep humanizing content (level: ${humanizeLevel}) to make it sound more natural...`)
    const humanizedContent =
      humanizeLevel === "hardcore"
        ? await hardcoreHumanizeContent(contentWithFAQs, scrapedData.coreTopic)
        : await humanizeContent(contentWithFAQs, scrapedData.coreTopic)

    console.log(`Humanized content: ${countWords(humanizedContent)} words.`)

    // ENHANCED: Final check for repetition after humanization
    console.log("Final check for any remaining repetition...")
    const finalDeduplicatedContent = await removeRepetitiveContent(humanizedContent, scrapedData.coreTopic)

    // ENHANCED: Remove any leading colons from paragraphs
    console.log("Removing any leading colons from paragraphs...")
    const contentWithoutColons = removeLeadingColons(finalDeduplicatedContent)

    // Add a delay before converting to HTML
    console.log("Waiting 8 seconds before converting to HTML...")
    await new Promise((resolve) => setTimeout(resolve, 8000))

    // Convert to HTML with improved typography
    console.log("Converting to HTML with improved typography...")
    const htmlContent = formatUtils.convertMarkdownToHtml(contentWithoutColons)

    // Final check for colons in HTML content
    const finalHtmlContent = htmlContent
      .replace(/<p[^>]*>\s*:\s*/g, '<p class="text-gray-700 leading-relaxed font-normal my-2">')
      .replace(/<li[^>]*>\s*:\s*/g, '<li class="ml-2 list-disc text-gray-700">')

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

// NEW FUNCTIONS FOR IMAGE INTEGRATION

// Function to fetch stock images based on a topic
async function fetchStockImages(topic: string, count = 5): Promise<string[]> {
  try {
    // Extract more specific keywords from the topic
    const specificKeywords = topic
      .split(/\s+/)
      .filter((word) => word.length > 3) // Only use meaningful words
      .slice(0, 3) // Take up to 3 keywords
      .join(" ")

    const searchTerm = specificKeywords || topic
    console.log(`Fetching ${count} images from Unsplash for specific topic: ${searchTerm}`)

    // Use Unsplash API with your access key
    const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || "SclojCLIEhQxPsObfsaWrVhE6bIwX5hN_OOROtN57vk"

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      },
    )

    if (response.ok) {
      const data = await response.json()
      if (data.results && data.results.length > 0) {
        console.log(`Successfully fetched ${data.results.length} images from Unsplash for "${searchTerm}"`)
        return data.results.map((img: any) => img.urls.regular)
      } else {
        console.warn(`Unsplash returned no results for "${searchTerm}", trying alternative search`)

        // Try a more generic search if specific topic returns no results
        const altResponse = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(topic)}&per_page=${count}&orientation=landscape`,
          {
            headers: {
              Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
          },
        )

        if (altResponse.ok) {
          const altData = await altResponse.json()
          if (altData.results && altData.results.length > 0) {
            console.log(`Successfully fetched ${altData.results.length} images from Unsplash with alternative search`)
            return altData.results.map((img: any) => img.urls.regular)
          }
        }
      }
    } else {
      console.error(`Unsplash API error: ${response.status} - ${response.statusText}`)
    }

    // If Unsplash fails, use public domain images from Pexels without API key
    // Note: This is a fallback that may not work reliably without an API key
    try {
      console.log("Trying to fetch public images without API key as fallback")
      const publicImages = [
        `https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
        `https://images.pexels.com/photos/3861943/pexels-photo-3861943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
        `https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
        `https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
        `https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
      ]

      // Verify these URLs are accessible
      const validImages = await Promise.all(
        publicImages.map(async (url) => {
          try {
            const checkResponse = await fetch(url, { method: "HEAD" })
            return checkResponse.ok ? url : null
          } catch {
            return null
          }
        }),
      )

      const filteredImages = validImages.filter(Boolean) as string[]
      if (filteredImages.length > 0) {
        console.log(`Found ${filteredImages.length} public domain images as fallback`)
        return filteredImages.slice(0, count)
      }
    } catch (error) {
      console.error("Error checking public domain images:", error)
    }

    // If all else fails, use placeholder images
    console.warn("All image sources failed, using placeholder images")
    return generatePlaceholderImages(count, topic)
  } catch (error) {
    console.error("Error fetching stock images:", error)
    return generatePlaceholderImages(count, topic)
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

// Update the determineImagePlacements function to create more specific prompts
async function determineImagePlacements(
  blogContent: string,
  topic: string,
  imageCount = 5,
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
      const imageHtml = `</p><figure class="my-4"><img src="${imageUrl}" alt="${topic} image ${i + 1}" class="w-full rounded-lg" /><figcaption class="text-sm text-center text-gray-500 mt-1">${topic} - related image</figcaption></figure><p class="text-gray-700 leading-relaxed font-normal my-2">`

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
      const imageHtml = `<figure class="my-4"><img src="${imageUrl}" alt="${description}" class="w-full rounded-lg" /><figcaption class="text-sm text-center text-gray-500 mt-1">${caption}</figcaption></figure>`

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

// Update the enhanceBlogWithImages function to add an extra spacing cleanup pass
async function enhanceBlogWithImages(blogContent: string, topic: string, imageCount = 5): Promise<string> {
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
    // Improve typography for headings
    .replace(/<h1[^>]*>/g, '<h1 class="text-5xl font-bold my-4 text-gray-900">')
    .replace(/<h2[^>]*>/g, '<h2 class="text-4xl font-bold my-3 text-gray-900">')
    .replace(/<h3[^>]*>/g, '<h3 class="text-3xl font-bold my-3 text-gray-800">')
    // Improve typography for paragraphs
    .replace(/<p[^>]*>/g, '<p class="text-gray-700 leading-relaxed font-normal my-2">')
    // Improve typography for lists
    .replace(/<ul[^>]*>/g, '<ul class="my-2">')
    .replace(/<li[^>]*>/g, '<li class="ml-2 list-disc text-gray-700">')
    // Improve typography for figures
    .replace(/<figure[^>]*>/g, '<figure class="my-4">')
    .replace(/<figcaption[^>]*>/g, '<figcaption class="text-sm text-center text-gray-500 mt-1">')

  return finalContent
}

function generatePlaceholderImages(count: number, topic: string): string[] {
  const placeholderImages = []
  for (let i = 0; i < count; i++) {
    placeholderImages.push(`https://via.placeholder.com/800x400?text=${encodeURIComponent(topic)}+${i + 1}`)
  }
  return placeholderImages
}

// Update the scrapeWebsiteAndSaveToJson function to extract and focus on the topic better
async function scrapeWebsiteAndSaveToJson(url: string, userId: string): Promise<ScrapedData | null> {
  console.log(`Starting website scraping and TOPIC extraction for URL: ${url}`)
  const supabase = await createClient()
  const now = new Date().toISOString().split("T")[0]
  const randomNudge = Math.random().toString(36).substring(2, 7)

  try {
    // Run initial steps in parallel
    const [initialResearchSummary, brandDataResult] = await Promise.all([
      scrapeInitialUrlWithTavily(url),
      supabase.from("brand_profile").select("brand_name, description, company_taglines").eq("user_id", userId).single(),
    ])

    if (!initialResearchSummary || initialResearchSummary === "No content available") {
      throw new Error("Failed to generate initial summary")
    }

    const { data: brandData, error: brandError } = brandDataResult
    if (brandError || !brandData) {
      throw new Error(`Failed to fetch brand profile: ${brandError?.message || "No brand data"}`)
    }

    // Extract core topic with more emphasis on the broader subject
    const coreTopicPrompt = `
      Based on this content from a website, identify the MAIN TOPIC or SUBJECT MATTER that this website is about.
      Don't just repeat the website name or URL - extract the broader topic or industry that this website belongs to.
      For example, if it's a website about a specific CRM software, the topic would be "Customer Relationship Management" not just the software name.
      
      Content: ${initialResearchSummary.slice(0, 2000)}
      
      Return ONLY the main topic as a short phrase (2-5 words), nothing else.
    `

    // Generate meta description and extract core topic in parallel
    const [metaDescription, coreTopic] = await Promise.all([
      generateMetaDescription(url, initialResearchSummary),
      callAzureOpenAI(coreTopicPrompt, 100),
    ])

    console.log(`Extracted CORE TOPIC: "${coreTopic}" from website`)

    // Generate search queries focused on the topic, not just the website
    const searchQueries = await generateSearchQueries(metaDescription, coreTopic)

    // Use more search queries for better research
    const limitedQueries = searchQueries.slice(0, 5)

    // Run searches in parallel - now focused on the topic
    const searchResults = await Promise.all(limitedQueries.map(performTavilySearch))
    const allSearchUrls = [...new Set(searchResults.flat())].slice(0, 15) // Increased to 15 URLs

    // Scrape content from more URLs in parallel for better research
    const scrapingPromises = allSearchUrls.slice(0, 8).map(async (searchUrl) => {
      try {
        const content = await scrapeWithTavily(searchUrl)
        return { url: searchUrl, content, title: searchUrl }
      } catch {
        return null
      }
    })

    const researchResults = (await Promise.all(scrapingPromises)).filter(Boolean) as {
      url: string
      content: string
      title: string
    }[]

    // Generate research summary with emphasis on the topic
    const researchSummary = researchResults
      .map((result) => `Source: ${result.url}\nContent: ${result.content.slice(0, 500)}`)
      .join("\n\n")

    // Run these steps in parallel
    const [youtubeVideo, internalLinksString, existingPostsResult, extractedKeywords] = await Promise.all([
      findYouTubeVideo(coreTopic),
      callAzureOpenAI(`Extract any internal links from this content: ${initialResearchSummary.slice(0, 1000)}`, 100),
      supabase.from("blogs").select("title").eq("user_id", userId).limit(3),
      extractKeywords(initialResearchSummary, coreTopic),
    ])

    const internalLinks = internalLinksString.split(",").map((link) => link.trim())
    const { data: existingPosts } = existingPostsResult
    const pastTitles = existingPosts ? existingPosts.map((blog: any) => blog.title).join(", ") : "None"

    // Brand info
    const brandInfo = `${brandData.brand_name || "Unnamed"} - ${brandData.description || "No description"} - Taglines: ${
      Array.isArray(brandData.company_taglines)
        ? brandData.company_taglines.join(", ")
        : brandData.company_taglines || "None"
    }`

    // NEW: Create a ScrapedData object to save to JSON
    const scrapedData: ScrapedData = {
      initialUrl: url,
      initialResearchSummary,
      researchResults,
      researchSummary,
      coreTopic,
      brandInfo,
      youtubeVideo,
      internalLinks,
      references: allSearchUrls,
      existingPosts: pastTitles,
      targetKeywords: [],
      timestamp: now,
      nudge: randomNudge,
      extractedKeywords: extractedKeywords.map((k) => ({
        keyword: k.keyword,
        relevance: k.relevance || 5,
      })),
    }

    // Function to save scraped data to a JSON file
    async function saveScrapedDataToJson(data: ScrapedData, userId: string): Promise<string> {
      const fileName = `scraped_data_${userId}_${Date.now()}.json`
      const filePath = path.join(process.cwd(), "tmp", fileName) // Ensure 'tmp' directory exists

      try {
        // Ensure the 'tmp' directory exists
        await fs.mkdir(path.join(process.cwd(), "tmp"), { recursive: true })

        // Write the data to the file
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
        console.log(`Scraped data saved to ${filePath}`)
        return filePath
      } catch (error: any) {
        console.error(`Error saving scraped data to JSON: ${error.message}`)
        throw error // Re-throw the error to be caught by the calling function
      }
    }

    // Save the scraped data to a JSON file
    const jsonFilePath = await saveScrapedDataToJson(scrapedData, userId)
    console.log(`Saved scraped data to JSON file: ${jsonFilePath}`)

    return scrapedData
  } catch (error: any) {
    console.error(`Error in website scraping and data extraction: ${error.message}`)
    return null
  }
}

// Main function to generate blogs sequentially
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
    // Only reformat posts that need it, not all posts
    console.log(`Checking for posts that need reformatting for user ${userId}`)
    await reformatExistingPosts(supabase, userId)

    // Get existing posts to check for content similarity
    const { data: existingPosts } = await supabase
      .from("blogs")
      .select("title, blog_post")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20)

    if (existingPosts && existingPosts.length > 0) {
      existingPosts.forEach((post: any) => {
        existingTitles.push(post.title)
        // Extract text content from HTML for comparison
        const textContent = post.blog_post
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
        existingContent.push(textContent)
      })
    }

    // Continue with normal blog generation
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("plan_id, credits")
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
      pro: 60,
      professional: 60,
      basic: 30, // Map basic to starter
    }

    const maxPosts = planCreditsMap[subscription.plan_id.toLowerCase()] || 0
    if (!maxPosts) {
      throw new Error(`Invalid subscription plan: ${subscription.plan_id}`)
    }

    // Check available credits
    const availableCredits = subscription.credits !== undefined ? subscription.credits : maxPosts
    if (availableCredits <= 0) {
      throw new Error("No credits remaining to generate blog posts!")
    }

    // Calculate how many posts we can generate
    const postsToGenerate = Math.min(maxPosts, availableCredits)
    console.log(`Generating ${postsToGenerate} posts for user ${userId} - ONE AT A TIME, VERY SLOWLY`)

    // IMPORTANT CHANGE: Generate posts SEQUENTIALLY (one by one) instead of in parallel
    for (let i = 0; i < postsToGenerate; i++) {
      try {
        console.log(`\n\n========== STARTING BLOG POST ${i + 1} OF ${postsToGenerate} ==========\n\n`)

        // Add a significant delay before starting each blog post
        console.log(`Waiting 10 seconds before starting blog post ${i + 1}...`)
        await new Promise((resolve) => setTimeout(resolve, 10000))

        // First, scrape the website and save to JSON - this is done once for each post
        console.log(`🔍 Scraping website ${url} and saving to JSON for blog post ${i + 1}`)
        const scrapedData = await scrapeWebsiteAndSaveToJson(url, userId)

        if (!scrapedData) {
          throw new Error(`Failed to scrape website data for blog post ${i + 1}`)
        }

        console.log(`✅ Successfully scraped website data and saved to JSON for blog post ${i + 1}`)

        // Add a delay after scraping
        console.log(`Waiting 8 seconds after scraping for blog post ${i + 1}...`)
        await new Promise((resolve) => setTimeout(resolve, 8000))

        // Pass the scraped data to the article generation function
        console.log(`Starting content generation for blog post ${i + 1}...`)
        let result = await generateArticleFromScrapedData(scrapedData, userId, humanizeLevel)

        // Check for content similarity with existing posts
        const contentSimilarityCheck = await checkContentSimilarity(
          result.blogPost
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim(),
          existingContent,
          existingTitles,
        )

        // If content is too similar, regenerate with more diversity
        if (contentSimilarityCheck.isTooSimilar) {
          console.log(
            `⚠️ Generated content too similar to existing post "${contentSimilarityCheck.similarToTitle}". Regenerating with more diversity...`,
          )

          // Update the prompt to force more unique content
          scrapedData.nudge = `IMPORTANT: Make this content COMPLETELY DIFFERENT from your previous post about "${contentSimilarityCheck.similarToTitle}". Use different examples, structure, and approach.`

          // Regenerate the article
          result = await generateArticleFromScrapedData(scrapedData, userId, humanizeLevel)
        }

        // Extract the core topic from the blog post
        const coreTopic = result.title || "blog topic"

        // Add a delay before enhancing with images
        console.log(`Waiting 5 seconds before adding images to blog post ${i + 1}...`)
        await new Promise((resolve) => setTimeout(resolve, 5000))

        // Enhance the blog post with images
        console.log(`Enhancing blog post ${i + 1} with images related to: ${coreTopic}`)
        const enhancedBlogPost = await enhanceBlogWithImages(result.blogPost, coreTopic, 5)

        const blogId = uuidv4()
        const revealDate = new Date(firstRevealDate)
        revealDate.setDate(revealDate.getDate() + i)

        // Add a delay before saving to database
        console.log(`Waiting 3 seconds before saving blog post ${i + 1} to database...`)
        await new Promise((resolve) => setTimeout(resolve, 3000))

        // Use the enhanced blog post with images
        const blogData: BlogPost = {
          id: blogId,
          user_id: userId,
          blog_post: enhancedBlogPost, // This now includes the images
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

        // Add this post to our tracking arrays to avoid repetition in future posts
        existingTitles.push(result.title)
        existingContent.push(
          enhancedBlogPost
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim(),
        )

        console.log(`\n\n✅ COMPLETED BLOG POST ${i + 1} OF ${postsToGenerate}\n\n`)
        blogPosts.push(blogData)

        // Add a significant delay between blog posts
        if (i < postsToGenerate - 1) {
          const delaySeconds = 20
          console.log(`Waiting ${delaySeconds} seconds before starting the next blog post...`)
          await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000))
        }
      } catch (error: any) {
        console.error(`Error generating post ${i + 1}:`, error)
        console.log(`Continuing to next blog post despite error...`)
        // Continue to next post even if this one fails
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

