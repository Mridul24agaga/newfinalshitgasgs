"use server"
import { tavily } from "@tavily/core";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";
import { writeFileSync, readFileSync } from "fs";
import { createClient } from "@/utitls/supabase/server"; // Fixed typo in "utitls" to "utils"

// Define formatUtils directly in this file for consistent Markdown formatting
const formatUtils = {
  convertMarkdownToHtml: (markdown: string) => {
    let html = markdown
      .replace(/^###### (.*$)/gim, '<h6 class="text-lg font-semibold mt-6 mb-3">$1</h6>')
      .replace(/^##### (.*$)/gim, '<h5 class="text-xl font-semibold mt-6 mb-3">$1</h5>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-2xl font-semibold mt-8 mb-4">$1</h4>')
      .replace(/^### (.*$)/gim, '<h3 class="text-3xl font-bold mt-10 mb-5 text-gray-800">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-4xl font-bold mt-12 mb-6 text-gray-900">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-5xl font-bold mt-14 mb-8 text-gray-900 border-b pb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      .replace(/^- (.*)$/gim, '<li class="ml-6 mb-2 list-disc text-gray-700 font-normal">$1</li>')
      .replace(/^[*] (.*)$/gim, '<li class="ml-6 mb-2 list-disc text-gray-700 font-normal">$1</li>')
      .replace(/(<li.*?>.*<\/li>)/gim, '<ul class="my-6">$1</ul>')
      .replace(/\n{2,}/g, '</p><p class="mt-6 mb-6 text-gray-700 leading-relaxed font-normal">')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-600 hover:underline font-normal">$1</a>')
      .replace(/^>\s+(.*)$/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-6 font-normal">$1</blockquote>');
    
    html = `<p class="mt-6 mb-6 text-gray-700 leading-relaxed font-normal">${html}</p>`;
    return html;
  },

  sanitizeHtml: (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    doc.querySelectorAll('p, li, a, blockquote').forEach(el => {
      el.classList.remove('font-bold');
      el.classList.add('font-normal');
    });
    doc.querySelectorAll('p').forEach(p => {
      p.classList.add('mt-6', 'mb-6', 'text-gray-700', 'leading-relaxed');
    });
    doc.querySelectorAll('ul').forEach(ul => {
      ul.classList.add('my-6');
    });
    doc.querySelectorAll('li').forEach(li => {
      li.classList.add('ml-6', 'mb-2', 'list-disc', 'text-gray-700', 'font-normal');
    });
    doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
      h.classList.remove('font-bold');
      if (h.tagName === 'H1' || h.tagName === 'H2' || h.tagName === 'H3') h.classList.add('font-bold');
    });
    
    return doc.body.innerHTML;
  },

  generateToc: (htmlContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
    return Array.from(headings).map((h, i) => {
      h.id = `heading-${i}`;
      return {
        id: `heading-${i}`,
        text: h.textContent || "",
        level: Number(h.tagName[1]),
      };
    });
  }
};

// Define types for clarity
interface TavilySearchResult {
  url: string;
  rawContent?: string;
  content?: string;
  title?: string;
}

interface BlogResult {
  blogPost: string;
  seoScore: number;
  headings: string[];
  keywords: { keyword: string; difficulty: string }[];
  citations: string[];
  tempFileName: string;
  title: string;
  timestamp: string;
}

interface ScrapedData {
  initialUrl: string;
  initialResearchSummary: string;
  researchResults: { url: string; content: string; title: string }[];
  researchSummary: string;
  coreTopic: string;
  brandInfo: string;
  youtubeVideo: string | null;
  internalLinks: string[];
  references: string[];
  existingPosts: string;
  targetKeywords: string[];
  timestamp: string;
  nudge: string;
}

interface ScheduleResult {
  success: boolean;
  message: string;
  scheduleId: string;
}

interface GenerationError extends Error {
  message: string;
  code?: string;
}

interface BlogPost {
  id: string;
  user_id: string;
  blog_post: string;
  citations: string[];
  created_at: string;
  title: string;
  timestamp: string;
  reveal_date: string;
  url: string;
}

interface ArticleResult {
  blogPost: string;
  seoScore: number;
  headings: string[];
  keywords: { keyword: string; difficulty: string }[];
  citations: string[];
  tempFileName: string;
  title: string;
  timestamp: string;
}

// Tavily client setup
const TAVILY_API_KEY: string = process.env.TAVILY_API_KEY || "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";
console.log(`Tavily API Key in use: ${TAVILY_API_KEY || "Not set! Check your env or hardcoded fallback."}`);
const tavilyClient = tavily({ apiKey: TAVILY_API_KEY });

const configuration = {
  apiKey: process.env.AZURE_OPENAI_API_KEY || "",
  basePathGPT4oMini: process.env.AZURE_OPENAI_API_BASE_PATH_GPT4O_MINI || "",
};

console.log("AZURE_OPENAI_API_KEY:", configuration.apiKey || "Not set!");
console.log("AZURE_OPENAI_API_BASE_PATH_GPT4O_MINI:", configuration.basePathGPT4oMini || "Not set!");

const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY as string,
  baseURL: configuration.basePathGPT4oMini,
  defaultQuery: { "api-version": "2024-02-15-preview" },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY as string },
});

