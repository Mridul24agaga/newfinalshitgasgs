"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { generateBlog } from "../actions"
import { AlertCircle, Clock, FileText, CheckCircle2, CreditCard, ThumbsUp } from "lucide-react"
import Image from "next/image"

// Define the BlogPost type to match backend
interface BlogPost {
  title: string
  content: string
  is_blurred: boolean
  created_at?: string
  url?: string
}

// Define the GenerateBlogResult type to match backend
interface GenerateBlogResult {
  blogPosts: BlogPost[]
  message: string
}

// Define the props interface for the component
interface GenerateBlogPageProps {
  onGenerate?: (url: string, humanizeLevel: "normal" | "hardcore") => Promise<GenerateBlogResult>
  loading?: boolean
  subscriptionError?: boolean
  hasActiveSubscription?: boolean
}

// Add these constants after the existing interfaces
const STORAGE_KEY = "savedBlogPost"

// Add this after the imports
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
    <nav className="toc">
      <ul className="space-y-2 text-sm">
        {headings.map((heading, index) => (
          <li
            key={index}
            className={`${heading.level === 1 ? "font-bold" : heading.level === 2 ? "pl-2" : heading.level === 3 ? "pl-4" : "pl-6"}`}
          >
            <a
              href={`#${heading.id}`}
              className="text-gray-700 hover:text-[#294fd6] transition-colors duration-200 block py-1"
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
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function GenerateBlogPage({
  onGenerate,
  loading: externalLoading,
  subscriptionError: externalSubscriptionError,
  hasActiveSubscription = true,
}: GenerateBlogPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isGenerating, setIsGenerating] = useState(false)
  // Replace the existing useState for blog with this implementation
  const [blog, setBlog] = useState<{
    headline: string
    content: string
    isBlurred: boolean
  } | null>(() => {
    // Try to load saved blog from localStorage on initial render
    if (typeof window !== "undefined") {
      const savedBlog = localStorage.getItem(STORAGE_KEY)
      if (savedBlog) {
        try {
          return JSON.parse(savedBlog)
        } catch (e) {
          console.error("Failed to parse saved blog:", e)
          return null
        }
      }
    }
    return null
  })
  const [error, setError] = useState("")
  const [timer, setTimer] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [showScrollPopup, setShowScrollPopup] = useState(false)
  const [showEndCta, setShowEndCta] = useState(false)
  const endCtaRef = useRef<HTMLDivElement>(null)

  // Add a ref to track if generation has been attempted
  const generationAttemptedRef = useRef(false)

  // Auto-start blog generation when redirected from website-analysis page
  useEffect(() => {
    const autoStartGeneration = async () => {
      const urlFromParams = searchParams.get("url")
      const autostart = searchParams.get("autostart") === "true"

      if (urlFromParams && autostart && !isGenerating && !generationAttemptedRef.current) {
        try {
          generationAttemptedRef.current = true
          console.log(`Auto-starting blog generation for ${urlFromParams}`)
          await handleGenerateBlog(urlFromParams, "normal")
        } catch (err) {
          console.error("Error auto-starting blog generation:", err)
          setError("Failed to automatically start blog generation. Please try again.")
        }
      }
    }

    autoStartGeneration()
  }, [searchParams, isGenerating])

  // Clear autostart parameter from URL after generation
  useEffect(() => {
    if ((blog || error) && window.history.replaceState) {
      const url = new URL(window.location.href)
      url.searchParams.delete("autostart")
      window.history.replaceState({}, "", url.toString())
    }
  }, [blog, error])

  // Timer for generation progress
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isGenerating) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    } else {
      setTimer(0)
    }
    return () => clearInterval(interval)
  }, [isGenerating])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" + secs : secs}`
  }

  // Function to check if an error is related to subscription or credits
  const isSubscriptionError = (errorMsg: string) => {
    const subscriptionErrorPatterns = [
      "No subscription found",
      "Subscription data required",
      "credits",
      "Insufficient credits",
      "Upgrade your plan",
      "subscription",
      "You have already used your free blog post",
    ]
    return subscriptionErrorPatterns.some((pattern) => errorMsg.toLowerCase().includes(pattern.toLowerCase()))
  }

  // Add this function after the existing functions but before the useEffects
  const saveBlogToStorage = useCallback(
    (blogData: { headline: string; content: string; isBlurred: boolean } | null) => {
      if (blogData) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(blogData))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    },
    [],
  )

  // Modify the handleGenerateBlog function to clear localStorage when starting a new generation
  const handleGenerateBlog = async (url: string, humanizeLevel: "normal" | "hardcore") => {
    try {
      setIsGenerating(true)
      setError("")
      setBlog(null)
      // Clear any previously saved blog when starting a new generation
      saveBlogToStorage(null)

      console.log(`Generating blog for ${url} with humanize level: ${humanizeLevel}`)

      const result = onGenerate ? await onGenerate(url, humanizeLevel) : await generateBlog(url)

      if (result.blogPosts && result.blogPosts.length > 0) {
        const firstPost = result.blogPosts[0]
        const newBlog = {
          headline: firstPost.title,
          content: firstPost.content,
          isBlurred: false, // Always set to false to remove blur functionality
        }
        setBlog(newBlog)
        // Save the new blog to localStorage
        saveBlogToStorage(newBlog)
      } else {
        throw new Error(result.message || "No blog posts generated")
      }

      return result
    } catch (err: any) {
      console.error("Error generating blog:", err)
      setBlog(null)
      // Clear saved blog on error
      saveBlogToStorage(null)
      const errorMessage = err?.message || "An unknown error occurred"

      if (isSubscriptionError(errorMessage)) {
        setShowSubscriptionModal(true)
        setError(errorMessage)
      } else {
        setError(`Failed to generate blog: ${errorMessage}`)
      }

      return { blogPosts: [], message: "Failed to generate blog" }
    } finally {
      setIsGenerating(false)
    }
  }

  const renderMarkdown = (markdown: string) => {
    if (!markdown) return ""

    // Remove meta-commentary and separators
    const cleanedContent = markdown
      .replace(/^---+$/gm, "")
      .replace(/^There you have it!.*$/gm, "")
      .replace(/^The content flows naturally.*$/gm, "")
      .replace(/^Let me know if.*$/gm, "")
      .replace(/^Let's dive in!.*$/gm, "")
      .replace(/^Here's the final.*$/gm, "")
      .replace(/^I've also included.*$/gm, "")

    // Step 1: Handle markdown headings (#, ##, ###, etc.) - ENHANCED for bigger, bolder headings
    let content = cleanedContent.replace(/^(#+)\s*(.*?)\s*$/gm, (match, hashes, text) => {
      const level = hashes.length // Number of # determines heading level
      const id = text
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")

      // Enhanced heading styles with larger font sizes and more prominent styling
      const sizeClasses = {
        1: "text-4xl", // h1 - extra large
        2: "text-3xl", // h2 - larger
        3: "text-2xl", // h3 - large
        4: "text-xl", // h4 - medium-large
        5: "text-lg", // h5 - medium
        6: "text-base", // h6 - normal
      }

      const size = sizeClasses[level as keyof typeof sizeClasses] || "text-2xl"

      return `<h${level} id="${id}" class="${size} font-extrabold my-8 text-gray-900 scroll-mt-16">${text.trim()}</h${level}>`
    })

    // Step 2: Format bold text (**text**) that should be headings - ENHANCED
    content = content.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
      // Check if this bold text should be a heading
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
        // Make these bold text headings more prominent
        return `<h2 id="${id}" class="text-3xl font-extrabold my-8 text-gray-900 scroll-mt-16">${p1}</h2>`
      }
      return `<strong>${p1}</strong>`
    })

    // Step 3: Format special list items with bold titles and descriptions
    content = content.replace(/- \*\*(.*?)\*\*: ([\s\S]*?)(?=(?:- \*\*|$))/g, (match, title, description) => {
      return `<div class="my-4">
      <p class="font-semibold text-gray-900">${title}:</p>
      <p class="mt-1">${description.trim()}</p>
    </div>`
    })

    // Step 4: Process regular bullet points - COMPLETELY REVISED
    // First, identify groups of bullet points and wrap them in <ul> tags
    let inList = false
    const lines = content.split("\n")
    let processedContent = ""

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // Check if this line is a bullet point
      if (line.startsWith("- ")) {
        // If we're not already in a list, start a new one
        if (!inList) {
          processedContent += '<ul class="list-disc pl-6 my-4 space-y-2">\n'
          inList = true
        }

        // Extract the content after the bullet point marker
        const bulletContent = line.substring(2)

        // Add as a list item
        processedContent += `<li class="ml-2">${bulletContent}</li>\n`
      } else {
        // If this is not a bullet point and we were in a list, close the list
        if (inList) {
          processedContent += "</ul>\n"
          inList = false
        }

        // Add the line as is
        processedContent += line + "\n"
      }
    }

    // Close any open list at the end
    if (inList) {
      processedContent += "</ul>\n"
    }

    content = processedContent

    // Step 5: Format paragraphs
    const paragraphLines = content.split("\n")
    let formattedContent = ""
    for (let i = 0; i < paragraphLines.length; i++) {
      const line = paragraphLines[i].trim()
      if (
        line &&
        !line.startsWith("<h") &&
        !line.startsWith("<ul") &&
        !line.startsWith("<li") &&
        !line.startsWith("<div") &&
        !line.startsWith("<p") &&
        !line.startsWith("</")
      ) {
        formattedContent += `<p class="my-4">${line}</p>\n`
      } else {
        formattedContent += line + "\n"
      }
    }

    // Step 6: Format Q&A in FAQ section - ENHANCED
    formattedContent = formattedContent.replace(
      /\*\*Q\d+: (.*?)\*\*/g,
      '<h3 class="text-2xl font-bold mt-8 mb-4 text-gray-900">$1</h3>',
    )

    return formattedContent
  }

  // Calculate estimated reading time
  const calculateReadingTime = (content: string) => {
    if (!content) return 0
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return readingTime
  }

  const copyToClipboard = () => {
    if (blog?.content) {
      navigator.clipboard.writeText(blog.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isLoading = externalLoading !== undefined ? externalLoading : isGenerating

  // Global error handler
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error)
      if (event.error && event.error.message && isSubscriptionError(event.error.message)) {
        setShowSubscriptionModal(true)
      }
    }

    window.addEventListener("error", handleGlobalError)
    return () => window.removeEventListener("error", handleGlobalError)
  }, [])

  // Console error override for subscription errors
  useEffect(() => {
    const originalConsoleError = console.error
    console.error = (...args) => {
      originalConsoleError.apply(console, args)
      const errorString = args.join(" ")
      if (isSubscriptionError(errorString)) {
        setShowSubscriptionModal(true)
      }
    }
    return () => {
      console.error = originalConsoleError
    }
  }, [])

  // Add this useEffect after the other useEffects
  useEffect(() => {
    // Save blog to localStorage whenever it changes
    if (blog) {
      saveBlogToStorage(blog)
    }
  }, [blog, saveBlogToStorage])

  // Add scroll event listener to show popup
  useEffect(() => {
    if (!blog || !hasActiveSubscription) return

    const handleScroll = () => {
      // Show popup when user has scrolled down 40% of the viewport height
      const scrollThreshold = window.innerHeight * 0.4
      if (window.scrollY > scrollThreshold && !showScrollPopup && !showEndCta) {
        setShowScrollPopup(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [blog, showScrollPopup, hasActiveSubscription, showEndCta])

  // Scroll to end CTA when it becomes visible
  useEffect(() => {
    if (showEndCta && endCtaRef.current) {
      // Remove the scrolling behavior
      // We don't want to scroll down when showing the CTA
    }
  }, [showEndCta])

  // Handle continue reading click
  const handleContinueReading = () => {
    setShowScrollPopup(false)
    setShowEndCta(true)
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 p-4 sm:p-6 z-20 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <Image src="/logoblack.png" alt="Company Logo" width={120} height={40} className="h-10 w-auto" />
        </div>
      </header>

      {/* Main content */}
      <div className="pt-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white overflow-hidden">
            <div className="p-6 sm:p-10">
              {isLoading && (
                <div className="py-10">
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-24 h-24 mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-opacity-50"></div>
                      <div
                        className="absolute inset-0 rounded-full border-4 border-t-[#294df6] animate-spin"
                        style={{ animationDuration: "1.5s" }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="h-10 w-10 text-[#294df6]" />
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Your Blog</h2>
                    <p className="text-gray-500 mb-6 text-center max-w-md">
                      Our AI is analyzing the website and crafting a high-quality article for you.
                    </p>

                    <div className="w-full max-w-md bg-gray-100 rounded-full h-2.5 mb-2">
                      <div
                        className="bg-[#294df6] h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((timer / 120) * 100, 95)}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between w-full max-w-md text-xs text-gray-500 mt-1 mb-6">
                      <span>Started {formatTime(timer)} ago</span>
                      <span>~{Math.max(2 - Math.floor(timer / 60), 0)} min remaining</span>
                    </div>

                    <div className="space-y-4 w-full max-w-md">
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${timer > 5 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                        >
                          {timer > 5 ? <CheckCircle2 className="h-5 w-5" /> : "1"}
                        </div>
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${timer > 5 ? "text-green-600" : "text-gray-500"}`}>
                            Analyzing website content
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${timer > 30 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                        >
                          {timer > 30 ? <CheckCircle2 className="h-5 w-5" /> : "2"}
                        </div>
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${timer > 30 ? "text-green-600" : "text-gray-500"}`}>
                            Drafting blog structure
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${timer > 60 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                        >
                          {timer > 60 ? <CheckCircle2 className="h-5 w-5" /> : "3"}
                        </div>
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${timer > 60 ? "text-green-600" : "text-gray-500"}`}>
                            Writing comprehensive content
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${timer > 90 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                        >
                          {timer > 90 ? <CheckCircle2 className="h-5 w-5" /> : "4"}
                        </div>
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${timer > 90 ? "text-green-600" : "text-gray-500"}`}>
                            Finalizing and formatting
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && !isLoading && (
                <div className="py-10">
                  <div className="flex flex-col items-center justify-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Generating Blog</h2>
                    <p className="text-red-500 mb-6 text-center max-w-md">{error}</p>

                    {isSubscriptionError(error) ? (
                      <button
                        onClick={() => setShowSubscriptionModal(true)}
                        className="px-6 py-3 bg-[#294df6] text-white rounded-lg hover:bg-[#1e3ed0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#294df6] transition-colors mb-3"
                      >
                        View Subscription Plans
                      </button>
                    ) : (
                      <button
                        onClick={() => router.push("/website-analysis")}
                        className="px-6 py-3 bg-[#294df6] text-white rounded-lg hover:bg-[#1e3ed0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#294df6] transition-colors"
                      >
                        Return to Website Analysis
                      </button>
                    )}
                  </div>
                </div>
              )}

              {blog && !isLoading && (
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Table of Contents Sidebar */}
                  <div className="md:w-1/4 md:sticky md:top-8 md:self-start">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Table of Contents</h3>
                      <TableOfContents blogContent={blog.content} />
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="md:w-3/4 p-6 sm:p-10">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800 font-saira">{blog.headline}</h1>

                    <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>{blog.content ? blog.content.split(/\s+/).length : 0} words</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{calculateReadingTime(blog.content)} min read</span>
                      </div>
                    </div>

                    <hr className="my-6 border-gray-200" />

                    <div
                      className="prose prose-gray max-w-none mb-8
        prose-headings:font-saira prose-headings:text-gray-900 prose-headings:text-3xl prose-headings:font-extrabold prose-headings:my-8
        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:font-saira
        prose-a:text-orange-600 prose-a:underline prose-a:hover:text-orange-700 prose-a:transition-colors prose-a:duration-200
        prose-strong:font-bold prose-strong:text-gray-800
        prose-img:w-full prose-img:rounded-lg prose-img:max-w-full
        prose-figure:my-6 prose-figure:mx-auto prose-figure:max-w-full
        prose-figcaption:text-sm prose-figcaption:text-center prose-figcaption:text-gray-500 prose-figcaption:mt-2 prose-figcaption:font-saira
        prose-iframe:w-full prose-iframe:rounded-lg
        prose-ul:pl-6 prose-ul:my-6 prose-ul:space-y-1
        prose-li:flex prose-li:items-start prose-li:mb-4 prose-li:text-gray-700 prose-li:leading-relaxed prose-li:font-saira
        prose-table:table prose-table:w-full prose-table:border-collapse prose-table:bg-white prose-table:text-gray-800
        prose-th:border prose-th:border-gray-200 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:bg-gray-100
        prose-td:border prose-td:border-gray-200 prose-td:px-4 prose-td:py-2"
                      dangerouslySetInnerHTML={{ __html: blog.content ? renderMarkdown(blog.content) : "" }}
                    />

                    {/* End of Blog CTA */}
                    {showEndCta && (
                      <div
                        ref={endCtaRef}
                        className="mt-12 mb-6 bg-gradient-to-r from-blue-600/5 to-indigo-600/10 rounded-xl p-6 border border-blue-200 shadow-md animate-fade-in"
                      >
                        <div className="flex flex-col sm:flex-row items-center gap-5">
                          <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                            <ThumbsUp className="h-6 w-6 text-[#294fd6]" />
                          </div>
                          <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-xl font-bold text-gray-800">Don't miss out on unlimited content!</h3>
                            <p className="text-gray-600 mt-1">
                              <span className="font-semibold">Only 3 spots left today</span> at our current pricing.
                              Join 1,200+ marketers already saving hours on content creation.
                            </p>
                          </div>
                          <div className="flex-shrink-0 mt-4 sm:mt-0">
                            <button
                              onClick={() => router.push("/payment")}
                              className="px-5 py-3 bg-[#294df6] text-white rounded-lg hover:bg-[#1e3ed0] transition-colors font-medium whitespace-nowrap shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                              Unlock Premium Now
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 text-center sm:text-left text-sm text-gray-500">
                          <p>🔒 Secure checkout • 30-day money-back guarantee • Cancel anytime</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!blog && !isLoading && !error && (
                <div className="py-10">
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-24 h-24 mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="h-10 w-10 text-[#294df6]" />
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Blog Generation Ready</h2>
                    <p className="text-gray-600 mb-6 text-center max-w-md">
                      Your blog generation is being prepared based on the website analysis.
                    </p>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 max-w-md mx-auto">
                      <h3 className="text-sm font-medium text-[#294df6] flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        How it works
                      </h3>
                      <ul className="mt-2 text-sm text-[#294df6] space-y-1">
                        <li className="flex items-start">
                          <span className="mr-2">1.</span>
                          <span>Our AI analyzes the website content</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">2.</span>
                          <span>It generates a unique blog post based on the analysis</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">3.</span>
                          <span>Review, edit, and use the content for your marketing needs</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 max-w-md w-full p-6 relative">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-[#294df6]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Subscription Required</h3>
              <p className="text-gray-600 mt-2">
                {error.includes("free blog post")
                  ? "You've used your free blog post. Subscribe to generate more!"
                  : "You need an active subscription with sufficient credits to generate blog content."}
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-[#294df6] mb-2">Benefits of subscribing:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Generate unlimited high-quality blog posts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Access to advanced customization options</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Priority support and content optimization</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col">
                <button
                  onClick={() => router.push("/payment")}
                  className="w-full py-3 bg-[#294df6] text-white rounded-lg hover:bg-[#1e3ed0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#294df6] transition-colors"
                >
                  Unlock Premium Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Scroll Popup */}
      {blog && showScrollPopup && !showSubscriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-[#294df6] to-[#4e6af3] p-1"></div>
            <div className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Enjoying this content?</h3>
                <p className="text-gray-600 mt-2">
                  This is just a sample of what our AI can generate for you. Unlock unlimited high-quality blog posts
                  with our premium plans!
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-5">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#294df6] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Generate unlimited blog posts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#294df6] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Advanced customization options</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#294df6] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Priority support and content optimization</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push("/payment")}
                  className="w-full py-3 bg-[#294df6] text-white rounded-lg hover:bg-[#1e3ed0] transition-colors font-medium"
                >
                  Unlock Premium Now
                </button>
                <button
                  onClick={handleContinueReading}
                  className="w-full py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continue Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
