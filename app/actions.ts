"use server"

export async function generateBlog(websiteUrl: string) {
  try {
    // Step 1: Deep research with Sonar-deep-research
    console.log("Starting deep research with Sonar-deep-research...")

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 1 minute timeout

    try {
      // Using the correct Perplexity API endpoint without the /v1 prefix
      const deepResearchResponse = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        },
        body: JSON.stringify({
          model: "sonar-deep-research",
          messages: [
            {
              role: "system",
              content:
                "You are a web researcher. Provide a concise analysis of the website and identify key topics and trends.",
            },
            {
              role: "user",
              content: `Research this website: ${websiteUrl}. Identify: 1) Main purpose and topics 2) Target audience 3) Top 3 trending topics related to this site 4) 5 key keywords. Be concise.`,
            },
          ],
          temperature: 0.3,
          max_tokens: 800, // Reduced token count for faster response
        }),
      })

      clearTimeout(timeoutId)

      if (!deepResearchResponse.ok) {
        throw new Error(`Research API error: ${deepResearchResponse.status} ${deepResearchResponse.statusText}`)
      }

      const deepResearchData = await deepResearchResponse.json()
      const researchResults = deepResearchData.choices?.[0]?.message?.content || ""
      console.log("Research completed successfully")

      // Step 2: Generate blog with standard Sonar
      console.log("Generating blog content with Sonar...")

      const blogController = new AbortController()
      const blogTimeoutId = setTimeout(() => blogController.abort(), 60000) // 1 minute timeout

      // Extract only the essential information from research to reduce context size
      const researchSummary =
        researchResults.length > 1500 ? researchResults.substring(0, 1500) + "..." : researchResults

      // Using the correct Perplexity API endpoint without the /v1 prefix
      const blogResponse = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        signal: blogController.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        },
        body: JSON.stringify({
          model: "sonar",
          messages: [
            {
              role: "system",
              content: "You are a blog writer. Create a well-structured blog post with markdown formatting.",
            },
            {
              role: "user",
              content: `Based on this research: "${researchSummary}"

Write a 1000-1500 word blog post with:
1. A compelling headline (format as # Headline)
2. Clear introduction
3. 3-4 main sections with ## subheadings
4. Conclusion with call-to-action
5. Use markdown formatting
6. Include relevant keywords naturally`,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000, // Reduced for faster generation
        }),
      })

      clearTimeout(blogTimeoutId)

      if (!blogResponse.ok) {
        throw new Error(`Blog generation API error: ${blogResponse.status} ${blogResponse.statusText}`)
      }

      const blogData = await blogResponse.json()
      const blogContent = blogData.choices?.[0]?.message?.content || ""
      console.log("Blog generation completed successfully")

      // Extract headline from the markdown content
      const headlineMatch = blogContent.match(/^#\s+(.+)$/m)
      const headline = headlineMatch ? headlineMatch[1] : "Generated Blog Post"

      return {
        headline,
        content: blogContent,
      }
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error("API request error:", fetchError)

      // Fallback to single API call if the two-step process fails
      console.log("Attempting fallback to single API call...")

      const fallbackController = new AbortController()
      const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 90000) // 1.5 minute timeout

      // Using the correct Perplexity API endpoint without the /v1 prefix
      const fallbackResponse = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        signal: fallbackController.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        },
        body: JSON.stringify({
          model: "sonar",
          messages: [
            {
              role: "system",
              content: "You are an expert content creator who can research websites and create blog posts.",
            },
            {
              role: "user",
              content: `Research the website ${websiteUrl} and create a 1000-1500 word blog post based on its content and industry trends.
              
The blog should:
1. Start with a compelling headline (format as # Headline)
2. Have an introduction, 3-4 main sections with ## subheadings, and conclusion
3. Include relevant keywords naturally
4. Use proper markdown formatting
5. Be informative and engaging`,
            },
          ],
          temperature: 0.7,
          max_tokens: 2500,
        }),
      })

      clearTimeout(fallbackTimeoutId)

      if (!fallbackResponse.ok) {
        throw new Error(`Fallback API error: ${fallbackResponse.status} ${fallbackResponse.statusText}`)
      }

      const fallbackData = await fallbackResponse.json()
      const fallbackContent = fallbackData.choices?.[0]?.message?.content || ""

      // Extract headline from the markdown content
      const fallbackHeadlineMatch = fallbackContent.match(/^#\s+(.+)$/m)
      const fallbackHeadline = fallbackHeadlineMatch ? fallbackHeadlineMatch[1] : "Generated Blog Post"

      return {
        headline: fallbackHeadline,
        content: fallbackContent,
      }
    }
  } catch (error) {
    console.error("Error generating blog:", error)
    throw new Error(`Failed to generate blog content: ${error.message}`)
  }
}
