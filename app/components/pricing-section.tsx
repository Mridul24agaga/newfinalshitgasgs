"use client"

import { useState } from "react"
import { Check, Mail, Calendar, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

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

  return (
    <section id="pricing" className="bg-white py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center">
          {/* Pill Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">Pricing Plans</span>
          </motion.div>

          {/* Heading with Highlight */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-4 text-4xl font-bold"
          >
            <span className="bg-[#e3ff40] px-3 py-1">Strategic Blogging</span> Solutions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-gray-600"
          >
            Choose the perfect plan to elevate your content marketing strategy and grow your online presence.
          </motion.p>

          {/* Billing Toggle - Updated with border instead of shadow */}
          <div className="mb-12 inline-flex items-center gap-0 rounded-full border border-gray-200 p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                !isAnnual
                  ? "bg-orange-500 text-white border-orange-500"
                  : "text-gray-600 hover:text-gray-900 border border-transparent"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                isAnnual
                  ? "bg-orange-500 text-white border-orange-500"
                  : "text-gray-600 hover:text-gray-900 border border-transparent"
              }`}
            >
              <span className="flex items-center gap-2">
                Annually
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                  SAVE 20%
                </span>
              </span>
            </button>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-8 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative overflow-hidden rounded-2xl border bg-white p-8 transition-all hover:border-orange-300 hover:shadow-lg ${
                  tier.isBestValue
                    ? "border-orange-300 shadow-xl"
                    : tier.name === "Starter"
                      ? "border-orange-200 shadow-md"
                      : "border-gray-200"
                }`}
              >
                {tier.isBestValue && (
                  <div className="absolute -right-12 top-6 rotate-45 bg-orange-500 px-12 py-1 text-xs font-medium text-white">
                    BEST VALUE
                  </div>
                )}

                <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{tier.description}</p>

                <div className="mt-6">
                  {tier.name !== "Trial" && !isAnnual && (
                    <div className="mb-2 text-xs font-medium text-orange-600">NET 67% OFF</div>
                  )}
                  {tier.name !== "Trial" && isAnnual && (
                    <div className="mb-2 text-xs font-medium text-orange-600">NET 67% + EXTRA 20% OFF</div>
                  )}

                  <div className="flex items-baseline justify-center">
                    <span className="text-2xl font-semibold text-gray-900">$</span>
                    <span className="text-5xl font-bold text-gray-900">
                      {isAnnual ? tier.price.annually : tier.price.monthly}
                    </span>
                    {tier.name !== "Trial" && <span className="ml-2 text-gray-600">/month</span>}
                  </div>

                  {isAnnual && tier.name !== "Trial" && (
                    <div className="mt-1 text-sm text-gray-600">${tier.price.annually * 12} billed yearly</div>
                  )}

                  {tier.name === "Trial" && (
                    <div className="mt-3 inline-flex items-center rounded-full bg-orange-100 px-3 py-1">
                      <span className="text-sm font-medium text-orange-700">One-time payment (not a subscription)</span>
                    </div>
                  )}
                </div>

                <a
                  href={
                    tier.name === "Trial"
                      ? tier.paymentLink.monthly
                      : isAnnual
                        ? tier.paymentLink.annually
                        : tier.paymentLink.monthly
                  }
                  className={`mt-8 block w-full rounded-lg py-3.5 text-center text-sm font-medium transition-all ${
                    tier.isBestValue
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : tier.name === "Starter"
                        ? "border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tier.name === "Trial" ? "Get One-Time Trial" : `Choose ${tier.name}`}
                </a>

                <p className="mt-3 text-xs text-gray-500">
                  {tier.name === "Trial"
                    ? "One-time payment of $7 - No subscription, no recurring charges"
                    : isAnnual
                      ? "Billed annually. Cancel anytime."
                      : "Billed monthly. Cancel anytime."}
                </p>

                <div className="mt-8">
                  <p className="mb-4 text-sm font-medium text-gray-900">Includes:</p>
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Custom Solution Section */}
          <div className="mt-16 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-50 to-orange-100 shadow-lg">
            <div className="flex flex-col md:flex-row">
              {/* Left Content */}
              <div className="p-8 md:p-10 text-left md:w-2/3">
                <div className="inline-flex items-center justify-center rounded-full bg-orange-100 px-4 py-1.5 mb-4">
                  <span className="text-sm font-medium text-orange-600">Enterprise Solutions</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Need a custom solution?</h3>
                <p className="text-lg text-gray-700 mb-6 max-w-xl">
                  Our enterprise plans are tailored to your specific needs with dedicated support and custom content
                  strategies.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Custom Publishing Schedule</h4>
                      <p className="text-gray-600">Tailored content calendar based on your industry and goals</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Dedicated Strategy Team</h4>
                      <p className="text-gray-600">Work with experts who understand your business needs</p>
                    </div>
                  </div>
                </div>

                <a
                  href="mailto:info@blogosocial.com"
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3.5 text-base font-medium text-white transition-all hover:bg-orange-600 shadow-md hover:shadow-lg group"
                >
                  Contact Sales
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              {/* Right Content - Contact Options */}
              <div className="bg-white p-8 md:p-10 md:w-1/3 flex flex-col justify-center border-t md:border-t-0 md:border-l border-orange-200">
                <h4 className="font-semibold text-gray-900 mb-6">Get in touch with us:</h4>

                <div className="space-y-5">
                  <a
                    href="mailto:info@blogosocial.com"
                    className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-orange-500" />
                    </div>
                    <span>info@blogosocial.com</span>
                  </a>

                  <div className="pt-5 mt-5 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Typically responds within 24 hours during business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

