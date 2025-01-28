"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

export default function Page() {
  return (
    <div className="bg-[#F6F7FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-last lg:order-first">
            <div className="bg-[#FDF7F2] rounded-3xl p-6 aspect-[4/3] flex items-center justify-center">
              {/* Add your image here */}
              <div className="text-gray-400">Image Placeholder</div>
            </div>
          </div>

          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <div className="w-6 h-[1px] bg-gray-600"></div>
                <div>Content Editor</div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                Create Content That Search Engines Love
              </h1>
              <p className="text-lg text-gray-600">
                Tired of staring at a blank page? Our AI-powered writer does the heavy lifting, crafting SEO-optimized
                content that not only ranks higher in search results but also captivates your readers.
              </p>
            </motion.div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <Check className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">AI Humanzier:</h3>
                  <p className="text-gray-600">
                    Say goodbye to robotic, bland content. Create content that engages and resonates with your audience.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <Check className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Seamless Keyword Integration:</h3>
                  <p className="text-gray-600">
                    We weave relevant keywords naturally into your content, boosting your visibility without sacrificing
                    readability and quality.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <Check className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Brand Voice:</h3>
                  <p className="text-gray-600">
                    Your brand's voice is unique, and our AI understands that. We tailor the tone and style of your
                    content to match your brand's personality perfectly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

