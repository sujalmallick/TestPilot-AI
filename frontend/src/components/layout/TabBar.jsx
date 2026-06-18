export default function TabBar({ tabs, activeTab, onChange }) {
  return (
    <div className="scroll-thin flex gap-6 overflow-x-auto border-b border-hairline px-5">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`flex shrink-0 items-center gap-1.5 border-b-2 py-2.5 text-[14px] transition-colors ${
              isActive
                ? 'border-signal font-medium text-ink'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {tab.label}
            {typeof tab.count === 'number' && (
              <span className="text-[12px] text-muted">{tab.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
