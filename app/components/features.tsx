"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Saira } from "next/font/google"

// Initialize the Saira font with the weights we need
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-saira", // Add variable for CSS custom property
})

export default function WhatBringsSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const features = [
    {
      title: "AI-Powered,\nHuman-Enhanced Content",
      subtitle: "Best of Both Worlds",
      description:
        "Get the efficiency of AI with the creativity and expertise of human writers. Every article is fact-checked, SEO-optimized, and tailored to your audience.",
      bullets: ["Better than AI and humans", "Engaging & storytelling blogs", "Fact-checked & branded content"],
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1%20%285%29-dorZKz8sJaZHoJS4lXpAMByXpTef7n.png",
    },
    {
      title: "SEO That Drives\nResults",
      subtitle: "Rank Higher, Faster",
      description:
        "My advanced SEO strategies ensure your content ranks on Google while attracting the right audience.",
      bullets: [
        "Custom SEO & keyword research",
        "High-ranking keyword targeted blogs",
        "Performance analytics powered by Google",
      ],
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2%20%283%29-u4WjGucWBakDrW6UCz3i6j5zCIX7pJ.png",
    },
    {
      title: "Hassle-Free,\n100% Autopilot",
      subtitle: "Save Time, Scale Effortlessly",
      description:
        "Your content is published daily, requiring zero effort on your part—just sit back and watch your traffic grow.",
      bullets: ["100% autopilot content", "Completely hands-off process", "Advanced content planning"],
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3%20%281%29-2XTIqyEjlu2rjd9w2oDt32ZdjAo3Bt.png",
    },
    {
      title: "Personalized Support &\nCustomization",
      subtitle: "Dedicated Help When You Need It",
      description: "My team is here to ensure you get the best content strategy tailored to your needs.",
      bullets: ["5 support calls per month", "Priority email support", "Custom integrations & ICP-targeted articles"],
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4%20%281%29-yMm6MNAnMlQtBjA1u54CjvRRxpHgk6.png",
    },
    {
      title: "Multi-Language,\nAI-Generated Visuals",
      subtitle: "Content That Speaks to Everyone",
      description: "Expand your reach with multilingual blogs and visually appealing content that enhances engagement.",
      bullets: ["Multiple languages supported", "AI powered image generation", "Branding & messaging customized"],
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5%20%284%29-Mmtg74MMiVQbEHcZbjW5WKTRrJ6FQF.png",
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <section className={`${saira.className} w-full bg-[#FD921C] py-10 md:py-16 lg:py-24`} ref={sectionRef}>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Badge */}
        <motion.div
          className="flex justify-center mb-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={badgeVariants}
        >
          <div className="inline-flex items-center bg-white rounded-full px-6 py-2">
            <span className="text-lg font-semibold text-[#FD921C] flex items-center">⭐ WHAT'S COMING ?</span>
          </div>
        </motion.div>

        {/* Headings */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={headingVariants}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            What Blogosocial Brings to You ?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90">
            Smarter Blogging with AI, Custom SEO, and Expert-Led Content Strategy!
          </p>
        </motion.div>

        {/* Features Timeline */}
        <motion.div
          className="relative"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div key={index} className="relative" variants={itemVariants}>
              <FeatureCard feature={feature} />
              {/* Connector Line - except for last item */}
              {index !== features.length - 1 && (
                <motion.div
                  className="absolute left-1/2 md:left-1/2 bottom-0 w-px h-8 bg-white/20 translate-y-full"
                  initial={{ height: 0 }}
                  animate={{ height: "2rem" }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  feature: {
    title: string
    subtitle: string
    description: string
    bullets: string[]
    image: string
  }
}

function FeatureCard({ feature }: FeatureCardProps) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, amount: 0.3 })

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const bulletVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden border-2 border-white mb-8 flex flex-col md:flex-row"
      ref={cardRef}
    >
      {/* Left Content */}
      <motion.div
        className="p-6 sm:p-8 md:p-10 flex-1"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={contentVariants}
      >
        <motion.h3 className="text-2xl font-bold text-gray-900 mb-2 whitespace-pre-line" variants={bulletVariants}>
          {feature.title}
        </motion.h3>
        <motion.p className="text-lg text-gray-600 mb-3" variants={bulletVariants}>
          {feature.subtitle}
        </motion.p>
        <motion.p className="text-gray-700 mb-6" variants={bulletVariants}>
          {feature.description}
        </motion.p>

        {/* Bullet Points */}
        <motion.ul className="space-y-3">
          {feature.bullets.map((item, i) => (
            <motion.li key={i} className="flex items-start" variants={bulletVariants}>
              <span className="mr-3 flex-shrink-0 mt-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="12" fill="#FD921C" fillOpacity="0.1" />
                  <path
                    d="M17 8L10 15L7 12"
                    stroke="#FD921C"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-gray-700">{item}</span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      {/* Right Illustration */}
      <motion.div
        className="hidden md:flex bg-gray-900 p-8 md:p-10 w-full md:w-[350px] items-center justify-center"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={imageVariants}
      >
        <img src={feature.image || "/placeholder.svg"} alt={feature.title} className="w-full h-auto" />
      </motion.div>
    </div>
  )
}

