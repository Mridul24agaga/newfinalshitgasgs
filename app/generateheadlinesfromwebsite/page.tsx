"use client";

import { useState } from "react";
import { generateHeadlinesFromWebsite } from "../generateHeadlinesFromWebsite ";

export default function Home() {
  const [website, setWebsite] = useState("");
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setHeadlines([]);

    try {
      const result = await generateHeadlinesFromWebsite(website);
      setHeadlines(result);
    } catch (err: any) {
      setError(err.message || "Yo, somethin’ went wrong, bro!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Data-Driven Headline Generator, Bro!</h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="website" className="block text-gray-700 font-semibold mb-2">
            Drop a Website URL, Yo
          </label>
          <input
            type="url"
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-lg text-white font-semibold transition-colors ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"
          }`}
        >
          {loading ? "Generating, Hold Up..." : "Get 10 Data-Driven Headlines, Bro!"}
        </button>
      </form>

      {error && (
        <div className="mt-6 w-full max-w-md p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {headlines.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your 10 Data-Driven Headlines, Bro:</h2>
          <ul className="space-y-3">
            {headlines.map((headline, index) => (
              <li
                key={index}
                className="p-4 bg-white rounded-lg shadow-md text-gray-700 hover:bg-orange-50 transition-colors"
              >
                {index + 1}. {headline}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}