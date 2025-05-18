"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { generateBlog } from "../actions"
import { Loader2, AlertCircle, Clock, FileText, ImageIcon, CheckCircle2, CreditCard } from "lucide-react"
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

export default function GenerateBlogPage({
  onGenerate,
  loading: externalLoading,
  subscriptionError: externalSubscriptionError,
  hasActiveSubscription = true,
}: GenerateBlogPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isGenerating, setIsGenerating] = useState(false)
  const [blog, setBlog] = useState<{
    headline: string
    content: string
    isBlurred: boolean
  } | null>(null)
  const [error, setError] = useState("")
  const [timer, setTimer] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)

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

  const handleGenerateBlog = async (url: string, humanizeLevel: "normal" | "hardcore") => {
    try {
      setIsGenerating(true)
      setError("")
      setBlog(null)

      console.log(`Generating blog for ${url} with humanize level: ${humanizeLevel}`)

      const result = onGenerate
        ? await onGenerate(url, humanizeLevel)
        : await generateBlog(url)

      if (result.blogPosts && result.blogPosts.length > 0) {
        const firstPost = result.blogPosts[0]
        setBlog({
          headline: firstPost.title,
          content: firstPost.content,
          isBlurred: firstPost.is_blurred,
        })
      } else {
        throw new Error(result.message || "No blog posts generated")
      }

      return result
    } catch (err: any) {
      console.error("Error generating blog:", err)
      setBlog(null)
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

  // Function to convert markdown to HTML
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

    // Process markdown elements
    let processedContent = cleanedContent

    // Process image blocks
    const imageBlockRegex = /<img src="([^"]+)" alt="([^"]*)" class="blog-image" \/>/gi
    processedContent = processedContent.replace(imageBlockRegex, (match, src, alt) => {
      return `<div class="blog-image-container">
        <div class="relative w-full" style="height: 400px;">
          <Image 
            src="${src}" 
            alt="${alt || "Blog image"}" 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            loading="lazy"
          />
        </div>
      </div>`
    })

    // Process headings (using ** for bold headings as per backend)
    processedContent = processedContent
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Convert bold headings to proper HTML headings
      .replace(/<strong>(FAQ Section|Q\d+: .*?)<\/strong>/g, (match, text) => {
        if (text === "FAQ Section") return '<h2 class="text-2xl font-bold mt-8 mb-3">$1</h2>'
        return '<h3 class="text-xl font-bold mt-6 mb-2">$1</h3>'
      })

    // Process lists
    processedContent = processedContent
      .replace(/^\s*-\s(.*)$/gm, '<li class="ml-6 list-disc my-1">$1</li>')
      .replace(/^\s*\d\.\s(.*)$/gm, '<li class="ml-6 list-decimal my-1">$1</li>')

    // Process paragraphs and preserve HTML links
    return processedContent
      .split("\n\n")
      .map((para) => {
        if (
          para.startsWith("<h2") ||
          para.startsWith("<h3") ||
          para.startsWith("<li") ||
          para.startsWith("<div class=") ||
          para.includes('<a href="')
        ) {
          return para
        }

        if (para.includes('<li class="ml-6 list-disc')) {
          return `<ul class="my-4">${para}</ul>`
        }
        if (para.includes('<li class="ml-6 list-decimal')) {
          return `<ol class="my-4">${para}</ol>`
        }

        return `<p class="my-4">${para}</p>`
      })
      .join("")
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
        <div className="max-w-4xl mx-auto">
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
                <div>
                  {/* Blog Header */}
                  <div className="border-b border-gray-200 pb-6 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{blog.headline}</h1>

                    <div className="flex flex-wrap items-center text-sm text-gray-500 gap-3 sm:gap-4">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1.5" />
                        <span>{blog.content ? blog.content.split(/\s+/).length : 0} words</span>
                      </div>

                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1.5" />
                        <span>{calculateReadingTime(blog.content)} min read</span>
                      </div>
                    </div>
                  </div>

                  {/* Blog Content */}
                  <style jsx global>{`
                    .blog-image-container {
                      margin: 2rem 0;
                      padding: 1.5rem 0;
                      position: relative;
                      clear: both;
                      display: block;
                      width: 100%;
                      overflow: hidden;
                      border-top: 1px solid #f0f0f0;
                      border-bottom: 1px solid #f0f0f0;
                      background-color: #f9fafb;
                      border-radius: 0.5rem;
                    }
                    
                    .blog-content h2 {
                      color: #294df6;
                      margin-top: 2rem;
                      margin-bottom: 1rem;
                      font-weight: 700;
                    }
                    
                    .blog-content h3 {
                      color: #374151;
                      margin-top: 1.5rem;
                      margin-bottom: 0.75rem;
                      font-weight: 600;
                    }
                    
                    .blog-content p {
                      margin-bottom: 1rem;
                      line-height: 1.7;
                    }
                    
                    .blog-content ul, .blog-content ol {
                      margin-bottom: 1.5rem;
                      padding-left: 1rem;
                    }
                    
                    .blog-content li {
                      margin-bottom: 0.5rem;
                    }
                    
                    .blog-content a {
                      color: #294df6;
                      text-decoration: underline;
                      text-decoration-color: #93c5fd;
                      text-underline-offset: 2px;
                    }
                    
                    .blog-content a:hover {
                      text-decoration-color: #294df6;
                    }

                    .blur-sm {
                      filter: blur(4px);
                      user-select: none;
                    }
                    
                    @keyframes gradient {
                      0% { background-position: 0% 50%; }
                      50% { background-position: 100% 50%; }
                      100% { background-position: 0% 50%; }
                    }
                    
                    .gradient-text {
                      background: linear-gradient(90deg, #294df6, #7733ee);
                      -webkit-background-clip: text;
                      -webkit-text-fill-color: transparent;
                      background-size: 200% auto;
                      animation: gradient 3s ease infinite;
                    }
                    
                    @keyframes pulse {
                      0%, 100% { transform: scale(1); }
                      50% { transform: scale(1.05); }
                    }
                    
                    .pulse-slow {
                      animation: pulse 3s ease-in-out infinite;
                    }
                  `}</style>

                  <div className="relative">
                    <div
                      className={`blog-content prose max-w-none text-gray-700 ${blog.isBlurred ? "blur-sm" : ""}`}
                      dangerouslySetInnerHTML={{ __html: blog.content ? renderMarkdown(blog.content) : "" }}
                    />

                    {blog.isBlurred && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-50">
                        <div className="text-center p-8 bg-white rounded-xl border border-gray-200 max-w-md">
                          <h3 className="text-2xl font-bold gradient-text mb-4">Subscribe to View Full Content</h3>
                          <p className="text-gray-600 mb-6">
                            Get unlimited access to all our AI-generated blog posts and more.
                          </p>
                          <button
                            onClick={() => router.push("/payment")}
                            className="px-6 py-3 bg-[#294df6] text-white rounded-lg hover:bg-[#1e3ed0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#294df6] transition-colors"
                          >
                            Subscribe Now
                          </button>
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
                  onClick={() => router.push("/pricing")}
                  className="w-full py-3 bg-[#294df6] text-white rounded-lg hover:bg-[#1e3ed0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#294df6] transition-colors"
                >
                  View Subscription Plans
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}