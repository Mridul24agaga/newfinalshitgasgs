"use client"

import type React from "react"
import { useState } from "react"
import { Sparkles, Globe, Copy, CheckCircle } from "lucide-react"
import { generateHeadlinesFromWebsite } from "../generateHeadlinesFromWebsite "
import { AppSidebar } from "../components/sidebar"

export default function HeadlineGenerator() {
  // Headline generator state
  const [website, setWebsite] = useState("")
  const [headlines, setHeadlines] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Handle headline generation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setHeadlines([])

    try {
      const result = await generateHeadlinesFromWebsite(website)
      setHeadlines(result)
    } catch (err: any) {
      setError(err.message || "Something went wrong while generating headlines!")
    } finally {
      setLoading(false)
    }
  }

  // Handle copy to clipboard
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Import the sidebar from external component */}
      <AppSidebar />

      <div className="flex flex-col flex-1 w-full">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center px-6 py-4">
            <h2 className="text-xl font-bold text-gray-900">Headline Generator</h2>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#294fd6] to-[#6284e4] rounded-2xl p-8 text-white mb-8 border border-[#294fd6]/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3"></div>

              <div className="relative z-10">
                <h1 className="text-3xl font-bold tracking-tight mb-3">Data-Driven Headline Generator</h1>
                <p className="text-white/80 text-lg max-w-xl">
                  Generate engaging, data-driven headlines from any website to boost your content's click-through rates
                  and engagement.
                </p>
              </div>
            </div>

            {/* Website Input Card */}
            <div className="mb-8 border border-gray-200 rounded-xl bg-white overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-[#294fd6]" />
                  <h2 className="text-2xl font-bold text-gray-900">Website Analyzer</h2>
                </div>
                <p className="text-gray-500 mt-1">
                  Enter a website URL to analyze its content and generate 10 data-driven headlines
                </p>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <input
                        type="url"
                        id="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#294fd6] focus:border-[#294fd6]"
                        required
                        disabled={loading}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-[#294fd6] hover:bg-[#1e3eb8] text-white font-medium rounded-lg transition-colors duration-300 border border-[#294fd6]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Generating Headlines...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Headlines
                        </div>
                      )}
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="mt-4 p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg">{error}</div>
                )}
              </div>
            </div>

            {/* Results Card */}
            {headlines.length > 0 && (
              <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 text-[#294fd6]" />
                    <h2 className="text-2xl font-bold text-gray-900">Your Data-Driven Headlines</h2>
                  </div>
                  <p className="text-gray-500 mt-1">Click on any headline to copy it to your clipboard</p>
                </div>
                <div className="p-6">
                  <div className="grid gap-3">
                    {headlines.map((headline, index) => (
                      <div
                        key={index}
                        onClick={() => copyToClipboard(headline, index)}
                        className="p-4 bg-white rounded-lg border border-gray-200 hover:border-[#294fd6]/60 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#294fd6]/10 text-[#294fd6] text-sm font-medium mr-3">
                              {index + 1}
                            </span>
                            <p className="text-gray-800 font-medium">{headline}</p>
                          </div>
                          <div className="text-gray-400 group-hover:text-[#294fd6]">
                            {copiedIndex === index ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Copy className="h-5 w-5" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
