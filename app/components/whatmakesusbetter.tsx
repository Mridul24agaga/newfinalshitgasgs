import { Button } from "@/app/components/ui/button"

export default function Howthisisworking() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          What Makes GetMoreSEO <span className="text-blue-600">Smarter</span>
        </h1>
        <p className="text-lg font-semibold text-gray-700 mb-2">Trained by SEO Experts, Built to Rank on Google</p>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Our system rigorously follows Google's E-E-A-T framework, continuously updated to align with search algorithm
          changes, ensuring internal linking, multimedia integration, and high-ranking content.
        </p>
      </section>

      {/* Feature 1: Autopilot Experience */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 bg-gradient-to-br from-blue-100/90 via-blue-50/70 to-white p-10 md:p-12 lg:p-16 rounded-3xl">
            <h2 className="text-3xl font-bold mb-4">True 100% Autopilot Experience</h2>
            <p className="text-gray-700 mb-8">
              Set your preferences once. Watch your content calendar auto-fill with optimized, ranking-ready articles.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <span>Start for Free</span>
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Button>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute -top-10 left-10 text-blue-600 font-handwriting text-lg rotate-[-5deg]">
              AI-powered
              <br />
              automation
            </div>
            <div className="h-[300px] md:h-[350px] flex items-center justify-center">
              <div className="text-gray-400 text-sm">Autopilot Experience Image</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: SEO-Expert Trained */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="md:w-1/2 bg-gradient-to-bl from-blue-100/90 via-blue-50/70 to-white p-10 md:p-12 lg:p-16 rounded-3xl">
            <h2 className="text-3xl font-bold mb-4">SEO-Expert Trained System</h2>
            <p className="text-gray-700 mb-8">
              Engineered by top SEO experts from BlogoSocial.com, aligned with Google's best practices.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <span>Learn More</span>
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Button>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute -top-10 right-10 text-blue-600 font-handwriting text-lg rotate-[-5deg]">
              Expert
              <br />
              knowledge
            </div>
            <div className="h-[300px] md:h-[350px] flex items-center justify-center">
              <div className="text-gray-400 text-sm">SEO Expert System Image</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3: Start Without Risk */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 bg-gradient-to-tr from-blue-100/90 via-blue-50/70 to-white p-10 md:p-12 lg:p-16 rounded-3xl">
            <h2 className="text-3xl font-bold mb-4">Start Without Risk</h2>
            <p className="text-gray-700 mb-8">
              Unlike competitors, start building your content without any upfront costs or payment barriers.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <span>Try It Free</span>
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Button>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute -top-10 left-10 text-blue-600 font-handwriting text-lg rotate-[-5deg]">
              No upfront
              <br />
              costs
            </div>
            <div className="h-[300px] md:h-[350px] flex items-center justify-center">
              <div className="text-gray-400 text-sm">Risk-Free Start Image</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 4: Human-Quality */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="md:w-1/2 bg-gradient-to-tl from-blue-100/90 via-blue-50/70 to-white p-10 md:p-12 lg:p-16 rounded-3xl">
            <h2 className="text-3xl font-bold mb-4">Human-Quality Without Human Effort</h2>
            <p className="text-gray-700 mb-8">
              Generate fully humanized, engaging blog posts complete with multimedia and structured formatting
              effortlessly.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <span>See Examples</span>
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Button>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute -top-10 right-10 text-blue-600 font-handwriting text-lg rotate-[-5deg]">
              Human-like
              <br />
              quality
            </div>
            <div className="h-[300px] md:h-[350px] flex items-center justify-center">
              <div className="text-gray-400 text-sm">Human-Quality Content Image</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
