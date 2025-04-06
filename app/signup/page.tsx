"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utitls/supabase/client"
import { ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Saira } from "next/font/google"

const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-saira",
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

  // Rest of the component remains the same
  return (
    <div className={`${saira.className} h-screen flex bg-gray-50 overflow-hidden`}>
      {/* Component UI remains unchanged */}
      <div className="flex-1 flex flex-col p-6 md:p-8 lg:p-10">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 group transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        <div className="w-full max-w-md mx-auto flex flex-col justify-center flex-grow">
          <div className="flex items-center justify-center mb-5">
            <Image src="/logo.png" alt="Blogosocial Logo" width={140} height={48} className="h-auto" priority />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Your Account</h2>
          <p className="text-gray-600 mb-4">Join Blogosocial and start your blogging journey!</p>

          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-xl mb-4 flex items-start"
              role="alert"
            >
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="Choose a username"
                aria-label="Username"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="Enter your email"
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
                  autoComplete="new-password"
                  required
                  className="w-full px-4 pr-11 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder="Create a strong password"
                  aria-label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-600">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="font-medium text-orange-500 hover:text-orange-600">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-orange-500 hover:text-orange-600">
              Privacy Policy
            </Link>
            .
          </div>

          <p className="mt-3 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-orange-500 hover:text-orange-600 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:flex-1">
        {/* Sidebar content remains unchanged */}
        <div className="h-full bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 p-8 flex flex-col justify-center text-white relative overflow-hidden">
          {/* Sidebar content */}
        </div>
      </div>
    </div>
  )
}

