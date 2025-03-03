import Script from "next/script"
import { Navbar } from "@/app/components/navbar"
import { Hero } from "@/app/components/hero"
import FAQ from "./components/faq"
import { ProblemSolution } from "./components/video-section"
import ContentProblems from "./components/frustration"
import BlogsocialStats from "./components/blogosocial"
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
      {/* Simple Analytics Script */}
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" async />

      {/* Google Analytics Script */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-DCKYV90906" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-DCKYV90906');
        `}
      </Script>

      <AnnouncementBanner />
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-[1400px] mx-auto rounded-2xl overflow-hidden  bg-gradient-to-t from-[#000033] via-[#000066] to-[#0066ff]">
          <Hero />
        </div>
      </div>
      <ProblemSolution />
      <BlogsocialStats />
      <ContentProblems />
      <BlogSection />
      <PricingSection />
      <FlowSection />
      <IntegrationsSection />
      <LanguageScroll />
      <EarlyBirdOffer />
      <FAQ />
      <CTASection />

      <Footer />
    </main>
  )
}