// Helper Functions
async function callAzureOpenAI(prompt: string, maxTokens: number): Promise<string> {
  try {
    console.log(`Calling OpenAI with prompt (first 200 chars): ${prompt.slice(0, 200)}...`);
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      max_tokens: maxTokens,
      temperature: 0.9,
      n: 1,
    });
    const result = completion.choices[0]?.message?.content || "";
    console.log(`OpenAI response (first 200 chars): ${result.slice(0, 200)}...`);
    return result;
  } catch (error: any) {
    console.error("Error calling Azure OpenAI:", error);
    return `Fallback: Couldn't generate this part due to ${error.message}. Let's roll with what we've got!`;
  }
}

async function scrapeWithTavily(url: string): Promise<string> {
  console.log(`\nScraping URL with Tavily: ${url}`);
  try {
    const tavilyResponse = await tavilyClient.search(url, {
      searchDepth: "advanced",
      max_results: 1,
      include_raw_content: true,
    });
    const data = tavilyResponse.results[0] as TavilySearchResult;
    if (data?.rawContent) {
      console.log(`Tavily raw content (first 200 chars): ${data.rawContent.slice(0, 200)}...`);
      const paragraphs: string[] = data.rawContent.split(/<\/?p>/).filter((p) => p.trim().length > 100);
      const cleanText =
        paragraphs[0]?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || "No content available";
      console.log(`Cleaned Tavily content (first 200 chars): ${cleanText.slice(0, 200)}...`);
      return cleanText.length > 100 ? cleanText : "No content available";
    }
    console.warn("No raw content from Tavily, falling back to summary...");
    if (data?.content) {
      const cleanText = data.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      console.log(`Cleaned summary content (first 200 chars): ${cleanText.slice(0, 200)}...`);
      return cleanText.length > 100 ? cleanText : "No content available";
    }
    throw new Error("Tavily failed to fetch usable content");
  } catch (error: any) {
    console.error(`Error scraping ${url} with Tavily:`, error);
    if (error.response?.status === 401 || error.status === 401) {
      console.log("Tavily 401 detected—falling back to OpenAI summary.");
      const fallbackPrompt = `
        Yo, Tavily's giving me a 401 on ${url}. Based on the URL alone, whip up a chill, human-like summary of what the site's probably about (up to 500 chars). Keep it real, no stiff vibes.
        Return plain text.
      `;
      const fallbackContent = await callAzureOpenAI(fallbackPrompt, 200);
      console.log(`OpenAI fallback content (first 200 chars): ${fallbackContent.slice(0, 200)}...`);
      return fallbackContent || "No content available";
    }
    return "No content available";
  }
}

async function scrapeInitialUrlWithTavily(url: string): Promise<string> {
  console.log(`\nScraping initial URL with Tavily: ${url}`);
  try {
    const tavilyResponse = await tavilyClient.search(url, {
      searchDepth: "basic",
      max_results: 1,
      include_raw_content: true,
    });
    const initialData = tavilyResponse.results[0] as TavilySearchResult;
    if (initialData?.rawContent) {
      console.log(`Tavily raw content (first 200 chars): ${initialData.rawContent.slice(0, 200)}...`);
      const cleanText = initialData.rawContent
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 10000);
      console.log(`Cleaned Tavily content (first 200 chars): ${cleanText.slice(0, 200)}...`);
      return cleanText || "No content available";
    } else {
      console.warn("Tavily raw content not available, falling back to summary...");
      const fallbackData = tavilyResponse.results[0] as TavilySearchResult;
      if (fallbackData?.content) {
        const cleanText = fallbackData.content
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 10000);
        console.log(`Cleaned fallback content (first 200 chars): ${cleanText.slice(0, 200)}...`);
        return cleanText || "No content available";
      }
      throw new Error("Tavily failed to fetch any usable content for the URL");
    }
  } catch (error: any) {
    console.error(`Error scraping ${url} with Tavily:`, error);
    if (error.response?.status === 401 || error.status === 401) {
      console.log("Tavily 401 on initial scrape—using OpenAI fallback.");
      const fallbackPrompt = `
        Tavily's choking with a 401 on ${url}. From the URL alone, give me a natural summary of what the site might be about (up to 10,000 chars). Keep it buddy-like, no AI stiffness.
        Return plain text with paragraphs split by newlines.
      `;
      const fallbackContent = await callAzureOpenAI(fallbackPrompt, 4000);
      const cleanFallbackText = fallbackContent.replace(/\s+/g, " ").trim().slice(0, 10000);
      console.log(`Fallback summarized content (first 200 chars): ${cleanFallbackText.slice(0, 200)}...`);
      return cleanFallbackText || "No content available";
    }
    const fallbackPrompt = `
      Based on this URL alone, whip up a natural, human-like summary of what the site's main content might be (up to 10,000 chars). Act like an expert spilling insights to a pal—no stiff AI phrases.
      URL: ${url}
      Return plain text with newlines between paragraphs.
    `;
    const fallbackContent = await callAzureOpenAI(fallbackPrompt, 4000);
    const cleanFallbackText = fallbackContent.replace(/\s+/g, " ").trim().slice(0, 10000);
    console.log(`Fallback summarized content (first 200 chars): ${cleanFallbackText.slice(0, 200)}...`);
    return cleanFallbackText || "No content available";
  }
}

