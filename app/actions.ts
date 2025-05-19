"use server"

import { tavily } from "@tavily/core"
import OpenAI from "openai"
import { createClient } from "@/utitls/supabase/server"

// Define active plan IDs
const ACTIVE_PLANS = ["free", "growth", "professional", "trial", "Enterprise"]

// Define blog post type
type BlogPost = {
  title: string
  content: string
  is_blurred: boolean
  created_at?: string
  url?: string
}

// Define GenerateBlogResult type with a unique name to avoid conflicts
export type GenerateBlogResult = {
  blogPosts: BlogPost[]
  message: string
}

export type TableOfContentsItem = {
  level: number
  text: string
  id: string
}

// Replace the existing generateExternalLinks function with this improved version
async function generateExternalLinks(
  searchResults: any[],
  researchSummary: string,
  websiteUrl: string,
): Promise<{ text: string; url: string }[]> {
  console.log("Generating diverse external links with AI enhancement...")
  const externalLinks: { text: string; url: string }[] = []
  const domain = new URL(websiteUrl).hostname
  const websiteName = domain.split(".")[0]

  // Step 1: Generate AI-powered search queries specifically for finding high-quality external links
  const linkQueries = await generateExternalLinkQueries(websiteName, domain, researchSummary)
  console.log(`Generated ${linkQueries.length} specialized queries for external link discovery`)

  // Step 2: Extract initial links from search results (exclude same domain)
  if (searchResults.length > 0) {
    console.log("Analyzing search results for high-quality external links...")
    const initialLinks: { text: string; url: string; score: number }[] = []

    searchResults.forEach((result) => {
      const url = result.url || ""
      const title = result.title || "Related Resource"
      const content = result.content || ""

      if (url && !url.includes(domain) && !initialLinks.some((link) => link.url === url)) {
        // Score the link based on various factors
        let score = 0

        // Prefer links from reputable domains
        if (url.includes(".edu") || url.includes(".gov")) score += 5
        if (url.includes("forbes.com") || url.includes("harvard") || url.includes("techcrunch")) score += 4
        if (url.includes("medium.com") || url.includes("blog.")) score += 2

        // Prefer links with comprehensive titles
        if (title.length > 30) score += 2
        if (title.includes("Guide") || title.includes("How to") || title.includes("Tutorial")) score += 2
        if (title.includes("Research") || title.includes("Study") || title.includes("Report")) score += 3
        if (title.includes("vs") || title.includes("comparison")) score += 2

        // Prefer links with substantial content
        if (content.length > 500) score += 2

        // Avoid links that seem like ads or product pages
        if (url.includes("product") || url.includes("buy") || url.includes("pricing")) score -= 2

        initialLinks.push({ text: title, url, score })
      }
    })

    // Sort by score and add top links
    initialLinks.sort((a, b) => b.score - a.score)
    initialLinks.slice(0, 5).forEach((link) => {
      externalLinks.push({ text: link.text, url: link.url })
    })

    console.log(`Added ${externalLinks.length} high-quality links from search results`)
  }

  // Step 3: Extract URLs from research summary (exclude same domain)
  const urlRegex = /(https?:\/\/[^\s<]+)/g
  const summaryUrls = researchSummary.match(urlRegex) || []
  let summaryLinksAdded = 0

  for (const url of summaryUrls) {
    if (!url.includes(domain) && !externalLinks.some((link) => link.url === url)) {
      try {
        // Try to get a better title for the link
        // FIX: Remove timeout property and use AbortController instead
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000)

        try {
          const response = await fetch(url, {
            method: "HEAD",
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          const contentType = response.headers.get("content-type") || ""

          if (contentType.includes("text/html")) {
            externalLinks.push({
              text: `${websiteName.charAt(0).toUpperCase() + websiteName.slice(1)} Industry Resource`,
              url,
            })
            summaryLinksAdded++
          }
        } catch (fetchError) {
          // If fetch fails, still add the link with a generic title
          externalLinks.push({ text: "Industry Insight", url })
          summaryLinksAdded++
        } finally {
          clearTimeout(timeoutId)
        }
      } catch (error) {
        // If fetch fails, still add the link with a generic title
        externalLinks.push({ text: "Industry Insight", url })
        summaryLinksAdded++
      }
    }
  }

  console.log(`Added ${summaryLinksAdded} links from research summary`)

  // Step 4: If we still need more links, perform targeted searches with our AI-generated queries
  if (externalLinks.length < 8) {
    console.log("Performing targeted searches for additional high-quality external links...")

    // Shuffle the queries to get different results each time
    const shuffledQueries = [...linkQueries].sort(() => Math.random() - 0.5)

    for (const query of shuffledQueries) {
      if (externalLinks.length >= 8) break

      try {
        console.log(`Searching for external links with specialized query: "${query}"`)
        const response = await tavilyClient.search(query, {
          max_results: 5,
          search_depth: "basic",
        })

        if (response.results && response.results.length > 0) {
          // Categorize the results
          const results = response.results.map((result) => {
            const url = result.url || ""
            const title = result.title || "Related Resource"
            const content = result.content || ""

            // Determine the category of this link
            let category = "General Resource"
            if (title.toLowerCase().includes("guide") || title.toLowerCase().includes("how to")) {
              category = "Guide"
            } else if (
              title.toLowerCase().includes("report") ||
              title.toLowerCase().includes("research") ||
              title.toLowerCase().includes("study")
            ) {
              category = "Research"
            } else if (title.toLowerCase().includes("case study") || title.toLowerCase().includes("example")) {
              category = "Case Study"
            } else if (title.toLowerCase().includes("tool") || title.toLowerCase().includes("software")) {
              category = "Tool"
            } else if (title.toLowerCase().includes("trend") || title.toLowerCase().includes("future")) {
              category = "Industry Trend"
            } else if (title.toLowerCase().includes("best practice") || title.toLowerCase().includes("tip")) {
              category = "Best Practice"
            }

            return { url, title, content, category }
          })

          // Filter out links from the same domain and duplicates
          const filteredResults = results.filter(
            (result) =>
              result.url && !result.url.includes(domain) && !externalLinks.some((link) => link.url === result.url),
          )

          // Group by category to ensure diversity
          const categorizedResults: Record<string, any[]> = {}
          filteredResults.forEach((result) => {
            if (!categorizedResults[result.category]) {
              categorizedResults[result.category] = []
            }
            categorizedResults[result.category].push(result)
          })

          // Take one from each category first to ensure diversity
          const categories = Object.keys(categorizedResults)
          for (const category of categories) {
            if (externalLinks.length >= 8) break

            const result = categorizedResults[category][0]
            externalLinks.push({
              text: result.title,
              url: result.url,
            })

            // Remove the used result
            categorizedResults[category].shift()
          }

          // If we still need more, take remaining results
          if (externalLinks.length < 8) {
            const remainingResults = categories.flatMap((category) => categorizedResults[category])
            for (const result of remainingResults) {
              if (externalLinks.length >= 8) break
              externalLinks.push({ text: result.title, url: result.url })
            }
          }
        }
      } catch (error) {
        console.error(`Error searching for "${query}":`, error)
      }
    }
  }

  // Step 5: Generate AI-enhanced link titles for better context
  if (externalLinks.length > 0) {
    console.log("Enhancing external link titles with AI for better context...")

    const enhancedLinks = await enhanceExternalLinkTitles(externalLinks, domain, researchSummary)
    externalLinks.splice(0, externalLinks.length, ...enhancedLinks)
  }

  // Step 6: Ensure we have at least 3 external links with fallbacks
  while (externalLinks.length < 3) {
    const fallbackLinks = [
      {
        text: `${domain.charAt(0).toUpperCase() + domain.slice(1)} Industry Guide`,
        url: "https://example.com/industry-guide",
      },
      {
        text: `Top 10 Tools for ${domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1)} Professionals`,
        url: "https://example.com/top-tools",
      },
      {
        text: `${domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1)} Best Practices`,
        url: "https://example.com/best-practices",
      },
    ]

    const nextFallback = fallbackLinks[externalLinks.length % fallbackLinks.length]
    externalLinks.push(nextFallback)
  }

  console.log(`Generated ${externalLinks.length} diverse external links`)
  return externalLinks.slice(0, 8) // Return up to 8 external links
}

// Add these new helper functions after the existing functions

// New helper function to generate diverse queries specifically for finding external links
async function generateExternalLinkQueries(
  websiteName: string,
  domain: string,
  researchSummary: string,
): Promise<string[]> {
  console.log("Generating specialized queries for external link discovery...")

  try {
    // Extract key topics from research summary
    const keyTopicsPrompt = `
      Based on this research summary about ${domain}:
      
      ${researchSummary}
      
      Extract 5-7 key topics or concepts that are most relevant to this website/business.
      Format your response as a simple comma-separated list of topics.
      Keep each topic concise (1-3 words).
      DO NOT include numbering, explanations, or any other text.
    `

    const keyTopicsResponse = await callAzureOpenAI(keyTopicsPrompt, 200, 0.7)
    const keyTopics = keyTopicsResponse
      .split(",")
      .map((topic) => topic.trim())
      .filter((topic) => topic.length > 0)

    console.log(`Extracted key topics: ${keyTopics.join(", ")}`)

    // Generate specialized search queries for finding high-quality external links
    const queryGenerationPrompt = `
      I need to find high-quality external links for a blog post about ${domain} (${websiteName}).
      
      The blog will cover these key topics:
      ${keyTopics.join(", ")}
      
      Generate 15 search queries that would help me find excellent external resources to link to.
      
      The queries should:
      1. Find authoritative guides, research, case studies, and tools related to these topics
      2. Include some queries for finding industry reports and statistics
      3. Include some queries for finding comparison articles and alternatives
      4. Include some queries for finding best practices and tutorials
      5. Include some queries for finding thought leadership content
      6. Be varied in structure (not all starting with the same words)
      7. Be specific enough to find high-quality results (not too generic)
      
      Format your response as a simple list with one query per line.
      DO NOT include numbering, explanations, or any other text.
    `

    const queriesResponse = await callAzureOpenAI(queryGenerationPrompt, 500, 0.8)

    // Parse and clean up the queries
    const queries = queriesResponse
      .split("\n")
      .map((query) => query.trim())
      .filter((query) => query.length > 0)
      .map((query) => query.replace(/^\d+\.\s*/, "")) // Remove any numbering

    // Add some domain-specific queries
    const domainQueries = [
      `${domain} industry report`,
      `${domain} vs competitors comparison`,
      `${domain} alternatives`,
      `${domain} best practices`,
      `${websiteName} case studies`,
      `${websiteName} integration tools`,
      `${domain.split(".")[0]} industry trends`,
      `${domain} expert guide`,
    ]

    // Combine and deduplicate
    const allQueries = [...new Set([...queries, ...domainQueries])]

    // Add randomization factor to ensure different results each time
    const timestamp = new Date().getTime()
    const randomizedQueries = allQueries.map((query) => {
      // Add a small random variation to about 30% of queries
      if (Math.random() < 0.3) {
        const variations = [
          `latest ${query}`,
          `${query} ${new Date().getFullYear()}`,
          `${query} guide`,
          `${query} examples`,
          `${query} research`,
        ]
        return variations[Math.floor(Math.random() * variations.length)]
      }
      return query
    })

    console.log(`Generated ${randomizedQueries.length} specialized search queries for external links`)
    return randomizedQueries
  } catch (error) {
    console.error("Error generating external link queries:", error)

    // Fallback queries if AI generation fails
    return [
      `${domain} industry report`,
      `${domain} best practices`,
      `${domain} alternatives`,
      `${domain} vs competitors`,
      `${websiteName} case studies`,
      `${domain} integration tools`,
      `${domain.split(".")[0]} industry trends`,
      `${domain} expert guide`,
      `${domain} tutorial`,
      `${domain} research paper`,
    ]
  }
}

// New helper function to enhance external link titles
async function enhanceExternalLinkTitles(
  links: { text: string; url: string }[],
  domain: string,
  researchSummary: string,
): Promise<{ text: string; url: string }[]> {
  // Skip if we have no links or too many (to save API calls)
  if (links.length === 0 || links.length > 15) {
    return links
  }

  try {
    // Prepare the links data
    const linksData = links.map((link, index) => `${index + 1}. Title: "${link.text}", URL: ${link.url}`).join("\n")

    const enhancementPrompt = `
      I have a collection of external links for a blog post about ${domain}:
      
      ${linksData}
      
      For each link, create an improved, more descriptive title that:
      1. Clearly indicates what the reader will find when clicking
      2. Uses natural, conversational language
      3. Is specific and informative (not generic)
      4. Is between 4-8 words long
      5. Relates to the topic of ${domain}
      
      Format your response as a numbered list matching the original numbering.
      ONLY include the new titles, nothing else.
    `

    const enhancedTitlesResponse = await callAzureOpenAI(enhancementPrompt, 500, 0.7)

    // Parse the enhanced titles
    const enhancedTitles = enhancedTitlesResponse
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        // Extract just the title part after any numbering
        const match = line.match(/^\d+\.\s*(.+)$/)
        return match ? match[1] : line
      })

    // Apply the enhanced titles while preserving the URLs
    const enhancedLinks = links.map((link, index) => {
      if (index < enhancedTitles.length) {
        return { text: enhancedTitles[index], url: link.url }
      }
      return link
    })

    console.log(`Enhanced ${enhancedLinks.length} external link titles`)
    return enhancedLinks
  } catch (error) {
    console.error("Error enhancing external link titles:", error)
    return links // Return original links if enhancement fails
  }
}

