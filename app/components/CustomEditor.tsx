"use client"

import type React from "react"
import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import {
  List,
  X,
  Loader2,
  AlertCircle,
  Bold,
  Italic,
  Underline,
  ListOrdered,
  Save,
  Eye,
  Settings,
  FileCode,
  Copy,
  Check,
  Table,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"

// Initialize Supabase client
const supabase = createClient()

// Formatting utility (optimized)
const formatUtils = {
  convertMarkdownToHtml: (markdown: string): string => {
    let html = markdown
      .replace(/^###### (.*$)/gim, '<h6 class="text-lg font-semibold mt-6 mb-3">$1</h6>')
      .replace(/^##### (.*$)/gim, '<h5 class="text-xl font-semibold mt-6 mb-3">$1</h5>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-2xl font-semibold mt-8 mb-4">$4</h4>')
      .replace(/^### (.*$)/gim, '<h3 class="text-3xl font-bold mt-10 mb-5 text-gray-800">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-4xl font-bold mt-12 mb-6 text-gray-900">$2</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-5xl font-bold mt-14 mb-8 text-gray-900 border-b pb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic font-normal">$1</em>')
      .replace(/^- (.*)$/gim, '<li class="ml-6 mb-4 list-disc text-gray-700 font-normal">$1</li>')
      .replace(/^[*] (.*)$/gim, '<li class="ml-6 mb-4 list-disc text-gray-700 font-normal">$1</li>')
      .replace(/(<li.*?>.*<\/li>)/gim, '<ul class="my-6">$1</ul>')
      .replace(/\n{2,}/g, '</p><p class="mt-6 mb-6 text-gray-700 leading-relaxed font-normal">')
      .replace(/\[([^\]]+)\]$$([^)]+)$$/gim, (match, text, url) => {
        // Check if the URL is internal (relative) or external
        const isExternal = url.startsWith("http") || url.startsWith("https")
        if (isExternal) {
          return `<a href="${url}" class="text-orange-600 underline hover:text-orange-700 font-normal" target="_blank" rel="noopener noreferrer">${text}</a>`
        } else {
          // Internal link
          return `<a href="${url}" class="text-blue-600 hover:text-blue-800 font-normal">${text}</a>`
        }
      })
      .replace(
        /^>\s+(.*)$/gim,
        '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-6 font-normal">$1</blockquote>',
      )

    html = `<p class="mt-6 mb-6 text-gray-700 leading-relaxed font-normal">${html}</p>`
    return html
  },

  sanitizeHtml: (html: string): string => {
    if (!html) return ""

    if (html.includes("<script") || html.includes("javascript:") || html.includes("onerror=")) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")

      doc.querySelectorAll("p, li, a, blockquote").forEach((el) => {
        el.classList.remove("font-bold")
        el.classList.add("font-normal")
      })
      doc.querySelectorAll("p").forEach((p) => {
        p.classList.add("mt-6", "mb-6", "text-gray-700", "leading-relaxed")
      })
      doc.querySelectorAll("ul").forEach((ul) => {
        ul.classList.add("my-6")
      })
      doc.querySelectorAll("li").forEach((li) => {
        li.classList.add("ml-6", "mb-4", "list-disc", "text-gray-700", "font-normal")
      })
      doc.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((h) => {
        h.classList.remove("font-normal")
        h.classList.add("font-bold")

        if (h.tagName === "H1") {
          h.classList.add("text-5xl", "mt-14", "mb-8", "text-gray-900", "border-b", "pb-4")
        } else if (h.tagName === "H2") {
          h.classList.add("text-4xl", "mt-12", "mb-6", "text-gray-900")
        } else if (h.tagName === "H3") {
          h.classList.add("text-3xl", "mt-10", "mb-5", "text-gray-800")
        } else if (h.tagName === "H4") {
          h.classList.add("text-2xl", "mt-8", "mb-4")
        } else if (h.tagName === "H5") {
          h.classList.add("text-xl", "mt-6", "mb-3")
        } else if (h.tagName === "H6") {
          h.classList.add("text-lg", "mt-6", "mb-3")
        }

        if (!h.textContent?.trim()) {
          h.innerHTML = "<br>"
        }
      })

      // Ensure tables are properly styled
      doc.querySelectorAll("table").forEach((table) => {
        table.classList.add("w-full", "border-collapse", "my-8")
        table.querySelectorAll("th").forEach((th) => {
          th.classList.add("border", "border-gray-300", "px-4", "py-2", "bg-gray-100", "font-semibold", "text-left")
        })
        table.querySelectorAll("td").forEach((td) => {
          td.classList.add("border", "border-gray-300", "px-4", "py-2")
        })
      })

      return doc.body.innerHTML
    }

    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/onerror=/gi, "")
  },

  generateToc: (htmlContent: string): Array<{ id: string; text: string; level: number }> => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, "text/html")
    const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6")
    return Array.from(headings).map((h, i) => {
      h.id = `heading-${i}`
      return {
        id: `heading-${i}`,
        text: h.textContent?.trim() || "",
        level: Number(h.tagName[1]),
      }
    })
  },

  // SEO utilities
  generateMetaTags: (
    content: string,
    title: string,
    featuredImage?: string,
  ): {
    title: string
    description: string
    keywords: string
    ogTitle: string
    ogDescription: string
    ogImage: string
  } => {
    // Extract plain text for description
    const plainText = content.replace(/<[^>]+>/g, " ").trim()

    // Generate description (first 160 characters)
    const description = plainText.substring(0, 160) + (plainText.length > 160 ? "..." : "")

    // Extract keywords from headings and content
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, "text/html")
    const headings = Array.from(doc.querySelectorAll("h1, h2, h3"))
      .map((h) => h.textContent?.trim())
      .filter(Boolean) as string[]

    // Extract potential keywords from content
    const contentWords = plainText
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 4)
      .reduce((acc: Record<string, number>, word) => {
        acc[word] = (acc[word] || 0) + 1
        return acc
      }, {})

    // Get top 10 most frequent words as keywords
    const keywords = Object.entries(contentWords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word)
      .concat(headings)
      .slice(0, 15)
      .join(", ")

    return {
      title: title,
      description,
      keywords,
      ogTitle: title,
      ogDescription: description,
      ogImage: featuredImage || "",
    }
  },

  // Generate schema markup for article
  generateSchemaMarkup: (
    content: string,
    title: string,
    author: string,
    publishDate: string,
    featuredImage?: string,
  ) => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      image: featuredImage ? [featuredImage] : [],
      datePublished: publishDate,
      dateModified: new Date().toISOString(),
      author: {
        "@type": "Person",
        name: author,
      },
      publisher: {
        "@type": "Organization",
        name: "Your Organization Name",
        logo: {
          "@type": "ImageObject",
          url: "https://yourdomain.com/logo.png",
        },
      },
      description: content
        .replace(/<[^>]+>/g, " ")
        .trim()
        .substring(0, 160),
    }

    return JSON.stringify(schema, null, 2)
  },

  // Generate canonical URL
  generateCanonicalUrl: (slug: string, baseUrl = "https://yourdomain.com") => {
    return `${baseUrl}/${slug}`
  },

  // Optimize external links
  optimizeExternalLinks: (html: string): string => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    doc.querySelectorAll("a").forEach((link) => {
      const href = link.getAttribute("href")
      if (href && (href.startsWith("http") || href.startsWith("https"))) {
        // External link - add proper attributes
        link.setAttribute("target", "_blank")
        link.setAttribute("rel", "noopener noreferrer")

        // Add external link icon if not already present
        if (!link.querySelector(".external-link-icon")) {
          link.classList.add("external-link")
          link.innerHTML += ' <span class="external-link-icon">↗</span>'
        }
      }
    })

    return doc.body.innerHTML
  },

  // Process HTML for Next.js
  processHtmlForNextJs: (html: string): string => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    // Process images for Next.js Image component
    doc.querySelectorAll("img").forEach((img, index) => {
      const src = img.getAttribute("src") || ""
      const alt = img.getAttribute("alt") || `Image ${index + 1}`
      const width = img.getAttribute("width") || "1200"
      const height = img.getAttribute("height") || "675"
      const className = img.getAttribute("class") || ""

      // Replace with Next.js Image component syntax
      const imageComponent = `<Image
  src="${src}"
  alt="${alt}"
  width={${width}}
  height={${height}}
  className="${className}"
/>`

      // Create a placeholder element to hold our component reference
      const placeholder = doc.createElement("span")
      placeholder.setAttribute("data-nextjs-image", imageComponent)
      placeholder.style.display = "none"
      img.parentNode?.insertBefore(placeholder, img)
    })

    // Process links for Next.js Link component
    doc.querySelectorAll("a").forEach((a) => {
      const href = a.getAttribute("href") || ""
      const isExternal = href.startsWith("http") || href.startsWith("https")

      if (!isExternal && !href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("tel:")) {
        // Internal link - use Next.js Link component
        const linkContent = a.innerHTML
        const className = a.getAttribute("class") || ""

        // Create a placeholder for Next.js Link component
        const linkComponent = `<Link href="${href}" className="${className}">${linkContent}</Link>`
        const placeholder = doc.createElement("span")
        placeholder.setAttribute("data-nextjs-link", linkComponent)
        placeholder.style.display = "none"
        a.parentNode?.insertBefore(placeholder, a)
      }
    })

    return doc.body.innerHTML
  },

  // Convert HTML to Next.js JSX
  convertHtmlToNextJs: (html: string, title: string, metaTags: any): string => {
    // Process HTML for Next.js components
    const processedHtml = formatUtils.processHtmlForNextJs(html)

    // Convert processed HTML to JSX
    const jsxContent = processedHtml
      // Replace Next.js Image placeholders
      .replace(/<span[^>]*data-nextjs-image="([^"]*)"[^>]*><\/span>/g, (_, imageComponent) => {
        return imageComponent.replace(/&quot;/g, '"')
      })
      // Replace Next.js Link placeholders
      .replace(/<span[^>]*data-nextjs-link="([^"]*)"[^>]*><\/span>/g, (_, linkComponent) => {
        return linkComponent.replace(/&quot;/g, '"')
      })
      // Handle YouTube embeds
      .replace(
        /<div class="youtube-embed-wrapper[^"]*"[^>]*>[\s\S]*?<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/([^"]*)".*?<\/iframe>[\s\S]*?<\/div>/g,
        (match, videoId) => {
          return `<div className="relative my-8 w-full pt-[56.25%]">
  <iframe 
    className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
    src="https://www.youtube.com/embed/${videoId}" 
    title="YouTube video player" 
    frameBorder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowFullScreen
  ></iframe>
</div>`
        },
      )
      // Convert HTML classes to JSX className
      .replace(/class="/g, 'className="')
      // Fix other HTML attributes that need to be camelCased in JSX
      .replace(/for="/g, 'htmlFor="')
      .replace(/tabindex="/g, 'tabIndex="')
      .replace(/frameborder="/g, 'frameBorder="')
      .replace(/allowfullscreen/g, "allowFullScreen")
      // Handle tables
      .replace(/<table[^>]*>/g, '<table className="w-full border-collapse my-8">')
      .replace(/<th[^>]*>/g, '<th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">')
      .replace(/<td[^>]*>/g, '<td className="border border-gray-300 px-4 py-2">')

    // Create the full Next.js component
    const jsxCode = `import type { Metadata } from "next"
import Image from "next/image"

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // In a real application, you would fetch the blog post data based on the slug
  // For now, we'll use hardcoded data matching the content
  return {
    title: "${metaTags.title || title}",
    description: "${metaTags.description}",
    keywords: "${metaTags.keywords}",
    openGraph: {
      title: "${metaTags.ogTitle || title}",
      description: "${metaTags.ogDescription}",
      images: ["${metaTags.ogImage}"],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: "${metaTags.ogTitle || title}",
      description: "${metaTags.ogDescription}",
      images: ["${metaTags.ogImage}"],
    },
    alternates: {
      canonical: "${metaTags.canonicalUrl}",
    },
  }
}

export default function BlogPost() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <div className="prose prose-lg max-w-none">
        <div className="blog-content">
          ${jsxContent}
        </div>
      </div>
    </article>
  )
}

// Generate static params for the blog post
export async function generateStaticParams() {
  // This would typically fetch from your CMS or database
  return [{ slug: "${title.toLowerCase().replace(/\s+/g, "-")}" }]
}
`
    return jsxCode
  },

  // Format HTML with proper indentation
  formatHtml: (html: string, metaTags: any): string => {
    // Process HTML for better formatting
    const processedHtml = html
      // Ensure YouTube embeds have proper attributes
      .replace(/<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/([^"]*)"[^>]*>/g, (match, videoId) => {
        return `<iframe 
  src="https://www.youtube.com/embed/${videoId}" 
  title="YouTube video player" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
  class="absolute top-0 left-0 w-full h-full"
></iframe>`
      })
      // Ensure tables have proper classes
      .replace(/<table>/g, '<table class="w-full border-collapse my-8">')
      .replace(/<th>/g, '<th class="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">')
      .replace(/<td>/g, '<td class="border border-gray-300 px-4 py-2">')

    // Create a full HTML document with proper meta tags
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metaTags.title}</title>
  <meta name="description" content="${metaTags.description}">
  <meta name="keywords" content="${metaTags.keywords}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${metaTags.canonicalUrl}">
  <meta property="og:title" content="${metaTags.ogTitle}">
  <meta property="og:description" content="${metaTags.ogDescription}">
  <meta property="og:image" content="${metaTags.ogImage}">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${metaTags.canonicalUrl}">
  <meta property="twitter:title" content="${metaTags.ogTitle}">
  <meta property="twitter:description" content="${metaTags.ogDescription}">
  <meta property="twitter:image" content="${metaTags.ogImage}">
  
  <!-- Canonical Link -->
  <link rel="canonical" href="${metaTags.canonicalUrl}">
  
  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Saira:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Styles -->
  <style>
    body {
      font-family: 'Saira', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 1.5rem auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 2rem;
      margin-bottom: 1rem;
      font-weight: bold;
      line-height: 1.25;
      text-align: left;
    }
    h1 {
      font-size: 2.5rem;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.5rem;
    }
    h2 {
      font-size: 2rem;
    }
    h3 {
      font-size: 1.75rem;
    }
    p {
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
      text-align: left;
    }
    a {
      color: #0070f3;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    a.external-link::after {
      content: "↗";
      display: inline-block;
      margin-left: 3px;
      font-size: 0.8em;
      vertical-align: super;
      opacity: 0.7;
    }
    .youtube-embed-wrapper {
      position: relative;
      width: 100%;
      padding-top: 56.25%;
      margin: 1.5rem auto;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .youtube-embed-wrapper iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
    pre {
      background-color: #f6f8fa;
      border-radius: 6px;
      padding: 16px;
      overflow: auto;
      font-family: monospace;
      text-align: left;
    }
    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 16px;
      margin-left: 0;
      color: #666;
      text-align: left;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 2rem auto;
    }
    th {
      background-color: #f6f8fa;
      font-weight: 600;
      text-align: center;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px 12px;
      text-align: center;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    ul, ol {
      text-align: left;
      list-style-position: outside;
      padding-left: 2rem;
    }
  </style>
  
  ${
    metaTags.enableSchema
      ? `<script type="application/ld+json">
${formatUtils.generateSchemaMarkup(html, metaTags.title, "Author Name", new Date().toISOString(), metaTags.ogImage)}
</script>`
      : ""
  }
</head>
<body>
  <article>
    ${processedHtml}
  </article>
</body>
</html>`

    return fullHtml
  },

  // Count words in content
  countWords: (content: string): number => {
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]+>/g, " ").trim()
    // Split by whitespace and filter out empty strings
    const words = plainText.split(/\s+/).filter((word) => word.length > 0)
    return words.length
  },
}

interface CustomEditorProps {
  initialValue: string
  onChange: (newContent: string) => void
  images: string[]
  onGenerateMore: () => void
  citations: string[]
  postId: string // Added postId prop for Supabase updates
  title?: string
  slug?: string
  author?: string
  publishDate?: string
  featuredImage?: string
}

interface SeoSettings {
  title: string
  description: string
  keywords: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  canonicalUrl: string
  enableSchema: boolean
}

// Code View Modal
const CodeViewModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  content: string
  title: string
  seoSettings: SeoSettings
  codeType: "html" | "nextjs"
}> = ({ isOpen, onClose, content, title, seoSettings, codeType }) => {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"html" | "nextjs">(codeType)

  const formattedHtml = useMemo(() => {
    return formatUtils.formatHtml(content, seoSettings)
  }, [content, seoSettings])

  const nextJsCode = useMemo(() => {
    return formatUtils.convertHtmlToNextJs(content, title, seoSettings)
  }, [content, title, seoSettings])

  const handleCopy = () => {
    const codeToCopy = activeTab === "html" ? formattedHtml : nextJsCode
    navigator.clipboard.writeText(codeToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <FileCode className="h-5 w-5 mr-2 text-orange-600" />
            Code View
          </h2>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-100 p-1 rounded-md flex">
              <button
                onClick={() => setActiveTab("html")}
                className={`px-3 py-1 rounded ${activeTab === "html" ? "bg-white shadow" : ""}`}
              >
                HTML
              </button>
              <button
                onClick={() => setActiveTab("nextjs")}
                className={`px-3 py-1 rounded ${activeTab === "nextjs" ? "bg-white shadow" : ""}`}
              >
                Next.js
              </button>
            </div>
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-gray-100 rounded-full flex items-center gap-1 text-gray-600"
              title="Copy code"
            >
              {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <pre className="bg-white p-4 rounded-md shadow-sm overflow-auto h-full text-sm font-mono">
            {activeTab === "html" ? formattedHtml : nextJsCode}
          </pre>
        </div>
      </div>
    </div>
  )
}

// SEO Settings Modal
const SeoSettingsModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  settings: SeoSettings
  onSave: (settings: SeoSettings) => void
}> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<SeoSettings>(settings)

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings)
    }
  }, [isOpen, settings])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setLocalSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setLocalSettings((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(localSettings)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <Settings className="h-5 w-5 mr-2 text-orange-600" />
            SEO Settings
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={localSettings.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <p className="mt-1 text-xs text-gray-500">Recommended length: 50-60 characters</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={localSettings.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <p className="mt-1 text-xs text-gray-500">Recommended length: 150-160 characters</p>
            </div>

            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
                Keywords
              </label>
              <input
                id="keywords"
                name="keywords"
                type="text"
                value={localSettings.keywords}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <p className="mt-1 text-xs text-gray-500">Comma-separated keywords</p>
            </div>

            <div>
              <label htmlFor="ogTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Open Graph Title
              </label>
              <input
                id="ogTitle"
                name="ogTitle"
                type="text"
                value={localSettings.ogTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="ogDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Open Graph Description
              </label>
              <textarea
                id="ogDescription"
                name="ogDescription"
                rows={2}
                value={localSettings.ogDescription}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="ogImage" className="block text-sm font-medium text-gray-700 mb-1">
                Open Graph Image URL
              </label>
              <input
                id="ogImage"
                name="ogImage"
                type="text"
                value={localSettings.ogImage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="canonicalUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Canonical URL
              </label>
              <input
                id="canonicalUrl"
                name="canonicalUrl"
                type="text"
                value={localSettings.canonicalUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center">
              <input
                id="enableSchema"
                name="enableSchema"
                type="checkbox"
                checked={localSettings.enableSchema}
                onChange={handleToggle}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="enableSchema" className="ml-2 block text-sm text-gray-700">
                Enable Schema Markup
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
              Save SEO Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Preview Modal
const PreviewModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  content: string
  title: string
  seoSettings: SeoSettings
}> = ({ isOpen, onClose, content, title, seoSettings }) => {
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile" | "serp">("desktop")

  if (!isOpen) return null

  const renderSerpPreview = () => (
    <div className="bg-white p-4 rounded-md border border-gray-200 max-w-2xl mx-auto">
      <div className="text-xl text-blue-600 font-medium mb-1 hover:underline cursor-pointer">
        {seoSettings.title || title}
      </div>
      <div className="text-green-700 text-sm mb-1">{seoSettings.canonicalUrl}</div>
      <div className="text-gray-600 text-sm">{seoSettings.description}</div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <Eye className="h-5 w-5 mr-2 text-orange-600" />
            Preview
          </h2>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-100 p-1 rounded-md flex">
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`px-3 py-1 rounded ${previewMode === "desktop" ? "bg-white shadow" : ""}`}
              >
                Desktop
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`px-3 py-1 rounded ${previewMode === "mobile" ? "bg-white shadow" : ""}`}
              >
                Mobile
              </button>
              <button
                onClick={() => setPreviewMode("serp")}
                className={`px-3 py-1 rounded ${previewMode === "serp" ? "bg-white shadow" : ""}`}
              >
                SERP
              </button>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          {previewMode === "serp" ? (
            renderSerpPreview()
          ) : (
            <div
              className={`bg-white mx-auto overflow-auto ${previewMode === "mobile" ? "max-w-sm" : "max-w-4xl"}`}
              style={{
                height: previewMode === "mobile" ? "80vh" : "auto",
                boxShadow: "0 0 20px rgba(0,0,0,0.1)",
                fontFamily: "'Saira', sans-serif",
              }}
            >
              <div className="p-4 text-center">
                <h1 className="text-3xl font-bold mb-4">{title}</h1>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Basic Editor Component
const BasicEditor: React.FC<{
  value: string
  onChange: (value: string) => void
  className?: string
  postId: string
  title: string
  seoSettings: SeoSettings
  onViewCode: (codeType: "html" | "nextjs") => void
}> = ({ value, onChange, className, postId, title, seoSettings, onViewCode }) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showToolbar, setShowToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })
  const selectionTimeout = useRef<NodeJS.Timeout | null>(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [showYouTubeModal, setShowYouTubeModal] = useState(false)
  const [showTableModal, setShowTableModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const lastSelectionRef = useRef<Range | null>(null)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const contextMenuTarget = useRef<HTMLElement | null>(null)
  const isComposingRef = useRef<boolean>(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [hasPostId, setHasPostId] = useState(!!postId)
  const [supabaseChannel, setSupabaseChannel] = useState<any>(null)

  // Load Saira font
  useEffect(() => {
    const link = document.createElement("link")
    link.href = "https://fonts.googleapis.com/css2?family=Saira:wght@300;400;500;600;700&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  const memoizedHandleSelectionChange = useCallback(() => {
    const selection = window.getSelection()
    if (
      selection &&
      !selection.isCollapsed &&
      selection.rangeCount > 0 &&
      editorRef.current?.contains(selection.anchorNode)
    ) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      if (rect.width > 0) {
        setToolbarPosition({ x: rect.left + rect.width / 2, y: rect.top - 10 + window.scrollY })
        setShowToolbar(true)
      }
    } else {
      if (selectionTimeout.current) clearTimeout(selectionTimeout.current)
      selectionTimeout.current = setTimeout(() => setShowToolbar(false), 200)
    }
  }, [])

  // Initialize editor only once on mount
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value.startsWith("<")
        ? formatUtils.sanitizeHtml(value)
        : formatUtils.convertMarkdownToHtml(value)
    }
  }, [value])

  // Sync external value changes while preserving cursor
  useEffect(() => {
    if (!editorRef.current) return
    const currentContent = editorRef.current.innerHTML
    const newContent = value.startsWith("<")
      ? formatUtils.sanitizeHtml(value)
      : formatUtils.convertMarkdownToHtml(value)

    if (currentContent !== newContent) {
      const selection = window.getSelection()
      const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null

      editorRef.current.innerHTML = newContent

      if (range && editorRef.current.contains(range.startContainer)) {
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    }
  }, [value])

  // Set up Supabase realtime subscription
  useEffect(() => {
    let channel: any = null

    const subscribeToChannel = async () => {
      if (postId) {
        setHasPostId(true)

        try {
          channel = supabase
            .channel(`post-${postId}`)
            .on(
              "postgres_changes",
              {
                event: "UPDATE",
                schema: "public",
                table: "posts",
                filter: `id=eq.${postId}`,
              },
              (payload) => {
                if (payload.new && payload.new.content !== value && !isSaving) {
                  const newContent = payload.new.content
                  if (editorRef.current) {
                    editorRef.current.innerHTML = newContent.startsWith("<")
                      ? formatUtils.sanitizeHtml(newContent)
                      : formatUtils.convertMarkdownToHtml(newContent)
                    onChange(newContent)
                  }
                }
              },
            )
            .subscribe((status) => {
              if (status === "SUBSCRIBED") {
                setIsSubscribed(true)
              }
            })

          setSupabaseChannel(channel)
          console.log("Subscribed to Supabase channel:", `post-${postId}`)
        } catch (error) {
          console.error("Error subscribing to Supabase channel:", error)
        }
      }
    }

    subscribeToChannel()

    // Cleanup function
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
        setSupabaseChannel(null)
        console.log("Unsubscribed from Supabase channel")
      }
      setIsSubscribed(false)
    }
  }, [postId, isSaving, onChange, value])

  // Save content to Supabase with debounce
  const saveContent = useCallback(
    async (content: string) => {
      if (!postId || !content) return

      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      // Set a new timeout to save after 500ms of inactivity
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          setIsSaving(true)
          setSaveStatus("saving")

          // Check if Supabase client is initialized
          if (!supabase) {
            throw new Error("Supabase client not initialized")
          }

          // Add error handling and logging
          const { error, data } = await supabase
            .from("posts")
            .update({
              content,
              updated_at: new Date().toISOString(),
              seo_settings: seoSettings,
            })
            .eq("id", postId)

          if (error) {
            console.error("Supabase error:", error?.message || JSON.stringify(error) || "Unknown error")
            setSaveStatus("error")
            return false
          }

          console.log("Content saved successfully:", data)
          setSaveStatus("saved")

          // Reset to idle after 2 seconds
          setTimeout(() => {
            setSaveStatus("idle")
          }, 2000)
        } catch (err) {
          console.error("Error saving content:", (err as any)?.message || JSON.stringify(err) || "Unknown error")
          setSaveStatus("error")
        } finally {
          setIsSaving(false)
        }
      }, 500)
    },
    [postId, seoSettings],
  )

  // Selection change for toolbar
  useEffect(() => {
    const handleSelectionChange = () => {
      memoizedHandleSelectionChange()
    }

    document.addEventListener("selectionchange", handleSelectionChange)
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange)
      if (selectionTimeout.current) clearTimeout(selectionTimeout.current)
    }
  }, [memoizedHandleSelectionChange])

  // Handle context menu for images and embeds
  useEffect(() => {
    if (!editorRef.current) return
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Check if target is an image or inside a YouTube embed wrapper
      const isImage = target.tagName === "IMG"
      const isYouTubeEmbed = target.tagName === "IFRAME" || target.closest(".youtube-embed-wrapper") !== null

      if ((isImage || isYouTubeEmbed) && editorRef.current?.contains(target)) {
        e.preventDefault()
        setContextMenuPosition({ x: e.clientX, y: e.clientY })
        contextMenuTarget.current = isYouTubeEmbed ? target.closest(".youtube-embed-wrapper") || target : target
        setShowContextMenu(true)
      } else if (showContextMenu) {
        setShowContextMenu(false)
      }
    }
    editorRef.current.addEventListener("contextmenu", handleContextMenu)
    return () => editorRef.current?.removeEventListener("contextmenu", handleContextMenu)
  }, [showContextMenu])

  // Execute editor commands
  const execCommand = useCallback(
    (command: string, value?: string) => {
      // First, focus the editor if it's not already focused
      if (document.activeElement !== editorRef.current) {
        editorRef.current?.focus()
      }

      // Special handling for certain commands
      if (command === "generateImage") {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) lastSelectionRef.current = selection.getRangeAt(0).cloneRange()
        setShowImageModal(true)
        return
      }

      if (command === "embedYouTube") {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) lastSelectionRef.current = selection.getRangeAt(0).cloneRange()
        setShowYouTubeModal(true)
        return
      }

      if (command === "insertTable") {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) lastSelectionRef.current = selection.getRangeAt(0).cloneRange()
        setShowTableModal(true)
        return
      }

      if (command === "preview") {
        setShowPreviewModal(true)
        return
      }

      if (command === "viewHtmlCode") {
        onViewCode("html")
        return
      }

      if (command === "viewNextJsCode") {
        onViewCode("nextjs")
        return
      }

      if (command === "code") {
        // Handle code blocks more explicitly
        document.execCommand("formatBlock", false, "pre")
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const pre = range.startContainer.parentElement?.closest("pre")
          if (pre) {
            pre.className = "bg-gray-100 p-2 rounded-md font-mono text-sm my-4"
          }
        }
      } else if (command === "createLink" && value) {
        document.execCommand(command, false, value)
        // Apply styling to the newly created link
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const linkNode = range.startContainer.parentElement?.closest("a")
          if (linkNode) {
            // Check if it's an external link
            const isExternal = value.startsWith("http") || value.startsWith("https")
            if (isExternal) {
              linkNode.className = "text-orange-600 underline hover:text-orange-700 font-normal external-link"
              linkNode.target = "_blank"
              linkNode.rel = "noopener noreferrer"
            } else {
              // Internal link
              linkNode.className = "text-blue-600 hover:text-blue-800 font-normal"
            }
          }
        }
      } else {
        // Standard command execution
        document.execCommand(command, false, value)
      }

      // Update content and save changes
      if (editorRef.current) {
        const newContent = editorRef.current.innerHTML
        onChange(newContent)
        saveContent(newContent)
      }
    },
    [onChange, saveContent, onViewCode],
  )

  // Handle media deletion (images or YouTube embeds)
  const handleDeleteMedia = useCallback(() => {
    if (contextMenuTarget.current && editorRef.current) {
      const elementToRemove =
        contextMenuTarget.current.closest(".image-wrapper") ||
        contextMenuTarget.current.closest(".youtube-embed-wrapper") ||
        contextMenuTarget.current
      elementToRemove?.remove()
      const newContent = editorRef.current.innerHTML
      onChange(newContent)
      saveContent(newContent)
      setShowContextMenu(false)
    }
  }, [onChange, saveContent])

  // Handle input events
  const handleInput = useCallback(() => {
    if (editorRef.current && !isComposingRef.current) {
      const selection = window.getSelection()
      const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null
      const newContent = editorRef.current.innerHTML
      onChange(newContent)
      saveContent(newContent)
      if (range && editorRef.current.contains(range.startContainer)) {
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    }
  }, [onChange, saveContent])

  // Handle composition (e.g., IME input)
  const handleCompositionStart = () => {
    isComposingRef.current = true
  }

  const handleCompositionEnd = () => {
    isComposingRef.current = false
    handleInput()
  }

  // Handle keydown (e.g., Enter, Backspace)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Handle special key combinations for formatting
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault()
            execCommand("bold")
            return
          case "i":
            e.preventDefault()
            execCommand("italic")
            return
          case "u":
            e.preventDefault()
            execCommand("underline")
            return
          case "k":
            e.preventDefault()
            const url = prompt("Enter URL:", "https://")
            if (url && url.trim()) execCommand("createLink", url.trim())
            return
          case "z":
            e.preventDefault()
            execCommand("undo")
            return
          case "y":
            e.preventDefault()
            execCommand("redo")
            return
          case "p":
            if (e.shiftKey) {
              e.preventDefault()
              execCommand("preview")
              return
            }
            break
        }
      }

      // Original Enter key handling for headings
      if (e.key === "Enter") {
        const selection = window.getSelection()
        if (!selection || !selection.rangeCount) return
        const range = selection.getRangeAt(0)
        let currentNode: Node | null = range.startContainer

        while (currentNode && !["H1", "H2", "H3", "H4", "H5", "H6"].includes(currentNode.nodeName)) {
          currentNode = currentNode.nodeType === 3 ? currentNode.parentNode : currentNode.parentElement
          if (!currentNode) break
        }

        if (currentNode && currentNode.parentNode) {
          e.preventDefault()
          const p = document.createElement("p")
          p.className = "mt-6 mb-6 text-gray-700 leading-relaxed font-normal"
          p.innerHTML = "<br>"
          if (currentNode.nextSibling) {
            currentNode.parentNode.insertBefore(p, currentNode.nextSibling)
          } else {
            currentNode.parentNode.appendChild(p)
          }
          const newRange = document.createRange()
          newRange.setStart(p, 0)
          newRange.collapse(true)
          selection.removeAllRanges()
          selection.addRange(newRange)
          if (editorRef.current) {
            const newContent = editorRef.current.innerHTML
            onChange(newContent)
            saveContent(newContent)
          }
        }
      }
    },
    [onChange, saveContent, execCommand],
  )

  // Handle paste
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault()
      const text = e.clipboardData.getData("text/plain")
      document.execCommand("insertText", false, text)
      if (editorRef.current) {
        const newContent = editorRef.current.innerHTML
        onChange(newContent)
        saveContent(newContent)
      }
    },
    [onChange, saveContent],
  )

  return (
    <div className="relative bg-white">
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        content={value}
        title={title}
        seoSettings={seoSettings}
      />
      <ContextMenu
        visible={showContextMenu}
        position={contextMenuPosition}
        onClose={() => setShowContextMenu(false)}
        onDelete={handleDeleteMedia}
      />
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-2 p-2 sm:p-3">
          <select
            onChange={(e) => execCommand("formatBlock", e.target.value)}
            className="px-3 py-1.5 border rounded-md bg-white text-sm min-w-[100px]"
            style={{ fontFamily: "'Saira', sans-serif" }}
          >
            <option value="p">Normal</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6</option>
          </select>
          <button onClick={() => execCommand("bold")} className="p-1.5 hover:bg-gray-200 rounded" title="Bold">
            <Bold className="w-4 h-4" />
          </button>
          <button onClick={() => execCommand("italic")} className="p-1.5 hover:bg-gray-200 rounded" title="Italic">
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => execCommand("underline")}
            className="p-1.5 hover:bg-gray-200 rounded"
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            onClick={() => execCommand("insertOrderedList")}
            className="p-1.5 hover:bg-gray-200 rounded"
            title="Ordered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => execCommand("insertUnorderedList")}
            className="p-1.5 hover:bg-gray-200 rounded"
            title="Unordered List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => execCommand("insertTable")}
            className="p-1.5 hover:bg-gray-200 rounded"
            title="Insert Table"
          >
            <Table className="w-4 h-4" />
          </button>
          <div className="border-l border-gray-300 h-6 mx-1"></div>
          <button onClick={() => execCommand("preview")} className="p-1.5 hover:bg-gray-200 rounded" title="Preview">
            <Eye className="w-4 h-4" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-sm text-gray-600">{formatUtils.countWords(value)} words</div>
            {saveStatus === "saving" && (
              <div className="flex items-center text-gray-500 text-xs">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Saving...
              </div>
            )}
            {saveStatus === "saved" && (
              <div className="flex items-center text-green-600 text-xs">
                <Save className="w-3 h-3 mr-1" />
                Saved
              </div>
            )}
            {saveStatus === "error" && (
              <div className="flex items-center text-red-600 text-xs">
                <AlertCircle className="w-3 h-3 mr-1" />
                Error saving
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        className={`p-4 sm:p-6 md:p-8 min-h-[500px] focus:outline-none prose prose-lg max-w-none ${className}`}
        style={{ backgroundColor: "white", fontFamily: "'Saira', sans-serif", textAlign: "left" }}
      />
      <style jsx global>{`
        .prose img {
          border-radius: 0.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          aspect-ratio: 16/9;
          object-fit: cover;
          width: 100%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin: 0 auto;
        }

        .prose img:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
        }

        .image-wrapper {
          margin: 2rem auto;
          position: relative;
          text-align: center;
        }

        [contenteditable] {
          outline: none;
          font-family: 'Saira', sans-serif;
          text-align: left;
        }

        /* YouTube embed styling */
        .youtube-embed-wrapper {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 Aspect Ratio */
          margin: 2rem auto;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .youtube-embed-wrapper:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
        }

        .youtube-embed-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }

        /* External link styling */
        .external-link {
          position: relative;
        }

        .external-link::after {
          content: "↗";
          display: inline-block;
          margin-left: 3px;
          font-size: 0.8em;
          vertical-align: super;
          opacity: 0.7;
        }

        /* Table styling */
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem auto;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        th {
          background-color: #f7fafc;
          font-weight: 600;
          text-align: center;
          color: #4a5568;
        }

        th, td {
          border: 1px solid #e2e8f0;
          padding: 0.75rem 1rem;
          text-align: center;
        }

        tr:nth-child(even) {
          background-color: #f9fafb;
        }

        tr:hover {
          background-color: #f3f4f6;
        }

        /* Formatting styles */
        [contenteditable] h1, [contenteditable] h2, [contenteditable] h3,
        [contenteditable] h4, [contenteditable] h5, [contenteditable] h6 {
          font-family: 'Saira', sans-serif;
          text-align: left;
          margin-left: auto;
          margin-right: auto;
        }

        [contenteditable] h1 {
          font-size: 2.5rem;
          font-weight: bold;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: #1a202c;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.5rem;
        }
        [contenteditable] h2 {
          font-size: 2rem;
          font-weight: bold;
          margin-top: 1.4rem;
          margin-bottom: 0.8rem;
          color: #1a202c;
        }
        [contenteditable] h3 {
          font-size: 1.75rem;
          font-weight: bold;
          margin-top: 1.3rem;
          margin-bottom: 0.7rem;
          color: #2d3748;
        }
        [contenteditable] h4 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 1.2rem;
          margin-bottom: 0.6rem;
          color: #2d3748;
        }
        [contenteditable] h5 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-top: 1.1rem;
          margin-bottom: 0.5rem;
          color: #4a5568;
        }
        [contenteditable] h6 {
          font-size: 1.1rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #4a5568;
        }
        [contenteditable] pre {
          background-color: #f7fafc;
          padding: 1rem;
          border-radius: 0.375rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.875rem;
          margin: 1.5rem auto;
          white-space: pre-wrap;
          border: 1px solid #e2e8f0;
          overflow-x: auto;
          text-align: left;
        }
        [contenteditable] ul, [contenteditable] ol {
          list-style-position: outside;
          margin: 1.5rem auto;
          padding-left: 2rem;
          text-align: left;
        }
        [contenteditable] li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
          font-family: 'Saira', sans-serif;
        }
        [contenteditable] a {
          color: #ea580c; /* orange-600 */
          text-decoration: underline;
          transition: color 0.2s ease;
          font-family: 'Saira', sans-serif;
        }
        [contenteditable] a:hover {
          color: #c2410c; /* orange-700 */
        }
        [contenteditable] p {
          text-align: left;
          margin-left: auto;
          margin-right: auto;
          font-family: 'Saira', sans-serif;
        }
        [contenteditable] strong {
          font-weight: bold;
        }
        [contenteditable] em {
          font-style: italic;
        }
        [contenteditable] u {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}

// Context Menu Component
const ContextMenu: React.FC<{
  visible: boolean
  position: { x: number; y: number }
  onClose: () => void
  onDelete: () => void
}> = ({ visible, position, onClose, onDelete }) => {
  if (!visible) return null

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const menu = document.querySelector(".fixed.z-50")
      if (menu && !menu.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
      style={{ top: `${position.y}px`, left: `${position.x}px`, minWidth: "160px" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="py-1">
        <button
          className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete()
            onClose()
          }}
        >
          <X className="w-4 h-4 mr-2" />
          Delete Media
        </button>
      </div>
    </div>
  )
}

// Main CustomEditor Component
export default function CustomEditor({
  initialValue,
  onChange,
  images,
  onGenerateMore,
  citations,
  postId,
  title = "",
  slug = "",
  author = "Anonymous",
  publishDate = new Date().toISOString(),
  featuredImage = "",
}: CustomEditorProps) {
  const [content, setContent] = useState(initialValue)
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([])
  const router = useRouter()
  const [seoSettings, setSeoSettings] = useState<SeoSettings>(() => {
    const metaTags = formatUtils.generateMetaTags(initialValue, title, featuredImage)
    return {
      ...metaTags,
      canonicalUrl: formatUtils.generateCanonicalUrl(slug || "blog-post"),
      enableSchema: true,
    }
  })
  const [showCodeView, setShowCodeView] = useState(false)
  const [codeViewType, setCodeViewType] = useState<"html" | "nextjs">("html")

  useEffect(() => {
    const formattedContent = initialValue.startsWith("<")
      ? formatUtils.sanitizeHtml(initialValue)
      : formatUtils.convertMarkdownToHtml(initialValue)
    setContent(formattedContent)
    setToc(formatUtils.generateToc(formattedContent))
  }, [initialValue])

  const handleContentChange = useCallback(
    (value: string) => {
      const sanitizedContent = formatUtils.sanitizeHtml(value)
      setContent(sanitizedContent)
      onChange(sanitizedContent)
      setToc(formatUtils.generateToc(sanitizedContent))
    },
    [onChange],
  )

  const handleViewCode = useCallback((type: "html" | "nextjs") => {
    setCodeViewType(type)
    setShowCodeView(true)
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <CodeViewModal
        isOpen={showCodeView}
        onClose={() => setShowCodeView(false)}
        content={content}
        title={title}
        seoSettings={seoSettings}
        codeType={codeViewType}
      />
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <span>Content Editor</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">{title}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">Publish</button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-screen-2xl mx-auto flex flex-col">
        <div className="flex-1 mx-auto w-full max-w-4xl">
          <BasicEditor
            value={content}
            onChange={handleContentChange}
            className="w-full h-full"
            postId={postId}
            title={title}
            seoSettings={seoSettings}
            onViewCode={handleViewCode}
          />
        </div>
      </main>

      <style jsx global>{`
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6, .prose p, .prose li, .prose a, [contenteditable] {
          font-family: 'Saira', sans-serif;
          text-align: left;
        }
        .prose h1 {
          font-size: 2.5rem;
          margin-top: 3rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }
        .prose h2 {
          font-size: 2rem;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
        }
        .prose p {
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
          line-height: 1.75;
        }
        [contenteditable] a {
          color: #ea580c; /* orange-600 */
          text-decoration: underline;
        }
        [contenteditable] a:hover {
          color: #c2410c; /* orange-700 */
        }
      `}</style>
    </div>
  )
}

