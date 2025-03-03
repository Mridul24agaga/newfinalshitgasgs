"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"
import { Check } from "lucide-react"

// Use the live mode URL for Dodo Payments
const DODO_URL = "https://test.checkout.dodopayments.com/buy"

interface Plan {
  id: string
  name: string
  description: string
  price: number
  credits: number
  dodoProductId: string
  features: string[]
}

const plans: Plan[] = [
  {
    id: "trial",
    name: "Trial",
    description: "For creators just starting out",
    price: 0,
    credits: 2,
    dodoProductId: "pdt_aKk7uYTudrZ8lzrpba34K",
    features: [
      "2 blog posts",
      "Basic blog editing tools",
      "Standard templates",
      "Limited image library access",
      "Email support",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    description: "For regular content creators",
    price: 9.99,
    credits: 10,
    dodoProductId: "pdt_aKk7uYTudrZ8lzrpba34K",
    features: [
      "10 blog posts",
      "Advanced editing tools",
      "SEO optimization suggestions",
      "Expanded template library",
      "Full image library access",
      "Priority email support",
      "Basic analytics",
      "Full Content Planner",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For professional bloggers",
    price: 24.99,
    credits: 30,
    dodoProductId: "pdt_aKk7uYTudrZ8lzrpba34K",
    features: [
      "30 blog posts",
      "Premium editing suite",
      "Advanced SEO tools",
      "Custom template creation",
      "Unlimited image library + stock photos",
      "Priority phone & email support",
      "Detailed performance analytics",
      "Collaboration tools",
      "Full Content Planner",
      "Social media integration",
    ],
  },
]

export function PaymentPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setDebugInfo("Checking user authentication...")
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError) {
          throw new Error(`Authentication error: ${authError.message}`)
        }

        if (!user) {
          setDebugInfo("No authenticated user found.")
          return
        }

        setDebugInfo(`User authenticated. Checking subscription for user ID: ${user.id}`)

        const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).single()

        if (error) {
          if (error.code === "PGRST116") {
            setDebugInfo("No subscription found for user.")
            return
          }
          throw error
        }

        if (data) {
          setDebugInfo(`Subscription found: ${JSON.stringify(data)}`)
          router.push("/dashboard")
        } else {
          setDebugInfo("No active subscription found.")
        }
      } catch (err) {
        console.error("Error checking subscription:", err)
        if (err instanceof Error) {
          setError(`Failed to check subscription status: ${err.message}`)
          setDebugInfo(`Error details: ${JSON.stringify(err)}`)
        } else {
          setError("An unknown error occurred while checking subscription status.")
          setDebugInfo(`Unknown error: ${JSON.stringify(err)}`)
        }
      }
    }

    checkSubscription()
  }, [router, supabase])

  const handleSubscribe = async (plan: Plan) => {
    setLoading(true)
    setError(null)
    setDebugInfo(null)

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) throw new Error(`Authentication error: ${authError.message}`)
      if (!user) throw new Error("User not authenticated")

      setDebugInfo(`User authenticated. User ID: ${user.id}`)

      // Construct the checkout URL with redirect
      const successUrl = encodeURIComponent(
        `${window.location.origin}/payment-success?user_id=${user.id}&plan=${plan.id}&credits=${plan.credits}`,
      )
      const checkoutUrl = `${DODO_URL}/${plan.dodoProductId}?quantity=1&redirect_url=${successUrl}`

      setDebugInfo(`Redirecting to checkout URL: ${checkoutUrl}`)

      // Redirect to Dodo Payments checkout
      window.location.href = checkoutUrl
    } catch (err) {
      console.error("Subscription error:", err)
      if (err instanceof Error) {
        setError(`Failed to process subscription: ${err.message}`)
        setDebugInfo(`Error details: ${JSON.stringify(err)}`)
      } else {
        setError("Failed to process subscription. Please try again.")
        setDebugInfo(`Unknown error: ${JSON.stringify(err)}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3 text-gray-900">We've got a plan that's perfect for you.</h1>
      </div>

      <div className="flex justify-center mb-10">
        <div className="inline-flex rounded-full bg-gray-100 p-1">
          <button className="px-6 py-2 rounded-full bg-white shadow-sm font-medium">Monthly</button>
          <button className="px-6 py-2 rounded-full text-gray-600 font-medium">Annually</button>
        </div>
        <div className="ml-2 text-sm text-green-600 font-medium self-center">(Save up to 50% with annual billing)</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div
            key={plan.id}
            className={`border rounded-xl overflow-hidden ${
              index === 2 ? "border-blue-200 relative" : "border-gray-200"
            }`}
          >
            {index === 2 && (
              <div className="absolute top-0 right-0 bg-blue-900 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                Best Value
              </div>
            )}

            <div className="p-6">
              <h2 className="text-2xl font-bold text-center mb-1">{plan.name}</h2>
              <p className="text-gray-600 text-center text-sm mb-6">{plan.description}</p>

              <div className="text-center mb-2">
                <span className="text-4xl font-bold">${plan.price.toFixed(2)}</span>
                <span className="text-gray-500 text-sm">/month</span>
              </div>

              <div className="text-center mb-6">
                <span className="text-gray-600">{plan.credits} credits</span>
              </div>

              <button
                className={`w-full py-3 rounded-lg font-medium mb-2 ${
                  index === 2 ? "bg-blue-900 text-white hover:bg-blue-800" : "border border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => handleSubscribe(plan)}
                disabled={loading}
              >
                {loading ? "Processing..." : `Upgrade to ${plan.name}`}
              </button>

              <p className="text-xs text-center text-gray-500 mb-6">Billed monthly. Cancel Anytime.</p>

              <div>
                <p className="font-medium mb-3">Includes:</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {debugInfo && (
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm font-mono text-gray-600 whitespace-pre-wrap">{debugInfo}</p>
        </div>
      )}
    </div>
  )
}

