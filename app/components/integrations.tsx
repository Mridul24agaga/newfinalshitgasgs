"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Saira } from "next/font/google"
import Image from "next/image"

// Initialize the Saira font with the weights we need
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-saira",
})

const integrations = [
  {
    name: "WordPress",
    description: "Seamlessly publish your content to the world's most popular CMS platform.",
    bgColor: "bg-[#F7FBFF]",
    logoUrl: "/wordpress.png",
  },
  {
    name: "Next.js",
    description: "Seamlessly integrate with your Next.js applications for modern web development.",
    bgColor: "bg-[#FAFAFA]",
    logoUrl: "/nextjs.png",
  },
  {
    name: "Shopify",
    description: "Connect your e-commerce store and publish content directly to your Shopify blog.",
    bgColor: "bg-[#F4F9F7]",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/shopify.svg",
  },
  {
    name: "Wix",
    description: "Publish your content directly to your Wix website with our seamless integration.",
    bgColor: "bg-[#F5F5F5]",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/76/Wix.com_website_logo.svg",
  },
  {
    name: "Squarespace",
    description: "Integrate your content with Squarespace for beautiful, professional websites.",
    bgColor: "bg-[#F8F8F8]",
    logoUrl: "/squarespace.png",
  },
  {
    name: "Webflow",
    description: "Connect your Webflow site for seamless content publishing and management.",
    bgColor: "bg-[#F2F8FF]",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/92/Webflow_logo.svg",
  },
  {
    name: "Ghost",
    description: "Publish directly to your Ghost blog with our powerful integration.",
    bgColor: "bg-[#F4F9FB]",
    logoUrl: "/ghost.png",
  },
]

export default function IntegrationsSection() {
  return (
    <section className={`${saira.className} bg-white py-24 px-4`}>
      <div className="max-w-7xl mx-auto">
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
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight md:leading-tight"
          >
            <span className="bg-[#FF9626] px-3 py-1 text-white inline-block mb-2 md:mb-0 md:mr-2">Integration</span>{" "}
            <span className="inline-block">Across Multiple Platforms</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Auto-sync your content with popular CMS and e-commerce platforms
          </motion.p>
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="group"
            >
              <div className="rounded-2xl overflow-hidden border border-gray-200 h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:border-[#FF9626]/30">
                {/* Logo Area */}
                <div className={`${integration.bgColor} p-8 flex items-center justify-center h-[160px]`}>
                  <Image
                    src={integration.logoUrl || "/placeholder.svg"}
                    alt={`${integration.name} logo`}
                    width={80}
                    height={80}
                    className="object-contain max-h-[80px] w-auto"
                  />
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{integration.name}</h3>
                  <p className="text-gray-600 mb-6 flex-grow text-sm">{integration.description}</p>
                  <a
                    href="/#pricing"
                    className="inline-flex items-center text-[#FF9626] font-medium group-hover:text-[#FF9626]/80 transition-colors"
                  >
                    Connect now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-3">Don't see your platform? We're constantly adding new integrations.</p>
          <p className="text-gray-500 text-sm mb-6 max-w-2xl mx-auto">
            Please note that it can take us a few days to build the integration since all the integrations are built
            from scratch and are not premade.
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#FF9626] text-white font-medium hover:bg-[#FF9626]/90 transition-colors"
          >
            Request an integration
          </a>
        </motion.div>
      </div>
    </section>
  )
}

