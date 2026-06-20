import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"
import { checkAdmin } from "@/lib/auth"
import { Resend } from "resend"

export async function GET(req: Request) {
  const authError = checkAdmin(req)
  if (authError) return authError

  const adminSupabase = getAdminSupabase()
  const { data, error } = await adminSupabase
    .from("bookings")
    .select("*, services(*)")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  const authError = checkAdmin(req)
  if (authError) return authError

  try {
    const { id, status } = await req.json()

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing id or status" },
        { status: 400 }
      )
    }

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const adminSupabase = getAdminSupabase()
    const { data, error } = await adminSupabase
      .from("bookings")
      .update({ status })
      .eq("id", id)
      .select("*, services(*)")
      .single()

    if (error) throw error

    // Send confirmation email to customer when status is "confirmed"
    if (status === "confirmed" && process.env.RESEND_API_KEY && data?.customer_email) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const serviceName = data.services?.name || "your painting service"

      const emailBody = [
        `Hi ${data.customer_name},`,
        ``,
        `Great news — your booking for ${serviceName} has been confirmed!`,
        ``,
        `Details:`,
        `Date: ${data.preferred_date}`,
        `Time: ${data.preferred_time}`,
        `Address: ${data.address}, ${data.city} ${data.postal_code}`,
        ``,
        `If you have any questions, feel free to reply to this email or call us.`,
        ``,
        `Thanks,`,
        `The BrushBook Team`,
      ].join("\n")

      await resend.emails.send({
        from: "BrushBook <onboarding@resend.dev>",
        to: data.customer_email,
        subject: `Booking Confirmed: ${serviceName}`,
        text: emailBody,
      })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    )
  }
}
