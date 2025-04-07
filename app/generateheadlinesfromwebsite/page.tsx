"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  Menu,
  FileText,
  Lightbulb,
  Sparkles,
  PlusCircle,
  CreditCard,
  Globe,
  Zap,
  PenLine,
  LayoutGrid,
  BarChart2,
  Database,
  Home,
  ChevronDown,
  Link2,
  ExternalLink,
  Copy,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { generateHeadlinesFromWebsite } from "../generateHeadlinesFromWebsite "

export default function HeadlineGenerator() {
  // Headline generator state
  const [website, setWebsite] = useState("")
  const [headlines, setHeadlines] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState("Company Database")

  // Navigation items
  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Content Planner", href: "/content-planner", icon: PenLine },
    { name: "Headline Generator", href: "/headline-generator", icon: Globe },
    {
      name: "Company Database",
      icon: Database,
      subItems: [
        { name: "Content Ideas", href: "/company-database/ideas", icon: Lightbulb },
        { name: "Brand Profile", href: "/company-database/brand", icon: FileText },
        { name: "Blog Settings", href: "/company-database/blog", icon: LayoutGrid },
        { name: "Audience and Keywords", href: "/settings", icon: BarChart2 },
      ],
    },
    {
      name: "Integrations",
      icon: Link2,
      subItems: [{ name: "GetMoreBacklinks", href: "/integrations", icon: ExternalLink }],
    },
  ]

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 h-screen ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
        <div className="w-72 bg-white flex flex-col h-screen text-gray-800 border-r border-gray-200">
          <div className="flex items-center justify-center p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-[#294fd6] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#294fd6] to-[#6284e4] bg-clip-text text-transparent">
                HeadlineAI
              </h1>
            </div>
          </div>

          <div className="px-5 mt-8 mb-8">
            <Link href="/">
              <button className="w-full bg-[#294fd6] text-white font-medium py-3.5 rounded-xl hover:bg-[#1e3eb8] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border border-[#294fd6]/20 flex items-center justify-center">
                <PlusCircle className="mr-2 h-5 w-5" />
                Generate Headlines
              </button>
            </Link>
          </div>

          <div className="px-3 mb-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Main</div>
          </div>

          <nav className="flex-1 px-3 overflow-y-auto space-y-1">
            {navigation.slice(0, 3).map((item) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href || (item.subItems && item.subItems.some((subItem) => pathname === subItem.href))

              if (item.href && !item.subItems) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-[15px] font-medium rounded-xl transition-all duration-200 mb-1 group",
                      isActive
                        ? "text-[#294fd6] bg-[#294fd6]/10 border-l-4 border-[#294fd6]"
                        : "text-gray-700 hover:text-[#294fd6] hover:bg-[#294fd6]/5 border-l-4 border-transparent",
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-[18px] h-[18px] mr-3 flex-shrink-0 stroke-[1.5px] transition-colors duration-200",
                        isActive ? "text-[#294fd6]" : "text-gray-500 group-hover:text-[#294fd6]",
                      )}
                    />
                    {item.name}
                    {item.name === "Dashboard" && (
                      <span className="ml-auto text-xs bg-[#294fd6]/10 text-[#294fd6] px-2 py-0.5 rounded-full">
                        Home
                      </span>
                    )}
                    {item.name === "Headline Generator" && (
                      <span className="ml-auto text-xs bg-[#294fd6]/10 text-[#294fd6] px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </Link>
                )
              }

              return null
            })}
          </nav>

          <div className="px-3 mb-4 mt-6">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Workspace</div>
          </div>

          <nav className="px-3 overflow-y-auto space-y-1">
            {navigation.slice(3).map((item) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href || (item.subItems && item.subItems.some((subItem) => pathname === subItem.href))

              return (
                <div key={item.name} className="mb-1">
                  <div
                    className={cn(
                      "flex items-center px-4 py-3 text-[15px] font-medium rounded-xl transition-all duration-200 group",
                      item.href ? "cursor-pointer" : "cursor-default",
                      isActive
                        ? "text-[#294fd6] bg-[#294fd6]/10 border-l-4 border-[#294fd6]"
                        : "text-gray-700 hover:text-[#294fd6] hover:bg-[#294fd6]/5 border-l-4 border-transparent",
                    )}
                    onClick={() => item.subItems && setOpenSubmenu(openSubmenu === item.name ? "" : item.name)}
                  >
                    <Icon
                      className={cn(
                        "w-[18px] h-[18px] mr-3 flex-shrink-0 stroke-[1.5px] transition-colors duration-200",
                        isActive ? "text-[#294fd6]" : "text-gray-500 group-hover:text-[#294fd6]",
                      )}
                    />
                    {item.name}
                    {item.subItems && (
                      <ChevronDown
                        className={cn(
                          "ml-auto w-4 h-4 transition-transform duration-300 text-gray-400 group-hover:text-gray-600",
                          openSubmenu === item.name ? "transform rotate-180" : "",
                        )}
                      />
                    )}
                  </div>
                  {item.subItems && openSubmenu === item.name && (
                    <div className="ml-6 space-y-1 mt-1 mb-2">
                      {item.subItems.map((subItem) => {
                        const SubIcon = subItem.icon
                        const isSubActive = pathname === subItem.href

                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={cn(
                              "flex items-center px-4 py-2.5 text-[14px] font-medium rounded-lg transition-all duration-200 group",
                              isSubActive
                                ? "text-[#294fd6] bg-[#294fd6]/10"
                                : "text-gray-600 hover:text-[#294fd6] hover:bg-[#294fd6]/5",
                            )}
                          >
                            <SubIcon
                              className={cn(
                                "w-[16px] h-[16px] mr-3 flex-shrink-0 stroke-[1.5px] transition-colors duration-200",
                                isSubActive ? "text-[#294fd6]" : "text-gray-500 group-hover:text-[#294fd6]",
                              )}
                            />
                            {subItem.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Credits section at bottom */}
          <div className="p-4 mt-auto">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-2 text-[#294fd6]" />
                  <p className="text-sm font-medium text-gray-800">Credits</p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-bold text-[#294fd6]">22</span>
                  <span className="text-xs text-gray-500 ml-1">remaining</span>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#294fd6] h-2 rounded-full transition-all duration-300"
                  style={{ width: `27%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-gray-500 mt-2 mb-3">
                <span>8 used</span>
                <span>30 total</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">Growth</span>
                </div>
                <Link
                  href="/upgrade"
                  className="bg-[#294fd6] text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#1e3eb8] transition-all duration-300 flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Upgrade
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 w-full lg:pl-72">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-700 mr-3"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              type="button"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-900">Headline Generator</h2>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
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

