"use client"

import { useState } from "react"
import { Check, Sparkles } from "lucide-react"

interface PricingTier {
  name: string
  description: string
  price: {
    monthly: number
    annually: number
  }
  blogs: {
    monthly: number
    annually: number
  }
  features: string[]
  isBestValue?: boolean
  paymentLink: {
    monthly: string
    annually: string
  }
}

const pricingTiers: PricingTier[] = [
  {
    name: "Trial",
    description: "Experience our strategic blogging service with a one-time trial",
    price: {
      monthly: 7,
      annually: 7,
    },
    blogs: {
      monthly: 2,
      annually: 2,
    },
    features: [
      "2 professionally written blog posts trial",
      "Basic SEO optimization",
      "Content strategy consultation",
      "Standard support",
    ],
    paymentLink: {
      monthly: "https://checkout.dodopayments.com/buy/pdt_bSXwqeQHE0s6c8h6xicza",
      annually: "https://checkout.dodopayments.com/buy/pdt_bSXwqeQHE0s6c8h6xicza",
    },
  },
  {
    name: "Starter",
    description: "Ideal for growing your online presence",
    price: {
      monthly: 74,
      annually: 59,
    },
    blogs: {
      monthly: 10,
      annually: 10,
    },
    features: [
      "10 professionally written blog posts per month",
      "Comprehensive content strategy",
      "Advanced SEO optimization",
      "Social media integration",
      "Monthly performance reports",
      "Email support",
    ],
    paymentLink: {
      monthly: "https://checkout.dodopayments.com/buy/pdt_9Buf4nLX6lHbdbPEchvoI",
      annually: "https://checkout.dodopayments.com/buy/pdt_Z4Diw1kvIgpbFZs7ljfnu",
    },
  },
  {
    name: "Professional",
    description: "For businesses serious about content marketing",
    price: {
      monthly: 147,
      annually: 119,
    },
    blogs: {
      monthly: 30,
      annually: 30,
    },
    features: [
      "30 professionally written blog posts per month",
      "Advanced content strategy and planning",
      "Premium SEO tools and optimization",
      "Full suite of social media integrations",
      "Content performance analytics",
      "Dedicated account manager",
      "Priority support",
    ],
    isBestValue: true,
    paymentLink: {
      monthly: "https://checkout.dodopayments.com/buy/pdt_I9yAEB0jgVzOYo8uDiSX3",
      annually: "https://checkout.dodopayments.com/buy/pdt_zYXfbCA92y3XSQlIKcAZi",
    },
  },
]

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

  const getYearlyTotal = (monthlyPrice: number) => {
    return monthlyPrice * 12
  }

  return (
    <section id="pricing" className="bg-white py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">Strategic Blogging Solutions Tailored for You</h2>

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
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  67% + 20% OFF
                </span>
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
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> Best Value
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{tier.description}</p>

                <div className="mt-6">
                  {tier.name !== "Trial" && !isAnnual && (
                    <div className="mb-2 text-xs font-medium text-rose-600">NET 67% OFF</div>
                  )}
                  {tier.name !== "Trial" && isAnnual && (
                    <div className="mb-2 text-xs font-medium text-rose-600">NET 67% + EXTRA 20% OFF</div>
                  )}

                  <div className="flex items-baseline justify-center">
                    <span className="text-2xl font-semibold">$</span>
                    <span className="text-4xl font-bold">{isAnnual ? tier.price.annually : tier.price.monthly}</span>
                    <span className="ml-2 text-gray-600">/month</span>
                  </div>

                  {isAnnual && tier.name !== "Trial" && (
                    <div className="mt-1 text-sm text-gray-600">${tier.price.annually * 12} billed yearly</div>
                  )}

                  <p className="mt-1 text-sm text-gray-600">
                    {isAnnual ? tier.blogs.annually : tier.blogs.monthly} expert-written blogs per month
                  </p>
                </div>

                <a
                  href={
                    tier.name === "Trial"
                      ? tier.paymentLink.monthly
                      : isAnnual
                        ? tier.paymentLink.annually
                        : tier.paymentLink.monthly
                  }
                  className={`mt-6 block w-full rounded-lg py-3 text-center text-sm font-medium transition-all ${
                    tier.isBestValue
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tier.name === "Trial" ? "Start Trial" : `Choose ${tier.name}`}
                </a>

                <p className="mt-3 text-xs text-gray-500">
                  {tier.name === "Trial"
                    ? "One-time payment, no subscription"
                    : isAnnual
                      ? "Billed annually. Cancel anytime."
                      : "Billed monthly. Cancel anytime."}
                </p>

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

