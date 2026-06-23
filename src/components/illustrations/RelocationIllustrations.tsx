// V10.9: lightweight, vendor-free decorative SVG illustrations.
// All illustrations are decorative only (aria-hidden, no meaningful alt text needed)
// and use the existing brand palette (cream background, deep green/teal accents).
// No flags, no government or partner logos, no stock photography.

export function RouteMapIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 240"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="320" height="240" rx="24" fill="#f8f6f1" />
      <path
        d="M28 190c40-60 70-10 110-50s60-70 130-40"
        stroke="#10b981"
        strokeWidth="4"
        strokeDasharray="2 10"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="28" cy="190" r="8" fill="#123638" />
      <circle cx="268" cy="100" r="8" fill="#123638" />
      <path
        d="M150 70a16 16 0 1 0-0.1 0z M150 54a16 16 0 0 1 16 16c0 12-16 28-16 28s-16-16-16-28a16 16 0 0 1 16-16z"
        fill="#0c2829"
      />
      <circle cx="150" cy="70" r="6" fill="#f8f6f1" />
      <rect x="60" y="40" width="36" height="28" rx="4" fill="#ffffff" stroke="#123638" strokeWidth="2" />
      <path d="M60 52h36" stroke="#123638" strokeWidth="2" />
      <rect x="220" y="150" width="44" height="34" rx="4" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
      <path d="M232 184v-16l10-8 10 8v16" stroke="#10b981" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function ChecklistIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="240" height="240" rx="24" fill="#f8f6f1" />
      <rect x="60" y="36" width="120" height="168" rx="12" fill="#ffffff" stroke="#123638" strokeWidth="3" />
      <rect x="90" y="24" width="60" height="20" rx="6" fill="#10b981" />
      {[70, 102, 134, 166].map((y) => (
        <g key={y}>
          <rect x="78" y={y} width="16" height="16" rx="4" fill="none" stroke="#10b981" strokeWidth="2.5" />
          <path d={`M81 ${y + 8}l3 3 7-7`} stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="104" y={y + 3} width="58" height="9" rx="4" fill="#e5e9e8" />
        </g>
      ))}
    </svg>
  );
}

export function VoiceGuideIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 200"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="240" height="200" rx="24" fill="#f8f6f1" />
      <rect x="100" y="56" width="40" height="64" rx="20" fill="#0c2829" />
      <path d="M80 96a40 40 0 0 0 80 0" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M120 136v18" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
      <path d="M100 154h40" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 70c8 10 8 50 0 60" stroke="#123638" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M190 70c-8 10-8 50 0 60" stroke="#123638" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function SuitcaseIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 200"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="240" height="200" rx="24" fill="#f8f6f1" />
      <rect x="70" y="80" width="100" height="78" rx="10" fill="#10b981" />
      <rect x="100" y="62" width="40" height="22" rx="8" fill="none" stroke="#0c2829" strokeWidth="4" />
      <rect x="70" y="80" width="100" height="78" rx="10" fill="none" stroke="#0c2829" strokeWidth="3" />
      <path d="M70 112h100" stroke="#0c2829" strokeWidth="3" />
      <rect x="112" y="100" width="16" height="40" rx="4" fill="#f8f6f1" />
    </svg>
  );
}
