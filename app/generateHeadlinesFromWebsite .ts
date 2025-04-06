"use server"

import { tavily } from "@tavily/core"
import OpenAI from "openai"
import { createClient } from "@/utitls/supabase/server"

// Tavily and OpenAI setup
const TAVILY_API_KEY: string = process.env.TAVILY_API_KEY || "***API_KEY_HIDDEN***"
const tavilyClient = tavily({ apiKey: TAVILY_API_KEY })

const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY as string,
  baseURL: process.env.AZURE_OPENAI_API_BASE_PATH_GPT4O_MINI || "",
  defaultQuery: { "api-version": "2024-02-15-preview" },
  defaultHeaders: { "api-key": "***API_KEY_HIDDEN***" },
})

async function callAzureOpenAI(prompt: string, maxTokens: number): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      max_tokens: maxTokens,
      temperature: 0.9,
      n: 1,
    })
    return completion.choices[0]?.message?.content || ""
  } catch (error: any) {
    console.error("Error calling Azure OpenAI:", error.message)
    return `Fallback: Couldn't generate this part due to ${error.message}.`
  }
}

async function scrapeWithTavily(url: string): Promise<string> {
  try {
    const tavilyResponse = await tavilyClient.search(url, {
      searchDepth: "advanced",
      max_results: 1,
      include_raw_content: true,
    })
    const data = tavilyResponse.results[0] as { rawContent?: string; content?: string }
    if (data?.rawContent) {
      return data.rawContent
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
    }
    if (data?.content) {
      return data.content
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    }
    throw new Error("Tavily failed to fetch usable content")
  } catch (error: any) {
    console.error(`Error scraping ${url} with Tavily:`, error)
    return "No content available"
  }
}

export async function generateHeadlinesFromWebsite(website: string): Promise<string[]> {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error("Yo bro, you gotta be logged in to generate headlines!")
  }

  const userId = user.id

  try {
    console.log(`Yo, scraping ${website} for data-driven headlines for user ${userId}`)
    const websiteContent = await scrapeWithTavily(website)
    if (!websiteContent || websiteContent === "No content available") {
      throw new Error(`Bro, couldn’t scrape ${website}, somethin’ went wrong!`)
    }

    // Extract key data points (stats, trends, etc.) from the content
    const dataPrompt = `
      Yo, dig into this website content: "${websiteContent.slice(0, 5000)}".
      Pull out 5-10 specific data points—stats, trends, numbers, or unique facts.
      Focus on what’s concrete and tied to this site, not generic fluff.
      Return as JSON: [{"point": "45% of users...", "context": "user growth"}, {"point": "3 new tools", "context": "features"}]
    `
    const dataResponse = await callAzureOpenAI(dataPrompt, 300)
    let dataPoints = []
    try {
      dataPoints = JSON.parse(dataResponse.replace(/```json\n?|\n?```/g, "").trim())
    } catch (error) {
      console.error("Error parsing data points:", error)
      dataPoints = [{ point: "some cool shit", context: "site vibe" }]
    }
    console.log(`Extracted data points: ${dataPoints.map((d: any) => d.point).join(", ")}`)

    // Extract key phrases/themes
    const keywordsPrompt = `
      Check this content: "${websiteContent.slice(0, 5000)}".
      Grab 5-10 key phrases that capture the site’s core—specific, not vague.
      Return as JSON: [{"keyword": "term1"}, {"keyword": "term2"}]
    `
    const keywordsResponse = await callAzureOpenAI(keywordsPrompt, 200)
    let keywords = []
    try {
      keywords = JSON.parse(keywordsResponse.replace(/```json\n?|\n?```/g, "").trim()).map((k: { keyword: string }) => k.keyword)
    } catch (error) {
      console.error("Error parsing keywords:", error)
      keywords = [website.split("/").pop() || "site stuff"]
    }
    console.log(`Got keywords: ${keywords.join(", ")}`)

    // Generate 10 data-driven headlines
    const headlinesPrompt = `
      Yo, here’s the website content: "${websiteContent.slice(0, 5000)}".
      Data points: ${dataPoints.map((d: any) => `${d.point} (${d.context})`).join(", ")}.
      Keywords: ${keywords.join(", ")}.
      Generate 10 data-driven, SEO-friendly headlines that slap.
      REQUIREMENTS:
      - Use "What," "How," "When," "These Days," or "X Ways" styles
      - Tie each to specific data points or keywords from this site
      - Keep ‘em edgy, real, 60-70 chars
      - No repeats, no lame shit like "ultimate guide"
      - Examples: "How X Jumped 45% These Days," "5 Ways Y Rules Now"
      - Focus on this site’s unique data and vibe
      Return a JSON array: ["headline1", "headline2"]
    `
    const headlinesResponse = await callAzureOpenAI(headlinesPrompt, 600)
    const cleanedResponse = headlinesResponse.replace(/```json\n?|\n?```/g, "").trim()
    let headlines: string[] = []
    try {
      headlines = JSON.parse(cleanedResponse) as string[]
      if (headlines.length !== 10) throw new Error("Didn’t get 10 headlines, bro!")
    } catch (error) {
      console.error("Error parsing headlines:", error)
      headlines = [
        `What ${keywords[0]} Tells Us These Days`,
        `How ${dataPoints[0]?.point} Changes ${keywords[1]}`,
        `When ${keywords[0]} Hit ${dataPoints[1]?.point}`,
        `${dataPoints[0]?.point} Ways ${keywords[2]} Rules`,
        `How ${keywords[1]} Works These Days`,
        `What’s Up with ${dataPoints[1]?.point} Now`,
        `5 Ways ${keywords[0]} Crushes It in 2025`,
        `When ${keywords[2]} Dropped ${dataPoints[0]?.point}`,
        `How ${dataPoints[1]?.point} Shapes ${keywords[1]}`,
        `What ${keywords[2]} Means These Days`,
      ]
    }

    console.log(`Generated 10 data-driven headlines for ${website}: ${headlines.join(", ")}`)
    return headlines.slice(0, 10)
  } catch (error: any) {
    console.error(`Failed to generate headlines for ${website}: ${error.message}`)
    throw new Error(`Yo, headline generation crashed: ${error.message}`)
  }
}