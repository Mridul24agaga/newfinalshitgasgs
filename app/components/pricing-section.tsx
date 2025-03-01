"use client"

import { useState } from "react"
import { Check } from "lucide-react"

interface PricingTier {
  name: string
  description: string
  price: {
    monthly: number
    annually: number
  }
  credits: number
  features: string[]
  isBestValue?: boolean
}

const pricingTiers: PricingTier[] = [
  {
    name: "Lite",
    description: "For creators just starting out",
    price: {
      monthly: 815,
      annually: 815 * 0.5 * 12, // 50% discount for annual
    },
    credits: 100,
    features: [
      "AI Clips & Captions",
      "AI Video Generator",
      "AI Video Resizing to 16:9, 9:16, 1:1",
      "Full HD 1080p Exports",
      "Basic TikTok Publishing",
    ],
  },
  {
    name: "Essential",
    description: "For creators just starting out",
    price: {
      monthly: 1759,
      annually: 1759 * 0.5 * 12,
    },
    credits: 300,
    features: [
      "Everything in Lite, plus:",
      "Premium access to 10+ AI Tools",
      "AI Filter & Silence Removal",
      "AI Influencer, AI Writer & more",
      "1-Click Schedule to 7 Social Platforms",
      "Bring Your Own Content & Schedule",
      "AI Content Planner",
    ],
  },
  {
    name: "Growth",
    description: "For creators just starting out",
    price: {
      monthly: 2102,
      annually: 2102 * 0.5 * 12,
    },
    credits: 600,
    features: [
      "Everything in Essential, plus:",
      "Unlimited Social Scheduling",
      "Bulk Publishing",
      "Advanced AI Analytics",
      "Custom Templates & Brand Kit",
      "AI Carousel & more",
      "Priority Support",
    ],
    isBestValue: true,
  },
]

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">We've got a plan that's perfect for you.</h2>

          {/* Billing Toggle */}
          <div className="mb-12 inline-flex items-center gap-4 rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                !isAnnual ? "bg-white shadow-sm" : "text-gray-600"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                isAnnual ? "bg-white shadow-sm" : "text-gray-600"
              }`}
            >
              <span className="flex items-center gap-2">
                Annually
                <span className="text-xs font-normal text-emerald-600">(Save up to 50% with annual billing)</span>
              </span>
            </button>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-8 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border p-8 transition-all hover:border-gray-300 ${
                  tier.isBestValue ? "border-gray-300 shadow-lg" : "border-gray-200"
                }`}
              >
                {tier.isBestValue && (
                  <div className="absolute -top-3 right-4 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
                    ✨ Best Value
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{tier.description}</p>

                <div className="mt-6">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-semibold">₹</span>
                    <span className="text-4xl font-bold">
                      {isAnnual ? (tier.price.annually / 12).toFixed(0) : tier.price.monthly}
                    </span>
                    <span className="ml-2 text-gray-600">/month</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{tier.credits} credits</p>
                </div>

                <button
                  className={`mt-6 w-full rounded-lg py-3 text-sm font-medium transition-all ${
                    tier.isBestValue
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Upgrade to {tier.name}
                </button>

                <p className="mt-3 text-xs text-gray-500">Billed monthly. Cancel Anytime.</p>

                <div className="mt-8">
                  <p className="mb-4 text-sm font-medium text-gray-900">Includes:</p>
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-900" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

