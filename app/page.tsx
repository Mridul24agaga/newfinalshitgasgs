import { Navbar } from "@/app/components/navbar"
import { Hero } from "@/app/components/hero"
import { Features } from "./components/services"
import Keyword from "./components/keyword"
import Content from "./components/content"
import Rank from "./components/ranks"
import Planner from "./components/planner"
import Writer from "./components/deep1"
import EmailSection from "./components/email"
import WritingSection from "./components/writingsection"
import FAQ from "./components/faq"
import Footer from "./components/footer"
import VideoSection from "./components/video-section"
import Pricing from "./components/pricing"
import ContentProblems from "./components/frustration"
import StatsSection from "./components/stats"
import IntroducingSection from "./components/introduction"
import MetricsSection from "./components/metrics"

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-[1400px] mx-auto rounded-2xl overflow-hidden shadow-xl bg-gradient-to-t from-[#000033] via-[#000066] to-[#0066ff]">
          <Hero />
        </div>
      </div>
      <VideoSection/>
      <ContentProblems/>
      <StatsSection/>
      <IntroducingSection/>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-[1400px] mx-auto">
          <Features />
        </div>
      </div>
      <Writer/>
      <EmailSection/>
      <WritingSection/>
      <MetricsSection/>
      <Keyword/>
      <Content/>
      <Rank/>
      <Planner/>
      <Pricing/>
      <FAQ/>
      <Footer/>
    </main>
  )
}

