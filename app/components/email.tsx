"use client"

import { Button } from "./Button"

export default function EmailSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="p-10 space-y-8">
            <div>
              <div className="text-[#6C5CE7] font-medium mb-4">Email Writer</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-4">
                Write better email campaigns, 10x faster
              </h2>
              <p className="text-lg text-gray-600">
                Create Compelling Content for Any Email Campaign, Newsletter, and More—In seconds
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#6C5CE7]"></div>
                <span>Maximize Open and Response Rates</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#6C5CE7]"></div>
                <span>Maintain a Consistent Tone and Style</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#6C5CE7]"></div>
                <span>Ensure Error-Free Emails with Smart Editing Features</span>
              </div>
            </div>

            <Button className="bg-[#1D1B48] hover:bg-[#2d2a6e] text-white rounded-full px-8 h-12 text-lg">
              Try It For FREE
            </Button>
          </div>

          <div className="bg-[#6C5CE7] h-full flex items-center justify-center">
            {/* Add your image here */}
            <div className="text-white">Image Placeholder</div>
          </div>
        </div>
      </div>
    </div>
  )
}

