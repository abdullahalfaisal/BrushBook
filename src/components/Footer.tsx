import Link from "next/link"
import { Paintbrush, Lock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative bg-brand-dark text-white">
      <div className="accent-stripe absolute top-0 left-0 right-0" />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-bold">
              <Paintbrush className="h-5 w-5 text-brass" />
              <span>BrushBook</span>
            </Link>
            <p className="mt-2 max-w-sm text-sm text-stone-400">
              Professional interior and exterior painting. Premium materials, meticulous prep, and a 2-year workmanship guarantee.
            </p>
            <p className="mt-3 text-xs text-stone-600">ABN: 00 000 000 000 · Licensed Painter</p>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-500">Quick Links</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link href="/" className="transition hover:text-white">Home</Link></li>
              <li><Link href="/#services" className="transition hover:text-white">Services</Link></li>
              <li><Link href="/#portfolio" className="transition hover:text-white">Portfolio</Link></li>
              <li><Link href="/book/interior-painting" className="transition hover:text-white">Book Now</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-stone-500">
          <Link href="/admin/login" className="inline-flex items-center gap-1 transition hover:text-white">
            <Lock className="h-3 w-3" /> Admin
          </Link>
          <span className="mx-3">|</span>
          &copy; {new Date().getFullYear()} BrushBook. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
