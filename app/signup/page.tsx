"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utitls/supabase/client"
import { ArrowLeft, Star, Users, Zap, Eye, EyeOff, AlertCircle, BarChart3 } from "lucide-react"
import { Saira } from "next/font/google"

// Initialize the Saira font
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={`${saira.className} h-screen flex bg-gray-50 overflow-hidden`}>
      {/* Left Section */}
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

      {/* Right Section - Enhanced */}
      <div className="hidden lg:block lg:flex-1">
        <div className="h-full bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 p-8 flex flex-col justify-center text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-orange-400/30 to-transparent rounded-full -translate-y-1/3 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-orange-800/40 to-transparent rounded-full translate-y-1/3 -translate-x-1/3"></div>

          {/* Black accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>

          <div className="relative z-10">
            <div className="mb-8">
              <div className="bg-black/20 backdrop-blur-sm p-3 rounded-lg inline-flex shadow-lg border-2 border-white/30">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-2xl xl:text-3xl font-bold mb-4 leading-tight">
              Start Your <span className="text-black">Blogging</span> Journey
            </h2>
            <p className="text-base xl:text-lg mb-6 text-white/80 leading-relaxed">
              Join thousands of bloggers and take your content to the next level.
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
                  <p className="text-sm text-white/70">Work together seamlessly</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-black/10 backdrop-blur-sm p-3 rounded-lg border-l-4 border-black">
                <div className="bg-white/10 p-1.5 rounded-md border border-white/30">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Analytics Dashboard</h3>
                  <p className="text-sm text-white/70">Track your content performance</p>
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

