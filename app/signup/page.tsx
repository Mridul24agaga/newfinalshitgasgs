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

    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      })

      if (error) {
        throw error
      }

      // If sign-up is successful, directly sign in the user
      if (data.user) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          throw signInError
        }

        // Redirect to dashboard or home page after successful sign-in
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up")
      setIsLoading(false)
    }
  }

  async function handleGoogleSignUp() {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/dashboard`, // Direct to dashboard instead of auth callback
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
          <div className="flex items-center justify-center mb-12">
            <Image src="/logo.png" alt="Blogosocial Logo" width={120} height={48} className="h-auto" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
          <p className="text-gray-600 mb-8">Join Blogosocial and start your blogging journey!</p>

          <div className="space-y-4">
            
            
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

