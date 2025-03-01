import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function generateInternalLinkSuggestions(content: string, url: string): Promise<any[]> {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Suggest internal linking opportunities for:
URL: ${url}
Content: ${content}`,
    maxTokens: 500,
  })
  return JSON.parse(text)
}

export async function analyzeExternalLinks(content: string): Promise<any[]> {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Analyze external links in: ${content}`,
    maxTokens: 500,
  })
  return JSON.parse(text)
}

