"use client"

import { Saira } from "next/font/google"
import { motion } from "framer-motion"
import { Check, ArrowRight, Award, Users, BarChart3, Mail, Phone, DollarSign, Target, Gift } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Footer from "../components/footer"

const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-saira",
})

export default function AffiliatePage() {
  return (
    <main className={`min-h-screen bg-white ${saira.className}`}>
      {/* Header */}
      <header className="bg-white py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-full py-3 px-6 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <div className="flex items-center">
                <Image src="/logo.png" alt="Logo" width={160} height={32} className="w-auto h-6 sm:h-8" />
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="/team" className="text-gray-600 hover:text-gray-900 transition-colors">
                Team
              </Link>
              <Link
                href="/services"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-gray-900"
              >
                Services
              </Link>
              <Link href="/mission" className="text-gray-600 hover:text-gray-900 transition-colors">
                Mission
              </Link>
            </nav>

            <div className="flex items-center space-x-4">


              <Link
                href="/start"
                className="bg-[#FF9626] text-white px-5 py-2 rounded-full font-medium hover:bg-[#e88620] transition-colors"
              >
                Try Now
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-90 z-0"></div>
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.2]">
                Earn <span className="bg-[#FF9626] px-3 py-1 text-white">Rewards</span>{" "}
                <span className="relative top-5">With Our Affiliate Program</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-[1.6]">
                A high-reward affiliate program designed for marketers, agencies, and content creators
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:info@blogosocial.com?subject=Affiliate Program Application"
                  className="px-6 py-3 bg-[#FF9626] text-white rounded-lg font-medium flex items-center justify-center hover:bg-[#e88620] transition-colors"
                >
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a
                  href="#commission-structure"
                  className="px-6 py-3 bg-transparent border-2 border-[#FF9626] text-[#FF9626] rounded-lg font-medium flex items-center justify-center hover:bg-[#FF9626]/10 transition-colors"
                >
                  View Commission Rates
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Program Overview Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2]">Program Overview</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.6]">
              Monetize your audience by promoting Blogosocial's innovative content solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "High Commission Rates",
                description:
                  "Earn up to 30% commission on yearly subscriptions and 10% on monthly plans, with additional performance-based bonuses.",
                icon: <DollarSign className="h-8 w-8 text-white" />,
              },
              {
                title: "Exclusive Rewards",
                description:
                  "Unlock premium bonuses and gifts like iPads and e-bikes when you hit performance targets.",
                icon: <Gift className="h-8 w-8 text-white" />,
              },
              {
                title: "Reliable Payouts",
                description:
                  "Get paid twice a month with automatic transfers to your connected account on the 15th and last day of every month.",
                icon: <BarChart3 className="h-8 w-8 text-white" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="mb-6">
                  <div className="h-16 w-16 rounded-full bg-[#FF9626] flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 leading-[1.3]">{item.title}</h3>
                <p className="text-gray-700 leading-[1.8]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure Section */}
      <section id="commission-structure" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2]">Commission Structure</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.6]">
              Earn generous commissions on every successful referral
            </p>
          </motion.div>

          <div className="overflow-x-auto mb-12">
            <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-100">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-6 text-left text-lg font-semibold">Subscription Type</th>
                  <th className="py-4 px-6 text-center text-lg font-semibold">Commission Rate</th>
                  <th className="py-4 px-6 text-left text-lg font-semibold">Example Earnings</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 text-gray-800 font-medium">Yearly Subscription</td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-[#FF9626] font-bold text-xl">30%</span>
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    If a yearly subscription costs $1000, you earn <span className="font-semibold">$300 per sale</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Monthly Subscription</td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-[#FF9626] font-bold text-xl">10%</span>
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    If a monthly subscription costs $100, you earn <span className="font-semibold">$10 per sale</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 p-6 rounded-xl mb-12"
          >
            <h3 className="text-xl font-semibold mb-3 leading-[1.3]">Example:</h3>
            <p className="text-gray-700 leading-[1.8]">
              If you refer <span className="font-semibold">10 yearly subscribers</span> at $500 each, you earn{" "}
              <span className="font-semibold text-[#FF9626]">$1,500</span> in commissions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Performance Rewards Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2]">Performance-Based Rewards</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.6]">
              Unlock additional bonuses when you hit sales targets
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-[#FF9626] flex items-center justify-center mr-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold leading-[1.3]">10 Yearly Sales</h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 mt-1 flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">30 Blogs/Month Plan</p>
                    <p className="text-gray-700">20,000/- bonus</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 mt-1 flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">60 Blogs/Month Plan</p>
                    <p className="text-gray-700">50,000/- bonus or iPad</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-[#FF9626] flex items-center justify-center mr-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold leading-[1.3]">25 Yearly Sales</h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 mt-1 flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">30 Blogs/Month Plan</p>
                    <p className="text-gray-700">60,000/- bonus</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 mt-1 flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">60 Blogs/Month Plan</p>
                    <p className="text-gray-700">150,000/- bonus or e-bike</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Role & Responsibilities Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-[1.2]">Role & Responsibilities</h2>
              <p className="text-lg text-gray-700 mb-6 leading-[1.8]">
                As a Blogosocial affiliate, you'll help connect businesses with our revolutionary content creation
                platform while earning generous commissions.
              </p>

              <div className="space-y-6 mb-8">
                {[
                  "Promote Blogosocial through social media, email marketing, and digital channels",
                  "Drive traffic and conversions via affiliate links",
                  "Educate potential users about Blogosocial's AI-driven blogging benefits",
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-4 mt-1 flex-shrink-0">
                      <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <p className="text-gray-700 leading-[1.8]">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/placeholder.svg?height=500&width=800"
                  alt="Affiliate marketing illustration"
                  width={800}
                  height={500}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                <p className="font-medium text-gray-800">Partner With Us</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How to Apply Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2]">How to Apply</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.6]">
              Joining the Blogosocial Affiliate Program is quick and simple
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Contact Us",
                description: "Email info@blogosocial.com or call +91 9352172382 to register as an affiliate.",
                icon: <Mail className="h-8 w-8 text-white" />,
              },
              {
                step: "2",
                title: "Start Closing Clients",
                description: "Promote Blogosocial.com and bring in customers through your network.",
                icon: <Users className="h-8 w-8 text-white" />,
              },
              {
                step: "3",
                title: "Get Paid Twice Monthly",
                description: "Receive automatic transfers on the 15th and last day of every month.",
                icon: <DollarSign className="h-8 w-8 text-white" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative"
              >
                <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-[#FF9626] flex items-center justify-center text-white font-bold">
                  {item.step}
                </div>
                <div className="mb-4 pt-2">
                  <div className="h-16 w-16 rounded-full bg-[#FF9626] flex items-center justify-center mx-auto">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 leading-[1.3] text-center">{item.title}</h3>
                <p className="text-gray-700 leading-[1.8] text-center">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-white p-8 rounded-2xl shadow-sm text-center"
          >
            <h3 className="text-2xl font-bold mb-4 leading-[1.3]">Ready to Start Earning?</h3>
            <p className="text-lg text-gray-700 mb-6 leading-[1.8]">
              Your fixed percentage commission will be automatically transferred to your connected account on payout
              dates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@blogosocial.com?subject=Affiliate Program Application"
                className="px-6 py-3 bg-[#FF9626] text-white rounded-lg font-medium flex items-center justify-center hover:bg-[#e88620] transition-colors"
              >
                <Mail className="mr-2 h-5 w-5" /> Email Us to Join
              </a>
              <a
                href="tel:+919352172382"
                className="px-6 py-3 bg-transparent border-2 border-[#FF9626] text-[#FF9626] rounded-lg font-medium flex items-center justify-center hover:bg-[#FF9626]/10 transition-colors"
              >
                <Phone className="mr-2 h-5 w-5" /> Call +91 9352172382
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2]">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.6]">
              Common questions about our affiliate program
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Who can join the affiliate program?",
                answer:
                  "Our affiliate program is open to marketers, agencies, content creators, and anyone with an audience interested in content creation and blogging solutions.",
              },
              {
                question: "How do I track my referrals and earnings?",
                answer:
                  "Once you join the program, you'll receive access to a dashboard where you can track your referrals, conversions, and earnings in real-time.",
              },
              {
                question: "Is there a minimum payout threshold?",
                answer:
                  "No, we don't have a minimum payout threshold. You'll receive your earned commissions on the scheduled payout dates regardless of the amount.",
              },
              {
                question: "How long is the cookie duration?",
                answer:
                  "Our affiliate tracking cookies last for 90 days, giving you credit for conversions that happen within that timeframe after a user clicks your link.",
              },
              {
                question: "Can I promote Blogosocial on multiple platforms?",
                answer:
                  "Yes, you can promote Blogosocial across various platforms including your website, social media, email newsletters, YouTube channels, and more.",
              },
              {
                question: "Do you provide marketing materials?",
                answer:
                  "Yes, we provide a variety of marketing materials including banners, email templates, social media posts, and product descriptions to help you promote Blogosocial effectively.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3 leading-[1.3]">{item.question}</h3>
                <p className="text-gray-700 leading-[1.8]">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#FF9626]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-[1.2]">
              Start Earning With Blogosocial Today
            </h2>
            <p className="text-xl text-white opacity-90 mb-8 leading-[1.8]">
              Join our affiliate program and turn your audience into a revenue stream
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@blogosocial.com?subject=Affiliate Program Application"
                className="px-6 py-3 bg-white text-[#FF9626] rounded-lg font-medium flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Mail className="mr-2 h-5 w-5" /> Apply Now
              </a>
              <a
                href="#commission-structure"
                className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                Learn More
              </a>
            </div>

            <div className="mt-12 bg-white/10 p-6 rounded-xl">
              <p className="text-xl italic text-white leading-[1.8]">
                "The Blogosocial affiliate program has been a game-changer for our agency. The high commission rates and
                reliable payouts make it one of the best programs we've joined."
              </p>
              <p className="text-white/80 mt-2">— Marketing Agency Partner</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

