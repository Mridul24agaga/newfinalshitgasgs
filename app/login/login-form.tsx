"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utitls/supabase/client"
import { ArrowLeft, Star, Users, Zap } from "lucide-react"

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const rememberMeValue = localStorage.getItem("rememberMe")
    if (rememberMeValue) {
      setRememberMe(JSON.parse(rememberMeValue))
    }

    const error = searchParams.get("error")
    const errorDescription = searchParams.get("error_description")
    if (error) {
      setError(`Authentication error: ${errorDescription || error}`)
    }

    // Check if the user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/dashboard")
      }
    })
  }, [searchParams, router, supabase.auth])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    if (rememberMe) {
      localStorage.setItem("rememberMe", JSON.stringify(true))
    } else {
      localStorage.removeItem("rememberMe")
    }

    router.push("/dashboard")
  }

  async function handleGoogleSignIn() {
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    }
    // If successful, the user will be redirected to the callback URL
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
          <div className="flex items-center justify-center mb-12">
            <Image src="/logo.png" alt="Blogosocial Logo" width={120} height={48} className="h-auto" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Blogosocial</h2>
          <p className="text-gray-600 mb-8">Unlock powerful tools to boost your blogging!</p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {!showEmailForm ? (
            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
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
                {isLoading ? "Signing in..." : "Continue with Google"}
              </button>
              <button
                onClick={() => setShowEmailForm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Continue with Email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your password"
                  aria-label="Password"
                />
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
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-orange-500 hover:text-orange-600">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {isLoading ? "Signing in..." : "Log in"}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-orange-500 hover:text-orange-600">
              Sign up
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
          <h2 className="text-4xl font-bold mb-6">Elevate Your Blogging Game with Blogosocial</h2>
          <p className="text-xl mb-12 text-white/90">
            Unlock a world of powerful tools and features designed to take your content to the next level.
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
              <div className="relative w-10 h-10 rounded-full border-2 border-white/50 overflow-hidden">
                <Image
                  src="/abc3.jpg"
                  alt="User 1"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="relative w-10 h-10 rounded-full border-2 border-white/50 overflow-hidden">
                <Image
                  src="/abc5.jpg"
                  alt="User 2"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="relative w-10 h-10 rounded-full border-2 border-white/50 overflow-hidden">
                <Image
                  src="/abc6.jpg"
                  alt="User 3"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="relative w-10 h-10 rounded-full border-2 border-white/50 overflow-hidden">
                <Image
                  src="/abc2.jpg"
                  alt="User 4"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="relative w-10 h-10 rounded-full border-2 border-white/50 overflow-hidden">
                <Image
                  src="/abc1.jpg"
                  alt="User 5"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            </div>
            <span className="text-lg font-semibold">Join 40,000+ satisfied bloggers</span>
          </div>
        </div>
      </div>
    </div>
  )
}

