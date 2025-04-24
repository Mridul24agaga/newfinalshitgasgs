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
      question: "What is Suna, and how does it differ from traditional AI solutions?",
      answer:
        "Suna is an open-source generalist AI agent designed to perform various tasks—like web automation, data extraction, and API integration. Unlike traditional AI solutions that can often feel like they come from a secret lab, Suna allows customizable features that empower developers and businesses to shape the AI to their specific needs. This open-source model also emphasizes transparency and collaboration.",
    },
    {
      question: "Who can benefit from using Suna?",
      answer:
        "Honestly, Suna's got something for everyone! It's designed for a diverse audience, including developers, businesses, researchers, and data scientists. Developers will find Suna's customizable features invaluable, while businesses seeking to automate those persistent repetitive tasks will sing its praises! Not to mention the researchers and data scientists who can dive in, explore these capabilities, and contribute to this ongoing development—you know, to build a solid community-driven effort.",
    },
    {
      question: "What key features does Suna offer?",
      answer:
        "Suna is chock-full of powerful features, including web automation tools for seamless browsing and data extraction, file management capabilities for creating and editing documents, web crawling functions for scouring data from online sources, command-line execution for system tasks, and slick API integration for connecting with various web services. It's all about upping productivity and streamlining workflows—you catch my drift?",
    },
    {
      question: "How can I integrate Suna into my existing workflows?",
      answer:
        "Integrating Suna into your workflows involves leveraging its toolset to automate tasks that are pivotal to your projects. The website holds documentation and resources to assist with setup and customization, but a wee bit of technical expertise in programming or API usage could be beneficial! Exploring the documentation and playing around should help tie Suna seamlessly into your systems.",
    },
    {
      question: "What are the pricing options for using Suna?",
      answer:
        "Suna operates under an open-source framework, so specific pricing details might remain somewhat ambiguous. Generally, you can download and utilize the software for free! However, you might encounter costs for hosting services or certain features that have a price tag attached (ugh!). For businesses toward enterprise solutions or dedicated support, reaching out for a demo or more info on pricing is a solid plan.",
    },
    {
      question: "What security measures are in place for using Suna?",
      answer:
        "Suna emphasizes transparency and community involvement, which enhances security practices due to shared knowledge and collaborative improvements. That being said, users should maintain a level of personal responsibility regarding data handling and storage security. Definitely check out the documentation for any recommended protocols and practices.",
    },
    {
      question: "How can I contribute to the development of Suna?",
      answer:
        "As an open-source project, Suna welcomes community contributions—whether it's through code, documentation, or feedback. If you're intrigued, check out the repository for how-tos on submitting code or participating in discussions. Engaging with the Suna community via forums or social media can reveal insights into ongoing development and collaborative opportunities. It's all about that spirit of cooperation!",
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
                <a href="#customization" className="toc-link">
                  1. Customization Galore
                </a>
                <a href="#cost-effective" className="toc-link">
                  2. Cost-Effective Innovation
                </a>
                <a href="#transparency" className="toc-link">
                  3. Transparency and Trust
                </a>
                <a href="#collaboration" className="toc-link">
                  4. Enhanced Collaboration and Community Support
                </a>
                <a href="#innovation" className="toc-link">
                  5. Staying Ahead of the Curve
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
                  What 85% of Developers Adore About Open-Source AI Tools
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
                    April 10, 2023
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
                    10 min read
                  </span>
                </div>
              </div>

              {/* Blog Content */}
              <div className="blog-content">
                <p>
                  Alright, folks, let's set the scene: Imagine you're knee-deep in code, right? Sleeves rolled up, maybe
                  even an errant crumb or two from last night's pizza on your keyboard (yeah, we've all been there).
                  Deadlines are breathing down your neck, and it feels like you're running a marathon while juggling
                  flaming torches. That's the life of a developer! With tasks like data extraction, API integration, and
                  web automation demanding your attention, you'd think we were training for the Olympics! And it can get
                  downright maddening sometimes—especially when you're bombarded with server errors or your automation
                  script decides to develop a mind of its own. Oh, the struggles! You've probably caught yourself gazing
                  longingly at tools that cost more than your rent, with licenses that read like ancient hieroglyphics,
                  right? And don't even get me started on those learning curves—mountain climbing without a harness!
                </p>

                <p>
                  But here's the kicker: 85% of developers have found a glimmer of hope and a saving grace in
                  open-source AI tools. Yeah, that's right—these are the unsung heroes of the tech realm! So, what's
                  causing all this buzz among developers? It's time to dig deeper and figure out why these tools are
                  taking the coding community by storm!
                </p>

                <div className="relative aspect-video my-8">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CRllVMV7xcmzGW8gWZUUWqEvHP8Lm2.png"
                    alt="Suna's AI Automation Process diagram showing workflow steps"
                    fill
                    className="object-contain"
                  />
                </div>

                <h2 id="customization">1. Customization Galore</h2>
                <p>
                  Let's kick things off with one of my favorite aspects of open-source AI tools—customization. If you're
                  anything like me, you're probably a creative soul who detests cookie-cutter software (I mean, who
                  enjoys being crammed into a box, really?). Take tools like Suna, for instance. It's just like having a
                  Swiss Army knife tucked away for when you need it. Need to adjust an automation script to align with
                  last week's wild idea? You can dive in, fiddle with the code, and make it happen! It's like waving a
                  wand as you shape your project exactly how you envision it.
                </p>

                <p>
                  <strong>Tailored Solutions:</strong> Unlike proprietary tools—those often feel like they're dragged in
                  from a sci-fi movie—open-source platforms are built for flexibility. It's like having a blank canvas
                  to paint your masterpiece on, especially when the pressure of a deadline is lurking around the corner!
                </p>

                <p>
                  <strong>Community Contributions:</strong> The beauty of open source doesn't just lie in flexibility;
                  it's about getting cozy with a community that's all about collaboration. You're not just a user;
                  you're becoming part of a big family! Ever thought of reporting bugs or pitching your bright ideas?
                  That's the spirit! The software evolves as those interactions happen, and trust me, watching that
                  growth can be super invigorating.
                </p>

                <p>
                  For a moment, let's get real—how many times have you wished for that magical feature that seemed
                  completely out of reach? With open-source, you either roll up your sleeves and craft it yourself or
                  gather your coder pals for a quick brainstorming session. It's like being part of a secret coding
                  guild, and honestly, a bit exhilarating!
                </p>

                <h2 id="cost-effective">2. Cost-Effective Innovation</h2>
                <p>
                  Now, let's be frank about something we all know—cost matters. Anyone who has ever laid eyes on a price
                  tag for proprietary software can relate to that gut-wrenching feeling when you realize it might
                  require a second mortgaging of your house—okay, slight exaggeration, but the finance horror stories
                  are real! Especially for startups trying to make every dollar count. Cue the introduction of
                  open-source AI tools: often free or super low-cost! A real game-changer!
                </p>

                <p>
                  <strong>Reduction in Licensing Fees:</strong> I can't tell you how many times I've stared
                  incredulously at those crazy licensing fees—like they have on those software platforms that
                  inexplicably multiply by the year, like rabbits, yet we're still expected to manage it all. With
                  open-source, it's like getting the cream of the crop without having to sell your kidney!
                </p>

                <p>
                  <strong>Lowering Barriers to Entry:</strong> For fledgling developers or small teams, these
                  open-source tools are like a gateway drug to the kingdom of AI tech. You don't need an investor
                  singing your praises or a golden ticket to the factory. It's all about giving everyone a fighting
                  chance to innovate!
                </p>

                <p>
                  To me, the beauty of this cost-effective model resonates most in an industry where being agile can
                  spell the difference between success and failure. With open-source, developers can focus on, you know,
                  creating neat stuff rather than losing sleep over expenses—which, frankly, is what the whole thing
                  should be about!
                </p>

                <h2 id="transparency">3. Transparency and Trust</h2>
                <p>
                  In a world where data breaches often feel like they make the news almost weekly, transparency has
                  become paramount. It's like finding that one cozy cafe where folks aren't just chugging coffee but
                  opening their hearts! Open-source AI tools shine with a level of transparency that proprietary
                  solutions can only daydream about. You get to peer into the source code and check out how things tick,
                  safeguarding your data like a dragon hoarding its precious gold.
                </p>

                <p>
                  <strong>Security Through Community Review:</strong> Trust me when I say the open-source community does
                  not slack off! They actively dive into the code like they're playing a real-life version of "Where's
                  Waldo," identifying vulnerabilities faster than you can say "security audit." The response time can
                  leave proprietary solutions in the dust!
                </p>

                <div className="relative aspect-video my-8">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gJ9AS6lQbR9w7A99nvJCODEsY3TnlG.png"
                    alt="Detailed flowchart of Suna's automation process showing different stages and connections"
                    fill
                    className="object-contain"
                  />
                </div>

                <p>
                  <strong>Trust in Technology:</strong> With open-source, there's no backside sneakiness—you have a
                  clear view of your data's destiny and how it's utilized. This transparency fosters trust, allowing you
                  to feel confident in your tech stack choices.
                </p>

                <p>
                  But let's not sugarcoat it! It's not all rainbows and butterflies. The learning curve can feel like
                  scaling Everest—especially if you're new to the land of code. Finding reliable support can feel like a
                  scavenger hunt where you end up with more questions than answers. But hey, in my experience, the
                  benefits usually make the minor stumbles worth it.
                </p>

                <p>
                  As I reflect on my own coding journey, it's wild to think about how far I've come—and the occasional
                  hiccups along the way have shaped my relationship with these open-source tools. I can still remember
                  wrestling with a tool called Scrapy one summer, and let me tell you, crawling the web with some
                  half-baked knowledge was quite the adventure!
                </p>

                <p>
                  And don't forget, there are countless resources out there to help you tackle these challenges:
                  community forums, tutorials, and thorough documentation are available to lighten the load. Check 'em
                  out at{" "}
                  <a href="https://github.com/kortix-ai/suna" target="_blank" rel="noopener noreferrer">
                    kortix-ai/suna: Suna Open Source Generalist AI Agent - GitHub
                  </a>
                  ,{" "}
                  <a href="https://suna.so" target="_blank" rel="noopener noreferrer">
                    Computer Vision - suna.so
                  </a>
                  .
                </p>

                <p>
                  Stay tuned for the second half of this blog post, where we'll explore even more reasons developers are
                  head over heels for open-source AI tools and how to seamlessly integrate these solutions into your
                  workflow! Plus, I can hardly contain my excitement to share some juicy insights on Suna's
                  capabilities—because who doesn't want to crank up their projects?
                </p>

                <p>
                  But let me ask you this: Are you ready to join the 85% who have taken the plunge? Believe me, the
                  water is just fine!
                </p>

                <h2>What 85% of Developers Adore About Open-Source AI Tools (Continued)</h2>
                <p>
                  Alright, let's dive back into our conversation about why open-source AI tools are charming the socks
                  off developers everywhere! It's genuinely fascinating to investigate. We've peeled back a few layers,
                  but hold onto your hats because there are more treasures to uncover. Let's dive into two additional
                  factors that, ahem, truly set these tools apart from the soulless proprietary options.
                </p>

                <h2 id="collaboration">4. Enhanced Collaboration and Community Support</h2>
                <p>
                  One of the standout perks of open-source AI tools is the vibrant sense of community they foster. For
                  anyone stepping into this realm, it quickly becomes clear that you're not all alone on this journey.
                  It's more of a collective effort! The collaboration inherent in open-source projects leads to a rich
                  fabric of support and shared experiences. Think of it as a rambunctious, slightly messy family
                  reunion—crowded but bursting with warmth!
                </p>

                <p>
                  <strong>Collective Problem Solving:</strong> Platforms like Suna create a buoyant community of coders
                  eager to share knowledge and help troubleshoot sticky problems. Feel like you've hit a wall? Chances
                  are someone has been caught in the same quagmire and can lend a hand!
                </p>

                <p>
                  <strong>Access to a Wealth of Knowledge:</strong> Open-source communities are like treasure troves
                  filled to the brim with resources—forums buzzing with discussions, webinars, and tutorials... it's
                  basically a developer's paradise! The shared wisdom gives everyone the chance to rise up a notch in
                  their skills.
                </p>

                <p>
                  Quick side note: I remember a few years back when I dived headfirst into using Suna for arduous
                  automation tasks (talk about life-changing!). Naturally, I hit a wall with API integration, and the
                  classic me got all "What now?" But instead of panicking, I turned to the Suna community. To my utter
                  delight, there were rapid responses! Seasoned users jumped in, sharing tips and code snippets that
                  transformed my small crisis into a valuable learning lesson. Real community magic, right there!
                </p>

                <h2 id="innovation">5. Staying Ahead of the Curve</h2>
                <p>
                  In our fast-paced tech haven, innovation is the name of the game! The collaborative nature of
                  open-source AI tools means they're often at the forefront of the latest advancements. Imagine having a
                  pulse on the very latest in AI—like being invited to the hottest party and getting the insider scoop!
                </p>

                <p>
                  <strong>Rapid Updates and Features:</strong> The passionate contributors are dedicated to keeping
                  tools fresh and fully equipped with user feedback. You can bet that new features pop up swiftly,
                  ensuring developers can wield the latest capabilities for improved productivity.
                </p>

                <div className="relative aspect-video my-8">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1nYwqsWNnEGqKFjXIFZm3krHFmDxMy.png"
                    alt="Automation Process flowchart showing the steps and connections in the workflow"
                    fill
                    className="object-contain"
                  />
                </div>

                <p>
                  <strong>Experimentation and Exploration:</strong> Open-source fosters a culture that embraces
                  creativity and experimentation. Want to try something new? Go ahead! No licensing snafus or hefty
                  financial concerns standing in your way. This atmosphere nurtures a thriving realm where innovation
                  can truly bloom!
                </p>

                <p>
                  Take the example of Suna introducing its shiny new web-crawling feature. That wasn't just an arbitrary
                  release—it was a direct response to user feedback requesting enhanced data-gathering abilities.
                  Developers actively contributed insights, resulting in a tool that not only addressed user needs but
                  also improved workflows. It's like experiencing innovation firsthand!
                </p>

                <h2 id="conclusion">Conclusion</h2>
                <p>
                  As we reach the end of this exploration into what makes open-source AI tools so cherished by
                  developers, it's abundantly clear that the benefits just keep piling up. With customization,
                  cost-effectiveness, and community support, these tools create a fertile ground for both innovation and
                  collaboration.
                </p>

                <p>
                  So, if you're certainly part of that 85% of developers ready to take the leap into the captivating
                  world of open-source AI tools, what's holding you back? Honestly, it's time to jump in with both feet!
                  Suna boasts a powerful arsenal of features designed to elevate your projects—be it automating tasks,
                  extracting data, or dabbling in API integrations.
                </p>

                <p>
                  Ready to supercharge your development game? Check out our resources and embark on your journey with
                  Suna today! Visit Contact Support to explore how our offerings can completely revolutionize your
                  workflows.
                </p>

                <p>
                  And if you're hungry for more insights on open-source AI tools and their impact on the industry, you
                  won't want to miss SUPA About.
                </p>

                <p>
                  Join the growing tribe of developers reshaping the tech landscape with open-source solutions.
                  Remember, the future of innovation is collaborative! With open-source AI tools, you're not merely a
                  user; you're a contributor poised to make your mark!
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
