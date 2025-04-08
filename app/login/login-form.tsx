"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utitls/supabase/client"
import { ArrowLeft, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"
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
    <div className={`${inter.className} flex h-screen`}>
      {/* Left side - Dark background with testimonial */}
      <div className="hidden md:flex md:w-1/2 bg-black text-white flex-col justify-between p-12">
        <div>
          <h2 className="text-xl font-semibold">GetMoreSeo</h2>
        </div>
        <div className="space-y-6">
          <p className="text-2xl font-medium leading-relaxed">
          Generate, publish, syndicate and update articles automatically.


          </p>
         
        </div>
        <div></div> {/* Spacer */}
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

