import { NextResponse } from "next/server"
import axios from "axios"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    // Scrape the website content using ScrapingBee
    const scrapingBeeUrl = `https://app.scrapingbee.com/api/v1/?api_key=${process.env.SCRAPINGBEE_API_KEY}&url=${encodeURIComponent(url)}&render_js=false`

    let websiteContent
    try {
      const response = await axios.get(scrapingBeeUrl, {
        responseType: "text",
        timeout: 30000, // 30 seconds timeout
      })
      websiteContent = response.data
    } catch (error) {
      console.error("ScrapingBee error:", error)
      if (axios.isAxiosError(error)) {
        return NextResponse.json(
          {
            error: `Failed to scrape the website: ${error.message}. Status: ${error.response?.status}. Please check the URL and try again.`,
          },
          { status: 500 },
        )
      }
      return NextResponse.json(
        { error: "Failed to scrape the website. Please check the URL and try again." },
        { status: 500 },
      )
    }

    if (!websiteContent || websiteContent.trim().length === 0) {
      return NextResponse.json(
        { error: "The scraped content is empty. The website might be blocking scraping attempts." },
        { status: 400 },
      )
    }

    // Summarize the content using OpenAI
    let summary
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes web content accurately and concisely.",
          },
          {
            role: "user",
            content: `Summarize the following website content in a concise manner:\n\n${websiteContent}`,
          },
        ],
        max_tokens: 500,
      })
      summary = completion.choices[0].message.content
    } catch (error) {
      console.error("OpenAI error:", error)
      return NextResponse.json({ error: "Failed to generate summary. Please try again later." }, { status: 500 })
    }

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("General error:", error)
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 })
  }
}

