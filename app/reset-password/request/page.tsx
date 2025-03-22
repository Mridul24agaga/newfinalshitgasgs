"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/utitls/supabase/client"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Mail, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Saira } from "next/font/google"

// Initialize the Saira font
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-saira",
})

export default function RequestResetPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Use the current origin for the redirect
      const origin = window.location.origin
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-password/update`,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Password reset error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`${saira.className} min-h-screen flex flex-col bg-gray-50`}>
      <div className="flex-1 flex flex-col p-6 md:p-8 lg:p-10">
        <Link
          href="/login"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 group transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          <span>Back to login</span>
        </Link>

        <div className="w-full max-w-md mx-auto flex flex-col justify-center flex-grow">
          <div className="flex items-center justify-center mb-6">
            <Image src="/logo.png" alt="Blogosocial Logo" width={140} height={48} className="h-auto" priority />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Reset your password</h2>
          <p className="text-gray-600 mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-4 flex items-start"
              role="alert"
            >
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h3>
              <p className="text-gray-600 mb-4">
                We've sent a password reset link to <span className="font-medium">{email}</span>. Please check your
                inbox and follow the instructions to reset your password.
              </p>
              <p className="text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => {
                    setSuccess(false)
                    setEmail("")
                  }}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  try again
                </button>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="name@example.com"
                    aria-label="Email Address"
                    disabled={isLoading}
                  />
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
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-orange-500 hover:text-orange-600 transition-colors">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

