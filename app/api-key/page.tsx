"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utitls/supabase/client"
import { useRouter } from "next/navigation"
import { ArrowLeft, Copy, Key, RefreshCw } from "lucide-react"
import { AppSidebar } from "../components/sidebar"

export default function ApiKeyManager() {
  const [user, setUser] = useState<any>(null)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const router = useRouter()

  // Check for authentication on component mount and fetch existing API key
  useEffect(() => {
    const checkAuthAndFetchKey = async () => {
      setIsLoading(true)
      const supabase = createClient()

      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error || !user) {
          console.error("Authentication error:", error?.message)
          router.push("/login")
          return
        }

        setUser(user)

        // Fetch the user's API key from the database
        const { data: apiKeyData, error: apiKeyError } = await supabase
          .from("api_keys")
          .select("api_key")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (apiKeyData && !apiKeyError) {
          setApiKey(apiKeyData.api_key)
          // Also store in localStorage for convenience
          localStorage.setItem("apiKey", apiKeyData.api_key)
        } else if (apiKeyError && apiKeyError.code !== "PGRST116") {
          // PGRST116 is "no rows returned" which is expected if user has no key yet
          console.error("Error fetching API key:", apiKeyError)
        }
      } catch (err) {
        console.error("Error checking auth:", err)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndFetchKey()
  }, [router])

  // Function to generate a new API key
  const generateApiKey = async () => {
    setIsGenerating(true)
    setError(null)
    setIsCopied(false)

    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error("No active session found. Please log in again.")
      }

      const response = await fetch("/api/generate-api-key", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate API key")
      }

      const data = await response.json()
      setApiKey(data.api_key)

      // Store the API key in localStorage for convenience
      localStorage.setItem("apiKey", data.api_key)
    } catch (err) {
      console.error("Error generating API key:", err)
      setError(err instanceof Error ? err.message : "Something went wrong!")
    } finally {
      setIsGenerating(false)
    }
  }

  // Function to copy API key to clipboard
  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 3000)
    }
  }

  // Function to get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return "U"
    return user.email.split("@")[0].substring(0, 2).toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AppSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                API Key Manager
              </h1>
              <p className="text-gray-500 mt-1">Generate and manage your API keys</p>
            </div>
            <button
              onClick={() => router.back()}
              className="mt-4 md:mt-0 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </button>
          </div>

          {!user ? (
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold">Authentication Required</h2>
                <p className="text-gray-500 text-sm mt-1">Please sign in to manage your API keys.</p>
              </div>
              <div className="p-6 pt-0">
                <button
                  onClick={() => router.push("/login")}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* User Info */}
              <div className="bg-white rounded-xl overflow-hidden border border-gray-100 mb-6">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <h2 className="text-xl font-semibold text-gray-900">User Information</h2>
                  <p className="text-gray-500 text-sm mt-1">Your account details</p>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-semibold text-white">
                      {getUserInitials()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{user.email}</h3>
                      <p className="text-gray-500 text-sm">User ID: {user.id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Key Section */}
              <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <h2 className="text-xl font-semibold text-gray-900">API Key</h2>
                  <p className="text-gray-500 text-sm mt-1">Manage your API access credentials</p>
                </div>

                <div className="p-6">
                  {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                      <p className="font-medium">Error:</p>
                      <p>{error}</p>
                    </div>
                  )}

                  {apiKey ? (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your API Key</label>
                      <div className="flex items-center">
                        <div className="flex-grow bg-gray-50 border border-gray-300 rounded-md p-3 font-mono text-sm break-all">
                          {apiKey}
                        </div>
                        <button
                          onClick={copyToClipboard}
                          className="ml-3 p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                          aria-label="Copy to clipboard"
                        >
                          <Copy className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                      {isCopied && <p className="mt-2 text-sm text-green-600">Copied to clipboard!</p>}
                      <p className="mt-4 text-sm text-gray-600">
                        Keep this key secure. It provides access to your API resources.
                      </p>
                    </div>
                  ) : (
                    <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Key className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm">You don't have an API key yet. Generate one to access the API.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={generateApiKey}
                      disabled={isGenerating}
                      className="px-4 py-2 bg-[#294fd6] text-white rounded-md hover:bg-[#1e3ca8] disabled:bg-indigo-300 transition-colors flex items-center"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : apiKey ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Regenerate API Key
                        </>
                      ) : (
                        <>
                          <Key className="mr-2 h-4 w-4" />
                          Generate API Key
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">How to use your API key</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Include your API key in the request headers when making API calls:
                  </p>
                  <div className="bg-gray-100 p-3 rounded-md overflow-x-auto">
                    <pre className="text-xs text-gray-800">
                      <code>{`fetch("https://www.getmoreseo.org/api/fetch-blogs", {
  method: "GET",
  headers: {
    "x-api-key": "${apiKey || "YOUR_API_KEY"}",
    "Accept": "application/json"
  }
})`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
