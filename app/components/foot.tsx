import Image from "next/image"
import Link from "next/link"
import { Facebook, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/logo.png" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Blogosocial" width={150} height={40} className="h-10 w-auto" />
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            
            <Link
              href="https://x.com/Blogosocial_com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-black p-2 text-white transition-colors hover:bg-gray-800"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="https://www.linkedin.com/company/blogosocial/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-black p-2 text-white transition-colors hover:bg-gray-800"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-sm text-gray-600">
          COPYRIGHT BY MARKUPX BRANDS TECHNOLOGIES PRIVATE LIMITED · ALL RIGHTS RESERVED 2025
        </div>
      </div>
    </footer>
  )
}

