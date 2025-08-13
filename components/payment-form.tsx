"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ErrorMessage } from "@/components/error-message"

const paymentSchema = z.object({
  cardholderName: z.string().min(1, "Cardholder name is required"),
  cardNumber: z.string().regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, "Please enter a valid card number"),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, "Please enter expiry date in MM/YY format"),
  cvv: z.string().regex(/^\d{3,4}$/, "Please enter a valid CVV"),
})

type PaymentFormData = z.infer<typeof paymentSchema>

export default function PaymentForm() {
  const [showError, setShowError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  })

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{4})(?=\d)/g, "$1 ")
  }

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length >= 2) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`
    }
    return numbers
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setValue("cardNumber", formatted)
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    setValue("expiryDate", formatted)
  }

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/\D/g, "")
    setValue("cvv", numbers)
  }

  const onSubmit = async (data: PaymentFormData) => {
    setIsLoading(true)
    setShowError(false)

    try {
      const response = await fetch("/api/send-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to submit payment information")
      }

      setIsLoading(false)
      // Show success message or redirect as needed
      alert("Payment information has been submitted successfully!")
    } catch (error) {
      setIsLoading(false)
      setShowError(true)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl p-10">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Form Fee: $1.50</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="cardholderName">
            Cardholder Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="cardholderName"
            type="text"
            {...register("cardholderName")}
            className={errors.cardholderName ? "border-red-500" : ""}
          />
          {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName.message}</p>}
        </div>

        <div>
          <Label htmlFor="cardNumber">
            Card Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="cardNumber"
            type="text"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            value={watch("cardNumber") || ""}
            onChange={handleCardNumberChange}
            className={errors.cardNumber ? "border-red-500" : ""}
          />
          {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="expiryDate">
              Expiry Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="expiryDate"
              type="text"
              placeholder="MM/YY"
              maxLength={5}
              value={watch("expiryDate") || ""}
              onChange={handleExpiryChange}
              className={errors.expiryDate ? "border-red-500" : ""}
            />
            {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</p>}
          </div>

          <div className="flex-1">
            <Label htmlFor="cvv">
              CVV <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cvv"
              type="text"
              placeholder="123"
              maxLength={4}
              value={watch("cvv") || ""}
              onChange={handleCVVChange}
              className={errors.cvv ? "border-red-500" : ""}
            />
            {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>}
          </div>
        </div>

        {showError && (
          <ErrorMessage message="We can't process your payment right now. Please contact your agent in charge of your application." />
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </Button>
      </form>
    </div>
  )
}
