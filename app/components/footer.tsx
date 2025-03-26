import { Facebook, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
  const sections = {
    COMPANY: [
      { name: "Homepage", href: "https://www.blogosocial.com/" },
      { name: "Talk to founders", href: "https://www.blogosocial.com/talk-to-founders" },
      { name: "Team", href: "https://www.blogosocial.com/team" },
      { name: "Mission Vision", href: "https://www.blogosocial.com/mission" },
      { name: "Pricing", href: "#pricing" },
      { name: "Affiliate program", href: "/affilate-program" },
      { name: "Contact", href: "/contact" },
      { name: "Career", href: "/career" },
      { name: "Term & Conditions", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Refund Policy", href: "/refund-policy" },
      { name: "Getmorebacklinks", href: "http://getmorebacklinks.org/" },
      { name: "Foundertoolkit", href: "https://foundertoolkit.org/" },
      { name: "NextjS Boilerplate", href: "https://www.nextboilerplate.com/" },
      { name: "EverythingSEO", href: "https://getmoreseo.org/" },
      { name: "Convert to Blog", href: "https://convertoblog.com/" },
    ],
    "USE CASES": [
      { name: "Real Estate Blog Automation", href: "/real-estate-blog-automation" },
      { name: "Fashion Brand Blog Automation", href: "/fashion-brand-blog-automation" },
      { name: "Startup Blog Automation", href: "/startup-blog-automation" },
      { name: "E Commerce Blog Automation", href: "/ecommerce-blog-automation" },
      { name: "Local Business Blog Automation", href: "/local-business-blog-automation" },
      { name: "Small Business Blog Automation", href: "/small-business-blog-automation" },
      { name: "Technology Company Blog Automation", href: "/technology-company-blog-automation" },
      { name: "Saas Company Blog Automation", href: "/saas-company-blog-automation" },
      { name: "Medical Blog Automation", href: "/medical-blog-automation" },
      { name: "Marketing Agency Blog Automation", href: "/marketing-agency-blog-automation" },
      { name: "Dentist Blog Automation", href: "/dentist-blog-automation" },
      { name: "Travel Agency Blog Automation", href: "/travel-agency-blog-automation" },
      { name: "Education Business Blog Automation", href: "/education-business-blog-automation" },
      { name: "Health And Wellness Blog Automation", href: "/health-and-wellness-blog-automation" },
      { name: "Freelance Professional Blog Automation", href: "/freelance-professional-blog-automation" },
      { name: "Law Firm Blog Automation", href: "/law-firm-blog-automation" },
      { name: "Manufacturing Company Blog Automation", href: "/manufacturing-company-blog-automation" },
    ],
    "FREE TOOLS": [
      { name: "Letter Generator", href: "/letter-generator" },
      { name: "Academic Article Generator", href: "/academic-article-generator" },
      { name: "Real Estate Blog Generator", href: "/real-estate-blog-generator" },
      { name: "Marketing Blog Generator", href: "/marketing-blog-generator" },
      { name: "Health & Wellness Blog Generator", href: "/health-and-wellness-blog-generator" },
      { name: "Fitness Blog Generator", href: "/fitness-blog-generator" },
      { name: '"How to" Blog Generator', href: "/how-to-blog-generator" },
      { name: "eCommerce Blog Generator", href: "/ecommerce-blog-generator" },
      { name: "Paraphraser", href: "/paraphraser" },
      { name: "Real Estate Listing Property Generator", href: "/real-estate-listing-property-generator" },
      { name: "LinkedIn Profile Headline Generator", href: "/linkedin-profile-headline-generator" },
      { name: "LinkedIn Ads Generator", href: "/linkedin-ads-generator" },
      { name: "Lifestyle Blog Generator", href: "/lifestyle-blog-generator" },
      { name: "Marketing Strategy Generator", href: "/marketing-strategy-generator" },
      { name: "LinkedIn Profile Summary Generator", href: "/linkedin-profile-summary-generator" },
      { name: "Paragraph Generator", href: "/paragrapher-generator" },
      { name: "Microcopy Generator", href: "/microcopy-generator" },
    ],
    LEARN: [
      { name: "Blogs", href: "#blogs" },
      { name: "Free SEO Course", href: "https://www.getmoreseo.org/courses" },
      { name: "Free SEO Academy", href: "https://www.getmoreseo.org/b2b-seo-guide" },
      { name: "Free SEO checklist", href: "https://www.getmoreseo.org/seo-checklist-free-guide" },
    ],
    COMPARE: [
      { name: "Blogosocial vs SurferSEO", href: "/blogosocial-vs-surferseo" },
      
    ],
  }

  return (
    <footer className="bg-white py-12 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {Object.entries(sections).map(([title, items]) => (
            <div key={title} className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wider">{title}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom footer section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <img
                  src="/logo.png"
                  alt="Blogosocial Logo"
                  width={150}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-xs text-gray-700 max-w-md">
                COPYRIGHT BY MARKUPX BRANDS TECHNOLOGIES PRIVATE LIMITED. ALL RIGHTS RESERVED 2025
              </p>
            </div>

            <div className="flex space-x-4">
              <a href="https://x.com/Blogosocial_com" className="text-gray-800 hover:text-gray-600">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/company/blogosocial/" className="text-gray-800 hover:text-gray-600">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

