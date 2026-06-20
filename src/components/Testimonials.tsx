"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Star, Quote } from "lucide-react"
import type { Review } from "@/lib/types"

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/reviews")
        if (res.ok) setReviews(await res.json())
      } catch {}
    }
    load()
  }, [])

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % reviews.length)
    }, 5000)
  }, [reviews.length])

  useEffect(() => {
    if (reviews.length < 2 || paused) return
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [reviews.length, paused, startTimer])

  if (reviews.length === 0) return null

  const review = reviews[active]

  return (
    <div
      onMouseEnter={() => { setPaused(true); if (timerRef.current) clearInterval(timerRef.current) }}
      onMouseLeave={() => { setPaused(false) }}
    >
      <div className="relative mx-auto max-w-2xl rounded-2xl border border-stone-200/60 bg-white p-8 shadow-sm text-center">
        <Quote className="mx-auto h-8 w-8 text-brass/20" />
        <p className="mt-4 text-lg leading-relaxed text-stone-600 italic">
          &ldquo;{review.content}&rdquo;
        </p>
        <div className="mt-4 flex items-center justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < review.rating ? "fill-greige text-greige" : "fill-stone-200 text-stone-200"
              }`}
            />
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          {review.avatar_url ? (
            <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-brass/30">
              <Image
                src={review.avatar_url}
                alt={review.customer_name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brass/10 text-sm font-bold text-brass">
              {review.customer_name.charAt(0)}
            </div>
          )}
          <div className="text-left">
            <p className="text-sm font-semibold text-brand-dark">{review.customer_name}</p>
            {review.customer_title && (
              <p className="text-xs text-stone-500">{review.customer_title}</p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-center gap-2">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all ${
              i === active ? "w-8 bg-brass" : "w-2 bg-stone-300"
            }`}
            aria-label={`Go to review ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
