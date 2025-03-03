"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utitls/supabase/client"
import { ArrowLeft, Star, Users, Zap } from "lucide-react"

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState("")
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
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const username = formData.get("username") as string

    if (passwordStrength(password) < 3) {
      setError("Password is too weak. Please include uppercase, lowercase, numbers, and special characters.")
      setIsLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          username,
        },
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    setError("Sign up successful! Please check your email to verify your account.")
  }

  async function handleGoogleSignUp() {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Section */}
      <div className="flex-1 flex flex-col p-8 lg:p-12 xl:p-16">
        <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-gray-900 mb-12">
          <ArrowLeft className="w-5 h-5" />
          <span className="ml-2">Back</span>
        </button>

        <div className="w-full max-w-md mx-auto flex flex-col justify-center flex-grow">
          <div className="flex items-center justify-center mb-12 bg-orange-500 w-12 h-12 rounded-lg">
            <Image src="/placeholder.svg" alt="Blogosocial Logo" width={48} height={48} className="rounded-lg" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
          <p className="text-gray-600 mb-8">Join Blogosocial and start your blogging journey!</p>

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {isLoading ? "Signing up..." : "Sign up with Google"}
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Choose a username"
                aria-label="Username"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter your email"
                aria-label="Email Address"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Create a strong password"
                aria-label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`h-2 flex-1 rounded-full ${passwordStrength(password) >= 1 ? "bg-red-500" : "bg-gray-200"}`}
              ></div>
              <div
                className={`h-2 flex-1 rounded-full ${passwordStrength(password) >= 2 ? "bg-yellow-500" : "bg-gray-200"}`}
              ></div>
              <div
                className={`h-2 flex-1 rounded-full ${passwordStrength(password) >= 3 ? "bg-green-500" : "bg-gray-200"}`}
              ></div>
              <div
                className={`h-2 flex-1 rounded-full ${passwordStrength(password) >= 4 ? "bg-green-700" : "bg-gray-200"}`}
              ></div>
            </div>

            <div className="text-sm text-gray-600">
              Password strength: {["Weak", "Fair", "Good", "Strong"][passwordStrength(password) - 1] || "Very Weak"}
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="font-medium text-orange-500 hover:text-orange-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-orange-500 hover:text-orange-600">
              Privacy Policy
            </Link>
            .
          </p>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-orange-500 hover:text-orange-600">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:block lg:flex-1">
        <div className="h-full bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 p-12 xl:p-16 flex flex-col justify-center text-white">
          <div className="mb-12">
            <Star className="w-12 h-12 text-yellow-300" />
          </div>
          <h2 className="text-4xl font-bold mb-6">Start Your Blogging Journey with Blogosocial</h2>
          <p className="text-xl mb-12 text-white/90">
            Join thousands of bloggers and take your content creation to the next level.
          </p>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Zap className="w-8 h-8 text-yellow-300" />
              <span className="text-lg">AI-powered content suggestions</span>
            </div>
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-yellow-300" />
              <span className="text-lg">Collaborate with other bloggers</span>
            </div>
            <div className="flex items-center gap-4">
              <Star className="w-8 h-8 text-yellow-300" />
              <span className="text-lg">Advanced analytics and insights</span>
            </div>
          </div>
          <div className="mt-12 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white/50 bg-white/20" />
              ))}
            </div>
            <span className="text-lg font-semibold">Join 40,000+ satisfied bloggers</span>
          </div>
        </div>
      </div>
    </div>
  )
}

