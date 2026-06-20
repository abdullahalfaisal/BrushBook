import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: Request) {
  const { password } = await req.json()
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const token = crypto.createHash("sha256").update(adminPassword).digest("hex")

  return NextResponse.json({ token })
}
