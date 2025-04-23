import { ArrowRight } from "lucide-react"
import { Poppins } from "next/font/google"
import Link from "next/link"

// Initialize Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export default function BlogArticles() {
  return (
    <>
      <section id="examples" className={`py-16 bg-white ${poppins.className}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Articles <span className="text-[#294df6]">Examples</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our collection of expert articles, guides, and resources to help you grow your online presence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Card 1 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-[280px] flex flex-col">
              <div className="p-6 flex flex-col h-full">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-[#294fd6]/10 text-[#294fd6] rounded-md mb-4 w-fit">
                  Listicles
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  SaaS SEO: 7 Must-Have Tools for Growth
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                  Want to boost your SaaS visibility? Here are 7 must-have tools that will supercharge your SEO
                  strategy.
                </p>
                <Link href="#" className="inline-flex items-center text-[#294fd6] font-medium hover:underline mt-auto">
                  Read more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-[280px] flex flex-col">
              <div className="p-6 flex flex-col h-full">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-[#294fd6]/10 text-[#294fd6] rounded-md mb-4 w-fit">
                  Listicles
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  10 Indie Maker Tips to Boost Your Side Project
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                  These strategies help you connect with users, build a following, and grow your indie project
                  effectively.
                </p>
                <Link href="#" className="inline-flex items-center text-[#294fd6] font-medium hover:underline mt-auto">
                  Read more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-[280px] flex flex-col">
              <div className="p-6 flex flex-col h-full">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-[#294fd6]/10 text-[#294fd6] rounded-md mb-4 w-fit">
                  How-to Guides
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  Robots.txt SEO Guide: 10 Best Practices
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                  Ever wonder how search engines know which parts of your site to crawl? Master robots.txt with these
                  tips.
                </p>
                <Link href="#" className="inline-flex items-center text-[#294fd6] font-medium hover:underline mt-auto">
                  Read more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 4 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-[280px] flex flex-col">
              <div className="p-6 flex flex-col h-full">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-[#294fd6]/10 text-[#294fd6] rounded-md mb-4 w-fit">
                  Checklists
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  Google Core Update Checklist: Prepare Your Site
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                  Google Core Updates can shake up your rankings and traffic. Here's how to prepare and recover from
                  algorithm changes.
                </p>
                <Link href="#" className="inline-flex items-center text-[#294fd6] font-medium hover:underline mt-auto">
                  Read more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-[280px] flex flex-col">
              <div className="p-6 flex flex-col h-full">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-[#294fd6]/10 text-[#294fd6] rounded-md mb-4 w-fit">
                  QA Articles
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  Next.js getServerSideProps: Complete Guide
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                  getServerSideProps is a Next.js function for server-side rendering. Learn how to use it effectively in
                  your projects.
                </p>
                <Link href="#" className="inline-flex items-center text-[#294fd6] font-medium hover:underline mt-auto">
                  Read more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Card 6 (New) */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-[280px] flex flex-col">
              <div className="p-6 flex flex-col h-full">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-[#294fd6]/10 text-[#294fd6] rounded-md mb-4 w-fit">
                  Case Studies
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  How We Increased Organic Traffic by 300% in 6 Months
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                  Discover the exact content strategy and technical SEO improvements that tripled our client's website
                  traffic in just half a year.
                </p>
                <Link href="#" className="inline-flex items-center text-[#294fd6] font-medium hover:underline mt-auto">
                  Read more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GetMoreSEO Features Section */}
      <section className={`py-16 bg-white ${poppins.className}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-4 leading-relaxed">
              GetMoreSEO creates comprehensive, optimized blog posts designed specifically to perform in search results
            </p>
            <p className="text-gray-600 max-w-3xl mx-auto">Each post includes:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Feature 1 */}
            <div className="bg-white text-gray-800 p-8 rounded-3xl border border-gray-200 shadow-sm w-full aspect-square">
              <h3 className="text-xl font-bold text-[#294df6] mb-6">In-Depth, Research-Backed Content</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-[#294df6] mr-2">·</span>
                  <span>Comprehensive articles up to 4,000 words</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#294df6] mr-2">·</span>
                  <span>Fact-checked information from reliable sources</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#294df6] mr-2">·</span>
                  <span>Problem-solving content tailored to your audience's needs</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-white text-gray-800 p-8 rounded-3xl border border-gray-200 shadow-sm w-full aspect-square">
              <h3 className="text-xl font-bold text-[#294df6] mb-6">Complete SEO Framework</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-[#294df6] mr-2">·</span>
                  <span>Strategic keyword placement (primary and longtail)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#294df6] mr-2">·</span>
                  <span>Internal and external linking structure</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#294df6] mr-2">·</span>
                  <span>Content organized in search-friendly formats</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-white text-gray-800 p-8 rounded-3xl border border-gray-200 shadow-sm w-full aspect-square">
              <h3 className="text-xl font-bold text-[#294df6] mb-6">Rich Media Integration</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-[#294df6] mr-2">·</span>
                  <span>Custom images enhance every post</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#294df6] mr-2">·</span>
                  <span>YouTube video embeds for higher engagement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#294df6] mr-2">·</span>
                  <span>Tables and structured sections for better readability</span>
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="bg-white text-gray-800 p-8 rounded-3xl border border-gray-200 shadow-sm w-full aspect-square">
              <h3 className="text-xl font-bold text-[#294df6] mb-6">Effortless Publishing</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-[#294df6] mr-2">·</span>
                  <span>Automatic publishing to your website</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#294df6] mr-2">·</span>
                  <span>Editable content if you want to make changes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#294df6] mr-2">·</span>
                  <span>Complete content calendar for strategic planning</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-[#294df6] rounded-md shadow-sm hover:bg-[#1a3ad0] transition-colors"
            >
              Start Creating Ranking Content Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
