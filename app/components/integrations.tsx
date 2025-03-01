"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/app/components/ui/button"

const integrations = [
  {
    name: "Zapier",
    logo: "https://cdn.zapier.com/zapier/images/logos/zapier-logo.png",
    description: "Automate your workflow",
  },
  {
    name: "Slack",
    logo: "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png",
    description: "Collaborate seamlessly",
  },
  
  {
    name: "Notion",
    logo: "https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f4dd.svg",
    description: "Organize your content",
  },
  
  {
    name: "WordPress",
    logo: "https://s.w.org/style/images/about/WordPress-logotype-standard.png",
    description: "Integrate with your WordPress site",
  },
  {
    name: "Next.js",
    logo: "https://assets.vercel.com/image/upload/v1607554385/repositories/next-js/next-logo.png",
    description: "Seamless integration with Next.js apps",
  },
  {
    name: "Medium",
    logo: "https://miro.medium.com/v2/resize:fit:8978/1*s986xIGqhfsN8U--09_AdA.png",
    description: "Publish and sync with Medium",
  },
]

export default function IntegrationsSection() {
  return (
    <section className="bg-white pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
      {/* Blurred Logo Background */}
      <div className="absolute inset-0 opacity-10">
        <img
          src="/placeholder.svg?height=1080&width=1920"
          alt=""
          className="w-full h-full object-cover filter blur-3xl"
        />
      </div>

      {/* Coming Soon Effect */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-0 left-0 w-full flex justify-center items-center pointer-events-none"
      >
        <h2 className="text-7xl md:text-9xl font-extrabold text-gray-200 tracking-widest opacity-80 mt-8 drop-shadow-lg">
          COMING SOON
        </h2>
      </motion.div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10 bg-white bg-opacity-90 rounded-3xl py-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Powerful Integrations</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Seamlessly connect your favorite tools and platforms to supercharge your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 h-full flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-[#FF8A3D]">
                <div className="flex items-center mb-4">
                  <img
                    src={integration.logo || "/placeholder.svg"}
                    alt={`${integration.name} logo`}
                    className="h-12 w-12 object-contain mr-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-900">{integration.name}</h3>
                </div>
                <p className="text-gray-600 flex-grow">{integration.description}</p>
                <div className="mt-4">
                  <span className="inline-block bg-[#FFE4D3] text-[#FF8A3D] text-sm font-semibold px-3 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Button
            variant="secondary"
            className="group bg-[#FF8A3D] text-white hover:bg-[#FF7A2D] border border-[#FF8A3D] transition-all duration-300 ease-in-out transform hover:scale-105 px-8 py-3 text-lg"
          >
            Get notified about new integrations
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

