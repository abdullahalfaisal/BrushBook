import { NextResponse } from "next/server"
import crypto from "crypto"
import { rateLimit } from "./rate-limit"

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  return crypto.timingSafeEqual(bufA, bufB)
}

export function checkAdmin(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"

  if (!rateLimit(`admin:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!token || !adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const expected = crypto.createHash("sha256").update(adminPassword).digest("hex")
  if (!timingSafeEqual(token, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return null
}
