// Site A: app/generate-api-key/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utitls/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Loader2, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GenerateApiKeyPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setError("You need to log in first, bro!");
        router.push("/auth");
      }
    };
    checkAuth();
  }, [supabase, router]);

  const generateApiKey = async () => {
    setLoading(true);
    setError(null);
    setCopied(false);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error("Authentication required");
      }

      const userId = user.id;
      const newApiKey = uuidv4(); // Generate a new unique API key

      // Check if an API key already exists for this user
      const { data: existingApiControl, error: fetchError } = await supabase
        .from("api_control")
        .select("api_key")
        .eq("user_id", userId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 means no rows found
        throw fetchError;
      }

      let query;
      if (existingApiControl) {
        // Update existing API key
        query = supabase
          .from("api_control")
          .update({ api_key: newApiKey, last_used: null })
          .eq("user_id", userId);
      } else {
        // Insert new API key
        query = supabase.from("api_control").insert({
          user_id: userId,
          api_key: newApiKey,
        });
      }

      const { error } = await query;
      if (error) {
        throw error;
      }

      setApiKey(newApiKey);
      setError(null);
    } catch (err: unknown) {
      console.error(`Error generating API key: ${err instanceof Error ? err.message : String(err)}`);
      setError(`Failed to generate API key: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Generate Your API Key</h1>
        <p className="text-gray-600 mb-6">
          Generate a unique API key to access your blogs via the{" "}
          <a href="https://blogosocial.com/api/blogs-by-id" className="text-blue-600 hover:underline">
            /api/blogs-by-id
          </a>{" "}
          endpoint. Keep it secure!
        </p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          onClick={generateApiKey}
          disabled={loading}
          className={`w-full px-4 py-2 rounded-lg text-white font-semibold transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5 inline" />
              Generating...
            </>
          ) : (
            "Generate API Key"
          )}
        </button>

        {apiKey && (
          <div className="mt-6 relative">
            <input
              type="text"
              value={apiKey}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800"
            />
            <button
              onClick={copyToClipboard}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Copy this key and use it in your code to fetch blogs. Don’t share it publicly!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}