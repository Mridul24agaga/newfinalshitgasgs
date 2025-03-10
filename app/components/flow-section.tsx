import Image from "next/image"
import { Saira } from "next/font/google"

// Initialize the Saira font with the weights we need
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-saira", // Add variable for CSS custom property
})

export default function LayerSystemSection() {
  const steps = [
    {
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Step%201%20Expert%20SEO%20Writers-28Rs608TLLjx8zoxIxRa0xz175ocse.png",
      title: "Step 1: Expert SEO Writers",
      description: "My team of expert SEO writers crafts high-quality, engaging content that ranks.",
      bullets: [
        "I ensure clarity, structure, and keyword optimization for every blog",
        "Your blogs will be engaging, informative, and search engine friendly",
      ],
    },
    {
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Step%202%20Experienced%20SaaS%20Founders-mPYkWUmmSNI69pReu3yAUIxrJyhGHc.png",
      title: "Step 2: Experienced SaaS Founders",
      description: "I understand what works for SaaS and product-led businesses.",
      bullets: [
        "Built by industry veterans, I create content that drives real conversions",
        "I focus on revenue-driven blogging strategies that turn visitors into customers",
      ],
    },
    {
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Step%203%20ICP%20Research%20Inbuilt%20Technology-gfCtF5dzPYHq9n9h8OXatMz1zvrNNs.png",
      title: "Step 3: ICP Research Inbuilt Technology",
      description: "I tailor content based on your Ideal Customer Profile (ICP) using advanced research.",
      bullets: [
        "My inbuilt AI technology analyzes your audience and competitors",
        "I ensure content resonates with your target market for better engagement",
      ],
    },
    {
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Step%204%20Deep%20Research%20AI%20Layer-T5GEDycyJFbK58UA5L7eWTcrHMoadW.png",
      title: "Step 4: Deep Research AI Layer",
      description: "My multi-layered AI system ensures blogs are well-researched and data-backed.",
      bullets: [
        "I fact-check, cross-verify, and optimize content before publishing",
        "My AI technology ensures authenticity, depth, and SEO accuracy",
      ],
    },
    {
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Step%205%20Review%20Team-xtUOIPfstEcBxfA3FSPedEylvIy57u.png",
      title: "Step 5: Review Team",
      description: "Before publishing, every blog undergoes a final review by experts.",
      bullets: [
        "My human-led review team ensures quality, structure, and brand alignment",
        "You get error-free, impactful, and conversion-driven content—every time",
      ],
    },
  ]

  return (
    // Apply Saira font to the entire section
    <section className={`${saira.className} w-full max-w-[1400px] mx-auto py-12 md:py-20 px-4 md:px-6`}>
      <div className="flex flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center rounded-full border-2 px-5 py-2 text-base font-medium text-[#FD921C] border-[#FD921C]">
            🔧 MEET BLOGOSOCIAL
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          <span className="text-[#FD921C]">"Human-Led, AI-Powered"</span>
        </h2>
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our 5-Layer System Gets Results!</h3>

        {/* Subtext */}
        <p className="text-base md:text-lg text-gray-600 mb-16">We Use AI, But the Magic Comes from Humans!</p>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {steps.map((step, index) => (
            <div key={index} className="flex">
              <StepCard {...step} />
            </div>
          ))}

          {/* Explore More Card */}
          <div className="flex">
            <div className="relative group h-full w-full">
              {/* Background layer */}
              <div className="absolute inset-0 bg-[#FD921C]/10 rounded-[2rem] translate-x-2 translate-y-2" />

              {/* Main card */}
              <div className="relative bg-white border-2 border-[#FD921C] p-6 rounded-[2rem] h-full flex flex-col items-center justify-center">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">Want to</h3>
                  <p className="text-2xl font-bold text-[#FD921C] mb-6">Explore more?</p>
                  <div className="bg-[#FD921C] rounded-full p-3 inline-flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 12H19M19 12L12 5M19 12L12 19"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Speech bubble point */}
                <div className="absolute -right-4 top-12 w-8 h-8 bg-white border-r-2 border-b-2 border-[#FD921C] transform rotate-45" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

interface StepCardProps {
  icon: string
  title: string
  description: string
  bullets: string[]
}

function StepCard({ icon, title, description, bullets }: StepCardProps) {
  // Split the title to make the "Step X:" part black
  const titleParts = title.match(/^(Step \d+:)(.*)$/)
  const stepPart = titleParts ? titleParts[1] : ""
  const restOfTitle = titleParts ? titleParts[2] : title

  return (
    <div className="relative group h-full">
      {/* Background layer */}
      <div className="absolute inset-0 bg-[#FD921C]/20 rounded-[2rem] translate-x-2 translate-y-2" />

      {/* Main card */}
      <div className="relative bg-[#FD921C] p-6 rounded-[2rem] text-white h-full">
        {/* Icon container */}
        <div className="absolute -right-3 -top-3 bg-[#FD921C]/20 p-4 rounded-2xl">
          <div className="relative w-12 h-12">
            <Image src={icon || "/placeholder.svg"} alt={title} fill sizes="48px" className="object-contain" />
          </div>
        </div>

        {/* Content */}
        <div className="pr-12">
          {/* Title with Step part in black */}
          <h3 className="text-xl font-bold mb-3 text-left">
            {stepPart && <span className="text-black">{stepPart}</span>}
            {restOfTitle}
          </h3>
          <p className="mb-4 text-sm text-left opacity-90">{description}</p>
          {/* Bullets */}
          <ul className="text-sm space-y-2 text-left">
            {bullets.map((bullet, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 opacity-75">•</span>
                <span className="opacity-90">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Speech bubble point */}
        <div className="absolute -right-4 top-12 w-8 h-8 bg-[#FD921C] transform rotate-45" />
      </div>
    </div>
  )
}

