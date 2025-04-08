import { Check, X, Zap, Users, Award, Search, Shield } from "lucide-react"

export function ComparisonSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Makes Us Different?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlike AI writing tools that produce generic content, GetMoreSEO delivers human-written, SEO-optimized
            articles that actually rank and convert.
          </p>
        </div>

        {/* Desktop comparison table */}
        <div className="hidden lg:block mb-12">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            {/* Header row */}
            <div className="grid grid-cols-5 border-b border-gray-100">
              <div className="p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-700">Features</h3>
              </div>
              <div className="p-6 border-l border-gray-100 bg-indigo-50">
                <h3 className="text-lg font-semibold text-indigo-700">GetMoreSEO</h3>
              </div>
              <div className="p-6 border-l border-gray-100">
                <h3 className="text-lg font-semibold text-gray-700">ChatGPT</h3>
              </div>
              <div className="p-6 border-l border-gray-100">
                <h3 className="text-lg font-semibold text-gray-700">Jasper / WriteSonic</h3>
              </div>
              <div className="p-6 border-l border-gray-100">
                <h3 className="text-lg font-semibold text-gray-700">BlogBuster</h3>
              </div>
            </div>

            {/* Content Quality Row */}
            <div className="grid grid-cols-5 border-b border-gray-100">
              <div className="p-6 bg-gray-50 flex items-center">
                <Users className="w-5 h-5 text-gray-700 mr-3" />
                <span className="font-medium text-gray-800">Human-Written Content</span>
              </div>
              <div className="p-6 border-l border-gray-100 bg-indigo-50 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="p-6 border-l border-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="p-6 border-l border-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="p-6 border-l border-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>

            {/* AI Detection Row */}
            <div className="grid grid-cols-5 border-b border-gray-100">
              <div className="p-6 bg-gray-50 flex items-center">
                <Shield className="w-5 h-5 text-gray-700 mr-3" />
                <span className="font-medium text-gray-800">Passes AI Detection</span>
              </div>
              <div className="p-6 border-l border-gray-100 bg-indigo-50 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="p-6 border-l border-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="p-6 border-l border-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="p-6 border-l border-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>

            {/* SEO Optimization Row */}
            <div className="grid grid-cols-5 border-b border-gray-100">
              <div className="p-6 bg-gray-50 flex items-center">
                <Search className="w-5 h-5 text-gray-700 mr-3" />
                <span className="font-medium text-gray-800">Advanced SEO Optimization</span>
              </div>
              <div className="p-6 border-l border-gray-100 bg-indigo-50 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="p-6 border-l border-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="p-6 border-l border-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
                <span className="ml-2 text-sm text-gray-500">Basic</span>
              </div>
              <div className="p-6 border-l border-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
                <span className="ml-2 text-sm text-gray-500">Basic</span>
              </div>
            </div>

            {/* Auto Publishing Row */}
            <div className="grid grid-cols-5 border-b border-gray-100">
              <div className="p-6 bg-gray-50 flex items-center">
                <Zap className="w-5 h-5 text-gray-700 mr-3" />
                <span className="font-medium text-gray-800">Automatic Publishing</span>
              </div>
              <div className="p-6 border-l border-gray-100 bg-indigo-50 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="p-6 border-l border-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="p-6 border-l border-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
                <span className="ml-2 text-sm text-gray-500">Limited</span>
              </div>
              <div className="p-6 border-l border-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            {/* Auto Linking Row */}
            <div className="grid grid-cols-5">
              <div className="p-6 bg-gray-50 flex items-center">
                <Award className="w-5 h-5 text-gray-700 mr-3" />
                <span className="font-medium text-gray-800">Auto Internal & External Linking</span>
              </div>
              <div className="p-6 border-l border-gray-100 bg-indigo-50 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="p-6 border-l border-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="p-6 border-l border-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="p-6 border-l border-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile comparison cards */}
        <div className="lg:hidden space-y-8">
          {/* GetMoreSEO Card */}
          <div className="bg-white rounded-xl border border-indigo-200 overflow-hidden shadow-sm">
            <div className="p-6 bg-indigo-50 border-b border-indigo-100">
              <h3 className="text-xl font-bold text-indigo-700">GetMoreSEO</h3>
              <p className="text-indigo-600 mt-1">The complete SEO content solution</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-800">100% Human-Written Content</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-800">Passes All AI Detection Tools</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-800">Advanced SEO Optimization</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-800">Automatic Publishing</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-800">Auto Internal & External Linking</span>
              </div>
            </div>
          </div>

          {/* ChatGPT Card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 bg-gray-50 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-700">ChatGPT</h3>
              <p className="text-gray-500 mt-1">AI text generation</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-gray-800">AI-Generated Content Only</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-gray-800">Easily Detected by AI Tools</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-gray-800">No SEO Optimization</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-gray-800">No Publishing Features</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-gray-800">No Auto Linking</span>
              </div>
            </div>
          </div>

          {/* Jasper/WriteSonic Card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 bg-gray-50 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-700">Jasper / WriteSonic</h3>
              <p className="text-gray-500 mt-1">AI writing assistants</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-gray-800">AI-Generated Content Only</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-gray-800">Easily Detected by AI Tools</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
                <span className="text-gray-800">Basic SEO Features</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
                <span className="text-gray-800">Limited Publishing</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-gray-800">No Auto Linking</span>
              </div>
            </div>
          </div>

          {/* BlogBuster Card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 bg-gray-50 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-700">BlogBuster</h3>
              <p className="text-gray-500 mt-1">Blog automation tool</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-gray-800">AI-Generated Content Only</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-gray-800">Easily Detected by AI Tools</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
                <span className="text-gray-800">Basic SEO Features</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-800">Automatic Publishing</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-gray-800">No Auto Linking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Stop wasting time with AI-generated content that Google penalizes
          </h3>
          <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition-colors">
            Get Started with Human-Written Content
          </button>
        </div>
      </div>
    </section>
  )
}

