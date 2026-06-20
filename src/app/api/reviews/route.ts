import { getSupabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = getSupabase()
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_visible", true)
    .order("created_at", { ascending: false })

  return Response.json(data || [])
}
