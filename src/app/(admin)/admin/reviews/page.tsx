"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Plus, Pencil, X, AlertCircle, Trash2 } from "lucide-react"
import type { Review } from "@/lib/types"

const emptyReview = {
  customer_name: "",
  customer_title: "",
  rating: 5,
  content: "",
  avatar_url: "",
  is_visible: true,
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyReview)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    const token = sessionStorage.getItem("admin_token")
    try {
      const res = await fetch("/api/admin/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error()
      setReviews(await res.json())
    } catch {
      setError("Failed to load reviews")
    } finally {
      setLoading(false)
    }
  }

  function startEdit(review: Review | null) {
    if (review) {
      setEditing(review.id)
      setForm({
        customer_name: review.customer_name,
        customer_title: review.customer_title || "",
        rating: review.rating,
        content: review.content,
        avatar_url: review.avatar_url || "",
        is_visible: review.is_visible,
      })
    } else {
      setEditing("new")
      setForm(emptyReview)
    }
    setError("")
  }

  function cancelEdit() {
    setEditing(null)
    setForm(emptyReview)
    setError("")
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    const token = sessionStorage.getItem("admin_token")
    const method = editing === "new" ? "POST" : "PUT"
    const res = await fetch("/api/admin/reviews", {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, id: editing !== "new" ? editing : undefined }),
    })
    if (res.ok) {
      cancelEdit()
      fetchReviews()
    } else {
      const data = await res.json()
      setError(data.error || "Failed to save")
    }
    setSaving(false)
  }

  async function handleDelete(review: Review) {
    if (!confirm(`Delete review from ${review.customer_name}?`)) return
    const token = sessionStorage.getItem("admin_token")
    await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: review.id }),
    })
    fetchReviews()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-brass" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-brand-dark">Testimonials</h1>
        <button onClick={() => startEdit(null)} className="inline-flex items-center gap-1.5 rounded-lg bg-brass px-4 py-2 text-sm font-medium text-brand-dark transition hover:bg-white">
          <Plus className="h-4 w-4" /> Add Review
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {editing && (
        <form onSubmit={handleSave} className="mt-6 space-y-5 rounded-lg border border-stone-200/60 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-brand-dark">{editing === "new" ? "New Review" : "Edit Review"}</h2>
            <button type="button" onClick={cancelEdit} className="text-stone-400 hover:text-stone-600"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-stone-700">Customer Name</label>
              <input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} required className="mt-1.5 block w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm transition focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">Title (e.g. Homeowner)</label>
              <input value={form.customer_title} onChange={(e) => setForm({ ...form, customer_title: e.target.value })} className="mt-1.5 block w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm transition focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">Review Content</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={3} className="mt-1.5 block w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm transition focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-stone-700">Rating (1–5)</label>
              <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="mt-1.5 block w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm transition focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30">
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Star{n > 1 ? "s" : ""}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">Avatar URL</label>
              <input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} className="mt-1.5 block w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm transition focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-stone-600">
            <input type="checkbox" checked={form.is_visible} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} className="rounded border-stone-300 text-brass focus:ring-brass" />
            Visible on site
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-brass px-5 py-2.5 text-sm font-medium text-brand-dark transition hover:bg-white disabled:opacity-50">
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={cancelEdit} className="rounded-lg border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {reviews.length === 0 && (
          <p className="py-12 text-center text-sm text-stone-400">No reviews yet.</p>
        )}
        {reviews.map((review) => (
          <div key={review.id} className="flex items-center justify-between rounded-lg border border-stone-200/60 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream text-sm font-bold text-brass">
                {review.customer_name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-brand-dark">{review.customer_name}</p>
                <p className="text-xs text-stone-400">{review.customer_title || "—"}</p>
                <p className="mt-0.5 text-sm text-stone-500 line-clamp-1">{review.content}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${review.is_visible ? "bg-green-50 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                {review.is_visible ? "Visible" : "Hidden"}
              </span>
              <button onClick={() => startEdit(review)} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm text-stone-600 transition hover:bg-stone-100">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => handleDelete(review)} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm text-red-500 transition hover:bg-red-50">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
