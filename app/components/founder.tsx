import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { ArrowRight, Mail, Twitter } from "lucide-react"

export default function FounderSupportSection() {
  return (
    <div className="flex flex-col items-center justify-center w-full bg-white">
      {/* Main content section - centered with flex */}
      <section className="w-full py-12 md:py-20 bg-white flex justify-center">
        <div className="max-w-2xl px-4 md:px-6 flex flex-col items-center">
          <div className="flex flex-col items-center space-y-16 text-center">
            {/* Founder Support Section */}
            <div className="flex flex-col items-center space-y-6">
              <div className="rounded-lg bg-[#294fd6] px-4 py-1.5 text-sm font-medium text-white">CONTACT FOUNDERS</div>
              <h2 className="text-3xl font-bold tracking-tight text-black md:text-4xl text-center">
                Founder Support That Goes Beyond Software
              </h2>
              <p className="text-lg text-black text-center max-w-xl">
                When you choose GetMoreSEO, you're not just getting a tool—you're joining a community supported directly
                by our founders:
              </p>
              <ul className="space-y-3 w-fit mx-auto">
                {[
                  "Direct assistance via email and X (Twitter)",
                  "Founder shoutouts for successful clients",
                  "Regular platform updates based on user feedback",
                  "Priority access to upcoming features",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-[#294fd6] font-bold">·</span>
                    <span className="text-black">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="mailto:hi@mridulthareja.com">
                  <Button className="bg-[#294fd6] hover:bg-[#294fd6]/90 text-white">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Founders
                  </Button>
                </Link>
                <Link href="https://twitter.com/getmoreseo">
                  <Button className="bg-[#294fd6] hover:bg-[#294fd6]/90 text-white">
                    <Twitter className="mr-2 h-4 w-4" />
                    Connect on X
                  </Button>
                </Link>
              </div>
            </div>

            {/* Roadmap Section */}
            <div className="flex flex-col items-center space-y-6">
              <div className="rounded-lg bg-[#294fd6] px-4 py-1.5 text-sm font-medium text-white">ON OUR ROADMAP</div>
              <h2 className="text-3xl font-bold tracking-tight text-black md:text-4xl text-center">
                We're constantly improving
              </h2>
              <p className="text-lg text-black text-center max-w-xl">Here's what's coming soon:</p>
              <ul className="space-y-3 w-fit mx-auto">
                {[
                  "One-click blog generation from just a title",
                  "Automatic indexing submission to search engines",
                  "LLM.text advanced content optimization",
                  "And more innovations to keep you ahead",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-[#294fd6] font-bold">·</span>
                    <span className="text-black">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified CTA Section with White Background */}
      <section className="w-full py-12 md:py-16 bg-white border-t border-gray-100 flex justify-center">
        <div className="max-w-xl px-4 md:px-6 flex flex-col items-center">
          <div className="text-center space-y-6">
            <p className="text-lg text-black md:text-xl text-center">
              Join the community of business owners who have discovered that great SEO content doesn't have to be
              expensive or time-consuming.
            </p>
            <Button size="lg" className="bg-[#294fd6] hover:bg-[#294fd6]/90 text-white px-8 py-2.5 mx-auto">
              Start Growing Your Organic Traffic Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
