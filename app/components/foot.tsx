import Image from "next/image"
import Link from "next/link"
import { Linkedin, Twitter, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Logo and Contact */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Blogosocial" width={150} height={40} className="h-10 w-auto" />
            </Link>
            <div className="mt-4 flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <a href="mailto:info@blogosocial.com" className="text-sm hover:text-orange-500 transition-colors">
                info@blogosocial.com
              </a>
            </div>
          </div>

          {/* Policies */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-3 font-medium text-gray-900">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="mb-3 font-medium text-gray-900">Connect With Us</h3>
            <div className="flex items-center gap-4">
              <Link
                href="https://x.com/Blogosocial_com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-black p-2 text-white transition-colors hover:bg-gray-800"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/blogosocial/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-black p-2 text-white transition-colors hover:bg-gray-800"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-sm text-gray-600">
          COPYRIGHT BY MARKUPX BRANDS TECHNOLOGIES PRIVATE LIMITED · ALL RIGHTS RESERVED 2025
        </div>
      </div>
    </footer>
  )
}

