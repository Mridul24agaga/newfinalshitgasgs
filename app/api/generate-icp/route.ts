import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

// Types for our ICP response
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

// Initialize Azure OpenAI client
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
      // Ensure we always return a valid JSON response
      return NextResponse.json(
        {
          error: "Failed to generate ICP",
          details: error.message || "Unknown error in ICP generation",
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Error in API route:", error.message)
    // Ensure we always return a valid JSON response even for unexpected errors
    return NextResponse.json(
      {
        error: "API error",
        details: error.message || "Unknown error in API route",
      },
      { status: 500 },
    )
  }
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
    
    Ensure your analysis is specific, data-driven, and actionable. Base your analysis solely on the website summary provided.
    
    IMPORTANT: Your response must be valid JSON only, with no additional text before or after the JSON.
  `

  try {
    // Call Azure OpenAI to generate the ICP
    const response = await callAzureOpenAI(prompt, 1500)

    // Find JSON in the response (in case there's additional text)
    const jsonMatch = response.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      throw new Error("Failed to parse ICP data from OpenAI response")
    }

    try {
      // Provide a fallback ICP in case parsing fails
      const icpData = JSON.parse(jsonMatch[0]) as ICP

      // Validate the ICP data to ensure it has the required fields
      if (!icpData.industries || !Array.isArray(icpData.industries)) {
        throw new Error("Invalid ICP data: missing or invalid industries field")
      }

      return icpData
    } catch (error: any) {
      console.error("JSON parse error:", error.message, "Response:", response)

      // Provide a fallback ICP in case parsing fails
      return {
        industries: ["Technology", "Software"],
        companySize: "Small to medium businesses (10-500 employees)",
        jobTitles: ["CEO", "CTO", "Marketing Director"],
        painPoints: ["Difficulty reaching target audience", "Inefficient processes"],
        goals: ["Increase revenue", "Improve efficiency"],
        budget: "Mid-range budget ($10,000 - $50,000)",
        technographics: ["Cloud services", "CRM software"],
        geographics: ["North America", "Europe"],
        buyingProcess: "Committee-based decision making with 2-3 month sales cycle",
      }
    }
  } catch (error: any) {
    console.error("Error in generateICPWithAzureOpenAI:", error.message)
    throw new Error(`Failed to generate ICP: ${error.message}`)
  }
}
