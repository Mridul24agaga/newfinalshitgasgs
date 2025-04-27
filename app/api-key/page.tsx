"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "../components/sidebar"
import { ClipboardIcon, CheckIcon, KeyIcon, ShieldIcon, CodeIcon, RefreshCwIcon, AlertTriangleIcon } from "lucide-react"

export default function APIKeyPage() {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => {
    fetchApiKey()
  }, [])

  // Fetch the API key from the server
  async function fetchApiKey() {
    try {
      setLoading(true)
      const res = await fetch("/api/get-api-key", {
        method: "GET",
        credentials: "include",
      })

      const data = await res.json()

      if (res.ok) {
        setApiKey(data.apiKey)
      } else {
        console.error("API error:", data.error)
        setError(data.error || "Failed to retrieve API key")
      }
    } catch (err) {
      console.error("Error fetching API key", err)
      setError("Failed to connect to server. Please check your internet connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  // Copy the API key to clipboard
  const copyToClipboard = async () => {
    if (apiKey) {
      try {
        await navigator.clipboard.writeText(apiKey)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy to clipboard", err)
        setError("Failed to copy to clipboard. Please try manually selecting and copying the key.")
      }
    }
  }

  // Regenerate the API key
  const regenerateKey = async () => {
    try {
      setRegenerating(true)
      const res = await fetch("/api/regenerate-api-key", {
        method: "POST",
        credentials: "include",
      })

      const data = await res.json()

      if (res.ok) {
        setApiKey(data.apiKey)
        // Show success message
        const successMessage = document.getElementById("success-message")
        if (successMessage) {
          successMessage.classList.remove("hidden")
          setTimeout(() => {
            successMessage.classList.add("hidden")
          }, 3000)
        }
      } else {
        setError(data.error || "Failed to regenerate API key")
      }
    } catch (err) {
      setError("Failed to regenerate API key. Please try again later.")
    } finally {
      setRegenerating(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      <main className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <div className="max-w-4xl mx-auto py-8 px-4 md:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">API Key Management</h1>
            <p className="text-gray-600 mt-2">
              View and manage your API keys for accessing our services. Your API key is required for all API requests.
            </p>
          </div>

          {/* API Key Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <KeyIcon className="h-5 w-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">Your API Key</h2>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                This key authenticates your API requests. Keep it confidential and never share it publicly.
              </p>
            </div>

            <div className="p-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-start">
                  <AlertTriangleIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Error Occurred</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              <div
                id="success-message"
                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4 hidden"
              >
                <p className="font-medium">Success!</p>
                <p className="text-sm">Your API key has been regenerated successfully.</p>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
                  <span className="ml-2 text-gray-700">Loading your API key...</span>
                </div>
              ) : (
                <>
                  {/* API Key Display */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Personal API Key:</label>
                    <div className="relative">
                      <div className="bg-gray-100 font-mono text-sm p-4 rounded-md break-all border border-gray-300">
                        {apiKey}
                      </div>
                      <button
                        className="absolute top-2 right-2 p-2 rounded-md hover:bg-gray-200 transition-colors bg-white border border-gray-300 shadow-sm"
                        onClick={copyToClipboard}
                        title={copied ? "Copied!" : "Copy to clipboard"}
                      >
                        {copied ? (
                          <CheckIcon className="h-4 w-4 text-green-600" />
                        ) : (
                          <ClipboardIcon className="h-4 w-4 text-gray-700" />
                        )}
                        <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {copied ? "✓ Copied to clipboard!" : "Click the button to copy your API key"}
                    </p>
                  </div>

                  {/* Regenerate Button */}
                  <div className="mt-6 flex justify-between items-center">
                    <p className="text-sm text-gray-600 max-w-md">
                      <strong>Important:</strong> Regenerating your API key will invalidate your current key. All
                      applications using the old key will need to be updated.
                    </p>
                    
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Security Guidelines */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <ShieldIcon className="h-5 w-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">API Key Security Best Practices</h2>
              </div>
            </div>
            <div className="p-6">
              <ul className="list-disc pl-5 space-y-3 text-gray-700">
                <li>
                  <strong>Keep it secret:</strong> Your API key grants access to your account and resources. Never share
                  it publicly.
                </li>
                <li>
                  <strong>Server-side only:</strong> Always use your API key in server-side code, never in client-side
                  JavaScript or mobile apps.
                </li>
                <li>
                  <strong>Environment variables:</strong> Store your API key as an environment variable, not hardcoded
                  in your application.
                </li>
                <li>
                  <strong>Regular rotation:</strong> Periodically regenerate your API key as a security best practice.
                </li>
                <li>
                  <strong>Immediate action:</strong> If you suspect your key has been compromised, regenerate it
                  immediately.
                </li>
              </ul>
            </div>
          </div>

          {/* Example Usage */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <CodeIcon className="h-5 w-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">Example API Usage</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">How to use your API key</h3>
                <p className="text-gray-700 mb-4">Follow these steps to integrate your API key with our services:</p>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700 mb-6">
                  <li>Copy your API key from the section above</li>
                  <li>Store it securely as an environment variable in your application</li>
                  <li>Include it in the Authorization header of your API requests</li>
                  <li>Make API calls to our endpoints as shown in the example below</li>
                </ol>
              </div>

              <div className="mb-2">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Example Code</h3>
                <p className="text-gray-700 mb-4">
                  Here's a complete example of how to fetch your blog data using your API key:
                </p>
              </div>

              <div className="relative">
                <pre className="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto text-sm font-mono whitespace-pre-wrap">
                  {`"use client";

import { useEffect, useState } from "react";

// Define types for our data structures
type Blog = {
  id: string;
  title: string;
  blog_post: string;
};

type HeadlineToBlog = {
  id: string;
  headline: string;
  blog_text: string;
};

export default function BlogFetcher() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [headlines, setHeadlines] = useState<HeadlineToBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // IMPORTANT: Replace with your actual API key or use environment variables
  // For production, use environment variables like:
  // const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const apiKey = "YOUR_API_KEY";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Make the API request with your API key in the Authorization header
        const res = await fetch("https://getmoreseo.org/api/user-data", {
          headers: {
            // Always use the Bearer token format for API key authentication
            Authorization: \`Bearer \${apiKey}\`,
            "Content-Type": "application/json",
          },
        });

        // Handle error responses
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData?.error || \`Server responded with status: \${res.status}\`);
        }

        // Process successful response
        const data = await res.json();
        setBlogs(data.blogs || []);
        setHeadlines(data.headlinetoblog || []);
        setError("");
      } catch (err) {
        console.error("API request failed:", err);
        setError(err instanceof Error ? err.message : "Unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render loading state
  if (loading) {
    return <div className="p-8 text-center">Loading your content...</div>;
  }

  // Render error state
  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h2 className="text-lg font-bold mb-2">Error</h2>
          <p>{error}</p>
          <p className="mt-2 text-sm">
            Please check your API key and try again. If the problem persists, contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Blogs</h1>

      {/* Display blogs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-3">{blog.title}</h2>
            <div 
              className="prose prose-sm" 
              dangerouslySetInnerHTML={{ __html: blog.blog_post }} 
            />
          </div>
        ))}
        {blogs.length === 0 && (
          <p className="text-gray-500 col-span-full">No blogs found.</p>
        )}
      </div>

      <h1 className="text-2xl font-bold mb-6">Headlines</h1>
      
      {/* Display headlines */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {headlines.map((headline) => (
          <div
            key={headline.id}
            className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-100"
          >
            <h3 className="text-lg font-semibold mb-3">{headline.headline}</h3>
            <div 
              className="prose prose-sm" 
              dangerouslySetInnerHTML={{ __html: headline.blog_text }} 
            />
          </div>
        ))}
        {headlines.length === 0 && (
          <p className="text-gray-500 col-span-full">No headlines found.</p>
        )}
      </div>
    </div>
  );
}`}
                </pre>
              </div>

              <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <h4 className="text-base font-medium text-yellow-800">Important Notes</h4>
                <ul className="mt-2 list-disc pl-5 text-sm text-yellow-700 space-y-1">
                  <li>Replace "YOUR_API_KEY" with the actual API key displayed above</li>
                  <li>For production applications, always use environment variables to store your API key</li>
                  <li>
                    The API endpoint in this example (getmoreseo.org/api/user-data) is where you'll make your requests
                  </li>
                  <li>All API requests must include your API key in the Authorization header as shown</li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Available Endpoints</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Endpoint
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Method
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          /api/user-data
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GET</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Retrieves all your blogs and headlines</td>
                      </tr>
                      
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
