"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { CalendarDays, Clock, MapPin, User, Mail, Phone, MessageSquare, AlertCircle, CheckCircle } from "lucide-react"
import type { Service } from "@/lib/types"

interface FieldErrors {
  name?: string
  email?: string
  phone?: string
  city?: string
  address?: string
  postal_code?: string
  date?: string
  time?: string
}

export default function BookingForm({ service }: { service: Service }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  function validate(form: FormData): FieldErrors {
    const errors: FieldErrors = {}
    const name = form.get("name") as string
    const email = form.get("email") as string
    const phone = form.get("phone") as string
    const city = form.get("city") as string
    const address = form.get("address") as string
    const postal = form.get("postal_code") as string
    const date = form.get("date") as string
    const time = form.get("time") as string

    if (!name || name.trim().length < 2) errors.name = "Please enter your full name"
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email"
    if (!phone || !/^[\d\s\-+()]{7,}$/.test(phone)) errors.phone = "Please enter a valid phone number"
    if (!city || city.trim().length < 2) errors.city = "Please enter your city"
    if (!address || address.trim().length < 5) errors.address = "Please enter your full address"
    if (!postal || postal.trim().length < 3) errors.postal_code = "Please enter your postal code"
    if (!date) errors.date = "Please select a preferred date"
    if (!time) errors.time = "Please select a preferred time"
    if (date && new Date(date) < new Date(new Date().toDateString())) errors.date = "Date must be in the future"

    return errors
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    const form = new FormData(e.currentTarget)
    const errors = validate(form)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) return

    setLoading(true)

    const body = {
      service_id: service.id,
      customer_name: form.get("name"),
      customer_email: form.get("email"),
      customer_phone: form.get("phone"),
      address: form.get("address"),
      city: form.get("city"),
      postal_code: form.get("postal_code"),
      preferred_date: form.get("date"),
      preferred_time: form.get("time"),
      message: form.get("message") || "",
    }

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to submit booking")
      }

      const params = new URLSearchParams({
        service: service.name,
        date: form.get("date") as string,
        time: form.get("time") as string,
      })
      router.push(`/confirmation?${params}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field: keyof FieldErrors) =>
    `mt-1.5 block w-full rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 ${
      fieldErrors[field]
        ? "border-red-300 focus:border-red-400 focus:ring-red-200"
        : "border-stone-200 focus:border-brass focus:ring-brass/30"
    }`

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="flex items-center gap-1.5 text-sm font-medium text-stone-700">
            <User className="h-3.5 w-3.5 text-stone-400" /> Full Name *
          </label>
          <input id="name" name="name" className={inputClass("name")} />
          {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="flex items-center gap-1.5 text-sm font-medium text-stone-700">
            <Mail className="h-3.5 w-3.5 text-stone-400" /> Email *
          </label>
          <input id="email" name="email" type="email" className={inputClass("email")} />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="flex items-center gap-1.5 text-sm font-medium text-stone-700">
            <Phone className="h-3.5 w-3.5 text-stone-400" /> Phone *
          </label>
          <input id="phone" name="phone" type="tel" className={inputClass("phone")} />
          {fieldErrors.phone && <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>}
        </div>
        <div>
          <label htmlFor="city" className="flex items-center gap-1.5 text-sm font-medium text-stone-700">
            <MapPin className="h-3.5 w-3.5 text-stone-400" /> City *
          </label>
          <input id="city" name="city" className={inputClass("city")} />
          {fieldErrors.city && <p className="mt-1 text-xs text-red-500">{fieldErrors.city}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="address" className="flex items-center gap-1.5 text-sm font-medium text-stone-700">
            <MapPin className="h-3.5 w-3.5 text-stone-400" /> Address *
          </label>
          <input id="address" name="address" className={inputClass("address")} />
          {fieldErrors.address && <p className="mt-1 text-xs text-red-500">{fieldErrors.address}</p>}
        </div>
        <div>
          <label htmlFor="postal_code" className="flex items-center gap-1.5 text-sm font-medium text-stone-700">
            <MapPin className="h-3.5 w-3.5 text-stone-400" /> Postal Code *
          </label>
          <input id="postal_code" name="postal_code" className={inputClass("postal_code")} />
          {fieldErrors.postal_code && <p className="mt-1 text-xs text-red-500">{fieldErrors.postal_code}</p>}
        </div>
        <div>
          <label htmlFor="date" className="flex items-center gap-1.5 text-sm font-medium text-stone-700">
            <CalendarDays className="h-3.5 w-3.5 text-stone-400" /> Preferred Date *
          </label>
          <input id="date" name="date" type="date" className={inputClass("date")} />
          {fieldErrors.date && <p className="mt-1 text-xs text-red-500">{fieldErrors.date}</p>}
        </div>
        <div>
          <label htmlFor="time" className="flex items-center gap-1.5 text-sm font-medium text-stone-700">
            <Clock className="h-3.5 w-3.5 text-stone-400" /> Preferred Time *
          </label>
          <input id="time" name="time" type="time" className={inputClass("time")} />
          {fieldErrors.time && <p className="mt-1 text-xs text-red-500">{fieldErrors.time}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="flex items-center gap-1.5 text-sm font-medium text-stone-700">
          <MessageSquare className="h-3.5 w-3.5 text-stone-400" /> Additional Message
        </label>
        <textarea id="message" name="message" rows={3} className={inputClass("name")} />
      </div>

      <div className="rounded-lg border border-stone-200 bg-cream p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
          <CheckCircle className="h-4 w-4 text-brass" />
          Booking Summary
        </p>
        <div className="mt-3 space-y-1.5 text-sm text-stone-600">
          <p>Service: <span className="font-medium text-brand-dark">{service.name}</span></p>
          <p>Price: <span className="font-medium text-brand-dark">{service.price_range}</span></p>
          {service.estimated_hours && (
            <p>Estimated: <span className="font-medium text-brand-dark">{service.estimated_hours}</span></p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-stone-200 bg-cream p-5">
        <p className="text-sm font-semibold text-brand-dark">What happens next?</p>
        <ul className="mt-3 space-y-2 text-sm text-stone-600">
          <li className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
            <span>We&apos;ll review your request and call or email within 24 hours</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
            <span>We&apos;ll confirm your preferred date and time together</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
            <span>Payment is cash on completion — no upfront fees</span>
          </li>
        </ul>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brass px-4 py-3.5 text-sm font-semibold text-brand-dark shadow-lg shadow-brass/30 transition hover:bg-white hover:text-brand-dark active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting...
          </>
        ) : (
          "Confirm Booking"
        )}
      </button>
    </form>
  )
}
