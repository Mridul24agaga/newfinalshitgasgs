"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utitls/supabase/client"
import { Eye, EyeOff, AlertCircle, FileText, ArrowRight, Check, Code, Globe } from "lucide-react"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
})

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
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
      title: "10 Proven Strategies to Boost Your SEO Rankings in 2024",
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
    // Start animation sequence
    startAnimationSequence()

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [])

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

  const passwordStrength = (password: string) => {
    let strength = 0
    if (password.match(/[a-z]+/)) strength += 1
    if (password.match(/[A-Z]+/)) strength += 1
    if (password.match(/[0-9]+/)) strength += 1
    if (password.match(/[$@#&!]+/)) strength += 1
    return strength
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = (formData.get("email") as string)?.trim().toLowerCase()
    const password = (formData.get("password") as string)?.trim()
    const username = (formData.get("username") as string)?.trim()

    // Input validation
    if (!email || !password || !username) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    if (passwordStrength(password) < 3) {
      setError("Password must include uppercase, lowercase, numbers, and special characters")
      setIsLoading(false)
      return
    }

    try {
      // First, check if the username already exists to avoid database constraint errors
      const { data: existingUsers, error: checkError } = await supabase
        .from("userssignuped")
        .select("username")
        .eq("username", username)
        .limit(1)

      if (checkError) {
        console.error("Error checking username:", checkError)
      } else if (existingUsers && existingUsers.length > 0) {
        setError("Username already taken. Please choose another one.")
        setIsLoading(false)
        return
      }

      // Step 1: Sign up with Supabase Auth - MODIFIED to use a simpler approach
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        console.error("Supabase auth error:", authError.code, authError.message)
        switch (authError.code) {
          case "user_already_exists":
            throw new Error("This email is already registered. Please try logging in.")
          case "weak_password":
            throw new Error("Password is too weak. Please use a stronger password.")
          case "invalid_email":
            throw new Error("Please enter a valid email address.")
          default:
            throw new Error(authError.message || "Failed to create account. Please try again.")
        }
      }

      if (!authData.user) {
        throw new Error("No user data returned from signup")
      }

      const userId = authData.user.id

      // Step 2: Insert user data into userssignuped table
      const { error: insertError } = await supabase.from("userssignuped").insert({
        id: userId,
        username,
        email,
        created_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("Error inserting into userssignuped:", insertError)
        // Continue anyway - we can update the profile later
      }

      // Step 3: Update user metadata separately
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          username: username,
        },
      })

      if (updateError) {
        console.error("Error updating user metadata:", updateError)
      }

      // Step 4: Handle redirect based on email confirmation
      if (authData.session === null) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`)
      } else {
        router.push("/onboarding")
      }
    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "An unexpected error occurred during signup. Please try again.")
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
                className={`transition-all duration-500 ${
                  animationStep === 1 ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-10"
                }`}
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
                className={`transition-all duration-500 ${
                  animationStep === 2 ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
                }`}
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
                className={`transition-all duration-500 ${
                  animationStep === 3 ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
                }`}
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
                className={`transition-all duration-500 ${
                  animationStep === 4 ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
                }`}
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

      {/* Right side - Sign up form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-gray-500">You are just 2 clicks away from creating your blogging account!</p>
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
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#294fd6] focus:border-[#294fd6]"
                placeholder="Choose a username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#294fd6] focus:border-[#294fd6]"
                placeholder="name@example.com"
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
                  autoComplete="new-password"
                  required
                  className="w-full px-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#294fd6] focus:border-[#294fd6]"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-gray-700">
                  forgot password?
                </Link>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`h-1.5 flex-1 rounded-full ${
                    passwordStrength(password) >= 1 ? "bg-red-500" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`h-1.5 flex-1 rounded-full ${
                    passwordStrength(password) >= 2 ? "bg-yellow-500" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`h-1.5 flex-1 rounded-full ${
                    passwordStrength(password) >= 3 ? "bg-green-500" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`h-1.5 flex-1 rounded-full ${
                    passwordStrength(password) >= 4 ? "bg-green-700" : "bg-gray-200"
                  }`}
                ></div>
              </div>
              <div className="text-xs text-gray-600">
                Password strength: {["Weak", "Fair", "Good", "Strong"][passwordStrength(password) - 1] || "Very Weak"}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-[#294fd6] hover:bg-[#1e3eb8] text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#294fd6] disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Creating account..." : "Sign up with Email"}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-[#294fd6] hover:text-[#1e3eb8]">
                  Sign in
                </Link>
              </p>
            </div>
          </form>

          <div className="text-center text-xs text-gray-500">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="text-[#294fd6] hover:text-[#1e3eb8]">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#294fd6] hover:text-[#1e3eb8]">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  )
}
