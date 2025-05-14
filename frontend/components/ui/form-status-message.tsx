import { cn } from "@/lib/utils"
import type { FormStatus } from "@/types/form-types"

interface FormStatusMessageProps {
  status: FormStatus
  successMessage: string
  errorMessage: string
}

/**
 * フォームの状態メッセージを表示するコンポーネント
 */
export function FormStatusMessage({ status, successMessage, errorMessage }: FormStatusMessageProps) {
  if (status === "idle" || status === "submitting") {
    return null
  }

  return (
    <div
      className={cn(
        "px-4 py-2 rounded-md text-sm font-medium animate-in fade-in duration-300",
        status === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700",
      )}
      role="alert"
      aria-live="polite"
    >
      {status === "success" ? successMessage : errorMessage}
    </div>
  )
}
