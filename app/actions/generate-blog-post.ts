"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { scrapeWebsite } from "../utils/website-scraper"
import { retry } from "../utils/helpers"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateBlogPost(url: string, keywords: string[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  // Scrape the website content
  const { content: websiteContent } = await scrapeWebsite(url)

  const prompt = `
    Write a comprehensive, SEO-optimized blog post based on the content of this website:
    ${websiteContent.slice(0, 1000)}
    
    Use the following keywords naturally throughout the content. These are ranked by importance, so prioritize the earlier ones:
    ${keywords.join(", ")}

    Requirements:
    1. Write a catchy title (H1) that includes the main keyword
    2. Create an engaging introduction that hooks the reader and includes the primary keyword
    3. Divide the content into relevant sections using H2 and H3 tags
    4. Include at least one numbered list and one bulleted list
    5. Write in a conversational yet authoritative tone
    6. Aim for around 1500 words
    7. Incorporate relevant statistics or data points if applicable
    8. Include a "Key Takeaways" or "Conclusion" section at the end
    9. Conclude with a strong call-to-action
    10. Optimize for featured snippets where appropriate
    11. Use internal linking where relevant (use placeholder URLs)
    12. Incorporate the top 5 keywords multiple times throughout the content, ensuring they're in important positions (e.g., headings, first/last paragraphs)

    Format the blog post in HTML, using appropriate tags for structure and SEO. Ensure proper use of header tags (H1, H2, H3) for hierarchy.
  `

  const result = await retry(() => model.generateContent(prompt))
  return result.response.text()
}

