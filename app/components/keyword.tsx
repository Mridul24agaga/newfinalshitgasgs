"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

export default function keyword() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <div className="w-6 h-[1px] bg-gray-600"></div>
              <div>Keyword Research</div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Find Your Hidden SEO Goldmine
            </h1>
            <p className="text-lg text-gray-600">
              Uncover untapped keyword opportunities your competitors haven&apos;t even thought of, driving more
              targeted traffic to your site.
            </p>
          </motion.div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Check className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Keyword Research, Simplified</h3>
                <p className="text-gray-600">
                  Skip the tedious manual work and let our AI engine do the heavy lifting. Uncover hidden keyword gems
                  with high search volume and low competition.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Check className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Search Intent Analysis</h3>
                <p className="text-gray-600">
                  Our AI digs deep into search intent, revealing the true meaning behind users queries so you can
                  deliver exactly what they&apos;re looking for.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="bg-[#FDF7F2] rounded-3xl p-6 aspect-[4/3] flex items-center justify-center">
            {/* Add your image here */}
            <div className="text-gray-400">Image Placeholder</div>
          </div>
        </div>
      </div>
    </div>
  )
}

