import { AlertCircle } from "lucide-react"

interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-500 text-white p-5 rounded-lg flex items-center space-x-2">
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <span className="font-semibold">{message}</span>
    </div>
  )
}
