"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { CreditCard, Lock, ArrowUp, Calendar, Clock, ArrowLeft, Code, Eye } from "lucide-react"
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
            className={`${
              heading.level === 1 ? "font-bold" : heading.level === 2 ? "pl-2" : heading.level === 3 ? "pl-4" : "pl-6"
            }`}
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
  // Add state for showing raw content
  const [showRawContent, setShowRawContent] = useState(false)

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
        // First check if user has a free plan
        const freePlan = subscriptions.find((sub) => sub.plan_id === "free")
        if (freePlan) {
          console.log("Free plan detected, content will be blurred")
          setHasActiveSubscription(false)
          setSubscriptionPlan("free")
          return
        }

        // Then check for active plans
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

  const formatBlogContent = (content: string) => {
    if (!content) return ""

    // Step 1: Handle markdown headings (#, ##, ###, etc.)
    content = content.replace(/^(#+)\s*(.*?)\s*$/gm, (match, hashes, text) => {
      const level = hashes.length // Number of # determines heading level
      const id = text
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
      return `<h${level} id="${id}" class="text-${4 - level + 1}xl font-bold my-6 scroll-mt-16">${text.trim()}</h${level}>`
    })

    // Step 2: Format bold text (**text**)
    content = content.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
      // Avoid bolding headings that were already processed
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
        return `<h2 id="${id}" class="text-2xl font-bold my-5 scroll-mt-16">${p1}</h2>`
      }
      return `<strong>${p1}</strong>`
    })

    // Step 3: Format lists
    content = content.replace(/- \*\*(.*?)\*\*: ([\s\S]*?)(?=(?:- \*\*|$))/g, (match, title, description) => {
      return `<div class="my-3">
        <strong class="block mb-1">${title}:</strong>
        <p>${description.trim()}</p>
      </div>`
    })

    // Step 4: Format bullet points
    content = content.replace(/- (.*?)(?=(?:\n|$))/g, '<li class="ml-6 list-disc my-2">$1</li>')

    // Step 5: Wrap lists in ul tags
    content = content.replace(
      /<li class="ml-6 list-disc my-2">(.*?)<\/li>\n<li class="ml-6 list-disc my-2">/g,
      '<ul class="my-4 list-disc">\n<li class="ml-6 list-disc my-2">$1</li>\n<li class="ml-6 list-disc my-2">',
    )
    content = content.replace(
      /<li class="ml-6 list-disc my-2">(.*?)<\/li>\n(?!<li)/g,
      '<li class="ml-6 list-disc my-2">$1</li>\n</ul>\n',
    )

    // Step 6: Format paragraphs
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

    // Step 7: Format Q&A in FAQ section
    formattedContent = formattedContent.replace(
      /\*\*Q\d+: (.*?)\*\*/g,
      '<h3 class="text-xl font-semibold mt-6 mb-2">$1</h3>',
    )

    return formattedContent
  }

  useEffect(() => {
    if (!blogPost) {
      console.log("No blog post available")
      return
    }

    try {
      console.log(
        `Processing content split - is_blurred: ${blogPost.is_blurred}, hasActiveSubscription: ${hasActiveSubscription}, subscriptionPlan: ${subscriptionPlan}`,
      )

      // For free plan users, blur the entire content
      if (subscriptionPlan === "free") {
        console.log("Free plan detected - blurring entire content")
        const fullContent = blogPost.blog_post || ""
        setSplitContentResult({
          visibleContent: "", // No visible content for free plan
          blurredContent: formatBlogContent(fullContent),
          hasBlurredContent: true,
        })
      }
      // For non-subscribers (but not free plan), show 20% and blur the rest
      else if (blogPost.is_blurred && !hasActiveSubscription) {
        console.log("Non-subscriber - showing 20% and blurring the rest")
        const fullContent = blogPost.blog_post || ""
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
          visibleContent: formatBlogContent(fullContent.slice(0, splitIndex)),
          blurredContent: formatBlogContent(fullContent.slice(splitIndex)),
          hasBlurredContent: fullContent.length > splitIndex,
        })
        console.log(`Content split - Visible: ${splitIndex} chars, Blurred: ${fullContent.length - splitIndex} chars`)
      }
      // For premium subscribers, show everything
      else {
        console.log("Premium subscriber - showing all content")
        setSplitContentResult({
          visibleContent: formatBlogContent(blogPost.blog_post),
          blurredContent: "",
          hasBlurredContent: false,
        })
      }
    } catch (err) {
      console.log(`Content split error: ${err instanceof Error ? err.message : String(err)}`)
      setSplitContentResult({
        visibleContent: formatBlogContent(blogPost.blog_post || ""),
        blurredContent: "",
        hasBlurredContent: false,
      })
    }
  }, [blogPost, hasActiveSubscription, subscriptionPlan])

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
    router.push("/payment")
  }

  const handleBackToPreview = () => {
    setShowPricing(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm)
    setError(null)
  }

  // Toggle between rendered and raw content views
  const toggleRawContent = () => {
    setShowRawContent(!showRawContent)
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
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center text-gray-600 hover:text-[#294fd6] transition-colors duration-200 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>
      </div>
      <AnimatePresence mode="wait">
        {!showPricing ? (
          <motion.div
            key="blog-post"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Table of Contents Sidebar */}
              <div className="md:w-1/4 md:sticky md:top-8 md:self-start">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Table of Contents</h3>
                  <TableOfContents blogContent={blogPost.blog_post} />
                </div>
              </div>

              {/* Main Content */}
              <div className="md:w-3/4 p-6 sm:p-10">
                {subscriptionPlan === "free" && (
                  <div className="mb-6 bg-blue-50 rounded-lg p-4 flex items-center">
                    <Lock className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-blue-800 font-medium">Free Plan</p>
                      <p className="text-blue-600 text-sm">Upgrade to a premium plan to unlock all content</p>
                    </div>
                  </div>
                )}

                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800 font-saira"
                >
                  {blogPost.title}
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500"
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
                    <span>6 min read</span>
                  </div>
                </motion.div>

                {/* View toggle button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex justify-end mb-4"
                >
                  <button
                    onClick={toggleRawContent}
                    className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label={showRawContent ? "Show rendered content" : "Show raw HTML/markdown"}
                  >
                    {showRawContent ? (
                      <>
                        <Eye className="h-4 w-4" />
                        <span>View Rendered</span>
                      </>
                    ) : (
                      <>
                        <Code className="h-4 w-4" />
                        <span>View HTML/Markdown</span>
                      </>
                    )}
                  </button>
                </motion.div>

                <motion.hr
                  initial={{ opacity: 0, width: "0%" }}
                  animate={{ opacity: 1, width: "100%" }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="my-6 border-gray-200"
                />

                {/* Blog Content - Raw or Rendered */}
                {visibleContent && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    {showRawContent ? (
                      // Raw HTML/Markdown view
                      <div className="relative">
                        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 whitespace-pre-wrap">
                          {blogPost.blog_post || "No content available"}
                        </pre>
                        <div className="absolute top-2 right-2 bg-gray-200 px-2 py-1 rounded text-xs font-medium">
                          HTML/Markdown
                        </div>
                      </div>
                    ) : (
                      // Rendered view
                      <div
                        className="prose prose-gray max-w-none mb-8
                        prose-headings:font-saira prose-headings:text-gray-800
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
                        dangerouslySetInnerHTML={{ __html: visibleContent }}
                      />
                    )}
                  </motion.div>
                )}

                {/* Blurred Content Section */}
                {hasBlurredContent && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="relative mt-8 rounded-xl overflow-hidden"
                  >
                    {showRawContent ? (
                      // Raw blurred content
                      <div className="relative">
                        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 whitespace-pre-wrap blur-md pointer-events-none opacity-70 select-none">
                          {blogPost.blog_post.slice(blogPost.blog_post.length * 0.2) || "No content available"}
                        </pre>
                        <div className="absolute top-2 right-2 bg-gray-200 px-2 py-1 rounded text-xs font-medium">
                          PREMIUM CONTENT
                        </div>
                      </div>
                    ) : (
                      // Rendered blurred content
                      <div className="relative">
                        <div
                          className="prose prose-gray max-w-none blur-md pointer-events-none p-6 opacity-70 select-none
                          prose-headings:font-saira prose-headings:text-gray-800
                          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:font-saira
                          prose-a:text-orange-600 prose-a:underline prose-a:hover:text-orange-700
                          prose-img:w-full prose-img:rounded-lg
                          prose-figure:my-6 prose-figure:mx-auto prose-figure:max-w-full
                          prose-figcaption:text-sm prose-figcaption:text-center prose-figcaption:text-gray-500 prose-figcaption:mt-2 prose-figcaption:font-saira
                          prose-iframe:w-full prose-iframe:rounded-lg
                          prose-table:table prose-table:w-full prose-table:border-collapse prose-table:bg-white prose-table:text-gray-800"
                          dangerouslySetInnerHTML={{ __html: blurredContent }}
                        />
                        <div className="absolute top-0 right-0 bg-[#294fd6] text-white text-xs font-bold px-2 py-1 rounded-bl-md">
                          PREMIUM
                        </div>
                      </div>
                    )}
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
                          {subscriptionPlan === "free"
                            ? "You're on the Free plan! Upgrade now to unlock all premium content including images, videos, and FAQs."
                            : "Yo, this blog's got the good stuff—images, videos, FAQs, the works! Subscribe to dive in and get all our premium content."}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handlePayNow}
                          className="bg-[#294fd6] hover:bg-[#1e3eb8] text-white px-8 py-3 rounded-lg transition-all flex items-center justify-center mx-auto font-medium"
                        >
                          <CreditCard className="h-5 w-5 mr-2" />
                          {subscriptionPlan === "free" ? "Upgrade Your Plan" : "Subscribe to Unlock"}
                        </motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
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
