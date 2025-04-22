"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utitls/supabase/client"
import { ArrowLeft, Eye, EyeOff, AlertCircle, Loader2, FileText, ArrowRight, Check, Code, Globe } from "lucide-react"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
})

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Animation states
  const [animationStep, setAnimationStep] = useState(0)
  const [showTypingEffect, setShowTypingEffect] = useState(true)
  const [typedText, setTypedText] = useState("")
  const [codeText, setCodeText] = useState("")
  const [showGeneratedArticle, setShowGeneratedArticle] = useState(false)
  const [publishProgress, setPublishProgress] = useState(0)
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0)
  const animationRef = useRef<NodeJS.Timeout | null>(null)

  const codeSnippet = `async function generateBlogPost() {
  const topic = await analyzeWebsite(url);
  const keywords = await findKeywords(topic);
  const article = await generateContent({
    topic,
    keywords,
    length: "2000 words",
    tone: "professional"
  });
  
  return publishToWebsite(article);
}`

  const articlePreviews = [
    {
      title: "10 Proven Strategies to Boost Your SEO Rankings in 2025",
      excerpt:
        "Discover the most effective techniques to improve your website's visibility and drive organic traffic through strategic SEO optimization...",
      tags: ["SEO", "Digital Marketing", "Content Strategy"],
    },
    {
      title: "How AI is Revolutionizing Content Creation for Small Businesses",
      excerpt:
        "Explore how artificial intelligence tools are enabling small businesses to create high-quality content at scale without breaking the budget...",
      tags: ["AI", "Small Business", "Content Marketing"],
    },
    {
      title: "The Ultimate Guide to E-commerce Product Descriptions That Convert",
      excerpt:
        "Learn how to craft compelling product descriptions that not only rank well in search engines but also drive conversions and sales...",
      tags: ["E-commerce", "Copywriting", "Conversion"],
    },
    {
      title: "7 Content Distribution Channels You're Probably Overlooking",
      excerpt:
        "Beyond your blog and social media, these powerful content distribution channels can help you reach new audiences and maximize ROI...",
      tags: ["Content Distribution", "Marketing", "ROI"],
    },
    {
      title: "Data-Driven Content: How to Use Analytics to Guide Your Strategy",
      excerpt:
        "Stop guessing what content to create. This comprehensive guide shows you how to leverage analytics to inform your content decisions...",
      tags: ["Analytics", "Data-Driven", "Content Planning"],
    },
  ]

  useEffect(() => {
    // Load remember me preference
    const rememberMeValue = localStorage.getItem("rememberMe")
    if (rememberMeValue) {
      setRememberMe(JSON.parse(rememberMeValue))
      const savedEmail = localStorage.getItem("savedEmail")
      if (savedEmail) setEmail(savedEmail)
    }

    // Handle redirect errors
    const errorParam = searchParams.get("error")
    const errorDescription = searchParams.get("error_description")
    if (errorParam) {
      setError(`Authentication error: ${errorDescription || errorParam}`)
    }

    // Check existing session
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        router.push("/dashboard")
      }
    }
    checkSession()

    // Start animation sequence
    startAnimationSequence()

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [searchParams, router, supabase.auth])

  const startAnimationSequence = () => {
    // Animation sequence timing
    const typeWriterSpeed = 50
    const stepDelay = 3000

    // Step 1: Website Analysis
    setAnimationStep(1)
    let currentText = ""
    const textToType = "Analyzing website content..."

    const typeWriter = (text: string, index: number) => {
      if (index < text.length) {
        currentText += text.charAt(index)
        setTypedText(currentText)
        setTimeout(() => typeWriter(text, index + 1), typeWriterSpeed)
      } else {
        // Move to step 2 after typing completes
        animationRef.current = setTimeout(() => {
          setAnimationStep(2)
          setShowTypingEffect(false)

          // Start typing code
          let codeIndex = 0
          const typeCode = () => {
            if (codeIndex < codeSnippet.length) {
              setCodeText(codeSnippet.substring(0, codeIndex + 1))
              codeIndex++
              setTimeout(typeCode, typeWriterSpeed / 2)
            } else {
              // Move to step 3 after code typing completes
              animationRef.current = setTimeout(() => {
                setAnimationStep(3)
                setShowGeneratedArticle(true)
                setCurrentArticleIndex(0)

                // Cycle through article examples
                const cycleArticles = () => {
                  setCurrentArticleIndex((prevIndex) => (prevIndex + 1) % articlePreviews.length)

                  // Continue cycling for a few iterations
                  if (currentArticleIndex < articlePreviews.length - 1) {
                    animationRef.current = setTimeout(cycleArticles, 2000)
                  } else {
                    // Move to step 4 (publishing) after showing all articles
                    animationRef.current = setTimeout(() => {
                      setAnimationStep(4)

                      // Progress animation
                      let progress = 0
                      const progressInterval = setInterval(() => {
                        progress += 5
                        setPublishProgress(progress)

                        if (progress >= 100) {
                          clearInterval(progressInterval)

                          // Reset animation after completion
                          animationRef.current = setTimeout(() => {
                            resetAnimation()
                          }, stepDelay)
                        }
                      }, 150)
                    }, 1000)
                  }
                }

                // Start cycling articles after a delay
                animationRef.current = setTimeout(cycleArticles, 2000)
              }, stepDelay)
            }
          }

          typeCode()
        }, stepDelay)
      }
    }

    // Start the typing animation
    typeWriter(textToType, 0)
  }

  const resetAnimation = () => {
    setAnimationStep(0)
    setTypedText("")
    setCodeText("")
    setShowGeneratedArticle(false)
    setPublishProgress(0)
    setShowTypingEffect(true)
    setCurrentArticleIndex(0)

    // Restart animation sequence
    animationRef.current = setTimeout(() => {
      startAnimationSequence()
    }, 1000)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    // Input validation
    if (!email || !password) {
      setError("Please enter both email and password")
      setIsLoading(false)
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      // Clean inputs
      const cleanEmail = email.trim().toLowerCase()
      const cleanPassword = password.trim()

      // Attempt to sign in with auth.users
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      })

      if (authError) {
        console.error("Supabase auth error:", authError.code, authError.message)
        switch (authError.code) {
          case "invalid_credentials":
            throw new Error("Invalid email or password. Please try again.")
          case "user_not_confirmed":
            throw new Error("Please confirm your email address first.")
          case "not_activated":
            throw new Error("Your account is not activated.")
          default:
            throw new Error(authError.message || "Authentication failed. Please try again.")
        }
      }

      if (!authData.user) {
        throw new Error("No user data returned from authentication")
      }

      // Optional: Fetch additional data from userssignuped table
      const { data: profileData, error: profileError } = await supabase
        .from("userssignuped")
        .select("username")
        .eq("id", authData.user.id)
        .single()

      if (profileError) {
        console.error("Error fetching profile from userssignuped:", profileError.message)
        // Not critical for login, so we can proceed even if this fails
      } else if (profileData) {
        console.log("User profile fetched:", profileData.username)
        // You can store this in localStorage or context if needed
      }

      // Handle remember me functionality
      if (rememberMe) {
        localStorage.setItem("rememberMe", JSON.stringify(true))
        localStorage.setItem("savedEmail", cleanEmail)
      } else {
        localStorage.removeItem("rememberMe")
        localStorage.removeItem("savedEmail")
      }

      // Successful login
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  return (
    <div className={`${inter.className} flex h-screen`}>
      {/* Left side - Dark background with animation */}
      <div className="hidden md:flex md:w-1/2 bg-black text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Animation Container */}
        <div className="absolute inset-0 flex items-center justify-center p-12 pointer-events-none">
          <div className="w-full max-w-md">
            {/* Animation Content */}
            <div className="space-y-8">
              {/* Step 1: Website Analysis */}
              <div
                className={`transition-all duration-500 ${animationStep === 1 ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-10"}`}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#294df6]/20 flex items-center justify-center mr-3">
                    <Globe className="h-5 w-5 text-[#294df6]" />
                  </div>
                  <h3 className="text-xl font-medium text-white">Website Analysis</h3>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>

                  {showTypingEffect && (
                    <div className="font-mono text-sm text-green-400">
                      {typedText}
                      <span className="animate-pulse">|</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Code Generation */}
              <div
                className={`transition-all duration-500 ${animationStep === 2 ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"}`}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                    <Code className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white">Content Generation</h3>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>

                  <pre className="font-mono text-xs text-blue-400 overflow-x-auto">
                    {codeText}
                    <span className="animate-pulse">|</span>
                  </pre>
                </div>
              </div>

              {/* Step 3: Article Preview */}
              <div
                className={`transition-all duration-500 ${animationStep === 3 ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"}`}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                    <FileText className="h-5 w-5 text-green-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white">Article Generated</h3>
                </div>

                {showGeneratedArticle && (
                  <div className="bg-white rounded-lg p-4 text-black">
                    <h4 className="font-bold text-lg mb-2 text-gray-900">
                      {articlePreviews[currentArticleIndex].title}
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">{articlePreviews[currentArticleIndex].excerpt}</p>
                    <div className="flex flex-wrap gap-2">
                      {articlePreviews[currentArticleIndex].tags.map((tag, index) => (
                        <span key={index} className="bg-[#294df6]/10 text-[#294df6] text-xs px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 4: Publishing */}
              <div
                className={`transition-all duration-500 ${animationStep === 4 ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"}`}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center mr-3">
                    <ArrowRight className="h-5 w-5 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white">Publishing to Blog</h3>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                  <div className="w-full bg-gray-800 h-2 rounded-full mb-2">
                    <div
                      className="bg-gradient-to-r from-[#294df6] to-purple-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${publishProgress}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Publishing article...</span>
                    <span>{publishProgress}%</span>
                  </div>

                  {publishProgress >= 100 && (
                    <div className="flex items-center mt-2 text-green-400">
                      <Check className="h-4 w-4 mr-1" />
                      <span className="text-sm">Published successfully!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 w-40 h-40 bg-[#294df6] rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-10 w-60 h-60 bg-purple-600 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 group transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-gray-500">Sign in to continue to your dashboard</p>
          </div>

          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-md mb-4 flex items-start"
              role="alert"
            >
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#294fd6] focus:border-[#294fd6]"
                placeholder="name@example.com"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full px-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#294fd6] focus:border-[#294fd6]"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#294fd6] focus:ring-[#294fd6] border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/reset-password/request" className="font-medium text-[#294fd6] hover:text-[#1e3eb8]">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2 px-4 bg-[#294fd6] hover:bg-[#1e3eb8] text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#294fd6] disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-[#294fd6] hover:text-[#1e3eb8]">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