// Function to generate internal links for the provided websiteUrl
async function generateInternalLinks(
  websiteUrl: string,
  searchResults: any[],
): Promise<{ text: string; url: string }[]> {
  console.log("Generating internal links...")
  const internalLinks: { text: string; url: string }[] = []
  const baseUrl = new URL(websiteUrl).origin

  // Default subpages for internal links
  const defaultSubpages = [
    { text: "About Us", path: "/about" },
    { text: "Pricing Plans", path: "/pricing" },
    { text: "Contact Support", path: "/contact" },
    { text: "Blog", path: "/blog" },
    { text: "Features", path: "/features" },
  ]

  // Add default subpages
  defaultSubpages.forEach((subpage) => {
    internalLinks.push({ text: subpage.text, url: `${baseUrl}${subpage.path}` })
  })

  // Extract subpages from search results (same domain)
  if (searchResults.length > 0) {
    searchResults.forEach((result) => {
      const url = result.url || ""
      if (url.includes(baseUrl) && !url.endsWith(baseUrl) && !internalLinks.some((link) => link.url === url)) {
        const path = url.replace(baseUrl, "")
        const text = result.title || path.split("/").pop() || "Learn More"
        internalLinks.push({ text, url })
      }
    })
  }

  console.log(`Generated ${internalLinks.length} internal links`)
  return internalLinks.slice(0, 3) // Limit to 3 internal links
}

