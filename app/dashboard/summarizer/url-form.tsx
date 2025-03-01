"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { generateBlog } from "../../actions"
import { createClient } from "@/utitls/supabase/client"
import { Link2, AlertCircle, Loader2, ArrowRight } from "lucide-react"
import ContentPlanner from "@/app/components/content-planner"

export default function URLForm() {
  const [url, setUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [generationProgress, setGenerationProgress] = useState<number>(0)
  const [timeRemaining, setTimeRemaining] = useState<number>(15 * 60) // 15 minutes in seconds
  const [isGenerated, setIsGenerated] = useState<boolean>(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkExistingContent()
  }, [])

  const checkExistingContent = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase.from("blogs").select("id").eq("user_id", user.id).limit(1)

        if (error) throw error
        if (data && data.length > 0) {
          setIsGenerated(true)
        }
      }
    } catch (error) {
      console.error("Error checking existing content:", error)
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isLoading && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1)
        setGenerationProgress((prevProgress) => {
          const newProgress = prevProgress + 100 / (15 * 60) // Increase progress every second
          return newProgress > 100 ? 100 : newProgress
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isLoading, timeRemaining])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }
    setIsLoading(true)
    setError(null)
    setGenerationProgress(0)
    setTimeRemaining(15 * 60)

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error("You need to log in first")
      }

      // Check if brand data exists
      const { data: brandData, error: brandError } = await supabase
        .from("brand_profile")
        .select("id")
        .eq("user_id", user.id)
      if (brandError) {
        throw new Error(`Failed to check brand data: ${brandError.message}`)
      }
      if (!brandData || brandData.length === 0) {
        throw new Error("No brand data found—add brand data in /company-database/brand first")
      }

      // Check if blog preferences exist
      const { data: blogPreferences, error: blogPreferencesError } = await supabase
        .from("blog_preferences")
        .select("id")
        .eq("user_id", user.id)
      if (blogPreferencesError) {
        throw new Error(`Failed to check blog preferences: ${blogPreferencesError.message}`)
      }
      if (!blogPreferences || blogPreferences.length === 0) {
        throw new Error("No blog preferences found—add blog preferences in /company-database/blog first")
      }

      // Check if content ideas exist
      const { data: contentIdeas, error: contentIdeasError } = await supabase
        .from("content_ideas")
        .select("id")
        .eq("user_id", user.id)
      if (contentIdeasError) {
        throw new Error(`Failed to check content ideas: ${contentIdeasError.message}`)
      }
      if (!contentIdeas || contentIdeas.length === 0) {
        throw new Error("No content ideas found—add content ideas in /company-database/ideas first")
      }

      console.log(`Generating blog posts for URL: ${url}, User ID: ${user.id}`)
      const newId = uuidv4()

      const result = await generateBlog(url, newId, user.id)

      if (!result || result.length === 0) {
        throw new Error("Failed to generate blog posts")
      }

      setGenerationProgress(100)
      setIsGenerated(true)
    } catch (error: any) {
      console.error(`Error generating content: ${error.message}`)
      setError(`Failed to generate content: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (isGenerated) {
    return <ContentPlanner key={Date.now()} />
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl border border-orange-200 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="p-8 pt-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="url" className="block text-sm font-semibold text-orange-900">
                Website URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Link2 className="h-5 w-5 text-orange-500" />
                </div>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-orange-50 disabled:text-orange-400 transition-all duration-200 placeholder:text-orange-300"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl animate-pulse">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Oops! Something went wrong</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Loader2 className="animate-spin h-5 w-5 text-blue-500 mr-3" />
                    <span className="text-sm font-medium text-blue-800">
                      Generating blog posts... {generationProgress < 10 ? "First post" : "Remaining posts"}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-blue-800">Time remaining: {formatTime(timeRemaining)}</span>
                </div>
                <div className="mt-2 h-2 bg-blue-200 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`w-full px-6 py-3 rounded-xl text-white font-bold flex items-center justify-center transition-all duration-300 transform ${
                isLoading
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-3 h-5 w-5 text-white" />
                  <span>Generating Blog Posts...</span>
                </>
              ) : (
                <>
                  <span>Generate Blog Posts</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

