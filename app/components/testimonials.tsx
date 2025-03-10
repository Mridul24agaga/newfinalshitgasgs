import { Star } from "lucide-react"

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Ayush Sharma",
      role: "Digital Marketer",
      title: '"The Best Blogging Machine on the Internet!"',
      content:
        "\"I've tried AI tools, freelancers, and even wrote my own blogs, but nothing matches BlogoSocial. It's not just AI—it's better than AI and humans combined! My blogs are engaging, SEO-optimized, and published on autopilot. Hands down, the best content partner!\"",
      image: "abc1.jpg",
    },
    {
      name: "Kaivan Parekh.",
      role: "E-commerce Store Owner",
      title: '"BlogoSocial Does What AI Can\'t!"',
      content:
        '"I was tired of generic AI-generated blogs that lacked personality. Then I found BlogoSocial! It writes high-ranking blogs that actually convert. It researches keywords, fact-checks content, and even generates images—AI, but not AI. It\'s like having a human SEO expert in my pocket!"',
      image: "/abc2.jpg",
    },
    
    {
      name: "CJ Singh",
      role: "SaaS Founder",
      title: '"Google Loves My Blog Now!"',
      content:
        '"Ever since I started using BlogoSocial, my rankings have skyrocketed! The performance analytics powered by Google helped me understand what works. My blogs are now informative and extremely linkable. Perfect, structured, and backed by SEO experts. BlogoSocial just gets it!"',
      image: "/abc3.jpg",
    },
    {
      name: "Aryan Chittora",
      role: "Agency Owner",
      title: '"More Than Just AI—It\'s a Blogging Genius!"',
      content:
        "\"BlogoSocial isn't just another AI tool—it's a five-layer system that produces fact-checked, visually appealing, and engaging content. My partner blogs have never gotten this good, and my audience keeps coming back!\"",
      image: "/abc44.jpg",
    },
    {
      name: "Anjali Singh",
      role: "Business Consultant",
      title: '"Autopilot Blogging That Works!"',
      content:
        "\"I wanted to grow my blog but didn't have time. BlogoSocial took over and now I get custom SEO keywords, targeted keywords, and an advanced content plan—without lifting a finger. It's 100% autopilot, and my traffic is soaring!\"",
      image: "/abc5.jpg",
    },
    {
      name: "Rupin Pratap",
      role: "Content Creator",
      title: '"Personalized Support That AI Can\'t Provide!"',
      content:
        '"With BlogoSocial, I\'m never alone. I get three support calls per month, priority email support, and custom integrations tailored to my niche. No AI tool has ever given me this level of personalization! BlogoSocial is the future of blogging!"',
      image: "/abc6.jpg",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="inline-block px-4 py-1 rounded-full border border-[#FF9626] text-[#FF9626] text-sm mb-4">
          MY FAVOURATE CUSTOMERS
        </div>
        <h2 className="text-4xl font-bold">My Customers Loves Me!</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <img
                src={testimonial.image || "/placeholder.svg"}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[#FF9626]">—</span>
                  <span className="text-[#FF9626] font-semibold">{testimonial.name}</span>
                  <span className="text-gray-600">{testimonial.role}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold mb-3">{testimonial.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{testimonial.content}</p>
            </div>

            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#FF9626] text-[#FF9626]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

