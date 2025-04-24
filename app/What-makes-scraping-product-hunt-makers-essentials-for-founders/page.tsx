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
      question: "What is Founder Scraper and how does it work?",
      answer:
        "Founder Scraper is a web-based tool designed to scrape contact information—especially email addresses—from Product Hunt makers. Users can input specific parameters and access a database of makers who've just launched products on the platform. It automates the otherwise mind-numbing work, saving you tons of time compared to the good old hunt for those contact details.",
    },
    {
      question: "Who can benefit from using Founder Scraper?",
      answer:
        "Founder Scraper is a game-changer for startup founders, entrepreneurs, marketers, business development specialists, and investors. These folks are usually eager for ways to broaden their networks, gather insights about product launches, and directly connect with the creative minds shaking up the startup scene. By using the email addresses collected, they can ignite meaningful conversations and potential collaborations.",
    },
    {
      question: "How do I get started with using Founder Scraper?",
      answer:
        "Getting started is super straightforward! Pop over to the website, and you'll find a user-friendly interface for setting up your scraping criteria. After selecting the date or category of products you're interested in, the tool generates a list of makers along with their contact info. Specific instructions might vary, but generally, it's just about applying your filters and exporting those golden results!",
    },
    {
      question: "Is there any cost associated with using Founder Scraper?",
      answer:
        "You won't find specific pricing details listed. For info on potential costs, subscription models, or trial options, it's best to check the site directly or hit up customer service. Transparency about pricing? That's key for weighing the tool's value against your needs!",
    },
    {
      question: "What are the privacy and ethical considerations when using Founder Scraper?",
      answer:
        "When using Founder Scraper, it's essential to stick to legal and ethical guidelines concerning data use. Always comply with Product Hunt's terms of service and respect the privacy of the individuals whose data you're scraping. Ethical scraping not only helps you steer clear of legal trouble but also fosters a healthy community among entrepreneurs.",
    },
    {
      question: "Can I integrate Founder Scraper with other tools I use?",
      answer:
        "The website doesn't detail specific integrations, but many users typically look for ways to connect data scraping tools with their email marketing platforms, CRM systems, or project management software. For detailed integration capabilities, it might be best to shoot some questions over to the Founder Scraper support team or glance through their documentation.",
    },
    {
      question: "What kind of support does Founder Scraper offer if I encounter issues?",
      answer:
        "While specific support channels aren't mentioned, most folks can expect typical customer support options like email help or an FAQ section. For immediate assistance with tech hiccups, it's best to visit the website for contact details or to explore available user forums. Often, community feedback can boost support responsiveness too.",
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
                <a href="#networking" className="toc-link">
                  1. The Importance of Networking in the Startup Ecosystem
                </a>
                <a href="#efficient-networking" className="toc-link">
                  2. How Founder Scraper Makes Networking Efficient
                </a>
                <a href="#data-insights" className="toc-link">
                  3. The Power of Data-Driven Insights
                </a>
                <a href="#success-stories" className="toc-link">
                  4. Success Stories: Founders Who've Turned Scraping into Growth
                </a>
                <a href="#legal-ethical" className="toc-link">
                  5. Legal and Ethical Considerations in Scraping
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
                  What Makes Scraping Product Hunt Makers Essential for Founders?
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
                    April 18, 2023
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
                    12 min read
                  </span>
                </div>
              </div>

              {/* Blog Content */}
              <div className="blog-content">
                <p>
                  Alright, friends, let's paint a picture here, shall we? Imagine you're in a city marathon—because who
                  doesn't love a bit of self-inflicted cardio? You signed up for all the wrong reasons, like thinking
                  you could use that free t-shirt as a nightgown. There you are, weaving through sweaty runners, giving
                  out high-fives like you're the ultimate cheerleader, shouting encouragement like you've just downed
                  three energy drinks! But let's be real: inside, you're kind of feeling like that one kid in school who
                  desperately wants to be invited to the cool kids' table. You know the vibe, right? That's pretty much
                  how I feel when I'm surfing the vibrant chaos that is Product Hunt. New products pop up alongside
                  fresh ideas like popcorn at a movie, but navigating that scene? It's like trying to walk while
                  balancing a dozen lattes! This is where scraping becomes your trusty sidekick in this wild race we
                  call entrepreneurship!
                </p>

                <p>
                  So, grab whatever drink will help you power through the day—I'm personally vibing with a triple-shot
                  Americano because, let's face it, adulting is *not* for the faint of heart. Let's explore why scraping
                  Product Hunt makers isn't just some trivial side project—it's basically your proverbial life preserver
                  in the turbulent waters of the startup universe!
                </p>

                <div className="relative aspect-video my-8">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-wFiYt2uWlmRxhbV49WCOuix1cPWuWT.png"
                    alt="Founders networking and discussing ideas at a meeting table"
                    fill
                    className="object-cover"
                  />
                </div>

                <h2 id="networking">1. The Importance of Networking in the Startup Ecosystem</h2>
                <p>
                  Ah, networking. That delightful buzzword we toss around like confetti. We love to poke fun at it, roll
                  our eyes while secretly clutching our business cards, because let's admit it, we know it's the
                  lifeblood of every blooming startup. Let me lay out a few reasons why it's crucial for us, the
                  fearless founders:
                </p>

                <p>
                  <strong>Expanding Horizons:</strong> Here's a fun story! Picture me on one of those gloom-filled
                  Seattle afternoons (let's be honest, when isn't it gloomy here?), wandering into a coffee shop that's
                  more crowded than a can of sardines. I spark up a convo with a fellow creative, and before I know it,
                  we're throwing ideas around for a project that felt like it was supposed to exist from the beginning!
                  You really never know—suddenly your casual chat could lead to a dream collaboration! Maybe you conjure
                  up a partner who can transform your product into something spectacular, or a mentor who shares that
                  one golden nugget that shifts your entire perspective. No pressure!
                </p>

                <p>
                  <strong>Building Credibility:</strong> Each connection? It's like earning a badge of honor in the
                  grand game of networking. You start hanging with other makers, and before you know it, you're suddenly
                  in this *secret society* of developers and entrepreneurs—it's like the coolest club on the block,
                  minus the initiation rituals!
                </p>

                <p>
                  <strong>Sharing Resources:</strong> Let me tell you—being a startup founder sometimes feels like
                  you're trying to scale Everest while wearing slip-on sandals. But with connections, you create a squad
                  to share stories, tools, and fruitful strategies. I mean, it's nothing short of revolutionary! It's
                  like finding that secret menu at your favorite fast-food spot—life-changing, truly!
                </p>

                <p>
                  Now, I can hear you thinking, "Sounds great, but how do I meet these extraordinary humans?" That, my
                  friend, is where scraping swoops in like a superhero out of a cheesy comic book! You get what I'm
                  sayin', right?
                </p>

                <h2 id="efficient-networking">2. How Founder Scraper Makes Networking Efficient</h2>
                <p>
                  Okay, let's cut to the chase. Time is gold when you're trying to juggle a startup—trust me, I'm
                  speaking from experience here. The thought of mindlessly scrolling through user profiles on Product
                  Hunt? Nah, I'd rather be deep in binge-watching "The Office" for the billionth time. But *boom*, enter
                  Founder Scraper:
                </p>

                <p>
                  <strong>Automatic Data Extraction:</strong> Kiss the dreary copy-pasting days goodbye! Founder Scraper
                  easily pulls contact information straight from Product Hunt like it's a walk in the park. You can save
                  your brain power for the actual connecting part, leaving behind the tedious stuff where it belongs—on
                  the trash heap of history!
                </p>

                <p>
                  <strong>Timely Outreach:</strong> Picture this: a treasure trove of makers who just launched their
                  latest and greatest! With a simple click, you can reach out while everyone is floating on their
                  post-launch high—a magic moment when excitement is literally at its peak! Your response rates?
                  Through. The. Roof!
                </p>

                <p>
                  <strong>Focused Targeting:</strong> Scraping gives you this epic ability to spot trends and target the
                  crowd that aligns perfectly with your vision. Instead of casting a wide net in shallow waters, you can
                  dive deep and snag the *real* players. Why aim for the surface when you can go for the treasure chest,
                  right?
                </p>

                <p>
                  Just visualize it: crafting personalized outreach emails to a dozen key makers in less than thirty
                  minutes! I'm getting butterflies just thinking about that level of efficiency!
                </p>

                <p>
                  Curious about how this fantastic tool could up your networking game? You need to check out About Us.
                </p>

                <div className="relative aspect-video my-8">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GxftsZOKKsLSQmd2YQXff9YAvpDQX7.png"
                    alt="Founder working on his laptop with a smartphone in hand"
                    fill
                    className="object-cover"
                  />
                </div>

                <h2 id="data-insights">3. The Power of Data-Driven Insights</h2>
                <p>
                  Alright, let's pivot a bit! While we've examined how scraping electrifies networking, let's not skip
                  over the treasure trove of insights that comes along with it. Data isn't just a collection of dull
                  numbers; it's like the wisdom of the ancients that can steer your next major move:
                </p>

                <p>
                  <strong>Identifying Trends:</strong> You want to stay sharp, right? By analyzing what's trending on
                  Product Hunt, you can refine your startup strategies effortlessly. What's hot? What features are
                  making people swoon? Scraping reveals valuable nuggets that shape everything from your product
                  development to your marketing game—like discovering hidden gems!
                </p>

                <p>
                  <strong>Understanding Your Audience:</strong> Knowing who your audience is, what keeps them awake at
                  night, is *everything*. Scraping shows you profiles of makers, allowing you to tweak your messages
                  until they resonate like your favorite song on the radio. You want to hit that sweet spot, like the
                  perfect batch of cookies—every detail matters!
                </p>

                <p>
                  <strong>Measuring Outreach Success:</strong> Data acts as your personal detective. Who replied
                  positively? Who left you in the cold? (We've all been ghosted, haven't we? Classic move!) This info
                  becomes your treasure map, refining your approach over time.
                </p>

                <p>
                  But hey, don't get too comfy! While scraping is a delightful adventure, it also comes with some
                  grown-up responsibilities. Paying attention to Web scraping Wikipedia and adhering to best practices
                  is paramount—none of us wants to step on any landmines here!
                </p>

                <p>
                  So, hang tight for the second part of this epic journey. We're diving into eye-popping success tales
                  from founders who've wielded Founder Scraper like a pro! Plus, seriously, don't snooze on the legal
                  advice about scraping—it's *that* important!
                </p>

                <p>
                  And voila! Welcome to the first half of our exploration into why scraping Product Hunt makers is
                  non-negotiable for founders. We've peered into the significance of networking, how Founder Scraper
                  streamlines the hustle, and the fantastic realm of data insights.
                </p>

                <h2 id="success-stories">4. Success Stories: Founders Who've Turned Scraping into Growth</h2>
                <p>
                  Let's shift gears and delve into some real-life stories that spotlight how using Founder Scraper can
                  lead to legitimate wins! Meet Sarah—she's this super-charged founder who recently launched a
                  productivity tool on Product Hunt (like, just last Tuesday! Major shoutout to her awesome hustle,
                  right?). Much like many of us, Sarah was riding that euphoric wave of excitement yet feeling the
                  stress of post-launch connections—think of a kid lost in a candy store with options galore!
                </p>

                <p>
                  After her launch, she decided to harness the power of Founder Scraper. And in just a few hours, she
                  built a killer list of over 100 makers who had launched similar products on that same day. Talk about
                  hitting the jackpot!
                </p>

                <p>
                  <strong>Connection:</strong> Sarah reached out to another maker who had just emerged victorious from
                  the daunting fundraising labyrinth (seriously, navigating that feels like "Survivor" but without the
                  tropical beaches and friendship!). They joined forces for a joint webinar showcasing both of their
                  products—how iconic is that?!
                </p>

                <p>
                  <strong>Feedback Loop:</strong> One maker she contacted offered invaluable insights about her tool.
                  Thanks to their input, Sarah polished key features based on actual user experiences. Talk about
                  staying in tune with her audience!
                </p>

                <p>
                  <strong>Investor Leads:</strong> Through these connections, doors swung wide open to potential
                  investors eager to back innovative productivity solutions. Honestly, Sarah might've missed all these
                  golden opportunities without scraping—crazy, right?
                </p>

                <p>
                  Leveraging the magic of scraping allowed Sarah to significantly broaden her network and uncover
                  collaboration chances that might've slipped through the cracks. Her journey serves as a stellar
                  reminder of how founders can turn scraping into genuine relationships that fuel their startup's rocket
                  ship.
                </p>

                <h2 id="legal-ethical">5. Legal and Ethical Considerations in Scraping</h2>
                <p>
                  Alright, let's keep it real for a sec! With all the perks of scraping, it's crucial to remember that
                  *with great power comes great responsibility*—cue the Spider-Man theme! Here's some critical wisdom
                  for you:
                </p>

                <div className="relative aspect-video my-8">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MGi6cduQKcOCycR0c4jsxUwREUnbDK.png"
                    alt="Founders collaborating on a laptop at a tech event"
                    fill
                    className="object-cover"
                  />
                </div>

                <p>
                  <strong>Understand Terms of Service:</strong> Every platform, including Product Hunt, has terms.
                  Ignoring these can pull you into a mess you definitely want to avoid! Seriously, take the time to read
                  it—your future self will throw you a party for being smart!
                </p>

                <p>
                  <strong>Respect Privacy:</strong> Be transparent with makers when you reach out! Prioritize privacy
                  like it's your golden rule—don't go sharing or misusing their data. Personalization is key, but let's
                  not cross any boundaries here—it's basic etiquette!
                </p>

                <p>
                  <strong>Use Data Responsibly:</strong> Make sure your outreach is relevant and respectful. Trust me,
                  falling back on spammy tactics will tank your reputation faster than you can say "unsubscribe," and
                  nobody wants that headache!
                </p>

                <p>
                  Following these ethical practices isn't just about protecting yourself; it's contributing positively
                  to the booming community of startups that we all adore. Total win-win, right?
                </p>

                <h2 id="conclusion">Conclusion</h2>
                <p>
                  In a world where startups are revving up at warp speed, networking isn't just a "nice-to-have"; it's
                  an absolute must! Scraping Product Hunt makers enables founders to connect with the right people at
                  the right times—like hitting a jackpot! We've discussed how tools like Founder Scraper can save you
                  heaps of time while granting you killer insights that can guide your startup's growth.
                </p>

                <p>
                  Are you ready to unlock the potential of networking through scraping? Start your journey by checking
                  out Contact Support to see how Founder Scraper can totally revamp your outreach game.
                </p>

                <p>
                  Remember, the startup landscape is in constant flux. Staying in touch with groundbreaking makers can
                  truly make a massive impact in your entrepreneurial voyage. For further tips on ethical scraping
                  practices and other juicy industry resources, take a look at What is Web Scraping and How to Use It?
                  GeeksforGeeks.
                </p>

                <p>Embrace the connection power today, and watch your startup just soar!</p>

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
