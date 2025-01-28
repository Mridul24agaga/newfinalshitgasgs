"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function analyzeKeywords(keywords: string[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  const prompt = `
    Analyze the following list of keywords and select the top 15 most relevant and valuable for SEO:
    ${keywords.join(", ")}

    Consider the following criteria:
    1. Search volume potential
    2. Relevance to the topic
    3. Commercial intent (if applicable)
    4. Long-tail keyword opportunities
    5. Trending topics

    Return only a comma-separated list of the top 15 keywords, no explanations or numbering.
  `

  const result = await model.generateContent(prompt)
  const analyzedKeywords = result.response
    .text()
    .split(",")
    .map((k) => k.trim())

  return analyzedKeywords
}

