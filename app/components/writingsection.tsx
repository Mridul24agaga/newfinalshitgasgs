"use client"

import { Button } from "./Button"

export default function WritingSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="p-10 space-y-8">
            <div>
              <div className="text-[#FF7B51] font-medium mb-4">Writing Assistant</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-4">
                Elevate your Writing Skills with a Personal AI Assistant
              </h2>
              <p className="text-lg text-gray-600">
                Take Your Writing to the Next Level with AI Writing Assistant. Elevate Your Skills Today.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#FF7B51]"></div>
                <span>Boost Your Marketing Efforts</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#FF7B51]"></div>
                <span>Streamline HR Communications</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#FF7B51]"></div>
                <span>Achieve Professional Writing Excellence</span>
              </div>
            </div>

            <Button className="bg-[#1D1B48] hover:bg-[#2d2a6e] text-white rounded-full px-8 h-12 text-lg">
              Try It For FREE
            </Button>
          </div>

          <div className="bg-[#FF7B51] h-full flex items-center justify-center">
            {/* Add your image here */}
            <div className="text-white">Image Placeholder</div>
          </div>
        </div>
      </div>
    </div>
  )
}

