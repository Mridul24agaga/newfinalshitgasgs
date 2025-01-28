"use client"

import { Button } from "./Button"
export default function Writer() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
          Unlock Maximum Productivity with GPT-4
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Let AI Write, Optimize and Publish Your Blog Content. Enhance Your Blogs by Driving Clicks, Conversions, and
          Sales for Peak ROI with AI Blog Writer.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="p-10 space-y-8">
            <div>
              <div className="text-emerald-500 font-medium mb-4">AI Blog Writer</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-4">
                Attract More Customers with AutoBlogging Autopilot
              </h2>
              <p className="text-lg text-gray-600">Boost Your Google Ranking and Drive Traffic with AI Blog Creator.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span>Automated Publishing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span>Automated Internal and External Linking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span>Automated SEO Keyword Research</span>
              </div>
            </div>

            <Button className="bg-[#1D1B48] hover:bg-[#2d2a6e] text-white rounded-full px-8 h-12 text-lg">
              Try It For $9
            </Button>
          </div>

          <div className="bg-emerald-500 h-full flex items-center justify-center">
            {/* Add your image here */}
            <div className="text-white">Image Placeholder</div>
          </div>
        </div>
      </div>
    </div>
  )
}

