import { NextResponse } from "next/server"
import { Resend } from "resend"
import { rateLimit } from "@/lib/rate-limit"
import { sanitizeInput, validateLengths } from "@/lib/validation"

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"

    if (!rateLimit(`contact:${ip}`, 3, 60_000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { name, email, phone, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const lengthCheck = validateLengths(body)
    if (!lengthCheck.valid) {
      return NextResponse.json({ error: lengthCheck.error }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const safe = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      phone: sanitizeInput(phone || ""),
      message: sanitizeInput(message),
    }

    if (process.env.RESEND_API_KEY && process.env.OWNER_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY)

      const emailBody = [
        `New Contact Inquiry`,
        ``,
        `Name: ${safe.name}`,
        `Email: ${safe.email}`,
        safe.phone ? `Phone: ${safe.phone}` : null,
        ``,
        `Message:`,
        safe.message,
      ]
        .filter(Boolean)
        .join("\n")

      await resend.emails.send({
        from: "BrushBook <onboarding@resend.dev>",
        to: process.env.OWNER_EMAIL,
        subject: `New Inquiry from ${safe.name}`,
        text: emailBody,
      })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}
