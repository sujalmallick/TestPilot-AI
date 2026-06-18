export default function ToastStack({ toasts }) {
  if (!toasts.length) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-md border border-hairline bg-ink px-3.5 py-2.5 text-[13px] text-paper shadow-none"
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
