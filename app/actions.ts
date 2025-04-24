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

// Function to generate external links from search results and research
async function generateExternalLinks(
  searchResults: any[],
  researchSummary: string,
  websiteUrl: string,
): Promise<{ text: string; url: string }[]> {
  console.log("Generating external links...")
  const externalLinks: { text: string; url: string }[] = []
  const domain = new URL(websiteUrl).hostname

  // Extract URLs from search results (exclude same domain)
  if (searchResults.length > 0) {
    searchResults.forEach((result) => {
      const url = result.url || ""
      const title = result.title || "Related Resource"
      if (url && !url.includes(domain) && !externalLinks.some((link) => link.url === url)) {
        externalLinks.push({ text: title, url })
      }
    })
  }

  // Extract URLs from research summary (exclude same domain)
  const urlRegex = /(https?:\/\/[^\s<]+)/g
  const summaryUrls = researchSummary.match(urlRegex) || []
  summaryUrls.forEach((url) => {
    if (!url.includes(domain) && !externalLinks.some((link) => link.url === url)) {
      externalLinks.push({ text: "Industry Insight", url })
    }
  })

  // If we still need more links, perform additional searches
  if (externalLinks.length < 8) {
    try {
      const additionalQueries = [
        `${domain} alternatives`,
        `${domain} industry best practices`,
        `${domain} related tools`,
        `${domain} industry news`,
        `${domain} competitors`,
        `${domain} tutorials`,
      ]

      for (const query of additionalQueries) {
        if (externalLinks.length >= 8) break

        console.log(`Searching for additional external links with query: "${query}"`)
        const response = await tavilyClient.search(query, {
          max_results: 5,
          search_depth: "basic",
        })

        if (response.results && response.results.length > 0) {
          for (const result of response.results) {
            const url = result.url || ""
            const title = result.title || "Related Resource"
            if (url && !url.includes(domain) && !externalLinks.some((link) => link.url === url)) {
              externalLinks.push({ text: title, url })
              if (externalLinks.length >= 8) break
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching additional external links:", error)
    }
  }

  console.log(`Generated ${externalLinks.length} external links`)
  return externalLinks.slice(0, 8) // Return up to 8 external links
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
    { text: "About Us", path: "/" },
    { text: "Pricing Plans", path: "/" },
    { text: "Contact Support", path: "/" },
    { text: "Blog", path: "/" },
    { text: "Features", path: "/" },
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
          const response = await fetch(
            `https://api.unsplash.com/photos/random?query=${encodeURIComponent(topic)}&orientation=landscape&client_id=${unsplashAccessKey}`,
          )

          if (response.ok) {
            const data = await response.json()
            images.push(data.urls.regular)
          } else {
            throw new Error(`Unsplash API error: ${response.status}`)
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

// Perform web searches
async function searchWeb(websiteUrl: string): Promise<any[]> {
  console.log("Performing web searches with Tavily...")

  try {
    const domain = new URL(websiteUrl).hostname

    const queries = [
      domain,
      `${domain} features`,
      `${domain} services`,
      `${domain} reviews`,
      `${domain} industry`,
      `${domain} FAQ`,
      `${domain} how to use`,
    ]

    let allResults: any[] = []

    for (const query of queries) {
      try {
        console.log(`Searching web for: "${query}"`)

        const response = await tavilyClient.search(query, {
          max_results: 5,
          search_depth: "basic",
        })

        if (response.results && response.results.length > 0) {
          console.log(`Found ${response.results.length} results for "${query}"`)
          allResults = [...allResults, ...response.results]
        }
      } catch (error) {
        console.log(`Error searching for "${query}":`, error)
      }
    }

    console.log(`Total results found: ${allResults.length}`)
    return allResults
  } catch (error) {
    console.error("Error in searchWeb:", error)
    return []
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
  console.log("Generating data-driven title...")

  const titlePrompt = `
    Based on this website information and research summary:
    
    WEBSITE INFO:
    ${websiteInfo}
    
    RESEARCH SUMMARY:
    ${researchSummary}
    
    Create 5 catchy, clickable blog post titles that follow these formats:
    1. "How to..." (e.g., "How to Boost Sales by 47% in 3 Weeks")
    2. "What..." (e.g., "What 92% of Leaders Know About Growth")
    3. "When..." (e.g., "When to Pivot to Save 30% on Costs")
    4. "Where to..." (e.g., "Where to Find 5 Hidden Market Gaps")
    5. "Why..." (e.g., "Why 73% Fail and How to Win Big")
    
    Each title must:
    - Start with "How to," "What," "When," "Where," or "Why"
    - Include specific, data-driven numbers (e.g., percentages, timeframes, counts) derived from or inspired by the research summary
    - Be highly clickable, emotionally engaging, and intriguing
    - Sound 100% human-written, conversational, and authentic
    - Be relevant to the website's industry and audience
    - Be between 40-60 characters long (including spaces)
    - Avoid generic phrases like "proven strategies" or "maximize results"
    
    Format your response as a numbered list of just the titles.
  `

  const titlesResponse = await callAzureOpenAI(titlePrompt, 500, 0.9)

  const titleLines = titlesResponse.split("\n").filter((line) => line.trim().length > 0)

  if (titleLines.length > 0) {
    const randomIndex = Math.floor(Math.random() * titleLines.length)
    const selectedTitle = titleLines[randomIndex].replace(/^\d+[.)]\s*|[-•*]\s*/, "")
    return selectedTitle
  }

  return ""
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

// Generate first half of blog content
async function generateFirstHalf(blogTitle: string, researchSummary: string, websiteUrl: string): Promise<string> {
  console.log("Generating first half of blog content...")

  const firstHalfPrompt = `
    I'm a professional content writer working on a blog post for ${websiteUrl}. My marketing consultant gave me this research:
    
    "${researchSummary}"
    
    Now I need to write the first half of a 1500-word blog post with this title:
    
    ${blogTitle}
    
    For this first half (approximately 750 words), include:
    1. A personal introduction that hooks the reader
    2. The first 2-3 main sections with clear headings
    3. Two placeholders for external links ([EXTERNAL_LINK_1], [EXTERNAL_LINK_2]) to relevant industry resources
    4. Two placeholders for internal links ([INTERNAL_LINK_1], [INTERNAL_LINK_2]) to pages on ${websiteUrl}
    
    IMPORTANT FORMATTING INSTRUCTIONS:
    - Make all headings bold by surrounding them with ** (e.g., **Heading**)
    - Use proper numbered lists (1., 2., 3.) and bullet points (-)
    - Don't use markdown symbols like # or ### for headings
    - Use bold text for important points and key phrases
    - Ensure proper paragraph breaks for readability
    - Keep [EXTERNAL_LINK_X] and [INTERNAL_LINK_X] placeholders as-is for later replacement
    
    The tone should be conversational, helpful, and show personality - like an experienced blogger who really knows this industry. 
    Include humor, rhetorical questions, and varied sentence structures to make it feel authentic.
    Be specific to this website and industry - don't make up generic information.
    If you don't have enough information about something, acknowledge that gap rather than inventing details.
  `

  const firstHalf = await callAzureOpenAI(firstHalfPrompt, 1500, 0.8)
  return firstHalf
}

// Generate second half of blog content
async function generateSecondHalf(
  blogTitle: string,
  researchSummary: string,
  firstHalf: string,
  websiteUrl: string,
): Promise<string> {
  console.log("Generating second half of blog content...")

  const secondHalfPrompt = `
    I'm continuing to write a blog post for ${websiteUrl} with the title:
    
    ${blogTitle}
    
    Here's the first half of the blog post I've already written:
    
    "${firstHalf}"
    
    Now I need to write the second half (approximately 750 words) to complete the 1500-word blog post. Include:
    1. The remaining 2-3 main sections with clear headings
    2. A personal anecdote or case study
    3. A strong conclusion with a call-to-action
    4. One placeholder for an external link ([EXTERNAL_LINK_3]) to a relevant industry resource
    5. One placeholder for an internal link ha bh to a page on ${websiteUrl}
    
    IMPORTANT FORMATTING INSTRUCTIONS:
    - Make all headings bold by surrounding them with ** (e.g., **Heading**)
    - Use proper numbered lists (1., 2., 3.) and bullet points (-)
    - Don't use markdown symbols like # or ### for headings
    - Use bold text for important points and key phrases
    - Ensure proper paragraph breaks for readability
    - Keep [EXTERNAL_LINK_X] and [INTERNAL_LINK_X] placeholders as-is for later replacement
    - Make sure the conclusion is clearly marked with a bold heading like **Conclusion**
    
    Continue with the same conversational, helpful tone established in the first half.
    Be specific to this website and industry - don't make up generic information.
    Here's the research summary again for reference:
    "${researchSummary}"
  `

  const secondHalf = await callAzureOpenAI(secondHalfPrompt, 1500, 0.8)
  return secondHalf
}

// Modified finalHumanization function with YouTube video references removed
async function finalHumanization(
  content: string,
  faqs: string,
  imageUrls: string[],
  externalLinks: { text: string; url: string }[],
  internalLinks: { text: string; url: string }[],
): Promise<string> {
  console.log("Performing final humanization of content with images and links...")

  const combinedContent = `${content}\n\n${faqs}`

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
    11. Preserve [EXTERNAL_LINK_X] and [INTERNAL_LINK_X] placeholders exactly as they are

    IMPORTANT FORMATTING INSTRUCTIONS:
    - Preserve all bold text formatting (text between ** marks)
    - Preserve all numbered lists and bullet points
    - Preserve all headings but remove any ### markdown symbols
    - Make sure headings are properly formatted as bold text
    - Ensure proper paragraph breaks for readability
    - MAKE SURE TO INCLUDE THE FAQ SECTION AFTER THE CONCLUSION
    - Do NOT modify [EXTERNAL_LINK_X] or [INTERNAL_LINK_X] placeholders

    The goal is to make this content pass as 100% human-written, even under careful scrutiny by content experts.
  `

  const initialHumanizedContent = await callAzureOpenAI(humanizationPrompt, 3000, 0.95)

  console.log("Performing second, more aggressive humanization pass...")

  const deepHumanizationPrompt = `
    I have a blog post that still sounds a bit AI-generated. I need you to make it 100% human-written. Here's the current version:

    ${initialHumanizedContent}

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
    11. Preserve [EXTERNAL_LINK_X] and [INTERNAL_LINK_X] placeholders exactly as they are

    IMPORTANT:
    - Keep all the factual information intact
    - Preserve all bold text formatting (text between ** marks)
    - Preserve all numbered lists and bullet points
    - Preserve all headings and ensure they're properly formatted as bold text
    - Ensure the FAQ section remains after the conclusion
    - Do NOT modify [EXTERNAL_LINK_X] or [INTERNAL_LINK_X] placeholders
    
    The goal is to make this content pass as 100% human-written, even under careful scrutiny by content experts who are specifically looking for AI-generated text.
  `

  const deepHumanizedContent = await callAzureOpenAI(deepHumanizationPrompt, 3000, 0.98)

  console.log("Performing final ultra-humanization pass...")

  const ultraHumanizationPrompt = `
    I need this blog post to be COMPLETELY undetectable as AI-generated content. Here's the current version:

    ${deepHumanizedContent}

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
    11. Add occasional typos and then correct them (e.g., "teh... the")
    12. Include some personal struggles or frustrations
    13. Add some casual interjections like "Anyway," "So," "Look," "Right," at the start of paragraphs
    14. Include some cultural references or idioms that AI typically wouldn't use
    15. Add some personal preferences that feel authentic
    16. Include some content that breaks the fourth wall
    17. Add some humor that feels genuinely human and slightly quirky
    18. Include some minor contradictions or changes of mind that humans naturally have
    19. Add some personal anecdotes with very specific details
    20. Include some text that acknowledges the reader directly in a casual way
    21. Preserve [EXTERNAL_LINK_X] and [INTERNAL_LINK_X] placeholders exactly as they are

    CRITICAL INSTRUCTIONS:
    - This MUST read like it was written by a real human blogger with their own unique voice and quirks
    - The writing should have natural "messiness" and imperfections that AI typically doesn't produce
    - Ensure there are variations in paragraph length, including some very short paragraphs
    - Add occasional one-sentence paragraphs for emphasis
    - Include at least one personal anecdote that feels genuinely human
    - Make sure the FAQ section still appears after the conclusion
    - Preserve all important information and maintain the overall structure
    - Do NOT modify [EXTERNAL_LINK_X] or [INTERNAL_LINK_X] placeholders
  `

  const ultraHumanizedContent = await callAzureOpenAI(ultraHumanizationPrompt, 3500, 0.99)

  console.log("Performing extreme humanization pass for ultimate human-like quality...")

  const extremeHumanizationPrompt = `
    I need to transform this blog post to be COMPLETELY indistinguishable from human writing. Here's the current version:

    ${ultraHumanizedContent}

    Apply these extreme humanization techniques:
    
    1. Add personal quirks that would be unique to a specific writer
    2. Include highly specific industry jargon that only someone with real experience would know
    3. Add references to obscure tools or techniques that aren't commonly discussed online
    4. Include some minor factual errors that a human might make (nothing major, just small inaccuracies)
    5. Add some content that shows vulnerability or admits knowledge gaps
    6. Add some content that references the writer's personal journey or evolution of thinking
    7. Add some content that feels slightly disorganized or tangential in a human way
    8. Include some phrases that are slightly awkward but in a human way
    9. Add some content that references specific time periods or seasons
    10. Include some content that shows the writer's personality quirks
    11. Preserve [EXTERNAL_LINK_X] and [INTERNAL_LINK_X] placeholders exactly as they are

    CRITICAL REQUIREMENTS:
    - The writing must feel like it comes from a SPECIFIC person with their own unique voice
    - Include at least 2-3 personal anecdotes with very specific details
    - Add some content that shows the writer's biases or preferences
    - Include some content that references the writer's specific background or expertise
    - Add some content that shows the writer's thought process evolving as they write
    - Include some content that feels slightly rambling but in an authentic way
    - Make sure to maintain all the important information and overall structure
    - Do NOT modify [EXTERNAL_LINK_X] or [INTERNAL_LINK_X] placeholders
  `

  let finalContent = await callAzureOpenAI(extremeHumanizationPrompt, 3500, 0.99)

  // Clean up any remaining AI-style intro/outro phrases
  finalContent = finalContent.replace(
    /^(?:Sure|Here|As requested|I've created|Below is).*?(?:blog post|article|content).*?\n+/i,
    "",
  )
  finalContent = finalContent.replace(
    /\n+(?:I hope|Let me know|Feel free|Is there anything|Thank you).*?(?:helpful|questions|feedback|else).*?$/i,
    "",
  )

  console.log("Replacing link placeholders with styled HTML anchor tags...")

  // Replace external link placeholders with styled anchor tags
  externalLinks.forEach((link, index) => {
    const placeholder = `[EXTERNAL_LINK_${index + 1}]`
    finalContent = finalContent.replace(
      placeholder,
      `<a href="${link.url}" class="external-link" style="color: #0066cc; text-decoration: underline; font-weight: 500;">${link.text}</a>`,
    )
  })

  // Replace internal link placeholders with styled anchor tags
  internalLinks.forEach((link, index) => {
    const placeholder = `[INTERNAL_LINK_${index + 1}]`
    finalContent = finalContent.replace(
      placeholder,
      `<a href="${link.url}" class="internal-link" style="color: #2e7d32; text-decoration: underline; font-weight: 500;">${link.text}</a>`,
    )
  })

  console.log("Adding image placeholders to extreme humanized content...")

  const contentLines = finalContent.split("\n\n")
  const totalParagraphs = contentLines.length
  const introEnd = Math.min(3, Math.floor(totalParagraphs * 0.1))
  const firstThird = Math.floor(totalParagraphs * 0.33)
  const secondThird = Math.floor(totalParagraphs * 0.66)

  contentLines.splice(introEnd, 0, "[IMAGE_1]")
  contentLines.splice(firstThird + 1, 0, "[IMAGE_2]")
  contentLines.splice(secondThird + 2, 0, "[IMAGE_3]")

  finalContent = contentLines.join("\n\n")

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

  console.log("Final humanization with images and links completed successfully")
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

// Update the main generateBlog function with YouTube video references removed
export async function generateBlog(websiteUrl: string) {
  try {
    console.log("Starting blog generation with Tavily web search...")

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication failed:", authError?.message)
      throw new Error("You need to be authenticated to generate blog posts!")
    }

    const userId = user.id
    const blogPosts: BlogPost[] = []
    const firstRevealDate = new Date()
    const existingContent: string[] = []
    const existingTitles: string[] = []

    console.log(`Fetching existing posts for user ${userId}...`)
    const { data: existingPosts, error: postsError } = await supabase
      .from("blogs")
      .select("title, blog_post, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (postsError) {
      console.error(`Error fetching existing posts: ${postsError.message}`)
    }

    const postCount = existingPosts ? existingPosts.length : 0
    console.log(`User ${userId} has ${postCount} existing posts`)

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
    console.log(`Checking subscription for user ${userId}...`)
    const { data: subscriptions, error: subError } = await supabase
      .from("subscriptions")
      .select("plan_id, credits, free_blogs_generated, status")
      .eq("user_id", userId)

    if (subError) {
      console.error(`Error fetching subscription for user ${userId}: ${subError.message}`)
      throw new Error("Failed to fetch subscription data. Please ensure you are signed up.")
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.error(`No subscription found for user ${userId}`)
      throw new Error("No subscription found for user. Please sign up again or contact support.")
    }

    const activeSubscription = subscriptions.find(
      (sub) =>
        ACTIVE_PLANS.map((plan) => plan.toLowerCase()).includes(sub.plan_id.toLowerCase()) &&
        ["active", "trialing"].includes(sub.status.toLowerCase()),
    )

    if (subscriptions.length > 1) {
      console.warn(
        `Multiple subscriptions found for user ${userId}. Using the first active one or the first available.`,
      )
    }

    const subscription = activeSubscription || subscriptions[0]
    const isPlanActive =
      ACTIVE_PLANS.map((plan) => plan.toLowerCase()).includes(subscription.plan_id.toLowerCase()) &&
      ["active", "trialing"].includes(subscription.status.toLowerCase())

    let isFreeBlog = false

    if (!isPlanActive && subscription.free_blogs_generated === 0) {
      isFreeBlog = true
      console.log("Generating a free blog post - will be blurred until subscription is active.")
    } else if (!isPlanActive) {
      console.error(`No active subscription found for user ${userId}. Subscription details:`, {
        plan_id: subscription.plan_id,
        status: subscription.status,
        free_blogs_generated: subscription.free_blogs_generated,
      })
      throw new Error(
        "You need an active subscription to generate more blog posts. Subscribe to unlock your free blog and generate more!",
      )
    } else if (subscription.credits < postsToGenerate) {
      console.error(`Insufficient credits: ${subscription.credits} available, ${postsToGenerate} needed.`)
      throw new Error(
        `You have ${subscription.credits} credits left, but need ${postsToGenerate} to generate this blog. Upgrade your plan to get more credits!`,
      )
    }

    if (isPlanActive) {
      console.log(`Unlocking blurred blogs for user ${userId}...`)
      const { error: unlockError } = await supabase
        .from("blogs")
        .update({ is_blurred: false })
        .eq("user_id", userId)
        .eq("is_blurred", true)

      if (unlockError) {
        console.error(`Error unlocking blurred blogs for user ${userId}: ${unlockError.message}`)
      } else {
        console.log(`Unlocked all blurred blog posts for user ${userId}`)
      }
    }

    let validatedUrl = websiteUrl
    if (!websiteUrl.startsWith("http")) {
      validatedUrl = `https://${websiteUrl}`
    }

    try {
      new URL(validatedUrl)
    } catch (urlError) {
      throw new Error(`Invalid URL format: ${websiteUrl}`)
    }

    const websiteInfo = await analyzeWebsite(validatedUrl)
    console.log("Analyzed website info")

    const searchResults = await searchWeb(validatedUrl)

    let webContent = ""

    if (searchResults.length > 0) {
      searchResults.forEach((result, index) => {
        const title = result.title || "No title"
        const content = result.content || "No content"
        const url = result.url || "No URL"

        webContent += `
Source ${index + 1}: ${url}
Title: ${title}
Content: ${content.substring(0, 500)}...

`
      })

      console.log(`Compiled ${webContent.length} characters from web search`)
    } else {
      console.log("No search results found, using industry research")

      try {
        const domain = new URL(validatedUrl).hostname
        const industryResponse = await tavilyClient.search(`what industry is ${domain} in`, {
          max_results: 3,
          search_depth: "basic",
        })

        if (industryResponse.results && industryResponse.results.length > 0) {
          webContent = `
No specific web content found. Based on research, this website appears to be in the following industry:

${industryResponse.results[0].content}
`
        }
      } catch (error) {
        console.log("Error getting industry info:", error)
        webContent = `
No specific web content found. Using general industry knowledge based on the website URL.
`
      }
    }

    const combinedContent = `${websiteInfo}\n\nWEB RESEARCH:\n${webContent}`

    const researchPrompt = `
      I'm writing a blog post for ${validatedUrl}. Here's what I know about the website and some web research:
      
      ${combinedContent}
      
      Based on this information, help me understand:
      1) What's the main purpose of this website/business?
      2) Who is their target audience?
      3) What are the key services or products they offer?
      4) What are the main pain points their customers have?
      5) What are 3-5 trending topics in this industry I could write about?
      6) What are some common questions people have about this industry?
      7) What specific data points or statistics would be valuable to include?
      
      Please write this as if you're a marketing consultant giving me advice for my blog post.
      Be specific to this website and industry - don't make up generic information.
      If you don't have enough information about something, acknowledge that gap rather than inventing details.
    `

    const researchResults = await callAzureOpenAI(researchPrompt, 1200, 0.7)
    console.log("Research analysis completed successfully")

    const externalLinks = await generateExternalLinks(searchResults, researchResults, validatedUrl)
    const internalLinks = await generateInternalLinks(validatedUrl, searchResults)

    const blogTitle = await generateDataDrivenTitle(websiteInfo, researchResults)
    console.log(`Generated title: ${blogTitle}`)

    const imageTopics = await generateImageTopics(blogTitle, researchResults)
    console.log(`Generated image topics: ${imageTopics.join(", ")}`)

    console.log("Starting image generation in parallel...")
    const imagePromise = fetchStockImages(imageTopics[0], 3)

    const faqs = await generateFAQs(websiteInfo, researchResults)
    console.log("Generated FAQs successfully")

    const firstHalf = await generateFirstHalf(blogTitle, researchResults, validatedUrl)
    console.log("Generated first half of blog content")

    const secondHalf = await generateSecondHalf(blogTitle, researchResults, firstHalf, validatedUrl)
    console.log("Generated second half of blog content")

    const fullContent = `${firstHalf}\n\n${secondHalf}`
    console.log("Combined blog content successfully")

    console.log("Waiting for images to be generated...")
    const imageUrls = await imagePromise
    console.log(`Generated ${imageUrls.length} images successfully`)

    console.log("Performing final humanization of the content with FAQs and images...")
    const finalContent = await finalHumanization(fullContent, faqs, imageUrls, externalLinks, internalLinks)
    console.log("Final humanization with images completed successfully")

    const contentToSave = finalContent
    let contentToReturn = finalContent

    if (isFreeBlog) {
      contentToReturn = blurContent(finalContent)
    }

    console.log(`Saving blog post to database for user ${userId}...`)
    const { data: savedBlog, error: saveError } = await supabase
      .from("blogs")
      .insert({
        user_id: userId,
        title: blogTitle,
        blog_post: contentToSave,
        is_blurred: isFreeBlog,
        created_at: new Date().toISOString(),
        url: validatedUrl,
      })
      .select()

    if (saveError) {
      console.error(`Error saving blog post: ${saveError.message}`)
      throw new Error(`Failed to save blog post: ${saveError.message}`)
    }

    if (isFreeBlog) {
      console.log(`Updating free blog count for user ${userId}...`)
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({ free_blogs_generated: 1 })
        .eq("user_id", userId)

      if (updateError) {
        console.error(`Error updating free blog count: ${updateError.message}`)
      }
    } else if (isPlanActive) {
      console.log(`Deducting credits for user ${userId}...`)
      const newCredits = subscription.credits - postsToGenerate
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({ credits: newCredits })
        .eq("user_id", userId)

      if (updateError) {
        console.error(`Error updating credits: ${updateError.message}`)
      }
    }

    return {
      headline: blogTitle,
      content: contentToReturn,
      initialContent: `${fullContent}\n\n${faqs}`,
      researchSummary: researchResults,
      imageUrls: imageUrls,
      is_blurred: isFreeBlog,
    }
  } catch (error: any) {
    console.error("Error generating blog:", error)

    try {
      const supabase = await createClient()
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        throw new Error("Authentication required for blog generation")
      }

      const userId = user.id

      const { data: subscriptions, error: subError } = await supabase
        .from("subscriptions")
        .select("plan_id, credits, free_blogs_generated, status")
        .eq("user_id", userId)

      if (subError || !subscriptions || subscriptions.length === 0) {
        throw new Error("Subscription data required for blog generation")
      }

      const subscription = subscriptions[0]
      const isPlanActive =
        ACTIVE_PLANS.includes(subscription.plan_id) &&
        (subscription.status === "active" || subscription.status === "trialing")

      let isFreeBlog = false

      if (!isPlanActive && subscription.free_blogs_generated === 0) {
        isFreeBlog = true
      } else if (!isPlanActive) {
        throw new Error("Active subscription required for blog generation")
      } else if (subscription.credits < 1) {
        throw new Error("Insufficient credits for blog generation")
      }

      console.log("Attempting fallback blog generation...")

      let domain = "website"
      try {
        domain = new URL(websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`).hostname
      } catch (e) {}

      let industryInfo = "digital marketing"
      try {
        const industryResponse = await tavilyClient.search(`what industry is ${domain} in`, {
          max_results: 3,
          search_depth: "basic",
        })
        if (industryResponse.results && industryResponse.results.length > 0) {
          industryInfo = industryResponse.results[0].content
        }
      } catch (e) {}

      const nicheInfo = `
      Website: ${websiteUrl}
      Domain: ${domain}
      Industry: ${industryInfo}
      `

      const fallbackImageTopics = [`${domain} business`, `${industryInfo} professional`, `success in ${industryInfo}`]

      console.log("Generating fallback images...")
      const imageUrls = await fetchStockImages(fallbackImageTopics[0], 3)

      const fallbackFAQs = `
**FAQ Section**

**Q1: What is ${domain}?**
${domain} is a website that appears to be related to the ${industryInfo} industry. While specific details about the platform are limited in our research, it likely offers services or products designed to help users in this field.

**Q2: How can I get started with ${domain}?**
To get started with ${domain}, you would typically visit their website and look for a sign-up or registration option. Most websites offer a simple onboarding process that guides new users through the initial setup.

**Q3: What features does ${domain} offer?**
Based on industry standards, ${domain} likely offers features related to ${industryInfo}. For the most accurate and up-to-date information about specific features, we recommend visiting their official website or contacting their customer support.

**Q4: Is ${domain} suitable for beginners?**
Many platforms in the ${industryInfo} industry offer user-friendly interfaces suitable for beginners. However, to determine if ${domain} specifically caters to newcomers, we suggest checking their website for tutorials, guides, or a knowledge base.

**Q5: How much does ${domain} cost?**
Pricing information for ${domain} would be available on their official website. Many similar services offer tiered pricing models with free trials or freemium options, but specific details would need to be confirmed directly from their pricing page.
      `

      const fallbackFirstHalfPrompt = `
        I'm a professional content writer who needs to write the first half of a blog post about ${nicheInfo}
        
        I need to write the first half (approximately 750 words) of a 1500-word blog post with this title:
        
        How to Boost Your Results in ${industryInfo}
        
        For this first half, include:
        1. A personal introduction with a hook
        2. The first 2-3 main sections with clear headings
        3. Two placeholders for external links ([EXTERNAL_LINK_1], [EXTERNAL_LINK_2]) to relevant industry resources
        4. Two placeholders for internal links ([INTERNAL_LINK_1], [INTERNAL_LINK_2]) to pages on ${websiteUrl}
        
        IMPORTANT FORMATTING INSTRUCTIONS:
        - Make all headings bold by surrounding them with ** (e.g., **Heading**)
        - Use proper numbered lists (1., 2., 3.) and bullet points (-)
        - Don't use markdown symbols like # or ### for headings
        - Use bold text for important points and key phrases
        - Ensure proper paragraph breaks for readability
        - Keep [EXTERNAL_LINK_X] and [INTERNAL_LINK_X] placeholders as-is
        
        The tone should be conversational, helpful, and show personality - like an experienced blogger who really knows this topic.
        Include humor, rhetorical questions, and varied sentence structures to make it feel authentic.
      `

      const fallbackFirstHalf = await callAzureOpenAI(fallbackFirstHalfPrompt, 1500, 0.8)

      const fallbackSecondHalfPrompt = `
        I'm continuing to write a blog post about ${nicheInfo} with the title:
        
        How to Boost Your Results in ${industryInfo}
        
        Here's the first half of the blog post I've already written:
        
        "${fallbackFirstHalf}"
        
        Now I need to write the second half (approximately 750 words) to complete the 1500-word blog post. Include:
        1. The remaining 2-3 main sections with clear headings
        2. A personal anecdote or case study
        3. A strong conclusion with a call-to-action
        4. One placeholder for an external link ([EXTERNAL_LINK_3]) to a relevant industry resource
        5. One placeholder for an internal link ([INTERNAL_LINK_3]) to a page on ${websiteUrl}
        
        IMPORTANT FORMATTING INSTRUCTIONS:
        - Make all headings bold by surrounding them with ** (e.g., **Heading**)
        - Use proper numbered lists (1., 2., 3.) and bullet points (-)
        - Don't use markdown symbols like # or ### for headings
        - Use bold text for important points and key phrases
        - Ensure proper paragraph breaks for readability
        - Keep [EXTERNAL_LINK_X] and [INTERNAL_LINK_X] placeholders as-is
        - Make sure the conclusion is clearly marked with a bold heading like **Conclusion**
        
        Continue with the same conversational, helpful tone established in the first half.
      `

      const fallbackSecondHalf = await callAzureOpenAI(fallbackSecondHalfPrompt, 1500, 0.8)

      const fallbackFullContent = `${fallbackFirstHalf}\n\n${fallbackSecondHalf}`

      const fallbackExternalLinks = [
        { text: "Industry Report", url: "https://example.com/industry-report" },
        { text: "Market Trends", url: "https://example.com/market-trends" },
        { text: "Case Study", url: "https://example.com/case-study" },
      ]

      const fallbackInternalLinks = [
        { text: "About Us", url: `${websiteUrl}` },
        { text: "Pricing Plans", url: `${websiteUrl}` },
        { text: "Contact Support", url: `${websiteUrl}` },
      ]

      console.log("Performing final humanization on fallback content with FAQs and images...")
      const humanizedFallbackContent = await finalHumanization(
        fallbackFullContent,
        fallbackFAQs,
        imageUrls,
        fallbackExternalLinks,
        fallbackInternalLinks,
      )
      console.log("Fallback humanization with images completed successfully")

      const contentToSave = humanizedFallbackContent
      let contentToReturn = humanizedFallbackContent

      if (isFreeBlog) {
        contentToReturn = blurContent(humanizedFallbackContent)
      }

      console.log(`Saving fallback blog post to database for user ${userId}...`)
      const { data: savedBlog, error: saveError } = await supabase
        .from("blogs")
        .insert({
          user_id: userId,
          title: "How to Boost Your Results in ${industryInfo}",
          blog_post: contentToSave,
          is_blurred: isFreeBlog,
          created_at: new Date().toISOString(),
          url: websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`,
        })
        .select()

      if (saveError) {
        console.error(`Error saving fallback blog post: ${saveError.message}`)
      } else {
        if (isFreeBlog) {
          console.log(`Updating free blog count for user ${userId}...`)
          const { error: updateError } = await supabase
            .from("subscriptions")
            .update({ free_blogs_generated: 1 })
            .eq("user_id", userId)

          if (updateError) {
            console.error(`Error updating free blog count: ${updateError.message}`)
          }
        } else if (isPlanActive) {
          console.log(`Deducting credits for user ${userId}...`)
          const newCredits = subscription.credits - 1
          const { error: updateError } = await supabase
            .from("subscriptions")
            .update({ credits: newCredits })
            .eq("user_id", userId)

          if (updateError) {
            console.error(`Error updating credits: ${updateError.message}`)
          }
        }
      }

      return {
        headline: "How to Boost Your Results in ${industryInfo}",
        content: contentToReturn,
        initialContent: `${fallbackFullContent}\n\n${fallbackFAQs}`,
        researchSummary: "Generated using fallback method due to research issues.",
        imageUrls: imageUrls,
        is_blurred: isFreeBlog,
      }
    } catch (fallbackError: any) {
      console.error("Fallback generation failed:", fallbackError)
      throw new Error(
        `Failed to generate blog content: ${fallbackError?.message || "Unknown error in fallback generation"}`,
      )
    }
  }
}
