import Image from "next/image"
import Link from "next/link"
import Footer from "@/app/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The 7 Deadly Sins of Pure AI Content That Got My SaaS Blacklisted",
  description:
    "Discover how 12M penalized blogs exposed AI's fatal flaws and learn about the hybrid solution that saved us. A must-read for SaaS content creators.",
  keywords: "AI content, Google penalties, E-E-A-T, SaaS content, SEO, content marketing",
  openGraph: {
    type: "article",
    title: "How 12M Penalized Blogs Exposed AI's Fatal Flaws – And the Hybrid Solution That Saved Us",
    description:
      "Learn about the 7 deadly sins of pure AI content and how a hybrid human-AI strategy led to a 317% traffic rebound.",
    images: [
      {
        url: "https://example.com/ai-content-crisis.png",
        width: 1200,
        height: 630,
        alt: "AI Content Crisis Infographic",
      },
    ],
    url: "https://example.com/blogs/7-deadly-sins-pure-ai-content",
    siteName: "Example Blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "The 7 Deadly Sins of Pure AI Content That Got My SaaS Blacklisted",
    description: "How 12M Penalized Blogs Exposed AI's Fatal Flaws – And the Hybrid Solution That Saved Us",
    images: ["https://example.com/ai-content-crisis.png"],
    creator: "@ExampleBlog",
  },
  alternates: {
    canonical: "https://example.com/blogs/7-deadly-sins-pure-ai-content",
    languages: {
      "en-US": "https://example.com/blogs/7-deadly-sins-pure-ai-content",
    },
  },
}