async function fetchStockImages(topic: string, count = 3): Promise<string[]> {
  try {
    const apiKey = process.env.RUNWARE_API_KEY || ""
    if (!apiKey) {
      console.error("Runware API key is missing. Please set RUNWARE_API_KEY in your environment variables.")
      return generatePlaceholderImages(count, topic)
    }

    console.log(`Generating ${count} images with Runware AI for topic: ${topic}`)

    const { Runware } = await import("@runware/sdk-js")
    const runware = new Runware({ apiKey })
    console.log(`Initializing Runware AI for image generation...`)

    // Add timeout to ensure connection doesn't hang
    const connectionPromise = runware.ensureConnection()
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), 5000))

    await Promise.race([connectionPromise, timeoutPromise])

    const enhancedPrompt = `Professional, high-quality image of ${topic}. Photorealistic, detailed, perfect lighting, 8k resolution, commercial quality.`

    const images = await runware.requestImages({
      positivePrompt: enhancedPrompt,
      negativePrompt: "blurry, low quality, distorted, watermark, text, signature, low resolution, nsfw",
      width: 1024,
      height: 768,
      model: "rundiffusion:110@101", // Using a valid model identifier
      numberResults: count,
      outputType: "URL",
      outputFormat: "PNG",
      steps: 25,
      CFGScale: 4.0,
      checkNSFW: true,
    })

    // Check if images is defined and is an array
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
      console.log("Trying with alternative model parameters...")
      const { Runware } = await import("@runware/sdk-js")

      const runware = new Runware({ apiKey })
      await runware.ensureConnection()

      const enhancedPrompt = `Professional, high-quality image of ${topic}. Photorealistic, detailed, perfect lighting, 8k resolution, commercial quality.`

      const images = await runware.requestImages({
        positivePrompt: enhancedPrompt,
        negativePrompt: "blurry, low quality, distorted, watermark, text, signature, low resolution",
        width: 1024,
        height: 768,
        model: "civitai:4201@130072", // Ensure we're using the same valid model
        numberResults: count,
        outputType: "URL",
        outputFormat: "PNG",
        steps: 20, // Reduced steps for faster generation
        CFGScale: 7.0, // Different guidance scale
        checkNSFW: true,
      })

      // Check if images is defined and is an array
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

// Add this helper function to generate placeholder images
function generatePlaceholderImages(count: number, topic: string): string[] {
  console.log(`Generating ${count} placeholder images for topic: ${topic}`)
  const images = []

  for (let i = 0; i < count; i++) {
    const encodedTopic = encodeURIComponent(topic)
    const randomSeed = Math.floor(Math.random() * 10000)

    // Try to use Unsplash source first
    try {
      const sanitizedTopic = encodedTopic.replace(/[^\w\s]/gi, "")
      images.push(`https://source.unsplash.com/featured/1024x768?${sanitizedTopic}&sig=${randomSeed}`)
    } catch (e) {
      // If that fails, use a basic placeholder
      images.push(`https://via.placeholder.com/1024x768.png?text=${encodedTopic.replace(/\s+/g, "+")}`)
    }
  }

  console.log(`Generated ${images.length} placeholder images`)
  return images
}

// Also update the fetchUnsplashImages function to be more robust:

async function fetchUnsplashImages(topic: string, count = 3): Promise<string[]> {
  try {
    console.log(`Fetching ${count} images from Unsplash for topic: ${topic}`)

    // Try to use the Unsplash API if available
    const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY
    if (unsplashAccessKey) {
      try {
        const images = []
        for (let i = 0; i < count; i++) {
          // FIX: Use AbortController for timeout instead of timeout property
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000)

          try {
            const response = await fetch(
              `https://api.unsplash.com/photos/random?query=${encodeURIComponent(topic)}&orientation=landscape&client_id=${unsplashAccessKey}`,
              { signal: controller.signal },
            )

            clearTimeout(timeoutId)

            if (response.ok) {
              const data = await response.json()
              images.push(data.urls.regular)
            } else {
              throw new Error(`Unsplash API error: ${response.status}`)
            }
          } catch (fetchError) {
            console.error("Error fetching from Unsplash API:", fetchError)
          } finally {
            clearTimeout(timeoutId)
          }
        }

        if (images.length > 0) {
          return images
        }
      } catch (unsplashError) {
        console.error("Error with Unsplash API:", unsplashError)
      }
    }

    // Fallback to source.unsplash.com if API fails or is not available
    const images = []
    for (let i = 0; i < count; i++) {
      const randomSeed = Math.floor(Math.random() * 10000)
      const sanitizedTopic = encodeURIComponent(topic.replace(/[^\w\s]/gi, ""))
      images.push(`https://source.unsplash.com/featured/1024x768?${sanitizedTopic}&sig=${randomSeed}`)
    }

    console.log(`Generated ${images.length} Unsplash image URLs`)
    return images
  } catch (error) {
    console.error("Error fetching Unsplash images:", error)

    // Ultimate fallback - return placeholder images
    return Array(count).fill("https://via.placeholder.com/1024x768.png?text=Blog+Image")
  }
}

// Generate image topics
async function generateImageTopics(blogTitle: string, researchSummary: string): Promise<string[]> {
  console.log("Generating diverse image topics based on blog content...")

  const imageTopicsPrompt = `
    Based on this blog title and research summary:
    
    BLOG TITLE:
    ${blogTitle}
    
    RESEARCH SUMMARY:
    ${researchSummary}
    
    Generate 5 specific image topics that would be perfect illustrations for this blog post.
    
    The image topics should:
    1. Be highly relevant to the blog content
    2. Be specific enough to generate good images (not too abstract)
    3. Be varied to cover different aspects of the blog
    4. Include at least one conceptual/metaphorical image idea
    5. Include at least one data visualization or chart concept
    6. Be described in 5-10 words each
    
    Format your response as a numbered list with just the image topics, one per line.
    Make each topic visually distinct from the others.
  `

  const imageTopicsResponse = await callAzureOpenAI(imageTopicsPrompt, 400, 0.8)

  const topicLines = imageTopicsResponse
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => line.replace(/^\d+[.)]\s*|[-•*]\s*/, "").trim())

  const defaultTopics = [
    `${blogTitle.split(" ").slice(0, 3).join(" ")} concept visualization`,
    `Professional in ${blogTitle.split(" ")[0]} industry with digital elements`,
    `Abstract representation of ${blogTitle.split(" ").slice(-3).join(" ")}`,
  ]

  const topics = [...topicLines]

  while (topics.length < 3) {
    topics.push(defaultTopics[topics.length])
  }

  console.log(`Generated diverse image topics: ${topics.join(", ")}`)

  return topics.slice(0, 3)
}

// Initialize clients
const TAVILY_API_KEY: string = process.env.TAVILY_API_KEY || ""
const tavilyClient = tavily({ apiKey: TAVILY_API_KEY })

const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY as string,
  baseURL: process.env.AZURE_OPENAI_API_BASE_PATH_GPT4O_MINI,
  defaultQuery: { "api-version": "2024-02-15-preview" },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY },
})

// Call Azure OpenAI
async function callAzureOpenAI(prompt: string, maxTokens: number, temperature = 0.8): Promise<string> {
  try {
    console.log(`Calling OpenAI: ${prompt.slice(0, 100)}${prompt.length > 100 ? "..." : ""}`)

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      max_tokens: maxTokens,
      temperature: temperature,
      n: 1,
    })
    const result = completion.choices[0]?.message?.content || ""
    const sanitizedResult = result.replace(/\$1/g, "").trim()
    if (sanitizedResult !== result) {
      console.warn(`Sanitized '$1' from OpenAI response: ${sanitizedResult.slice(0, 200)}...`)
    }
    return sanitizedResult
  } catch (error: any) {
    console.error("Error calling Azure OpenAI:", error.message)
    return `Fallback: Couldn't generate this part due to ${error.message}. Let's roll with what we've got!`
  }
}

// Replace the existing searchWeb function with this improved version:

