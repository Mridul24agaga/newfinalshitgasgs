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
  trial: Record<string, string>
  starter: PriceData
  professional: PriceData
}

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly")
  const [currency, setCurrency] = useState<"$" | "₹">("$")

  const prices: Prices = {
    trial: {
      $: "17",
      "₹": "1.2K",
    },
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

  // Add this mapping object after the prices object and before the getPriceDisplay function
  const checkoutLinks = {
    trial: {
      $: "https://checkout.dodopayments.com/buy/pdt_trial123?quantity=1",
      "₹": "https://checkout.dodopayments.com/buy/pdt_trial123?quantity=1",
    },
    starter: {
      monthly: {
        $: "https://checkout.dodopayments.com/buy/pdt_I9yAEB0jgVzOYo8uDiSX3?quantity=1",
        "₹": "https://checkout.dodopayments.com/buy/pdt_I9yAEB0jgVzOYo8uDiSX3?quantity=1",
      },
      annually: {
        $: "https://checkout.dodopayments.com/buy/pdt_zYXfbCA92y3XSQlIKcAZi?quantity=1",
        "₹": "https://checkout.dodopayments.com/buy/pdt_zYXfbCA92y3XSQlIKcAZi?quantity=1",
      },
    },
    professional: {
      monthly: {
        $: "https://checkout.dodopayments.com/buy/pdt_9Buf4nLX6lHbdbPEchvoI?quantity=1",
        "₹": "https://checkout.dodopayments.com/buy/pdt_9Buf4nLX6lHbdbPEchvoI?quantity=1",
      },
      annually: {
        $: "https://checkout.dodopayments.com/buy/pdt_Z4Diw1kvIgpbFZs7ljfnu?quantity=1",
        "₹": "https://checkout.dodopayments.com/buy/pdt_Z4Diw1kvIgpbFZs7ljfnu?quantity=1",
      },
    },
    enterprise: {
      $: "https://checkout.dodopayments.com/buy/pdt_mNOfbCA92y3XSQlIKcAZz?quantity=1",
      "₹": "https://checkout.dodopayments.com/buy/pdt_pQRfbCA92y3XSQlIKcAAa?quantity=1",
    },
  }

  // Get trial checkout link
  const getTrialCheckoutLink = () => {
    return checkoutLinks.trial[currency]
  }

  // Add this function to get the checkout link
  const getCheckoutLink = (plan: "starter" | "professional") => {
    return checkoutLinks[plan][billingPeriod][currency]
  }

  // Add this function to get the enterprise checkout link
  const getEnterpriseCheckoutLink = () => {
    return checkoutLinks.enterprise[currency]
  }

  const getPriceDisplay = (plan: keyof Omit<Prices, "trial">) => {
    const period = billingPeriod === "monthly" ? "monthly" : "annually"
    return prices[plan][period][currency]
  }

  const getYearlyTotal = (plan: keyof Omit<Prices, "trial">) => {
    return prices[plan].yearlyTotal[currency]
  }

  // Features for the starter plan
  const starterFeatures = {
    monthly: [
      "30 Blog posts a month",
      "Up to 8 images per blog",
      "Branded blogs",
      "Company and idea database",
      "Performance analytics",
      "Blog settings",
      "Dedicated SEO expert",
      "Account manager",
      "Engagement centric blog",
      "ICP research updated monthly",
      "Latest News and trends tracker",
      "30-Day content planner",
      "Internal and external linking",
      "Upto 3000 words",
      "Human & AI Fact checking",
      "Low KD keywords targeting",
      "Tables, Youtube videos and source additions",
      "Priority support",
    ],
    annually: [
      "30 Blog posts a month",
      "Up to 8 images per blog",
      "Branded blogs",
      "Company and idea database",
      "Performance analytics",
      "Blog settings",
      "Dedicated SEO expert",
      "Account manager",
      "Engagement centric blog",
      "ICP research updated monthly",
      "Latest News and trends tracker",
      "30-Day content planner",
      "Internal and external linking",
      "Upto 3000 words",
      "Human & AI Fact checking",
      "Low KD keywords targeting",
      "Tables, Youtube videos and source additions",
      "Priority support",
    ],
  }

  // Features for the professional plan
  const professionalFeatures = {
    monthly: [
      "60 Blog posts a month",
      "Up to 8 images per blog",
      "Branded blogs",
      "Company and idea database",
      "Performance analytics",
      "Blog settings",
      "Dedicated SEO expert",
      "Account manager",
      "Engagement centric blog",
      "ICP research updated monthly",
      "Latest News and trends tracker",
      "30-Day content planner",
      "Internal and external linking",
      "Upto 4000 words",
      "Human & AI Fact checking",
      "Low KD keywords targeting",
      "Central keyword strategy",
      "Tables, Youtube videos and source additions",
      "Priority support",
    ],
    annually: [
      "60 Blog posts a month",
      "Up to 8 images per blog",
      "Branded blogs",
      "Company and idea database",
      "Performance analytics",
      "Blog settings",
      "Dedicated SEO expert",
      "Account manager",
      "Engagement centric blog",
      "ICP research updated monthly",
      "Latest News and trends tracker",
      "30-Day content planner",
      "Internal and external linking",
      "Upto 4000 words",
      "Human & AI Fact checking",
      "Low KD keywords targeting",
      "Central keyword strategy",
      "Tables, Youtube videos and source additions",
      "Priority support",
    ],
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
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Trial Plan */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-[#FF9626] p-6 text-center">
            <h3 className="text-2xl font-bold text-white">Trial</h3>
            <p className="text-white/90 text-sm mt-1">Try our service with minimal investment</p>
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <div className="text-[#FF9626] font-medium mb-1">QUICK START</div>
              <div className="flex items-end justify-center">
                <span className="text-4xl font-bold">
                  {currency}
                  {prices.trial[currency]}
                </span>
                <span className="text-gray-600 ml-1">/One-time</span>
              </div>
              <a
                href={getTrialCheckoutLink()}
                className="mt-4 px-8 py-2 rounded-full border-2 border-[#FF9626] text-[#FF9626] font-semibold hover:bg-[#FF9626] hover:text-white transition-colors inline-block"
              >
                Start Trial
              </a>
              <div className="text-sm text-gray-500 mt-2">One-time payment, delivered in 24 hours</div>
            </div>

            <div>
              <div className="font-semibold mb-4">Includes:</div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>7 professionally written blog posts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>24-hour delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>Basic SEO optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>Sample of our quality work</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

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
              <a
                href={getCheckoutLink("starter")}
                className="mt-4 px-8 py-2 rounded-full border-2 border-[#FF9626] text-[#FF9626] font-semibold hover:bg-[#FF9626] hover:text-white transition-colors inline-block"
              >
                Choose Starter
              </a>
              <div className="text-sm text-gray-500 mt-2">
                {billingPeriod === "monthly"
                  ? "Billed monthly, cancel anytime"
                  : `${currency}${getYearlyTotal("starter")} billed yearly`}
              </div>
            </div>

            <div>
              <div className="font-semibold mb-4">Includes:</div>
              <ul className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                {(billingPeriod === "monthly" ? starterFeatures.monthly : starterFeatures.annually).map(
                  (feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#FF9626] mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ),
                )}
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
              <a
                href={getCheckoutLink("professional")}
                className="mt-4 px-8 py-2 rounded-full border-2 border-[#FF9626] text-[#FF9626] font-semibold hover:bg-[#FF9626] hover:text-white transition-colors inline-block"
              >
                Choose Professional
              </a>
              <div className="text-sm text-gray-500 mt-2">
                {billingPeriod === "monthly"
                  ? "Billed monthly, cancel anytime"
                  : `${currency}${getYearlyTotal("professional")} billed yearly`}
              </div>
            </div>

            <div>
              <div className="font-semibold mb-4">Includes:</div>
              <ul className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                {(billingPeriod === "monthly" ? professionalFeatures.monthly : professionalFeatures.annually).map(
                  (feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#FF9626] mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Solo-Founder Plan Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <div className="bg-[#FFF6F0] border border-[#E5E7EB] rounded-[24px] flex flex-col md:flex-row">
          <div className="flex-1 p-8">
            <div className="inline-block px-4 py-1.5 bg-[#FF9626] rounded-full text-white text-sm font-medium">
              Special Offer
            </div>

            <h2 className="text-[32px] font-bold mt-4 mb-3" style={{ letterSpacing: "-0.02em" }}>
              Solo-Founder Plan
            </h2>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-500 line-through text-lg">$3996</span>
                <span className="bg-[#FF9626] text-white text-xs px-2 py-1 rounded-full">SAVE $2497</span>
              </div>
              <div className="text-3xl font-bold text-[#FF9626]">$1499</div>
              <div className="text-sm text-gray-500 mt-1">Original price: $2197 + $799 = $3996</div>
            </div>

            <div className="space-y-4 mb-8">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>200+ only high DA directory submissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>X engagement from founders</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>30+ Paid directory list</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>SEO and landing page basic audit</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>60 blogs every month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF9626] mt-0.5" />
                  <span>Dedicated manager support</span>
                </li>
              </ul>
            </div>

            <a
              href="https://checkout.dodopayments.com/buy/pdt_solo_founder_plan?quantity=1"
              className="bg-[#FF9626] text-white px-6 py-3 rounded-full font-medium inline-flex items-center group hover:bg-[#e08520] transition-colors"
            >
              Get Solo-Founder Plan
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
            </a>

            <div className="mt-4 text-sm text-gray-500">
              Limited time offer. Perfect for solopreneurs and founders looking to scale quickly.
            </div>
          </div>

          <div className="md:w-80 p-8 bg-white/50 rounded-r-[24px]">
            <h3 className="text-[#111827] text-xl font-semibold mb-6">Why Choose This Plan?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-[#FF9626] rounded-full p-2 shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path
                      d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.75 12L10.58 14.83L16.25 9.17"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[#4B5563]">Complete solution for solo founders</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#FF9626] rounded-full p-2 shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path
                      d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.75 12L10.58 14.83L16.25 9.17"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[#4B5563]">62% discount on combined services</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#FF9626] rounded-full p-2 shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path
                      d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.75 12L10.58 14.83L16.25 9.17"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[#4B5563]">Combines content and directory services</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#FF9626]">
                  <path
                    d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.31 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                  />
                </svg>
               
              </div>
              <div className="flex items-center gap-2 mt-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#FF9626]">
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
                <a href="mailto:info@blogosocial.com" className="text-[#FF9626] font-medium hover:underline">
                  info@blogosocial.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

