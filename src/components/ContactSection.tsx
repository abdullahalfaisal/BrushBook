"use client"

import { useState } from "react"
import { Phone, Mail, MapPin, Send } from "lucide-react"

export default function ContactSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")

    const form = new FormData(e.currentTarget)
    const body = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      message: form.get("message"),
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      setStatus(res.ok ? "sent" : "error")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="contact" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <span className="inline-block rounded-full bg-stone-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-stone-500">
            Get in Touch
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            Contact Us
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-500">
            Have a question or ready for a free quote? Reach out and we&apos;ll get back to you within 24 hours.
          </p>
        </div>
        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-start gap-4 rounded-xl border border-stone-200/60 bg-cream/50 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brass/10">
                <Phone className="h-5 w-5 text-brass" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-dark">Phone</h3>
                <a href="tel:+61400000000" className="mt-0.5 text-sm text-stone-500 transition hover:text-brass">0400 000 000</a>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-stone-200/60 bg-cream/50 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brass/10">
                <Mail className="h-5 w-5 text-brass" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-dark">Email</h3>
                <a href="mailto:info@brushbook.com.au" className="mt-0.5 text-sm text-stone-500 transition hover:text-brass">info@brushbook.com.au</a>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-stone-200/60 bg-cream/50 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brass/10">
                <MapPin className="h-5 w-5 text-brass" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-dark">Location</h3>
                <p className="mt-0.5 text-sm text-stone-500">Servicing Greater Melbourne, VIC</p>
              </div>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-xl border border-stone-200/60 bg-cream/30 p-6 shadow-sm"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="text-sm font-medium text-stone-700">Name</label>
                <input id="contact-name" name="name" type="text" required className="mt-1.5 block w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm transition focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30" />
              </div>
              <div>
                <label htmlFor="contact-email" className="text-sm font-medium text-stone-700">Email</label>
                <input id="contact-email" name="email" type="email" required className="mt-1.5 block w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm transition focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30" />
              </div>
            </div>
            <div>
              <label htmlFor="contact-phone" className="text-sm font-medium text-stone-700">Phone (optional)</label>
              <input id="contact-phone" name="phone" type="tel" className="mt-1.5 block w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm transition focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30" />
            </div>
            <div>
              <label htmlFor="contact-message" className="text-sm font-medium text-stone-700">Message</label>
              <textarea id="contact-message" name="message" rows={4} required className="mt-1.5 block w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm transition focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30 resize-none" />
            </div>
            {status === "sent" && (
              <p className="text-sm text-green-600">Message sent! We&apos;ll get back to you soon.</p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-600">Something went wrong. Please try again or call us directly.</p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brass px-6 py-2.5 text-sm font-semibold text-brand-dark transition hover:bg-cyan-600 hover:text-white disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : <>Send Message <Send className="h-4 w-4" /></>}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
