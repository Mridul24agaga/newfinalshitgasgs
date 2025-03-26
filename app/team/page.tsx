"use client"

import { motion } from "framer-motion"
import { Users, Briefcase, Mail, Check } from "lucide-react"
import { Saira } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import Footer from "../components/footer"
import TrustedBySection from "../components/trusted"
// Initialize the Saira font with the weights we need
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-saira",
})

export default function TeamPage() {
  return (
    <main className={`${saira.className} min-h-screen bg-white`}>
      {/* Header */}
      <header className="bg-white py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-full py-3 px-6 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <div className="font-bold text-xl flex items-center">
                <span className="mr-1">blog</span>
                <span className="text-[#FF9626] font-bold">O</span>
                <span>social</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link
                href="/team"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-gray-900"
              >
                Team
              </Link>
              <Link href="/vision" className="text-gray-600 hover:text-gray-900 transition-colors">
                Vision
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
        {/* No background */}
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Pill Label */}
              <div className="inline-block mb-6">
                <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">Our People</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-relaxed">
                Meet the Team Behind <span className="bg-[#FF9626] text-white px-3 py-1">Blogosocial</span>                <br />
                <span className="mt-4 inline-block">Innovators, Builders, and Visionaries</span>
              </h1>

              <p className="text-xl text-gray-700 mb-8">
                At Blogosocial, we believe that exceptional content is born from the perfect blend of creativity,
                strategy, and cutting-edge technology. Behind every blog we craft lies a team of dedicated professionals
                who bring their expertise, passion, and innovation to the table.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Faces of Blogosocial */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Faces of Blogosocial</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Meet the minds that power our platform and the values that drive us to redefine blogging excellence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Krissmann Gupta",
                role: "Visionary Strategist",
                title: "The Brainchild",
                description:
                  "Krissmann is the creative force behind Blogosocial. With a deep understanding of SaaS ecosystems and content marketing, he envisioned a platform where human insight meets AI innovation. His leadership ensures that Blogosocial stays ahead of the curve in delivering unparalleled blogging solutions.",
                image: "/krissman.jpg",
              },
              {
                name: "Mridul Thareja",
                role: "Architect of Innovation",
                title: "The Builder",
                description:
                  "Mridul is the technical mastermind who transformed vision into reality. As the chief builder of our proprietary technologies, he has designed the systems that make Blogosocial a seamless, efficient, and powerful platform for startups and brands.",
                image: "/mridull.jpg",
              },
              {
                name: "Aryan Chittora",
                role: "Execution Expert",
                title: "The Operator",
                description:
                  "Aryan is the operational backbone of Blogosocial. From managing workflows to ensuring every project is delivered on time and with precision, Aryan's meticulous approach ensures our clients receive nothing but the best.",
                image: "/abc44.jpg",
              },
              {
                name: "Anjali Singh",
                role: "Creative Powerhouse",
                title: "The Ghost",
                description:
                  "Anjali is our unseen force behind impactful storytelling. As a master of words and ideas, she ensures that every blog we produce resonates deeply with readers while meeting the highest standards of quality.",
                image: "/abc5.jpg",
              },
              {
                name: "Kaivan Parekh",
                role: "Strategic Connector",
                title: "The Dealer",
                description:
                  "Kaivan bridges the gap between Blogosocial and its clients. With an innate ability to understand client needs and align them with our capabilities, he ensures every partnership thrives and every client feels valued.",
                image: "/abc2.jpg",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="relative mb-6">
                  <div className="aspect-square rounded-xl overflow-hidden">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={400}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="absolute -bottom-4 left-4 bg-[#FF9626] text-white px-4 py-1 rounded-full text-sm font-medium">
                    {member.title}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-[#FF9626] font-medium mb-4">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* A Legacy of Expertise */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">A Legacy of Expertise</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              At Blogosocial, we don't just rely on a single team—we leverage a vast network of specialists who bring
              diverse skills to the table.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <Users className="h-10 w-10 text-[#FF9626] mr-4" />
                <h3 className="text-2xl font-semibold">50+ Professionals Worked With Us</h3>
              </div>
              <p className="text-gray-600">
                Over 50 experts have contributed their talents to Blogosocial.com and GetMoreBacklinks.org. These
                professionals include SEO strategists, content creators, technical experts, and marketing specialists
                who have helped us deliver unmatched results for clients worldwide.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <Briefcase className="h-10 w-10 text-[#FF9626] mr-4" />
                <h3 className="text-2xl font-semibold">Brands That Trust Us</h3>
              </div>
              <p className="text-gray-600">
                We've had the privilege of working with numerous brands across industries through both Blogosocial.com
                and GetMoreBacklinks.org. From SaaS startups to established enterprises, our partnerships are built on
                trust, quality, and results.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Teams */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Teams (Unveiled Yet Discreet)</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              While we keep individual identities confidential to maintain focus on collective excellence, here's a
              glimpse into how our teams operate.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "SaaS Founders Team",
                description: "Visionaries who bring real-world business insights to every blog we create.",
              },
              {
                title: "SEO Writers Team",
                description:
                  "Expert wordsmiths who craft compelling content tailored for search engines and humans alike.",
              },
              {
                title: "SEO Auditors Team",
                description:
                  "Specialists who ensure every blog meets Google's E-E-A-T (Expertise, Experience, Authoritativeness, Trustworthiness) guidelines.",
              },
              {
                title: "Feedback Team",
                description: "A dedicated group that gathers client input to refine our processes continuously.",
              },
              {
                title: "Managers Team",
                description: "Operational leaders who ensure seamless execution across all projects.",
              },
            ].map((team, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <span className="text-[#FF9626] font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{team.title}</h3>
                <p className="text-gray-600">{team.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Technology Partners */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Technology Partners</h2>
              <p className="text-lg text-gray-600 mb-8">
                We believe in leveraging the best tools available to enhance human creativity. At Blogosocial, we use:
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "ChatGPT",
                    description: "For rapid ideation and content drafting.",
                  },
                  {
                    title: "Perplexity AI",
                    description: "To conduct deep research and gather insights from millions of data points.",
                  },
                  {
                    title: "Claude AI",
                    description: "For advanced contextual analysis and optimization.",
                  },
                  {
                    title: "Self-Made ICP Technologies",
                    description:
                      "Proprietary tools designed to analyze Ideal Customer Profiles (ICP) for hyper-targeted content creation.",
                  },
                ].map((tool, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 mt-1">
                      <div className="h-6 w-6 rounded-full bg-[#FF9626] flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{tool.title}</h3>
                      <p className="text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-gray-700">
                This hybrid approach ensures every blog we produce is not only innovative but also deeply relevant to
                your audience.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                <Image
                  src="/icp.jpg"
                  alt="Technology Partners"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Work With Us?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our team brings together expertise, innovation, and a proven track record of success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "A Proven Track Record",
                description:
                  "Our team has successfully delivered high-quality content for startups and established brands alike—helping them achieve top Google rankings within 120 days.",
              },
              {
                title: "A Network of Experts",
                description:
                  "With over 50 professionals contributing their expertise across various domains, we bring unparalleled depth to every project.",
              },
              {
                title: "Trusted by Brands Worldwide",
                description:
                  "Our collaborations with diverse industries reflect our ability to adapt and excel in any niche.",
              },
              {
                title: "Cutting-Edge Technology",
                description:
                  "By combining human creativity with AI precision, we deliver blogs that are both engaging and effective.",
              },
            ].map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-[#FF9626] text-white h-8 w-8 rounded-full flex items-center justify-center font-bold mr-3">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold">{reason.title}</h3>
                </div>
                <p className="text-gray-600 pl-11">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TrustedBySection />

      {/* Join Our Journey */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Journey</h2>
              <p className="text-lg text-gray-600 mb-8">
                At Blogosocial, we're not just building blogs; we're building trust, authority, and lasting
                relationships with our clients. Whether you're a startup founder looking to scale or an established
                brand seeking fresh perspectives, our team is here to turn your vision into reality.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Let's create exceptional content together—blogs that inspire action, build trust, and drive measurable
                growth. Welcome to Blogosocial: where innovation meets expertise!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-md border border-gray-200"
            >
              <h3 className="text-2xl font-bold mb-6 text-center">WANT TO JOIN AS MEMBER?</h3>
              <p className="text-center text-lg mb-8">Send your CV to us and become part of our innovative team</p>
              <div className="flex justify-center">
                <a
                  href="mailto:INFO@BLOGOSOCIAL.COM"
                  className="px-8 py-4 bg-[#FF9626] text-white rounded-lg font-medium inline-flex items-center justify-center hover:bg-[#e88620] transition-colors text-lg"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Send CV at INFO@BLOGOSOCIAL.COM
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#FF9626]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Let's Build Something Great Together</h2>
            <p className="text-xl text-white opacity-90 mb-8">
              At Blogosocial, we believe that every collaboration is an opportunity to create something extraordinary.
              Whether you're looking for guidance on your content strategy or exploring how our team can help scale your
              business, connecting with us is the first step toward achieving your goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/talk-to-founders"
                className="px-6 py-3 bg-white text-[#FF9626] rounded-lg font-medium flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                Talk to Our Founders
              </Link>
              <a
                href="mailto:info@blogosocial.com"
                className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                Email: info@blogosocial.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

