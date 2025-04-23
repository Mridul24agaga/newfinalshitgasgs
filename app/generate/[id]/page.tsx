"use client"
import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, CreditCard, Lock, ArrowUp, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/utitls/supabase/client"
import PaymentPage from "@/app/components/payment-page"

const DODO_URL = "https://test.checkout.dodopayments.com/buy"
const ACTIVE_PLANS = ["growth", "basic", "pro"]

type BlogPost = {
  id: string
  user_id: string
  blog_post: string
  citations?: string[]
  created_at: string
  title: string
  timestamp: string
  reveal_date: string
  url: string | null
  is_blurred?: boolean
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

export default function GeneratedBlogPost() {
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPricing, setShowPricing] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [user, setUser] = useState<UserSignedUp | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly")
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null)
  const [splitContentResult, setSplitContentResult] = useState<BlogContent>({
    visibleContent: "",
    blurredContent: "",
    hasBlurredContent: false,
  })
  const [readTime, setReadTime] = useState<number>(0)

  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const topRef = useRef<HTMLDivElement>(null)

  const supabase = createClient()

  // Calculate read time
  const calculateReadTime = (htmlContent: string) => {
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = htmlContent
    const text = tempDiv.textContent || tempDiv.innerText || ""
    const words = text.split(/\s+/).filter((word) => word.length > 0)
    const wordsPerMinute = 225
    const minutes = Math.ceil(words.length / wordsPerMinute)
    setReadTime(minutes)
  }

  // Format blog content (aligned with BlogPostPage and updated for iframe handling)
  const formatBlogContent = (content: string) => {
    if (!content) return ""

    // Step 1: Handle markdown headings (#, ##, ###, etc.)
    content = content.replace(/^(#+)\s*(.*?)\s*$/gm, (match, hashes, text) => {
      const level = hashes.length
      return `<h${level} class="text-${4 - level + 1}xl font-bold my-6">${text.trim()}</h${level}>`
    })

    // Step 2: Format bold text (**text**)
    content = content.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
      // Avoid bolding headings that were already processed
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

    // Step 6: Format iframes (e.g., YouTube embeds)
    content = content.replace(
      /<iframe(.*?)><\/iframe>/g,
      '<div class="my-6 relative aspect-video w-full"><iframe$1 class="absolute top-0 left-0 w-full h-full rounded-lg"></iframe></div>',
    )

    // Also add this additional regex to handle iframes that might not have a closing tag in the same format
    content = content.replace(
      /<iframe(.*?)(?!<\/iframe>)>/g,
      '<div class="my-6 relative aspect-video w-full"><iframe$1 class="absolute top-0 left-0 w-full h-full rounded-lg"></iframe></div>',
    )

    // Step 7: Format paragraphs
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

    // Step 8: Format Q&A in FAQ section
    formattedContent = formattedContent.replace(
      /\*\*Q\d+: (.*?)\*\*/g,
      '<h3 class="text-xl font-semibold mt-6 mb-2">$1</h3>',
    )

    return formattedContent
  }

  // Check user and subscription
  useEffect(() => {
    const checkUserAndSubscription = async () => {
      try {
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError) {
          setUser(null)
          return
        }

        if (!authUser) {
          setUser(null)
          return
        }

        const { data: signupUser, error: signupError } = await supabase
          .from("userssignuped")
          .select("*")
          .eq("id", authUser.id)
          .single()

        if (signupError) {
          if (signupError.code === "PGRST116") {
            const { data: newUser, error: insertError } = await supabase
              .from("userssignuped")
              .insert({ id: authUser.id, email: authUser.email })
              .select()
              .single()

            if (insertError) {
              setUser(null)
            } else {
              setUser(newUser)
              setUserId(authUser.id)
              await checkSubscription(authUser.id)
            }
          } else {
            setUser(null)
          }
        } else {
          setUser(signupUser)
          setUserId(signupUser.id)
          await checkSubscription(authUser.id)
        }
      } catch (err) {
        setUser(null)
      }
    }

    checkUserAndSubscription()
  }, [])

  const checkSubscription = async (userId: string) => {
    try {
      const { data: subscriptions, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)

      if (subError) {
        setHasActiveSubscription(false)
        setSubscriptionPlan(null)
        return
      }

      if (subscriptions && subscriptions.length > 0) {
        const activeSubscription = subscriptions.find((sub) => ACTIVE_PLANS.includes(sub.plan_id))
        if (activeSubscription) {
          setHasActiveSubscription(true)
          setSubscriptionPlan(activeSubscription.plan_id)
        } else {
          setHasActiveSubscription(false)
          setSubscriptionPlan(null)
        }
      } else {
        setHasActiveSubscription(false)
        setSubscriptionPlan(null)
      }
    } catch (err) {
      setHasActiveSubscription(false)
      setSubscriptionPlan(null)
    }
  }

  // Fetch blog post
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          setError("Please log in to view this post.")
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from("headlinetoblog")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single()

        if (error) {
          throw new Error(error.message)
        }

        if (!data) {
          throw new Error("Post not found or you don't have access to it.")
        }

        const postWithDefaults = {
          ...data,
          citations: data.citations || [],
          is_blurred: data.is_blurred ?? false,
        }

        setBlogPost(postWithDefaults)
        calculateReadTime(postWithDefaults.blog_post)
      } catch (err: any) {
        setError(`Failed to load post: ${err.message}`)
        setBlogPost(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  // Split content for blurred effect
  useEffect(() => {
    if (!blogPost) return

    try {
      if (!blogPost.is_blurred || hasActiveSubscription) {
        setSplitContentResult({
          visibleContent: formatBlogContent(blogPost.blog_post),
          blurredContent: "",
          hasBlurredContent: false,
        })
      } else {
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
      }
    } catch (err) {
      setSplitContentResult({
        visibleContent: formatBlogContent(blogPost.blog_post || ""),
        blurredContent: "",
        hasBlurredContent: false,
      })
    }
  }, [blogPost, hasActiveSubscription])

  // Scroll button visibility
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

  const handlePayNow = () => {
    setShowPricing(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleBackToPreview = () => {
    setShowPricing(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const formatReadTime = (minutes: number) => {
    if (minutes < 1) return "Less than 1 min read"
    return `${minutes} min read`
  }

  const getCheckoutUrl = (plan: Plan) => {
    if (!user || !user.id) return "#"
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

  if (error || !blogPost) {
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
            <p className="text-gray-600">
              {error || "The blog post you're looking for doesn't exist or has been removed."}
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div ref={topRef} className="min-h-screen bg-white py-12 px-4 sm:px-6">
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

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center mb-4"
              >
                <a
                  href="/headlinetoblog"
                  className="text-[#294fd6] hover:text-[#1e3eb8] font-medium transition-colors duration-200 flex items-center font-saira"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Generator
                </a>
              </motion.div>

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
                  <span>{formatReadTime(readTime)}</span>
                </div>
                {blogPost.url && (
                  <div className="flex items-center">
                    <a
                      href={blogPost.url}
                      className="text-[#294fd6] hover:text-[#1e3eb8] transition-colors duration-200"
                    >
                      Source
                    </a>
                  </div>
                )}
              </motion.div>

              <motion.hr
                initial={{ opacity: 0, width: "0%" }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="my-6 border-gray-200"
              />

              {/* Blog Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
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

              {/* Citations */}
              {blogPost.citations && blogPost.citations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mt-8"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 font-saira">Citations</h3>
                  <ul className="space-y-3">
                    {blogPost.citations.map((citation, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-xs bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 font-medium">
                          {index + 1}
                        </span>
                        <a href={citation} className="text-orange-600 hover:text-orange-700 break-all font-saira">
                          {citation}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Footer Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-8 pt-6 border-t border-gray-200"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="text-sm text-gray-500 space-y-1">
                    <p className="flex items-center">
                      <span className="font-medium text-gray-700 mr-2">Generated:</span>
                      {new Date(blogPost.created_at).toLocaleString()}
                    </p>
                    {blogPost.reveal_date && (
                      <p className="flex items-center">
                        <span className="font-medium text-gray-700 mr-2">Reveal Date:</span>
                        {new Date(blogPost.reveal_date).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <a
                    href="/headlinetoblog"
                    className="inline-flex items-center justify-center bg-[#294fd6] text-white py-2.5 px-5 rounded-md hover:bg-[#1e3eb8] transition-colors duration-200 text-sm font-medium shadow-sm font-saira"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                    Back to Generator
                  </a>
                </div>
              </motion.div>
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
