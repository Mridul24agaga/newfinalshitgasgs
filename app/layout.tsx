import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "GetMoreSeo - Professional SEO Services to Boost Your Rankings",
    template: "%s | GetMoreSeo",
  },
  description:
    "Expert SEO services to improve your website's visibility and rankings. Get more traffic, leads, and sales with our proven SEO strategies and techniques.",
  keywords: ["SEO services", "search engine optimization", "website rankings", "SEO strategy", "digital marketing"],
  authors: [{ name: "GetMoreSeo Team" }],
  creator: "GetMoreSeo",
  publisher: "GetMoreSeo",
  metadataBase: new URL("https://getmoreseo.org"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  verification: {
    google: "lqhr_Zb6dMDrPQisBXc1rN03NuYc_v0_oqlc_1MEBaw",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://getmoreseo.org",
    title: "GetMoreSeo - Professional SEO Services to Boost Your Rankings",
    description:
      "Expert SEO services to improve your website's visibility and rankings. Get more traffic, leads, and sales with our proven SEO strategies and techniques.",
    siteName: "GetMoreSeo",
    images: [
      {
        url: "https://getmoreseo.org/og.jpeg", 
        width: 1200,
        height: 630,
        alt: "GetMoreSeo - Professional SEO Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GetMoreSeo - Professional SEO Services to Boost Your Rankings",
    description:
      "Expert SEO services to improve your website's visibility and rankings. Get more traffic, leads, and sales with our proven SEO strategies and techniques.",
    images: ["https://getmoreseo.org/og.jpeg"],
    creator: "@getmoreseo", 
    site: "@getmoreseo", 
  },
  category: "Business",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}