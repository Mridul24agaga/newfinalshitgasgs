import axios from "axios"

interface KeywordDifficulty {
  keyword: string
  difficulty: number
}

export async function checkKeywordDifficulty(keywords: string[]): Promise<KeywordDifficulty[]> {
  const results: KeywordDifficulty[] = []

  for (const keyword of keywords) {
    try {
      const result = await checkSingleKeywordDifficulty(keyword)
      results.push(result)
    } catch (error) {
      console.error(`Error checking difficulty for keyword "${keyword}":`, error)
    }
    // Add a small delay between requests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return results
}

async function checkSingleKeywordDifficulty(keyword: string): Promise<KeywordDifficulty> {
  const response = await axios.post(
    "https://keyword-difficulty-api.p.rapidapi.com/keyword-difficulty",
    { keyword },
    {
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "keyword-difficulty-api.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    },
  )

  return { keyword, difficulty: response.data.difficulty }
}

