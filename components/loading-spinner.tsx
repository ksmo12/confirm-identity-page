export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-4"></div>
      <p className="text-gray-600">Processing your verification...</p>
    </div>
  )
}
