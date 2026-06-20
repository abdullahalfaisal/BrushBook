"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Palette, Star, Image, LogOut, Menu, X, Pin } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [authed] = useState<boolean>(() =>
    typeof window !== "undefined" ? !!sessionStorage.getItem("admin_token") : false
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pinned, setPinned] = useState<boolean>(() =>
    typeof window !== "undefined" ? localStorage.getItem("admin_sidebar_pinned") === "true" : false
  )
  const [hover, setHover] = useState(false)

  function togglePinned() {
    const next = !pinned
    setPinned(next)
    localStorage.setItem("admin_sidebar_pinned", String(next))
  }

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token")
    if (!token && pathname !== "/admin/login") {
      router.replace("/admin/login")
    }
  }, [pathname, router])

  if (!authed && pathname !== "/admin/login") return null

  const navLinks = [
    { href: "/admin/dashboard", label: "Bookings", icon: LayoutDashboard },
    { href: "/admin/services", label: "Services", icon: Palette },
    { href: "/admin/reviews", label: "Testimonials", icon: Star },
    { href: "/admin/gallery", label: "Gallery", icon: Image },
  ]

  function isActive(href: string) {
    if (href === "/admin/dashboard") return pathname === href
    return pathname.startsWith(href)
  }

  const expanded = pinned || hover

  return (
    <div className="min-h-screen bg-cream">
      {authed && (
        <>
          {/* Mobile header */}
          <header className="sticky top-0 z-50 border-b border-stone-200/60 bg-white lg:hidden">
            <div className="flex h-14 items-center justify-between px-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <Link href="/admin/dashboard" className="flex items-center gap-2 text-sm font-bold tracking-tight text-brand-dark">
                <Palette className="h-5 w-5 text-brass" />
                Admin Panel
              </Link>
              <div className="w-5" />
            </div>
          </header>

          {/* Mobile overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}

          {/* Sidebar — docked by default, expands on hover */}
          <aside
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-stone-200/60 bg-white transition-all duration-200 lg:translate-x-0 ${
              sidebarOpen ? "w-56 translate-x-0" : expanded ? "w-56" : "w-14"
            } ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
          >
            {/* Logo area */}
            <div className={`flex h-14 items-center border-b border-stone-200/60 ${expanded ? "gap-2 px-5" : "justify-center"}`}>
              <Palette className="h-5 w-5 shrink-0 text-brass" />
              <span className={`truncate text-sm font-bold tracking-tight text-brand-dark transition-opacity ${expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                Admin Panel
              </span>
            </div>

            <nav className="flex-1 space-y-1 p-2">
              {navLinks.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center rounded-lg text-sm transition ${
                      expanded ? "gap-3 px-3 py-2.5" : "justify-center p-2.5"
                    } ${active ? "bg-brass/10 font-medium text-brass" : "text-stone-600 hover:bg-stone-100"}`}
                    title={!expanded ? link.label : undefined}
                  >
                    <link.icon className={`h-4 w-4 shrink-0 ${active ? "text-brass" : ""}`} />
                    <span className={`truncate transition-opacity ${expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                      {link.label}
                    </span>
                  </Link>
                )
              })}
            </nav>

            <div className="border-t border-stone-200/60 p-2">
              <button
                onClick={togglePinned}
                className={`flex w-full items-center rounded-lg text-sm text-stone-400 transition hover:text-stone-600 ${
                  expanded ? "gap-3 px-3 py-2.5" : "justify-center p-2.5"
                } ${pinned ? "text-brass" : ""}`}
                title={!expanded ? "Pin sidebar" : undefined}
              >
                <Pin className={`h-4 w-4 shrink-0 ${pinned ? "fill-brass text-brass" : ""}`} />
                <span className={`truncate transition-opacity ${expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                  {pinned ? "Docked" : "Auto-hide"}
                </span>
              </button>
              <button
                onClick={() => {
                  sessionStorage.removeItem("admin_token")
                  router.replace("/admin/login")
                }}
                className={`flex w-full items-center rounded-lg text-sm text-stone-500 transition hover:bg-red-50 hover:text-red-600 ${
                  expanded ? "gap-3 px-3 py-2.5" : "justify-center p-2.5"
                }`}
                title={!expanded ? "Logout" : undefined}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span className={`truncate transition-opacity ${expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                  Logout
                </span>
              </button>
            </div>
          </aside>

          {/* Main content — offset by sidebar on desktop */}
          <div className={`transition-all duration-200 ${expanded ? "lg:pl-56" : "lg:pl-14"}`}>
            <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          </div>
        </>
      )}
      {!authed && pathname === "/admin/login" && <main>{children}</main>}
    </div>
  )
}
