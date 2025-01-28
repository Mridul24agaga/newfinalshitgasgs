import { Check, Calendar } from "lucide-react"

export default function Pricing() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#D4F1FA] to-white" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[1fr,1fr,1.2fr] gap-8 items-start">
          {/* Starter Plan */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Starter</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold">$39</span>
              <span className="text-gray-600">/month</span>
            </div>
            <p className="text-gray-600 mb-8 border-b pb-6">For small business owners and freelancers</p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-blue-600" />
                <span>Keyword Research</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-blue-600" />
                <span>Content Audit</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-blue-600" />
                <span>Keyword Tracker</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-blue-600" />
                <span>Auto AI-Writing</span>
              </div>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 rounded-xl transition-colors duration-200">
              Start for free
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-[#4F46E5] rounded-3xl p-8 text-white relative shadow-sm">
            <div className="absolute -top-3 right-8 bg-white text-[#4F46E5] hover:bg-gray-100 rounded-full px-4 py-1 font-medium text-sm">
              Enterprise
            </div>
            <h3 className="text-xl font-semibold mb-4">Enterprise Plan</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold">Custom</span>
              <span className="text-blue-200">/pricing</span>
            </div>
            <p className="text-blue-200 mb-8 border-b border-blue-400/30 pb-6">
              For large organizations and enterprise teams
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-white" />
                <span>All Starter Features Plus</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-white" />
                <span>Custom AI Training</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-white" />
                <span>Dedicated Support</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-white" />
                <span>Advanced Analytics</span>
              </div>
            </div>
            <button className="w-full bg-white text-[#4F46E5] hover:bg-gray-100 font-semibold h-12 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200">
              <Calendar className="h-5 w-5" />
              Book a Demo
            </button>
          </div>

          {/* Custom Plan Info */}
          <div className="lg:pt-8">
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <div className="w-6 h-[1px] bg-gray-600"></div>
              <div>Pricing Plan</div>
            </div>
            <h2 className="text-4xl font-bold mb-4">Custom SEO Plans To Grow Your Business</h2>
            <p className="text-gray-600 mb-8">
              We make SEO simple, effective, and affordable. Get everything you need to boost your rankings and grow
              your traffic.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-blue-600" />
                <span>Custom Meta Description</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-blue-600" />
                <span>Plagiarism Checker</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-blue-600" />
                <span>Brand Voice</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-blue-600" />
                <span>All Integrations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

