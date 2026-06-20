import { notFound } from "next/navigation"
import { getSupabase } from "@/lib/supabase"
import BookingForm from "@/components/BookingForm"
import { CheckCircle } from "lucide-react"

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
      <h1 className="text-3xl font-bold tracking-tight text-brand-dark">Book {service.name}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-stone-500">
        <span className="font-medium text-brass">{service.price_range}</span>
        {service.estimated_hours && (
          <span className="flex items-center gap-1">
            · {service.estimated_hours}
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-400">
        <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-brass" /> Free consultation</span>
        <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-brass" /> No upfront payment</span>
        <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-brass" /> 24hr response</span>
      </div>
      <div className="mt-8">
        <BookingForm service={service} />
      </div>
    </div>
  )
}
