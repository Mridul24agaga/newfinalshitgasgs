import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

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

export async function POST(request: NextRequest) {
  try {
    const { url, websiteContent } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Prepare the prompt for OpenAI
    const prompt = `
      I need a comprehensive summary of the following website content. 
      The summary should:
      1. Identify the main purpose of the website
      2. Highlight key products, services, or information offered
      3. Mention the target audience if apparent
      4. Include any unique selling points or differentiators
      5. Be written in a professional, clear, and engaging style
      6. Be around 3-4 paragraphs long

      Website URL: ${url}
      Website Content:
      ${websiteContent ? websiteContent.slice(0, 8000) : "No content provided"}
    `

    // Call Azure OpenAI
    const summary = await callAzureOpenAI(prompt, 1000)

    return NextResponse.json({ summary })
  } catch (error: any) {
    console.error("Error in generate-summary API route:", error.message)
    return NextResponse.json({ error: "Failed to generate summary", details: error.message }, { status: 500 })
  }
}

