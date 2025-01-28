"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

export default function content() {
  return (
    <div className="bg-[#F6F7FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="bg-[#FFFBE6] rounded-3xl p-6 aspect-[4/3] flex items-center justify-center">
              {/* Add your image here */}
              <div className="text-gray-400">Image Placeholder</div>
            </div>
          </div>

          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <div className="w-6 h-[1px] bg-gray-600"></div>
                <div>Content Planner</div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                Plan & Schedule Content With Ease
              </h1>
              <p className="text-lg text-gray-600">
                Get your content in front of the right eyes at the right time. Seorocket.ai makes it a breeze to plan,
                schedule and publish your optimized content across your favorite platforms, so you can reach your
                audience wherever they are.
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
                  <h3 className="font-semibold text-gray-900 mb-2">Set It And Forget It Scheduling:</h3>
                  <p className="text-gray-600">
                    Plan your content calendar in advance and automatically publish your posts at the optimal times for
                    maximum engagement.
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
                  <h3 className="font-semibold text-gray-900 mb-2">One-Click Publishing:</h3>
                  <p className="text-gray-600">
                    Connect your WordPress, Webflow, Shopify, or Ghost website and share your content with a single
                    click. No more manual copying and pasting.
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
                  <h3 className="font-semibold text-gray-900 mb-2">Publish In Bulk, Save Time:</h3>
                  <p className="text-gray-600">
                    Need to share multiple articles at once? Our bulk publishing feature makes it easy to manage and
                    distribute your content across multiple channels.
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

