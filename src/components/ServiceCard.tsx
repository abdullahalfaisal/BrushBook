import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import type { Service } from "@/lib/types"

const dotColors = ["bg-brass", "bg-sage", "bg-greige", "bg-sage-light", "bg-brand-mid", "bg-cyan-400"]

export default function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  return (
    <Link
      href={`/book/${service.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-stone-200/80 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden bg-stone-100">
        {service.image_url ? (
          <Image
            src={service.image_url}
            alt={service.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-serif text-5xl text-stone-300">
            {service.name.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        {service.estimated_hours && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-stone-600 backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            {service.estimated_hours}
          </span>
        )}
        {/* Color dot */}
        <span className={`absolute top-3 right-3 h-3 w-3 rounded-full shadow-sm ${dotColors[index % dotColors.length]}`} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold tracking-tight text-brand-dark">{service.name}</h3>
        <p className="mt-1.5 flex-1 line-clamp-2 text-sm leading-relaxed text-stone-500">
          {service.description}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
          <span className="text-sm font-semibold text-brass">
            {service.price_range}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-brass transition-all group-hover:gap-2">
            Book Now <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
