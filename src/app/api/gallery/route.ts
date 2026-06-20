import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET() {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order")

  if (error) {
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 })
  }

  return NextResponse.json(data)
}