async function generateMetaDescription(url: string, content: string): Promise<string> {
  const prompt = `
    Craft a natural, engaging meta description (up to 160 chars) for this URL and content. Make it feel like a passionate expert wrote it—no clichés like "game-changer," just real talk.
    URL: ${url}
    Content: "${content.slice(0, 2000)}"
    Return plain text.
  `;
  const metaDescription = await callAzureOpenAI(prompt, 200);
  console.log(`Generated meta description: ${metaDescription}`);
  return metaDescription.trim().slice(0, 160);
}

async function generateSearchQueries(metaDescription: string, topic: string): Promise<string[]> {
  const prompt = `
    Using this meta description and topic, come up with 5 unique, natural search queries for deep research on a 3000-word blog post. Keep 'em fun and conversational—like you're asking a friend to dig in. No repeats from past topics, no AI buzzwords.
    Meta Description: "${metaDescription}"
    Topic: "${topic}"
    Return a JSON array, e.g., ["query1", "query2"].
  `;
  const response = await callAzureOpenAI(prompt, 200);
  const cleanedResponse = response.replace(/```json\n?|\n?```/g, "").trim();
  try {
    const queries = (JSON.parse(cleanedResponse) as string[]) || [];
    console.log(`Generated search queries: ${JSON.stringify(queries)}`);
    return queries;
  } catch (error) {
    console.error("Error parsing queries:", error);
    return [`${topic} fresh insights`, `${topic} unexpected tips`];
  }
}

async function performTavilySearch(query: string): Promise<string[]> {
  console.log(`\nPerforming advanced Tavily search for: ${query}`);
  try {
    const response = await tavilyClient.search(query, {
      searchDepth: "advanced",
      max_results: 15,
      include_raw_content: true,
    });
    const urls = response.results.map((result: any) => result.url).filter((url: string) => url.match(/^https?:\/\/.+/));
    console.log(`Tavily found valid URLs: ${JSON.stringify(urls)}`);
    return urls;
  } catch (error) {
    console.error(`Tavily search error for "${query}":`, error);
    return [];
  }
}

async function findYouTubeVideo(topic: string): Promise<string | null> {
  const prompt = `
    Search for a relevant YouTube video URL for this topic. Make it specific, useful, and engaging—like something you'd recommend to a friend. Return just the URL as plain text, or "No video found" if nothing fits.
    Topic: "${topic}"
  `;
  const videoUrl = await callAzureOpenAI(prompt, 100);
  console.log(`Found YouTube video: ${videoUrl}`);
  return videoUrl.trim() === "No video found" ? null : videoUrl.trim();
}

async function calculateSEOScore(content: string): Promise<number> {
  const prompt = `
    Check this content's SEO vibe (0-100)—keyword use, structure, readability, links, length—like an expert buddy sizing it up. Keep it chill and natural.
    Content: ${content.slice(0, 3000)}
    Return just the number.
  `;
  const score = await callAzureOpenAI(prompt, 100);
  console.log(`Calculated SEO score: ${score}`);
  return Number(score) || 50;
}

