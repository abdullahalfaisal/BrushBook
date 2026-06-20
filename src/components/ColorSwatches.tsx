"use client"

import { useState } from "react"

const colors = [
  { name: "Cyan", value: "#00b4d8" },
  { name: "Magenta", value: "#ff006e" },
  { name: "Yellow", value: "#ffd60a" },
  { name: "Slate", value: "#1e293b" },
  { name: "Cool Gray", value: "#f0f0f5" },
]

export default function ColorSwatches() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium uppercase tracking-wider text-stone-500">
        Colors
      </span>
      <div className="flex gap-2">
        {colors.map((c) => (
          <button
            key={c.value}
            onClick={() => setActive(c.value === active ? null : c.value)}
            className="group relative"
            aria-label={c.name}
          >
            <span
              className={`block h-5 w-5 rounded-full border-2 transition-all duration-300 ${
                active === c.value
                  ? "scale-125 border-stone-800 shadow-md"
                  : "border-transparent hover:scale-110"
              }`}
              style={{ backgroundColor: c.value }}
            />
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-stone-400 opacity-0 transition-opacity group-hover:opacity-100">
              {c.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
