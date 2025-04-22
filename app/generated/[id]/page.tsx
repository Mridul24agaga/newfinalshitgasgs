"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { CreditCard, Lock, ArrowUp, Calendar, Clock, CheckCircle, Copy, FileText, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/utitls/supabase/client"
import PaymentPage from "@/app/components/payment-page"

const DODO_URL = "https://test.checkout.dodopayments.com/buy"
const ACTIVE_PLANS = ["growth", "basic", "pro"]

type BlogPost = {
  id: string
  user_id: string
  blog_post: string
  created_at: string
  title: string
  timestamp: string
  reveal_date: string
  url: string
  is_blurred: boolean
}

type BlogContent = {
  visibleContent: string
  blurredContent: string
  hasBlurredContent: boolean
}

type UserSignedUp = {
  id: string
  email: string
  created_at: string
  updated_at: string
}

type Subscription = {
  id: string
  user_id: string
  plan_id: string
  credits: number
  status: string
  billing_cycle: string
  subscription_type: string
  current_period_end?: string
  last_updated?: string
}

type Plan = {
  id: string
  name: string
  dodoProductId: string
  numericPrice: number
}

// Function to properly format blog content with HTML tags
const formatBlogContent = (content: string) => {
  if (!content) return ""

  // Replace simple "Blog image X" references
  content = content.replace(/Blog image (\d+)/g, (match, index) => {
    return `<div class="blog-image-container">
      <div class="relative w-full" style="height: 400px;">
        <img 
          src="/seo-backlink-strategy-${index}.jpg"
          alt="Blog image ${index}"
          class="rounded-lg object-cover w-full h-full"
          loading="lazy"
        />
      </div>
    </div>`
  })

  // Format headings
  content = content.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
    if (p1.includes("How to Boost Your Backlink Strategy in Just 30 Days")) {
      return `<h1 class="text-3xl font-bold my-6">${p1}</h1>`
    }
    if (
      p1.startsWith("1.") ||
      p1.startsWith("2.") ||
      p1.startsWith("3.") ||
      p1.startsWith("4.") ||
      p1.startsWith("5.") ||
      p1.startsWith("6.") ||
      p1.startsWith("Conclusion") ||
      p1.startsWith("FAQ")
    ) {
      return `<h2 class="text-2xl font-bold my-5">${p1}</h2>`
    }
    return `<strong>${p1}</strong>`
  })

  // Format lists - Modified to avoid using /s flag
  content = content.replace(/- \*\*(.*?)\*\*: ([\s\S]*?)(?=(?:- \*\*|$))/g, (match, title, description) => {
    return `<div class="my-3">
      <strong class="block mb-1">${title}:</strong>
      <p>${description.trim()}</p>
    </div>`
  })

  // Format bullet points
  content = content.replace(/- (.*?)(?=(?:\n|$))/g, '<li class="ml-6 list-disc my-2">$1</li>')

  // Wrap lists in ul tags
  content = content.replace(
    /<li class="ml-6 list-disc my-2">(.*?)<\/li>\n<li class="ml-6 list-disc my-2">/g,
    '<ul class="my-4 list-disc">\n<li class="ml-6 list-disc my-2">$1</li>\n<li class="ml-6 list-disc my-2">',
  )
  content = content.replace(
    /<li class="ml-6 list-disc my-2">(.*?)<\/li>\n(?!<li)/g,
    '<li class="ml-6 list-disc my-2">$1</li>\n</ul>\n',
  )

  // Format paragraphs (any text that's not already wrapped in HTML tags)
  const lines = content.split("\n")
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
      formattedContent += `<p class="my-4">${line}</p>\n`
    } else {
      formattedContent += line + "\n"
    }
  }

  // Format Q&A in FAQ section
  formattedContent = formattedContent.replace(
    /\*\*Q\d+: (.*?)\*\*/g,
    '<h3 class="text-xl font-semibold mt-6 mb-2">$1</h3>',
  )

  return formattedContent
}

