"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowUp, ArrowLeft, Clock, Calendar, Bookmark, ChevronRight } from "lucide-react"
import Footer from "@/app/components/footer"
import { Header } from "@/app/components/header"

// Helper function to extract a title from blog post and remove asterisks
const extractTitle = (blogPost: string) => {
  if (!blogPost) return "Untitled Blog"

  // Remove asterisks from the blog post
  const cleanBlogPost = blogPost.replace(/\*/g, "")

  // Extract first sentence or first 50 characters as title
  const firstSentence = cleanBlogPost.split(".")[0]
  return firstSentence.length > 50 ? firstSentence.substring(0, 50) + "..." : firstSentence
}

// Helper function to create a URL-friendly slug from a title
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .trim() // Trim whitespace
}

// Helper function to extract the first URL from a blog post
const extractImageUrl = (blogPost: string) => {
  if (!blogPost) return null

  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/i
  const match = blogPost.match(urlRegex)

  if (match && match[0]) {
    return match[0]
  }

  // If no image URL found, try to find any URL
  const generalUrlRegex = /(https?:\/\/[^\s]+)/i
  const generalMatch = blogPost.match(generalUrlRegex)

  if (generalMatch && generalMatch[0]) {
    return generalMatch[0]
  }

  return null
}

// Helper function to estimate reading time
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// Helper function to escape special characters in regex
const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
}

interface Blog {
  user_id?: string
  blog_post?: string
  title?: string
  excerpt?: string
  date?: string
  image?: string
  id?: number
  slug?: string
  category?: string
}