// Perform web searches with dynamically generated diverse queries
async function searchWeb(websiteUrl: string): Promise<any[]> {
  console.log("Performing web searches with Tavily using AI-generated diverse queries...")

  try {
    const domain = new URL(websiteUrl).hostname
    const name = domain.split(".")[0]

    // First, get basic website info to inform our query generation
    let websiteInfo = ""
    try {
      const infoResponse = await tavilyClient.search(`what is ${domain} website about`, {
        max_results: 2,
        search_depth: "basic",
      })

      if (infoResponse.results && infoResponse.results.length > 0) {
        websiteInfo = infoResponse.results[0].content || ""
      }
    } catch (error) {
      console.log("Error getting initial website info:", error)
    }

    // Generate diverse search queries using OpenAI
    const diverseQueries = await generateDiverseSearchQueries(domain, name, websiteInfo)
    console.log(`Generated ${diverseQueries.length} diverse search queries for ${domain}`)

    // Add some fallback queries in case the generated ones aren't sufficient
    const fallbackQueries = [
      domain,
      `${domain} features`,
      `${domain} services`,
      `${domain} reviews`,
      `${domain} industry`,
      `${domain} FAQ`,
      `${domain} how to use`,
    ]

    // Combine generated and fallback queries, prioritizing the generated ones
    const allQueries = [...diverseQueries]

    // Only add fallback queries if we need more
    if (allQueries.length < 10) {
      for (const query of fallbackQueries) {
        if (!allQueries.includes(query) && allQueries.length < 15) {
          allQueries.push(query)
        }
      }
    }

    let allResults: any[] = []

    // Track successful queries to avoid redundant searches
    const successfulQueries = new Set<string>()

    for (const query of allQueries) {
      try {
        console.log(`Searching web for: "${query}"`)

        const response = await tavilyClient.search(query, {
          max_results: 5,
          search_depth: "basic",
        })

        if (response.results && response.results.length > 0) {
          console.log(`Found ${response.results.length} results for "${query}"`)
          allResults = [...allResults, ...response.results]
          successfulQueries.add(query)

          // If we have enough results, we can stop searching
          if (allResults.length >= 30) {
            console.log(`Reached sufficient results (${allResults.length}), stopping search`)
            break
          }
        }
      } catch (error) {
        console.log(`Error searching for "${query}":`, error)
      }
    }

    // Deduplicate results by URL
    const uniqueUrls = new Set<string>()
    const uniqueResults = allResults.filter((result) => {
      if (!result.url || uniqueUrls.has(result.url)) {
        return false
      }
      uniqueUrls.add(result.url)
      return true
    })

    console.log(`Total unique results found: ${uniqueResults.length} from ${successfulQueries.size} successful queries`)
    return uniqueResults
  } catch (error) {
    console.error("Error in searchWeb:", error)
    return []
  }
}

// Add this new function to generate diverse search queries
async function generateDiverseSearchQueries(domain: string, name: string, websiteInfo: string): Promise<string[]> {
  console.log("Generating diverse search queries with OpenAI...")

  const currentDate = new Date().toISOString().split("T")[0]

  const queryGenerationPrompt = `
    I need to research a website thoroughly using a search engine. The website is:
    
    Domain: ${domain}
    Name: ${name}
    
    Additional information about the website:
    ${websiteInfo || "Limited information available."}
    
    Today's date: ${currentDate}
    
    Please generate 15 DIVERSE search queries that would help me find comprehensive information about this website and its industry.
    
    The queries should:
    1. Cover different aspects of the website (features, services, reviews, competitors, industry trends, etc.)
    2. Include some specific, niche queries that might reveal unique information
    3. Include some queries about recent developments or trends in their industry
    4. Include some queries about common problems or solutions in their industry
    5. Include some queries about the target audience or customer base
    6. Include some queries about the technology or methodology they use
    7. Include some queries comparing them to competitors or alternatives
    8. Include some queries about best practices in their industry
    9. Include some queries about case studies or success stories
    10. Include some queries about pricing models or business strategies in their industry
    
    Format your response as a numbered list with ONLY the search queries, one per line.
    Each query should be concise (3-7 words) and directly usable in a search engine.
    DO NOT include explanations, just the queries themselves.
    Make each query COMPLETELY DIFFERENT from the others.
  `

  try {
    const queryResponse = await callAzureOpenAI(queryGenerationPrompt, 800, 0.9)

    // Parse the response to extract the queries
    const queryLines = queryResponse
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => line.replace(/^\d+[.)]\s*/, "").trim()) // Remove numbering

    // Filter out any lines that are too long or too short
    const validQueries = queryLines
      .filter((query) => query.length >= 3 && query.length <= 100)
      .filter((query) => !query.startsWith("http"))
      .map((query) => {
        // Ensure the domain is included in at least half the queries
        if (!query.toLowerCase().includes(domain.toLowerCase()) && Math.random() > 0.5) {
          return `${domain} ${query}`
        }
        return query
      })

    // Add some domain-specific queries if we don't have enough
    if (validQueries.length < 5) {
      validQueries.push(domain)
      validQueries.push(`${domain} reviews`)
      validQueries.push(`${domain} alternatives`)
      validQueries.push(`${domain} pricing`)
      validQueries.push(`${domain} how to use`)
    }

    console.log(`Generated ${validQueries.length} valid search queries`)
    return validQueries
  } catch (error) {
    console.error("Error generating search queries:", error)
    // Return some basic queries as fallback
    return [
      domain,
      `${domain} reviews`,
      `${domain} features`,
      `${domain} alternatives`,
      `${domain} industry`,
      `${name} company information`,
      `${domain} use cases`,
    ]
  }
}

// Analyze website
async function analyzeWebsite(websiteUrl: string): Promise<string> {
  try {
    const url = new URL(websiteUrl)
    const domain = url.hostname
    const name = domain.split(".")[0]

    try {
      console.log(`Searching for basic info about: ${domain}`)
      const response = await tavilyClient.search(`what is ${domain} website about`, {
        max_results: 3,
        search_depth: "basic",
      })

      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        return `
Website: ${websiteUrl}
Domain: ${domain}
Name: ${name}
Description: ${result.content || "No description available"}
        `
      }
    } catch (error) {
      console.log("Error getting website info:", error)
    }

    return `
Website: ${websiteUrl}
Domain: ${domain}
Name: ${name}
    `
  } catch (error) {
    console.error("Error analyzing website:", error)
    return `
Website: ${websiteUrl}
    `
  }
}

