"use client"

import { Check } from "lucide-react"
import { useState } from "react"
import { Saira } from "next/font/google"

// Initialize the Saira font with the weights we need
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-saira",
})

interface PriceData {
  monthly: Record<string, string>
  annually: Record<string, string>
  yearlyTotal: Record<string, string>
}

interface Prices {
  starter: PriceData
  professional: PriceData
}

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly")
  const [currency, setCurrency] = useState<"$" | "₹">("$")

  const prices: Prices = {
    starter: {
      monthly: {
        $: "147",
        "₹": "10K",
      },
      annually: {
        $: "119",
        "₹": "8.5K",
      },
      yearlyTotal: {
        $: "1427",
        "₹": "102,000",
      },
    },
    professional: {
      monthly: {
        $: "227",
        "₹": "16K",
      },
      annually: {
        $: "179",
        "₹": "13K",
      },
      yearlyTotal: {
        $: "2197",
        "₹": "156,000",
      },
    },
  }

  const getPriceDisplay = (plan: keyof Prices) => {
    const period = billingPeriod === "monthly" ? "monthly" : "annually"
    return prices[plan][period][currency]
  }

  const getYearlyTotal = (plan: keyof Prices) => {
    return prices[plan].yearlyTotal[currency]
  }

  return (
    <div id="pricing" className={`${saira.className} max-w-6xl mx-auto px-4 py-16`}>
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-1 rounded-full border border-[#FF9626] text-[#FF9626] text-sm mb-4">
          <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 8V16M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" />
          </svg>
          PRICINGS
        </div>
        <h2 className="text-4xl font-bold mb-4">Save Money, Boost SEO</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          By opting for our service, you're not just saving money—you're ensuring consistent, high-quality content that
          strengthens your SEO and delivers long-term growth.
        </p>
      </div>

      {/* Updated Billing Toggle */}
      <div className="flex justify-center items-center gap-4 mb-12">
        <div className="flex items-center">
          {/* Monthly/Annually Toggle */}
          <div className="bg-[#1A1A1A] rounded-full p-1 flex items-center">
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                billingPeriod === "monthly" ? "text-[#FF9626]" : "text-white"
              }`}
              onClick={() => setBillingPeriod("monthly")}
            >
              Monthly
            </button>
            <div className="relative">
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  billingPeriod === "annually" ? "bg-[#FF9626] text-white" : "text-white"
                }`}
                onClick={() => setBillingPeriod("annually")}
              >
                Anually
                {billingPeriod === "annually" && (
                  <span className="absolute -top-3 -right-2 bg-[#FF9626] text-[10px] text-white px-1.5 py-0.5 rounded-full border border-black">
                    SAVE 20%
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="w-px h-6 bg-gray-700 mx-4"></div>

          {/* Currency Toggle */}
          <div className="bg-[#1A1A1A] rounded-full p-1 flex items-center">
            <button
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                currency === "$" ? "bg-[#FF9626] text-white" : "text-white"
              }`}
              onClick={() => setCurrency("$")}
            >
              $
            </button>
            <button
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                currency === "₹" ? "bg-[#FF9626] text-white" : "text-white"
              }`}
              onClick={() => setCurrency("₹")}
            >
              ₹
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Starter Plan */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-[#FF9626] p-6 text-center">
            <h3 className="text-2xl font-bold text-white">Starter</h3>
            <p className="text-white/90 text-sm mt-1">Ideal for growing your online presence</p>
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <div className="text-[#FF9626] font-medium mb-1">NET 67% OFF</div>
              <div className="flex items-end justify-center">
                <span className="text-4xl font-bold">
                  {currency}
                  {getPriceDisplay("starter")}
                </span>
                <span className="text-gray-600 ml-1">/Month</span>
              </div>
              <button className="mt-4 px-8 py-2 rounded-full border-2 border-[#FF9626] text-[#FF9626] font-semibold hover:bg-[#FF9626] hover:text-white transition-colors">
                Choose Starter
              </button>
              <div className="text-sm text-gray-500 mt-2">
                {billingPeriod === "monthly"
                  ? "Billed monthly, cancel anytime"
                  : `${currency}${getYearlyTotal("starter")} billed yearly`}
              </div>
            </div>

            <div>
              <div className="font-semibold mb-4">Includes:</div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>30 professionally written blog posts per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>Comprehensive content strategy</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>Advanced SEO optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>Social media integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>Monthly performance reports</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Professional Plan */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-[#FF9626] p-6 text-center">
            <h3 className="text-2xl font-bold text-white">Professional</h3>
            <p className="text-white/90 text-sm mt-1">For businesses serious about content marketing</p>
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <div className="text-[#FF9626] font-medium mb-1">NET 67% OFF</div>
              <div className="flex items-end justify-center">
                <span className="text-4xl font-bold">
                  {currency}
                  {getPriceDisplay("professional")}
                </span>
                <span className="text-gray-600 ml-1">/Month</span>
              </div>
              <button className="mt-4 px-8 py-2 rounded-full border-2 border-[#FF9626] text-[#FF9626] font-semibold hover:bg-[#FF9626] hover:text-white transition-colors">
                Choose Professional
              </button>
              <div className="text-sm text-gray-500 mt-2">
                {billingPeriod === "monthly"
                  ? "Billed monthly, cancel anytime"
                  : `${currency}${getYearlyTotal("professional")} billed yearly`}
              </div>
            </div>

            <div>
              <div className="font-semibold mb-4">Includes:</div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>60 professionally written blog posts per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>Advanced content strategy and planning</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>Premium SEO tools and optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>Full suite of social media integrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>Content performance analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>Priority support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Solution Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <div className="bg-[#FFF6F0] border border-[#E5E7EB] rounded-[24px] flex flex-col md:flex-row">
          <div className="flex-1 p-8 md:border-r border-[#E5E7EB]">
            <div className="inline-block px-4 py-1.5 bg-[#FF9626] rounded-full text-white text-sm font-medium">
              Enterprise Solutions
            </div>

            <h2 className="text-[32px] font-bold mt-4 mb-3" style={{ letterSpacing: "-0.02em" }}>
              Need a custom solution?
            </h2>
            <p className="text-[#4B5563] text-lg mb-8">
              My enterprise plans are tailored to your specific needs with dedicated support and custom content
              strategies.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-[#FF9626] rounded-full p-3.5 shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path
                      d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[#111827] font-semibold text-lg mb-1">Custom Publishing Schedule</h3>
                  <p className="text-[#4B5563]">Tailored content calendar based on your industry and goals</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#FF9626] rounded-full p-3.5 shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path
                      d="M9.16 10.87C9.06 10.86 8.94 10.86 8.83 10.87C6.45 10.79 4.56 8.84 4.56 6.44C4.56 3.99 6.54 2 9 2C11.45 2 13.44 3.99 13.44 6.44C13.43 8.84 11.54 10.79 9.16 10.87Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.41 4C18.35 4 19.91 5.57 19.91 7.5C19.91 9.39 18.41 10.93 16.54 11C16.46 10.99 16.37 10.99 16.28 11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.16 14.56C1.74 16.18 1.74 18.82 4.16 20.43C6.91 22.27 11.42 22.27 14.17 20.43C16.59 18.81 16.59 16.17 14.17 14.56C11.43 12.73 6.92 12.73 4.16 14.56Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.34 20C19.06 19.85 19.74 19.56 20.3 19.13C21.86 17.96 21.86 16.03 20.3 14.86C19.75 14.44 19.08 14.16 18.37 14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[#111827] font-semibold text-lg mb-1">Dedicated Strategy Team</h3>
                  <p className="text-[#4B5563]">Work with experts who understand your business needs</p>
                </div>
              </div>
            </div>

            <button className="bg-[#FF9626] text-white px-6 py-3 rounded-full font-medium inline-flex items-center group hover:bg-[#e08520] transition-colors">
              Contact Sales
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="ml-2 transform transition-transform group-hover:translate-x-1"
              >
                <path
                  d="M4.16669 10H15.8334M15.8334 10L10 4.16669M15.8334 10L10 15.8334"
                  stroke="currentColor"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="md:w-80 p-8">
            <h3 className="text-[#111827] text-xl font-semibold mb-6">Get in Touch with Me:</h3>
            <div className="flex items-start gap-4">
              <div className="bg-[#FF9626] rounded-full p-3.5 shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path
                    d="M17 21H7C4 21 2 19 2 16V8C2 5 4 3 7 3H17C20 3 22 5 22 8V16C22 19 20 21 17 21Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <a href="mailto:info@blogosocial.com" className="text-[#FF9626] font-medium hover:underline">
                  info@blogosocial.com
                </a>
                <p className="text-sm text-[#6B7280] mt-2">Typically responds within 24 hours during business days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

