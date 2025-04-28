import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { tavily } from "@tavily/core";
import * as cheerio from "cheerio";

// Initialize OpenAI client (server-side only)
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY as string,
  baseURL: process.env.AZURE_OPENAI_API_BASE_PATH_GPT4O_MINI,
  defaultQuery: { "api-version": "2024-02-15-preview" },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY },
});

// Initialize Tavily client
const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY as string });

// Define Tavily search options interface (for the second argument)
interface TavilySearchOptions {
  search_depth?: "basic" | "advanced";
  include_raw_content?: boolean;
  max_results?: number;
}

// Define Tavily response types
interface TavilyResult {
  title?: string;
  content?: string;
  url?: string;
}

interface TavilySearchResponse {
  results?: TavilyResult[];
  raw_content?: string[];
}

// Helper function to call Azure OpenAI
async function callAzureOpenAI(prompt: string, maxTokens: number): Promise<string> {
  try {
    console.log(`Calling OpenAI: ${prompt.slice(0, 100)}${prompt.length > 100 ? "..." : ""}`);

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      max_tokens: maxTokens,
      temperature: 0.7,
      n: 1,
    });

    const result = completion.choices[0]?.message?.content || "";
    console.log(`OpenAI response: ${result.slice(0, 100)}${result.length > 100 ? "..." : ""}`);
    return result;
  } catch (error: any) {
    console.error("Error calling Azure OpenAI:", error.message);
    return `Unable to generate analysis due to ${error.message}. Please try again later.`;
  }
}

// Function to extract website content using Tavily API
async function extractWithTavily(url: string): Promise<string> {
  try {
    console.log(`Extracting content with Tavily API: ${url}`);

    // Try to get the hostname for site-specific search
    const hostname = new URL(url).hostname;

    // Define the query and options
    const query = `site:${hostname}`;
    const options: TavilySearchOptions = {
      search_depth: "advanced",
      include_raw_content: true,
      max_results: 10,
    };

    // Use the search method with query as first argument and options as second
    const searchResponse = await tavilyClient.search(query, options) as TavilySearchResponse;

    // Check if we got raw content from the search
    if (searchResponse.raw_content && searchResponse.raw_content.length > 0) {
      const rawContent = searchResponse.raw_content.join("\n\n");
      console.log(
        `Successfully extracted raw content with Tavily search. Content length: ${rawContent.length} characters`,
      );
      return rawContent;
    }

    // If no raw content, try to use the results content
    if (searchResponse.results && searchResponse.results.length > 0) {
      const contentFromResults = searchResponse.results
        .map((result: TavilyResult) => {
          return `${result.title || ""}\n${result.content || ""}`;
        })
        .join("\n\n");

      console.log(
        `Extracted content from Tavily search results. Content length: ${contentFromResults.length} characters`,
      );
      return contentFromResults;
    }

    throw new Error("No content retrieved from Tavily API");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error extracting with Tavily:", errorMessage);
    throw error;
  }
}

