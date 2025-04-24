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
                  Keyword Research
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  Where to Discover 5 Keywords That Drive Customer Interest
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                  Uncover powerful keywords through social media conversations, Google Trends, customer feedback, SEO
                  tools
                </p>
                <Link href="/where-to-discover-5-keywords-that-will-drive-customer-interest" className="inline-flex items-center text-[#294fd6] font-medium hover:underline mt-auto">
                  Read more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-[280px] flex flex-col">
              <div className="p-6 flex flex-col h-full">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-[#294fd6]/10 text-[#294fd6] rounded-md mb-4 w-fit">
                  AI Tools
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  How I Created 3 AI Tools in Under 30 Minutes (And You Can Too)
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                  Learn how to build powerful AI tools without coding using Wrapifai's no-code platform for lead
                  generation, chatbots, and more.
                </p>
                <Link href="/how-to-create-3-ai-tools-in-30-minutes" className="inline-flex items-center text-[#294fd6] font-medium hover:underline mt-auto">
                  Read more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-[280px] flex flex-col">
              <div className="p-6 flex flex-col h-full">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-[#294fd6]/10 text-[#294fd6] rounded-md mb-4 w-fit">
                  Startup Research
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  What Makes Scraping Product Hunt Makers Essential for Founders?
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                  Discover how analyzing Product Hunt makers can provide valuable insights for startup founders and
                  product developers.
                </p>
                <Link href="/What-makes-scraping-product-hunt-makers-essentials-for-founders" className="inline-flex items-center text-[#294fd6] font-medium hover:underline mt-auto">
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
                  Social Media
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                How to Book 10X More Meetings with AI-Powered Outreach Today

                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                It goes all detective on LinkedIn profiles, pulling out juicy bits of info that help you tailor your outreach. 
                </p>
                <Link href="/what-is-syndie-and-how-does-it-works" className="inline-flex items-center text-[#294fd6] font-medium hover:underline mt-auto">
                  Read more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-[280px] flex flex-col">
              <div className="p-6 flex flex-col h-full">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-[#294fd6]/10 text-[#294fd6] rounded-md mb-4 w-fit">
                  Open Source
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                What 85% of Developers Adore About Open-Source AI Tools
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                  Explore how open-source AI tools like Suna can enhance development workflows and provide flexible
                  solutions for projects.
                </p>
                <Link href="/what-85-developers-love-about-opensource-ai-tools" className="inline-flex items-center text-[#294fd6] font-medium hover:underline mt-auto">
                  Read more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Card 6 (New) */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-[280px] flex flex-col">
              <div className="p-6 flex flex-col h-full">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-[#294fd6]/10 text-[#294fd6] rounded-md mb-4 w-fit">
                  No-Code
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                What 68% of Businesses Gain from Open Source AI Solutions

                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                For real, open-source options often come at a fraction of the cost compared to their proprietary counterparts.
                </p>
                <Link href="/what-68-of-businesses-gain-from-open-source-ai-solutions" className="inline-flex items-center text-[#294fd6] font-medium hover:underline mt-auto">
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
