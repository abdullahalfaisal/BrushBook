import { NextResponse } from "next/server"
import crypto from "crypto"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"

  if (!rateLimit(`login:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many login attempts. Try again in a minute." }, { status: 429 })
  }

  const { password } = await req.json()
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword || typeof password !== "string") {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const bufA = Buffer.from(password)
  const bufB = Buffer.from(adminPassword)
  if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const token = crypto.createHash("sha256").update(adminPassword).digest("hex")
  return NextResponse.json({ token })
}
