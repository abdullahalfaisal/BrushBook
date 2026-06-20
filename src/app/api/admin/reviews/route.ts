import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"
import { checkAdmin } from "@/lib/auth"

export async function GET(req: Request) {
  const authError = checkAdmin(req)
  if (authError) return authError

  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const authError = checkAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const { customer_name, customer_title, rating, content, avatar_url, is_visible } = body

    if (!customer_name || !rating || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = getAdminSupabase()
    const { data, error } = await supabase
      .from("reviews")
      .insert({ customer_name, customer_title, rating, content, avatar_url: avatar_url || null, is_visible: is_visible ?? true })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const authError = checkAdmin(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const { id, customer_name, customer_title, rating, content, avatar_url, is_visible } = body

    if (!id) {
      return NextResponse.json({ error: "Missing review id" }, { status: 400 })
    }

    const supabase = getAdminSupabase()
    const { data, error } = await supabase
      .from("reviews")
      .update({ customer_name, customer_title, rating, content, avatar_url: avatar_url || null, is_visible })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const authError = checkAdmin(req)
  if (authError) return authError

  try {
    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: "Missing review id" }, { status: 400 })
    }

    const supabase = getAdminSupabase()
    await supabase.from("reviews").delete().eq("id", id)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}
