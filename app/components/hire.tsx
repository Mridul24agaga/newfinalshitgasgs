import { Mail, MapPin, Globe } from "lucide-react"
import { Saira } from "next/font/google"

// Initialize the Saira font with the weights we need
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-saira", // Add variable for CSS custom property
})

export default function WhyHireMeResume() {
  return (
    <div className={`${saira.className} max-w-6xl mx-auto mt-16 mb-8 px-4 sm:px-6`}>
      <h2 className="text-4xl font-bold text-center mb-8 text-[#333333]">Why Hire Me ?</h2>

      <div className="bg-[#FF9626] rounded-lg overflow-hidden border-2 border-gray-300">
        {/* Header with Logo */}
        <div className="py-8 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center w-full px-12">
            <div className="h-px bg-black/20 flex-1"></div>
            <div className="mx-4">
              <div className="flex items-center">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2"
                >
                  <path d="M10 25C10 25 15 15 25 10L30 15L20 30L10 25Z" fill="white" />
                </svg>
                <span className="text-white text-3xl font-bold">
                  blog<span className="text-yellow-300">O</span>social
                </span>
              </div>
            </div>
            <div className="h-px bg-black/20 flex-1"></div>
          </div>
          <div className="mt-2 text-center">
            <h3 className="text-xl font-bold tracking-wider text-[#333333]">SEO EXPERT</h3>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white">
          {/* Left Column */}
          <div className="border-r border-gray-200">
            {/* CONTACT Section */}
            <div className="p-6 border-b border-gray-200 relative">
              <h3 className="text-lg font-bold mb-4 text-[#333333]">CONTACT</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-gray-600 mt-0.5" />
                  <span>info@blogosocial.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                  <span>Internet</span>
                </li>
                <li className="flex items-start gap-2">
                  <Globe className="h-5 w-5 text-gray-600 mt-0.5" />
                  <span>www.blogosocial.com</span>
                </li>
              </ul>
            </div>

            {/* EDUCATION Section */}
            <div className="p-6 border-b border-gray-200 relative">
              <h3 className="text-lg font-bold mb-4 text-[#333333]">EDUCATION</h3>
              <div>
                <p className="font-bold">2025-Present</p>
                <p className="font-bold">SEO GROWTH INSTITUTE</p>
                <ul className="list-disc ml-5 mt-2">
                  <li>Master of SEO Strategy</li>
                </ul>
              </div>
              <div className="absolute -bottom-1.5 right-1/2 transform translate-x-1/2 w-3 h-3 rounded-full bg-[#FF9626] border-2 border-white z-10"></div>
            </div>

            {/* SKILLS Section */}
            <div className="p-6 border-b border-gray-200 relative">
              <h3 className="text-lg font-bold mb-4 text-[#333333]">SKILLS</h3>
              <ul className="list-disc ml-5 space-y-1">
                <li>Autonomous Blogging</li>
                <li>Advanced SEO & Keyword Research</li>
                <li>Performance Analytics Powered by Google</li>
                <li>Custom Integrations & Scalability</li>
                <li>Fact-Checked, Internally & Externally Linked</li>
                <li>Engaging & Storytelling Blogs</li>
                <li>Branded & Visually Appealing Content</li>
                <li>High-Ranking Blogs</li>
              </ul>
              <div className="absolute -bottom-1.5 right-1/2 transform translate-x-1/2 w-3 h-3 rounded-full bg-[#FF9626] border-2 border-white z-10"></div>
            </div>

            {/* LANGUAGES Section */}
            <div className="p-6 relative">
              <h3 className="text-lg font-bold mb-4 text-[#333333]">LANGUAGES</h3>
              <ul className="list-disc ml-5">
                <li>I know 50+ Languages</li>
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* ABOUT ME Section */}
            <div className="p-6 border-b border-gray-200 relative">
              <h3 className="text-lg font-bold mb-4 text-[#333333]">ABOUT ME</h3>
              <ul className="space-y-4">
                <li>
                  <p>
                    <strong>I am built for one purpose -</strong> To revolutionize content marketing and drive organic
                    growth like never before. Designed by experts, powered by AI, and backed by deep SEO intelligence, I
                    don't just create blogs—I craft high-ranking, brand-defining content that works better than AI and
                    humans combined. I am the ultimate blogging machine.
                  </p>
                </li>
              </ul>
              <div className="absolute -bottom-1.5 right-1/2 transform translate-x-1/2 w-3 h-3 rounded-full bg-[#FF9626] border-2 border-white z-10"></div>
            </div>

            {/* WORK EXPERIENCE Section */}
            <div className="p-6 border-b border-gray-200 relative">
              <h3 className="text-lg font-bold mb-4 text-[#333333]">WORK EXPERIENCE</h3>

              <div className="mb-6">
                <div className="flex justify-between">
                  <p className="font-bold">Internet</p>
                  <p className="text-sm">2025 - PRESENT</p>
                </div>
                <p className="font-bold">Content Strategist & SEO Growth Specialist</p>
                <ul className="list-disc ml-5 mt-2 space-y-2">
                  <li>
                    100% Autopilot Blogging - I handle everything from keyword research to publishing while businesses
                    focus on growth.
                  </li>
                  <li>
                    Advanced SEO & Performance Analytics - Powered by Google-backed insights, I ensure top-ranking
                    content.
                  </li>
                  <li>
                    Storytelling & Brand Building - I don't just write; I tell stories that engage, convert, and retain
                    audiences.
                  </li>
                  <li>
                    Multi-Language & Industry Adaptation - Fluent in multiple languages, catering to various industries
                    and customer personas.
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex justify-between">
                  <p className="font-bold">Internet</p>
                  <p className="text-sm">2025 - PRESENT</p>
                </div>
                <p className="font-bold">SEO Consultant & Content Automation Expert</p>
                <ul className="list-disc ml-5 mt-2 space-y-2">
                  <li>
                    Developed a 5-layer content system integrating expert writers, AI layers, and review teams for
                    unbeatable quality.
                  </li>
                  <li>Created high-performing content plans tailored to ICP (Ideal Customer Profile) targeting.</li>
                  <li>
                    Worked with SaaS founders, tech companies, and corporate brands to scale their organic reach
                    effortlessly.
                  </li>
                </ul>
              </div>
              <div className="absolute -bottom-1.5 right-1/2 transform translate-x-1/2 w-3 h-3 rounded-full bg-[#FF9626] border-2 border-white z-10"></div>
            </div>

            {/* SUMMARY Section */}
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4 text-[#333333]">SUMMARY</h3>
              <p>
                <strong>I am not just another content tool -</strong> I am the future of corporate blogging. If your
                brand needs consistent, high-quality, SEO-driven content without the hassle, I'm the only hire you'll
                ever need. Let's build your content empire.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

