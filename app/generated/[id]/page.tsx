"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { CreditCard, Lock, ArrowUp, Calendar, LinkIcon, Clock, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/utitls/supabase/client"
import PaymentPage from "@/app/components/payment-page"

// Use the test mode URL for Dodo Payments
const DODO_URL = "https://test.checkout.dodopayments.com/buy"

type BlogPost = {
  id: string
  user_id: string
  blog_post: string
  citations: any[] // Adjust type based on your citations structure
  created_at: string
  title: string
  timestamp: string
  reveal_date: string
  url: string
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
}

// Define the plan type to fix the 'any' type error
type Plan = {
  id: string
  name: string
  dodoProductId: string
  numericPrice: number
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
  const [debugInfo, setDebugInfo] = useState<string>("")

  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  // Ref for scroll to top functionality
  const topRef = useRef<HTMLDivElement>(null)

  // Initialize Supabase client
  const supabase = createClient()

  // Add a log function to track what's happening
  const addLog = (message: string) => {
    console.log(message)
    setDebugInfo((prev) => `${prev}\n${message}`)
  }

  // Check if user is authenticated and has subscription
  useEffect(() => {
    const checkUserAndSubscription = async () => {
      try {
        addLog("Checking user authentication...")

        // First try to get the user from Supabase auth
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError) {
          addLog(`Auth error: ${authError.message}`)
          setUser(null)
          return
        }

        if (!authUser) {
          addLog("No authenticated user")
          setUser(null)
          return
        }

        addLog(`Auth user found: ${authUser.id}`)

        // Now check if this user exists in the userssignuped table
        const { data: signupUser, error: signupError } = await supabase
          .from("userssignuped")
          .select("*")
          .eq("id", authUser.id)
          .single()

        if (signupError) {
          addLog(`Error fetching user from userssignuped: ${signupError.message}`)

          // If user doesn't exist in userssignuped, create an entry
          if (signupError.code === "PGRST116") {
            addLog("User not found in userssignuped table, creating entry...")
            const { data: newUser, error: insertError } = await supabase
              .from("userssignuped")
              .insert({
                id: authUser.id,
                email: authUser.email,
              })
              .select()
              .single()

            if (insertError) {
              addLog(`Failed to create user record: ${insertError.message}`)
              setUser(null)
            } else {
              addLog(`Created new user in userssignuped: ${newUser.id}`)
              setUser(newUser)
              setUserId(authUser.id)

              // Check for subscription
              await checkSubscription(authUser.id)
            }
          } else {
            setUser(null)
          }
        } else if (signupUser) {
          addLog(`User found in userssignuped table: ${signupUser.id}`)
          setUser(signupUser)
          setUserId(signupUser.id)

          // Check for subscription
          await checkSubscription(authUser.id)
        }
      } catch (err) {
        addLog(`User check error: ${err instanceof Error ? err.message : String(err)}`)
        setUser(null)
      }
    }

    checkUserAndSubscription()
  }, [])

  // Check if user has an active subscription
  const checkSubscription = async (userId: string) => {
    try {
      addLog(`Checking subscription for user: ${userId}`)

      // Get all subscriptions for the user
      const { data: subscriptions, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)

      if (subError) {
        addLog(`Error fetching subscriptions: ${subError.message}`)
        setHasActiveSubscription(false)
        return
      }

      addLog(`Found ${subscriptions?.length || 0} subscriptions`)

      if (subscriptions && subscriptions.length > 0) {
        // Find active subscriptions
        const activeSubscription = subscriptions.find((sub) => sub.status === "active")

        if (activeSubscription) {
          addLog(`Found active subscription: ${activeSubscription.plan_id}`)

          // Check if subscription is expired
          if (activeSubscription.current_period_end) {
            const currentPeriodEnd = new Date(activeSubscription.current_period_end)
            const now = new Date()

            if (currentPeriodEnd > now) {
              // Subscription is active and not expired
              addLog(`Subscription is valid until: ${currentPeriodEnd.toISOString()}`)
              setHasActiveSubscription(true)
              setSubscriptionPlan(activeSubscription.plan_id)
            } else {
              // Subscription is expired
              addLog(`Subscription expired on: ${currentPeriodEnd.toISOString()}`)
              setHasActiveSubscription(false)
            }
          } else {
            // No expiration date, assume active
            addLog("Subscription has no expiration date, assuming active")
            setHasActiveSubscription(true)
            setSubscriptionPlan(activeSubscription.plan_id)
          }
        } else {
          addLog("No active subscriptions found")
          setHasActiveSubscription(false)
        }
      } else {
        addLog("No subscriptions found")
        setHasActiveSubscription(false)
      }
    } catch (err) {
      addLog(`Error checking subscription: ${err instanceof Error ? err.message : String(err)}`)
      setHasActiveSubscription(false)
    }
  }

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!id) return

      try {
        addLog(`Fetching blog post with ID: ${id}`)
        const { data: blog, error } = await supabase.from("blogs").select("*").eq("id", id).single()

        if (error || !blog) {
          addLog(`Error fetching blog post: ${error?.message || "No data returned"}`)
          setBlogPost(null)
        } else {
          addLog(`Blog post fetched successfully: ${blog.title}`)
          setBlogPost(blog)
        }
      } catch (err) {
        addLog(`Error fetching blog post: ${err instanceof Error ? err.message : String(err)}`)
        setBlogPost(null)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPost()
  }, [id])

  // Handle scroll events to show/hide the scroll button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true)
      } else {
        setShowScrollButton(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Handle login directly checking userssignuped table
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setError(null)
      addLog("Attempting login...")

      // First authenticate with Supabase Auth
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        addLog(`Authentication failed: ${authError.message}`)
        throw new Error(`Authentication failed: ${authError.message}`)
      }

      if (!authUser) {
        addLog("Authentication failed: No user returned")
        throw new Error("Authentication failed: No user returned")
      }

      addLog(`User authenticated: ${authUser.id}`)

      // Now check if this user exists in the userssignuped table
      const { data: signupUser, error: signupError } = await supabase
        .from("userssignuped")
        .select("*")
        .eq("id", authUser.id)
        .single()

      if (signupError) {
        // If user doesn't exist in userssignuped, create an entry
        if (signupError.code === "PGRST116") {
          addLog("Creating new user record in userssignuped table")
          const { data: newUser, error: insertError } = await supabase
            .from("userssignuped")
            .insert({
              id: authUser.id,
              email: authUser.email,
            })
            .select()
            .single()

          if (insertError) {
            addLog(`Failed to create user record: ${insertError.message}`)
            throw new Error(`Failed to create user record: ${insertError.message}`)
          }

          setUser(newUser)
          setUserId(authUser.id)
          setShowLoginForm(false)

          // Check for subscription
          await checkSubscription(authUser.id)
          return
        }

        addLog(`Failed to check user record: ${signupError.message}`)
        throw new Error(`Failed to check user record: ${signupError.message}`)
      }

      // User exists in userssignuped table
      addLog("User found in userssignuped table")
      setUser(signupUser)
      setUserId(signupUser.id)
      setShowLoginForm(false)

      // Check for subscription
      await checkSubscription(authUser.id)
    } catch (err) {
      addLog(`Login error: ${err instanceof Error ? err.message : "Unknown error"}`)
      setError(err instanceof Error ? err.message : "Login failed")
    }
  }

  const handlePayNow = () => {
    addLog("Payment button clicked")
    // Show pricing section in the same page
    setShowPricing(true)
    // Scroll to top when switching to pricing
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleBackToPreview = () => {
    setShowPricing(false)
    // Scroll to top when switching back to article
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm)
    setError(null)
  }

  // Function to create checkout URL for a plan
  const getCheckoutUrl = (plan: Plan) => {
    if (!user || !user.id) {
      addLog("No authenticated user for checkout")
      return "#"
    }

    addLog(`Creating checkout URL for user: ${user.id}`)

    const redirectUrl = encodeURIComponent(
      `${window.location.origin}/payment-success?` +
        `user_id=${user.id}&` +
        `plan_id=${plan.id}&` +
        `plan_name=${plan.name}&` +
        `price=${plan.numericPrice}&` +
        `currency=USD&` +
        `billing_cycle=${billingCycle}`,
    )

    return `${DODO_URL}/${plan.dodoProductId}?quantity=1&redirect_url=${redirectUrl}`
  }

  // Split content to show exactly 4 paragraphs
  const splitContent = () => {
    // We need to handle this client-side since DOMParser is browser-only
    if (typeof document !== "undefined" && blogPost) {
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = blogPost.blog_post

      const paragraphs = tempDiv.querySelectorAll("p, h1, h2, h3, h4, h5, h6")

      // Get the first 4 paragraphs
      const visibleParagraphs = Array.from(paragraphs).slice(0, 4)
      const blurredParagraphs = Array.from(paragraphs).slice(4)

      // Create containers for visible and blurred content
      const visibleDiv = document.createElement("div")
      visibleParagraphs.forEach((p) => visibleDiv.appendChild(p.cloneNode(true)))

      const blurredDiv = document.createElement("div")
      blurredParagraphs.forEach((p) => blurredDiv.appendChild(p.cloneNode(true)))

      return {
        visibleContent: visibleDiv.innerHTML,
        blurredContent: blurredDiv.innerHTML,
        hasBlurredContent: blurredParagraphs.length > 0,
      }
    }

    // Fallback for SSR (though this component is marked as client)
    return {
      visibleContent: "",
      blurredContent: blogPost?.blog_post || "",
      hasBlurredContent: true,
    }
  }

  const { visibleContent, blurredContent, hasBlurredContent } = splitContent()

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
          className="max-w-md mx-auto bg-white rounded-xl shadow-md border border-gray-200"
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
      <AnimatePresence mode="wait">
        {!showPricing ? (
          <motion.div
            key="blog-post"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
          >
            <div className="p-6 sm:p-8">
              {/* Subscription Status Badge - Only show when user has subscription */}
              {hasActiveSubscription && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-green-800 font-medium">Premium Content Unlocked</p>
                    <p className="text-green-600 text-sm">
                      You're viewing this content with your{" "}
                      {subscriptionPlan
                        ? subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1)
                        : "Premium"}{" "}
                      plan
                    </p>
                  </div>
                </div>
              )}

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800"
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
                  <span>5 min read</span>
                </div>

                {blogPost.url && (
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    <a
                      href={blogPost.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#294fd6] hover:text-[#1e3eb8] hover:underline transition-colors duration-200"
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

              {/* Visible Content - Always show first 4 paragraphs */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="prose prose-gray prose-headings:text-gray-800 prose-a:text-[#294fd6] max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: visibleContent }}
              />

              {/* Conditional Content Display */}
              {hasBlurredContent && (
                <>
                  {hasActiveSubscription ? (
                    // Full Content for Subscribers
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="prose prose-gray prose-headings:text-gray-800 prose-a:text-[#294fd6] max-w-none"
                      dangerouslySetInnerHTML={{ __html: blurredContent }}
                    />
                  ) : (
                    // Blurred Content with Paywall for Non-Subscribers
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="relative mt-8 rounded-xl overflow-hidden border border-gray-200 shadow-md"
                    >
                      <div
                        className="prose prose-gray max-w-none blur-md pointer-events-none p-6 opacity-70"
                        dangerouslySetInnerHTML={{ __html: blurredContent }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white flex flex-col items-center justify-center p-8">
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          className="text-center max-w-md"
                        >
                          <div className="bg-blue-100 text-[#294fd6] p-3 rounded-full inline-flex items-center justify-center mb-4 shadow-md">
                            <Lock className="h-6 w-6" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-3">Premium Content Locked</h3>
                          <p className="text-gray-600 mb-6">
                            Unlock the full article and get access to our premium content library with expert insights
                            and analysis.
                          </p>

                          {/* Direct link to payment page */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handlePayNow}
                            className="bg-[#294fd6] hover:bg-[#1e3eb8] text-white px-8 py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center mx-auto font-medium"
                          >
                            <CreditCard className="h-5 w-5 mr-2" />
                            Unlock Full Article
                          </motion.button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}

              {/* Citations */}
              {blogPost.citations && blogPost.citations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mt-8 pt-6 border-t border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Citations</h3>
                  <ul className="space-y-2">
                    {blogPost.citations.map((citation: any, index: number) => (
                      <li key={index} className="text-gray-600">
                        <span className="text-gray-400">[{index + 1}]</span>{" "}
                        <a
                          href={citation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#294fd6] hover:text-[#1e3eb8] hover:underline transition-colors duration-200"
                        >
                          {citation.title || citation.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Debug Information - Remove in production */}
              <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Debug Information</h4>
                <div className="text-xs font-mono text-gray-600">
                  <p>User ID: {userId || "Not logged in"}</p>
                  <p>Has Subscription: {hasActiveSubscription ? "Yes" : "No"}</p>
                  <p>Subscription Plan: {subscriptionPlan || "None"}</p>
                  <p>Blog Post ID: {blogPost.id}</p>
                  <details>
                    <summary>Detailed Logs</summary>
                    <pre className="whitespace-pre-wrap mt-2 text-xs">{debugInfo}</pre>
                  </details>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div className="text-center mb-8">
            <button
              onClick={handleBackToPreview}
              className="text-[#294fd6] hover:text-[#1e3eb8] font-medium transition-colors duration-200 underline mb-8"
            >
              Back to article preview
            </button>
            <PaymentPage />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to top button that appears when scrolling */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-[#294fd6] text-white p-3 rounded-full shadow-lg hover:bg-[#1e3eb8] transition-all duration-300 z-50"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

