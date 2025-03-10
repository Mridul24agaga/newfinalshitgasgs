"use client"

import { useState, useEffect } from "react"
import { Copy, Trash2, AlertCircle } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

// Define types
interface ApiKey {
  id: string
  key: string
  name: string
  created_at: string
  expires_at: string | null
  last_used_at: string | null
}

interface Blog {
  id: string
  title: string
  content: string
  user_id: string
  created_at: string
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [newKeyName, setNewKeyName] = useState("")
  const [loading, setLoading] = useState(true)
  const [creatingKey, setCreatingKey] = useState(false)
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)
  const [testApiKey, setTestApiKey] = useState("")
  const [testResults, setTestResults] = useState<Blog[] | null>(null)
  const [testError, setTestError] = useState<string | null>(null)
  const [testLoading, setTestLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("manage")

  // Initialize Supabase client
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    // Check for user session on load
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)

      if (session?.user) {
        fetchApiKeys()
      } else {
        setLoading(false)
      }
    }

    checkUser()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        fetchApiKeys()
      } else {
        setApiKeys([])
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchApiKeys = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/keys")

      if (!response.ok) {
        throw new Error("Failed to fetch API keys")
      }

      const data = await response.json()
      setApiKeys(data.apiKeys || [])
    } catch (error) {
      console.error("Error fetching API keys:", error)
    } finally {
      setLoading(false)
    }
  }

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      alert("Please enter a name for your API key")
      return
    }

    try {
      setCreatingKey(true)
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newKeyName }),
      })

      if (!response.ok) {
        throw new Error("Failed to create API key")
      }

      const data = await response.json()
      setNewlyCreatedKey(data.apiKey.key)
      setShowDialog(true)
      setNewKeyName("")
      fetchApiKeys()
    } catch (error) {
      console.error("Error creating API key:", error)
      alert("Error creating API key. Please try again.")
    } finally {
      setCreatingKey(false)
    }
  }

  const deleteApiKey = async (id: string) => {
    if (!confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete API key")
      }

      fetchApiKeys()
    } catch (error) {
      console.error("Error deleting API key:", error)
      alert("Error deleting API key. Please try again.")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const testApiEndpoint = async () => {
    if (!testApiKey.trim()) {
      setTestError("Please enter an API key")
      return
    }

    try {
      setTestLoading(true)
      setTestError(null)
      setTestResults(null)

      const response = await fetch("/api/blogs-public", {
        headers: {
          Authorization: `Bearer ${testApiKey}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        setTestError(data.error || "An error occurred while testing the API key")
        return
      }

      setTestResults(data.blogs)
    } catch (error) {
      console.error("Error testing API key:", error)
      setTestError("An error occurred while testing the API key")
    } finally {
      setTestLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleString()
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold">API Keys Management</h2>
            <p className="text-gray-500 text-sm">You need to be logged in to manage your API keys.</p>
          </div>
          <div className="mb-4">
            <p>Please log in to continue.</p>
          </div>
          <div>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">API Keys Management</h1>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab("manage")}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === "manage"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manage Keys
            </button>
            <button
              onClick={() => setActiveTab("test")}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === "test"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Test API
            </button>
          </nav>
        </div>
      </div>

      {/* Manage Keys Tab */}
      {activeTab === "manage" && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Your API Keys</h2>
            <p className="text-gray-500 text-sm">
              Create and manage API keys to access your blog posts programmatically.
            </p>
          </div>
          <div className="p-6">
            <div className="flex items-end gap-4 mb-6">
              <div className="flex-1">
                <label htmlFor="new-key-name" className="block text-sm font-medium mb-2">
                  New API Key Name
                </label>
                <input
                  id="new-key-name"
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Enter a name for your API key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={createApiKey}
                disabled={creatingKey}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingKey ? "Creating..." : "Create API Key"}
              </button>
            </div>

            {loading ? (
              <p>Loading API keys...</p>
            ) : apiKeys.length === 0 ? (
              <p>You don't have any API keys yet. Create one to get started.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Created
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Last Used
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {apiKeys.map((key) => (
                      <tr key={key.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{key.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(key.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(key.last_used_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => copyToClipboard(key.key)}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50"
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </button>
                            <button
                              onClick={() => deleteApiKey(key.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Test API Tab */}
      {activeTab === "test" && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Test Your API Key</h2>
            <p className="text-gray-500 text-sm">Test your API key to make sure it works correctly.</p>
          </div>
          <div className="p-6">
            <div className="flex items-end gap-4 mb-6">
              <div className="flex-1">
                <label htmlFor="test-api-key" className="block text-sm font-medium mb-2">
                  API Key
                </label>
                <input
                  id="test-api-key"
                  type="text"
                  value={testApiKey}
                  onChange={(e) => setTestApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={testApiEndpoint}
                disabled={testLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {testLoading ? "Testing..." : "Test API Key"}
              </button>
            </div>

            {testError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{testError}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {testResults && (
              <div>
                <h3 className="text-lg font-medium mb-2">Results:</h3>
                {testResults.length === 0 ? (
                  <p>No blog posts found for this API key.</p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">Found {testResults.length} blog posts:</p>
                    {testResults.map((blog) => (
                      <div key={blog.id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-gray-200">
                          <h4 className="text-lg font-semibold">{blog.title || "Untitled Blog"}</h4>
                          <p className="text-sm text-gray-500">{new Date(blog.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="p-4">
                          <p className="line-clamp-3">{blog.content || "No content"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 p-4 border rounded-md bg-gray-50">
              <h3 className="text-lg font-medium mb-2">API Usage Example</h3>
              <p className="text-sm mb-2">Use this code to fetch your blog posts:</p>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-md overflow-x-auto text-sm">
                {`fetch('${typeof window !== "undefined" ? window.location.origin : ""}/api/blogs-public', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data));`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* API Key Created Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-2">API Key Created</h3>
              <p className="text-gray-500 text-sm mb-4">
                Your new API key has been created. Please copy it now as you won't be able to see it again.
              </p>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto mb-4">{newlyCreatedKey}</div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => copyToClipboard(newlyCreatedKey || "")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => setShowDialog(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