// Generate data-driven title
async function generateDataDrivenTitle(websiteInfo: string, researchSummary: string): Promise<string> {
  console.log("Generating diverse data-driven title...")

  const titlePrompt = `
    Based on this website information and research summary:
    
    WEBSITE INFO:
    ${websiteInfo}
    
    RESEARCH SUMMARY:
    ${researchSummary}
    
    Create 10 COMPLETELY DIFFERENT catchy, clickable blog post titles that follow these formats:
    1. "How to..." (e.g., "How to Boost Sales by 47% in 3 Weeks")
    2. "What..." (e.g., "What 92% of Leaders Know About Growth")
    3. "When..." (e.g., "When to Pivot to Save 30% on Costs")
    4. "Where to..." (e.g., "Where to Find 5 Hidden Market Gaps")
    5. "Why..." (e.g., "Why 73% Fail and How to Win Big")
    6. "X Ways to..." (e.g., "7 Ways to Double Your ROI This Quarter")
    7. "The Ultimate Guide to..." (e.g., "The Ultimate Guide to Scaling Your Business")
    8. "X Secrets of..." (e.g., "5 Secrets of Top-Performing Teams")
    9. "X Mistakes That..." (e.g., "3 Mistakes That Cost You Customers")
    10. "X Strategies for..." (e.g., "6 Strategies for Dominating Your Market")
    
    Each title must:
    - Follow a DIFFERENT format from the list above (use all 10 formats)
    - Include specific, data-driven numbers (e.g., percentages, timeframes, counts) derived from or inspired by the research summary
    - Use COMPLETELY DIFFERENT topics, numbers, and angles for each title
    - Be highly clickable, emotionally engaging, and intriguing
    - Sound 100% human-written, conversational, and authentic
    - Be relevant to the website's industry and audience
    - Be between 40-60 characters long (including spaces)
    - Avoid generic phrases like "proven strategies" or "maximize results"
    
    Format your response as a numbered list of just the titles.
  `

  const titlesResponse = await callAzureOpenAI(titlePrompt, 800, 0.95)

  const titleLines = titlesResponse.split("\n").filter((line) => line.trim().length > 0)

  if (titleLines.length === 0) {
    // Fallback if no titles were generated
    return "How to Transform Your Business with Proven Strategies"
  }

  // Ensure we have at least 5 different titles to choose from
  if (titleLines.length < 5) {
    console.log("Not enough title variety generated, adding fallback titles...")

    const domain = websiteInfo.includes("Domain:")
      ? websiteInfo.split("Domain:")[1]?.split("\n")[0]?.trim()
      : "your business"

    titleLines.push(`How to Grow ${domain} by 35% in 60 Days`)
    titleLines.push(`7 Ways to Double Your ${domain} Results`)
    titleLines.push(`Why 68% of ${domain} Strategies Fail (And How to Win)`)
    titleLines.push(`What Top 10% of ${domain} Experts Know`)
    titleLines.push(`5 Data-Driven Ways to Revolutionize Your Approach`)
  }

  // Instead of selecting a random title, let's ensure we get variety by selecting from different formats
  // Define the format patterns to look for
  const formatPatterns = [
    /^How to/i,
    /^What/i,
    /^When/i,
    /^Where/i,
    /^Why/i,
    /^\d+\s+Ways/i,
    /^The Ultimate Guide/i,
    /^\d+\s+Secrets/i,
    /^\d+\s+Mistakes/i,
    /^\d+\s+Strategies/i,
  ]

  // Try to find a title that matches one of our desired formats
  let selectedTitle = ""

  // First try to find titles that start with our desired formats
  for (const pattern of formatPatterns) {
    const matchingTitles = titleLines.filter((title) => pattern.test(title))
    if (matchingTitles.length > 0) {
      // Select a random title from the matching ones
      selectedTitle = matchingTitles[Math.floor(Math.random() * matchingTitles.length)]
      break
    }
  }

  // If no matching title was found, fall back to a random selection
  if (!selectedTitle) {
    const randomIndex = Math.floor(Math.random() * titleLines.length)
    selectedTitle = titleLines[randomIndex]
  }

  // Clean up the title
  selectedTitle = selectedTitle.replace(/^\d+[.)]\s*|[-•*]\s*/, "").trim()

  console.log(`Generated diverse title: ${selectedTitle}`)
  return selectedTitle
}

// Generate FAQs
async function generateFAQs(websiteInfo: string, researchSummary: string): Promise<string> {
  console.log("Generating FAQs...")

  const faqPrompt = `
    Based on this website information and research summary:
    
    WEBSITE INFO:
    ${websiteInfo}
    
    RESEARCH SUMMARY:
    ${researchSummary}
    
    Create a set of 5-7 frequently asked questions (FAQs) with detailed answers specifically about this website/app.
    
    The FAQs should:
    1. Address common questions users might have about this specific website/app
    2. Cover features, benefits, how to use it, pricing, etc.
    3. Provide helpful, informative answers (3-5 sentences each)
    4. Be based on the actual information available about the website
    5. Acknowledge information gaps rather than making up details
    
    Format the FAQs as:
    
    **FAQ Section**
    
    **Q1: [Question]**
    [Detailed answer]
    
    **Q2: [Question]**
    [Detailed answer]
    
    And so on.
    
    Make the questions and answers sound natural and helpful.
  `

  const faqs = await callAzureOpenAI(faqPrompt, 1500, 0.8)
  return faqs
}

// Generate first half of blog content with direct links
async function generateFirstHalf(
  blogTitle: string,
  researchSummary: string,
  websiteUrl: string,
  externalLinks: { text: string; url: string }[],
  internalLinks: { text: string; url: string }[],
): Promise<string> {
  console.log("Generating first half of blog content with direct links...")

  // Ensure we have enough links
  while (externalLinks.length < 2) {
    externalLinks.push({
      text: `Industry Resource ${externalLinks.length + 1}`,
      url: "https://example.com/resource",
    })
  }

  while (internalLinks.length < 2) {
    internalLinks.push({
      text: `${new URL(websiteUrl).hostname} Page ${internalLinks.length + 1}`,
      url: `${websiteUrl}/${internalLinks.length + 1}`,
    })
  }

  const firstHalfPrompt = `
    I'm a professional content writer working on a blog post for ${websiteUrl}. My marketing consultant gave me this research:
    
    "${researchSummary}"
    
    Now I need to write the first half of a 1500-word blog post with this title:
    
    ${blogTitle}
    
    For this first half (approximately 750 words), include:
    1. A personal introduction that hooks the reader
    2. The first 2-3 main sections with clear headings
    3. Include these two external links naturally in the text:
       - Link 1: <a href="${externalLinks[0].url}" class="external-link" style="color: #0066cc; text-decoration: underline; font-weight: 500;">${externalLinks[0].text}</a>
       - Link 2: <a href="${externalLinks[1].url}" class="external-link" style="color: #0066cc; text-decoration: underline; font-weight: 500;">${externalLinks[1].text}</a>
    4. Include these two internal links naturally in the text:
       - Link 1: <a href="${internalLinks[0].url}" class="internal-link" style="color: #2e7d32; text-decoration: underline; font-weight: 500;">${internalLinks[0].text}</a>
       - Link 2: <a href="${internalLinks[1].url}" class="internal-link" style="color: #2e7d32; text-decoration: underline; font-weight: 500;">${internalLinks[1].text}</a>
    
    IMPORTANT FORMATTING INSTRUCTIONS:
    - Make all headings bold by surrounding them with ** (e.g., **Heading**)
    - Use proper numbered lists (1., 2., 3.) and bullet points (-)
    - Don't use markdown symbols like # or ### for headings
    - Use bold text for important points and key phrases
    - Ensure proper paragraph breaks for readability
    - Include the HTML link tags exactly as provided above, integrated naturally into sentences
    
    The tone should be conversational, helpful, and show personality - like an experienced blogger who really knows this industry. 
    Include humor, rhetorical questions, and varied sentence structures to make it feel authentic.
    Be specific to this website and industry - don't make up generic information.
    If you don't have enough information about something, acknowledge that gap rather than inventing details.
  `

  const firstHalf = await callAzureOpenAI(firstHalfPrompt, 1500, 0.8)
  return firstHalf
}

// Generate second half of blog content with direct links
async function generateSecondHalf(
  blogTitle: string,
  researchSummary: string,
  firstHalf: string,
  websiteUrl: string,
  externalLinks: { text: string; url: string }[],
  internalLinks: { text: string; url: string }[],
): Promise<string> {
  console.log("Generating second half of blog content with direct links...")

  // Ensure we have enough links
  if (externalLinks.length < 3) {
    externalLinks.push({
      text: `Industry Resource ${externalLinks.length + 1}`,
      url: "https://example.com/resource",
    })
  }

  if (internalLinks.length < 3) {
    internalLinks.push({
      text: `${new URL(websiteUrl).hostname} Page ${internalLinks.length + 1}`,
      url: `${websiteUrl}/${internalLinks.length + 1}`,
    })
  }

  const secondHalfPrompt = `
    I'm continuing to write a blog post for ${websiteUrl} with the title:
    
    ${blogTitle}
    
    Here's the first half of the blog post I've already written:
    
    "${firstHalf}"
    
    Now I need to write the second half (approximately 750 words) to complete the 1500-word blog post. Include:
    1. The remaining 2-3 main sections with clear headings
    2. A personal anecdote or case study
    3. A strong conclusion with a call-to-action
    4. Include this external link naturally in the text:
       - <a href="${externalLinks[2].url}" class="external-link" style="color: #0066cc; text-decoration: underline; font-weight: 500;">${externalLinks[2].text}</a>
    5. Include this internal link naturally in the text:
       - <a href="${internalLinks[2].url}" class="internal-link" style="color: #2e7d32; text-decoration: underline; font-weight: 500;">${internalLinks[2].text}</a>
    
    IMPORTANT FORMATTING INSTRUCTIONS:
    - Make all headings bold by surrounding them with ** (e.g., **Heading**)
    - Use proper numbered lists (1., 2., 3.) and bullet points (-)
    - Don't use markdown symbols like # or ### for headings
    - Use bold text for important points and key phrases
    - Ensure proper paragraph breaks for readability
    - Include the HTML link tags exactly as they appear in the original text, integrated naturally into sentences
    - Make sure the conclusion is clearly marked with a bold heading like **Conclusion**
    
    Continue with the same conversational, helpful tone established in the first half.
    Be specific to this website and industry - don't make up generic information.
    Here's the research summary again for reference:
    "${researchSummary}"
  `

  const secondHalf = await callAzureOpenAI(secondHalfPrompt, 1500, 0.8)
  return secondHalf
}

