"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import {
  Menu,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Globe,
  Building,
  Image,
  FileText,
  Video,
  Tag,
  Palette,
  MapPin,
  ArrowLeft,
  Info,
} from "lucide-react"
import { Sidebar } from "@/app/components/layout/sidebar"
import { Saira } from "next/font/google"

// Initialize the Saira font
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-saira",
})

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
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
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

    // Handle window resize for sidebar
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [supabase])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBrandProfile((prev) => ({ ...prev, [name]: value }))

    // Clear success message when user starts editing
    if (success) setSuccess(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await supabase.from("brand_profile").upsert(brandProfile)
      if (error) throw new Error(`Failed to save brand profile: ${error.message}`)
      setSuccess("Brand profile saved successfully! Your brand information will be used to personalize your content.")

      // Mark brand profile as completed in subscriptions table
      await supabase.from("subscriptions").update({ brand_profile_completed: true }).eq("user_id", brandProfile.user_id)

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  // Helper function to render form fields with consistent styling
  const renderField = (
    label: string,
    name: keyof BrandProfile,
    placeholder: string,
    icon: React.ReactNode,
    type: "input" | "textarea" = "input",
    inputType = "text",
    helpText?: string,
  ) => {
    return (
      <div className="space-y-2">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 flex items-center">
          {icon}
          <span className="ml-2">{label}</span>
        </label>
        {type === "input" && (
          <input
            type={inputType}
            id={name}
            name={name}
            value={brandProfile[name] || ""}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            disabled={isSaving}
          />
        )}
        {type === "textarea" && (
          <textarea
            id={name}
            name={name}
            value={brandProfile[name] || ""}
            onChange={handleInputChange}
            placeholder={placeholder}
            rows={4}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            disabled={isSaving}
          />
        )}
        {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`${saira.className} flex min-h-screen bg-gray-50`}>
        <div className="fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform md:translate-x-0 -translate-x-full">
          <Sidebar subscription={subscription} />
        </div>
        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <div className="text-center p-8">
            <Loader2 className="h-10 w-10 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your brand profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${saira.className} flex min-h-screen bg-gray-50`}>
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
          className="fixed top-4 left-4 z-40 md:hidden bg-orange-500 text-white p-2 rounded-md shadow-md hover:bg-orange-600 transition-colors"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">{isSidebarOpen ? "Close menu" : "Open menu"}</span>
        </button>

        {/* Main Content */}
        <main className="p-6 pt-16 md:pt-6 pb-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <button
                    onClick={() => router.push("/company-database")}
                    className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-2"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span className="text-sm">Back to Company Database</span>
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Building className="h-6 w-6 text-orange-500 mr-2" />
                    Brand Profile
                  </h1>
                  <p className="text-gray-500 mt-1 max-w-2xl">
                    Add your brand information to help the AI write more personalized and on-brand content for your
                    business.
                  </p>
                </div>
                <div className="hidden md:flex items-center bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
                  <Info className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-sm font-medium text-orange-800">
                    {brandProfile.id ? "Profile saved" : "New profile"}
                  </span>
                </div>
              </div>

              {/* Success message */}
              {success && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white p-5">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Building className="h-5 w-5 text-orange-500 mr-2" />
                    Basic Information
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Core details about your brand</p>
                </div>

                <div className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {renderField(
                      "Brand Name",
                      "brand_name",
                      "e.g., Acme Corporation",
                      <Building className="h-4 w-4 text-orange-500" />,
                      "input",
                      "text",
                      "The official name of your company or brand",
                    )}

                    {renderField(
                      "Website Link",
                      "website_link",
                      "e.g., https://example.com",
                      <Globe className="h-4 w-4 text-orange-500" />,
                      "input",
                      "url",
                      "Your company's primary website URL",
                    )}

                    {renderField(
                      "Country of Service",
                      "country_of_service",
                      "e.g., USA, Global, Europe",
                      <MapPin className="h-4 w-4 text-orange-500" />,
                      "input",
                      "text",
                      "Where your business operates or serves customers",
                    )}

                    {renderField(
                      "Brand Colors",
                      "brand_colours",
                      "#HEX or color names, comma-separated",
                      <Palette className="h-4 w-4 text-orange-500" />,
                      "input",
                      "text",
                      "Your brand's color palette (e.g., #FF5500, #000000)",
                    )}
                  </div>

                  <div className="mt-6">
                    {renderField(
                      "Brand Description",
                      "description",
                      "Describe your brand, mission, values, and what makes you unique...",
                      <FileText className="h-4 w-4 text-orange-500" />,
                      "textarea",
                      "text",
                      "A comprehensive description of your brand, its mission, and values",
                    )}
                  </div>
                </div>
              </div>

              {/* Brand Assets Section */}
              <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white p-5">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Image className="h-5 w-5 text-orange-500 mr-2" />
                    Brand Assets
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Visual and media elements of your brand</p>
                </div>

                <div className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {renderField(
                      "Brand Logo URL",
                      "brand_logo",
                      "URL to your logo image",
                      <Image className="h-4 w-4 text-orange-500" />,
                      "input",
                      "text",
                      "Direct link to your logo image (PNG or SVG preferred)",
                    )}

                    {renderField(
                      "Product Images",
                      "product_images",
                      "Comma-separated URLs to product images",
                      <Image className="h-4 w-4 text-orange-500" />,
                      "input",
                      "text",
                      "Links to images of your products or services",
                    )}

                    {renderField(
                      "Post/Video Links",
                      "post_video_links",
                      "Comma-separated URLs to videos or posts",
                      <Video className="h-4 w-4 text-orange-500" />,
                      "input",
                      "text",
                      "Links to your videos, social media posts, or articles",
                    )}

                    {renderField(
                      "Brand Documents",
                      "brand_documents",
                      "Comma-separated URLs to documents",
                      <FileText className="h-4 w-4 text-orange-500" />,
                      "input",
                      "text",
                      "Links to brand guidelines, press kits, or other documents",
                    )}
                  </div>
                </div>
              </div>

              {/* Brand Voice Section */}
              <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white p-5">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Tag className="h-5 w-5 text-orange-500 mr-2" />
                    Brand Voice
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">How your brand communicates</p>
                </div>

                <div className="p-6">
                  <div className="grid gap-6">
                    {renderField(
                      "Company Taglines",
                      "company_taglines",
                      "Comma-separated list of taglines or slogans",
                      <Tag className="h-4 w-4 text-orange-500" />,
                      "textarea",
                      "text",
                      "Your brand's slogans, taglines, or key phrases that represent your brand voice",
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-4 z-20 shadow-lg md:static md:bg-transparent md:border-0 md:shadow-none md:p-0">
                <button
                  type="button"
                  onClick={() => router.push("/company-database")}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center shadow-sm"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Brand Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