// Function to render markdown to HTML (from generate-blog-page)
const renderMarkdown = (markdown: string) => {
  if (!markdown) return ""

  // Remove the first heading (title) as we display it separately
  const contentWithoutTitle = markdown.replace(/^#\s+.+$/m, "").trim()

  // Remove any "---" separator lines and meta-commentary
  const cleanedContent = contentWithoutTitle
    .replace(/^---+$/gm, "") // Remove separator lines
    .replace(/^There you have it!.*$/gm, "") // Remove common meta-commentary
    .replace(/^The content flows naturally.*$/gm, "")
    .replace(/^Let me know if.*$/gm, "")
    .replace(/^Let's dive in!.*$/gm, "")
    .replace(/^Here's the final.*$/gm, "")
    .replace(/^I've also included.*$/gm, "")

  // Process other markdown elements
  let processedContent = cleanedContent

  // Fix 1: Process image blocks with IMAGE_BLOCK tags
  const imageBlockRegex = /<!-- IMAGE_BLOCK_START -->([\s\S]*?)<!-- IMAGE_BLOCK_END -->/g
  processedContent = processedContent.replace(imageBlockRegex, (match, imageContent) => {
    // Extract the image URL and alt text
    const imgMatch = imageContent.match(/<img src="([^"]+)" alt="([^"]*)" class="blog-image" \/>/i)
    if (imgMatch) {
      const [_, src, alt] = imgMatch
      return `<div class="blog-image-container">
        <div class="relative w-full" style="height: 400px;">
          <img 
            src="${src}" 
            alt="${alt || "Blog image"}" 
            class="rounded-lg object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      </div>`
    }
    return match // Return original if no match
  })

  // Fix 2: Process standalone image tags with full URL pattern
  processedContent = processedContent.replace(
    /(https?:\/\/[^\s"]+)" alt="([^"]*)" class="blog-image" \/>/gi,
    (match, src, alt) => {
      return `<div class="blog-image-container">
        <div class="relative w-full" style="height: 400px;">
          <img 
            src="${src}" 
            alt="${alt || "Blog image"}" 
            class="rounded-lg object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      </div>`
    },
  )

  // Fix 3: Process any remaining image tags
  processedContent = processedContent.replace(
    /<img src="([^"]+)" alt="([^"]*)" class="blog-image" \/>/gi,
    (match, src, alt) => {
      return `<div class="blog-image-container">
        <div class="relative w-full" style="height: 400px;">
          <img 
            src="${src}" 
            alt="${alt || "Blog image"}" 
            class="rounded-lg object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      </div>`
    },
  )

  // Fix 4: Process any raw image URLs that might be in the text
  processedContent = processedContent.replace(/(https?:\/\/[^\s"]+\.(jpg|jpeg|png|gif|webp))/gi, (match, url) => {
    return `<div class="blog-image-container">
        <div class="relative w-full" style="height: 400px;">
          <img 
            src="${url}" 
            alt="Blog image" 
            class="rounded-lg object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      </div>`
  })

  // Process other markdown elements
  processedContent = processedContent
    // Process headings
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-6 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-8 mb-3">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-10 mb-4">$1</h1>')

    // Process lists
    .replace(/^\s*\*\s(.*)/gm, '<li class="ml-6 list-disc my-1">$1</li>')
    .replace(/^\s*\d\.\s(.*)/gm, '<li class="ml-6 list-decimal my-1">$1</li>')

    // Process emphasis and bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")

    // Process links - fixed the regex pattern
    .replace(
      /\[(.*?)\]$(.*?)$/g,
      '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>',
    )

  // Process paragraphs (must come last)
  return processedContent
    .split("\n\n")
    .map((para) => {
      // Skip if it's already a heading, list, image container, or HTML block
      if (
        para.startsWith("<h1") ||
        para.startsWith("<h2") ||
        para.startsWith("<h3") ||
        para.startsWith("<li") ||
        para.startsWith("<div class=") ||
        para.startsWith("<!-- IMAGE_BLOCK") ||
        para.startsWith("<img")
      ) {
        return para
      }

      // Handle lists (wrap in ul/ol)
      if (para.includes('<li class="ml-6 list-disc')) {
        return `<ul class="my-4">${para}</ul>`
      }
      if (para.includes('<li class="ml-6 list-decimal')) {
        return `<ol class="my-4">${para}</ol>`
      }

      // Regular paragraph
      return `<p class="my-4">${para}</p>`
    })
    .join("")
}

// Function to sanitize blog content before rendering
const sanitizeBlogContent = (content: string) => {
  // This function will preprocess the content to fix any malformed HTML
  // before it gets passed to renderMarkdown

  // Fix 1: Fix broken image tags where the URL is outside the src attribute
  content = content.replace(
    /(https?:\/\/[^\s"]+)" alt="([^"]*)" class="blog-image" \/>/gi,
    '<img src="$1" alt="$2" class="blog-image" />',
  )

  return content
}

export default function BlogPostPage() {
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPricing, setShowPricing] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [user, setUser] = useState<UserSignedUp | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly")
  const [processingPayment, setProcessingPayment] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null)
  const [splitContentResult, setSplitContentResult] = useState<BlogContent>({
    visibleContent: "",
    blurredContent: "",
    hasBlurredContent: false,
  })
  const [copied, setCopied] = useState(false)

  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const topRef = useRef<HTMLDivElement>(null)

  const supabase = createClient()

  useEffect(() => {
    const checkUserAndSubscription = async () => {
      try {
        console.log("Checking user authentication...")
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError) {
          console.log(`Auth error: ${authError.message}`)
          setUser(null)
          return
        }

        if (!authUser) {
          console.log("No authenticated user found")
          setUser(null)
          return
        }

        console.log(`Authenticated user found: ${authUser.id}`)
        const { data: signupUser, error: signupError } = await supabase
          .from("userssignuped")
          .select("*")
          .eq("id", authUser.id)
          .single()

        if (signupError) {
          console.log(`Error fetching user from userssignuped: ${signupError.message}`)
          if (signupError.code === "PGRST116") {
            console.log("User not in userssignuped, creating entry...")
            const { data: newUser, error: insertError } = await supabase
              .from("userssignuped")
              .insert({ id: authUser.id, email: authUser.email })
              .select()
              .single()

            if (insertError) {
              console.log(`Failed to create user record: ${insertError.message}`)
              setUser(null)
            } else {
              console.log(`Created new user record: ${newUser.id}`)
              setUser(newUser)
              setUserId(authUser.id)
              await checkSubscription(authUser.id)
            }
          } else {
            setUser(null)
          }
        } else {
          console.log(`User found in userssignuped: ${signupUser.id}`)
          setUser(signupUser)
          setUserId(signupUser.id)
          await checkSubscription(authUser.id)
        }
      } catch (err) {
        console.log(`User check error: ${err instanceof Error ? err.message : String(err)}`)
        setUser(null)
      }
    }

    checkUserAndSubscription()
  }, [])

  const checkSubscription = async (userId: string) => {
    try {
      console.log(`Checking subscription for user: ${userId}`)
      const { data: subscriptions, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)

      if (subError) {
        console.log(`Error fetching subscriptions: ${subError.message}`)
        setHasActiveSubscription(false)
        setSubscriptionPlan(null)
        return
      }

      console.log(`Found ${subscriptions?.length || 0} subscriptions`)
      if (subscriptions && subscriptions.length > 0) {
        const activeSubscription = subscriptions.find((sub) => ACTIVE_PLANS.includes(sub.plan_id))
        if (activeSubscription) {
          console.log(`Active subscription detected: ${activeSubscription.plan_id}`)
          setHasActiveSubscription(true)
          setSubscriptionPlan(activeSubscription.plan_id)
        } else {
          console.log("No active subscription found among subscriptions")
          setHasActiveSubscription(false)
          setSubscriptionPlan(null)
        }
      } else {
        console.log("No subscriptions exist for this user")
        setHasActiveSubscription(false)
        setSubscriptionPlan(null)
      }
    } catch (err) {
      console.log(`Subscription check error: ${err instanceof Error ? err.message : String(err)}`)
      setHasActiveSubscription(false)
      setSubscriptionPlan(null)
    }
  }

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!id) {
        console.log("No blog post ID provided")
        setLoading(false)
        return
      }
      try {
        console.log(`Fetching blog post with ID: ${id}`)
        const { data: blog, error } = await supabase.from("blogs").select("*").eq("id", id).single()
        if (error || !blog) {
          console.log(`Error fetching blog post: ${error?.message || "No data returned"}`)
          setBlogPost(null)
        } else {
          console.log(`Blog post fetched: ${blog.title}, is_blurred: ${blog.is_blurred}`)
          setBlogPost({
            ...blog,
            is_blurred: blog.is_blurred ?? false,
          })
        }
      } catch (err) {
        console.log(`Blog fetch error: ${err instanceof Error ? err.message : String(err)}`)
        setBlogPost(null)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogPost()
  }, [id])

  useEffect(() => {
    if (!blogPost) {
      console.log("No blog post available")
      return
    }

    try {
      console.log(
        `Processing content split - is_blurred: ${blogPost.is_blurred}, hasActiveSubscription: ${hasActiveSubscription}`,
      )

      // First sanitize the content to fix any malformed HTML
      const sanitizedContent = sanitizeBlogContent(blogPost.blog_post || "")

      if (!blogPost.is_blurred || hasActiveSubscription) {
        console.log("Content fully visible (not blurred or user has subscription)")
        setSplitContentResult({
          visibleContent: renderMarkdown(sanitizedContent),
          blurredContent: "",
          hasBlurredContent: false,
        })
      } else {
        console.log("Applying blur for non-subscribed user")
        const fullContent = sanitizedContent
        const paragraphs = fullContent.match(/<\/p>/g) || []
        const targetIndex = Math.ceil(paragraphs.length * 0.2)
        let splitIndex = 0
        if (targetIndex > 0 && paragraphs.length >= targetIndex) {
          let count = 0
          let lastPos = 0
          while (count < targetIndex) {
            lastPos = fullContent.indexOf("</p>", lastPos + 1)
            if (lastPos === -1) break
            count++
            splitIndex = lastPos + 4
          }
        } else {
          splitIndex = Math.floor(fullContent.length * 0.2)
        }

        setSplitContentResult({
          visibleContent: renderMarkdown(fullContent.slice(0, splitIndex)),
          blurredContent: renderMarkdown(fullContent.slice(splitIndex)),
          hasBlurredContent: fullContent.length > splitIndex,
        })
        console.log(`Content split - Visible: ${splitIndex} chars, Blurred: ${fullContent.length - splitIndex} chars`)
      }
    } catch (err) {
      console.log(`Content split error: ${err instanceof Error ? err.message : String(err)}`)
      setSplitContentResult({
        visibleContent: renderMarkdown(blogPost.blog_post || ""),
        blurredContent: "",
        hasBlurredContent: false,
      })
    }
  }, [blogPost, hasActiveSubscription])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError(null)
      console.log("Initiating login...")
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        console.log(`Login failed: ${authError.message}`)
        throw new Error(`Authentication failed: ${authError.message}`)
      }
      if (!authUser) {
        console.log("No user returned from login")
        throw new Error("Authentication failed: No user returned")
      }
      console.log(`Logged in user: ${authUser.id}`)
      const { data: signupUser, error: signupError } = await supabase
        .from("userssignuped")
        .select("*")
        .eq("id", authUser.id)
        .single()
      if (signupError) {
        if (signupError.code === "PGRST116") {
          console.log("User not in userssignuped, creating...")
          const { data: newUser, error: insertError } = await supabase
            .from("userssignuped")
            .insert({ id: authUser.id, email: authUser.email })
            .select()
            .single()
          if (insertError) {
            console.log(`Failed to insert new user: ${insertError.message}`)
            throw new Error(`Failed to create user record: ${insertError.message}`)
          }
          setUser(newUser)
          setUserId(authUser.id)
          setShowLoginForm(false)
          await checkSubscription(authUser.id)
          return
        }
        console.log(`User fetch error post-login: ${signupError.message}`)
        throw new Error(`Failed to check user record: ${signupError.message}`)
      }
      console.log("User exists in userssignuped")
      setUser(signupUser)
      setUserId(signupUser.id)
      setShowLoginForm(false)
      await checkSubscription(authUser.id)
    } catch (err) {
      console.log(`Login error: ${err instanceof Error ? err.message : "Unknown error"}`)
      setError(err instanceof Error ? err.message : "Login failed")
    }
  }

  const handlePayNow = () => {
    console.log("Pay Now clicked")
    setShowPricing(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleBackToPreview = () => {
    setShowPricing(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm)
    setError(null)
  }

  const getCheckoutUrl = (plan: Plan) => {
    if (!user || !user.id) {
      console.log("No user for checkout URL")
      return "#"
    }
    console.log(`Generating checkout URL for plan: ${plan.name}`)
    const redirectUrl = encodeURIComponent(
      `${window.location.origin}/payment-success?` +
        `user_id=${user.id}&plan_id=${plan.id}&plan_name=${plan.name}&` +
        `price=${plan.numericPrice}¤cy=USD&billing_cycle=${billingCycle}`,
    )
    return `${DODO_URL}/${plan.dodoProductId}?quantity=1&redirect_url=${redirectUrl}`
  }

  // Calculate estimated reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return readingTime
  }

  const copyToClipboard = () => {
    if (blogPost?.blog_post) {
      navigator.clipboard.writeText(blogPost.blog_post)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const { visibleContent, blurredContent, hasBlurredContent } = splitContentResult

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#294fd6] mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center p-8">
            <div className="h-12 w-12 text-gray-400 mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Blog post not found</h2>
            <p className="text-gray-600">The blog post you're looking for doesn't exist or has been removed.</p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div ref={topRef} className="min-h-screen bg-white py-12 px-4 sm:px-6">
      {/* Add blog styling from generate-blog-page */}
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
      `}</style>

      <AnimatePresence mode="wait">
        {!showPricing ? (
          <motion.div
            key="blog-post"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="p-6 sm:p-10">
              {hasActiveSubscription && (
                <div className="mb-6 bg-green-50 rounded-lg p-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-green-800 font-medium">Premium Content Unlocked</p>
                    <p className="text-green-600 text-sm">
                      You're enjoying the full post with your{" "}
                      {subscriptionPlan
                        ? subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1)
                        : "Premium"}{" "}
                      plan
                    </p>
                  </div>
                </div>
              )}

              {/* Blog Header - Using styling from generate-blog-page */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
                >
                  {blogPost.title}
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex flex-wrap items-center gap-4 mb-2 text-sm text-gray-500"
                >
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {new Date(blogPost.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{calculateReadingTime(blogPost.blog_post)} min read</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>{blogPost.blog_post.split(/\s+/).length} words</span>
                  </div>
                </motion.div>
              </div>

              {/* Blog Content - Using the blog-content class from generate-blog-page */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="blog-content prose max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: visibleContent }}
              />

              {/* Blurred Content Section */}
              {hasBlurredContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="relative mt-8 rounded-xl overflow-hidden"
                >
                  <div className="relative">
                    <div
                      className="blog-content prose max-w-none blur-md pointer-events-none p-6 opacity-70 select-none"
                      dangerouslySetInnerHTML={{ __html: blurredContent }}
                    />
                    <div className="absolute top-0 right-0 bg-[#294fd6] text-white text-xs font-bold px-2 py-1 rounded-bl-md">
                      PREMIUM
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white flex flex-col items-center justify-center p-8">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="text-center max-w-md"
                    >
                      <div className="bg-blue-100 text-[#294fd6] p-3 rounded-full inline-flex items-center justify-center mb-4">
                        <Lock className="h-6 w-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">Unlock the Full Post</h3>
                      <p className="text-gray-600 mb-6">
                        Yo, this blog's got the good stuff—images, videos, FAQs, the works! Subscribe to dive in and get
                        all our premium content.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePayNow}
                        className="bg-[#294fd6] hover:bg-[#1e3eb8] text-white px-8 py-3 rounded-lg transition-all flex items-center justify-center mx-auto font-medium"
                      >
                        <CreditCard className="h-5 w-5 mr-2" />
                        Subscribe to Unlock
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Copy to Clipboard Button - From generate-blog-page */}
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
            </div>
          </motion.div>
        ) : (
          <motion.div className="text-center mb-8">
            <button
              onClick={handleBackToPreview}
              className="text-[#294fd6] hover:text-[#1e3eb8] font-medium transition-colors duration-200 underline mb-8 font-saira"
            >
              Back to Blog Post
            </button>
            <PaymentPage />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-[#294fd6] text-white p-3 rounded-full transition-all duration-300 z-50"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
