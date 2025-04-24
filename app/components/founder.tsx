import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Mail, Twitter, MessageCircle, Zap, Rocket, Award, Clock, CheckCircle2, Users, Sparkles, Group } from "lucide-react"

export default function FounderSupportSection() {
  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50">
      {/* Hero section with founder images */}
      <section className="w-full py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.png')] bg-center opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
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
                  <span className="absolute bottom-1 left-0 w-full h-1 bg-[#294fd6]/30 rounded-full"></span>
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
                    className="bg-[#294fd6] hover:bg-[#294fd6]/90 text-white shadow-md shadow-[#294fd6]/20 transition-all hover:translate-y-[-2px]"
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
              <div className="bg-white rounded-xl border border-gray-200 p-6 relative mt-8">
                <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                  <div className="text-[#294fd6] text-6xl opacity-20">"</div>
                </div>
                <p className="text-gray-700 italic mb-4">
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
              <div className="relative h-[400px] w-full md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <img src="/founder.png" alt="Founder Support Team" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-xl font-bold mb-1">Our Founder Team</div>
                  <p className="text-white/90 text-sm">Dedicated to your success every step of the way</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
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
                className="bg-white rounded-xl border border-gray-200 p-6 transition-all hover:border-[#294fd6]/30 hover:shadow-sm"
              >
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap section */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
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
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#294fd6]/20 transform md:-translate-x-1/2"></div>

            {/* Timeline items */}
            <div className="space-y-12">
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
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-[#294fd6] flex items-center justify-center transform md:-translate-x-1/2 z-10">
                    {item.icon}
                  </div>

                  {/* Left side (even indices) */}
                  {index % 2 === 0 && (
                    <>
                      <div className="hidden md:block md:w-1/2 pr-12">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 transition-all hover:border-[#294fd6]/30 hover:shadow-sm ml-auto text-right">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600 mb-4">{item.description}</p>
                          <div className="inline-flex items-center rounded-full bg-[#294fd6]/10 px-3 py-1 text-sm font-medium text-[#294fd6]">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            <span>{item.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="md:hidden pl-16 w-full">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 transition-all hover:border-[#294fd6]/30 hover:shadow-sm">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600 mb-4">{item.description}</p>
                          <div className="inline-flex items-center rounded-full bg-[#294fd6]/10 px-3 py-1 text-sm font-medium text-[#294fd6]">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
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
                        <div className="bg-white rounded-xl border border-gray-200 p-6 transition-all hover:border-[#294fd6]/30 hover:shadow-sm">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600 mb-4">{item.description}</p>
                          <div className="inline-flex items-center rounded-full bg-[#294fd6]/10 px-3 py-1 text-sm font-medium text-[#294fd6]">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            <span>{item.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:block md:w-1/2 pl-12">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 transition-all hover:border-[#294fd6]/30 hover:shadow-sm">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600 mb-4">{item.description}</p>
                          <div className="inline-flex items-center rounded-full bg-[#294fd6]/10 px-3 py-1 text-sm font-medium text-[#294fd6]">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
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
    </div>
  )
}
