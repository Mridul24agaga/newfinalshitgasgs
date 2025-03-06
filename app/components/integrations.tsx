"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const integrations = [
  {
    name: "Slack",
    description: "Connect and collaborate with your team in real-time through Slack.",
    bgColor: "bg-[#ECF5FD]",
    logoColor: "#4A154B",
    secondaryColor: "#36C5F0",
    Logo: () => (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M32.5 16.25C32.5 12.795 29.705 10 26.25 10C22.795 10 20 12.795 20 16.25V32.5C20 35.955 22.795 38.75 26.25 38.75C29.705 38.75 32.5 35.955 32.5 32.5V16.25Z"
          fill="#36C5F0"
        />
        <path
          d="M26.25 41.25C22.795 41.25 20 44.045 20 47.5C20 50.955 22.795 53.75 26.25 53.75H42.5C45.955 53.75 48.75 50.955 48.75 47.5C48.75 44.045 45.955 41.25 42.5 41.25H26.25Z"
          fill="#2EB67D"
        />
        <path
          d="M60 47.5C60 44.045 57.205 41.25 53.75 41.25C50.295 41.25 47.5 44.045 47.5 47.5V63.75C47.5 67.205 50.295 70 53.75 70C57.205 70 60 67.205 60 63.75V47.5Z"
          fill="#ECB22E"
        />
        <path
          d="M53.75 38.75C57.205 38.75 60 35.955 60 32.5C60 29.045 57.205 26.25 53.75 26.25H37.5C34.045 26.25 31.25 29.045 31.25 32.5C31.25 35.955 34.045 38.75 37.5 38.75H53.75Z"
          fill="#E01E5A"
        />
      </svg>
    ),
  },
  {
    name: "Next.js",
    description: "Seamlessly integrate with your Next.js applications.",
    bgColor: "bg-[#FAFAFA]",
    logoColor: "#000000",
    Logo: () => (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M40 15C26.1929 15 15 26.1929 15 40C15 53.8071 26.1929 65 40 65C45.3644 65 50.3772 63.4693 54.5765 60.8215L35.1863 34.2764V53.3333H31.6667V28.3333H35.1863L57.2431 58.1215C62.0218 53.3057 65 47.0261 65 40C65 26.1929 53.8071 15 40 15ZM56.6667 53.3333L53.3333 48.6667V28.3333H56.6667V53.3333Z"
          fill="black"
        />
      </svg>
    ),
  },
  {
    name: "Medium",
    description: "Share your content directly to Medium with one click.",
    bgColor: "bg-[#FFF8F3]",
    logoColor: "#000000",
    Logo: () => (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(10, 10) scale(0.75)">
          <path
            d="M11.3838 24.4706C11.3838 31.5224 17.2941 37.2941 24.4706 37.2941C31.647 37.2941 37.5573 31.5224 37.5573 24.4706C37.5573 17.4188 31.647 11.6471 24.4706 11.6471C17.2941 11.6471 11.3838 17.4188 11.3838 24.4706Z"
            fill="black"
          />
          <path
            d="M44.1176 24.4706C44.1176 31.0588 47.0735 36.4706 50.7059 36.4706C54.3382 36.4706 57.2941 31.0588 57.2941 24.4706C57.2941 17.8824 54.3382 12.4706 50.7059 12.4706C47.0735 12.4706 44.1176 17.8824 44.1176 24.4706Z"
            fill="black"
          />
          <path
            d="M62.1176 24.4706C62.1176 30.2941 63.5294 35 65.2941 35C67.0588 35 68.4706 30.2941 68.4706 24.4706C68.4706 18.6471 67.0588 13.9412 65.2941 13.9412C63.5294 13.9412 62.1176 18.6471 62.1176 24.4706Z"
            fill="black"
          />
        </g>
      </svg>
    ),
  },
]

export default function IntegrationsSection() {
  return (
    <section className="bg-white py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">Integrations</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            <span className="bg-[#e3ff40] px-3 py-1">AI Automation</span> across 500+ apps
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            See how we help your team solve today's biggest challenges.
          </motion.p>
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="group"
            >
              <div className="rounded-2xl overflow-hidden border border-gray-200 h-full flex flex-col transition-all duration-300 hover:shadow-lg">
                {/* Logo Area */}
                <div className={`${integration.bgColor} p-12 flex items-center justify-center`}>
                  <integration.Logo />
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{integration.name}</h3>
                  <p className="text-gray-600 mb-6 flex-grow">{integration.description}</p>
                  <a
                    href="#"
                    className="inline-flex items-center text-gray-900 font-medium group-hover:text-gray-600 transition-colors"
                  >
                    Get started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

