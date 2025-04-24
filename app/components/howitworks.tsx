import { Button } from "@/app/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* How It Works Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="mb-4">
          <h3 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">HOW IT WORKS</h3>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="md:w-1/2">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              How we <span className="text-[#294fd6]">make magic</span> happen
              <span className="inline-block ml-4">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 25C15 30 25 30 30 25" stroke="black" strokeWidth="2" strokeLinecap="round" />
                  <path d="M30 25L25 20" stroke="black" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
          </div>

          <div className="md:w-1/2">
            <p className="text-lg text-gray-700 mb-4">
              GetMoreSEO automates your entire blogging workflow, delivering professional content that drives organic
              traffic without the traditional headaches.
            </p>
            <p className="text-lg font-semibold text-[#294fd6] mb-6">Fully Automated. No Writers. No Hassle.</p>

            <Button className="bg-[#294fd6] hover:bg-blue-700 rounded-full px-6">
              <span>Start for Free</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Keyword Research */}
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="h-48 mb-6 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-gray-400 text-sm">Magnifying Glass / AI Robot Researching</div>
            </div>

            <h3 className="text-2xl font-bold mb-3">Keyword & Topic Research</h3>
            <p className="text-gray-600">
              Our AI analyzes trending topics and high-value keywords in your niche to identify the best content
              opportunities for your blog. Discover what your audience is searching for and create content that meets
              their needs.
            </p>
          </div>

          {/* Card 2: Content Creation & Structuring (Combined) */}
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="h-48 mb-6 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-gray-400 text-sm">Document with Keywords & Structured Article Outline</div>
            </div>

            <h3 className="text-2xl font-bold mb-3">SEO-Optimized Content Creation</h3>
            <p className="text-gray-600">
              Generate high-quality content strategically optimized with your target keywords. Our AI creates human-like
              articles with proper headings, paragraphs, and formatting that reads naturally and engages readers while
              maximizing search engine visibility.
            </p>
          </div>

          {/* Card 3: Auto-Publishing */}
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="h-48 mb-6 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-gray-400 text-sm">Automatic Publishing Button</div>
            </div>

            <h3 className="text-2xl font-bold mb-3">Auto-Publish to Your Blog</h3>
            <p className="text-gray-600">
              Seamlessly publish to your blog with one click - no manual work required. Schedule posts or publish
              immediately, and let our system handle all the technical details. Connect once and automate your entire
              content publishing workflow.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
