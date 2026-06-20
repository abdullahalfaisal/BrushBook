type SplashColor = "brass" | "sage" | "greige" | "sage-light"

interface Props {
  color: SplashColor
  className?: string
  type?: "stroke" | "splash" | "drops"
}

const colorMap: Record<SplashColor, string> = {
  brass: "#06b6d4",
  sage: "#ec4899",
  greige: "#eab308",
  "sage-light": "#f9a8d4",
}

export default function PaintSplash({ color, className = "", type = "stroke" }: Props) {
  const c = colorMap[color]

  if (type === "stroke") {
    return (
      <svg viewBox="0 0 200 30" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2 15 Q 25 2, 50 15 T 100 12 T 150 18 T 198 13"
          stroke={c}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M2 17 Q 30 8, 55 17 T 105 14 T 155 20 T 198 15"
          stroke={c}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.25"
        />
      </svg>
    )
  }

  if (type === "splash") {
    return (
      <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M60 80 C 45 75, 30 65, 25 50 C 20 35, 30 20, 45 18 C 55 16, 65 22, 70 15 C 75 8, 85 10, 88 18 C 92 26, 85 35, 90 42 C 95 49, 98 58, 92 66 C 86 74, 75 78, 60 80 Z"
          fill={c}
          opacity="0.35"
        />
        <circle cx="25" cy="35" r="4" fill={c} opacity="0.5" />
        <circle cx="90" cy="25" r="3" fill={c} opacity="0.4" />
        <circle cx="95" cy="50" r="2.5" fill={c} opacity="0.3" />
        <circle cx="35" cy="15" r="3.5" fill={c} opacity="0.45" />
        <circle cx="15" cy="55" r="2" fill={c} opacity="0.35" />
        <circle cx="80" cy="10" r="2" fill={c} opacity="0.3" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 100 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="20" rx="25" ry="6" fill={c} opacity="0.3" />
      <ellipse cx="70" cy="15" rx="20" ry="4" fill={c} opacity="0.2" />
      <circle cx="10" cy="10" r="2.5" fill={c} opacity="0.5" />
      <circle cx="50" cy="8" r="2" fill={c} opacity="0.4" />
      <circle cx="85" cy="10" r="1.5" fill={c} opacity="0.35" />
      <circle cx="15" cy="28" r="1.5" fill={c} opacity="0.3" />
      <circle cx="65" cy="25" r="2" fill={c} opacity="0.25" />
    </svg>
  )
}
