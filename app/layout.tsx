import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Blogosocial - Strategic Blogging Loved by Readers, Ranked by Google",
    template: "%s | Blogosocial",
  },
  description:
    "Expert blogs powered by AI & ICP strategies. Create content that ranks fast in Google and engages your audience with our AI-powered blogging platform.",
  keywords: ["blogging platform", "AI content creation", "SEO blogging", "content marketing", "Google rankings"],
  authors: [{ name: "Blogosocial Team" }],
  creator: "Blogosocial",
  publisher: "Blogosocial",
  metadataBase: new URL("https://blogosocial.com"),
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blogosocial.com",
    title: "Blogosocial - Strategic Blogging Loved by Readers, Ranked by Google",
    description:
      "Expert blogs powered by AI & ICP strategies. Create content that ranks fast in Google and engages your audience with our AI-powered blogging platform.",
    siteName: "Blogosocial",
    images: [
      {
        url: "https://blogosocial.com/og.jepg", // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: "Blogosocial - AI-Powered Blogging Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogosocial - Strategic Blogging Loved by Readers, Ranked by Google",
    description:
      "Expert blogs powered by AI & ICP strategies. Create content that ranks fast in Google and engages your audience with our AI-powered blogging platform.",
    images: ["https://blogosocial.com/og.jpeg"], // Replace with your actual Twitter image
    creator: "@blogosocial", // Replace with your actual Twitter handle
    site: "@blogosocial", // Replace with your actual Twitter handle
  },
  category: "Technology",
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

