import { notFound } from "next/navigation"
import { getSupabase } from "@/lib/supabase"
import BookingForm from "@/components/BookingForm"

export const dynamic = "force-dynamic"

export default async function BookPage({
  params,
}: {
  params: Promise<{ serviceId: string }>
}) {
  const { serviceId } = await params

  const supabase = getSupabase()
  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .eq("is_active", true)
    .single()

  if (!service) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Book a Service</h1>
      <p className="mt-2 text-zinc-600">
        Fill in the details below and we&apos;ll get back to you within 24 hours.
      </p>
      <div className="mt-8">
        <BookingForm service={service} />
      </div>
    </div>
  )
}
