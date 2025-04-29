// app/fetch-blogs/page.tsx
"use client";

import { useState, useCallback } from "react";

interface Blog {
  user_id: string;
  blog_post: string;
}

interface ApiResponse {
  blogs?: Blog[];
  error?: string;
  message?: string;
  details?: string;
  debug?: string;
}

export default function FetchBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [debugMessage, setDebugMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");

  const fetchBlogs = useCallback(async () => {
    if (!apiKey.trim()) {
      setError("Please enter a valid API key");
      setDebugMessage(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setDebugMessage(null);

    try {
      const response = await fetch("http://localhost:3000/api/fetch-blogs", {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
        },
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(`${result.error || "Failed to fetch blogs"}: ${result.details || ""}`);
      }

      setBlogs(result.blogs || []);
      if (!result.blogs || result.blogs.length === 0) {
        setError(result.message || "No blogs found for this API key");
        setDebugMessage(result.debug || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong!");
      setBlogs([]);
      setDebugMessage(null);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  return (
    <div className="container">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
        Fetch Blogs
      </h1>
      <p className="text-gray-500 mt-1">Test fetching blogs with your API key</p>

      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 mt-6">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h2 className="text-xl font-semibold text-gray-900">Fetch Blogs</h2>
          <p className="text-gray-500 text-sm mt-1">Enter your API key to fetch blogs</p>
        </div>
        <div className="p-6">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value.trim())}
            placeholder="Enter API key"
            disabled={isLoading}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={fetchBlogs}
            disabled={isLoading || !apiKey.trim()}
            className="mt-4 w-full px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 disabled:bg-gray-400"
          >
            {isLoading ? "Fetching..." : "Fetch Blogs"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 text-red-600 text-center">{error}</div>
      )}
      {debugMessage && (
        <div className="mt-2 text-gray-600 text-center text-sm">{debugMessage}</div>
      )}

      {blogs.length > 0 && (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100 mt-6">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h2 className="text-xl font-semibold text-gray-900">Blogs</h2>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              {blogs.map((blog, index) => (
                <li key={index} className="p-4 border border-gray-100 rounded-lg">
                  {blog.blog_post}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 24px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
    </div>
  );
}