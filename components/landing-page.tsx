"use client"

import { Button } from "@/components/ui/button"

interface LandingPageProps {
  onNext: () => void
}

export default function LandingPage({ onNext }: LandingPageProps) {
  return (
    <div className="bg-white rounded-xl shadow-2xl p-10 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Verify Your Identity Now</h1>
      <Button
        onClick={onNext}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
      >
        Verify Now
      </Button>
    </div>
  )
}
