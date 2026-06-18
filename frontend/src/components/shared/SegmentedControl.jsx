export default function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="inline-flex rounded-md border border-hairline bg-paper p-0.5">
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-[5px] px-3 py-1.5 text-[13px] font-medium transition-colors ${
              isActive ? 'bg-surface text-ink shadow-[0_0_0_1px_var(--color-hairline)]' : 'text-muted hover:text-ink'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
