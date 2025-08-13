"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/file-upload"
import { LoadingSpinner } from "@/components/loading-spinner"
import { SuccessMessage } from "@/components/success-message"

const verificationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, "Please enter SSN in format XXX-XX-XXXX"),
  proofOfAddress: z.instanceof(File, { message: "Please upload an ID or driver license" }),
})

type VerificationFormData = z.infer<typeof verificationSchema>

interface VerificationFormProps {
  onNext: () => void
}

export default function VerificationForm({ onNext }: VerificationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
  })

  const formatSSN = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`
  }

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSSN(e.target.value)
    setValue("ssn", formatted)
  }

  const onSubmit = async (data: VerificationFormData) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          phone: data.phone,
          ssn: data.ssn,
          proofOfAddress: data.proofOfAddress ? data.proofOfAddress.name : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit verification")
      }

      setIsLoading(false)
      setShowSuccess(true)

      setTimeout(() => {
        setShowSuccess(false)
        onNext()
      }, 3000)
    } catch (error) {
      setIsLoading(false)
      alert("There was an error submitting your verification. Please try again.")
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl p-10">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Identity Verification</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="email">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input id="email" type="email" {...register("email")} className={errors.email ? "border-red-500" : ""} />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="phone">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input id="phone" type="tel" {...register("phone")} className={errors.phone ? "border-red-500" : ""} />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <Label htmlFor="ssn">
            Social Security Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="ssn"
            type="text"
            placeholder="XXX-XX-XXXX"
            maxLength={11}
            value={watch("ssn") || ""}
            onChange={handleSSNChange}
            className={errors.ssn ? "border-red-500" : ""}
          />
          {errors.ssn && <p className="text-red-500 text-sm mt-1">{errors.ssn.message}</p>}
        </div>

        <div>
          <Label>
            ID CARD or Driver License <span className="text-red-500">*</span>
          </Label>
          <FileUpload
            onFileSelect={(file) => setValue("proofOfAddress", file)}
            accept=".jpg,.jpeg,.png,.pdf"
            error={errors.proofOfAddress?.message}
          />
        </div>

        {isLoading && <LoadingSpinner />}
        {showSuccess && <SuccessMessage />}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          Submit Verification
        </Button>
      </form>
    </div>
  )
}
