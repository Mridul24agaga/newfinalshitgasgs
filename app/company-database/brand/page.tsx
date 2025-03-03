"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { Menu } from "lucide-react"
import { Sidebar } from "@/app/components/sidebar"

interface BrandProfile {
  id?: number
  user_id: string
  website_link: string | null
  brand_name: string | null
  product_images: string | null
  description: string | null
  brand_documents: string | null
  brand_logo: string | null
  post_video_links: string | null
  company_taglines: string | null
  brand_colours: string | null
  country_of_service: string | null
}

interface Subscription {
  plan_id: string
  credits: number
}

export default function BrandProfilePage() {
  const [brandProfile, setBrandProfile] = useState<BrandProfile>({
    user_id: "",
    website_link: "",
    brand_name: "",
    product_images: "",
    description: "",
    brand_documents: "",
    brand_logo: "",
    post_video_links: "",
    company_taglines: "",
    brand_colours: "",
    country_of_service: "",
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()
        if (authError || !user) {
          throw new Error("You must be logged in to view this page.")
        }

        const [brandProfileResponse, subscriptionResponse] = await Promise.all([
          supabase.from("brand_profile").select("*").eq("user_id", user.id).single(),
          supabase.from("subscriptions").select("*").eq("user_id", user.id).single(),
        ])

        if (brandProfileResponse.error && brandProfileResponse.error.code !== "PGRST116") {
          throw new Error(`Failed to fetch brand profile: ${brandProfileResponse.error.message}`)
        }

        if (subscriptionResponse.error) {
          throw new Error(`Failed to fetch subscription: ${subscriptionResponse.error.message}`)
        }

        if (brandProfileResponse.data) {
          setBrandProfile({ ...brandProfileResponse.data, user_id: user.id })
        } else {
          setBrandProfile((prev) => ({ ...prev, user_id: user.id }))
        }

        if (subscriptionResponse.data) {
          setSubscription(subscriptionResponse.data)
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBrandProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await supabase.from("brand_profile").upsert(brandProfile)
      if (error) throw new Error(`Failed to save brand profile: ${error.message}`)
      setSuccess("Brand profile saved successfully!")
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <Sidebar subscription={subscription} />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 transition-all duration-300 ease-in-out">
        {/* Hamburger Menu */}
        <button
          className="fixed top-4 left-4 z-40 md:hidden bg-orange-500 text-white p-2 rounded-md"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">{isSidebarOpen ? "Close menu" : "Open menu"}</span>
        </button>

        {/* Main Content */}
        <main className="p-6 pt-16 md:pt-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Brand Profile</h1>
              <p className="text-sm text-gray-500 mt-1">
                Add your brand info to help the AI write better blog posts, tied to your account!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6 bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900">Brand Information</h2>

                <div className="grid gap-6 md:grid-cols-2">
                  {[
                    { label: "Website Link", name: "website_link", type: "url", placeholder: "e.g., https://xai.com" },
                    { label: "Brand Name", name: "brand_name", type: "text", placeholder: "e.g., xAI" },
                    {
                      label: "Product Images",
                      name: "product_images",
                      type: "text",
                      placeholder: "Comma-separated URLs",
                    },
                    {
                      label: "Brand Documents",
                      name: "brand_documents",
                      type: "text",
                      placeholder: "Comma-separated URLs or paths",
                    },
                    { label: "Brand Logo", name: "brand_logo", type: "text", placeholder: "URL or path" },
                    {
                      label: "Post/Video Links",
                      name: "post_video_links",
                      type: "text",
                      placeholder: "Comma-separated URLs",
                    },
                    {
                      label: "Company Taglines",
                      name: "company_taglines",
                      type: "text",
                      placeholder: "Comma-separated",
                    },
                    {
                      label: "Brand Colours",
                      name: "brand_colours",
                      type: "text",
                      placeholder: "#HEX or color names, comma-separated",
                    },
                    {
                      label: "Country of Service",
                      name: "country_of_service",
                      type: "text",
                      placeholder: "e.g., USA, Global",
                    },
                  ].map((field) => (
                    <div key={field.name}>
                      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={brandProfile[field.name as keyof BrandProfile] || ""}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                        disabled={isLoading}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={brandProfile.description || ""}
                    onChange={handleInputChange}
                    placeholder="e.g., xAI builds AI to accelerate human scientific discovery..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    rows={4}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/company-database")}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Brand Profile"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

