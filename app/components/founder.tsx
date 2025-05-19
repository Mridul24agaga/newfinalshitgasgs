import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Mail, Twitter, MessageCircle, Zap, Rocket, Award, Clock, CheckCircle2, Users, Sparkles } from "lucide-react"

export default function FounderSupportSection() {
  return (
    <div className="w-full bg-white">
      {/* Hero section with founder images */}
      <section className="w-full py-20 md:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
            {/* Left content */}
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center rounded-full bg-[#294fd6]/10 px-4 py-1.5 text-sm font-medium text-[#294fd6]">
                <MessageCircle className="mr-2 h-4 w-4" />
                <span>DIRECT FOUNDER ACCESS</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                Founder Support That{" "}
                <span className="text-[#294fd6] relative">
                  Truly Cares
                  <span className="absolute bottom-1 left-0 w-full h-1.5 bg-[#294fd6]/30 rounded-full"></span>
                </span>{" "}
                About Your Success
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                When you choose GetMoreSEO, you're not just getting software—you're gaining partners committed to your
                growth. Our founders are directly involved in your success journey.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="mailto:hi@mridulthareja.com">
                  <Button
                    size="lg"
                    className="bg-[#294fd6] hover:bg-[#294fd6]/90 text-white border border-[#294fd6]/20 transition-all hover:translate-y-[-2px]"
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Email Founders
                  </Button>
                </Link>
                <Link href="https://twitter.com/innvisionagency">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#294fd6] text-[#294fd6] hover:bg-[#294fd6]/10 transition-all hover:translate-y-[-2px]"
                  >
                    <Twitter className="mr-2 h-5 w-5" />
                    Connect on X
                  </Button>
                </Link>
              </div>

              {/* Testimonial */}
              <div className="bg-white rounded-xl border border-gray-200 p-7 relative mt-10 hover:border-[#294fd6]/20 transition-colors duration-300">
                <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                  <div className="text-[#294fd6] text-6xl opacity-20">"</div>
                </div>
                <p className="text-gray-700 italic mb-5">
                  "The founder support at GetMoreSEO is unmatched. When I had questions about optimizing my content
                  strategy, I received a personal response within hours. This level of attention has made all the
                  difference for my business."
                </p>
                <div className="flex items-center">
                  <div>
                    <div className="font-medium text-gray-900">Kaivan Parekh</div>
                    <div className="text-sm text-gray-500">Marketer</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right image */}
            <div className="flex-1 relative">
              <div className="relative h-[400px] w-full md:h-[520px] rounded-xl overflow-hidden border border-gray-200">
                <img src="/founder.png" alt="Founder Support Team" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className="text-xl font-bold mb-1">Our Founder Team</div>
                  <p className="text-white/90 text-sm">Dedicated to your success every step of the way</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="w-full py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center rounded-full bg-[#294fd6]/10 px-4 py-1.5 text-sm font-medium text-[#294fd6] mb-4">
              <Award className="mr-2 h-4 w-4" />
              <span>EXCLUSIVE BENEFITS</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What Makes Our Founder Support <span className="text-[#294fd6]">Exceptional</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe in building relationships, not just providing a service. Here's how our founders personally
              ensure your success:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <MessageCircle className="h-8 w-8 text-[#294fd6]" />,
                title: "Direct Communication",
                description: "Email our founders directly and receive a response within 24 hours, guaranteed.",
              },
              {
                icon: <Zap className="h-8 w-8 text-amber-500" />,
                title: "Founder Shoutouts",
                description: "Get featured in our success stories and receive promotion to our entire network.",
              },
              {
                icon: <Rocket className="h-8 w-8 text-purple-500" />,
                title: "Feedback-Driven Updates",
                description: "Your suggestions directly influence our product roadmap and feature priorities.",
              },
              {
                icon: <Clock className="h-8 w-8 text-green-500" />,
                title: "Priority Access",
                description: "Be the first to try new features before they're released to the general public.",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-6 transition-all hover:border-[#294fd6]/20"
              >
                <div className="flex items-center mb-5">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mr-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
                </div>

                <p className="text-gray-600 mb-5">{benefit.description}</p>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Founder Guaranteed</span>
                  <CheckCircle2 className="h-5 w-5 text-[#294fd6]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap section */}
      <section className="w-full py-20 md:py-28 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center rounded-full bg-[#294fd6]/10 px-4 py-1.5 text-sm font-medium text-[#294fd6] mb-4">
              <Rocket className="mr-2 h-4 w-4" />
              <span>PRODUCT ROADMAP</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              We're Constantly <span className="text-[#294fd6]">Innovating</span> For You
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our development roadmap is shaped by your feedback. Here's what we're working on to make your content
              creation even more powerful:
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-[#294fd6]/20 transform md:-translate-x-1/2"></div>

            {/* Timeline items */}
            <div className="space-y-16">
              {[
                {
                  icon: <Sparkles className="h-6 w-6 text-white" />,
                  title: "One-Click Blog Generation",
                  description:
                    "Generate complete, SEO-optimized blog posts from just a title input. Save hours of content creation time.",
                  date: "Coming Q2 2023",
                  status: "In Development",
                },
                {
                  icon: <Rocket className="h-6 w-6 text-white" />,
                  title: "Automatic Search Engine Indexing",
                  description:
                    "Submit your content directly to search engines for faster indexing and quicker ranking results.",
                  date: "Coming Q3 2023",
                  status: "Planning Phase",
                },
                {
                  icon: <Zap className="h-6 w-6 text-white" />,
                  title: "LLM.text Advanced Optimization",
                  description:
                    "Our proprietary language model will analyze and enhance your content for maximum search visibility.",
                  date: "Coming Q4 2023",
                  status: "Research Phase",
                },
                {
                  icon: <Users className="h-6 w-6 text-white" />,
                  title: "Enterprise Team Collaboration",
                  description: "Seamlessly work with your entire marketing team with advanced collaboration features.",
                  date: "Coming Q1 2024",
                  status: "Early Planning",
                },
              ].map((item, index) => (
                <div key={index} className="relative flex items-start">
                  {/* Timeline node */}
                  <div className="absolute left-4 md:left-1/2 w-10 h-10 rounded-full bg-[#294fd6] flex items-center justify-center transform md:-translate-x-1/2 z-10 border-4 border-white">
                    {item.icon}
                  </div>

                  {/* Left side (even indices) */}
                  {index % 2 === 0 && (
                    <>
                      <div className="hidden md:block md:w-1/2 pr-16">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 transition-all hover:border-[#294fd6]/20 ml-auto text-right">
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                          <p className="text-gray-600 mb-5">{item.description}</p>
                          <div className="inline-flex items-center rounded-full bg-[#294fd6]/10 px-4 py-1.5 text-sm font-medium text-[#294fd6]">
                            <CheckCircle2 className="mr-1.5 h-4 w-4" />
                            <span>{item.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="md:hidden pl-16 w-full">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 transition-all hover:border-[#294fd6]/20">
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                          <p className="text-gray-600 mb-5">{item.description}</p>
                          <div className="inline-flex items-center rounded-full bg-[#294fd6]/10 px-4 py-1.5 text-sm font-medium text-[#294fd6]">
                            <CheckCircle2 className="mr-1.5 h-4 w-4" />
                            <span>{item.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:block md:w-1/2"></div>
                    </>
                  )}

                  {/* Right side (odd indices) */}
                  {index % 2 === 1 && (
                    <>
                      <div className="hidden md:block md:w-1/2"></div>
                      <div className="md:hidden pl-16 w-full">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 transition-all hover:border-[#294fd6]/20">
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                          <p className="text-gray-600 mb-5">{item.description}</p>
                          <div className="inline-flex items-center rounded-full bg-[#294fd6]/10 px-4 py-1.5 text-sm font-medium text-[#294fd6]">
                            <CheckCircle2 className="mr-1.5 h-4 w-4" />
                            <span>{item.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:block md:w-1/2 pl-16">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 transition-all hover:border-[#294fd6]/20">
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                          <p className="text-gray-600 mb-5">{item.description}</p>
                          <div className="inline-flex items-center rounded-full bg-[#294fd6]/10 px-4 py-1.5 text-sm font-medium text-[#294fd6]">
                            <CheckCircle2 className="mr-1.5 h-4 w-4" />
                            <span>{item.status}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="w-full py-16 md:py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 px-10 md:gap-16 lg:grid-cols-2">
            <div className="space-y-5">
              <div className="inline-flex items-center rounded-full bg-[#294fd6]/10 px-4 py-1.5 text-sm font-medium text-[#294fd6]">
                <Rocket className="mr-2 h-4 w-4" />
                <span>JOIN US TODAY</span>
              </div>
              <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                Ready for founder-level support that drives results?
              </h2>
              <Link href="/signup" className="inline-block mt-2">
                <Button
                  size="lg"
                  className="bg-[#294fd6] hover:bg-[#294fd6]/90 text-white border border-[#294fd6]/20 transition-all hover:translate-y-[-2px]"
                >
                  Get one Article for Free
                </Button>
              </Link>
            </div>
            <div className="flex flex-col items-start space-y-5">
              <div className="inline-flex items-center rounded-full bg-[#294fd6]/10 px-4 py-1.5 text-sm font-medium text-[#294fd6]">
                <MessageCircle className="mr-2 h-4 w-4" />
                <span>HAVE QUESTIONS?</span>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed">
                Our founders are ready to answer any questions you might have about our platform, features, or how we
                can help your specific business needs. Reach out today for a personalized conversation.
              </p>
              <Link href="mailto:hi@mridulthareja.com" className="inline-block mt-2">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#294fd6] text-[#294fd6] hover:bg-[#294fd6]/10 transition-all hover:translate-y-[-2px]"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
