import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"
import { checkAdmin } from "@/lib/auth"

export async function GET(req: Request) {
  const authError = checkAdmin(req)
  if (authError) return authError

  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("sort_order")

  if (error) {
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const authError = checkAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const { image_url, label, sort_order, is_visible } = body

    if (!image_url || !label) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = getAdminSupabase()
    const { data, error } = await supabase
      .from("gallery")
      .insert({ image_url, label, sort_order: sort_order || 0, is_visible: is_visible ?? true })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const authError = checkAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const { id, image_url, label, sort_order, is_visible } = body

    if (!id) {
      return NextResponse.json({ error: "Missing gallery item id" }, { status: 400 })
    }

    const supabase = getAdminSupabase()
    const { data, error } = await supabase
      .from("gallery")
      .update({ image_url, label, sort_order, is_visible })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const authError = checkAdmin(req)
  if (authError) return authError

  try {
    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: "Missing gallery item id" }, { status: 400 })
    }

    const supabase = getAdminSupabase()
    await supabase.from("gallery").delete().eq("id", id)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 })
  }
}
