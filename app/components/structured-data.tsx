import Script from "next/script"

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Blogosocial",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "1.50",
      priceCurrency: "USD",
      description: "FULL YEAR BLOGGING AT $1.5/BLOG",
    },
    description:
      "Expert blogs powered by AI & ICP strategies. Create content that ranks fast in Google and engages your audience.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "256",
    },
  }

  return (
    <Script id="structured-data" type="application/ld+json">
      {JSON.stringify(structuredData)}
    </Script>
  )
}

