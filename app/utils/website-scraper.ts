import axios from "axios"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function scrapeWebsite(url: string): Promise<{ content: string; summary: string }> {
  try {
    console.log(`Attempting to scrape website: ${url}`)
    const response = await axios.post(
      "https://ai-content-scraper.p.rapidapi.com/scrape",
      { url },
      {
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": "ai-content-scraper.p.rapidapi.com",
          "Content-Type": "application/json",
        },
      },
    )

    console.log("Scraping successful. Processing content...")
    const scrapedContent = response.data.content

    if (!scrapedContent || scrapedContent.trim() === "") {
      throw new Error("Scraped content is empty")
    }

    // Generate summary using Gemini
    console.log("Generating summary with Gemini...")
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const summaryPrompt = `Summarize the following website content in 3-5 sentences:

    ${scrapedContent.slice(0, 2000)}`

    const summaryResult = await model.generateContent(summaryPrompt)
    const summary = summaryResult.response.text()

    console.log("Summary generated successfully")
    return { content: scrapedContent, summary }
  } catch (error) {
    console.error("Error in scrapeWebsite:", error)
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data)
      throw new Error(`Failed to scrape website: ${error.message}. Status: ${error.response?.status}`)
    }
    throw new Error(`Failed to scrape website: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

