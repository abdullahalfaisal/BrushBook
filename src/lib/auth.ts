import { NextResponse } from "next/server"
import crypto from "crypto"

export function checkAdmin(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!token || !adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const expected = crypto.createHash("sha256").update(adminPassword).digest("hex")
  if (token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return null
}
