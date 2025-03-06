"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function BlogSection() {
  const blogs = [
    {
      id: 1,
      title: "Forget '10x Content' – The 3 Metrics Google Actually Rewards Now",
      slug: "forget-10x-content-the-3-metrics-google-actually-rewards-now",
      description:
        "Discover why depth, EEAT, and user obsession are 2025's ranking superpowers in SEO and content marketing.",
      date: "March 1, 2025",
      category: "Development",
      image: "/1.png",
    },
    {
      id: 2,
      title: "How Expert-Led AI Rescued Our Traffic After Google's 2025 HCU Update Slashed It by 72%",
      slug: "how-experts-led-ai-rescued-our-traffic-after-google-2025-hcu-update-slashed-by-72",
      description: "A 317% Organic Recovery Case Study That Redefined AI Content Best Practices",
      date: "February 25, 2025",
      category: "Technology",
      image: "/12.png",
    },
    {
      id: 3,
      title: "The 7 Deadly Sins of Pure AI Content That Got My SaaS Blacklisted",
      slug: "the-7-ai-sins-of-pure-ai-content-that-got-my-saas-blacklisted",
      description:
        "Discover how 12M penalized blogs exposed AI's fatal flaws and learn about the hybrid solution that saved us. A must-read for SaaS content creators",
      date: "February 18, 2025",
      category: "Design",
      image: "/55.png",
    },
    {
      id: 4,
      title: "Why 92% of Jasper.ai Users Are Switching Tools This Month (2025 Data)",
      slug: "why-92-of-jasper-ai-users-are-switching-tools-this-month-2025-data",
      description:
        "Discover why SaaS founders, content marketers, and agencies are abandoning single-layer AI tools and embracing hybrid content workflows.",
      date: "February 10, 2025",
      category: "React",
      image: "/77.png",
    },
    {
      id: 5,
      title: "Why We Fired Our Content Team and Hired 200 PhDs Instead",
      slug: "why-we-fired-our-content-team-and-hired-200-phds-instead",
      description:
        "Discover how expert-led AI content outperformed pure automation by 317% and transformed our SaaS content strategy",
      date: "February 5, 2025",
      category: "Accessibility",
      image: "/90.png",
    },
  ]

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        {/* Pill Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block mb-6"
        >
          <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">Latest Articles</span>
        </motion.div>

        {/* Heading with Highlight */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
        >
          <span className="bg-[#e3ff40] px-3 py-1">Insights</span> from Our Experts
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 max-w-2xl mx-auto"
        >
          Stay updated with our latest articles, tutorials, and insights on web development and design.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog, index) => (
          <motion.article
            key={blog.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg"
          >
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={blog.image || "/placeholder.svg"}
                alt={`${blog.title} thumbnail`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {blog.category}
                </span>
                <span className="text-xs text-gray-500">{blog.date}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.description}</p>
              <Link
                href={`/${blog.slug}`}
                className="text-sm font-medium text-blue-600 hover:underline inline-flex items-center"
              >
                Read more
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

