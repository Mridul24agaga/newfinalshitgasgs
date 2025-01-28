"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { checkKeywordDifficulty } from "../utils/check-keyword-difficulty"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateContent(
  websiteSummary: string,
  websiteContent: string,
  redditContent: string,
  keywords: string[],
): Promise<{ headlines: string[]; blogPost: string }> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  // Check keyword difficulty
  const keywordDifficulties = await checkKeywordDifficulty(keywords)
  const lowDifficultyKeywords = keywordDifficulties
    .filter((kw) => kw.difficulty < 30)
    .sort((a, b) => a.difficulty - b.difficulty)
    .slice(0, 10)
    .map((kw) => kw.keyword)

  const headlinesPrompt = `Based on the following website summary and related Reddit content, generate 5 catchy, SEO-optimized headlines for blog posts. Use these low-difficulty keywords where appropriate: ${lowDifficultyKeywords.join(", ")}

  Website Summary:
  ${websiteSummary}

  Related Reddit Content:
  ${redditContent}

  Generate 5 headlines that are likely to rank well in Google search results:`

  const headlinesResult = await model.generateContent(headlinesPrompt)
  const headlines = headlinesResult.response
    .text()
    .split("\n")
    .filter((line) => line.trim() !== "")

  const blogPostPrompt = `Write a comprehensive, SEO-optimized blog post of approximately 3000 words based on the following website content and related Reddit discussions. The blog post should be informative, engaging, and designed to rank well in Google search results.

  Website Content:
  ${websiteContent}

  Related Reddit Content:
  ${redditContent}

  Use these low-difficulty keywords throughout the content, aiming for a keyword density of 1-2% for each: ${lowDifficultyKeywords.join(", ")}

  Follow these guidelines to create a high-ranking blog post:
  1. Write a compelling introduction that includes the primary keyword and hooks the reader.
  2. Use proper header structure (H2, H3, H4) to organize the content.
  3. Include at least 3 numbered lists and 3 bulleted lists.
  4. Incorporate relevant statistics, data points, or case studies to support your arguments.
  5. Use transition words to improve readability and flow.
  6. Include internal and external linking opportunities (use placeholder URLs for internal links).
  7. Optimize for featured snippets by including short, direct answers to common questions.
  8. Use LSI (Latent Semantic Indexing) keywords related to the main topic.
  9. Write in a conversational yet authoritative tone.
  10. Conclude with a strong call-to-action and summarize key points.
  11. Aim for an average sentence length of 20 words for readability.
  12. Include meta description and title tag suggestions at the end of the post.

  Write a 3000-word blog post that's highly likely to rank well in Google search results:`

  const blogPostResult = await model.generateContent(blogPostPrompt)
  const blogPost = blogPostResult.response.text()

  return { headlines, blogPost }
}

