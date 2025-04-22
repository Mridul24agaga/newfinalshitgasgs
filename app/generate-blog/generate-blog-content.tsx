"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { generateBlog } from "../actions"
import {
  Globe,
  Loader2,
  AlertCircle,
  Copy,
  Clock,
  FileText,
  ImageIcon,
  CheckCircle2,
  ArrowLeft,
  CreditCard,
} from "lucide-react"

// Define the props interface for the component
interface GenerateBlogPageProps {
  onGenerate?: (url: string, humanizeLevel: "normal" | "hardcore") => Promise<any>
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
  const [website, setWebsite] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [blog, setBlog] = useState<{
    headline: string
    content: string
    imageUrls?: string[]
  } | null>(null)
  const [error, setError] = useState("")
  const [timer, setTimer] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)

  // Get URL from query params or localStorage when component mounts
  useEffect(() => {
    const urlFromParams = searchParams.get("url")
    if (urlFromParams) {
      setWebsite(urlFromParams)
    } else {
      const savedUrl = localStorage.getItem("websiteUrl")
      if (savedUrl) {
        setWebsite(savedUrl)
      }
    }
  }, [searchParams])

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

  // Effect to preload images once blog is generated
  useEffect(() => {
    if (blog?.imageUrls && blog.imageUrls.length > 0) {
      setImagesLoaded(false)
      const preloadImages = async () => {
        try {
          const imagePromises = blog.imageUrls!.map((url) => {
            return new Promise((resolve, reject) => {
              const img = new globalThis.Image()
              img.crossOrigin = "anonymous"
              img.src = url
              img.onload = () => resolve(url)
              img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
            })
          })
          await Promise.all(imagePromises)
          setImagesLoaded(true)
        } catch (err) {
          console.warn("Some images failed to preload:", err)
          setImagesLoaded(true)
        }
      }
      preloadImages()
    }
  }, [blog?.imageUrls])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" + secs : secs}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!website) {
      setError("Please enter a website URL")
      return
    }
    let url = website
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url
      setWebsite(url)
    }
    try {
      setIsGenerating(true)
      setError("")
      const result = onGenerate
        ? await onGenerate(url, "normal")
        : ((await generateBlog(url)) as {
            headline: string
            content: string
            imageUrls?: string[]
          })
      setBlog(result)
    } catch (err: any) {
      console.error("Error:", err)
      if (err.message?.includes("No subscription found") || err.message?.includes("Subscription data required")) {
        setShowSubscriptionModal(true)
      } else {
        setError(`Failed to generate blog: ${err.message || "Please try again"}`)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const renderMarkdown = (markdown: string) => {
    if (!markdown) return ""
    const contentWithoutTitle = markdown.replace(/^#\s+.+$/m, "").trim()
    const cleanedContent = contentWithoutTitle
      .replace(/^---+$/gm, "")
      .replace(/^There you have it!.*$/gm, "")
      .replace(/^The content flows naturally.*$/gm, "")
      .replace(/^Let me know if.*$/gm, "")
      .replace(/^Let's dive in!.*$/gm, "")
      .replace(/^Here's the final.*$/gm, "")
      .replace(/^I've also included.*$/gm, "")
    let processedContent = cleanedContent
    const imageBlockRegex = /<!-- IMAGE_BLOCK_START -->([\s\S]*?)<!-- IMAGE_BLOCK_END -->/g
    processedContent = processedContent.replace(imageBlockRegex, (match, imageContent) => {
      const imgMatch = imageContent.match(/<img src="([^"]+)" alt="([^"]*)" class="blog-image" \/>/i)
      if (imgMatch) {
        const [_, src, alt] = imgMatch
        return `<div class="blog-image-container">
          <div class="relative w-full" style="height: 400px;">
            <Image 
              src="${src}" 
              alt="${alt || "Blog image"}" 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4="
            />
          </div>
        </div>`
      }
      return match
    })
    processedContent = processedContent
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-6 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-8 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-10 mb-4">$1</h1>')
      .replace(/^\s*\*\s(.*)/gm, '<li class="ml-6 list-disc my-1">$1</li>')
      .replace(/^\s*\d\.\s(.*)/gm, '<li class="ml-6 list-decimal my-1">$1</li>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>',
      )
    return processedContent
      .split("\n\n")
      .map((para) => {
        if (
          para.startsWith("<h1") ||
          para.startsWith("<h2") ||
          para.startsWith("<h3") ||
          para.startsWith("<li") ||
          para.startsWith("<div class=") ||
          para.startsWith("<!-- IMAGE_BLOCK")
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

  const calculateReadingTime = (content: string) => {
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

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:px-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">AI Blog Generator</h1>
            <p className="text-blue-100 max-w-2xl">
              Enter any website URL and our AI will generate a high-quality blog post based on the content.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            {!blog && !isLoading && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Website URL
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://example.com"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      required
                    />
                  </div>
                  {error && (
                    <div className="flex items-center mt-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-800 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    How it works
                  </h3>
                  <ul className="mt-2 text-sm text-blue-700 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">1.</span>
                      <span>Enter the URL of any website you want to create content about</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">2.</span>
                      <span>Our AI will analyze the website and generate a unique blog post</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">3.</span>
                      <span>Review, edit, and use the content for your marketing needs</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Generate Blog Post
                </button>
              </form>
            )}

            {isLoading && (
              <div className="py-10">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-opacity-50"></div>
                    <div
                      className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"
                      style={{ animationDuration: "1.5s" }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="h-10 w-10 text-blue-600" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Your Blog</h2>
                  <p className="text-gray-500 mb-6 text-center max-w-md">
                    Our AI is analyzing the website and crafting a high-quality article for you.
                  </p>

                  <div className="w-full max-w-md bg-gray-100 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
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
                        className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${timer > 30 ? "bg-green-100[text-green-600" : "bg-gray-100 text-gray-400"}`}
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

            {blog && !isLoading && (
              <div>
                {/* Blog Header */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{blog.headline}</h1>

                  <div className="flex flex-wrap items-center text-sm text-gray-500 gap-3 sm:gap-4">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1.5" />
                      <span>{blog.content.split(/\s+/).length} words</span>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1.5" />
                      <span>{calculateReadingTime(blog.content)} min read</span>
                    </div>

                    {blog.imageUrls && blog.imageUrls.length > 0 && (
                      <div className="flex items-center">
                        <ImageIcon className="h-4 w-4 mr-1.5" />
                        <span>
                          {imagesLoaded ? (
                            `${blog.imageUrls.length} image${blog.imageUrls.length > 1 ? "s" : ""}`
                          ) : (
                            <span className="flex items-center">
                              <Loader2 className="animate-spin h-3 w-3 mr-1.5" />
                              Loading images...
                            </span>
                          )}
                        </span>
                      </div>
                    )}
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
                    color: #1e40af;
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
                    color: #2563eb;
                    text-decoration: underline;
                    text-decoration-color: #93c5fd;
                    text-underline-offset: 2px;
                  }
                  
                  .blog-content a:hover {
                    text-decoration-color: #2563eb;
                  }
                  
                  .blurred-content {
                    filter: blur(4px);
                    pointer-events: none;
                    user-select: none;
                    opacity: 0.6;
                  }
                  
                  .subscribe-overlay {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 10;
                  }
                `}</style>

                <div className="relative">
                  <div
                    className={`blog-content prose max-w-none text-gray-700 ${!hasActiveSubscription ? "blurred-content" : ""}`}
                    dangerouslySetInnerHTML={{ __html: blog.content ? renderMarkdown(blog.content) : "" }}
                  />
                  {!hasActiveSubscription && (
                    <div className="subscribe-overlay">
                      <button
                        onClick={() => router.push("/payment")}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Subscribe to View Full Blog
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {hasActiveSubscription && (
                  <div className="mt-10 pt-6 border-t border-gray-200 flex justify-center">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 mr-2" />
                          <span>Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-5 w-5 mr-2" />
                          <span>Copy Blog Content</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Required Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Subscription Required</h3>
              <p className="text-gray-600 mt-2">
                You need an active subscription to generate blog content. Please subscribe to continue.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Benefits of subscribing:</h4>
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

              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => router.push("/pricing")}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Subscription Plans
                </button>
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}