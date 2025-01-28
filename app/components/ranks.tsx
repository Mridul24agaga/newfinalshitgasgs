"use client"

import { motion } from "framer-motion"
import { FileText, Bell } from "lucide-react"

export default function rank() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <div className="w-6 h-[1px] bg-gray-600"></div>
                <div>Rankings Tracker</div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                Track Your SEO Success In Real-Time
              </h1>
              <p className="text-lg text-gray-600">
                Monitor your keyword rankings and overall SEO performance with intuitive dashboards and detailed
                reports, so you always know what's working (and what's not).
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900">Weekly Ranking Updates</h3>
                </div>
                <p className="text-gray-600">
                  See how your keywords are performing every week, so you can quickly adapt your strategy to changing
                  trends and opportunities.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900">Real-Time Alerts</h3>
                </div>
                <p className="text-gray-600">
                  Get instant notifications about changes in your keyword rankings. Stay informed and take action before
                  your competitors do.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-[#EBF5FF] rounded-3xl p-6 aspect-[4/3] flex items-center justify-center">
              {/* Add your image here */}
              <div className="text-gray-400">Image Placeholder</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

