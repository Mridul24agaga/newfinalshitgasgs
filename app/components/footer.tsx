export default function Footer() {
    const sections = {
      COMPANY: [
        { name: "Pricing", href: "#" },
        { name: "Affiliate program", href: "#" },
        { name: "Terms & Conditions", href: "#" },
        { name: "All-in-One SEO tool & AI humanizer", href: "#" },
      ],
      "USEFUL CONTENT": [
        { name: "Blog", href: "#" },
        { name: "Blog Articles", href: "#" },
        { name: "Free Trial User Articles", href: "#" },
        { name: "Blog Ideas Examples", href: "#" },
        { name: "Cover Letters Examples", href: "#" },
        { name: "AI writing Assistant for Professionals", href: "#" },
        { name: "Questions and Answers", href: "#" },
        { name: "List of AI Generators", href: "#" },
        { name: "ChatGPT", href: "#" },
        { name: "Free AI Tools", href: "#" },
        { name: "Free AI Writing Tools", href: "#" },
      ],
      TOOLS: [
        { name: "Letter Generator", href: "#" },
        { name: "Academic Article Generator", href: "#" },
        { name: "Real Estate Blog Generator", href: "#" },
        { name: "Marketing Blog Generator", href: "#" },
        { name: "Health & Wellness Blog Generator", href: "#" },
        { name: "Fitness Blog Generator", href: "#" },
        { name: '"How to" Blog Generator', href: "#" },
        { name: "eCommerce Blog Generator", href: "#" },
        { name: "Paraphraser", href: "#" },
        { name: "Real Estate Listing Property Generator", href: "#" },
        { name: "LinkedIn Profile Headline Generator", href: "#" },
        { name: "LinkedIn Ads Generator", href: "#" },
        { name: "Lifestyle Blog Generator", href: "#" },
        { name: "Marketing Strategy Generator", href: "#" },
        { name: "LinkedIn Profile Summary Generator", href: "#" },
        { name: "Meta Descriptions Generator", href: "#" },
        { name: "Paragraph Generator", href: "#" },
        { name: "Microcopy Generator", href: "#" },
        { name: "Question Generator Generator", href: "#" },
        { name: "Real Estate Listing Description", href: "#" },
        { name: "Problem-Agitate-Solution Generator", href: "#" },
        { name: "Slogan Generator", href: "#" },
        { name: "Product Description Generator", href: "#" },
      ],
      "AI GENERATORS": [
        { name: "AI Email Campaign", href: "#" },
        { name: "AI Video", href: "#" },
        { name: "AI Social Media", href: "#" },
        { name: "AI Business/HR", href: "#" },
        { name: "AI Content Editing", href: "#" },
        { name: "AI Copy Booster", href: "#" },
        { name: "AI Website Copy", href: "#" },
      ],
      "USE CASES": [
        { name: "Real Estate Blog Automation", href: "#" },
        { name: "Fashion Brand Blog Automation", href: "#" },
        { name: "Startup Blog Automation", href: "#" },
        { name: "E Commerce Blog Automation", href: "#" },
        { name: "Local Business Blog Automation", href: "#" },
        { name: "Small Business Blog Automation", href: "#" },
        { name: "Technology Company Blog Automation", href: "#" },
        { name: "Saas Company Blog Automation", href: "#" },
        { name: "Medical Blog Automation", href: "#" },
        { name: "Marketing Agency Blog Automation", href: "#" },
        { name: "Dentist Blog Automation", href: "#" },
        { name: "Travel Agency Blog Automation", href: "#" },
        { name: "Education Business Blog Automation", href: "#" },
        { name: "Health And Wellness Blog Automation", href: "#" },
        { name: "Freelance Professional Blog Automation", href: "#" },
        { name: "Law Firm Blog Automation", href: "#" },
        { name: "Manufacturing Company Blog Automation", href: "#" },
      ],
    }
  
    return (
      <footer className="bg-white py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
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
        </div>
      </footer>
    )
  }
  
  