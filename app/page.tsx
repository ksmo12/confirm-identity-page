"use client"

import { useState } from "react"
import LandingPage from "@/components/landing-page"
import VerificationForm from "@/components/verification-form"
import PaymentForm from "@/components/payment-form"

type Step = "landing" | "verification" | "payment"

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>("landing")

  const handleStepChange = (step: Step) => {
    setCurrentStep(step)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 flex items-center justify-center p-5">
      <div className="w-full max-w-md">
        {currentStep === "landing" && <LandingPage onNext={() => handleStepChange("verification")} />}
        {currentStep === "verification" && <VerificationForm onNext={() => handleStepChange("payment")} />}
        {currentStep === "payment" && <PaymentForm />}
      </div>
    </div>
  )
}
