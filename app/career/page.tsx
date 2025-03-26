"use client"

import { motion } from "framer-motion"
import { Check, Award, Users, Brain, FileText, BarChart3, Mail, Building, Heart, Coffee, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Footer from "../components/footer"
import IntegrationsSection from "../components/integrations"
import UniversalBlogCTA from "../components/ctacontent"

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-white font-['Saira',sans-serif]">
      {/* Header */}
      <header className="bg-white py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-full py-3 px-6 flex items-center justify-between ">
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
                Join Our <span className="bg-[#FF9626] px-3 py-1 text-white">Mission</span>{" "}
                <span className="relative top-5">to Redefine Content</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-[1.6]">
                Help us build the future where human expertise and AI innovation create exceptional content
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2]">Why Join Blogosocial?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.6]">
              Be part of a revolutionary approach to content creation that's changing the industry
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Meaningful Impact",
                description:
                  "Your work directly helps startups and businesses thrive in a competitive digital landscape. Every piece of content you contribute to makes a real difference.",
                icon: <Award className="h-8 w-8 text-white" />,
              },
              {
                title: "Innovation at the Core",
                description:
                  "Work at the intersection of human expertise and cutting-edge AI technology. We're pioneering new approaches to content creation that others will follow.",
                icon: <Brain className="h-8 w-8 text-white" />,
              },
              {
                title: "Growth-Focused Culture",
                description:
                  "Develop your skills alongside industry experts and thought leaders. We invest heavily in professional development and continuous learning.",
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

      {/* Our Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-[1.2]">Our Values Define Us</h2>
              <p className="text-lg text-gray-700 mb-6 leading-[1.8]">
                At Blogosocial, our values aren't just words on a wall—they're the principles that guide every decision
                we make and every piece of content we create.
              </p>

              <div className="space-y-6 mb-8">
                {[
                  "Excellence in Everything: We never settle for 'good enough' when exceptional is possible.",
                  "Human-Centered Innovation: We use technology to enhance human capabilities, not replace them.",
                  "Integrity & Transparency: We're honest with our clients, our content, and ourselves.",
                  "Continuous Learning: We're committed to staying at the forefront of content strategy and AI development.",
                  "Measurable Impact: We focus on delivering real, quantifiable results for our clients.",
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
                  src="/collaboration.jpg"
                  alt="Blogosocial team collaboration"
                  width={800}
                  height={500}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                <p className="font-medium text-gray-800">Collaborative Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2]">Benefits & Perks</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.6]">
              We take care of our team so they can focus on creating exceptional content
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Competitive Compensation",
                description: "Salary packages that recognize your expertise and contribution.",
                icon: <Award className="h-6 w-6 text-[#FF9626]" />,
              },
              {
                title: "Remote-First Culture",
                description: "Work from anywhere with flexible hours that fit your lifestyle.",
                icon: <Globe className="h-6 w-6 text-[#FF9626]" />,
              },
              {
                title: "Health & Wellness",
                description: "Comprehensive health benefits and wellness programs.",
                icon: <Heart className="h-6 w-6 text-[#FF9626]" />,
              },
              {
                title: "Professional Development",
                description: "Learning stipends and dedicated time for skill development.",
                icon: <Brain className="h-6 w-6 text-[#FF9626]" />,
              },
              {
                title: "Equity Options",
                description: "Share in our success with equity packages for all team members.",
                icon: <Building className="h-6 w-6 text-[#FF9626]" />,
              },
              {
                title: "Team Retreats",
                description: "Regular in-person gatherings to connect and collaborate.",
                icon: <Users className="h-6 w-6 text-[#FF9626]" />,
              },
              {
                title: "Work-Life Balance",
                description: "Generous PTO policy and respect for personal boundaries.",
                icon: <Coffee className="h-6 w-6 text-[#FF9626]" />,
              },
              {
                title: "Growth Opportunities",
                description: "Clear paths for advancement and career development.",
                icon: <BarChart3 className="h-6 w-6 text-[#FF9626]" />,
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
                <div className="mb-4 flex items-center">
                  {item.icon}
                  <h3 className="text-lg font-semibold ml-2 leading-[1.3]">{item.title}</h3>
                </div>
                <p className="text-gray-700 text-sm leading-[1.7]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2]">Our Application Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.6]">
              We've designed a straightforward process to find the right talent
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Application",
                description: "Submit your resume and cover letter to info@blogosocial.com",
                icon: <FileText className="h-8 w-8 text-white" />,
              },
              {
                step: "2",
                title: "Initial Review",
                description: "Our team reviews your application and reaches out if there's a potential fit",
                icon: <Users className="h-8 w-8 text-white" />,
              },
              {
                step: "3",
                title: "Interviews",
                description: "Meet with team members to discuss your experience and our expectations",
                icon: <Building className="h-8 w-8 text-white" />,
              },
              {
                step: "4",
                title: "Welcome Aboard",
                description: "Receive an offer and join our mission to redefine content creation",
                icon: <Award className="h-8 w-8 text-white" />,
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#FF9626]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-[1.2]">
              Interested in Future Opportunities?
            </h2>
            <p className="text-xl text-white opacity-90 mb-8 leading-[1.8]">
              While we don't have open positions right now, we're always interested in connecting with talented
              individuals
            </p>

            <div className="flex justify-center">
              <a
                href="mailto:info@blogosocial.com?subject=General Interest in Joining Blogosocial"
                className="px-6 py-3 bg-white text-[#FF9626] rounded-lg font-medium flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Mail className="mr-2 h-5 w-5" /> Express Your Interest
              </a>
            </div>

            <div className="mt-12 bg-white/10 p-6 rounded-xl">
              <p className="text-xl italic text-white leading-[1.8]">
                "Join us in our mission to elevate content beyond ordinary and make a real impact in the digital world."
              </p>
              <p className="text-white/80 mt-2">— The Blogosocial Team</p>
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
              Common questions about working at Blogosocial
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Do you offer remote work opportunities?",
                answer:
                  "Yes, Blogosocial is a remote-first company. We believe in hiring the best talent regardless of location, and we have team members working from around the world.",
              },
              {
                question: "What is your interview process like?",
                answer:
                  "Our interview process typically includes an initial screening call, followed by 1-2 interviews with team members and potential colleagues. For some roles, we may also include a practical assessment relevant to the position.",
              },
              {
                question: "Do you offer internships or entry-level positions?",
                answer:
                  "Yes, we believe in nurturing new talent. We regularly offer internships and entry-level positions across various departments, with a focus on providing meaningful work experience and professional development.",
              },
              {
                question: "What's your company culture like?",
                answer:
                  "Our culture is built on collaboration, innovation, and excellence. We value diverse perspectives, open communication, and a healthy work-life balance. We're passionate about our mission and enjoy working together to achieve it.",
              },
              {
                question: "How do you support professional development?",
                answer:
                  "We provide learning stipends, access to courses and conferences, mentorship opportunities, and dedicated time for skill development. We believe in investing in our team's growth and supporting their career aspirations.",
              },
              {
                question: "What benefits do you offer?",
                answer:
                  "Our comprehensive benefits package includes competitive compensation, health insurance, retirement plans, generous PTO, flexible working hours, professional development opportunities, and equity options for all team members.",
              },
              {
                question: "Are you currently hiring?",
                answer:
                  "We don't have any open positions at the moment, but we're always interested in connecting with talented individuals who are passionate about our mission. Feel free to send your resume to info@blogosocial.com, and we'll keep you in mind for future opportunities.",
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

      <UniversalBlogCTA />
      <Footer />
    </main>
  )
}