// Direct website scraping function
async function scrapeWebsite(url: string): Promise<string> {
  try {
    console.log(`Scraping website directly: ${url}`);

    // Fetch the website content directly
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 0 }, // Disable caching
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.statusText}`);
    }

    const html = await response.text();

    // Parse the HTML with cheerio
    const $ = cheerio.load(html);

    // Remove script and style elements
    $("script, style, iframe, noscript").remove();

    // Extract the text content
    const title = $("title").text().trim();
    const metaDescription = $('meta[name="description"]').attr("content") || "";
    const ogTitle = $('meta[property="og:title"]').attr("content") || "";
    const ogDescription = $('meta[property="og:description"]').attr("content") || "";

    // Get text from all visible elements
    let bodyText = "";

    // First try to get content from main content areas
    const mainContentSelectors = [
      "main",
      "article",
      "#content",
      ".content",
      "#main",
      ".main",
      "#primary",
      ".primary",
      "section",
      ".post",
      ".page",
      ".entry",
    ];

    let foundMainContent = false;
    for (const selector of mainContentSelectors) {
      if ($(selector).length > 0) {
        $(selector)
          .find("p, h1, h2, h3, h4, h5, h6, li")
          .each((_, element) => {
            const text = $(element).text().trim();
            if (text) {
              bodyText += text + "\n";
            }
          });
        foundMainContent = true;
        break;
      }
    }

    // If no main content found, get text from all visible elements
    if (!foundMainContent) {
      $("body p, body h1, body h2, body h3, body h4, body h5, body h6, body li").each((_, element) => {
        const text = $(element).text().trim();
        if (text) {
          bodyText += text + "\n";
        }
      });
    }

    // Look specifically for features, services, products sections
    const featureSections = ["#features", ".features", "#services", ".services", "#products", ".products"];
    let featuresText = "";

    for (const selector of featureSections) {
      if ($(selector).length > 0) {
        $(selector)
          .find("*")
          .each((_, element) => {
            const text = $(element).text().trim();
            if (text) {
              featuresText += text + "\n";
            }
          });
      }
    }

    if (featuresText) {
      bodyText += "\nFeatures/Services/Products:\n" + featuresText;
    }

    // Combine all the content
    const content = `
      Title: ${title || ogTitle}
      Description: ${metaDescription || ogDescription}
      
      Content:
      ${bodyText}
    `.trim();

    console.log(`Scraped website directly. Content length: ${content.length} characters`);
    return content;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error scraping website directly:", errorMessage);
    throw error;
  }
}

// Function to create paragraph-form website summaries
async function createWebsiteSummary(content: string, url: string): Promise<string> {
  try {
    console.log("Creating website summary...");

    // Extract the domain name for context
    const domain = new URL(url).hostname;

    const paragraphPrompt = `
      Create a concise summary of this website in flowing paragraph form. The summary should cover:
      
      - What the website is about (main purpose and topic)
      - What kind of content is on the website
      - What services, products, or offerings they provide
      - Key features or unique aspects of the website/business
      
      Write this as 2-3 cohesive paragraphs that flow naturally. Do NOT use bullet points or section headers.
      Focus on facts rather than opinions. If you can't determine something with certainty, don't include it.
      
      Website URL: ${url}
      Domain: ${domain}
      Available Content:
      ${content}
    `;

    const websiteSummary = await callAzureOpenAI(paragraphPrompt, 1200);
    console.log("Website summary created");

    return websiteSummary;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating website summary:", errorMessage);

    // Fallback to a simpler summary if the process fails
    try {
      const fallbackPrompt = `
        Based on the URL ${url} and domain name ${new URL(url).hostname}, write a brief 1-2 paragraph summary
        that describes what the website is about, what content it contains, what services or products they offer,
        and any notable features. Write in flowing paragraph form, not bullet points.
      `;
      return await callAzureOpenAI(fallbackPrompt, 800);
    } catch {
      return `We were unable to complete an analysis of ${url} at this time. Please try again later.`;
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    // Validate URL format
    let validatedUrl: string;
    try {
      validatedUrl = new URL(url).toString();
    } catch (e) {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    console.log(`Processing URL: ${validatedUrl}`);

    // Step 1: Try to extract content using multiple methods
    let websiteContent = "";
    let extractionMethod = "";

    // Try Tavily first
    try {
      websiteContent = await extractWithTavily(validatedUrl);
      extractionMethod = "tavily";
    } catch (tavilyError) {
      const tavilyErrorMessage = tavilyError instanceof Error ? tavilyError.message : "Unknown error";
      console.log(`Tavily extraction failed: ${tavilyErrorMessage}. Falling back to direct scraping.`);

      // Fall back to direct scraping
      try {
        websiteContent = await scrapeWebsite(validatedUrl);
        extractionMethod = "direct";
      } catch (scrapeError) {
        const scrapeErrorMessage = scrapeError instanceof Error ? scrapeError.message : "Unknown error";
        console.error(`Direct scraping also failed: ${scrapeErrorMessage}`);

        // If both methods fail, use minimal information
        websiteContent = `URL: ${validatedUrl}\nDomain: ${new URL(validatedUrl).hostname}`;
        extractionMethod = "url_only";
      }
    }

    // Step 2: Create a paragraph-form website summary using OpenAI
    try {
      const websiteSummary = await createWebsiteSummary(websiteContent, validatedUrl);

      // Step 3: Return the summary to the user
      return NextResponse.json({
        summary: websiteSummary,
        extraction_method: extractionMethod,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        {
          error: "Failed to generate summary",
          details: errorMessage,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in generate-summary API route:", errorMessage);
    return NextResponse.json({ error: "Failed to process request", details: errorMessage }, { status: 500 });
  }
}