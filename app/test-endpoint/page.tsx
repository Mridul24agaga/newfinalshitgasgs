// Site A: app/test-endpoint/page.tsx
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function TestEndpointPage() {
  const [blogId, setBlogId] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  const testEndpoint = async () => {
    setLoading(true);
    setTestResult(null);
    setError(null);

    try {
      if (!blogId) {
        throw new Error("Enter a Blog ID, bro!");
      }
      if (!apiKey) {
        throw new Error("Enter an API key, bro!");
      }

      const response = await fetch(`/api/test-blog-fetch?id=${blogId}&apiKey=${apiKey}`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const result = await response.json();
      setTestResult(JSON.stringify(result, null, 2));
    } catch (err: unknown) {
      console.error(`Error testing endpoint: ${err instanceof Error ? err.message : String(err)}`);
      setError(`Test Failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Test Endpoint</h1>
        <p className="text-gray-600 mb-6">
          Enter your Blog ID (from /generated/[id]) and API key (from /generate-api-key), then click the button to test the /api/test-blog-fetch endpoint!
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blog ID</label>
            <input
              type="text"
              value={blogId}
              onChange={(e) => setBlogId(e.target.value)}
              placeholder="Enter Blog ID (e.g., 123e4567-e89b-12d3-a456-426614174000)"
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API Key (e.g., 550e8400-e29b-41d4-a716-446655440000)"
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800"
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={testEndpoint}
            disabled={loading}
            className={`w-full px-4 py-2 rounded-lg text-white font-semibold transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5 inline" />
                Testing...
              </>
            ) : (
              "Check Test Endpoint"
            )}
          </button>

          {testResult && (
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Test Result:</h3>
              <pre className="text-sm text-gray-700 overflow-auto max-h-60">{testResult}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}