"use client"

import { useEffect, useState, type FormEvent } from "react"
import Image from "next/image"
import { Plus, Pencil, X, AlertCircle, Trash2 } from "lucide-react"
import type { GalleryItem } from "@/lib/types"

const emptyItem = {
  image_url: "",
  label: "",
  sort_order: 0,
  is_visible: true,
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyItem)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    const token = sessionStorage.getItem("admin_token")
    try {
      const res = await fetch("/api/admin/gallery", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error()
      setItems(await res.json())
    } catch {
      setError("Failed to load gallery")
    } finally {
      setLoading(false)
    }
  }

  function startEdit(item: GalleryItem | null) {
    if (item) {
      setEditing(item.id)
      setForm({
        image_url: item.image_url,
        label: item.label,
        sort_order: item.sort_order,
        is_visible: item.is_visible,
      })
    } else {
      setEditing("new")
      setForm(emptyItem)
    }
    setError("")
  }

  function cancelEdit() {
    setEditing(null)
    setForm(emptyItem)
    setError("")
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    const token = sessionStorage.getItem("admin_token")
    const method = editing === "new" ? "POST" : "PUT"
    const res = await fetch("/api/admin/gallery", {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, id: editing !== "new" ? editing : undefined }),
    })
    if (res.ok) {
      cancelEdit()
      fetchItems()
    } else {
      const data = await res.json()
      setError(data.error || "Failed to save")
    }
    setSaving(false)
  }

  async function handleDelete(item: GalleryItem) {
    if (!confirm(`Delete "${item.label}"?`)) return
    const token = sessionStorage.getItem("admin_token")
    await fetch("/api/admin/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: item.id }),
    })
    fetchItems()
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
        <h1 className="text-2xl font-bold tracking-tight text-brand-dark">Gallery</h1>
        <button onClick={() => startEdit(null)} className="inline-flex items-center gap-1.5 rounded-lg bg-brass px-4 py-2 text-sm font-medium text-brand-dark transition hover:bg-white">
          <Plus className="h-4 w-4" /> Add Image
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
            <h2 className="font-semibold text-brand-dark">{editing === "new" ? "New Image" : "Edit Image"}</h2>
            <button type="button" onClick={cancelEdit} className="text-stone-400 hover:text-stone-600"><X className="h-4 w-4" /></button>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">Image URL</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} required className="mt-1.5 block w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm transition focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-stone-700">Label</label>
              <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required className="mt-1.5 block w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm transition focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="mt-1.5 block w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm transition focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30" />
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

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-stone-400">No gallery images yet.</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-lg border border-stone-200/60 bg-white shadow-sm">
            <div className="relative aspect-[4/3] bg-stone-100">
              <Image src={item.image_url} alt={item.label} fill className="object-cover" />
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-brand-dark truncate">{item.label}</p>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${item.is_visible ? "bg-green-50 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                  {item.is_visible ? "Visible" : "Hidden"}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-stone-400">Order: {item.sort_order}</p>
            </div>
            <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
              <button onClick={() => startEdit(item)} className="rounded-lg bg-white/90 p-1.5 text-stone-600 shadow-sm backdrop-blur-sm hover:bg-white">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => handleDelete(item)} className="rounded-lg bg-white/90 p-1.5 text-red-500 shadow-sm backdrop-blur-sm hover:bg-white">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
