import Link from "next/link"
import { CheckCircle, ArrowLeft, CalendarDays, Clock } from "lucide-react"

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; date?: string; time?: string }>
}) {
  const params = await searchParams

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cream">
        <CheckCircle className="h-10 w-10 text-brass" />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-brand-dark">
        Booking Submitted
      </h1>
      <p className="mx-auto mt-4 max-w-sm leading-relaxed text-stone-500">
        Thank you for your booking. We&apos;ll review your request and get back
        to you within 24 hours to confirm your appointment.
      </p>

      {params.service && (
        <div className="mt-8 rounded-lg border border-stone-200 bg-cream p-5 text-left">
          <p className="text-sm font-semibold text-brand-dark">Booking Summary</p>
          <div className="mt-3 space-y-2 text-sm text-stone-600">
            <p><span className="font-medium text-brand-dark">Service:</span> {params.service}</p>
            {params.date && (
              <p className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-brass" />
                <span className="font-medium text-brand-dark">Date:</span> {params.date}
              </p>
            )}
            {params.time && (
              <p className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brass" />
                <span className="font-medium text-brand-dark">Time:</span> {params.time}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-brass px-6 py-3 text-sm font-semibold text-brand-dark shadow-lg shadow-brass/30 transition hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
