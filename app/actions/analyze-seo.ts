"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { cache } from "react"

// Cache the API client initialization
const getGenAI = cache(() => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set")
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
})

// Implement exponential backoff retry logic
async function retry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn()
  } catch (error: any) {
    if (retries === 0) throw error

    if (error?.status === 429) {
      // Rate limit exceeded - wait longer
      await new Promise((resolve) => setTimeout(resolve, delay))
      return retry(fn, retries - 1, delay * 2)
    }

    if (error?.status === 403) {
      throw new Error("Invalid API key or permissions. Please check your Gemini API key.")
    }

    throw error
  }
}

// Cache scraping results
const scrapeWebsite = cache(async (url: string) => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.statusText}`)
    }
    return await response.text()
  } catch (error) {
    console.error("Error scraping website:", error)
    throw new Error("Failed to scrape website. Please check the URL and try again.")
  }
})

const generateWithGemini = cache(async (prompt: string) => {
  const model = getGenAI().getGenerativeModel({ model: "gemini-pro" })
  return retry(async () => {
    const result = await model.generateContent(prompt)
    return result.response.text()
  })
})

// New function to generate compelling titles
async function generateTitles(summary: string): Promise<string> {
  const titlesPrompt = `
    As a master copywriter and SEO expert, create an extremely compelling, click-worthy, and SEO-optimized title for this content:

    ${summary}

    Requirements:
    1. Must be attention-grabbing and create curiosity
    2. Include numbers or specific benefits when relevant
    3. Use power words that trigger emotional response
    4. Keep it under 60 characters for SEO
    5. Make it impossible NOT to click
    6. Avoid clickbait - deliver on the promise
    7. Include the most relevant keyword naturally

    Format: Return ONLY the title wrapped in <h1> tags.
    Example: <h1>7 Proven Strategies That Doubled Our Conversion Rate in 30 Days</h1>
  `

  const title = await generateWithGemini(titlesPrompt)
  return title.trim()
}

// New function to generate strategic keywords
async function generateKeywords(summary: string, content: string): Promise<string[]> {
  const keywordsPrompt = `
    As an advanced SEO strategist, analyze this content and generate high-impact keywords:

    SUMMARY:
    ${summary}

    CONTENT:
    ${content}

    Requirements:
    1. Focus on high-volume, medium-competition keywords
    2. Include a mix of:
       - Primary keywords (2-3 words, high intent)
       - Long-tail keywords (4+ words, specific intent)
       - LSI keywords (semantically related)
       - Question-based keywords (what, how, why)
    3. Consider search intent (informational, commercial, transactional)
    4. Include trending industry terms
    5. Focus on keywords with clear ROI potential

    Format: Return ONLY a comma-separated list of 15 keywords, no numbering or bullets.
    Example: digital marketing strategies, how to increase conversion rate, SEO optimization techniques, ...
  `

  const keywordsText = await generateWithGemini(keywordsPrompt)
  return keywordsText
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0)
}

export async function analyzeSeo(url: string) {
  try {
    const html = await scrapeWebsite(url)

    // Initial content summary
    const summary = await generateWithGemini(`
      As an SEO expert, provide a comprehensive summary of this content in 150 words.
      Focus on the main value proposition, key benefits, and unique aspects:
      ${html}
    `)

    // Generate the perfect title first
    const titleHtml = await generateTitles(summary)
    const blogTitle = titleHtml.match(/<h1>(.*?)<\/h1>/)?.[1] || "Untitled"

    // Generate the blog content with the optimized title
    const blog = await generateWithGemini(`
      You are an elite SEO content writer and industry expert. Write a 2000-word SEO optimized blog post that will rank #1 on Google.

      TITLE: ${blogTitle}

      SUMMARY: ${summary}
      
      Requirements:
      1. Start with the title: <h1>${blogTitle}</h1>
      2. Structure for maximum readability and SEO:
         - Use H2 for main sections
         - Use H3 for subsections
         - Keep paragraphs short (2-3 sentences)
         - Include bullet points and numbered lists
      3. Write in a confident, authoritative tone
      4. Include expert insights and actionable advice
      5. Add statistical data and research when relevant
      6. Optimize for featured snippets
      7. Include a compelling call-to-action
      8. Exactly 2000 words (excluding title)

      Format: Return the complete blog post in HTML format.
    `)

    const blogContent = blog.replace(/<h1>.*?<\/h1>/, "").trim()

    // Generate strategic keywords
    const keywords = await generateKeywords(summary, blogContent)

    return {
      summary,
      blogTitle,
      blogContent,
      keywords,
    }
  } catch (error: any) {
    console.error("Error in analyzeSeo:", error)
    throw new Error(error.message || "Failed to analyze website. Please try again later.")
  }
}

