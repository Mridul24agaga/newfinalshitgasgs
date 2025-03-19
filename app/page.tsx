import Script from "next/script"
import { Navbar } from "@/app/components/navbar"
import  Hero  from "@/app/components/hero"
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
import StructuredData from "./components/structured-data"
import type { Metadata } from "next"
import TrustedBySection from "./components/trusted"
import AIWritingSection from "./components/ai-writing-section"
import FeatureSection from "./components/features"
import WhyHireSection from "./components/hire"
import ComparisonTable from "./components/comparison"
import TestimonialsSection from "./components/testimonials"
import OurProcessSection from "./components/newtext"
import ScrollingResults from "./components/moving"

export const metadata: Metadata = {
  title: "Blogosocial - Strategic Blogging Loved by Readers, Ranked by Google",
  description:
    "Expert blogs powered by AI & ICP strategies. Create content that ranks fast in Google and engages your audience with our AI-powered blogging platform.",
  openGraph: {
    title: "Blogosocial - Strategic Blogging Loved by Readers, Ranked by Google",
    description:
      "Expert blogs powered by AI & ICP strategies. Create content that ranks fast in Google and engages your audience with our AI-powered blogging platform.",
    images: [
      {
        url: "https://blogosocial.com/og.jpeg", // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: "Blogosocial - AI-Powered Blogging Platform",
      },
    ],
  },
}

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      {/* Structured Data */}
      <StructuredData />

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

      {/* Microsoft Clarity Script */}
      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "qil10jfr8p");
        `}
      </Script>


      {/* Hero Section with gradient background */}
        <Hero />
      <AIWritingSection/>


      <div className="my-24">
      </div>
      <OurProcessSection/>
      <div>
        <BlogsocialStats />
      </div>

      {/* Content Problems Section */}
      <div>
        <ContentProblems />
      </div>

       {/* Blog Section */}
       <div className="my-24">
        <BlogSection />
      </div>

      {/* <FeatureSection */}
      <FeatureSection/>

      <WhyHireSection/>

      <ComparisonTable/>

      <TestimonialsSection/>



      {/* Trusted By Section */}
      <div>
        <TrustedBySection />
      </div>

    
      {/* Blogosocial Stats Section */}
   

     
      {/* Pricing Section */}
      <div className="my-24">
        <PricingSection />
      </div>

      {/* Flow Section */}
     
      {/* Integrations Section */}
      <div className="my-24">
        <IntegrationsSection />
      </div>

      {/* Language Scroll Section */}
      <div className="my-24">
        <LanguageScroll />
      </div>

      {/* Early Bird Offer Section */}
      <div className="my-24">
        <EarlyBirdOffer />
      </div>

      {/* FAQ Section */}
      <div className="my-24">
        <FAQ />
      </div>

      {/* CTA Section */}
      <div>
        <CTASection />
      </div>

      <Footer />
    </main>
  )
}

