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
import { ProblemSolution } from "./components/video-section"
import Pricing from "./components/pricing"
import ContentProblems from "./components/frustration"
import StatsSection from "./components/stats"
import IntroducingSection from "./components/introduction"
import MetricsSection from "./components/metrics"
import BlogsocialStats from "./components/blogosocial"
import ScrollSection from "./components/scroll-section"
import PricingSection from "./components/pricing-section"
import FlowSection from "./components/flow-section"
import IntegrationsSection from "./components/integrations"
import LanguageScroll from "./components/language"
import EarlyBirdOffer from "./components/offer"
import BlogSection from "./components/blogpost"
import CTASection from "./components/cta"
import Footer from "./components/foot"
import AnnouncementBanner from "./components/navit"
export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBanner/>
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-[1400px] mx-auto rounded-2xl overflow-hidden  bg-gradient-to-t from-[#000033] via-[#000066] to-[#0066ff]">
          <Hero />
        </div>
      </div>
      <ProblemSolution/>
      <BlogsocialStats/>
      <ContentProblems/>
      <BlogSection/>
      <PricingSection/>
      <FlowSection/>
      <IntegrationsSection/>
      <LanguageScroll/>
      <EarlyBirdOffer/>
      <FAQ/>
      <CTASection/>
      
      <Footer/>
    </main>
  )
}

