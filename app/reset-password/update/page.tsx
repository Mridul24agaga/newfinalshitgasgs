"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/utitls/supabase/client"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle, Loader2, Lock } from "lucide-react"
import { Saira } from "next/font/google"

// Initialize the Saira font
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-saira",
})

export default function UpdatePassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Check if user has a valid session with recovery token
  const checkSession = async () => {
    setIsCheckingSession(true)
    try {
      // Check if we have a code parameter in the URL
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href)
        const code = url.searchParams.get("code")

        if (code) {
          console.log("Found code parameter in URL, attempting to use it")
          // We have a code in the URL, try to exchange it for a session
          try {
            // Try to exchange the code for a session
            const { error } = await supabase.auth.exchangeCodeForSession(code)

            if (error) {
              console.error("Code exchange error:", error)
              setError("Invalid or expired reset link. Please request a new one.")
              setIsValidSession(false)
            } else {
              console.log("Successfully exchanged code for session")
              setIsValidSession(true)
            }
          } catch (exchangeError) {
            console.error("Error exchanging code:", exchangeError)
            setError("Failed to process your reset link. Please request a new one.")
            setIsValidSession(false)
          }

          setIsCheckingSession(false)
          return
        }
      }

      // If no code parameter, check for an existing session
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Session error:", error)
        setError("Invalid or expired session. Please request a new password reset link.")
        setIsValidSession(false)
        return
      }

      if (data.session) {
        console.log("Valid session found")
        setIsValidSession(true)
      } else {
        console.log("No session found")

        // Check if we have a hash in the URL (we're coming from email link)
        if (typeof window !== "undefined") {
          const hash = window.location.hash
          if (hash && hash.includes("access_token")) {
            console.log("Found access token in URL, attempting to use it")
            // We have a token in the URL but no session yet
            // This can happen on the first load after clicking the email link
            setIsValidSession(true) // Allow the user to proceed
          } else {
            setError("No active session found. Please request a new password reset link.")
            setIsValidSession(false)
          }
        }
      }
    } catch (err) {
      console.error("Error checking session:", err)
      setError("An error occurred while checking your session. Please try again.")
      setIsValidSession(false)
    } finally {
      setIsCheckingSession(false)
    }
  }

  useEffect(() => {
    checkSession()
  }, [])

  const passwordStrength = (password: string) => {
    let strength = 0
    if (password.match(/[a-z]+/)) strength += 1
    if (password.match(/[A-Z]+/)) strength += 1
    if (password.match(/[0-9]+/)) strength += 1
    if (password.match(/[$@#&!]+/)) strength += 1
    return strength
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    if (passwordStrength(password) < 3) {
      setError("Password is too weak. Please include uppercase, lowercase, numbers, and special characters.")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Password update error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingSession) {
    return (
      <div className={`${saira.className} min-h-screen flex items-center justify-center bg-gray-50`}>
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying your session...</p>
        </div>
      </div>
    )
  }

  if (!isValidSession && !success) {
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

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Invalid Reset Link</h3>
              <p className="text-gray-600 mb-4">
                {error || "Your password reset link has expired. Please request a new one."}
              </p>
              <Link
                href="/reset-password/request"
                className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Request New Link
              </Link>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/login" className="font-medium text-orange-500 hover:text-orange-600 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
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

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create new password</h2>
          <p className="text-gray-600 mb-6">Your new password must be different from previously used passwords.</p>

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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Reset Successful</h3>
              <p className="text-gray-600 mb-4">
                Your password has been reset successfully. You will be redirected to the login page in a few seconds.
              </p>
              <div className="mt-4">
                <Link
                  href="/login"
                  className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    className="w-full pl-10 pr-11 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="Create a strong password"
                    aria-label="New Password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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

              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    className={`w-full pl-10 pr-11 py-2.5 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                      confirmPassword && password !== confirmPassword ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Confirm your password"
                    aria-label="Confirm Password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || (confirmPassword.length > 0 && password !== confirmPassword)}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

