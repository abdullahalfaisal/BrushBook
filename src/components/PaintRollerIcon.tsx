export default function PaintRollerIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Handle */}
      <rect x="42" y="50" width="16" height="40" rx="3" fill="currentColor" opacity="0.6" />
      {/* Frame arm */}
      <rect x="38" y="46" width="24" height="6" rx="2" fill="currentColor" opacity="0.4" />
      {/* Roller cylinder */}
      <rect x="25" y="30" width="50" height="18" rx="9" fill="currentColor" opacity="0.9" />
      {/* Roller nap texture */}
      <rect x="25" y="30" width="50" height="18" rx="9" stroke="currentColor" strokeWidth="1" opacity="0.3" strokeDasharray="2 3" />
      {/* Paint drip */}
      <path d="M58 48 Q60 54 58 58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <circle cx="58" cy="60" r="1.5" fill="currentColor" opacity="0.5" />
    </svg>
  )
}
