"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/app/components/sidebar"
import { Copy, Check, Key, Menu, X, Code, Terminal, FileText, ExternalLink, AlertCircle } from "lucide-react"

interface SubscriptionData {
  plan_id: string
  credits: number
}

export default function Dashboard() {
  const pathname = usePathname()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"key" | "docs">("key")

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // Fetch API key and subscription data
  useEffect(() => {
    // Fetch API key
    fetch("/api/get-api-key")
      .then((res) => res.json())
      .then((data) => {
        setApiKey(data.apiKey)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to fetch API key:", error)
        setLoading(false)
      })

    // Fetch subscription data
    fetch("/api/get-subscription")
      .then((res) => res.json())
      .then((data) => {
        setSubscription(data.subscription)
      })
      .catch((error) => {
        console.error("Failed to fetch subscription data:", error)
      })
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md lg:hidden"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Import the Sidebar component */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isMobile ? "fixed z-40 shadow-xl" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar subscription={subscription} />
      </div>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content - API Key Display */}
      <div
        className={cn(
          "flex-1 p-4 md:p-8 transition-all duration-300 overflow-y-auto",
          isMobile && sidebarOpen ? "opacity-50" : "opacity-100",
          !isMobile && "ml-64",
        )}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">API Access</h1>
            <p className="text-gray-600">Manage your API key and learn how to integrate with our services</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("key")}
              className={cn(
                "py-3 px-4 font-medium text-sm transition-colors border-b-2 -mb-px",
                activeTab === "key"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-600 hover:text-gray-900",
              )}
            >
              <div className="flex items-center gap-2">
                <Key size={16} />
                API Key
              </div>
            </button>
           
          </div>

          {/* API Key Tab */}
          {activeTab === "key" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 animate-fadeIn">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Key className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Your API Key</h2>
                    <p className="text-gray-600">Use this key to authenticate your API requests</p>
                  </div>
                </div>

                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-12 bg-gray-200 rounded-md mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="bg-gray-50 p-5 rounded-lg font-mono text-sm break-all border border-gray-200">
                        {apiKey || "No API key found"}
                      </div>
                      <button
                        onClick={copyToClipboard}
                        disabled={!apiKey}
                        className={cn(
                          "absolute top-3 right-3 p-2 rounded-md transition-all",
                          copied
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300 hover:shadow-sm",
                        )}
                      >
                        {copied ? (
                          <div className="flex items-center gap-1">
                            <Check size={16} />
                            <span className="text-xs font-medium">Copied</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Copy size={16} />
                            <span className="text-xs font-medium">Copy</span>
                          </div>
                        )}
                      </button>
                    </div>

                    <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg text-blue-800 text-sm">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Security Notice</p>
                        <p className="text-blue-700 mt-1">
                          Keep this key secure and don't share it publicly. This key grants access to your account and
                          resources.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documentation Tab */}
          {activeTab === "docs" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 animate-fadeIn">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Code className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">API Documentation</h2>
                    <p className="text-gray-600">Learn how to use our API to integrate with your applications</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Getting Started */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Getting Started</h3>
                    <p className="text-gray-700 mb-4">
                      Our API allows you to programmatically access our content generation and analysis tools. All API
                      requests require authentication using your API key.
                    </p>

                    <div className="bg-gray-900 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                        <div className="flex items-center gap-2">
                          <Terminal size={16} className="text-gray-400" />
                          <span className="text-gray-300 text-sm font-medium">Authentication Example</span>
                        </div>
                      </div>
                      <div className="p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                        <pre>{`curl -X POST https://api.texta.ai/v1/generate \\
  -H "Authorization: Bearer ${apiKey || "YOUR_API_KEY"}" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Write a blog post about artificial intelligence"}'`}</pre>
                      </div>
                    </div>
                  </div>

                  {/* Endpoints */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">API Endpoints</h3>

                    <div className="space-y-4">
                      {/* Generate Content Endpoint */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                              POST
                            </span>
                            <span className="font-mono text-sm">/v1/generate</span>
                          </div>
                          <span className="text-sm text-gray-500">Generate content</span>
                        </div>
                        <div className="p-4">
                          <p className="text-gray-700 text-sm mb-3">
                            Generate blog posts, articles, and other content based on your prompt.
                          </p>
                          <div className="bg-gray-50 p-3 rounded-md font-mono text-xs">
                            <pre>{`{
  "prompt": "Write a blog post about artificial intelligence",
  "tone": "professional",
  "length": "medium"
}`}</pre>
                          </div>
                        </div>
                      </div>

                      {/* Analyze Content Endpoint */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                              POST
                            </span>
                            <span className="font-mono text-sm">/v1/analyze</span>
                          </div>
                          <span className="text-sm text-gray-500">Analyze content</span>
                        </div>
                        <div className="p-4">
                          <p className="text-gray-700 text-sm mb-3">
                            Analyze existing content for SEO, readability, and sentiment.
                          </p>
                          <div className="bg-gray-50 p-3 rounded-md font-mono text-xs">
                            <pre>{`{
  "content": "Your content to analyze goes here",
  "analysis_type": ["seo", "readability", "sentiment"]
}`}</pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rate Limits */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Rate Limits</h3>
                    <p className="text-gray-700 mb-4">
                      API requests are limited based on your subscription plan. Each request consumes credits from your
                      account.
                    </p>

                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Plan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Requests per day
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Credits per request
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Trial</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Basic</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">50</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Pro</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Unlimited</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <a
                      href="/api/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium text-sm"
                    >
                      View full documentation
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

