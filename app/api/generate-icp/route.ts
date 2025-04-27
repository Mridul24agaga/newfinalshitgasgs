import { NextResponse, type NextRequest } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client (ensure API key is set in environment variables)
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: process.env.AZURE_OPENAI_API_BASE_PATH_GPT4O_MINI,
  defaultQuery: { "api-version": "2024-02-01" },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY },
})

// Define the ICP interface
interface ICP {
  industries: string[]
  companySize: string
  jobTitles: string[]
  painPoints: string[]
  goals: string[]
  budget: string
  technographics: string[]
  geographics: string[]
  buyingProcess: string
}

async function generateICPWithAzureOpenAI(url: string, summary: string): Promise<ICP> {
  // Create a prompt for OpenAI to generate an ICP based on the website summary
  const prompt = `
    You are an expert business analyst and marketing strategist. Based on the following website summary, create a detailed Ideal Customer Profile (ICP).
    
    Website URL: ${url}
    
    Website Summary:
    ${summary}
    
    Generate a comprehensive Ideal Customer Profile with the following sections:
    1. Target Industries (list of industries that would benefit most from this product/service)
    2. Company Size (typical employee count and revenue range)
    3. Key Decision Makers (job titles of people who would make purchasing decisions)
    4. Pain Points (specific problems these customers face that this product/service solves)
    5. Goals (what these customers are trying to achieve)
    6. Budget Range (how much these customers typically spend on solutions like this)
    7. Technology Stack (technologies these customers typically use)
    8. Geographic Focus (primary regions/countries where these customers are located)
    9. Buying Process (how these customers typically make purchasing decisions)
    
    Format your response as a JSON object with the following structure:
    {
      "industries": ["Industry 1", "Industry 2", ...],
      "companySize": "Description of company size",
      "jobTitles": ["Job Title 1", "Job Title 2", ...],
      "painPoints": ["Pain Point 1", "Pain Point 2", ...],
      "goals": ["Goal 1", "Goal 2", ...],
      "budget": "Budget range description",
      "technographics": ["Technology 1", "Technology 2", ...],
      "geographics": ["Region 1", "Region 2", ...],
      "buyingProcess": "Description of buying process"
    }
    
    IMPORTANT: Your response must be valid JSON only, with no additional text before or after the JSON.
  `

  // Maximum number of retries
  const MAX_RETRIES = 3
  let retryCount = 0
  let lastError = null

  while (retryCount < MAX_RETRIES) {
    try {
      console.log(`ICP generation attempt ${retryCount + 1}/${MAX_RETRIES}`)

      // Call Azure OpenAI with increased temperature for more creativity
      const response = await callAzureOpenAI(prompt, 2000)

      // Find JSON in the response (in case there's additional text)
      const jsonMatch = response.match(/\{[\s\S]*\}/)

      if (!jsonMatch) {
        throw new Error("No JSON object found in the response")
      }

      try {
        // Parse the JSON response
        const icpData = JSON.parse(jsonMatch[0]) as ICP

        // Validate the ICP data structure
        if (!validateIcpData(icpData)) {
          throw new Error("Invalid ICP data structure")
        }

        console.log("Successfully generated and validated ICP data")
        return icpData
      } catch (parseError: any) {
        console.error("JSON parse error:", parseError.message)
        console.log("Raw response:", response)

        // If this is the last retry, try to extract a partial result
        if (retryCount === MAX_RETRIES - 1) {
          try {
            // Try to fix common JSON issues
            const fixedJson = fixJsonString(response)
            const partialData = JSON.parse(fixedJson) as Partial<ICP>

            // Create a complete ICP with fallback values for missing fields
            return createFallbackIcp(partialData, url)
          } catch (fallbackError) {
            console.error("Failed to create fallback ICP:", fallbackError)
            // Continue to throw the original error
          }
        }

        throw parseError
      }
    } catch (error: any) {
      lastError = error
      console.error(`Attempt ${retryCount + 1} failed:`, error.message)

      // Increase retry count and wait before retrying
      retryCount++
      if (retryCount < MAX_RETRIES) {
        // Exponential backoff: wait longer with each retry
        const waitTime = 2000 * Math.pow(2, retryCount - 1)
        console.log(`Waiting ${waitTime}ms before retry ${retryCount + 1}...`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
      }
    }
  }

  // If we've exhausted all retries, return a fallback ICP
  console.error("All ICP generation attempts failed, using fallback ICP")
  return createDefaultFallbackIcp(url)
}

// Helper function to validate ICP data structure
function validateIcpData(data: any): data is ICP {
  return (
    data &&
    Array.isArray(data.industries) &&
    data.industries.length > 0 &&
    typeof data.companySize === "string" &&
    data.companySize.trim() !== "" &&
    Array.isArray(data.jobTitles) &&
    data.jobTitles.length > 0 &&
    Array.isArray(data.painPoints) &&
    data.painPoints.length > 0 &&
    Array.isArray(data.goals) &&
    data.goals.length > 0 &&
    typeof data.budget === "string" &&
    data.budget.trim() !== "" &&
    Array.isArray(data.technographics) &&
    data.technographics.length > 0 &&
    Array.isArray(data.geographics) &&
    data.geographics.length > 0 &&
    typeof data.buyingProcess === "string" &&
    data.buyingProcess.trim() !== ""
  )
}

// Helper function to attempt to fix common JSON formatting issues
function fixJsonString(jsonString: string): string {
  // Try to extract just the JSON part
  const jsonMatch = jsonString.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("No JSON object found in the string")
  }

  let json = jsonMatch[0]

  // Replace single quotes with double quotes
  json = json.replace(/'/g, '"')

  // Fix missing quotes around property names
  json = json.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')

  // Remove trailing commas in arrays and objects
  json = json.replace(/,\s*([}\]])/g, "$1")

  return json
}

