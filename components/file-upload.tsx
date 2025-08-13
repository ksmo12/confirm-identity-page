"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  error?: string
}

export function FileUpload({ onFileSelect, accept = ".jpg,.jpeg,.png,.pdf", error }: FileUploadProps) {
  const [fileName, setFileName] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      onFileSelect(file)
    }
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            error ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 hover:border-indigo-500 hover:bg-gray-100"
          }`}
        >
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500 mt-1">JPG, JPEG, PNG, or PDF files only</p>
        </div>
      </div>

      {fileName && <p className="text-sm text-gray-600">Selected: {fileName}</p>}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
