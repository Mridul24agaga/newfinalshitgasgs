"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { retry } from "../utils/helpers"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateBlogIdeas(
  url: string,
  keywords: Array<{ keyword: string; difficulty: number; density: number }>,
) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  const prompt = `
    Generate 5 blog post ideas for the website ${url} based on the following keywords:
    ${keywords.map((k) => `${k.keyword} (difficulty: ${k.difficulty}, density: ${k.density}%)`).join(", ")}

    For each blog post idea:
    1. Provide a catchy title
    2. Write a brief description (2-3 sentences)
    3. Suggest 2-3 backlink building strategies specific to this post
    4. Include 2-3 SEO measures to optimize the post

    Format the output as follows:

    1. [Blog Post Title]
       Description: [Brief description]
       Backlink Strategies:
       - [Strategy 1]
       - [Strategy 2]
       - [Strategy 3]
       SEO Measures:
       - [Measure 1]
       - [Measure 2]
       - [Measure 3]

    2. [Next Blog Post Title]
       ...

    Repeat this format for all 5 blog post ideas.
  `

  try {
    const result = await retry(() => model.generateContent(prompt), 3, 5000)
    return result.response.text()
  } catch (error) {
    console.error("Error in generateBlogIdeas:", error)
    throw new Error(`Failed to generate blog ideas: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

