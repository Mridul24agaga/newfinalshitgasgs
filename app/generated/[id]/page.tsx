"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import CustomEditor from "@/app/components/CustomEditor"
import { createClient } from "@/utitls/supabase/client"
import { Loader2, ArrowLeft, Save, FileText, ChevronLeft, MoreHorizontal, Share2, Download, Trash2 } from "lucide-react"

// Types
type MetricType = {
  count: number
  range: string
}

type ContentBriefType = {
  words: MetricType
  headings: MetricType
  paragraphs: MetricType
  images: MetricType
  readability: { score: number; level: string }
  keywords: string[]
}

export default function GeneratedBlogPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()

  // State
  const [blogPost, setBlogPost] = useState<string>("")
  const [citations, setCitations] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [title, setTitle] = useState<string>("")
  const [lastSaved, setLastSaved] = useState<string>("")
  const [showDropdown, setShowDropdown] = useState<boolean>(false)

  // Mock data for content brief
  const contentBrief: ContentBriefType = {
    words: {
      count: 1139,
      range: "2,000-2,404",
    },
    headings: {
      count: 0,
      range: "5-36",
    },
    paragraphs: {
      count: 1,
      range: "65-117",
    },
    images: {
      count: 0,
      range: "3-29",
    },
    readability: {
      score: 30.3,
      level: "College grade",
    },
    keywords: [
      "eating plan 3/1-3",
      "intermittent fasting 43/16-19",
      "fasting 7/7/5-7",
      "masks 0/1-3",
      "people 5/6-8",
      "research 10/4-6",
    ],
  }

  useEffect(() => {
    fetchBlog()

    // Close dropdown when clicking outside
    const handleClickOutside = () => {
      setShowDropdown(false)
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  const fetchBlog = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        setError("Authentication required")
        setBlogPost("<p>Please log in to continue.</p>")
        setCitations([])
        router.push("/auth")
        return
      }

      const { data, error: fetchError } = await supabase
        .from("blogs")
        .select("blog_post, citations, title, reveal_date")
        .eq("id", params.id)
        .eq("user_id", user.id)
        .single()

      if (fetchError || !data) {
        setError("Blog not found")
        setBlogPost("<p>This blog post could not be found.</p>")
        setCitations([])
      } else {
        setBlogPost(data.blog_post)
        setTitle(data.title || "Untitled Blog Post")

        // Parse citations
        let parsedCitations: string[] = []
        if (typeof data.citations === "string") {
          try {
            parsedCitations = JSON.parse(data.citations)
            if (!Array.isArray(parsedCitations)) {
              parsedCitations = [data.citations]
            }
          } catch (parseError) {
            parsedCitations = data.citations.split(",").map((item: string) => item.trim())
          }
        } else if (Array.isArray(data.citations)) {
          parsedCitations = data.citations
        }

        setCitations(parsedCitations)
        setLastSaved(new Date().toLocaleTimeString())
      }
    } catch (err) {
      setError("Failed to load blog")
      setBlogPost("<p>An error occurred while loading the blog.</p>")
      setCitations([])
    } finally {
      setLoading(false)
    }
  }

  const handleContentChange = async (newContent: string) => {
    setBlogPost(newContent)
    setSaving(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { error } = await supabase
          .from("blogs")
          .update({ blog_post: newContent })
          .eq("id", params.id)
          .eq("user_id", user.id)

        if (!error) {
          setLastSaved(new Date().toLocaleTimeString())
        }
      }
    } catch (err) {
      console.error("Error saving blog:", err)
    } finally {
      setTimeout(() => setSaving(false), 500)
    }
  }

  // Consolidated action handler for all button clicks
  const handleAction = (action: string) => {
    switch (action) {
      case "back":
        router.push("/dashboard")
        break
      case "generateMore":
        console.log("Generate More clicked")
        break
      case "share":
        console.log("Share clicked")
        break
      case "export":
        console.log("Export as PDF clicked")
        break
      case "duplicate":
        console.log("Duplicate clicked")
        break
      case "delete":
        console.log("Delete clicked")
        break
      case "publish":
        console.log("Publish clicked")
        break
      default:
        break
    }
  }

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDropdown(!showDropdown)
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 opacity-25" />
            <Loader2
              className="w-16 h-16 animate-spin text-blue-600 absolute top-0 left-0"
              style={{ animationDelay: "-0.5s" }}
            />
          </div>
          <p className="text-slate-600 font-medium text-lg">Loading your blog post...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center max-w-md p-8 bg-white">
          <div className="bg-red-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">{error}</h1>
          <p className="text-slate-600 mb-8">We couldn't load your blog post. Please try again later.</p>
          <button
            onClick={() => handleAction("back")}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-base font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Main content
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-10 bg-white w-full">
        <div className="w-full px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleAction("back")}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              title="Back to Dashboard"
            >
              <ChevronLeft className="h-5 w-5 text-slate-600" />
              <span className="sr-only">Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-slate-500">
                {saving ? "Saving..." : `Saved at ${lastSaved}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop action buttons */}

            {/* Dropdown menu */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                title="More options"
              >
                <MoreHorizontal className="h-5 w-5 text-slate-600" />
                <span className="sr-only">More options</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white py-1 z-20">
                  {/* Mobile-only actions */}
                  <button
                    onClick={() => handleAction("share")}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center md:hidden"
                  >
                    <Share2 className="h-4 w-4 mr-2 text-slate-500" />
                    Share
                  </button>
                  <button
                    onClick={() => handleAction("generateMore")}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center md:hidden"
                  >
                    <Save className="h-4 w-4 mr-2 text-slate-500" />
                    Generate More
                  </button>
                  <hr className="my-1 border-slate-200 md:hidden" />

                  {/* Common actions */}
                  <button
                    onClick={() => handleAction("export")}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2 text-slate-500" />
                    Export as PDF
                  </button>
                  <button
                    onClick={() => handleAction("duplicate")}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2 text-slate-500" />
                    Duplicate
                  </button>
                  <hr className="my-1 border-slate-200" />
                  <button
                    onClick={() => handleAction("delete")}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto bg-white">
          <div className="w-full h-full">
            {/* Editor section */}
            <div className="w-full h-full bg-white">
              <div className="p-4">
                <CustomEditor
                  initialValue={blogPost}
                  onChange={handleContentChange}
                  images={[]}
                  onGenerateMore={() => handleAction("generateMore")}
                  citations={citations}
                  postId={params.id as string}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