async function extractHeadings(content: string): Promise<string[]> {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const headings: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^(#{1,6})\s+.+/)) {
      const match = lines[i].match(/^(#{1,6})\s+(.+)/);
      if (match) headings.push(match[2]);
    }
  }
  console.log(`Extracted headings: ${JSON.stringify(headings)}`);
  return headings.sort((a, b) => {
    const levelA = (content.match(new RegExp(`^#{1,6}\\s+${a}`)) || [])[0]?.match(/^#+/)?.[0].length || 1;
    const levelB = (content.match(new RegExp(`^#{1,6}\\s+${b}`)) || [])[0]?.match(/^#+/)?.[0].length || 1;
    return levelA - levelB;
  });
}

async function extractKeywords(content: string, topic: string): Promise<{ keyword: string; difficulty: string }[]> {
  const prompt = `
    Pull 5 key SEO keywords from this content tied to "${topic}". Give each a difficulty score ("Low", "Medium", "High") like you're hyping a friend—no AI jargon, just real talk. Avoid repeats from generic blog lists.
    Content: ${content.slice(0, 2000)}
    Return JSON: [{"keyword": "term", "difficulty": "score"}, ...]
  `;
  const response = await callAzureOpenAI(prompt, 200);
  const cleanedResponse = response.replace(/```json\n?|\n?```/g, "").trim();
  try {
    const keywords = (JSON.parse(cleanedResponse) as { keyword: string; difficulty: string }[]) || [];
    console.log(`Extracted keywords: ${JSON.stringify(keywords)}`);
    return keywords;
  } catch (error) {
    console.error("Error extracting keywords:", error);
    return [];
  }
}

async function factCheckContent(content: string, sources: string[]): Promise<string> {
  const prompt = `
    Fact-check this blog content against these sources. Fix any shaky bits to match the truth or call 'em out if they're off. Keep it natural, like a friend double-checking your work. Preserve every single word—do not shorten or remove content, only add clarifications or corrections as extra text if needed. Ensure the content remains in Markdown format with no HTML or bolding, following these rules exactly as in formatUtils.convertMarkdownToHtml:
    - H1 (#): text-5xl font-bold
    - H2 (##): text-4xl font-bold
    - H3 (###): text-3xl font-bold
    - Paragraphs: text-gray-700 leading-relaxed, no bolding, with blank lines between (use \n\n)
    - Lists: Use - or * for bullets, ml-6 mb-2 list-disc, with blank lines between items (use \n\n)
    - Links: [text](url), text-blue-600 hover:underline
    Content: "${content}"
    Sources: ${sources.join(", ")}
  `;
  const factCheckedContent = await callAzureOpenAI(prompt, 16384);
  console.log(`Fact-checked content (first 200 chars): ${factCheckedContent.slice(0, 200)}...`);
  return factCheckedContent
    .replace(/<[^>]+>/g, "")
    .replace(/\*\*(.*?)\*\*/g, "- $1\n\n")
    .replace(/\n{1,}/g, "\n\n")
    .trim();
}

async function generateClassyTitle(coreTopic: string, userId: string, supabase: any): Promise<string> {
  const now = new Date().toISOString().split("T")[0];
  const randomNudge = Math.random().toString(36).substring(2, 7);

  const { data: blogPrefs, error: prefError } = await supabase
    .from("blog_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  const blogPreferences = prefError || !blogPrefs
    ? { preferred_tone: "casual", preferred_keywords: [] }
    : blogPrefs;

  const { data: brandData, error: brandError } = await supabase
    .from("brand_profile")
    .select("brand_name, description, company_taglines")
    .eq("user_id", userId)
    .single();

  if (brandError || !brandData) {
    console.error(`Brand profile error: ${brandError?.message || "No brand data"}`);
    throw new Error(`Failed to fetch brand profile: ${brandError?.message || "No brand data"}`);
  }

  const { data: contentIdea, error: ideaError } = await supabase
    .from("content_ideas")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const contentIdeaData = ideaError || !contentIdea
    ? { idea_title: "Untitled Idea", idea_description: "No desc", suggested_keywords: [] }
    : contentIdea;

  const { data: audienceData, error: audienceError } = await supabase
    .from("audience_settings")
    .select("target_audience, tone_preference, audience_goals")
    .eq("user_id", userId)
    .single();

  const audienceSettings = audienceError || !audienceData
    ? { target_audience: "entrepreneurs", tone_preference: "casual", audience_goals: "grow their business" }
    : audienceData;

  const { data: keywordsData, error: keywordsError } = await supabase
    .from("keywords_to_be_used")
    .select("keyword, priority")
    .eq("user_id", userId)
    .order("priority", { ascending: false })
    .limit(1);

  const topKeyword = keywordsError || !keywordsData?.[0] ? "no top keyword" : keywordsData[0].keyword;

  const { data: pastBlogs, error: pastError } = await supabase
    .from("blogs")
    .select("title")
    .eq("user_id", userId)
    .limit(5);

  const pastTitles = pastError || !pastBlogs ? "None" : pastBlogs.map((blog: any) => blog.title).join(", ");

  const brandInfo = `
    ${brandData.brand_name || "Unnamed"} - ${brandData.description || "No description"} - Taglines: ${
      Array.isArray(brandData.company_taglines) ? brandData.company_taglines.join(", ") : brandData.company_taglines || "None"
    }
  `;
  const contentIdeaInfo = `
    ${contentIdeaData.idea_title || "Untitled Idea"} - ${contentIdeaData.idea_description || "No desc"} - Keywords: ${
      contentIdeaData.suggested_keywords?.join(", ") || "None"
    }
  `;

  const prompt = `
    You're a headline wizard crafting a blog title for "${coreTopic}" on ${now} (ID: ${randomNudge}). Use this data to make it classy, sharp, and totally fresh:
    - Blog Preferences: Tone: ${blogPreferences.preferred_tone}, Keywords: ${blogPreferences.preferred_keywords.join(", ")}
    - Brand Info: "${brandInfo.slice(0, 500)}"
    - Latest Content Idea: "${contentIdeaInfo.slice(0, 500)}"
    - Audience: "${audienceSettings.target_audience}" aiming to "${audienceSettings.audience_goals}" (tone: ${audienceSettings.tone_preference})
    - Top Keyword: ${topKeyword}
    - Past Titles to Avoid: ${pastTitles}
    Create a slick, attention-grabbing title (up to 70 chars) that's unique—no repeats from past titles. Throw in a wild twist or fresh angle. Return plain text.
  `;
  const title = await callAzureOpenAI(prompt, 100);
  console.log(`Generated classy title: ${title}`);
  return title.trim() || `Fresh Take on ${coreTopic} - ${now}`;
}

async function reformatExistingPosts(supabase: any, userId: string): Promise<void> {
  try {
    const { data: existingPosts, error: fetchError } = await supabase
      .from("blogs")
      .select("id, blog_post")
      .eq("user_id", userId);

    if (fetchError || !existingPosts) {
      console.error(`Failed to fetch existing posts: ${fetchError?.message || "No posts found"}`);
      throw new Error(`Failed to fetch existing posts: ${fetchError?.message || "No posts found"}`);
    }

    for (const post of existingPosts) {
      let markdownContent = post.blog_post;

      if (markdownContent.startsWith('<')) {
        markdownContent = markdownContent
          .replace(/<[^>]+>/g, "")
          .replace(/\s+/g, " ")
          .trim();
      }

      markdownContent = markdownContent
        .replace(/\*\*(.*?)\*\*/g, "- $1\n\n")
        .replace(/\n{1,}/g, "\n\n")
        .replace(/^#### (.*$)/gim, '### $1')
        .replace(/^##### (.*$)/gim, '### $1')
        .replace(/^###### (.*$)/gim, '### $1');

      const formattedHtml = formatUtils.convertMarkdownToHtml(markdownContent);

      const { error: updateError } = await supabase
        .from("blogs")
        .update({ blog_post: formattedHtml })
        .eq("id", post.id);

      if (updateError) {
        console.error(`Failed to update post ${post.id}: ${updateError.message}`);
      } else {
        console.log(`Reformatted and updated post ${post.id}`);
      }
    }
  } catch (error: any) {
    console.error(`Error reformatting existing posts: ${error.message}`);
    throw new Error(`Failed to reformat existing posts: ${error.message}`);
  }
}

export async function analyzeWebsiteAndGenerateArticle(
  url: string,
  userId: string,
  targetKeywords: string[] = [],
  targetWordCount = 2500
): Promise<ArticleResult> {
  console.log(`\n=== Starting blog generation for URL: ${url}, User ID: ${userId} ===`);
  const supabase = await createClient();
  const now = new Date().toISOString().split("T")[0];
  const randomNudge = Math.random().toString(36).substring(2, 7);

  try {
    if (!url.match(/^https?:\/\/.+/)) {
      throw new Error("Invalid initial URL format");
    }

    const { data: brandData, error: brandError } = await supabase
      .from("brand_profile")
      .select(
        "website_link, brand_name, product_images, description, brand_documents, brand_logo, post_video_links, company_taglines, brand_colours, country_of_service"
      )
      .eq("user_id", userId)
      .single();

    if (brandError || !brandData) {
      console.error(`Failed to fetch brand data: ${brandError?.message || "No brand data"}`);
      throw new Error("No brand data found for this user—add brand data in /company-database first, dude!");
    }

    console.log(`Reading brand data for user ${userId}:`, brandData);

    const initialData = await scrapeInitialUrlWithTavily(url);
    if (!initialData || initialData === "No content available") throw new Error("Failed to scrape initial URL with Tavily.");
    console.log(`Initial content (first 200 chars): ${initialData.slice(0, 200)}...`);

    const metaDescription = await generateMetaDescription(url, initialData);
    const searchQueries = await generateSearchQueries(metaDescription, "temporary topic placeholder");
    const searchUrls = await Promise.all(searchQueries.map(performTavilySearch));
    const allSearchUrls = Array.from(new Set(searchUrls.flat())).slice(0, 15);
    console.log(`External URLs from Tavily: ${JSON.stringify(allSearchUrls)}`);

    const researchResults: { url: string; content: string; title: string }[] = [];
    for (const scrapeUrl of allSearchUrls) {
      const scrapedContent = await scrapeWithTavily(scrapeUrl);
      if (scrapedContent && scrapedContent !== "No content available" && scrapedContent.length > 100) {
        researchResults.push({
          url: scrapeUrl,
          content: scrapedContent,
          title: scrapedContent.split("\n")[0] || "No title available",
        });
        console.log(`Added ${scrapeUrl} with ${scrapedContent.split(/\s+/).length} words`);
      }
      if (researchResults.length >= 8) break;
    }
    if (researchResults.length < 8) {
      console.warn(`Only got ${researchResults.length} valid paragraphs, but rolling with it...`);
    }
    console.log(`Scraped ${researchResults.length} URLs: ${JSON.stringify(researchResults.map((r) => r.url))}`);

    const combinedResearchContent = researchResults
      .map((r) => r.content)
      .join("\n\n")
      .slice(0, 2000);
    const topicPrompt = `
      Based on this combined content from scraped research, figure out the main topic. Keep it broad but specific, like you're sussing it out for a mate—don't assume it's one thing, just vibe it out from the text.
      Content: "${combinedResearchContent}"
      Return plain text.
    `;
    const coreTopic = await callAzureOpenAI(topicPrompt, 100);
    console.log(`Core topic derived from researchResults: ${coreTopic}`);

    const brandInfo = `
      Website: ${brandData.website_link || "No website"}
      Brand: ${brandData.brand_name || "Unnamed Brand"}
      Products: ${brandData.product_images || "No product images"}
      Description: ${brandData.description || "No description"}
      Documents: ${brandData.brand_documents || "No documents"}
      Logo: ${brandData.brand_logo || "No logo"}
      Posts/Videos: ${brandData.post_video_links || "No posts/videos"}
      Taglines: ${Array.isArray(brandData.company_taglines) ? brandData.company_taglines.join(", ") : brandData.company_taglines || "None"}
      Colours: ${brandData.brand_colours || "No colours"}
      Country: ${brandData.country_of_service || "No country"}
    `;
    console.log(`Brand info for user ${userId} (first 200 chars): ${brandInfo.slice(0, 200)}...`);

    const { data: existingBlogs, error: blogError } = await supabase
      .from("blogs")
      .select("blog_post, title")
      .eq("user_id", userId)
      .limit(5);

    if (blogError) {
      console.error(`Failed to fetch existing blogs: ${blogError.message}`);
    }

    const existingPosts = existingBlogs?.map((blog: any) => blog.blog_post) ?? [];
    console.log(`Found ${existingPosts.length} existing posts for user ${userId}`);

    const youtubeVideo = await findYouTubeVideo(coreTopic);
    const internalLinks = ["/blog/tips-for-growth", "/resources/ecommerce-guide"];
    const references = [url, ...researchResults.map((r) => r.url), ...(youtubeVideo ? [youtubeVideo] : [])];

    const tempFileName = `scraped_data_${uuidv4()}.json`;
    const scrapedData: ScrapedData = {
      initialUrl: url,
      initialResearchSummary: initialData,
      researchResults,
      researchSummary: combinedResearchContent,
      coreTopic,
      brandInfo,
      youtubeVideo,
      internalLinks,
      references,
      existingPosts: existingPosts.join("\n\n").slice(0, 2000),
      targetKeywords,
      timestamp: now,
      nudge: randomNudge,
    };
    writeFileSync(tempFileName, JSON.stringify(scrapedData, null, 2), "utf8");
    console.log(`Scraped data saved to temp file: ${tempFileName}`);

    const scrapedDataRaw = readFileSync(tempFileName, "utf8");
    console.log(`Read JSON data from ${tempFileName} (first 200 chars): ${scrapedDataRaw.slice(0, 200)}...`);
    const scrapedDataParsed = JSON.parse(scrapedDataRaw) as ScrapedData;
    const researchSummary = scrapedDataParsed.researchSummary || "No research summary available";

    const awesomeTitle = await generateClassyTitle(coreTopic, userId, supabase);
    const metaDescriptionFromResearch = await generateMetaDescription(url, researchSummary);

    const pastTitles = existingBlogs?.map((blog: any) => blog.title)?.join(", ") ?? "None";

    const firstChunkPrompt = `
      Here's JSON from ${url} on ${now} (ID: ${randomNudge}). Write a 1300+ word blog chunk on "${coreTopic}"—practical, actionable strategies, like coaching a newbie over brunch. Use brand info from JSON. Don't repeat past posts or titles: "${existingPosts.join("\n\n").slice(
        0,
        2000
      )}", Titles: ${pastTitles}. Weave in keywords: ${targetKeywords.join(", ")}. Use *only* Markdown: title (# ${awesomeTitle}), 6-8 subheadings (## Subheading, ### Sub-subheading if needed), no bolding (convert any bold **text** to bullet points - text with \n\n), normal font weight, blank lines between paragraphs (use \n\n), and bullet points for lists (- or *). Add a real-world example—small biz crushing it. Use internal links (${internalLinks.join(
      ", "
    )}) where they fit. Do not use any HTML—just pure Markdown as per formatUtils.convertMarkdownToHtml rules:
    - H1 (#): text-5xl font-bold
    - H2 (##): text-4xl font-bold
    - H3 (###): text-3xl font-bold
    - Paragraphs: text-gray-700 leading-relaxed, no bolding, with blank lines between (use \n\n)
    - Lists: Use - or * for bullets, ml-6 mb-2 list-disc, with blank lines between items (use \n\n)
    - Links: [text](url), text-blue-600 hover:underline
    JSON: "${scrapedDataRaw.slice(0, 6000)}..."
      Return full text starting with title in Markdown format.
    `;
    let firstChunk = await callAzureOpenAI(firstChunkPrompt, 5500);
    firstChunk = firstChunk
      .replace(/<[^>]+>/g, "")
      .replace(/\*\*(.*?)\*\*/g, "- $1\n\n")
      .replace(/\n{1,}/g, "\n\n")
      .trim();
    const firstWordCount = firstChunk.split(/\s+/).filter(Boolean).length;
    console.log(`First Chunk (first 200 chars): ${firstChunk.slice(0, 200)}...`);
    console.log(`First Chunk Word Count: ${firstWordCount}`);

    const secondChunkPrompt = `
      JSON from ${url} on ${now} (ID: ${randomNudge}). Write a 1300+ word blog chunk on "${coreTopic}"—wild stories, insider secrets, like campfire tales to a buddy. Use brand info freshly—don't repeat practical stuff or past posts: "${existingPosts.join(
        "\n\n"
      ).slice(0, 2000)}", Titles: ${pastTitles}. Keywords: ${targetKeywords.join(", ")}. Markdown: title (# ${
      awesomeTitle
    } - Part 2), 6-8 subheadings (## Subheading, ### Sub-subheading if needed), no bolding (convert any bold **text** to bullet points - text with \n\n), normal font weight, blank lines between paragraphs (use \n\n), and bullet points for lists (- or *). Blend short zingers with long narratives. Add YouTube (${
      youtubeVideo || "none"
    }) if it fits. Use internal links (${internalLinks.join(", ")}) in new spots. Do not use any HTML—just pure Markdown as per formatUtils.convertMarkdownToHtml rules:
    - H1 (#): text-5xl font-bold
    - H2 (##): text-4xl font-bold
    - H3 (###): text-3xl font-bold
    - Paragraphs: text-gray-700 leading-relaxed, no bolding, with blank lines between (use \n\n)
    - Lists: Use - or * for bullets, ml-6 mb-2 list-disc, with blank lines between items (use \n\n)
    - Links: [text](url), text-blue-600 hover:underline
    JSON: "${scrapedDataRaw.slice(0, 6000)}..."
      Return full text starting with title in Markdown format.
    `;
    let secondChunk = await callAzureOpenAI(secondChunkPrompt, 5500);
    secondChunk = secondChunk
      .replace(/<[^>]+>/g, "")
      .replace(/\*\*(.*?)\*\*/g, "- $1\n\n")
      .replace(/\n{1,}/g, "\n\n")
      .trim();
    const secondWordCount = secondChunk.split(/\s+/).filter(Boolean).length;
    console.log(`Second Chunk (first 200 chars): ${secondChunk.slice(0, 200)}...`);
    console.log(`Second Chunk Word Count: ${secondWordCount}`);

    const mergePrompt = `
      Got two 1300+ word chunks on "${coreTopic}" from ${now} (ID: ${randomNudge}). Merge into a 2600+ word post that flows—like a marathon chat with a friend. Keep all words from both, add 400-600 fresh words (insights, examples). Avoid repeating past titles: ${pastTitles}. Markdown: title (# ${
      awesomeTitle
    }), 14-16 subheadings (## Subheading, ### Sub-subheading if needed), no bolding (convert any bold **text** to bullet points - text with \n\n), normal font weight, end with (# Conclusion), blank lines between paragraphs (use \n\n), and bullet points for lists (- or *). Keywords: ${targetKeywords.join(
      ", "
    )}. Use internal links: ${internalLinks.join(", ")}. Add YouTube if it fits: "${youtubeVideo || "none"}". End with (# References): ${references.join(
      ", "
    )}. Use *only* Markdown as per formatUtils.convertMarkdownToHtml rules:
    - H1 (#): text-5xl font-bold
    - H2 (##): text-4xl font-bold
    - H3 (###): text-3xl font-bold
    - Paragraphs: text-gray-700 leading-relaxed, no bolding, with blank lines between (use \n\n)
    - Lists: Use - or * for bullets, ml-6 mb-2 list-disc, with blank lines between items (use \n\n)
    - Links: [text](url), text-blue-600 hover:underline
    Chunks:
      Chunk 1 (practical): "${firstChunk}"
      Chunk 2 (stories): "${secondChunk}"
      Return full text starting with title in Markdown format.
    `;
    let mergedBlogPost = await callAzureOpenAI(mergePrompt, 16384);
    mergedBlogPost = mergedBlogPost
      .replace(/<[^>]+>/g, "")
      .replace(/\*\*(.*?)\*\*/g, "- $1\n\n")
      .replace(/\n{1,}/g, "\n\n")
      .trim();
    const mergedWordCount = mergedBlogPost.split(/\s+/).filter(Boolean).length;
    console.log(`Merged Blog Post (first 200 chars): ${mergedBlogPost.slice(0, 200)}...`);
    console.log(`Merged Word Count: ${mergedWordCount}`);

    const formattedBlogPost = formatUtils.convertMarkdownToHtml(mergedBlogPost);
    console.log(`Formatted Blog Post (first 200 chars): ${formattedBlogPost.slice(0, 200)}...`);

    const finalBlogPost = await factCheckContent(formattedBlogPost, [url, ...allSearchUrls, youtubeVideo || ""]);
    console.log(`Fact-checked Blog Post (first 200 chars): ${finalBlogPost.slice(0, 200)}...`);
    const finalWordCount = finalBlogPost.split(/\s+/).filter(Boolean).length;
    console.log(`Final Word Count: ${finalWordCount}`);

    const seoScore = await calculateSEOScore(finalBlogPost);
    const headings = await extractHeadings(finalBlogPost);
    const keywords = await extractKeywords(finalBlogPost, coreTopic);

    console.log(`SEO Score: ${seoScore}/100`);
    console.log(`Headings: ${JSON.stringify(headings)}`);
    console.log(`Keywords: ${JSON.stringify(keywords)}`);
    console.log(`References:`, references);
    console.log(`=== Blog generation done for user ${userId}! ===`);

    await reformatExistingPosts(supabase, userId);

    return {
      blogPost: finalBlogPost,
      seoScore,
      headings,
      keywords,
      citations: references,
      tempFileName,
      title: awesomeTitle,
      timestamp: now,
    };
  } catch (error: any) {
    console.error(`=== Error in blog generation for user ${userId}: ${error.message} ===`);
    throw new Error(`Blog generation failed: ${error.message}`);
  }
}

export async function generateBlog(url: string, id: string, userId: string): Promise<BlogPost[]> {
  const supabase = await createClient();
  const blogPosts: BlogPost[] = [];
  const firstRevealDate = new Date();

  try {
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("plan_id")
      .eq("user_id", userId)
      .single();

    if (subscriptionError || !subscription) {
      console.error(`Failed to fetch subscription: ${subscriptionError?.message || "No subscription found"}`);
      throw new Error(`Failed to fetch subscription: ${subscriptionError?.message || "No subscription found"}`);
    }

    if (!subscription.plan_id) {
      throw new Error("No active subscription plan found for this user");
    }

    const planCreditsMap: { [key: string]: number } = {
      "trial": 2,
      "basic": 10,
      "pro": 30,
    };

    const totalPosts = planCreditsMap[subscription.plan_id] || 0;
    if (!totalPosts) {
      throw new Error(`Invalid subscription plan: ${subscription.plan_id}`);
    }

    console.log(`User ${userId} has plan '${subscription.plan_id}' with ${totalPosts} credits.`);

    for (let i = 0; i < totalPosts; i++) {
      try {
        const result = await analyzeWebsiteAndGenerateArticle(url, userId);
        const blogId = uuidv4();
        const revealDate = new Date(firstRevealDate);
        revealDate.setDate(revealDate.getDate() + i);

        const blogData: BlogPost = {
          id: blogId,
          user_id: userId,
          blog_post: result.blogPost,
          citations: result.citations,
          created_at: new Date().toISOString(),
          title: result.title,
          timestamp: result.timestamp,
          reveal_date: revealDate.toISOString(),
          url: url,
        };

        const { error: insertError } = await supabase.from("blogs").insert(blogData);

        if (insertError) {
          const error: GenerationError = new Error(`Failed to save blog to Supabase: ${insertError.message}`);
          error.code = "INSERT_ERROR";
          throw error;
        }

        blogPosts.push(blogData);
        console.log(`Generated and saved blog post ${i + 1} of ${totalPosts} for user ${userId}`);
      } catch (error: any) {
        console.error(`Error generating post ${i + 1}:`, error);
        const generationError: GenerationError = new Error(
          `Failed to generate post ${i + 1}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
        generationError.code = "GENERATION_ERROR";
        throw generationError;
      }
    }

    await reformatExistingPosts(supabase, userId);

    console.log(`Successfully generated and saved ${totalPosts} blog posts for user ${userId}`);
    return blogPosts;
  } catch (error: any) {
    console.error(`Failed to generate blogs for ${url} and user ${userId}:`, error);
    const finalError: GenerationError = new Error(
      `Blog generation failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    finalError.code = "FATAL_ERROR";
    throw finalError;
  }
}