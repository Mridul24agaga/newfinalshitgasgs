import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import * as cheerio from "cheerio"

// Initialize OpenAI client (server-side only)
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY as string,
  baseURL: process.env.AZURE_OPENAI_API_BASE_PATH_GPT4O_MINI,
  defaultQuery: { "api-version": "2024-02-15-preview" },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY },
})

// Helper function to call Azure OpenAI
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

// Improved direct website scraping function
async function scrapeWebsite(url: string): Promise<string> {
  try {
    console.log(`Scraping website: ${url}`)

    // Fetch the website content directly
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        Referer: "https://www.google.com/",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      next: { revalidate: 0 }, // Disable caching
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.statusText}`)
    }

    const html = await response.text()

    // Parse the HTML with cheerio
    const $ = cheerio.load(html)

    // Remove script and style elements
    $("script, style, iframe, noscript").remove()

    // Extract the text content
    const title = $("title").text().trim()
    const metaDescription = $('meta[name="description"]').attr("content") || ""

    // Get text from body, focusing on main content areas
    let bodyText = ""
    $("body p, body h1, body h2, body h3, body h4, body h5, body h6, body li").each((_, element) => {
      const text = $(element).text().trim()
      if (text) {
        bodyText += text + "\n"
      }
    })

    // Combine all the content
    const content = `
      Title: ${title}
      Description: ${metaDescription}
      
      Content:
      ${bodyText}
    `.trim()

    console.log(`Successfully scraped website. Content length: ${content.length} characters`)
    return content
  } catch (error: any) {
    console.error("Error scraping website:", error.message)
    return `Failed to scrape content from ${url}: ${error.message}`
  }
}

// Function to create ultra-natural, casual summaries that don't sound AI-generated
async function createUltraNaturalSummary(content: string, url: string): Promise<string> {
  try {
    console.log("Creating ultra-natural summary...")

    const naturalPrompt = `
      I need you to write a SUPER casual, completely natural summary of this website that sounds like a real person just texting their friend about it. 
      
      IMPORTANT: This should NOT sound like an AI wrote it AT ALL. It should sound like a real human who just checked out the website and is sharing their thoughts.
      
      Make it:
      - Use casual language, slang, and the occasional typo (but not too many)
      - Include personal reactions and opinions
      - Have some sentence fragments and run-ons (like real people write)
      - Use contractions, abbreviations, and casual punctuation
      - Include filler words occasionally (like, you know, actually, basically)
      - Add personality quirks (excitement, skepticism, humor)
      - Mention 1-2 specific things from the website that caught your attention
      - Keep paragraphs short and conversational
      - Avoid ANY formal language or perfect grammar
      - NEVER use phrases that sound like marketing copy
      
      The summary should cover:
      - What the website is about (in casual terms)
      - What they offer or do
      - Who it seems to be for
      - Your honest impression of it
      
      Website URL: ${url}
      Website Content:
      ${content.slice(0, 8000)}
      
      Remember: This should read like a text message or casual email from a friend, NOT like a professional review or AI-generated content.
    `

    const naturalSummary = await callAzureOpenAI(naturalPrompt, 1200)
    console.log("Ultra-natural summary created")

    return naturalSummary
  } catch (error: any) {
    console.error("Error creating ultra-natural summary:", error.message)

    // Fallback to a simple summary if the process fails
    const fallbackPrompt = `Summarize this website content in a very casual, conversational way: ${content.slice(0, 1000)}`
    try {
      return await callAzureOpenAI(fallbackPrompt, 800)
    } catch {
      return `So I checked out this website (${url}) and it seems to be about ${content.slice(0, 100)}... [couldn't get more details right now]`
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
    }

    // Validate URL format
    let validatedUrl: string
    try {
      validatedUrl = new URL(url).toString()
    } catch (e) {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Scrape website content directly
    let websiteContent = await scrapeWebsite(validatedUrl)

    // Check if we got meaningful content
    if (websiteContent.startsWith("Failed to scrape content")) {
      console.log("Scraping failed, trying fallback method...")

      // Try a fallback approach - use our existing scrape API
      try {
        const scrapeResponse = await fetch(
          `${process.env.VERCEL_URL || "http://localhost:3000"}/api/scrape?url=${encodeURIComponent(validatedUrl)}`,
        )
        if (scrapeResponse.ok) {
          const data = await scrapeResponse.json()
          if (data.content && data.content.length > 100) {
            console.log("Successfully got content from scrape API")
            websiteContent = data.content
          }
        }
      } catch (fallbackError) {
        console.error("Fallback scraping also failed:", fallbackError)
      }
    }

    // If we still don't have good content, generate a casual error message
    if (websiteContent.length < 100 || websiteContent.startsWith("Failed to scrape content")) {
      const summary = `Hey, so I tried to check out that site (${validatedUrl}) but couldn't really get in. Could be a few things:

Maybe the site blocks bots (happens a lot these days)
Might need a login to see the good stuff
Could be down right now
Or maybe the URL got typed wrong?

If you still want me to take a look, maybe try:
- A different URL
- Copy/paste some of the content directly
- Just tell me what the site is about and I can work with that!`

      return NextResponse.json({ summary })
    }

    // Create an ultra-natural, casual summary that doesn't sound AI-generated
    const ultraNaturalSummary = await createUltraNaturalSummary(websiteContent, validatedUrl)

    return NextResponse.json({ summary: ultraNaturalSummary })
  } catch (error: any) {
    console.error("Error in generate-summary API route:", error.message)
    return NextResponse.json({ error: "Failed to generate summary", details: error.message }, { status: 500 })
  }
}