// Modified finalHumanization function without placeholder replacement
async function finalHumanization(
  content: string,
  faqs: string,
  imageUrls: string[],
  blogTitle: string,
): Promise<string> {
  console.log("Performing final humanization of content with images...")

  // First, ensure the FAQ section is properly formatted and has a clear separator
  const formattedFaqs = faqs.trim().startsWith("**FAQ") ? faqs : `**FAQ Section**\n\n${faqs}`

  // Add a clear separator before FAQs to help preserve them
  const combinedContent = `${content}\n\n---FAQ_SECTION_MARKER---\n\n${formattedFaqs}`

  const humanizationPrompt = `
    I have a blog post with FAQs that needs to be transformed into 100% human-written content. Here's the current version:

    ${combinedContent}

    Please rewrite this to make it completely indistinguishable from content written by a human expert. Make these specific changes:
    
    1. Vary sentence structure dramatically - mix very short sentences with medium and longer ones
    2. Add personal anecdotes and first-hand experiences that feel authentic
    3. Include some casual asides and parenthetical thoughts
    4. Add some imperfections like starting sentences with "And" or "But"
    5. Include some self-references like "In my experience..." or "I've found that..."
    6. Add some humor and personality that feels genuine
    7. Include some specific, detailed examples that feel like real-world experiences
    8. Use contractions, slang, and informal language where appropriate
    9. Add some rhetorical questions directed at the reader
    10. Maintain the same headings and overall structure, but make the writing flow more naturally

    IMPORTANT FORMATTING INSTRUCTIONS:
    - Preserve all bold text formatting (text between ** marks)
    - Preserve all numbered lists and bullet points
    - Preserve all headings but remove any ### markdown symbols
    - Make sure headings are properly formatted as bold text
    - Ensure proper paragraph breaks for readability
    - CRITICAL: DO NOT MODIFY THE FAQ SECTION AFTER THE "---FAQ_SECTION_MARKER---" LINE. KEEP IT EXACTLY AS IS.
    - PRESERVE ALL HTML LINKS EXACTLY AS THEY APPEAR IN THE ORIGINAL TEXT

    The goal is to make this content pass as 100% human-written, even under careful scrutiny by content experts.
  `

  // First, get the initial humanized content
  let initialHumanizedContent = await callAzureOpenAI(humanizationPrompt, 3000, 0.95)

  // Split the content at the FAQ marker to ensure we preserve the FAQ section
  const [humanizedMainContent, preservedFaqs] = initialHumanizedContent.split("---FAQ_SECTION_MARKER---")

  // If the FAQ section was lost or truncated, use the original FAQs
  const faqSection = preservedFaqs?.trim() || formattedFaqs

  // Recombine with the proper FAQ section
  initialHumanizedContent = `${humanizedMainContent.trim()}\n\n${faqSection}`

  console.log("Performing second, more aggressive humanization pass on main content only...")

  // For the second pass, only humanize the main content, not the FAQs
  const [mainContent, faqContent] = initialHumanizedContent.split("**FAQ Section**")

  const deepHumanizationPrompt = `
    I have a blog post that still sounds a bit AI-generated. I need you to make it 100% human-written. Here's the current version:

    ${mainContent}

    Please rewrite this to make it COMPLETELY indistinguishable from content written by a human expert blogger. Make these AGGRESSIVE changes:
    
    1. Add more personality quirks and writing idiosyncrasies
    2. Include personal stories that feel genuine and specific (with details like names, places, dates)
    3. Add parenthetical asides and tangential thoughts (like this one!)
    4. Include some typos and then corrections (like "teh... the")
    5. Add casual phrases like "y'know", "honestly", "look", "here's the thing"
    6. Include some strong opinions and mild exaggerations
    7. Include some cultural references that a human would make
    8. Use more varied punctuation including em dashes, ellipses, and occasional exclamation points!
    9. Include some self-doubt or hedging phrases like "at least that's what I think" or "I could be wrong but..."
    10. Add some stream-of-consciousness elements in places

      IMPORTANT:
      - Keep all the factual information intact
      - Preserve all bold text formatting (text between ** marks)
      - Preserve all numbered lists and bullet points
      - Preserve all headings and ensure they're properly formatted as bold text
      - PRESERVE ALL HTML LINKS EXACTLY AS THEY APPEAR IN THE ORIGINAL TEXT
      
      The goal is to make this content pass as 100% human-written, even under careful scrutiny by content experts who are specifically looking for AI-generated text.
    `

  const deepHumanizedMainContent = await callAzureOpenAI(deepHumanizationPrompt, 3000, 0.95)

  // Recombine with the FAQ section
  const deepHumanizedContent = `${deepHumanizedMainContent.trim()}\n\n**FAQ Section**${faqContent}`

  console.log("Performing final humanization pass on main content only...")

  // For the final pass, again only humanize the main content
  const [finalMainContent, finalFaqContent] = deepHumanizedContent.split("**FAQ Section**")

  const ultraHumanizationPrompt = `
      I need this blog post to be COMPLETELY undetectable as AI-generated content. Here's the current version:

      ${finalMainContent}

      Please apply these advanced humanization techniques to make it 100% human-written:
      
      1. Add "verbal pauses" like "um", "uh", "hmm", "y'know what I mean?" in appropriate places
      2. Include highly specific personal details that only a human would mention
      3. Add some mid-sentence topic shifts that feel natural
      4. Include some text in ALL CAPS for emphasis in 1-2 places
      5. Add some incomplete thoughts or sentences that trail off with "..."
      6. Include some regional expressions or colloquialisms
      7. Add some personal opinions that might be slightly controversial but authentic
      8. Include references to current events, seasons, or holidays that make it feel timely
      9. Add some self-editing phrases like "let me rephrase that" or "actually, scratch that"
      10. Add some meta-commentary about the writing process itself

      CRITICAL INSTRUCTIONS:
      - This MUST read like it was written by a real human blogger with their own unique voice and quirks
      - The writing should have natural "messiness" and imperfections that AI typically doesn't produce
      - Ensure there are variations in paragraph length, including some very short paragraphs
      - Add occasional one-sentence paragraphs for emphasis
      - Include at least one personal anecdote that feels genuinely human
      - Preserve all important information and maintain the overall structure
      - PRESERVE ALL HTML LINKS EXACTLY AS THEY APPEAR IN THE ORIGINAL TEXT
    `

  const ultraHumanizedMainContent = await callAzureOpenAI(ultraHumanizationPrompt, 3500, 0.99)

  // Recombine with the FAQ section for the final time
  let finalContent = `${ultraHumanizedMainContent.trim()}\n\n**FAQ Section**${finalFaqContent}`

  console.log("Adding image placeholders to extreme humanized content...")

  // Split only the main content for image insertion, preserving the FAQ section
  const [contentForImages, faqsToPreserve] = finalContent.split("**FAQ Section**")

  const contentLines = contentForImages.split("\n\n")
  const totalParagraphs = contentLines.length
  const introEnd = Math.min(3, Math.floor(totalParagraphs * 0.1))
  const firstThird = Math.floor(totalParagraphs * 0.33)
  const secondThird = Math.floor(totalParagraphs * 0.66)

  contentLines.splice(introEnd, 0, "[IMAGE_1]")
  contentLines.splice(firstThird + 1, 0, "[IMAGE_2]")
  contentLines.splice(secondThird + 2, 0, "[IMAGE_3]")

  const contentWithImagePlaceholders = contentLines.join("\n\n")

  // Recombine with the FAQ section
  finalContent = `${contentWithImagePlaceholders}\n\n**FAQ Section**${faqsToPreserve}`

  // Ensure we have at least 3 image URLs
  while (imageUrls.length < 3) {
    imageUrls.push("https://via.placeholder.com/1024x768.png?text=Blog+Image")
  }

  // Replace image placeholders with proper image blocks
  finalContent = finalContent.replace(
    /!?\[IMAGE_1\]/g,
    `\n\n\n<img src="${imageUrls[0]}" alt="Blog image 1" class="blog-image" />\n\n\n`,
  )
  finalContent = finalContent.replace(
    /!?\[IMAGE_2\]/g,
    `\n\n\n<img src="${imageUrls[1]}" alt="Blog image 2" class="blog-image" />\n\n\n`,
  )
  finalContent = finalContent.replace(
    /!?\[IMAGE_3\]/g,
    `\n\n\n<img src="${imageUrls[2]}" alt="Blog image 3" class="blog-image" />\n\n\n`,
  )

  // Remove unnecessary cleanup that might interfere
  finalContent = finalContent
    .replace(/^---+$/gm, "")
    .replace(/^There you have it!.*$/gm, "")
    .replace(/^The content flows naturally.*$/gm, "")
    .replace(/^Let me know if.*$/gm, "")
    .replace(/^Let's dive in!.*$/gm, "")
    .replace(/^Here's the final.*$/gm, "")
    .replace(/^I've also included.*$/gm, "")

  // Final cleanup to remove any remaining AI-like phrases
  const aiPhrases = [
    /^Sure!.*?\n/i,
    /^Here's.*?\n/i,
    /^I've (created|written|generated|transformed).*?\n/i,
    /^As requested.*?\n/i,
    /^Below is.*?\n/i,
    /^This is.*?version of your blog.*?\n/i,
    /\n\nI hope this (helps|works for you|meets your needs).*?$/i,
    /\n\nLet me know if.*?$/i,
    /\n\nDoes this work.*?$/i,
    /\n\nIs there anything else.*?$/i,
  ]

  for (const phrase of aiPhrases) {
    finalContent = finalContent.replace(phrase, "")
  }

  // Additional cleanup to remove technical markers and attachments
  finalContent = finalContent.replace(/^Attachment.*?\.tsx$/gm, "")
  finalContent = finalContent.replace(/^.*?blob.*?\.tsx$/gm, "")
  finalContent = finalContent.replace(/^https:\/\/blobs\.vusercontent\.com.*$/gm, "")
  finalContent = finalContent.replace(/^.*?URL:.*$/gm, "")

  // Remove any remaining technical content at start and end
  finalContent = finalContent.replace(/^.*?(#|\/\/|import|export|function).*?\n\n/, "")
  finalContent = finalContent.replace(/\n\n.*?(#|\/\/|import|export|function).*?$/, "")

  // Ensure clean start and end
  finalContent = finalContent.trim()

  // Final check to ensure FAQ section is complete and not truncated
  if (!finalContent.includes("**FAQ Section**") || !finalContent.includes("**Q")) {
    // If FAQs were lost, add them back
    finalContent = `${finalContent}\n\n${formattedFaqs}`
  }

  // Make sure all FAQ questions and answers are complete
  const faqRegex = /\*\*Q\d+: (.*?)\*\*\s*([\s\S]*?)(?=\*\*Q\d+:|$)/g
  let match
  let faqsComplete = true

  while ((match = faqRegex.exec(finalContent)) !== null) {
    const question = match[1]
    const answer = match[2].trim()

    // Check if answer seems truncated (less than 50 characters or ends with ...)
    if (answer.length < 50 || answer.endsWith("...") || !answer) {
      faqsComplete = false
      break
    }
  }

  // If FAQs seem incomplete, replace the entire FAQ section with the original
  if (!faqsComplete) {
    const mainContentPart = finalContent.split("**FAQ Section**")[0]
    finalContent = `${mainContentPart.trim()}\n\n${formattedFaqs}`
  }

  console.log("Final humanization with images completed successfully")
  return finalContent
}

// Function to blur content
function blurContent(content: string): string {
  const words = content.split(/\s+/)
  const blurredWords = words.map((word, index) => {
    if (index % 3 === 0) {
      return `<span style="filter: blur(5px);">${word}</span>`
    }
    return word
  })
  return blurredWords.join(" ")
}

// Update the main generateBlog function to use direct links
export async function generateBlog(websiteUrl: string): Promise<GenerateBlogResult> {
  try {
    console.log("Starting blog generation with Tavily web search...");

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Authentication failed:", authError?.message);
      throw new Error("You need to be authenticated to generate blog posts!");
    }

    const userId = user.id;
    const blogPosts: BlogPost[] = [];
    const firstRevealDate = new Date();
    const existingContent: string[] = [];
    const existingTitles: string[] = [];

    console.log(`Fetching existing posts for user ${userId}...`);
    const { data: existingPosts, error: postsError } = await supabase
      .from("blogs")
      .select("title, blog_post, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (postsError) {
      console.error(`Error fetching existing posts: ${postsError.message}`);
    }

    const postCount = existingPosts ? existingPosts.length : 0;
    console.log(`User ${userId} has ${postCount} existing posts`);

    if (existingPosts && existingPosts.length > 0) {
      existingPosts.forEach((post: any) => {
        existingTitles.push(post.title);
        const textContent = post.blog_post
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        existingContent.push(textContent);
      });
    }

    const postsToGenerate = 1;
    console.log(`Checking subscription for user ${userId}...`);
    const { data: subscriptions, error: subError } = await supabase
      .from("subscriptions")
      .select("plan_id, credits, free_blogs_generated, status")
      .eq("user_id", userId);

    if (subError) {
      console.error(`Error fetching subscription for user ${userId}: ${subError.message}`);
      throw new Error("Failed to fetch subscription data. Please ensure you are signed up.");
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.error(`No subscription found for user ${userId}`);
      throw new Error("No subscription found for user. Please sign up again or contact support.");
    }

    const activeSubscription = subscriptions.find(
      (sub) =>
        ACTIVE_PLANS.map((plan) => plan.toLowerCase()).includes(sub.plan_id.toLowerCase()) &&
        ["active", "trialing"].includes(sub.status.toLowerCase()),
    );

    if (subscriptions.length > 1) {
      console.warn(
        `Multiple subscriptions found for user ${userId}. Using the first active one or the first available.`,
      );
    }

    const subscription = activeSubscription || subscriptions[0];
    const isPlanActive =
      ACTIVE_PLANS.map((plan) => plan.toLowerCase()).includes(subscription.plan_id.toLowerCase()) &&
      ["active", "trialing"].includes(subscription.status.toLowerCase());

    let isFreeBlog = false;

    // Credit check and free blog logic
    if (subscription.plan_id.toLowerCase() === "free" && subscription.free_blogs_generated === 0) {
      isFreeBlog = true;
      console.log("Generating a free blog post for free plan user - no credits required.");
    } else if (!isPlanActive && subscription.free_blogs_generated > 0) {
      console.error(
        `No active subscription and free blog already generated for user ${userId}. Subscription details:`,
        {
          plan_id: subscription.plan_id,
          status: subscription.status,
          free_blogs_generated: subscription.free_blogs_generated,
        },
      );
      throw new Error(
        "You have already used your free blog post. Subscribe to a paid plan to generate more!"
      );
    } else if (isPlanActive && subscription.credits < postsToGenerate) {
      console.error(
        `Insufficient credits: ${subscription.credits} available, ${postsToGenerate} needed for user ${userId}.`
      );
      throw new Error(
        `You have only ${subscription.credits} credits left, but need ${postsToGenerate} to generate this blog. Please upgrade your plan at https://x.ai/grok to get more credits!`
      );
    }

    if (isPlanActive) {
      console.log(`Unlocking blurred blogs for user ${userId}...`);
      const { error: unlockError } = await supabase
        .from("blogs")
        .update({ is_blurred: false })
        .eq("user_id", userId)
        .eq("is_blurred", true);

      if (unlockError) {
        console.error(`Error unlocking blurred blogs for user ${userId}: ${unlockError.message}`);
      } else {
        console.log(`Unlocked all blurred blog posts for user ${userId}`);
      }
    }

    let validatedUrl = websiteUrl;
    if (!websiteUrl.startsWith("http")) {
      validatedUrl = `https://${websiteUrl}`;
    }

    try {
      new URL(validatedUrl);
    } catch (urlError) {
      throw new Error(`Invalid URL format: ${websiteUrl}`);
    }

    const websiteInfo = await analyzeWebsite(validatedUrl);
    console.log("Analyzed website info");

    const searchResults = await searchWeb(validatedUrl);

    let webContent = "";

    if (searchResults.length > 0) {
      searchResults.forEach((result, index) => {
        const title = result.title || "No title";
        const content = result.content || "No content";
        const url = result.url || "No URL";

        webContent += `
Source ${index + 1}: ${url}
Title: ${title}
Content: ${content.substring(0, 500)}...

`;
      });

      console.log(`Compiled ${webContent.length} characters from web search`);
    } else {
      console.log("No search results found, using industry research");

      try {
        const domain = new URL(validatedUrl).hostname;
        const industryResponse = await tavilyClient.search(`what industry is ${domain} in`, {
          max_results: 3,
          search_depth: "basic",
        });

        if (industryResponse.results && industryResponse.results.length > 0) {
          webContent = industryResponse.results[0].content || "No industry information available";
        }
      } catch (industryError) {
        console.error("Error getting industry information:", industryError);
        webContent = "No industry information available";
      }
    }

    const researchSummary = `
Website Info:
${websiteInfo}

Web Content:
${webContent}
`;

    console.log(`Generated research summary: ${researchSummary.substring(0, 200)}...`);

    let blogTitle = await generateDataDrivenTitle(websiteInfo, researchSummary);
    console.log(`Generated blog title: ${blogTitle}`);

    if (existingTitles.includes(blogTitle)) {
      console.warn(`Blog title "${blogTitle}" already exists, generating a new one...`);
      const newBlogTitle = await generateDataDrivenTitle(websiteInfo, researchSummary);
      if (existingTitles.includes(newBlogTitle)) {
        console.warn(`New blog title "${newBlogTitle}" also exists, using a timestamped title...`);
        blogTitle = `${newBlogTitle} - ${Date.now()}`;
      } else {
        blogTitle = newBlogTitle;
      }
      console.log(`Using new blog title: ${blogTitle}`);
    }

    const externalLinks = await generateExternalLinks(searchResults, researchSummary, validatedUrl);
    console.log(`Generated external links: ${JSON.stringify(externalLinks)}`);

    const internalLinks = await generateInternalLinks(validatedUrl, searchResults);
    console.log(`Generated internal links: ${JSON.stringify(internalLinks)}`);

    const faqs = await generateFAQs(websiteInfo, researchSummary);
    console.log(`Generated FAQs: ${faqs.substring(0, 200)}...`);

    const firstHalf = await generateFirstHalf(blogTitle, researchSummary, validatedUrl, externalLinks, internalLinks);
    console.log(`Generated first half of blog content: ${firstHalf.substring(0, 200)}...`);

    const secondHalf = await generateSecondHalf(
      blogTitle,
      researchSummary,
      firstHalf,
      validatedUrl,
      externalLinks,
      internalLinks,
    );
    console.log(`Generated second half of blog content: ${secondHalf.substring(0, 200)}...`);

    const imageTopics = await generateImageTopics(blogTitle, researchSummary);
    console.log(`Generated image topics: ${imageTopics.join(", ")}`);

    const imageUrls = await Promise.all(imageTopics.map((topic) => fetchStockImages(topic)))
      .then((results) => results.flat())
      .catch((error) => {
        console.error("Error fetching images:", error);
        return generatePlaceholderImages(3, "Blog Image");
      });

    console.log(`Generated image URLs: ${imageUrls.join(", ")}`);

    const content = await finalHumanization(firstHalf + secondHalf, faqs, imageUrls, blogTitle);
    console.log("Performed final humanization of content");

    const is_blurred = false; // No blurring as per your existing logic

    const newBlogPost: BlogPost = {
      title: blogTitle,
      content: content,
      is_blurred: is_blurred,
    };

    blogPosts.push(newBlogPost);

    // Deduct credits and update subscription before database insertion
    let creditsToDeduct = postsToGenerate;
    if (isFreeBlog) {
      creditsToDeduct = 0; // No credits deducted for free blog
      console.log(`No credits deducted for free blog post for user ${userId}`);
    }

    console.log(`Preparing to deduct ${creditsToDeduct} credits from user ${userId}...`);
    const updateData: any = {
      free_blogs_generated: isFreeBlog ? subscription.free_blogs_generated + 1 : subscription.free_blogs_generated,
    };

    // Only update credits if creditsToDeduct is greater than 0
    if (creditsToDeduct > 0) {
      if (subscription.credits < creditsToDeduct) {
        console.error(
          `Credit check failed after generation: ${subscription.credits} available, ${creditsToDeduct} needed for user ${userId}.`
        );
        throw new Error(
          `Insufficient credits after generation. You have ${subscription.credits} credits left. Please upgrade your plan at https://x.ai/grok.`
        );
      }
      updateData.credits = subscription.credits - creditsToDeduct;
    }

    const { error: updateError } = await supabase.from("subscriptions").update(updateData).eq("user_id", userId);

    if (updateError) {
      console.error(`Error updating subscription for user ${userId}: ${updateError.message}`);
      throw new Error("Failed to update subscription. Please contact support.");
    }

    console.log(`Successfully updated subscription for user ${userId}`);

    // Insert blog post into database
    console.log(`Creating blog post in database for user ${userId}...`);
    if (!validatedUrl) {
      console.error("URL is missing or invalid, generating a fallback URL");
      validatedUrl = `https://blog-${Date.now()}.example.com/${encodeURIComponent(blogTitle.toLowerCase().replace(/\s+/g, "-"))}`;
    }

    console.log(`Using URL for database insertion: ${validatedUrl}`);

    const blogPostData = {
      user_id: userId,
      title: blogTitle,
      blog_post: content,
      is_blurred: is_blurred,
      created_at: firstRevealDate.toISOString(),
      url: validatedUrl,
    };

    console.log(
      `Blog post data to insert:`,
      JSON.stringify({
        ...blogPostData,
        blog_post: blogPostData.blog_post.substring(0, 100) + "...",
      }),
    );

    const { data: insertedData, error: insertError } = await supabase.from("blogs").insert([blogPostData]);

    if (insertError) {
      console.error(`Error inserting blog post for user ${userId}: ${insertError.message}`);
      console.error(`Error details:`, insertError);
      throw new Error("Failed to save blog post due to a database error. Please try again or contact support.");
    }

    console.log(
      `Blog post created successfully with ID: ${insertedData && insertedData[0] ? insertedData[0] : "unknown"}`,
    );

    return {
      blogPosts,
      message: `Generated ${postsToGenerate} blog post(s) successfully!`,
    } as GenerateBlogResult;
  } catch (error: any) {
    console.error("Error generating blog for user:", error);
    let errorMessage = error.message || "Failed to generate blog post. Please try again.";
    
    // Customize error message for insufficient credits
    if (errorMessage.includes("Insufficient credits")) {
      errorMessage = `${errorMessage} Visit https://x.ai/grok to upgrade your plan.`;
    }

    return {
      blogPosts: [],
      message: errorMessage,
    } as GenerateBlogResult;
  }
}