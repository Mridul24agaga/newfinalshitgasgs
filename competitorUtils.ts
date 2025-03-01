import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function analyzeCompetitors(keyword: string): Promise<any[]> {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Analyze competitors for the keyword: ${keyword}`,
    maxTokens: 500,
  })
  return JSON.parse(text)
}

export async function trackRankings(keywords: string[]): Promise<any[]> {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Track rankings for these keywords: ${keywords.join(", ")}`,
    maxTokens: 500,
  })
  return JSON.parse(text)
}

