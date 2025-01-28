import axios from "axios"

interface RedditPost {
  title: string
  text: string
}

interface ScrapedData {
  content: string
  keywords: string[]
}

export async function scrapeReddit(topic: string): Promise<ScrapedData> {
  try {
    console.log(`Attempting to scrape Reddit for topic: ${topic}`)
    const response = await axios.get<RedditPost[]>("https://reddit-scraper2.p.rapidapi.com/sub_posts", {
      params: {
        sub: "SaaS",
        sort: "TOP",
        time: "ALL",
      },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "reddit-scraper2.p.rapidapi.com",
      },
    })

    console.log("Reddit scraping successful. Processing content...")
    const posts = response.data
    const relevantContent = posts.map((post: RedditPost) => `${post.title}\n${post.text}`).join("\n\n")

    if (!relevantContent || relevantContent.trim() === "") {
      throw new Error("Scraped Reddit content is empty")
    }

    // Extract keywords
    const words = relevantContent.toLowerCase().split(/\W+/)
    const wordCounts: Record<string, number> = words.reduce((acc: Record<string, number>, word: string) => {
      if (word.length > 3) {
        acc[word] = (acc[word] || 0) + 1
      }
      return acc
    }, {})

    const keywords = Object.entries(wordCounts)
      .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
      .slice(0, 20)
      .map(([word]: [string, number]) => word)

    console.log(`Extracted ${keywords.length} keywords from Reddit content`)
    return { content: relevantContent, keywords }
  } catch (error) {
    console.error("Error in scrapeReddit:", error)
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data)
      throw new Error(`Failed to scrape Reddit: ${error.message}. Status: ${error.response?.status}`)
    }
    throw new Error(`Failed to scrape Reddit: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

