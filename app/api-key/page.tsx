"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "../components/sidebar"

export default function APIKeyPage() {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function getKey() {
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
          setError(data.error)
        }
      } catch (err) {
        console.error("Error fetching API key", err)
        setError("Failed to connect to server.")
      } finally {
        setLoading(false)
      }
    }

    getKey()
  }, [])

  const copyToClipboard = async () => {
    if (apiKey) {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const regenerateKey = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/regenerate-api-key", {
        method: "POST",
        credentials: "include",
      })

      const data = await res.json()

      if (res.ok) {
        setApiKey(data.apiKey)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError("Failed to regenerate API key.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <div className="max-w-4xl mx-auto py-8 px-4 md:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">API Key Management</h1>
            <p className="text-gray-500 mt-2">View and manage your API keys for accessing our services.</p>
          </div>

          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                </svg>
                <h2 className="text-xl font-semibold">Your API Key</h2>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Use this key to authenticate your API requests. Keep it secure and don't share it publicly.
              </p>
            </div>
            <div className="p-6">
              {error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <div className="bg-gray-100 font-mono text-sm p-4 rounded-md break-all">{apiKey}</div>
                    <button
                      className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-200 transition-colors"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      )}
                      <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={regenerateKey}
                      disabled={loading}
                    >
                      {loading && (
                        <span className="mr-2 inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></span>
                      )}
                      Regenerate API Key
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-8 bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">API Key Security</h2>
            </div>
            <div className="p-6">
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Your API key grants access to your account and resources.</li>
                <li>Never share your API key in public repositories or client-side code.</li>
                <li>Regenerate your key immediately if you suspect it has been compromised.</li>
                <li>Use environment variables to store your API key in your applications.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Example Usage</h2>
            </div>
            <div className="p-6">
              <p className="mb-4">Here's an example of how to use your API key to fetch blog data:</p>
              <div className="relative">
                <pre className="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto text-sm font-mono whitespace-pre-wrap">
                  {`"use client";

import { useEffect, useState } from "react";

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
  const [error, setError] = useState("");
  const apiKey = "YOUR_ABOVE_GENERATED_API_KEY";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://getmoreseo.org/api/user-data", {
          headers: {
            Authorization: \`Bearer \${apiKey}\`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          setError(errData?.error || "Something went wrong.");
          return;
        }

        const data = await res.json();
        setBlogs(data.blogs || []);
        setHeadlines(data.headlinetoblog || []);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Unexpected error occurred.");
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Your Blogs</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {blogs.map((b) => (
          <div
            key={b.id}
            style={{
              backgroundColor: "#f9f9f9",
              padding: "1rem",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{b.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: b.blog_post }} />
          </div>
        ))}
      </div>

      <h1 style={{ marginTop: "3rem" }}>Headlines</h1>
      <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {headlines.map((h) => (
          <div
            key={h.id}
            style={{
              backgroundColor: "#e6f0ff",
              padding: "1rem",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{h.headline}</h3>
            <div dangerouslySetInnerHTML={{ __html: h.blog_text }} />
          </div>
        ))}
      </div>
    </div>
  );
}`}
                </pre>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Replace "YOUR_ABOVE_GENERATED_API_KEY" with the actual API key displayed above.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
