"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  src: string
  alt: string
  className?: string
}

const Logo = ({ src, alt, className }: LogoProps) => (
  <div
    className={cn(
      "flex items-center justify-center p-4 transition-all duration-200 grayscale hover:grayscale-0",
      className,
    )}
  >
    <img src={src || "/placeholder.svg"} alt={alt} className="h-8 md:h-10 object-contain" />
  </div>
)

export default function TrustedBySection() {
  // Combined set of 6 logos
  const logos = [
    { src: "/d2c1.avif", alt: "Company 1" },
    { src: "/d2c2.png", alt: "Company 2" },
    { src: "/saas1.webp", alt: "Company 3" },
    { src: "/skillop-logo.png", alt: "Company 4" },
    { src: "/kraya.png", alt: "Company 5" },
    { src: "/markupx.png", alt: "Company 6" },
  ]

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted By Industry Leaders</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of companies that rely on our platform to scale their business
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* First row with 4 logos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center mb-8">
            {logos.slice(0, 4).map((logo, index) => (
              <Logo key={`logo-row1-${index}`} src={logo.src} alt={logo.alt} />
            ))}
          </div>

          {/* Second row with 2 logos */}
          <div className="grid grid-cols-2 gap-4 items-center max-w-md mx-auto">
            {logos.slice(4, 6).map((logo, index) => (
              <Logo key={`logo-row2-${index}`} src={logo.src} alt={logo.alt} />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            <span className="font-medium">100+</span> companies trust us with their business
          </p>
        </div>
      </div>
    </section>
  )
}

