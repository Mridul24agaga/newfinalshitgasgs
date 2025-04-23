import { ArrowRight, Bot, Award, ShieldCheck, FileText } from "lucide-react"

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden font-poppins">
      {/* Background Accents */}
      <div className="absolute top-40 right-0 w-72 h-72 bg-[#294df6]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-[#294df6]/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 font-poppins">
            Powerful Features for <span className="text-[#294df6]">GetMoreSEO</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg font-poppins">
            Our platform automates your entire content strategy, from research to publishing, so you can focus on
            growing your business.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {[
            {
              icon: <Bot className="h-8 w-8" />,
              title: "True 100% Autopilot Experience",
              description:
                "Your entire blogging operation runs without intervention—from topic research and keyword optimization to publishing and indexing. Set your preferences once and watch your content calendar fill with ranking-ready articles.",
            },
            {
              icon: <Award className="h-8 w-8" />,
              title: "SEO-Expert Trained System",
              description:
                "Our technology is trained by top SEO professionals from BlogoSocial.com, ensuring every post follows Google's E-E-A-T guidelines (Expertise, Experience, Authoritativeness, Trustworthiness) for maximum ranking potential.",
            },
            {
              icon: <ShieldCheck className="h-8 w-8" />,
              title: "Start Without Risk",
              description:
                "Unlike competitors with steep entry costs, GetMoreSEO lets you begin building your content foundation without paying upfront. No payment walls to get started—just powerful blogging automation at your fingertips.",
            },
            {
              icon: <FileText className="h-8 w-8" />,
              title: "Human-Quality Without Human Effort",
              description:
                "Generate fully humanized, engaging blog posts with proper structure, internal linking, and multimedia elements that keep readers engaged and search engines satisfied.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 hover:border-[#294df6]/30 transition-all duration-300 p-8 group hover:shadow-lg hover:bg-gradient-to-b hover:from-white hover:to-[#294df6]/5"
            >
              <div className="flex items-center mb-5">
                <div className="mr-4 text-[#294df6] bg-[#294df6]/10 p-3 rounded-full group-hover:bg-[#294df6]/20 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#294df6] transition-colors duration-300 font-poppins">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed font-poppins">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Feature Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { value: "50k+", label: "Articles Generated" },
            { value: "93%", label: "Ranking Improvement" },
            { value: "100%", label: "Autopilot" },
            { value: "24/7", label: "Content Creation" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#294df6] mb-2 font-poppins">{stat.value}</div>
              <div className="text-gray-600 font-medium font-poppins">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        
      </div>
    </section>
  )
}
