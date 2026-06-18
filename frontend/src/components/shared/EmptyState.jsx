export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-hairline px-6 py-10 text-center">
      {icon && <div className="mb-1 text-muted">{icon}</div>}
      {title && <p className="text-sm font-medium text-ink">{title}</p>}
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
