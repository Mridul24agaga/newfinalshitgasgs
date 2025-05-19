import Image from "next/image"
import { Button } from "@/app/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* How It Works Section */}
      <section id="howitworks" className="py-16 px-4 max-w-7xl mx-auto">
        <div className="mb-4">
          <h3 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">HOW IT WORKS</h3>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="md:w-1/2">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              How we <span className="text-[#294fd6]">make magic</span> happen
            </h1>
          </div>

          <div className="md:w-1/2">
            <p className="text-lg text-gray-700 mb-4">
              GetMoreSEO automates your entire blogging workflow, delivering professional content that drives organic
              traffic without the traditional headaches.
            </p>
            <p className="text-lg font-semibold text-[#294fd6] mb-6">Fully Automated. No Writers. No Hassle.</p>

            <Link href="/signup">
              <Button className="bg-[#294fd6] hover:bg-blue-700 rounded-full px-6">
                <span className="text-white">Get on Article for Free</span>
                <ArrowRight className="ml-2 h-4 w-4 text-white" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Keyword Research */}
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="h-48 mb-6 relative rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                src="/124.png"
                alt="AI-powered keyword research and analysis"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </div>

            <h3 className="text-2xl font-bold mb-3">Keyword & Topic Research</h3>
            <p className="text-gray-600">
              Our AI analyzes trending topics and high-value keywords in your niche to identify the best content
              opportunities for your blog. Discover what your audience is searching for and create content that meets
              their needs.
            </p>
          </div>

          {/* Card 2: Content Creation & Structuring */}
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="h-48 mb-6 relative rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                src="/125.png"
                alt="SEO-optimized content creation process"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
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
            <div className="h-48 mb-6 relative rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                src="/126.png"
                alt="Automatic blog publishing system"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
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
