"use client"

import Image from "next/image"
import { useEffect, useState, useCallback, useRef } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { GalleryItem } from "@/lib/types"

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/gallery")
        if (res.ok) setItems(await res.json())
      } catch {}
    }
    load()
  }, [])

  const prev = useCallback(() => {
    if (selected === null) return
    setSelected(selected === 0 ? items.length - 1 : selected - 1)
  }, [selected, items.length])

  const next = useCallback(() => {
    if (selected === null) return
    setSelected(selected === items.length - 1 ? 0 : selected + 1)
  }, [selected, items.length])

  const close = useCallback(() => setSelected(null), [])

  useEffect(() => {
    if (selected === null) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev()
      else if (e.key === "ArrowRight") next()
      else if (e.key === "Escape") close()
    }

    document.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [selected, prev, next, close])

  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)

    if (absDx > 50 && absDx > absDy) {
      if (dx > 0) prev()
      else next()
    } else if (absDy > 80 && absDy > absDx && dy > 0) {
      close()
    }
    touchStart.current = null
  }

  if (items.length === 0) return null

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setSelected(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-100"
          >
            <Image
              src={item.image_url}
              alt={item.label}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 p-4 text-left text-white opacity-0 transition group-hover:opacity-100">
              <p className="text-sm font-medium">{item.label}</p>
            </div>
          </button>
        ))}
      </div>

      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery lightbox"
        >
          <button
            onClick={close}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close"
            autoFocus
          >
            <X className="h-5 w-5" />
          </button>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/50">
            {selected + 1} / {items.length} — Swipe down or press Esc to close
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-16 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="relative h-auto max-h-[80vh] w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={items[selected].image_url}
              alt={items[selected].label}
              width={600}
              height={450}
              className="h-auto w-full rounded-lg object-cover"
            />
            <p className="mt-3 text-center text-sm text-white/70">
              {items[selected].label}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
