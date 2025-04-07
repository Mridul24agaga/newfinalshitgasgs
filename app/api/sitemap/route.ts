import { type NextRequest, NextResponse } from "next/server"
import { parse } from "node-html-parser"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Normalize URL
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`

    try {
      // Deep crawl with depth=3
      const sitemap = await deepCrawlSitemap(normalizedUrl)
      return NextResponse.json({ sitemap })
    } catch (error) {
      console.error("Sitemap generation error:", error)
      return NextResponse.json(
        { error: "Failed to generate sitemap. Please check the URL and try again." },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

async function deepCrawlSitemap(baseUrl: string): Promise<string> {
  try {
    // Extract domain from URL
    const urlObj = new URL(baseUrl)
    const domain = urlObj.hostname
    const baseOrigin = urlObj.origin

    // Set to track visited URLs
    const visited = new Set<string>()
    // Queue for BFS crawling
    const queue: string[] = [baseUrl]
    // Array to store sitemap URLs
    const sitemapUrls: string[] = []

    // Limit the number of pages to crawl
    const maxPages = 150

    // Breadth-first search to crawl the website
    while (queue.length > 0 && sitemapUrls.length < maxPages) {
      const currentUrl = queue.shift()!

      // Skip if already visited
      if (visited.has(currentUrl)) {
        continue
      }

      visited.add(currentUrl)

      try {
        // Fetch the page
        const response = await fetch(currentUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; SitemapGenerator/1.0)",
          },
        })

        if (!response.ok) {
          continue
        }

        const html = await response.text()
        const root = parse(html)

        // Add current URL to sitemap
        sitemapUrls.push(currentUrl)

        // Find all links on the page
        const links = root.querySelectorAll("a")

        for (const link of links) {
          const href = link.getAttribute("href")

          if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
            continue
          }

          try {
            // Handle relative URLs
            let fullUrl: string
            if (href.startsWith("/")) {
              fullUrl = `${baseOrigin}${href}`
            } else if (!href.startsWith("http")) {
              fullUrl = `${baseOrigin}/${href}`
            } else {
              fullUrl = href
            }

            // Parse the URL to validate and normalize it
            const urlObj = new URL(fullUrl)

            // Only process URLs from the same domain
            if (urlObj.hostname !== domain) {
              continue
            }

            // Remove hash and query parameters
            urlObj.hash = ""
            urlObj.search = ""
            const cleanUrl = urlObj.toString()

            // Add to queue if not visited
            if (!visited.has(cleanUrl)) {
              queue.push(cleanUrl)
            }
          } catch (e) {
            // Skip invalid URLs
            continue
          }
        }
      } catch (error) {
        // Continue with other URLs
        continue
      }
    }

    // Generate XML sitemap
    return generateSitemapXml(sitemapUrls)
  } catch (error) {
    throw new Error("Failed to crawl website")
  }
}

function generateSitemapXml(urls: string[]): string {
  const today = new Date().toISOString()

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  for (const url of urls) {
    xml += "  <url>\n"
    xml += `    <loc>${escapeXml(url)}</loc>\n`
    xml += `    <lastmod>${today}</lastmod>\n`
    xml += "  </url>\n"
  }

  xml += "</urlset>"

  return xml
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

