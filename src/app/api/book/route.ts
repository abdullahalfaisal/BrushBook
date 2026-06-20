import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"
import { Resend } from "resend"

export async function POST(req: Request) {
  try {
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
        customer_name,
        customer_email,
        customer_phone,
        address,
        city,
        postal_code,
        preferred_date,
        preferred_time,
        message: message || null,
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
        `Name: ${customer_name}`,
        `Email: ${customer_email}`,
        `Phone: ${customer_phone}`,
        `Address: ${address}, ${city} ${postal_code}`,
        `Preferred: ${preferred_date} at ${preferred_time}`,
        message ? `Notes: ${message}` : null,
      ]
        .filter(Boolean)
        .join("\n")

      await resend.emails.send({
        from: "PaintBooking <onboarding@resend.dev>",
        to: process.env.OWNER_EMAIL,
        subject: `New Booking: ${customer_name} - ${service?.name || "Unknown"}`,
        text: emailBody,
      })
    }

    return NextResponse.json({ booking: data }, { status: 201 })
  } catch (err) {
    console.error("Booking error:", err)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}
