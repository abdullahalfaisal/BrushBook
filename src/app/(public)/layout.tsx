import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1 pb-16 sm:pb-0">{children}</main>
      <Footer />
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/20 bg-brand-dark px-4 py-3 sm:hidden">
        <Link
          href="/book/interior-painting"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brass px-6 py-3 text-sm font-semibold text-brand-dark shadow-lg shadow-brass/30"
        >
          Get a Free Quote <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  )
}
