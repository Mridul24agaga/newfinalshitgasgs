"use client"

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/app/components/ui/resizable-navbar"
import { useState } from "react"

export function Header() {
  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Examples",
      link: "/#examples",
    },
    {
      name: "How It Works",
      link: "/#howitworks",
    },
    {
      name: "Blogs",
      link: "/blogs",
    },
    {
      name: "Login",
      link: "/login",
    },
  ]

  const navbarStyles = {
    backgroundColor: "white",
    borderBottom: "1px solid #f0f0f0",
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="relative w-full">
      <Navbar className="bg-white" style={navbarStyles}>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <NavbarButton variant="blue" href="/signup">
            Get one Article for Free
          </NavbarButton>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} className="bg-white">
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4 mt-4">
              <NavbarButton href="/signup" onClick={() => setIsMobileMenuOpen(false)} variant="blue" className="w-full">
                Get one Article For free
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      {/* Add padding to account for fixed navbar */}
      <div className="h-16"></div>
    </div>
  )
}
