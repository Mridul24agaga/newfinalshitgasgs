export default function OurProcessSection() {
    const steps = [
      {
        title: "1. Expert SEO Writers",
        description: "My team of expert SEO writers crafts high-quality, engaging content that ranks.",
        bullets: [
          "I ensure clarity, structure, and keyword optimization for every blog",
          "Your blogs will be engaging, informative, and search engine friendly",
        ],
        icon: (
          <svg width="240" height="120" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="70" y="30" width="100" height="60" rx="2" stroke="black" strokeWidth="1.5" fill="none" />
            <line x1="70" y1="45" x2="170" y2="45" stroke="black" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="70" y1="60" x2="170" y2="60" stroke="black" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="70" y1="75" x2="170" y2="75" stroke="black" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="85" cy="52.5" r="4" fill="#fd921c" />
            <circle cx="155" cy="67.5" r="4" fill="#fd921c" />
            <path d="M90 37.5 L100 37.5" stroke="black" strokeWidth="1.5" />
            <path d="M105 37.5 L130 37.5" stroke="black" strokeWidth="1.5" />
            <path d="M90 52.5 L100 52.5" stroke="black" strokeWidth="1.5" />
            <path d="M105 52.5 L130 52.5" stroke="black" strokeWidth="1.5" />
            <path d="M90 67.5 L100 67.5" stroke="black" strokeWidth="1.5" />
            <path d="M105 67.5 L130 67.5" stroke="black" strokeWidth="1.5" />
            <path d="M90 82.5 L100 82.5" stroke="black" strokeWidth="1.5" />
            <path d="M105 82.5 L130 82.5" stroke="black" strokeWidth="1.5" />
          </svg>
        ),
      },
      {
        title: "2. Experienced SaaS Founders",
        description: "I understand what works for SaaS and product-led businesses.",
        bullets: [
          "Built by industry veterans, I create content that drives real conversions",
          "I focus on revenue-driven blogging strategies that turn visitors into customers",
        ],
        icon: (
          <svg width="240" height="120" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="120" cy="60" r="30" stroke="black" strokeWidth="1.5" fill="none" />
            <path d="M120 30 L120 40" stroke="black" strokeWidth="1.5" />
            <path d="M120 80 L120 90" stroke="black" strokeWidth="1.5" />
            <path d="M90 60 L100 60" stroke="black" strokeWidth="1.5" />
            <path d="M140 60 L150 60" stroke="black" strokeWidth="1.5" />
            <path d="M100 40 L110 50" stroke="black" strokeWidth="1.5" />
            <path d="M130 70 L140 80" stroke="black" strokeWidth="1.5" />
            <path d="M100 80 L110 70" stroke="black" strokeWidth="1.5" />
            <path d="M130 50 L140 40" stroke="black" strokeWidth="1.5" />
            <circle cx="120" cy="60" r="15" stroke="#fd921c" strokeWidth="1.5" fill="none" />
            <text x="110" y="64" fill="black" fontSize="10" fontFamily="Arial, sans-serif">
              SaaS
            </text>
          </svg>
        ),
      },
      {
        title: "3. ICP Research Technology",
        description: "I tailor content based on your Ideal Customer Profile (ICP) using advanced research.",
        bullets: [
          "My inbuilt AI technology analyzes your audience and competitors",
          "I ensure content resonates with your target market for better engagement",
        ],
        icon: (
          <svg width="240" height="120" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="120" cy="50" r="25" stroke="black" strokeWidth="1.5" fill="none" />
            <path d="M120 25 L120 75" stroke="black" strokeWidth="1.5" strokeDasharray="2 2" />
            <path d="M95 50 L145 50" stroke="black" strokeWidth="1.5" strokeDasharray="2 2" />
            <path d="M138 68 L155 85" stroke="black" strokeWidth="1.5" />
            <circle cx="160" cy="90" r="5" stroke="black" strokeWidth="1.5" fill="none" />
            <text x="115" y="45" fill="#fd921c" fontSize="10" fontFamily="Arial, sans-serif">
              ICP
            </text>
            <path d="M110 55 L130 55" stroke="#fd921c" strokeWidth="1" />
          </svg>
        ),
      },
      {
        title: "4. Deep Research AI Layer",
        description: "My multi-layered AI system ensures blogs are well-researched and data-backed.",
        bullets: [
          "I fact-check, cross-verify, and optimize content before publishing",
          "My AI technology ensures authenticity, depth, and SEO accuracy",
        ],
        icon: (
          <svg width="240" height="120" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="70" y="30" width="100" height="60" rx="2" stroke="black" strokeWidth="1.5" fill="none" />
            <rect x="80" y="40" width="80" height="40" rx="2" stroke="black" strokeWidth="1.5" fill="none" />
            <rect x="90" y="50" width="60" height="20" rx="2" stroke="#fd921c" strokeWidth="1.5" fill="none" />
            <text x="100" y="65" fill="black" fontSize="10" fontFamily="Arial, sans-serif">
              AI
            </text>
            <path d="M70 45 L170 45" stroke="black" strokeWidth="0.8" strokeDasharray="2 2" />
            <path d="M70 75 L170 75" stroke="black" strokeWidth="0.8" strokeDasharray="2 2" />
            <path d="M80 30 L80 90" stroke="black" strokeWidth="0.8" strokeDasharray="2 2" />
            <path d="M160 30 L160 90" stroke="black" strokeWidth="0.8" strokeDasharray="2 2" />
          </svg>
        ),
      },
      {
        title: "5. Review Team",
        description: "Before publishing, every blog undergoes a final review by experts.",
        bullets: [
          "My human-led review team ensures quality, structure, and brand alignment",
          "You get error-free, impactful, and conversion-driven content—every time",
        ],
        icon: (
          <svg width="240" height="120" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="50" r="15" stroke="black" strokeWidth="1.5" fill="none" />
            <circle cx="140" cy="50" r="15" stroke="black" strokeWidth="1.5" fill="none" />
            <path d="M85 50 L75 50" stroke="black" strokeWidth="1.5" />
            <path d="M155 50 L165 50" stroke="black" strokeWidth="1.5" />
            <path d="M100 65 L100 85" stroke="black" strokeWidth="1.5" />
            <path d="M140 65 L140 85" stroke="black" strokeWidth="1.5" />
            <path d="M100 85 L140 85" stroke="black" strokeWidth="1.5" />
            <path d="M120 85 L120 95" stroke="black" strokeWidth="1.5" />
            <rect x="110" y="95" width="20" height="5" rx="1" stroke="black" strokeWidth="1.5" fill="none" />
            <path d="M95 45 L105 55" stroke="#fd921c" strokeWidth="1.5" />
            <path d="M105 45 L95 55" stroke="#fd921c" strokeWidth="1.5" />
            <path d="M135 45 L145 55" stroke="#fd921c" strokeWidth="1.5" />
            <path d="M145 45 L135 55" stroke="#fd921c" strokeWidth="1.5" />
          </svg>
        ),
      },
      {
        title: "6. Content Delivery",
        description: "Receive your finalized content ready for publication and promotion.",
        bullets: [
          "Get publication-ready content delivered to your platform of choice",
          "Includes optimization for your CMS and promotional suggestions",
        ],
        icon: (
          <svg width="240" height="120" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="80" y="30" width="30" height="40" rx="2" stroke="black" strokeWidth="1.5" fill="none" />
            <rect x="130" y="30" width="30" height="40" rx="2" stroke="black" strokeWidth="1.5" fill="none" />
            <line x1="85" y1="40" x2="105" y2="40" stroke="black" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="85" y1="45" x2="105" y2="45" stroke="black" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="85" y1="50" x2="105" y2="50" stroke="black" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="85" y1="55" x2="95" y2="55" stroke="black" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="135" y1="40" x2="155" y2="40" stroke="black" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="135" y1="45" x2="155" y2="45" stroke="black" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="135" y1="50" x2="145" y2="50" stroke="black" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M115 50 L125 50" stroke="#fd921c" strokeWidth="1.5" />
            <path d="M120 45 L125 50 L120 55" stroke="#fd921c" strokeWidth="1.5" />
            <path d="M95 80 L145 80" stroke="black" strokeWidth="1.5" strokeDasharray="2 2" />
            <path d="M95 85 L145 85" stroke="black" strokeWidth="1.5" strokeDasharray="2 2" />
            <path d="M95 90 L125 90" stroke="black" strokeWidth="1.5" strokeDasharray="2 2" />
          </svg>
        ),
      },
    ]
  
    return (
      <section className="w-full py-16 bg-white font-['Saira',sans-serif]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="border border-[#fd921c] text-black text-sm font-medium px-8 py-2 rounded-full mb-6">
              What We Do
            </div>
            <h2 className="text-4xl font-bold text-black mb-3">Our Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Redefining Content Creation by Combining AI Precision with Human Ingenuity for Unmatched Results
            </p>
          </div>
  
          {/* Main container with beige background and rounded corners */}
          <div className="bg-[#FAF8F6] rounded-3xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <div className="mb-8 flex justify-center">{step.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
  
                  {/* Adding bullet points in a subtle way */}
                  <ul className="mt-4 space-y-1">
                    {step.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="text-xs text-gray-500 flex items-start">
                        <span className="text-black mr-1.5">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  