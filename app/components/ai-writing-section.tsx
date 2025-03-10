import Image from "next/image"
import { Saira } from "next/font/google"

// Initialize the Saira font with the weights we need
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export default function AIWritingSection() {
  return (
    <section className={`${saira.className} w-full max-w-[1400px] mx-auto py-12 md:py-20 px-4 md:px-6`}>
      <div className="flex flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center rounded-full border-2 border-amber-500 px-5 py-2 text-base font-medium text-amber-500">
            <span className="mr-1">🔥</span> AI SUCKS
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
          AI Writing: Fast, But Frustrating!
        </h2>

        {/* Subtext */}
        <p className="text-base md:text-lg text-gray-600 max-w-3xl mb-12 md:mb-16 text-center">
          It can kill SEO, Reduce Google rankings, and Lack the human touch.
          <br className="hidden md:block" />
          Making content creation time-consuming and risky. Do you really need that extra burden?
        </p>

        {/* Feature boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full">
          <FeatureBox
            iconUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Low%20SEO%20Performance-mpt6u41ekSrZQZQXdU0IoBE8W1Avdv.png"
            title="Low SEO Performance"
          />
          <FeatureBox
            iconUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lacks%20Human%20Touch-UVSYNenyz7Jg4RjT7tO6xywd4KbCKI.png"
            title="Lacks Human Touch"
          />
          <FeatureBox
            iconUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Generic%20%26%20Repetitive-sj8IISjMOV8pW6dIWkz7gQwMxXBkEI.png"
            title="Generic & Repetitive"
          />
        </div>
      </div>
    </section>
  )
}

interface FeatureBoxProps {
  iconUrl: string
  title: string
}

function FeatureBox({ iconUrl, title }: FeatureBoxProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Large card with icon */}
      <div className="bg-gray-800 p-6 md:p-10 rounded-xl mb-4 w-full aspect-square max-w-[170px] md:max-w-[250px] flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={iconUrl || "/placeholder.svg"}
            alt={title}
            fill
            sizes="(max-width: 768px) 150px, 220px"
            className="object-contain p-2"
          />
        </div>
      </div>
      {/* Title text - kept at a reasonable size */}
      <h3 className="text-base font-medium text-gray-900">{title}</h3>
    </div>
  )
}

