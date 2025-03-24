import OpenAI from "openai"

// Azure OpenAI configuration with fallbacks
export const azureOpenAIConfig = {
  apiKey: process.env.AZURE_OPENAI_API_KEY || "",
  baseUrl: process.env.AZURE_OPENAI_API_BASE_URL || process.env.AZURE_OPENAI_API_BASE_PATH_GPT4O_MINI || "",
  deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o-mini",
  apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview",
}

// Initialize OpenAI client with Azure configuration
export const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY as string,
  baseURL: azureOpenAIConfig.baseUrl,
  defaultQuery: { "api-version": azureOpenAIConfig.apiVersion },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY as string },
})

// Check if Azure OpenAI is configured
export const isAzureOpenAIConfigured = () => {
  return !!azureOpenAIConfig.apiKey && !!azureOpenAIConfig.baseUrl
}

// Helper function to call Azure OpenAI API
export async function callAzureOpenAI(prompt: string, maxTokens = 4000): Promise<string> {
  if (!isAzureOpenAIConfigured()) {
    throw new Error("Azure OpenAI API is not configured")
  }

  try {
    console.log(`Calling OpenAI: ${prompt.slice(0, 100)}${prompt.length > 100 ? "..." : ""}`)

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: azureOpenAIConfig.deploymentName,
      max_tokens: maxTokens,
      temperature: 0.7,
      n: 1,
    })

    const result = completion.choices[0]?.message?.content || ""
    console.log(`OpenAI response: ${result.slice(0, 100)}${result.length > 100 ? "..." : ""}`)

    return result
  } catch (error: any) {
    console.error("Error calling Azure OpenAI:", error.message)
    throw new Error(`Azure OpenAI API error: ${error.message}`)
  }
}

