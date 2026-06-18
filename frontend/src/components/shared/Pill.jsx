const TONE_CLASSES = {
  neutral: 'bg-paper text-muted border-hairline',
  signal: 'bg-signal-soft text-signal border-signal/25',
  verified: 'bg-verified-soft text-verified border-verified/25',
  flagged: 'bg-flagged-soft text-flagged border-flagged/25',
  ochre: 'bg-ochre-soft text-ochre border-ochre/25',
}

export default function Pill({ tone = 'neutral', dashed = false, children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[13px] leading-none ${TONE_CLASSES[tone]} ${
        dashed ? 'border-dashed bg-transparent' : ''
      } ${className}`}
    >
      {children}
    </span>
  )
}
