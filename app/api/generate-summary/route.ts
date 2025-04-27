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
      temperature: 0.7,
      n: 1,
    })

    const result = completion.choices[0]?.message?.content || ""
    console.log(`OpenAI response: ${result.slice(0, 100)}${result.length > 100 ? "..." : ""}`)
    return result
  } catch (error: any) {
    console.error("Error calling Azure OpenAI:", error.message)
    return `Unable to generate analysis due to ${error.message}. Please try again later.`
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

// Function to create professional website summaries
async function createProfessionalSummary(content: string, url: string): Promise<string> {
  try {
    console.log("Creating professional summary...")

    const professionalPrompt = `
      Create a professional, comprehensive summary of this website that would be valuable for business analysis.
      
      Guidelines:
      - Use professional, polished language
      - Maintain an objective, analytical tone
      - Structure the summary in clear, well-organized paragraphs
      - Focus on factual observations rather than opinions
      - Highlight the business purpose, target audience, and key offerings
      - Include insights about the website's positioning and value proposition
      - Identify the industry sector and market positioning
      - Keep the analysis concise yet thorough (4-5 paragraphs maximum)
      
      The summary should cover:
      - Primary business purpose and core offerings
      - Target audience and customer segments
      - Key value propositions and differentiators
      - Industry context and market positioning
      - Overall professional assessment of the website's effectiveness
      
      Website URL: ${url}
      Website Content:
      ${content.slice(0, 8000)}
    `

    const professionalSummary = await callAzureOpenAI(professionalPrompt, 1200)
    console.log("Professional summary created")

    return professionalSummary
  } catch (error: any) {
    console.error("Error creating professional summary:", error.message)

    // Fallback to a simpler summary if the process fails
    const fallbackPrompt = `Provide a concise, professional summary of this website content: ${content.slice(0, 1000)}`
    try {
      return await callAzureOpenAI(fallbackPrompt, 800)
    } catch {
      return `We were unable to complete a full analysis of ${url} at this time. Please try again later.`
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

    // If we still don't have good content, generate a professional error message
    if (websiteContent.length < 100 || websiteContent.startsWith("Failed to scrape content")) {
      const summary = `We were unable to access the website at ${validatedUrl} for analysis. This could be due to:

1. Access restrictions or security measures on the website
2. Authentication requirements
3. Temporary website unavailability
4. URL configuration issues

Recommendations:
- Verify the URL is correct and publicly accessible
- Ensure the website doesn't require login credentials
- Try again at a later time
- Consider providing alternative website information for analysis`

      return NextResponse.json({ summary })
    }

    // Create a professional summary
    const professionalSummary = await createProfessionalSummary(websiteContent, validatedUrl)

    return NextResponse.json({ summary: professionalSummary })
  } catch (error: any) {
    console.error("Error in generate-summary API route:", error.message)
    return NextResponse.json({ error: "Failed to generate summary", details: error.message }, { status: 500 })
  }
}
