import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"
import { checkAdmin } from "@/lib/auth"

export async function GET(req: Request) {
  const authError = checkAdmin(req)
  if (authError) return authError

  const adminSupabase = getAdminSupabase()
  const { data, error } = await adminSupabase
    .from("services")
    .select("*")
    .order("name")

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const authError = checkAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const { name, description, price_range, estimated_hours, image_url, is_active } = body

    if (!name || !description || !price_range || !estimated_hours) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const adminSupabase = getAdminSupabase()
    const { data, error } = await adminSupabase
      .from("services")
      .insert({
        name,
        description,
        price_range,
        estimated_hours,
        image_url: image_url || null,
        is_active: is_active ?? true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  const authError = checkAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const { id, name, description, price_range, estimated_hours, image_url, is_active } = body

    if (!id) {
      return NextResponse.json({ error: "Missing service id" }, { status: 400 })
    }

    const adminSupabase = getAdminSupabase()
    const { data, error } = await adminSupabase
      .from("services")
      .update({
        name,
        description,
        price_range,
        estimated_hours,
        image_url: image_url || null,
        is_active,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    )
  }
}
