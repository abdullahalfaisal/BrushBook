import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"
import { Resend } from "resend"
import { rateLimit } from "@/lib/rate-limit"
import { sanitizeInput, validateLengths } from "@/lib/validation"

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"

    if (!rateLimit(`book:${ip}`, 5, 60_000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    const body = await req.json()
    const {
      service_id,
      customer_name,
      customer_email,
      customer_phone,
      address,
      city,
      postal_code,
      preferred_date,
      preferred_time,
      message,
    } = body

    if (
      !service_id ||
      !customer_name ||
      !customer_email ||
      !customer_phone ||
      !address ||
      !city ||
      !postal_code ||
      !preferred_date ||
      !preferred_time
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const lengthCheck = validateLengths(body)
    if (!lengthCheck.valid) {
      return NextResponse.json({ error: lengthCheck.error }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customer_email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const safe = {
      customer_name: sanitizeInput(customer_name),
      customer_email: sanitizeInput(customer_email),
      customer_phone: sanitizeInput(customer_phone),
      address: sanitizeInput(address),
      city: sanitizeInput(city),
      postal_code: sanitizeInput(postal_code),
      preferred_date: sanitizeInput(preferred_date),
      preferred_time: sanitizeInput(preferred_time),
      message: sanitizeInput(message || ""),
    }

    const adminSupabase = getAdminSupabase()

    const { data: service } = await adminSupabase
      .from("services")
      .select("name")
      .eq("id", service_id)
      .single()

    const { data, error } = await adminSupabase
      .from("bookings")
      .insert({
        service_id,
        customer_name: safe.customer_name,
        customer_email: safe.customer_email,
        customer_phone: safe.customer_phone,
        address: safe.address,
        city: safe.city,
        postal_code: safe.postal_code,
        preferred_date: safe.preferred_date,
        preferred_time: safe.preferred_time,
        message: safe.message || null,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    if (process.env.RESEND_API_KEY && process.env.OWNER_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const emailBody = [
        `New Booking Request`,
        ``,
        `Service: ${service?.name || "Unknown"}`,
        `Name: ${safe.customer_name}`,
        `Email: ${safe.customer_email}`,
        `Phone: ${safe.customer_phone}`,
        `Address: ${safe.address}, ${safe.city} ${safe.postal_code}`,
        `Preferred: ${safe.preferred_date} at ${safe.preferred_time}`,
        safe.message ? `Notes: ${safe.message}` : null,
      ]
        .filter(Boolean)
        .join("\n")

      await resend.emails.send({
        from: "BrushBook <onboarding@resend.dev>",
        to: process.env.OWNER_EMAIL,
        subject: `New Booking: ${safe.customer_name} - ${service?.name || "Unknown"}`,
        text: emailBody,
      })
    }

    return NextResponse.json({ booking: data }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}
