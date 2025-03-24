"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utitls/supabase/client" // Fixed typo in import path
import { ArrowLeft, Star, Users, Zap, Eye, EyeOff, AlertCircle, Loader2, BarChart3 } from "lucide-react"
import { Saira } from "next/font/google"

const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-saira",
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
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push("/dashboard")
      }
    }
    checkSession()
  }, [searchParams, router, supabase.auth])

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
    <div className={`${saira.className} h-screen flex bg-gray-50 overflow-hidden`}>
      <div className="flex-1 flex flex-col p-6 md:p-8 lg:p-10">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 group transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        <div className="w-full max-w-md mx-auto flex flex-col justify-center flex-grow">
          <div className="flex items-center justify-center mb-6">
            <Image src="/logo.png" alt="Blogosocial Logo" width={140} height={48} className="h-auto" priority />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600 mb-6">Sign in to continue to your dashboard</p>

          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-4 flex items-start"
              role="alert"
            >
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="name@example.com"
                aria-label="Email Address"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1">
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
                  className="w-full px-4 pr-11 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder="••••••••"
                  aria-label="Password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/reset-password/request"
                  className="font-medium text-orange-500 hover:text-orange-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
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

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-orange-500 hover:text-orange-600 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:flex-1">
        <div className="h-full bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 p-8 flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-orange-400/30 to-transparent rounded-full -translate-y-1/3 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-orange-800/40 to-transparent rounded-full translate-y-1/3 -translate-x-1/3"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>

          <div className="relative z-10">
            <div className="mb-8">
              <div className="bg-black/20 backdrop-blur-sm p-3 rounded-lg inline-flex shadow-lg border-2 border-white/30">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-2xl xl:text-3xl font-bold mb-4 leading-tight">
              Professional <span className="text-black">Blogging</span> Platform
            </h2>
            <p className="text-base xl:text-lg mb-6 text-white/80 leading-relaxed">
              Enterprise-grade tools to elevate your content strategy.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-4 bg-black/10 backdrop-blur-sm p-3 rounded-lg border-l-4 border-black">
                <div className="bg-white/10 p-1.5 rounded-md border border-white/30">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Professional SEO Writers</h3>
                  <p className="text-sm text-white/70">Expert writers work for you</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-black/10 backdrop-blur-sm p-3 rounded-lg border-l-4 border-black">
                <div className="bg-white/10 p-1.5 rounded-md border border-white/30">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Team Collaboration</h3>
                  <p className="text-sm text-white/70">Seamless workflow for content teams</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-black/10 backdrop-blur-sm p-3 rounded-lg border-l-4 border-black">
                <div className="bg-white/10 p-1.5 rounded-md border border-white/30">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Analytics Dashboard</h3>
                  <p className="text-sm text-white/70">Data-driven content optimization</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                <h3 className="text-lg font-bold text-white mb-1">"Autopilot Blogging That Works!"</h3>
                <p className="text-white/80 text-sm mb-3">
                  "I wanted to grow my blog but didn't have time. BlogoSocial took over and now I get custom SEO
                  keywords, targeted keywords, and an advanced content plan—without lifting a finger. It's 100%
                  autopilot, and my traffic is soaring!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-white/50">
                    <Image src="/abc5.jpg" alt="Testimonial" width={40} height={40} className="object-cover" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Anjali Singh</p>
                    <p className="text-white/60 text-xs">Business Consultant</p>
                  </div>
                  <div className="ml-auto flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 text-white" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="relative w-8 h-8 rounded-full border-2 border-white/70 overflow-hidden">
                    <Image src="/abc3.jpg" alt="User 1" width={32} height={32} className="object-cover" />
                  </div>
                  <div className="relative w-8 h-8 rounded-full border-2 border-white/70 overflow-hidden">
                    <Image src="/abc2.jpg" alt="User 2" width={32} height={32} className="object-cover" />
                  </div>
                  <div className="relative w-8 h-8 rounded-full border-2 border-white/70 overflow-hidden">
                    <Image src="/abc6.jpg" alt="User 3" width={32} height={32} className="object-cover" />
                  </div>
                  <div className="relative w-8 h-8 rounded-full border-2 border-white/70 overflow-hidden">
                    <Image src="/abc1.jpg" alt="User 4" width={32} height={32} className="object-cover" />
                  </div>
                </div>
                <p className="text-sm text-white/80">Join 40,000+ professionals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}