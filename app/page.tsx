import Script from "next/script"
import { Navbar } from "@/app/components/navbar"
import  Hero  from "@/app/components/hero"
import FAQSection from "./components/faq"
import { ProblemSolution } from "./components/video-section"
import ContentProblems from "./components/frustration"
import BlogsocialStats from "./components/blogosocial"
import PricingSection from "./components/pricing-section"
import FlowSection from "./components/flow-section"
import IntegrationsSection from "./components/integrations"
import LanguageScroll from "./components/language"
import EarlyBirdOffer from "./components/offer"
import BlogSection from "./components/blogpost"
import  Footer  from "./components/footer"
import AnnouncementBanner from "./components/navit"
import StructuredData from "./components/structured-data"
import type { Metadata } from "next"
import  HowItWorks  from "./components/howitworks"
import TrustedBySection from "./components/trusted"
import AIWritingSection from "./components/ai-writing-section"
import FeatureSection from "./components/features"
import WhyHireSection from "./components/hire"
import ComparisonTable from "./components/comparison"
import TestimonialsSection from "./components/testimonials"
import OurProcessSection from "./components/newtext"
import  ComparisonSection  from "./components/comparison-section"
import ScrollingResults from "./components/moving"
import { PricingCTA } from "./components/pricecta"
import { FeatureBentoGrid } from "./components/feature-grid"
import { ContentFeaturesSection } from "./components/contentfeatures"
import PaymentPage from "./components/payment-page"
import WhyBloggingSection from "./components/why"
import CTASection from "./components/ct"
import FeaturesSection from "./components/fet"
import BlogArticles from "./components/example"
import FounderSupportSection from "./components/founder"
import Home from "./components/howitworks"
import Howthisisworking from "./components/whatmakesusbetter"
export const metadata: Metadata = {
  title: "GetMoreSEO - Automated SEO Blogging on Autopilot",
  description:
    "Fully automated blog creation that ranks on Google and grows your business—without lifting a finger. The #1 ranked most affordable automated blogging AI agent.",
  openGraph: {
    title: "GetMoreSEO - Automated SEO Blogging on Autopilot",
    description:
      "Fully automated blog creation that ranks on Google and grows your business—without lifting a finger. The #1 ranked most affordable automated blogging AI agent.",
    images: [
      {
        url: "https://getmoreseo.org/og.jpeg", // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: "GetMoreSEO - Automated SEO Blogging Platform",
      },
    ],
  },
  metadataBase: new URL("https://getmoreseo.org"),
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
        <WhyBloggingSection/>
        <Howthisisworking/>
        <HowItWorks/>
        <FeaturesSection/>
        <TrustedBySection/>

        <BlogArticles/>

        <div className="flex justify-center w-full">
      <FounderSupportSection />

    </div>

      

      {/* FAQ Section */}
      <div>
        < FAQSection />
      </div>
      <ComparisonSection/>


    

      <Footer />
    </main>
  )
}

