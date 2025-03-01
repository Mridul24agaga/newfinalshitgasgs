import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function performTechnicalSEOAudit(url: string): Promise<any> {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Perform a technical SEO audit for: ${url}`,
    maxTokens: 1000,
  })
  return JSON.parse(text)
}

export async function generateSiteMap(url: string): Promise<string> {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Generate a sitemap for: ${url}`,
    maxTokens: 500,
  })
  return text
}