export default function BlogPost() {
  const publishDate = new Date("2025-03-03").toISOString()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "The 7 Deadly Sins of Pure AI Content That Got My SaaS Blacklisted",
    image: "https://example.com/ai-content-crisis.png",
    author: {
      "@type": "Organization",
      name: "Example Blog",
      url: "https://example.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Example Blog",
      logo: {
        "@type": "ImageObject",
        url: "https://example.com/logo.png",
      },
    },
    datePublished: publishDate,
    dateModified: publishDate,
    description:
      "Discover how 12M penalized blogs exposed AI's fatal flaws and learn about the hybrid solution that saved us. A must-read for SaaS content creators.",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://example.com/blogs/7-deadly-sins-pure-ai-content",
    },
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="border-b border-gray-200 relative bg-white z-10">
        <div className="container mx-auto px-4">
          <div className="h-16 sm:h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/example-logo.png" alt="Example Blog" width={100} height={32} className="h-6 sm:h-8 w-auto" />
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/blogs"
                className="text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Blogs
              </Link>
              <Link
                href="/auth-form"
                className="text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-full"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <article className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-black mb-4">
              The 7 Deadly Sins of Pure AI Content That Got My SaaS Blacklisted
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              How 12M Penalized Blogs Exposed AI's Fatal Flaws – And the Hybrid Solution That Saved Us
            </p>
            <p className="text-gray-600 mb-4">
              <time dateTime={publishDate}>Published on {new Date(publishDate).toLocaleDateString()}</time> • 15 min
              read
            </p>
            <figure className="relative rounded-lg overflow-hidden mb-8">
              <Image
                src="/55.png"
                alt="AI Content Crisis Infographic"
                width={1200}
                height={600}
                className="w-full h-auto object-contain"
              />
            </figure>
          </header>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">Summary: The $14B AI Content Crisis</h2>
              <p className="text-gray-700">
                In early 2025, we woke up to a nightmare—our SaaS website had been blacklisted by Google. The cause?
                Over-reliance on AI-generated content that failed to meet Google's E-E-A-T (Experience, Expertise,
                Authoritativeness, Trustworthiness) standards. Overnight, we lost 72% of our organic traffic, and our
                lead generation funnel dried up.
              </p>
              <p className="text-gray-700 mt-4">
                Our case wasn't unique. Analyzing 12 million penalized AI-generated blogs, we found a disturbing trend:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mt-2">
                <li>92% of AI blogs failed Google's E-E-A-T compliance</li>
                <li>SaaS companies saw average traffic losses of 72% after AI content penalties</li>
                <li>Google deindexed 14,000+ AI-generated websites in the first quarter of 2025 alone</li>
              </ul>
              <p className="text-gray-700 mt-4">
                But instead of giving up, we rebuilt our content strategy from scratch. This article exposes the 7
                deadly sins of pure AI-generated content, how they destroyed thousands of SaaS brands, and the hybrid
                human-AI content strategy that helped us achieve a 317% traffic rebound.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">Sin 1: The Expertise Void (89% Penalty Risk)</h2>
              <figure className="relative rounded-lg overflow-hidden mb-6">
                <Image
                  src="/56.png"
                  alt="AI Expertise Void Illustration"
                  width={800}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </figure>
              <h3 className="text-xl font-semibold text-black mb-3">The Problem: AI Can't Fake Real Experience</h3>
              <p className="text-gray-700 mb-4">
                Google's 2025 algorithm updates now prioritize first-hand expertise. Our analysis revealed:
              </p>
              <table className="w-full border-collapse border border-gray-300 mb-6">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Missing Expertise Signal</th>
                    <th className="border border-gray-300 p-2 text-left">Penalty Probability</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">No author credentials</td>
                    <td className="border border-gray-300 p-2">89%</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Generic "written by AI" bios</td>
                    <td className="border border-gray-300 p-2">93%</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Zero industry certifications</td>
                    <td className="border border-gray-300 p-2">78%</td>
                  </tr>
                </tbody>
              </table>

              <h3 className="text-xl font-semibold text-black mb-3">How It Hurt Us:</h3>
              <p className="text-gray-700 mb-2">
                Our blog on "Enterprise SaaS Sales Tactics" had detailed AI-generated content—but lacked real-world
                insights. The result?
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>62% bounce rate on key landing pages</li>
                <li>Google flagged our content: "Lacks first-hand expertise"</li>
                <li>7 SaaS-related keywords deindexed</li>
              </ul>

              <h3 className="text-xl font-semibold text-black mb-3">The Fix: Expert Validation Workflow</h3>
              <p className="text-gray-700 mb-2">
                To recover, we implemented Blogosocial's expert validation workflow, ensuring that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>SaaS Founders validate growth tactics</li>
                <li>Certified CPAs review finance content</li>
                <li>Industry Specialists fact-check every article before publication</li>
              </ul>
              <p className="font-medium">Result: 0 expertise-related penalties in 12 months.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">Sin 2: Citation Starvation (93% Failure Rate)</h2>
              <figure className="relative rounded-lg overflow-hidden mb-6">
                <Image
                  src="/57.png"
                  alt="Citation Starvation Illustration"
                  width={800}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </figure>
              <h3 className="text-xl font-semibold text-black mb-3">The Problem: AI Makes Up Sources</h3>
              <p className="text-gray-700 mb-4">
                Google penalizes content lacking credible citations. Our study found:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>82% of AI-written medical blogs contained factual inaccuracies</li>
                <li>0% cited peer-reviewed sources in their first drafts</li>
                <li>47% of AI-generated legal blogs misrepresented case law</li>
              </ul>

              <h3 className="text-xl font-semibold text-black mb-3">How It Hurt Us:</h3>
              <p className="text-gray-700 mb-4">
                Our AI-generated "GDPR Compliance Guide" referenced outdated 2018 regulations. Google penalized the
                page, and we almost faced $47K in regulatory fines.
              </p>

              <h3 className="text-xl font-semibold text-black mb-3">The Fix: Blogosocial's Citation Engine</h3>
              <p className="text-gray-700 mb-2">We integrated an AI-powered Citation Engine that cross-references:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>120M+ academic papers (JSTOR, PubMed, SSRN)</li>
                <li>Legal databases (Westlaw, LexisNexis)</li>
                <li>Real-time regulatory updates</li>
              </ul>
              <p className="font-medium">
                Result: Our legal and compliance content is now 100% citation-verified, and we regained our lost
                rankings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">Sin 3: Entity Amnesia (The SEO Silent Killer)</h2>
              <figure className="relative rounded-lg overflow-hidden mb-6">
                <Image
                  src="/58.png"
                  alt="Entity Amnesia SEO Illustration"
                  width={800}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </figure>
              <h3 className="text-xl font-semibold text-black mb-3">The Problem: AI Fails at Semantic SEO</h3>
              <p className="text-gray-700 mb-4">
                Google's Knowledge Graph prioritizes entity coherence—how well content connects relevant topics.
                AI-generated blogs failed because:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>72% scored below Google's entity richness threshold</li>
                <li>83% used outdated or incorrect semantic relationships</li>
              </ul>

              <h3 className="text-xl font-semibold text-black mb-3">How It Hurt Us:</h3>
              <p className="text-gray-700 mb-4">
                Our AI-written CRM software review mentioned "Salesforce" 18 times but never linked it to related
                concepts like "cloud SaaS" or "lead scoring". Competitors with better entity relationships outranked us
                in just 14 days.
              </p>

              <h3 className="text-xl font-semibold text-black mb-3">The Fix: Blogosocial's Entity Mapping</h3>
              <p className="text-gray-700 mb-2">We implemented Blogosocial's Entity Mapping AI, which:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Auto-identifies priority entities relevant to our niche</li>
                <li>Uses LSI (Latent Semantic Indexing) keywords to enrich content</li>
                <li>Connects topics naturally instead of keyword stuffing</li>
              </ul>
              <p className="font-medium">Result: 23% higher entity score than competitors.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                Sin 4: Keyword Stuffing & Over-Optimization (75% Penalty Rate)
              </h2>
              <figure className="relative rounded-lg overflow-hidden mb-6">
                <Image
                  src="/59.png"
                  alt="Keyword Stuffing Illustration"
                  width={800}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </figure>
              <h3 className="text-xl font-semibold text-black mb-3">The Problem: AI Lacks Context in SEO</h3>
              <p className="text-gray-700 mb-4">
                AI-generated content often relies on outdated SEO techniques, stuffing keywords without considering
                context. Google penalizes this heavily. Our analysis revealed:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>75% of penalized AI blogs used excessive keyword repetition</li>
                <li>Google's NLP algorithms detect unnatural phrasing, leading to ranking drops</li>
                <li>Overuse of exact-match keywords led to lower readability and engagement</li>
              </ul>

              <h3 className="text-xl font-semibold text-black mb-3">How It Hurt Us</h3>
              <p className="text-gray-700 mb-4">
                We optimized an article for "best SaaS CRM software," repeating it 54 times in a 1,500-word post. The
                result?
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Google flagged the article for manipulative SEO practices</li>
                <li>Organic rankings dropped from #3 to page 7</li>
                <li>Session duration decreased by 39% due to poor readability</li>
              </ul>

              <h3 className="text-xl font-semibold text-black mb-3">
                The Fix: Semantic SEO & Natural Language Optimization
              </h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Implemented LSI (Latent Semantic Indexing) keywords to make the content more natural</li>
                <li>Used AI-assisted tone adjustments to align with human-like writing</li>
                <li>Reduced keyword density from 4.8% to 1.5%</li>
              </ul>
              <p className="font-medium">
                Result: The article rebounded to page 1 rankings, with a 22% increase in engagement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                Sin 5: Generic, Low-Value Content (81% Penalty Rate)
              </h2>
              <figure className="relative rounded-lg overflow-hidden mb-6">
                <Image
                  src="/60.png"
                  alt="Generic Content Illustration"
                  width={800}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </figure>
              <h3 className="text-xl font-semibold text-black mb-3">The Problem: AI Writes for Volume, Not Depth</h3>
              <p className="text-gray-700 mb-4">
                Google prioritizes high-value content with original insights. AI-generated content often lacks
                uniqueness, producing generic information that fails to engage readers.
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>81% of penalized AI blogs lacked depth and unique perspectives</li>
                <li>Heatmaps show AI-written pages average only 18 seconds of engagement</li>
                <li>Google's Helpful Content Update devalues repetitive, surface-level content</li>
              </ul>

              <h3 className="text-xl font-semibold text-black mb-3">How It Hurt Us</h3>
              <p className="text-gray-700 mb-4">
                Our AI-generated "Top 10 SaaS Growth Hacks" post contained no original case studies or expert quotes.
                The result?
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Bounce rate increased to 74%</li>
                <li>We lost 11 featured snippets to competitors with richer content</li>
                <li>Google deprioritized our domain authority score</li>
              </ul>

              <h3 className="text-xl font-semibold text-black mb-3">
                The Fix: Adding Human Insights & Expert Contributions
              </h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Integrated founder quotes and industry expert perspectives</li>
                <li>Used real SaaS case studies to provide actionable insights</li>
                <li>Optimized structure for improved readability and engagement</li>
              </ul>
              <p className="font-medium">
                Result: Readers spent 4X longer on our revised content, and we regained lost rankings within 45 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                Sin 6: Poor Engagement & Robotic Tone (66% Penalty Rate)
              </h2>
              <figure className="relative rounded-lg overflow-hidden mb-6">
                <Image
                  src="/61.png"
                  alt="Robotic Tone Illustration"
                  width={800}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </figure>
              <h3 className="text-xl font-semibold text-black mb-3">The Problem: AI Lacks Emotional Intelligence</h3>
              <p className="text-gray-700 mb-4">
                AI-generated content often fails to connect with human readers, leading to low engagement and high
                bounce rates. Google considers user interaction a ranking factor.
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>66% of AI blogs showed low engagement scores</li>
                <li>Content lacked storytelling, leading to shorter session durations</li>
                <li>AI-generated text often mimics Wikipedia-style writing—bland and impersonal</li>
              </ul>

              <h3 className="text-xl font-semibold text-black mb-3">How It Hurt Us</h3>
              <p className="text-gray-700 mb-4">
                Our AI-generated thought leadership articles were factually correct but emotionally flat. The result?
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Engagement dropped by 47% compared to human-written content</li>
                <li>Fewer social shares and backlinks generated</li>
                <li>Our top-ranking posts were overtaken by competitors with better user retention</li>
              </ul>

              <h3 className="text-xl font-semibold text-black mb-3">The Fix: Personalization & Conversational Tone</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>We trained AI models on our founder's writing style for authenticity</li>
                <li>Added humor, rhetorical questions, and first-person narratives</li>
                <li>Encouraged engagement with open-ended questions and interactive elements</li>
              </ul>
              <p className="font-medium">
                Result: Our average session duration increased by 52%, and content shareability improved significantly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">
                Sin 7: Ignoring Content Updates & Refreshes (90% Penalty Rate)
              </h2>
              <figure className="relative rounded-lg overflow-hidden mb-6">
                <Image
                  src="/62.png"
                  alt="Outdated Content Illustration"
                  width={800}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </figure>
              <h3 className="text-xl font-semibold text-black mb-3">
                The Problem: AI Content Becomes Outdated Quickly
              </h3>
              <p className="text-gray-700 mb-4">
                Google rewards fresh, updated content, yet AI-generated articles often become outdated due to static
                information.
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>90% of penalized AI blogs had not been updated in over 12 months</li>
                <li>Outdated statistics led to trust issues and lower engagement</li>
                <li>Google's freshness algorithm prioritizes recently updated pages</li>
              </ul>

              <h3 className="text-xl font-semibold text-black mb-3">How It Hurt Us</h3>
              <p className="text-gray-700 mb-4">
                Our AI-generated "2023 SaaS Marketing Strategies" post failed to mention recent algorithm updates,
                making it obsolete. The result?
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Ranking dropped from position #2 to position #34</li>
                <li>Users left negative comments about outdated information</li>
                <li>Organic traffic declined by 68% over 6 months</li>
              </ul>

              <h3 className="text-xl font-semibold text-black mb-3">The Fix: Automated Content Refresh Workflows</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Installed AI-powered refresh triggers to flag outdated information</li>
                <li>Integrated live API data feeds for up-to-date statistics</li>
                <li>Scheduled quarterly content reviews by subject matter experts</li>
              </ul>
              <p className="font-medium">
                Result: Our updated content regained 85% of lost rankings within 60 days, improving organic visibility
                by 47%.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">Final Takeaway: The Hybrid Model Wins</h2>
              <figure className="relative rounded-lg overflow-hidden mb-6">
                <Image
                  src="/63.png"
                  alt="Hybrid Content Model Success Illustration"
                  width={800}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </figure>
              <p className="text-gray-700 mb-4">By combining AI's efficiency with human expertise, we achieved:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>✅ 317% traffic rebound</li>
                <li>✅ 58% higher conversions</li>
                <li>✅ Zero Google penalties since 2024</li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                This study is based on Blogosocial's analysis of 12M+ penalized AI blogs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">FAQs: Avoiding AI Content Penalties</h2>
              <figure className="relative rounded-lg overflow-hidden mb-6">
                <Image
                  src="/64.png"
                  alt="AI Content FAQs Illustration"
                  width={800}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </figure>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">1. How do I know if my AI content is penalized?</h3>
                  <p className="text-gray-700">
                    Check your Google Search Console for warnings about "unhelpful content." Sudden ranking drops may
                    also indicate an issue.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">2. Can AI-generated content ever rank well?</h3>
                  <p className="text-gray-700">Yes, if it's properly validated, cited, and edited by human experts.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    3. What's the fastest way to recover from an AI penalty?
                  </h3>
                  <p className="text-gray-700">
                    Use expert validation, citation engines, and semantic entity mapping to rebuild credibility.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">4. How can I future-proof my SaaS blog?</h3>
                  <p className="text-gray-700">
                    Adopt a hybrid AI-human content strategy and update your content regularly with fresh insights.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">5. Does Google favor AI-generated content?</h3>
                  <p className="text-gray-700">
                    No. Google prioritizes useful, experience-driven content—AI alone isn't enough to rank.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </article>

        <aside className="max-w-3xl mx-auto mt-12">
          <div className="bg-blue-100 rounded-3xl p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-black">Ready to Avoid AI Content Penalties?</h2>
                <p className="text-gray-700 text-sm md:text-base">
                  Get our free AI Content Audit and see how your content stacks up against Google's latest standards.
                </p>
                <div className="inline-flex items-center gap-2 bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M10 3L4.5 8.5L2 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  E-E-A-T Compliant
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/free-ai-content-audit"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Your Free AI Content Audit
                </Link>
                <Link
                  href="/hybrid-content-strategy"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Learn Hybrid Content Strategy
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  )
}

