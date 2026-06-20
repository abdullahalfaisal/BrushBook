"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarDays, Clock, Mail, Phone, MapPin, MessageSquare, AlertCircle, Bell } from "lucide-react"
import type { Booking } from "@/lib/types"

const statusConfig = {
  pending: { label: "Pending", class: "bg-amber-50 text-amber-700 border-amber-200" },
  confirmed: { label: "Confirmed", class: "bg-blue-50 text-blue-700 border-blue-200" },
  completed: { label: "Completed", class: "bg-green-50 text-green-700 border-green-200" },
  cancelled: { label: "Cancelled", class: "bg-red-50 text-red-700 border-red-200" },
} as const

export default function AdminDashboardPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<string>("all")
  const [notif, setNotif] = useState<string | null>(null)
  const prevCount = useRef(0)
  const hasLoaded = useRef(false)

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    async function load() {
      const token = sessionStorage.getItem("admin_token")
      try {
        const res = await fetch("/api/admin/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 401) {
          sessionStorage.removeItem("admin_token")
          router.replace("/admin/login")
          return
        }
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        if (!cancelled) {
          if (hasLoaded.current && data.length > prevCount.current) {
            const diff = data.slice(0, data.length - prevCount.current)
            const names = diff.map((b: Booking) => b.customer_name).join(", ")
            setNotif(`New booking${diff.length > 1 ? "s" : ""} from ${names}`)
            setTimeout(() => setNotif((n) => n === `New booking${diff.length > 1 ? "s" : ""} from ${names}` ? null : n), 6000)
          }
          prevCount.current = data.length
          hasLoaded.current = true
          setBookings(data)
          setLoading(false)
        }
      } catch {
        if (!cancelled) setError("Failed to load bookings")
      } finally {
        if (!cancelled) {
          timer = setTimeout(load, 5000)
        }
      }
    }
    load()
    return () => { cancelled = true; clearTimeout(timer) }
  }, [])

  async function updateStatus(id: string, status: string) {
    const token = sessionStorage.getItem("admin_token")
    const res = await fetch(`/api/admin/bookings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: status as Booking["status"] } : b))
      )
    }
  }

  const totalPending = bookings.filter((b) => b.status === "pending").length

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-brass" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600">
        <AlertCircle className="h-4 w-4" /> {error}
      </div>
    )
  }

  return (
    <div>
      {notif && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-brass/30 bg-brass/10 p-4 text-sm font-medium text-brand-dark shadow-sm">
          <Bell className="h-5 w-5 shrink-0 text-brass" />
          <span className="flex-1">{notif}</span>
          <button onClick={() => setNotif(null)} className="text-stone-400 hover:text-stone-600">&times;</button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-dark">Bookings</h1>
          <p className="mt-1 text-sm text-stone-500">
            {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
            {totalPending > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                {totalPending} pending
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
                filter === s
                  ? "bg-brand-dark text-brass"
                  : "bg-white text-stone-600 hover:bg-stone-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-stone-400">
            {filter === "all" ? "No bookings yet." : `No ${filter} bookings.`}
          </p>
        )}
        {filtered.map((booking) => {
          const status = statusConfig[booking.status] || statusConfig.pending
          return (
            <div
              key={booking.id}
              className="rounded-lg border border-stone-200/60 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cream text-sm font-semibold text-brass">
                    {booking.customer_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-dark">{booking.customer_name}</p>
                    <div className="mt-0.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {booking.customer_email}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {booking.customer_phone}</span>
                    </div>
                  </div>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${status.class}`}>
                  {status.label}
                </span>
              </div>

              <div className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                <span className="flex items-center gap-1.5 text-stone-600">
                  <CalendarDays className="h-3.5 w-3.5 text-stone-400" />
                  {booking.preferred_date}
                </span>
                <span className="flex items-center gap-1.5 text-stone-600">
                  <Clock className="h-3.5 w-3.5 text-stone-400" />
                  {booking.preferred_time}
                </span>
                <span className="flex items-center gap-1.5 text-stone-600 sm:col-span-2">
                  <MapPin className="h-3.5 w-3.5 text-stone-400" />
                  {booking.address}, {booking.city} {booking.postal_code}
                </span>
                {booking.services && (
                  <span className="flex items-center gap-1.5 text-stone-600 sm:col-span-2">
                    <span className="rounded bg-cream px-2 py-0.5 text-xs font-medium text-brass">
                      {booking.services.name}
                    </span>
                  </span>
                )}
                {booking.message && (
                  <span className="flex items-start gap-1.5 text-stone-600 sm:col-span-2">
                    <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-stone-400" />
                    <span className="italic">&ldquo;{booking.message}&rdquo;</span>
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-stone-100 pt-4">
                {booking.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(booking.id, "confirmed")}
                      className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-blue-500"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => updateStatus(booking.id, "cancelled")}
                      className="rounded-lg border border-red-200 px-4 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {booking.status === "confirmed" && (
                  <button
                    onClick={() => updateStatus(booking.id, "completed")}
                    className="rounded-lg bg-green-600 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-green-500"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
