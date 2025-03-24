import { NextResponse } from "next/server"
import OpenAI from "openai"

// Azure OpenAI configuration
const configuration = {
  apiKey: process.env.AZURE_OPENAI_API_KEY || "",
  basePathGPT4oMini: process.env.AZURE_OPENAI_API_BASE_PATH_GPT4O_MINI || "",
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY as string,
  baseURL: configuration.basePathGPT4oMini,
  defaultQuery: { "api-version": "2024-02-15-preview" },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY as string },
})

// Helper function to call Azure OpenAI
async function callAzureOpenAI(prompt: string, maxTokens: number): Promise<string> {
  try {
    console.log(`Calling OpenAI with prompt length: ${prompt.length}`)

    // If content is too large, truncate it
    let finalPrompt = prompt
    if (prompt.length > 100000) {
      console.log("Content too large, truncating...")
      finalPrompt = prompt.slice(0, 100000) + "\n\n[Content truncated due to length]"
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: finalPrompt }],
      model: "gpt-4o-mini",
      max_tokens: maxTokens,
      temperature: 0.7,
      n: 1,
    })

    const result = completion.choices[0]?.message?.content || ""

    // Check if the code appears complete
    if (!result.includes("export default") && !result.includes("function Page")) {
      console.warn("Generated code may be incomplete, adding completion warning")
      return (
        result +
        "\n\n// NOTE: The generated code may be incomplete. Please ensure it has all necessary components and exports."
      )
    }

    return result
  } catch (error: any) {
    console.error("Error calling Azure OpenAI:", error.message)
    return `Error generating code: ${error.message}`
  }
}

// Function to extract just the essential content to reduce tokens
function extractEssentialContent(htmlContent: string): string {
  // Remove script tags
  let content = htmlContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")

  // Remove style tags
  content = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")

  // Remove comments
  content = content.replace(/<!--[\s\S]*?-->/g, "")

  // Extract main headings and paragraphs
  const headings = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || []
  const paragraphs = content.match(/<p[^>]*>.*?<\/p>/gi) || []
  const images = content.match(/<img[^>]*>/gi) || []

  // Combine essential elements
  const essentialContent = [...headings, ...paragraphs.slice(0, 10), ...images.slice(0, 5)].join("\n")

  return essentialContent.length > 0 ? essentialContent : content.slice(0, 20000)
}

export async function POST(request: Request) {
  try {
    const { content, title, seoSettings, ensureComplete = false } = await request.json()

    if (!configuration.apiKey) {
      return NextResponse.json({ error: "Azure OpenAI API key not configured" }, { status: 500 })
    }

    if (!configuration.basePathGPT4oMini) {
      return NextResponse.json({ error: "Azure OpenAI API base path not configured" }, { status: 500 })
    }

    // Extract essential content to reduce tokens
    const essentialContent = extractEssentialContent(content)
    console.log(`Reduced content from ${content.length} to ${essentialContent.length} characters`)

    // Enhanced prompt with emphasis on complete code
    const prompt = `
      Convert this HTML content into a Next.js page with a clean, minimal blog layout.
      
      Title: ${title}
      
      Content: ${essentialContent}
      
      CRITICAL REQUIREMENTS:
      1. You MUST generate COMPLETE, FULLY FUNCTIONAL code that can run without errors
      2. The code MUST include all necessary imports at the top
      3. The code MUST have a proper export statement at the end (export default function...)
      4. Create a clean, minimal blog layout with centered content like the example
      5. Use a max-width container (max-w-4xl) with mx-auto
      6. Center the main title and subtitle
      7. Use proper spacing between sections (my-8)
      8. For blockquotes, use a vertical blue line on the left side
      9. Configure next.config.js to allow images from external domains
      10. Use next/image for all images with proper width/height
      
      IMPORTANT: Your response MUST be a COMPLETE Next.js component that can be copied and used directly.
      DO NOT truncate or abbreviate the code. Include the ENTIRE implementation.
      
      Return ONLY the complete Next.js page component code.
    `

    // Increase token limit for complete code generation
    const generatedCode = await callAzureOpenAI(prompt, 4000)

    // Verify code completeness
    if (ensureComplete && !generatedCode.includes("export default")) {
      // Try one more time with a more explicit prompt
      const retryPrompt = `
        The previous code generation was incomplete. Please generate a COMPLETE Next.js page component.
        
        Title: ${title}
        
        CRITICAL: Your response MUST include:
        1. All necessary imports at the top
        2. A complete component function
        3. An export default statement at the end
        4. All closing brackets and tags
        
        DO NOT truncate or abbreviate any part of the code.
        
        Return ONLY the complete Next.js page component code.
      `

      const completeCode = await callAzureOpenAI(retryPrompt, 4000)
      return NextResponse.json({ generatedCode: completeCode })
    }

    return NextResponse.json({ generatedCode })
  } catch (error: any) {
    console.error("Error generating Next.js code:", error)
    return NextResponse.json(
      { error: `Failed to generate Next.js code: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}

