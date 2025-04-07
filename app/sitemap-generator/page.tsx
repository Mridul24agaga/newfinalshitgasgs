"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { FileText, Download, Copy, Loader2, Menu, Globe, Home, Lightbulb, Settings, Sparkles } from "lucide-react"

export default function SitemapGenerator() {
  const [url, setUrl] = useState("")
  const [sitemapXml, setSitemapXml] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSitemapXml(null)

    if (!url) {
      setError("Please enter a website URL")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/sitemap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setSitemapXml(data.sitemap)
      }
    } catch (error) {
      setError("Failed to generate sitemap")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (!sitemapXml) return

    navigator.clipboard.writeText(sitemapXml)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!sitemapXml) return

    const blob = new Blob([sitemapXml], { type: "application/xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sitemap.xml"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 h-screen transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-72 bg-white flex flex-col h-screen text-gray-800 border-r border-gray-200">
          <div className="flex items-center justify-center p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-[#294fd6] flex items-center justify-center border border-[#294fd6]/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#294fd6] to-[#6284e4] bg-clip-text text-transparent">
                Sitemap Generator
              </h1>
            </div>
          </div>

          <div className="px-3 mb-4 mt-6">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Navigation</div>
          </div>

          <nav className="flex-1 px-3 overflow-y-auto space-y-1">
            <Link
              href="/"
              className="flex items-center px-4 py-3 text-[15px] font-medium rounded-xl transition-all duration-200 mb-1 group text-gray-700 hover:text-[#294fd6] hover:bg-[#294fd6]/5 border-l-4 border-transparent"
            >
              <Home className="w-[18px] h-[18px] mr-3 flex-shrink-0 stroke-[1.5px] transition-colors duration-200 text-gray-500 group-hover:text-[#294fd6]" />
              Dashboard
            </Link>

            <Link
              href="/"
              className="flex items-center px-4 py-3 text-[15px] font-medium rounded-xl transition-all duration-200 mb-1 group text-[#294fd6] bg-[#294fd6]/10 border-l-4 border-[#294fd6]"
            >
              <Globe className="w-[18px] h-[18px] mr-3 flex-shrink-0 stroke-[1.5px] transition-colors duration-200 text-[#294fd6]" />
              Sitemap Generator
            </Link>

            <Link
              href="/"
              className="flex items-center px-4 py-3 text-[15px] font-medium rounded-xl transition-all duration-200 mb-1 group text-gray-700 hover:text-[#294fd6] hover:bg-[#294fd6]/5 border-l-4 border-transparent"
            >
              <FileText className="w-[18px] h-[18px] mr-3 flex-shrink-0 stroke-[1.5px] transition-colors duration-200 text-gray-500 group-hover:text-[#294fd6]" />
              Generated Sitemaps
            </Link>

            <Link
              href="/"
              className="flex items-center px-4 py-3 text-[15px] font-medium rounded-xl transition-all duration-200 mb-1 group text-gray-700 hover:text-[#294fd6] hover:bg-[#294fd6]/5 border-l-4 border-transparent"
            >
              <Lightbulb className="w-[18px] h-[18px] mr-3 flex-shrink-0 stroke-[1.5px] transition-colors duration-200 text-gray-500 group-hover:text-[#294fd6]" />
              SEO Tips
            </Link>

            <Link
              href="/"
              className="flex items-center px-4 py-3 text-[15px] font-medium rounded-xl transition-all duration-200 mb-1 group text-gray-700 hover:text-[#294fd6] hover:bg-[#294fd6]/5 border-l-4 border-transparent"
            >
              <Settings className="w-[18px] h-[18px] mr-3 flex-shrink-0 stroke-[1.5px] transition-colors duration-200 text-gray-500 group-hover:text-[#294fd6]" />
              Settings
            </Link>
          </nav>

          <div className="p-4 mt-auto">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-[#294fd6]" />
                  <p className="text-sm font-medium text-gray-800">Sitemaps</p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-bold text-[#294fd6]">Free</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700">Basic Plan</span>
                <Link
                  href="/"
                  className="bg-[#294fd6] text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#1e3eb8] transition-all duration-300 border border-[#294fd6]"
                >
                  Upgrade
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full lg:pl-72">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 mr-2 text-gray-500 rounded-md hover:bg-gray-100 lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">Sitemap Generator</h2>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#294fd6] to-[#6284e4] rounded-xl p-6 sm:p-8 text-white mb-6 sm:mb-8 border border-gray-200">
              <div className="relative z-10">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 sm:mb-3">Sitemap Generator</h1>
                <p className="text-white/80 text-base sm:text-lg max-w-xl">
                  Generate a sitemap.xml file for your website to improve SEO and help search engines discover your
                  content.
                </p>
              </div>
            </div>

            {/* Generator Form */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6 sm:mb-8">
              <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[#294fd6]" />
                  Enter Website URL
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                      Website URL
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        id="url"
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="example.com"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl sm:rounded-l-xl sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-[#294fd6] focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-6 py-3 rounded-xl sm:rounded-l-none sm:rounded-r-xl text-white font-medium ${
                          isLoading ? "bg-[#294fd6]/70" : "bg-[#294fd6] hover:bg-[#1e3eb8]"
                        } transition-colors duration-300 flex items-center justify-center`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          "Generate Sitemap"
                        )}
                      </button>
                    </div>
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                  </div>
                </form>
              </div>
            </div>

            {/* Results */}
            {sitemapXml && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-[#294fd6]" />
                      Generated Sitemap
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCopy}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 text-sm font-medium flex items-center border border-gray-200"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {copied ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-[#294fd6] text-white rounded-lg hover:bg-[#1e3eb8] transition-colors duration-300 text-sm font-medium flex items-center border border-[#294fd6]"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <pre className="bg-gray-50 p-4 rounded-xl border border-gray-200 overflow-auto text-sm text-gray-800 max-h-[400px] whitespace-pre-wrap">
                    {sitemapXml}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

