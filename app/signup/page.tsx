"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utitls/supabase/client"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
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

      {/* Right side - Sign up form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-gray-500">
              You are just 2 clicks away from creating your blogging account!
            </p>
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

            {/* Google sign-in removed as requested */}

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

