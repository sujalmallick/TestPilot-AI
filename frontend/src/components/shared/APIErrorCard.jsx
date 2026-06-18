import { AlertCircle } from "lucide-react";

export default function APIErrorCard({
  title = "Analysis couldn't be completed",
  message = "Gemini API quota has been exhausted.",
  onRetry,
}) {
  return (
    <div className="flex h-[420px] items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-xl border border-red-200 bg-white p-8 shadow-sm">

        <div className="flex items-start gap-4">

          <div className="rounded-full bg-red-50 p-2">
            <AlertCircle
              size={22}
              className="text-red-500"
            />
          </div>

          <div className="flex-1">

            <h2 className="text-lg font-semibold text-ink">
              {title}
            </h2>

            <p className="mt-2 text-sm text-muted">
              {message}
            </p>

            <div className="mt-6 flex gap-3">

              <button
                onClick={onRetry}
                className="rounded-md bg-signal px-4 py-2 text-sm font-medium text-white"
              >
                Try Again
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}