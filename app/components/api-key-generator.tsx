"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utitls/supabase/client"

export default function ApiKeyGenerator() {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  // Get the current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        setUser(user)
      } catch (err) {
        console.error("Error fetching user:", err)
        setError("Failed to fetch user information")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [supabase])

  const generateKey = async () => {
    if (!user) {
      setError("You must be logged in to generate an API key")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/key/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate API key")
      }

      setApiKey(data.apiKey)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">Loading...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Generate API Key</h2>

      {user ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Logged in as: {user.email}</p>

          <button
            onClick={generateKey}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            {loading ? "Generating..." : "Generate New API Key"}
          </button>

          {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

          {apiKey && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <p className="font-medium mb-2">Your API Key:</p>
              <div className="flex items-center">
                <code className="bg-gray-200 px-2 py-1 rounded text-sm flex-1 overflow-x-auto">{apiKey}</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(apiKey)
                    alert("API key copied to clipboard!")
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  Copy
                </button>
              </div>
              <p className="text-red-500 text-sm mt-2">Save this key! You'll need it to access your blogs.</p>
            </div>
          )}
        </div>
      ) : (
        <p>Please log in to generate an API key.</p>
      )}
    </div>
  )
}

