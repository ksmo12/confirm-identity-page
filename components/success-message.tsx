import { CheckCircle } from "lucide-react"

export function SuccessMessage() {
  return (
    <div className="bg-green-500 text-white p-5 rounded-lg flex items-center justify-center space-x-2">
      <CheckCircle className="h-5 w-5" />
      <span className="font-semibold">Verification submitted successfully!</span>
    </div>
  )
}
