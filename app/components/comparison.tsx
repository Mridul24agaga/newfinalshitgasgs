import { Saira } from "next/font/google"

// Initialize the Saira font with the weights we need
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-saira",
})

export default function ComparisonTable() {
  return (
    <div className={`${saira.className} max-w-5xl mx-auto px-4 py-16`}>
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#FF9626] text-[#FF9626] text-sm font-medium mb-6">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path d="M14 2L8 14L6 8L0 6L14 2Z" fill="#FF9626" />
          </svg>
          ME VS (AI AND HUMANS)
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">See How I am Leading AI and Humans</h2>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
          Redefining Content Creation by Combining AI Precision with Human Ingenuity for Unmatched Results
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        {/* Left Column - Labels */}
        <div className="w-48 flex flex-col justify-between pt-[60px]">
          {["COST", "QUALITY", "SEO", "CREATIVITY", "TIME & EFFICIENCY", "SCALABILITY", "ACCURACY"].map((label) => (
            <div key={label} className="h-[60px] flex items-center font-medium">
              {label}
            </div>
          ))}
        </div>

        {/* AI Column */}
        <div className="w-64 rounded-2xl border border-[#FF9626]/20 overflow-hidden">
          <div className="h-[60px] flex items-center justify-center border-b border-[#FF9626]/20 font-medium">AI</div>
          <div className="h-[60px] flex items-center justify-center border-b border-[#FF9626]/20">$$</div>
          <div className="h-[60px] flex items-center justify-center border-b border-[#FF9626]/20">Inconsistent</div>
          <div className="h-[60px] flex items-center justify-center border-b border-[#FF9626]/20">Basic & Generic</div>
          <div className="h-[60px] flex items-center justify-center border-b border-[#FF9626]/20">
            Robotic & Repetitive
          </div>
          <div className="h-[60px] flex items-center justify-center border-b border-[#FF9626]/20">
            <div className="text-center">
              Super Fast But
              <br />
              Low-Quality
            </div>
          </div>
          <div className="h-[60px] flex items-center justify-center border-b border-[#FF9626]/20">High But Generic</div>
          <div className="h-[60px] flex items-center justify-center">Prone To Errors</div>
        </div>

        {/* HUMANS Column */}
        <div className="w-64 rounded-2xl border border-[#FF9626]/20 overflow-hidden">
          <div className="h-[60px] flex items-center justify-center border-b border-[#FF9626]/20 font-medium">
            HUMANS
          </div>
          <div className="h-[60px] flex items-center justify-center border-b border-[#FF9626]/20">$$$$$</div>
          <div className="h-[60px] flex items-center justify-center border-b border-[#FF9626]/20">High-Quality</div>
          <div className="h-[60px] flex items-center justify-center border-b border-[#FF9626]/20">
            <div className="text-center">
              Optimized But
              <br />
              Time-Consuming
            </div>
          </div>
          <div className="h-[60px] flex items-center justify-center border-b border-[#FF9626]/20">Highly Creative</div>
          <div className="h-[60px] flex items-center justify-center border-b border-[#FF9626]/20">
            Slow But Detailed
          </div>
          <div className="h-[60px] flex items-center justify-center border-b border-[#FF9626]/20">Limited Capacity</div>
          <div className="h-[60px] flex items-center justify-center">
            <div className="text-center">
              Fact-Checked
              <br />
              Manually
            </div>
          </div>
        </div>

        {/* blogOsocial Column */}
        <div className="w-64 rounded-2xl overflow-hidden">
          <div className="h-[60px] flex items-center justify-center bg-[#333333] text-white">
            <div className="flex items-center">
              <svg width="20" height="20" viewBox="0 0 40 40" fill="none" className="mr-1">
                <path d="M10 25C10 25 15 15 25 10L30 15L20 30L10 25Z" fill="white" />
              </svg>
              <span className="font-bold">
                blog<span className="text-[#FF9626]">O</span>social
              </span>
            </div>
          </div>
          <div className="bg-[#FF9626] text-white">
            <div className="h-[60px] flex items-center justify-center border-b border-white/10">$</div>
            <div className="h-[60px] flex items-center justify-center border-b border-white/10">
              <div className="text-center">
                Premium
                <br />
                And Consistent
              </div>
            </div>
            <div className="h-[60px] flex items-center justify-center border-b border-white/10">
              <div className="text-center">
                AI + Expert
                <br />
                SEO-Driven
              </div>
            </div>
            <div className="h-[60px] flex items-center justify-center border-b border-white/10">
              <div className="text-center">
                AI Efficiency
                <br />
                Human Storytelling
              </div>
            </div>
            <div className="h-[60px] flex items-center justify-center border-b border-white/10">
              Fast & High-Quality
            </div>
            <div className="h-[60px] flex items-center justify-center border-b border-white/10">
              Scalable & Engaging
            </div>
            <div className="h-[60px] flex items-center justify-center">
              <div className="text-center">
                AI + Expert
                <br />
                Verification
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <a
          href="#"
          className="inline-block bg-[#FF9626] text-white px-12 py-4 rounded-full font-medium hover:bg-[#FF9626]/90 transition-colors"
        >
          Get Started
        </a>
      </div>
    </div>
  )
}

