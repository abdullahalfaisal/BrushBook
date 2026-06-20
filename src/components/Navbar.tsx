"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Paintbrush, Phone } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#portfolio", label: "Portfolio" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#why-us", label: "Why Us" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="accent-stripe absolute bottom-0 left-0 right-0" />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-brand-dark">
          <Paintbrush className="h-5 w-5 text-brass" />
          <span>PaintBooking</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-stone-600 sm:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-brand-dark">
              {link.label}
            </Link>
          ))}
          <a
            href="tel:+15551234567"
            className="flex items-center gap-1.5 text-xs text-stone-400 transition hover:text-brand-dark"
          >
            <Phone className="h-3 w-3" />
            (555) 123-4567
          </a>
          <Link
            href="/#services"
            className="rounded-full bg-brass px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-600 hover:shadow-md"
          >
            Book Now
          </Link>
        </nav>
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-stone-200/60 bg-white/95 px-4 pb-4 pt-2 sm:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium text-stone-600">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <a
              href="tel:+15551234567"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 text-xs text-stone-400"
            >
              <Phone className="h-3 w-3" />
              (555) 123-4567
            </a>
            <Link
              href="/#services"
              onClick={() => setOpen(false)}
              className="rounded-full bg-brass px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Book Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