// Table of Contents component
const TableOfContents = ({ blogContent }: { blogContent: string }) => {
  // Extract headings from the blog content
  const extractHeadings = (content: string) => {
    const headings: { level: number; text: string; id: string }[] = []

    // First pass: Extract markdown headings (#, ##, ###)
    const headingRegex = /^(#+)\s*(.*?)\s*$/gm
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
      headings.push({ level, text, id })
    }

    // Second pass: Extract bold text that might be headings
    const boldHeadingRegex = /\*\*(.*?)\*\*/g
    const contentCopy = content
    while ((match = boldHeadingRegex.exec(contentCopy)) !== null) {
      const text = match[1].trim()
      // Only include if it looks like a heading (starts with numbers or specific words)
      if (
        text.match(/^\d+\./) ||
        text.startsWith("Conclusion") ||
        text.startsWith("FAQ") ||
        text.startsWith("Introduction") ||
        text.startsWith("Summary") ||
        text.startsWith("Overview")
      ) {
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")

        // Check if this heading is already in our list (to avoid duplicates)
        if (!headings.some((h) => h.id === id)) {
          headings.push({ level: 2, text, id })
        }
      }
    }

    // Sort headings by their position in the document
    headings.sort((a, b) => {
      const posA = content.indexOf(a.text)
      const posB = content.indexOf(b.text)
      return posA - posB
    })

    return headings
  }

  const headings = extractHeadings(blogContent || "")

  if (headings.length === 0) {
    return <p className="text-gray-500 italic">No sections found</p>
  }

  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 sticky top-24">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2 text-[#294fd6]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        Table of Contents
      </h3>
      <nav className="toc">
        <ul className="space-y-2 text-sm">
          {headings.map((heading, index) => (
            <li
              key={index}
              className={`${
                heading.level === 1 ? "font-bold" : heading.level === 2 ? "pl-2" : heading.level === 3 ? "pl-4" : "pl-6"
              }`}
            >
              <a
                href={`#${heading.id}`}
                className="text-gray-700 hover:text-[#294fd6] transition-colors duration-200 flex items-center py-1"
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(heading.id)
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" })
                    // Update URL without refreshing the page
                    window.history.pushState(null, "", `#${heading.id}`)
                  }
                }}
              >
                <ChevronRight className="h-3 w-3 mr-1 text-[#294fd6]" />
                <span className="line-clamp-1">{heading.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

// Related Posts component
const RelatedPosts = ({ currentPostId, allPosts }: { currentPostId: number; allPosts: Blog[] }) => {
  // Get 3 random posts that are not the current post
  const relatedPosts = allPosts
    .filter((post) => post.id !== currentPostId)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {relatedPosts.map((post, index) => (
          <Link href={`/blogs/${post.slug}`} key={index} className="group">
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 h-full transition-shadow hover:shadow-md">
              <div className="relative h-40">
                <Image
                  src={post.image || "/placeholder.svg?height=400&width=600&query=blog post"}
                  alt={post.title || "Related post"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 group-hover:text-[#294fd6] transition-colors line-clamp-2">
                  {post.title || "Untitled Blog"}
                </h4>
                <p className="text-sm text-gray-500 mt-2">{post.date || "Recent post"}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Social Share component
const SocialShare = ({ title, slug }: { title: string; slug: string }) => {
  const shareUrl = `https://www.getmoreseo.org/blogs/${slug}`

  const shareLinks = [
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
        </svg>
      ),
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 mr-1">Share:</span>
      {shareLinks.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          aria-label={`Share on ${link.name}`}
        >
          {link.icon}
        </a>
      ))}
    </div>
  )
}

export default function BlogPost() {
  const params = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [allPosts, setAllPosts] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formattedContent, setFormattedContent] = useState<string>("")
  const [readingTime, setReadingTime] = useState<number>(0)
  const topRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [showTableOfContents, setShowTableOfContents] = useState(false)

  // Function to format blog content
  const formatBlogContent = (content: string) => {
    if (!content) return ""

    // Calculate reading time
    const minutes = calculateReadingTime(content)
    setReadingTime(minutes)

    // Step 1: Handle markdown headings (#, ##, ###, etc.)
    let formatted = content.replace(/^(#+)\s*(.*?)\s*$/gm, (match, hashes, text) => {
      const level = hashes.length // Number of # determines heading level
      const id = text
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
      return `<h${level} id="${id}" class="text-${4 - level + 1}xl font-bold my-6 scroll-mt-16 text-gray-900">${text.trim()}</h${level}>`
    })

    // Step 2: Format bold text with double asterisks (**text**)
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
      // Check if it looks like a heading
      if (
        p1.match(/^\d+\./) ||
        p1.startsWith("Conclusion") ||
        p1.startsWith("FAQ") ||
        p1.startsWith("Introduction") ||
        p1.startsWith("Summary") ||
        p1.startsWith("Overview")
      ) {
        const id = p1
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
        return `<h2 id="${id}" class="text-2xl font-bold my-5 scroll-mt-16 text-gray-900">${p1}</h2>`
      }
      return `<strong class="font-semibold text-gray-900">${p1}</strong>`
    })

    // Step 3: Format bold text with single asterisks (*text*)
    formatted = formatted.replace(
      /(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g,
      '<strong class="font-semibold text-gray-900">$1</strong>',
    )

    // Step 4: Format lists
    formatted = formatted.replace(/- \*\*(.*?)\*\*: ([\s\S]*?)(?=(?:- \*\*|$))/g, (match, title, description) => {
      return `<div class="my-4 bg-gray-50 p-4 rounded-lg border-l-4 border-[#294fd6]">
        <strong class="block mb-2 text-gray-900">${title}:</strong>
        <p class="text-gray-700">${description.trim()}</p>
      </div>`
    })

    // Step 5: Format bullet points
    formatted = formatted.replace(/- (.*?)(?=(?:\n|$))/g, '<li class="ml-6 list-disc my-2 text-gray-700">$1</li>')

    // Step 6: Wrap lists in ul tags
    formatted = formatted.replace(
      /<li class="ml-6 list-disc my-2 text-gray-700">(.*?)<\/li>\n<li class="ml-6 list-disc my-2 text-gray-700">/g,
      '<ul class="my-4 list-disc space-y-2">\n<li class="ml-6 list-disc my-2 text-gray-700">$1</li>\n<li class="ml-6 list-disc my-2 text-gray-700">',
    )
    formatted = formatted.replace(
      /<li class="ml-6 list-disc my-2 text-gray-700">(.*?)<\/li>\n(?!<li)/g,
      '<li class="ml-6 list-disc my-2 text-gray-700">$1</li>\n</ul>\n',
    )

    // Step 7: Format paragraphs
    const lines = formatted.split("\n")
    let formattedContent = ""
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (
        line &&
        !line.startsWith("<h") &&
        !line.startsWith("<ul") &&
        !line.startsWith("<li") &&
        !line.startsWith("<div") &&
        !line.startsWith("<p") &&
        !line.startsWith("</")
      ) {
        formattedContent += `<p class="my-4 text-gray-700 leading-relaxed">${line}</p>\n`
      } else {
        formattedContent += line + "\n"
      }
    }

    // Step 8: Format Q&A in FAQ section
    formattedContent = formattedContent.replace(
      /\*\*Q\d+: (.*?)\*\*/g,
      '<h3 class="text-xl font-semibold mt-6 mb-2 text-gray-900">$1</h3>',
    )

    // Step 9: Format image tags
    formattedContent = formattedContent.replace(
      /<img([^>]*)>/gi,
      '<img$1 class="rounded-lg max-w-full my-6 mx-auto shadow-md">',
    )

    // Step 10: Format links
    formattedContent = formattedContent.replace(
      /<a([^>]*)>/gi,
      '<a$1 class="text-[#294fd6] hover:text-[#1e3ed0] underline font-medium">',
    )

    // Step 11: Add blockquote styling
    formattedContent = formattedContent.replace(
      /<blockquote>([\s\S]*?)<\/blockquote>/gi,
      '<blockquote class="border-l-4 border-[#294fd6] pl-4 italic my-6 text-gray-700 bg-[#eef5ff] p-4 rounded-r-lg">$1</blockquote>',
    )

    // Step 12: Add code block styling
    formattedContent = formattedContent.replace(
      /<pre>([\s\S]*?)<\/pre>/gi,
      '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg my-6 overflow-x-auto">$1</pre>',
    )

    formattedContent = formattedContent.replace(
      /<code>([\s\S]*?)<\/code>/gi,
      '<code class="bg-gray-100 text-[#294fd6] px-1 py-0.5 rounded font-mono text-sm">$1</code>',
    )

    return formattedContent
  }

  // Fetch all blog posts for related posts
  const fetchAllPosts = async () => {
    try {
      const apiKey = "351f7b8a-f756-47cb-a44d-b37420d54516"
      const response = await fetch("https://www.getmoreseo.org/api/fetch-blogs", {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        console.error("API response not OK:", response.status, response.statusText)
        return []
      }

      const responseText = await response.text()

      try {
        const result = JSON.parse(responseText)
        let fetchedBlogs: any[] = []

        if (Array.isArray(result)) {
          fetchedBlogs = result
        } else if (result.blogs && Array.isArray(result.blogs)) {
          fetchedBlogs = result.blogs
        } else if (typeof result === "object" && result.blog_post) {
          fetchedBlogs = [result]
        } else if (result.error && result.blogs && Array.isArray(result.blogs)) {
          fetchedBlogs = result.blogs
        }

        // Convert to Blog format
        return fetchedBlogs.map((blog: any, index: number): Blog => {
          const blogTitle = blog.title || extractTitle(blog.blog_post)
          const imageUrl = extractImageUrl(blog.blog_post)
          const slug = createSlug(blogTitle)

          // Format the date
          let postDate
          if (blog.created_at) {
            const createdDate = new Date(blog.created_at)
            postDate = createdDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          } else {
            postDate = new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }

          return {
            id: 14 + index,
            title: blogTitle,
            excerpt: blog.excerpt || "",
            date: postDate,
            slug,
            image: imageUrl || "/diverse-blog-community.png",
            blog_post: blog.blog_post,
            user_id: blog.user_id,
            category: ["SEO", "Directory Submissions", "Backlinks", "SaaS Growth"][Math.floor(Math.random() * 4)],
          }
        })
      } catch (parseError) {
        console.error("Failed to parse API response:", parseError)
        return []
      }
    } catch (err) {
      console.error("Error fetching all blogs:", err)
      return []
    }
  }

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Get the slug from the URL
        const slug = params.slug as string

        // Fetch all posts for related posts
        const allPostsData = await fetchAllPosts()
        setAllPosts(allPostsData)

        // Try to find the blog with a matching slug
        let foundBlog: Blog | null = null

        for (const currentBlog of allPostsData) {
          if (!currentBlog.title && !currentBlog.blog_post) continue

          // Try to match by title first if available
          if (currentBlog.title) {
            const titleSlug = createSlug(currentBlog.title)
            if (titleSlug === slug || titleSlug.includes(slug) || slug.includes(titleSlug)) {
              foundBlog = currentBlog
              break
            }
          }

          // If no match by title, try with extracted title
          if (currentBlog.blog_post) {
            const extractedTitle = extractTitle(currentBlog.blog_post)
            const extractedSlug = createSlug(extractedTitle)

            // Check for exact match or partial match
            if (extractedSlug === slug || extractedSlug.includes(slug) || slug.includes(extractedSlug)) {
              foundBlog = currentBlog
              break
            }
          }
        }

        if (foundBlog) {
          setBlog(foundBlog)

          // Process the blog content to remove the title if it appears at the beginning
          let contentToFormat = foundBlog.blog_post || ""
          const blogTitle = foundBlog.title || extractTitle(contentToFormat)

          // Try to remove the title from the beginning of the content
          if (blogTitle) {
            // Escape special characters for regex
            const escapedTitle = escapeRegExp(blogTitle)

            // Remove title if it appears as plain text at the beginning
            contentToFormat = contentToFormat.replace(new RegExp(`^\\s*${escapedTitle}\\s*[\\.\\!\\?]?\\s*`, "i"), "")

            // Remove title if it appears as a heading at the beginning
            contentToFormat = contentToFormat.replace(new RegExp(`^\\s*#+\\s*${escapedTitle}\\s*$`, "im"), "")

            // Remove title if it appears with markdown bold formatting at the beginning
            contentToFormat = contentToFormat.replace(
              new RegExp(`^\\s*\\*\\*${escapedTitle}\\*\\*\\s*[\\.\\!\\?]?\\s*`, "i"),
              "",
            )
          }

          setFormattedContent(formatBlogContent(contentToFormat))
        } else {
          // If no exact match found, try partial matching
          const partialMatches = allPostsData.filter((blog) => {
            if (!blog.title && !blog.blog_post) return false

            // Try to match by title first if available
            if (blog.title) {
              const titleSlug = createSlug(blog.title)
              return titleSlug.includes(slug.substring(0, 10)) || slug.includes(titleSlug.substring(0, 10))
            }

            // If no title, try with extracted title
            if (blog.blog_post) {
              const blogTitle = extractTitle(blog.blog_post)
              const blogSlug = createSlug(blogTitle)
              return blogSlug.includes(slug.substring(0, 10)) || slug.includes(blogSlug.substring(0, 10))
            }

            return false
          })

          if (partialMatches.length > 0) {
            // Use the first partial match
            const matchedBlog = partialMatches[0]
            setBlog(matchedBlog)

            // Process content to remove title
            let contentToFormat = matchedBlog.blog_post || ""
            const blogTitle = matchedBlog.title || extractTitle(contentToFormat)

            if (blogTitle) {
              const escapedTitle = escapeRegExp(blogTitle)
              contentToFormat = contentToFormat.replace(new RegExp(`^\\s*${escapedTitle}\\s*[\\.\\!\\?]?\\s*`, "i"), "")
              contentToFormat = contentToFormat.replace(new RegExp(`^\\s*#+\\s*${escapedTitle}\\s*$`, "im"), "")
              contentToFormat = contentToFormat.replace(
                new RegExp(`^\\s*\\*\\*${escapedTitle}\\*\\*\\s*[\\.\\!\\?]?\\s*`, "i"),
                "",
              )
            }

            setFormattedContent(formatBlogContent(contentToFormat))
          } else {
            throw new Error("Blog not found")
          }
        }
      } catch (err) {
        console.error("Error fetching blog:", err)
        setError(err instanceof Error ? err.message : "Something went wrong!")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlog()
  }, [params.slug])

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return

      const scrollButton = document.getElementById("scroll-top-button")
      if (scrollButton) {
        if (window.scrollY > 300) {
          scrollButton.classList.remove("hidden")
        } else {
          scrollButton.classList.add("hidden")
        }
      }

      // Calculate reading progress
      const contentElement = contentRef.current
      const totalHeight = contentElement.scrollHeight - contentElement.offsetHeight
      const windowScrollTop = window.scrollY - contentElement.offsetTop

      if (windowScrollTop >= 0) {
        const scrolled = Math.min(100, Math.max(0, (windowScrollTop / totalHeight) * 100))
        setProgress(scrolled)
      }

      // Show table of contents after scrolling past the header
      setShowTableOfContents(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#294fd6] mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md mx-auto">
          <div className="text-center p-8">
            <div className="h-16 w-16 text-gray-400 mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog post not found</h2>
            <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">You might be interested in:</h3>
              <div className="space-y-4">
                {allPosts.slice(0, 3).map((post, index) => (
                  <div
                    key={index}
                    className="text-left border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <Link href={`/blogs/${post.slug}`} className="block">
                      <h4 className="font-medium text-[#294fd6] hover:underline">{post.title}</h4>
                      <p className="text-sm text-gray-500 mt-2">{post.date}</p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => router.push("/blogs")}
              className="mt-8 px-6 py-3 bg-[#294fd6] text-white rounded-full hover:bg-[#1e3ed0] transition-colors inline-flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              View all blogs
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-[#294fd6] z-50 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div ref={topRef} className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto mb-6">
          <Link
            href="/blogs"
            className="inline-flex items-center text-gray-600 hover:text-[#294fd6] transition-colors duration-200 font-medium mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2">
              {/* Blog Header */}
              <div className="mb-8">
                {blog.category && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#e6f0ff] text-[#294fd6] mb-4">
                    {blog.category}
                  </span>
                )}

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 leading-tight">
                  {blog.title || "Untitled Blog"}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                  {blog.date && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <time dateTime={blog.date}>{blog.date}</time>
                    </div>
                  )}

                  {readingTime > 0 && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{readingTime} min read</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
                  <SocialShare title={blog.title || "Blog post"} slug={blog.slug || ""} />

                  <button className="flex items-center gap-1 text-gray-600 hover:text-[#294fd6] transition-colors">
                    <Bookmark className="h-4 w-4" />
                    <span className="text-sm">Save</span>
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-8 bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl">
                  <p className="font-medium text-lg mb-2">Error loading blog post:</p>
                  <p>{error}</p>
                  <p className="mt-4 text-sm">Try these solutions:</p>
                  <ul className="list-disc ml-5 mt-2 text-sm space-y-1">
                    <li>Check if the URL is correct</li>
                    <li>Try refreshing the page</li>
                    <li>Clear your browser cache</li>
                  </ul>
                  <button
                    onClick={() => router.push("/blogs")}
                    className="mt-4 px-4 py-2 bg-[#294fd6] text-white rounded-lg hover:bg-[#1e3ed0] transition-colors"
                  >
                    Return to blog list
                  </button>
                </div>
              )}

              {/* Blog Content */}
              <div
                ref={contentRef}
                className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-gray-900 prose-headings:scroll-mt-20
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-a:text-[#294fd6] prose-a:underline prose-a:hover:text-[#1e3ed0]
                prose-strong:font-semibold prose-strong:text-gray-900
                prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto
                prose-ul:pl-6 prose-ul:my-6 prose-ul:space-y-2
                prose-li:text-gray-700"
                dangerouslySetInnerHTML={{ __html: formattedContent }}
              />

              {/* Related Posts */}
              {blog.id && <RelatedPosts currentPostId={blog.id} allPosts={allPosts} />}
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-1">
              <div
                className={`transition-opacity duration-300 ${showTableOfContents ? "opacity-100" : "opacity-0 lg:opacity-100"}`}
              >
                {/* Table of Contents */}
                {blog.blog_post && <TableOfContents blogContent={blog.blog_post} />}

                {/* Author Box */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mt-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-[#e6f0ff] flex items-center justify-center text-[#294fd6] font-bold text-xl mr-3">
                      GS
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">GetMoreSEO Team</h3>
                      <p className="text-sm text-gray-600">SEO & Growth Specialists</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    Our team of SEO experts shares insights on search engine optimization, content strategies, and
                    online growth tactics.
                  </p>
                </div>

                {/* Newsletter Signup */}
                <div className="bg-[#eef5ff] rounded-xl p-5 border border-[#d1e0ff] mt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Subscribe to our newsletter</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Get the latest SEO tips and strategies delivered to your inbox.
                  </p>
                  <form className="space-y-3">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-[#294fd6] focus:border-[#294fd6] outline-none"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-[#294fd6] text-white py-2 px-4 rounded-lg hover:bg-[#1e3ed0] transition-colors font-medium"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        id="scroll-top-button"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-[#294fd6] text-white p-3 rounded-full shadow-lg hover:bg-[#1e3ed0] transition-all duration-300 hidden z-40"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      {/* Footer */}
      <Footer />
    </div>
  )
}
