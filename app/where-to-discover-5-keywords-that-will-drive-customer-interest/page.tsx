"use client"

import { useState } from "react"
import Image from "next/image"
import Head from "next/head"
import { Header } from "../components/header"
import Footer from "../components/footer"

export default function BlogPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const faqs = [
    {
      question: "What is ReplyGuy and how does it work?",
      answer:
        "ReplyGuy is an automation tool designed to boost customer engagement across social media platforms, especially Reddit and Twitter. By utilizing a set of user-defined keywords tailored to a business's offerings, ReplyGuy keeps tabs on these platforms for relevant conversations. When it identifies mentions or discussions that align with its preset keywords, it automatically crafts personalized replies incorporating the product, facilitating authentic engagement with potential customers.",
    },
    {
      question: "Who is the target audience for ReplyGuy?",
      answer:
        "ReplyGuy primarily caters to small to medium enterprises (SMEs), startups, e-commerce businesses, and marketing professionals. These individuals seek efficient platforms to engage customers without requiring massive marketing teams. The tool is especially useful for companies relying on social media for customer acquisition and brand visibility.",
    },
    {
      question: "What are the main features of ReplyGuy?",
      answer:
        "ReplyGuy boasts several key features, including AI-driven social media monitoring, automated reply generation, lead generation capabilities, and keyword suggestions. The AI monitoring system identifies relevant conversations based on your defined keywords, while the automated reply feature creates personalized responses to engage users organically. Additionally, ReplyGuy assists users in marketing by identifying effective keywords to enhance their outreach efforts.",
    },
    {
      question: "How can businesses benefit from using ReplyGuy?",
      answer:
        "By automating their social media engagement processes with ReplyGuy, businesses save loads of time and resources, boosting brand visibility and lead generation without requiring manual labor. This is especially beneficial for companies with lean marketing teams, allowing them to maintain a consistent online presence while focusing on other crucial areas of their business.",
    },
    {
      question: "Is there a cost associated with using ReplyGuy?",
      answer:
        "As of now, specific pricing details for ReplyGuy aren't available online. Users may need to contact the ReplyGuy support or sales team for inquiries regarding subscription plans or pricing structures. This showcases the importance of reaching out for the most accurate and current pricing information.",
    },
    {
      question: "How can businesses ensure that their automated replies do not seem spammy?",
      answer:
        "To avoid appearing spammy, businesses using ReplyGuy should focus on crafting replies that are personalized and contextually relevant. While the AI technology enhances the creation of authentic responses, users should review and refine automated replies to align with their brand voice. Additionally, engaging thoughtfully in conversations adds immense value and helps maintain authenticity.",
    },
    {
      question: "How does ReplyGuy fit into an overall marketing strategy?",
      answer:
        "Integrating ReplyGuy means utilizing it as a tool to enrich social media engagement while complementing other initiatives. Users can capitalize on its automated responses to promote interaction while also leveraging traditional marketing techniques such as content marketing, email campaigns, and influencer collaborations. It's all about crafting a cohesive strategy that effectively merges both automated and human engagement to reach your targeted audience in a meaningful way.",
    },
  ]

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Header />

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        body {
          font-family: 'Poppins', sans-serif;
          color: #333;
          line-height: 1.7;
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          line-height: 1.3;
          margin-bottom: 1rem;
        }
        p {
          margin-bottom: 1.5rem;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .blog-content {
          max-width: 800px;
          margin: 0 auto;
        }
        .blog-content p {
          font-size: 1.125rem;
          line-height: 1.8;
        }
        .blog-content h2 {
          font-size: 1.875rem;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          color: #294fd6;
        }
        .blog-content ul, .blog-content ol {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }
        .blog-content li {
          margin-bottom: 0.75rem;
        }
        .blog-content a {
          color: #294fd6;
          text-decoration: none;
          border-bottom: 1px solid #294fd6;
          transition: all 0.2s ease;
        }
        .blog-content a:hover {
          color: #3a63e8;
          border-bottom-color: #3a63e8;
        }
        .image-container {
          margin: 2.5rem 0;
        }
        .faq-item {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .faq-item:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .faq-question {
          padding: 1.25rem;
          background-color: #f9fafb;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .faq-answer {
          padding: 1.25rem;
          border-top: 1px solid #e5e7eb;
          background-color: white;
        }
        .nav-link {
          position: relative;
          color: #4b5563;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 0;
          margin: 0 1rem;
          transition: color 0.3s ease;
        }
        .nav-link:hover {
          color: #294fd6;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: #294fd6;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .share-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 9999px;
          background-color: #f3f4f6;
          color: #4b5563;
          transition: all 0.2s ease;
          margin-right: 0.5rem;
        }
        .share-button:hover {
          background-color: #294fd6;
          color: white;
        }
        .table-of-contents {
          position: sticky;
          top: 2rem;
          padding: 1.5rem;
          background-color: #f9fafb;
          border-radius: 0.5rem;
          margin-bottom: 2rem;
        }
        .toc-link {
          display: block;
          color: #4b5563;
          text-decoration: none;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e5e7eb;
          transition: color 0.2s ease;
        }
        .toc-link:hover {
          color: #294fd6;
        }
        .toc-link:last-child {
          border-bottom: none;
        }
        @media (max-width: 768px) {
          .blog-content h2 {
            font-size: 1.5rem;
          }
          .blog-content p {
            font-size: 1rem;
          }
        }
      `}</style>

      <main className="py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar - Table of Contents (Desktop) */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="table-of-contents">
                <h3 className="text-lg font-semibold mb-4">Table of Contents</h3>
                <a href="#social-media" className="toc-link">
                  1. Leverage Social Media Conversations
                </a>
                <a href="#google-trends" className="toc-link">
                  2. Dive Into Google Trends
                </a>
                <a href="#customer-feedback" className="toc-link">
                  3. Explore Customer Feedback
                </a>
                <a href="#seo-tools" className="toc-link">
                  4. Utilize SEO Tools for In-Depth Keyword Research
                </a>
                <a href="#online-communities" className="toc-link">
                  5. Engage with Online Communities and Forums
                </a>
                <a href="#conclusion" className="toc-link">
                  Conclusion
                </a>
                <a href="#faq" className="toc-link">
                  FAQ
                </a>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Share this article</h3>
                <div className="flex">
                  <a href="#" className="share-button" aria-label="Share on Twitter">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a href="#" className="share-button" aria-label="Share on Facebook">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="share-button" aria-label="Share on LinkedIn">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <a href="#" className="share-button" aria-label="Copy link">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Blog Header */}
              <div className="mb-10">
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  Where to Discover 5 Keywords That Drive Customer Interest
                </h1>
                <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6">
                  <span className="flex items-center mr-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    April 24, 2025
                  </span>
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    6 min read
                  </span>
                </div>
              </div>

              {/* Blog Content */}
              <div className="blog-content">
                <p>
                  Alright, let's chat about keywords for a sec—those magical little phrases that can send customer
                  interest soaring. Honestly, sometimes it feels like we're hunting for a four-leaf clover in a
                  sprawling field or, let's be real, like searching for a unicorn wearing roller skates. Everybody and
                  their dog is after that secret sauce, but often we're just fumbling around, not quite knowing where to
                  step next. If you've ever caught yourself staring at your screen, praying for a lightbulb moment on
                  how to better connect with your audience, you're definitely not in this boat alone. We've all been
                  there—mindlessly scrolling through social media, feeling somewhat like a ghost in the digital realm.
                  It can truly feel like you're scaling Mount Everest—exhausting and daunting! But guess what? There are
                  dazzling, undiscovered treasures just waiting for us—it's like a confetti party waiting to happen!
                </p>

                <p>
                  In this post, we're diving headfirst—but not in an awkward way like my cousin did at that family
                  reunion pool party last summer—into exploring five killer keywords that could be pivotal in boosting
                  customer interest. These gems are your ticket to heightened engagement, lead generation, and fingers
                  crossed—those delightful sales figures. So, grab your metaphorical pickaxe, and let's gear up for this
                  exhilarating treasure hunt together!
                </p>

                <div className="relative aspect-video my-8">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XUCO8IbfgFGynYXdfmYJl4n9Q4zccT.png"
                    alt="Futuristic robot with pink-lit glasses analyzing social media data"
                    fill
                    className="object-cover"
                  />
                </div>

                <h2 id="social-media">1. Leverage Social Media Conversations</h2>
                <p>
                  First up, we've got social media. I mean, come on—it's basically a treasure chest just bursting at the
                  seams! This is where your customers are letting loose their thoughts on everything, and I mean
                  <em>everything</em>!
                </p>

                <p>
                  <strong>Join the Dialogue:</strong> Platforms like Twitter and Reddit? Gold mines, I tell ya! Just
                  think back to that Twitter chat I stumbled into about plant-based diets last fall. It was like being a
                  fly on the wall at an unreal dinner party! Keeping an eye on those trending topics—especially the
                  quirky ones—really helps you tune in to your audience's vibes. It's kind of like having a secret
                  decoder ring for what makes them tick—or, you know, what's irking them on any given day. Capturing
                  that feedback can be a real game changer!
                </p>

                <p>
                  <strong>Tools for the Trade:</strong> And let's not sleep on those social media listening tools!
                  Hootsuite and Mention are two of my faves for tracking specific keywords and hashtags in real-time.
                  Honestly, once I started using them, it opened my eyes to what customers were saying about my
                  competitors. It's like having a backstage pass to the biggest concert of the year—who doesn't want to
                  know what the fans are raving about from the front row?!
                </p>

                <p>
                  By stepping into these conversations, you're not just discovering hot topics—you're tailoring your
                  marketing message to genuinely reflect what matters to your audience! Think of it as getting a
                  front-row seat to a live performance where the audience sings along passionately. If you're missing
                  out on this, are you really even in the game?
                </p>

                <h2 id="google-trends">2. Dive Into Google Trends</h2>
                <p>
                  Next, let's set sail toward Google Trends—the place where curiosity meets real-time data. If you're on
                  the hunt for those buzzworthy keywords that are totally relevant (and let's face it, you should be),
                  it's basically your new best friend!
                </p>

                <p>
                  <strong>What's Hot Right Now?:</strong> Google Trends is your VIP ticket to understanding the
                  collective mind of the internet. It reveals how popular certain search terms are over time. I still
                  remember the first time I compared keywords—like "minimalistic home decor" vs. "cluttered homes." The
                  insights were mind-boggling! If "sustainable kitchen products" is soaring high while "cheap
                  plasticware" drops, <em>bingo</em>! You've just located your content focus!
                </p>

                <p>
                  <strong>Seasonality Insights:</strong> Let's be smarter, not harder, right? You can also snag some
                  juicy info about seasonal trends. Take it from someone who's worked in e-commerce: understanding when
                  certain keywords rise or fall is golden! For instance, those cooking-related keywords tend to
                  skyrocket during the festive season. I mean, who doesn't love whipping up holiday feasts? Meanwhile,
                  fitness terms soar in January when everyone is hopping on the resolution train. It's like wearing an
                  invisibility cloak, and suddenly…wham! You see everything!
                </p>

                <p>
                  With Google Trends in your toolkit, you'll position yourself miles ahead, adjusting your content
                  strategy like you're casting spells in a wizarding world—seriously, the data-driven magic is real!
                </p>

                <h2 id="customer-feedback">3. Explore Customer Feedback</h2>
                <div className="relative aspect-video my-8">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nMUFn6cMbcccqv9w1lk0XNXpkZ1ENP.png"
                    alt="Person using smartphone with social media icons floating around it"
                    fill
                    className="object-cover"
                  />
                </div>

                <p>
                  Okay, let's be honest—your customers hold a treasure trove of insights! Seriously, you'd be amazed at
                  what you'll discover by just tuning in.
                </p>

                <p>
                  <strong>Surveys and Polls:</strong> I undertook this little experiment last spring and sent out a
                  survey asking my email subscribers about their biggest challenges. The responses? Mind-blowing! It was
                  like opening Pandora's box of feedback. I was left going, "Wow, I can't believe how much they shared!"
                  People love to be heard, and by simply asking, you unlock a world of knowledge.
                </p>

                <p>
                  <strong>Reviews and Testimonials:</strong> Don't overlook the power of reviews! What wording do
                  customers use when raving about your wonders? Those phrases are often pure gold for identifying
                  keywords that spotlight your strengths and resonate with the right crowd. Honestly, it's like finding
                  an unexpectedly delightful note in your pocket—so valuable!
                </p>

                <p>
                  Feedback from customers is basically a direct connection to their mindset. Don't miss out on that
                  opportunity!
                </p>

                <p>
                  For even deeper insights into keyword discovery and social media strategies, check out ReplyGuy:
                  AI-Powered Social Media Marketing Tool | Creati.ai. It's practically a treasure map of industry
                  insights! And don't forget about our very own About Us, which is eager to help you weave those
                  strategies into a cohesive plan.
                </p>

                <p>
                  Armed with these strategies, you're fully equipped to uncover those sought-after keywords that spark
                  genuine interest and engagement! And, hold onto your hats, because we're just warming up here! More
                  treasure troves of keyword discovery and tips for weaving these insights into your marketing
                  strategies are just around the corner in the second half of this post. Spoiler alert: it's going to be
                  EPIC!
                </p>

                <p>
                  In the meantime, reflect on how all this excitement can shake up your current practices. Let's keep
                  plunging into this captivating realm of keywords together! And remember, seeking keywords doesn't have
                  to feel like a chore—it can genuinely be an exciting treasure hunt!
                </p>

                <h2 id="seo-tools">4. Utilize SEO Tools for In-Depth Keyword Research</h2>
                <p>
                  Now, here's where my perspective has shifted over the years: while organic methods are unbelievably
                  crucial for tapping into your audience's needs, diving into SEO tools can boost your keyword discovery
                  sky-high. Seriously, the insights you can unlock are astonishing!
                </p>

                <p>
                  <strong>Keyword Research Platforms:</strong> Tools like SEMrush, Ahrefs, and Moz have become my
                  trusted sidekicks for analyzing keyword performance. I can't emphasize this enough—these tools offer
                  an avalanche of data on search volume, keyword competition, and related suggestions. I still fondly
                  recall the first time I used SEMrush; it totally shifted how I approached finding keywords!
                </p>

                <p>
                  <strong>Competitor Analysis:</strong> Ever peeked at your competitors' keywords? It's fascinating! I
                  can't even count the number of golden opportunities I've stumbled upon. Like, the time I was looking
                  into a competitor that was generating buzz around "eco-friendly subscription boxes"—that lightbulb
                  moment! Talk about a direction begging for exploration!
                </p>

                <p>
                  Oh, and there's this one time last summer when I was consulting for this cool startup (let's call them
                  EcoChic). By using SEMrush to unearth long-tail keywords I'd never considered—like "plant-based
                  compostable plates"—we drew in a niche audience, leading to a staggering 30% rise in organic traffic
                  within just a few months! The real magic? Data-driven keyword research works wonders!
                </p>

                <h2 id="online-communities">5. Engage with Online Communities and Forums</h2>
                <p>
                  You know those moments when you find a forum and think, "Wow, I could dive down this rabbit hole for
                  hours?" Online communities and forums are truly gold mines! Delving into these platforms offers you
                  raw, unfiltered insights into your audience's thoughts.
                </p>

                <div className="relative aspect-video my-8">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nziBy6DU3MUK33BaQIdNWjD983LOYJ.png"
                    alt="Person holding device with social media icons displayed in a circular interface"
                    fill
                    className="object-cover"
                  />
                </div>

                <p>
                  <strong>Participate in Forums:</strong> Websites like Quora or specific niche forums? Total treasure
                  chest territory! Folks continually share inquiries and experiences related to your industry. I love
                  peeking into Quora discussions! By immersing myself in these conversations, I've pinpointed threads
                  full of keywords and phrases that my audience uses—especially when they let off steam.
                </p>

                <p>
                  <strong>Answer Questions:</strong> Engage in these communities by answering questions—not only does it
                  build your authority, but you also discover keywords aligned with real curiosity. I've found that
                  weaving these phrases into my content makes it immeasurably more appealing!
                </p>

                <p>
                  Just a couple of months back, I scrolled through Reddit, looking for trends around eco-friendly
                  products. (I know, <em>so typical</em>, right?) But I got swept up in heaps of conversations about
                  finding sustainable goods—by tuning into their phrasing, I crafted content that resonated,
                  and—BOOM!—my engagement rates skyrocketed!
                </p>

                <h2 id="conclusion">Conclusion</h2>
                <p>
                  So, as we wrap up this exploration, it's quite clear that discovering the right keywords feels like a
                  multifaceted quest. It's all about blending strategic insights with heart-driven engagement.
                  Seriously, from social media discussions and Google Trends to digging into feedback and utilizing
                  handy SEO tools, there's a multitude of ways to unearth those shining keywords that ignite interest.
                </p>

                <p>
                  But here's the kicker—<em>stay proactive</em> and <em>remain curious</em>! The digital landscape is
                  like quicksand; it shifts all the time, just like whims and fancies of your audience! Now that you
                  have these insights, it's time to spring into action!
                </p>

                <p>
                  For more incredible tools and resources that'll supercharge your keyword discovery process, check out
                  ReplyGuy Product Information and Latest Updates (2025) | Product Hunt. It's packed with next-level
                  strategies that'll elevate your marketing game. And do swing by Contact Support for some nifty tips on
                  automating your social media game with ReplyGuy.
                </p>

                <p>
                  So, what's stopping you? <em>Kick off your keyword quest today!</em> The right keywords could be that
                  secret ingredient for your business growth—a pathway to better engagement, greater visibility, and
                  most importantly, increased sales. Happy treasure hunting!
                </p>

                {/* FAQ Section */}
                <section id="faq" className="mt-16 mb-8">
                  <h2 className="text-2xl font-bold mb-8">FAQ Section</h2>

                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="faq-item">
                        <button className="faq-question w-full text-left" onClick={() => toggleFAQ(index)}>
                          <span>{faq.question}</span>
                          <svg
                            className={`w-5 h-5 text-gray-500 transform transition-transform ${openFaqIndex === index ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {openFaqIndex === index && (
                          <div className="faq-answer">
                            <p>{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Share buttons - Mobile */}
                <div className="mt-12 mb-8 md:hidden">
                  <h3 className="text-lg font-semibold mb-4">Share this article</h3>
                  <div className="flex">
                    <a href="#" className="share-button" aria-label="Share on Twitter">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </a>
                    <a href="#" className="share-button" aria-label="Share on Facebook">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    <a href="#" className="share-button" aria-label="Share on LinkedIn">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                    <a href="#" className="share-button" aria-label="Copy link">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
