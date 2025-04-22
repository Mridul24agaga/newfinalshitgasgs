import Link from "next/link"
import Image from "next/image"
import { Mail, Youtube, CreditCard, Clock, ShieldCheck } from "lucide-react"

export default function Footer() {
  const footerLinks = [
    {
      title: "AI WRITING",
      links: [
        { name: "AI SEO Editor", href: "/ai-seo-editor" },
        { name: "AI SEO Writer", href: "/ai-seo-writer" },
        { name: "AI News Writer", href: "/ai-news-writer" },
        { name: "AI Listicle Generator", href: "/ai-listicle-generator" },
        { name: "Amazon Product Reviews", href: "/amazon-product-reviews" },
        { name: "Youtube to Blog Post", href: "/youtube-to-blog" },
      ],
    },
    {
      title: "AUTOMATION",
      links: [
        { name: "Autoblog", href: "/autoblog" },
        { name: "Link Builder", href: "/link-builder" },
        { name: "Keyword Monitors", href: "/keyword-monitors" },
        { name: "Social Syndication", href: "/social-syndication" },
        { name: "Automatic Indexer", href: "/automatic-indexer" },
      ],
    },
    {
      title: "RESOURCES",
      links: [
        { name: "Pricing", href: "/pricing" },
        { name: "Learn", href: "/learn" },
        { name: "Blog", href: "/blog" },
        { name: "Help Docs", href: "/help-docs" },
        { name: "API Docs", href: "/api-docs" },
        { name: "Request a feature", href: "/request-feature" },
        { name: "Affiliate Program", href: "/affiliate-program" },
      ],
    },
    {
      title: "COMPARISONS",
      links: [
        { name: "ZimmWriter AI vs Arvow", href: "/compare/zimmwriter" },
        { name: "Drafthorse AI vs Arvow", href: "/compare/drafthorse" },
        { name: "Autoblogging AI vs Arvow", href: "/compare/autoblogging" },
        { name: "Byword AI vs Arvow", href: "/compare/byword" },
        { name: "Koala vs Arvow", href: "/compare/koala" },
      ],
    },
    {
      title: "INTEGRATIONS",
      links: [
        { name: "WordPress", href: "/integrations/wordpress" },
        { name: "Shopify", href: "/integrations/shopify" },
        { name: "Wix", href: "/integrations/wix" },
        { name: "Ghost", href: "/integrations/ghost" },
        { name: "Webflow", href: "/integrations/webflow" },
        { name: "Blogger", href: "/integrations/blogger" },
        { name: "Squarespace", href: "/integrations/squarespace" },
        { name: "Zapier", href: "/integrations/zapier" },
        { name: "Webhooks", href: "/integrations/webhooks" },
      ],
    },
  ]

  return (
    <div className="relative">
      {/* CTA Card - Overlapping the footer */}
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="rounded-3xl overflow-hidden shadow-2xl transform translate-y-24">
          {/* White Background with Colorful Accents */}
          <div className="relative bg-white px-8 py-12 md:px-12 md:py-16">
            {/* Colorful accent elements */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Blue accent */}
              <div className="absolute top-0 left-0 w-[30%] h-[30%] bg-[#4f46e5]/20 blur-3xl rounded-full"></div>
              {/* Pink accent */}
              <div className="absolute bottom-0 left-[20%] w-[25%] h-[25%] bg-[#ec4899]/20 blur-3xl rounded-full"></div>
              {/* Orange accent */}
              <div className="absolute top-[30%] right-0 w-[35%] h-[35%] bg-[#f97316]/20 blur-3xl rounded-full"></div>
              {/* Fluorescent green accent */}
              <div className="absolute bottom-[10%] right-[15%] w-[20%] h-[20%] bg-[#4ade80]/20 blur-3xl rounded-full"></div>
            </div>

            {/* Border accents */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4f46e5] via-[#ec4899] to-[#f97316]"></div>
            <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-[#f97316] via-[#4ade80] to-[#4f46e5]"></div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4">
                  Automate your Blog today
                </h2>
                <p className="text-lg text-[#1a1a1a]/80 max-w-2xl mx-auto">
                  Get your samples and start generating articles for your business.
                </p>
              </div>

              {/* Email Form */}
              <div className="max-w-3xl mx-auto mb-10">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-grow px-6 py-4 rounded-lg text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/50"
                  />
                  <button className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] hover:from-[#4338ca] hover:to-[#6d28d9] text-white px-8 py-4 rounded-lg font-medium text-base whitespace-nowrap transition-all duration-200">
                    Get 3 Free Articles
                  </button>
                </div>
              </div>

              {/* User Avatars */}
              <div className="flex flex-col items-center justify-center mb-10">
                <div className="flex items-center mb-6">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-md">
                        <Image
                          src={`/user-${i}.jpg`}
                          alt={`User ${i}`}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="ml-4 text-[#1a1a1a] font-medium">
                    Join <span className="font-bold">25,260+</span> business owners
                  </span>
                </div>

                {/* Features */}
                <div className="flex flex-wrap justify-center gap-12 text-[#1a1a1a]">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-[#4f46e5]/10 mr-3">
                      <CreditCard className="h-5 w-5 text-[#4f46e5]" />
                    </div>
                    <span>No card required</span>
                  </div>
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-[#ec4899]/10 mr-3">
                      <Clock className="h-5 w-5 text-[#ec4899]" />
                    </div>
                    <span>Articles in 30 secs</span>
                  </div>
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-[#4ade80]/10 mr-3">
                      <ShieldCheck className="h-5 w-5 text-[#4ade80]" />
                    </div>
                    <span>Plagiarism Free</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with padding to accommodate the overlapping card */}
      <footer className="bg-[#0f1116] text-gray-300 pt-40 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
            {footerLinks.map((column, i) => (
              <div key={i}>
                <h3 className="text-sm font-medium text-white mb-4">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="mb-6 md:mb-0">
                {/* Logo */}
                <div className="flex items-center mb-6">
                  <div className="text-white font-bold text-xl flex items-center">
                    <div className="w-8 h-8 mr-2 bg-white rounded-full flex items-center justify-center text-black">
                      A
                    </div>
                    Arvow
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4 mb-6">
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src="/founder-1.jpg"
                      alt="Founder"
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  </a>
                  <a href="#" className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src="/founder-2.jpg"
                      alt="Founder"
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  </a>
                </div>

                {/* Copyright */}
                <div className="text-xs text-gray-500">Copyright 2024. OBEDIENTSHIELD, LDA. All rights reserved!</div>
              </div>

              {/* Contact & Legal */}
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <a
                  href="mailto:support@arvow.com"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  support@arvow.com
                </a>
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
