import { BotIcon as Robot, Award, Zap, FileCheck } from "lucide-react"

export default function ComparisonSection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          What Makes GetMoreSEO <span className="text-[#294fd6]">Smarter</span>
        </h2>
        <p className="text-xl font-semibold text-gray-700 mb-4">Trained by SEO Experts, Built to Rank on Google</p>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Our system rigorously follows Google's E-E-A-T framework, continuously updated to align with search algorithm
          changes, ensuring internal linking, multimedia integration, and high-ranking content.
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
          And so <span className="text-[#294fd6]">much more you need</span> to do your best work.
          <span className="inline-block mx-4">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="inline"
            >
              <path d="M10 25C15 30 25 30 30 25" stroke="black" strokeWidth="2" strokeLinecap="round" />
              <path d="M30 25L25 20" stroke="black" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Block 1 */}
        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-[#294fd6] rounded-full flex items-center justify-center mb-6">
            <Robot className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-3">True 100% Autopilot Experience</h3>
          <p className="text-gray-600">
            Set your preferences once. Watch your content calendar auto-fill with{" "}
            <span className="font-medium">optimized, ranking-ready articles</span>.
          </p>
        </div>

        {/* Block 2 */}
        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-[#294fd6] rounded-full flex items-center justify-center mb-6">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-3">SEO-Expert Trained System</h3>
          <p className="text-gray-600">
            Engineered by <span className="font-medium">top SEO experts</span> from BlogoSocial.com, aligned with
            Google's best practices.
          </p>
        </div>

        {/* Block 3 */}
        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-[#294fd6] rounded-full flex items-center justify-center mb-6">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-3">Start Without Risk</h3>
          <p className="text-gray-600">
            Unlike competitors, start building your content{" "}
            <span className="font-medium">without any upfront costs</span> or payment barriers.
          </p>
        </div>

        {/* Block 4 */}
        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-[#294fd6] rounded-full flex items-center justify-center mb-6">
            <FileCheck className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-3">Human-Quality Without Human Effort</h3>
          <p className="text-gray-600">
            Generate <span className="font-medium">fully humanized, engaging blog posts</span> complete with multimedia
            and structured formatting effortlessly.
          </p>
        </div>
      </div>
    </section>
  )
}
