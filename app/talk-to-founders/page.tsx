"use client"

import { motion } from "framer-motion"
import { Calendar, Zap, Award, Users, ArrowRight, ExternalLink } from "lucide-react"
import { Saira } from "next/font/google"
import Image from "next/image"
import Link from "next/link"

// Initialize the Saira font with the weights we need
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-saira",
})

export default function TalkToFoundersClientPage() {
  return (
    <main className={`${saira.className} min-h-screen bg-white`}>
      {/* Header */}
      <header className="bg-[#FF9626] py-4">
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
              <Link href="/team" className="text-gray-600 hover:text-gray-900 transition-colors">
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
              <div className="flex items-center justify-center h-8 w-8">
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path
                      fill="#4285F4"
                      d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                    />
                    <path
                      fill="#34A853"
                      d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                    />
                  </g>
                </svg>
              </div>

              <Link
                href="/start"
                className="bg-[#FF9626] text-white px-5 py-2 rounded-full font-medium hover:bg-[#e88620] transition-colors"
              >
                Start for free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-90 z-0"></div>
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Pill Label */}
              <div className="inline-block mb-6">
                <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                  Connect Directly
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Talk to the <span className="bg-[#FF9626] px-3 py-1 text-white">Founders</span>
              </h1>

              <p className="text-xl text-gray-700 mb-8">
                Connect directly with the visionaries behind Blogosocial and explore how we can revolutionize your
                content strategy.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#schedule"
                  className="px-6 py-3 bg-[#FF9626] text-white rounded-lg font-medium flex items-center justify-center hover:bg-[#e88620] transition-colors"
                >
                  Schedule a Call <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a
                  href="mailto:info@blogosocial.com"
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  Email Us
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  alt="Founders of Blogosocial"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-md border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="bg-green-500 h-3 w-3 rounded-full animate-pulse"></div>
                  <span className="font-medium text-gray-800">Available to chat</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Talk to Our Founders */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Talk to Our Founders?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              At Blogosocial, we value transparency, collaboration, and personal connections. By speaking directly with
              our founders, you gain access to:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Zap className="h-8 w-8 text-[#FF9626]" />,
                title: "Visionary Insights",
                description:
                  "Learn about the philosophy and strategy behind Blogosocial, straight from the minds that created it.",
              },
              {
                icon: <Users className="h-8 w-8 text-[#FF9626]" />,
                title: "Tailored Solutions",
                description:
                  "Discuss your unique business needs and discover how our platform can be customized to meet them.",
              },
              {
                icon: <Calendar className="h-8 w-8 text-[#FF9626]" />,
                title: "Future Roadmap",
                description:
                  "Get a sneak peek into upcoming innovations and features designed to keep your content ahead of industry trends.",
              },
              {
                icon: <Award className="h-8 w-8 text-[#FF9626]" />,
                title: "Expert Advice",
                description:
                  "Receive actionable tips on blogging, SEO strategies, and leveraging AI for maximum impact.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet The Founders */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Meet The Founders</h2>
              <h3 className="text-xl font-semibold text-[#FF9626] mb-4">The Brainchild Behind Blogosocial</h3>

              <p className="text-gray-700 mb-6">
                Krissmann Gupta & Mridul Thareja are seasoned entrepreneurs and SaaS founders who envisioned Blogosocial
                as more than just a blogging platform—it's a movement to redefine how startups approach content
                creation. With years of experience in SEO, SaaS development, and digital marketing, they combine
                technical expertise with creative storytelling to deliver blogs that inspire action and drive measurable
                growth.
              </p>

              <h3 className="text-xl font-semibold mb-4">What Drives Them?</h3>

              <ul className="space-y-3 mb-6">
                {[
                  "A passion for empowering startups through authentic, expert-driven content.",
                  "A commitment to blending human ingenuity with advanced AI technology for unmatched blogging excellence.",
                  "A vision to create blogs that don't just rank—they resonate deeply with readers and build lasting trust.",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#FF9626] mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src="/placeholder.svg?height=400&width=400"
                    alt="Krissmann Gupta"
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-md mt-8">
                  <Image
                    src="/placeholder.svg?height=400&width=400"
                    alt="Mridul Thareja"
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="schedule" className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works: Schedule Your Call</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Connect with our founders in just two simple steps and start transforming your content strategy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "Step 1",
                title: "Choose Your Preferred Time",
                description:
                  "Pick a time that works best for you. Our founders offer flexible scheduling options to accommodate founders from around the world.",
              },
              {
                step: "Step 2",
                title: "Connect via Video or Text",
                description:
                  "Enjoy a one-on-one session with Krissmann Gupta and Mridul Thareja to discuss your business needs, explore solutions, and gain valuable insights.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative"
              >
                <div className="absolute -top-4 left-8 bg-[#FF9626] text-white px-4 py-1 rounded-full text-sm font-medium">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3 mt-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="https://calendly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#FF9626] text-white rounded-lg font-medium inline-flex items-center justify-center hover:bg-[#e88620] transition-colors text-lg"
            >
              Schedule Your Call Now <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* What You'll Gain */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What You'll Gain from the Conversation</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our founders provide valuable insights and actionable strategies to elevate your content marketing.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Personalized Content Strategy",
                description:
                  "Our founders will help you identify opportunities for growth through strategic blogging tailored specifically to your niche.",
              },
              {
                title: "Exclusive Insights into Blogosocial's 5-Layer System",
                description:
                  "Learn how our revolutionary approach—combining expert writers, SaaS founders' insights, ICP research technology, AI deep research layers, and editorial review teams—can elevate your content strategy.",
              },
              {
                title: "Guidance on SEO Optimization",
                description:
                  "Discover actionable tips on improving your blog's SEO performance, driving organic traffic, and achieving top Google rankings within 120 days.",
              },
              {
                title: "A Look at Future Innovations",
                description:
                  "Get an insider's perspective on Blogosocial's roadmap—including features like real-time data embedding, podcast auto-chaptering, collaborative AI-powered workspaces, and more.",
              },
            ].map((item, index) => (
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
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                </div>
                <p className="text-gray-600 pl-11">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Should Reach Out */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Should Reach Out?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              This opportunity is perfect for founders and marketers looking to elevate their content strategy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                title: "SaaS Founders",
                description: "Looking to scale their digital presence through high-quality blogs.",
              },
              {
                title: "D2C Brands",
                description: "Seeking authentic content that builds trust and drives conversions.",
              },
              {
                title: "Agency Owners",
                description: "Wanting premium blogging services for their clients.",
              },
              {
                title: "Personal Brand Builders",
                description: "Aspiring influencers aiming to establish authority in their niche.",
              },
              {
                title: "Bloggers",
                description: "Searching for innovative tools to enhance their reach and engagement.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Partners */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Technology Partners</h2>
              <p className="text-lg text-gray-600 mb-8">
                We leverage cutting-edge tools to ensure every blog is optimized for search engines while delivering
                genuine value to readers.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "Full-Stack Engineers",
                    description:
                      "Brilliant minds who work tirelessly to architect and build our platform with cutting-edge technologies.",
                  },
                  {
                    title: "SEO Specialists",
                    description:
                      "Technical wizards who understand search algorithms and implement data-driven optimization strategies.",
                  },
                  {
                    title: "UX/UI Developers",
                    description:
                      "Creative geniuses who craft intuitive interfaces that make content management a breeze.",
                  },
                  {
                    title: "Data Scientists",
                    description:
                      "Analytical experts who develop our proprietary ICP technologies for hyper-targeted content creation.",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 mt-1">
                      <div className="h-6 w-6 rounded-full bg-[#FF9626] flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M5 12L10 17L20 7"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">What Makes Blogosocial Unique?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Unlike generic blogging platforms or purely automated solutions:
              </p>

              <div className="space-y-4">
                {[
                  "We combine human creativity with AI precision for unmatched quality.",
                  "Our expert-in-the-loop framework ensures every blog meets Google's E-E-A-T standards.",
                  "We offer multi-language support (50+ languages) validated by native linguists.",
                  "We guarantee top Google rankings within 120 days—backed by unlimited SEO support.",
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="text-[#FF9626] mr-2 text-xl">•</div>
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3">Trusted by Brands Worldwide</h3>
                <p className="text-gray-600">
                  Blogosocial has worked with over 50 professionals across industries through both Blogosocial.com and
                  GetMoreBacklinks.org. Our clients include startups, established enterprises, and creative
                  entrepreneurs who trust us for our unparalleled expertise in blogging and SEO.
                </p>
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
              At Blogosocial, we believe that every conversation is an opportunity to create something extraordinary.
              Whether you're looking for guidance on your content strategy or exploring how our platform can help scale
              your business, talking directly with our founders is the first step toward achieving your goals.
            </p>

            <h3 className="text-2xl font-bold text-white mb-6">Ready to Elevate Your Content Strategy?</h3>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#schedule"
                className="px-6 py-3 bg-white text-[#FF9626] rounded-lg font-medium flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                Schedule a Call <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="mailto:info@blogosocial.com"
                className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                Email: info@blogosocial.com
              </a>
            </div>

            <p className="text-white mt-6">Let's redefine blogging excellence—together!</p>
          </motion.div>
        </div>
      </section>

      {/* Bento Links Section */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold mb-2">BY FOUNDERS FOR FOUNDERS</h2>
            <p className="text-gray-600">Connect with our founders on social media</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { name: "Twitter", icon: "twitter", url: "https://twitter.com" },
              { name: "LinkedIn", icon: "linkedin", url: "https://linkedin.com" },
              { name: "Instagram", icon: "instagram", url: "https://instagram.com" },
              { name: "Bento", icon: "link", url: "https://bento.me/krissmann" },
            ].map((item, index) => (
              <motion.a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-100 hover:bg-gray-200 transition-colors p-4 rounded-xl flex flex-col items-center justify-center"
              >
                <span className="text-gray-800 font-medium">{item.name}</span>
                {item.name === "Bento" && (
                  <span className="text-xs text-gray-500 mt-1 flex items-center">
                    bento.me/krissmann <ExternalLink className="h-3 w-3 ml-1" />
                  </span>
                )}
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

