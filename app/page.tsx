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
import Pricing from "./components/pricing"

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-[1400px] mx-auto rounded-2xl overflow-hidden shadow-xl bg-gradient-to-t from-[#000033] via-[#000066] to-[#0066ff]">
          <Hero />
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-[1400px] mx-auto">
          <Features />
        </div>
      </div>
      <Keyword/>
      <Content/>
      <Rank/>
      <Planner/>
      <Writer/>
      <EmailSection/>
      <WritingSection/>
      <Pricing/>
      <FAQ/>
      <Footer/>
    </main>
  )
}

