"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, CheckCircle, Send } from "lucide-react"

export default function TestEmailPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    error?: string
  } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "An error occurred",
        error: error.toString(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Test Brevo Email Sending</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#294fd6] focus:border-[#294fd6]"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center py-2 px-4 bg-[#294fd6] hover:bg-[#1e3eb8] text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#294fd6] disabled:opacity-50 transition-colors"
        >
          {isLoading ? (
            "Sending..."
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Test Email
            </>
          )}
        </button>
      </form>

      {result && (
        <div className={`mt-4 p-4 rounded-md ${result.success ? "bg-green-50" : "bg-red-50"}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${result.success ? "text-green-800" : "text-red-800"}`}>
                {result.success ? "Success" : "Error"}
              </h3>
              <div className={`mt-2 text-sm ${result.success ? "text-green-700" : "text-red-700"}`}>
                <p>{result.message}</p>
                {result.error && (
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">{result.error}</pre>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500">
        <p>This page allows you to test the Brevo email sending functionality.</p>
        <p className="mt-2">
          Make sure your <code className="bg-gray-100 px-1 py-0.5 rounded">BREVO_API_KEY</code> environment variable is
          set correctly.
        </p>
      </div>
    </div>
  )
}
