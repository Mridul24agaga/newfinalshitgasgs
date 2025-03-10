import { Twitter, Linkedin, CheckCircle2 } from "lucide-react"
import { Saira } from "next/font/google"

// Initialize the Saira font with the weights we need
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-saira", // Add variable for CSS custom property
})

interface ProfileCardProps {
  name: string
  title: string
  handle: string
  bio: string
  experiences: string[]
  avatar: string
  avatarBg?: string
  twitterLink?: string
  linkedinLink?: string
}

const ProfileCard = ({
  name,
  title,
  handle,
  bio,
  experiences,
  avatar,
  avatarBg,
  twitterLink,
  linkedinLink,
}: ProfileCardProps) => {
  // Default Twitter link based on handle if custom link not provided
  const defaultTwitterLink = `https://twitter.com/${handle.replace("@", "")}`

  return (
    <div className="rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className={`relative rounded-full ${avatarBg || "bg-gray-100"} p-0.5`}>
            <img
              src={avatar || "/placeholder.svg?height=64&width=64"}
              alt={name}
              className="h-16 w-16 rounded-full object-cover"
            />
            <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400"></span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{title}</p>
            <a href={twitterLink || defaultTwitterLink} className="text-sm font-medium text-[#FF8A3D] hover:underline">
              {handle}
            </a>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href={twitterLink || defaultTwitterLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <Twitter className="h-5 w-5" />
          </a>
          {linkedinLink && (
            <a
              href={linkedinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>

      <p className="mt-4 text-gray-600">{bio}</p>

      <ul className="mt-4 space-y-2">
        {experiences.map((experience, index) => (
          <li key={index} className="flex items-center gap-2 text-gray-600">
            <CheckCircle2 className="h-5 w-5 text-[#FF8A3D]" />
            <span>{experience}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function FoundersAndProfiles() {
  const profiles = [
    {
      name: "Krissmann Gupta",
      title: "Founder | Growth Expert",
      handle: "@KrissmannGupta",
      bio: "Building SaaS products for startups. Expert in growth hacking and Marketing.",
      experiences: [
        "Indie Hacker and Marketer",
        "Ex-Growth Hacker at Kraya",
        "Ex-Product Manager at CattleGuru",
        "Founder MarkupX | Streamers",
        "Multiple startup exits",
      ],
      avatar: "/krissmann.jpg",
      twitterLink: "https://twitter.com/KrissmannGupta",
      linkedinLink: "https://linkedin.com/in/krissmann-gupta",
    },
    {
      name: "Mridul",
      title: "Web Developer | AI Expert",
      handle: "@Innvisionagency",
      bio: "Technology & automation expert with deep expertise in AI.",
      experiences: [
        "Freelancer at innvision agency",
        "Web developer at multiple startups",
        "AI/ML Expert",
        "Indie Hacker",
      ],
      avatar: "/mridul.jpg",
      avatarBg: "bg-[#FFD7BA]",
      twitterLink: "https://twitter.com/Innvisionagency",
      linkedinLink: "https://linkedin.com/in/mridulthareja",
    },
  ]

  return (
    <div className={saira.className}>
      {/* Founders Section */}
      <div className="bg-[#fff] py-16 text-center">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
            <span className="text-[#FF8A3D]">By</span> <span className="text-black">Founders</span>{" "}
            <span className="text-[#FF8A3D]">For</span> <span className="text-black">Founders</span>
          </h1>

          <p className="mx-auto mb-16 max-w-2xl text-lg text-gray-700">
            We've been in your shoes. We understand the challenges of scaling startups and the critical role of organic
            growth.
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold md:text-5xl">10+</div>
              <div className="text-sm font-medium uppercase tracking-wider text-gray-600">
                Years Combined Experience
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold md:text-5xl">15+</div>
              <div className="text-sm font-medium uppercase tracking-wider text-gray-600">Startups Scaled</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold md:text-5xl">$10M+</div>
              <div className="text-sm font-medium uppercase tracking-wider text-gray-600">
                Revenue Generated for Clients
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Cards Section */}
      <div className="container mx-auto max-w-6xl px-4 py-8 bg-white">
        <div className="grid gap-6 md:grid-cols-2">
          {profiles.map((profile, index) => (
            <ProfileCard key={index} {...profile} />
          ))}
        </div>
      </div>
    </div>
  )
}