// Helper function to create a fallback ICP with partial data
function createFallbackIcp(partialData: Partial<ICP>, url: string): ICP {
  const domainMatch = url.match(/^(?:https?:\/\/)?(?:www\.)?([^/]+)/i)
  const domain = domainMatch ? domainMatch[1] : "unknown domain"

  return {
    industries: partialData.industries || ["Technology", "Software", "Digital Services"],
    companySize: partialData.companySize || "Small to medium businesses (10-500 employees)",
    jobTitles: partialData.jobTitles || ["CEO", "CTO", "Marketing Director", "Operations Manager"],
    painPoints: partialData.painPoints || [
      "Difficulty reaching target audience",
      "Inefficient processes",
      "Lack of digital transformation",
    ],
    goals: partialData.goals || ["Increase revenue", "Improve efficiency", "Expand market reach"],
    budget: partialData.budget || "Mid-range budget ($10,000 - $50,000)",
    technographics: partialData.technographics || ["Cloud services", "CRM software", "Marketing automation"],
    geographics: partialData.geographics || ["North America", "Europe", "Global"],
    buyingProcess: partialData.buyingProcess || "Committee-based decision making with 2-3 month sales cycle",
  }
}

// Helper function to create a default fallback ICP when all else fails
function createDefaultFallbackIcp(url: string): ICP {
  const domainMatch = url.match(/^(?:https?:\/\/)?(?:www\.)?([^/]+)/i)
  const domain = domainMatch ? domainMatch[1] : "unknown domain"

  return {
    industries: ["Technology", "Software", "Digital Services"],
    companySize: "Small to medium businesses (10-500 employees)",
    jobTitles: ["CEO", "CTO", "Marketing Director", "Operations Manager"],
    painPoints: ["Difficulty reaching target audience", "Inefficient processes", "Lack of digital transformation"],
    goals: ["Increase revenue", "Improve efficiency", "Expand market reach"],
    budget: "Mid-range budget ($10,000 - $50,000)",
    technographics: ["Cloud services", "CRM software", "Marketing automation"],
    geographics: ["North America", "Europe", "Global"],
    buyingProcess: "Committee-based decision making with 2-3 month sales cycle",
  }
}

// Helper function to call Azure OpenAI
async function callAzureOpenAI(prompt: string, maxTokens: number): Promise<string> {
  try {
    console.log(`Calling OpenAI: ${prompt.slice(0, 100)}${prompt.length > 100 ? "..." : ""}`)

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      max_tokens: maxTokens,
      temperature: 0.7, // Slightly lower temperature for more consistent outputs
      n: 1,
      response_format: { type: "json_object" }, // Request JSON format specifically
    })

    const result = completion.choices[0]?.message?.content || ""
    console.log(`OpenAI response length: ${result.length} characters`)

    if (!result || result.trim() === "") {
      throw new Error("Empty response from OpenAI API")
    }

    return result
  } catch (error: any) {
    // Handle specific OpenAI API errors
    if (error.status === 429) {
      console.error("Rate limit exceeded with Azure OpenAI")
      throw new Error("Rate limit exceeded with Azure OpenAI. Please try again later.")
    } else if (error.status >= 500) {
      console.error("Azure OpenAI service error:", error.message)
      throw new Error("Azure OpenAI service is currently experiencing issues. Please try again later.")
    }

    console.error("Error calling Azure OpenAI:", error.message)
    throw new Error(`Failed to generate content: ${error.message}`)
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url")
    const summary = request.nextUrl.searchParams.get("summary")

    if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
    }

    // If we have a summary, use it; otherwise, we'd need to fetch and analyze the website
    if (!summary) {
      return NextResponse.json({ error: "Summary parameter is required" }, { status: 400 })
    }

    try {
      // Generate ICP using Azure OpenAI based on the website summary
      const icp = await generateICPWithAzureOpenAI(url, summary)

      return NextResponse.json({
        url,
        icp,
        message: "Ideal Customer Profile generated successfully",
      })
    } catch (error: any) {
      console.error("Error in ICP generation:", error.message)

      // Create a fallback ICP even when there's an error
      const fallbackIcp = createDefaultFallbackIcp(url)

      // Return the fallback ICP with a warning message
      return NextResponse.json({
        url,
        icp: fallbackIcp,
        message: "Using fallback ICP due to generation error",
        warning: error.message || "Unknown error in ICP generation",
      })
    }
  } catch (error: any) {
    console.error("Error in API route:", error.message)

    // Create a fallback ICP even for unexpected errors
    const url = request.nextUrl.searchParams.get("url") || "unknown"
    const fallbackIcp = createDefaultFallbackIcp(url)

    // Return the fallback ICP with an error message
    return NextResponse.json({
      url,
      icp: fallbackIcp,
      message: "Using fallback ICP due to API error",
      error: error.message || "Unknown error in API route",
    })
  }
}
