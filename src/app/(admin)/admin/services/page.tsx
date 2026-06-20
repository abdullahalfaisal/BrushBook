"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Plus, Pencil, X, AlertCircle } from "lucide-react"
import type { Service } from "@/lib/types"

const emptyService = {
  name: "",
  description: "",
  price_range: "",
  estimated_hours: "",
  image_url: "",
  is_active: true,
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyService)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    const token = sessionStorage.getItem("admin_token")
    try {
      const res = await fetch("/api/admin/services", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setServices(data)
    } catch {
      setError("Failed to load services")
    } finally {
      setLoading(false)
    }
  }

  function startEdit(service: Service | null) {
    if (service) {
      setEditing(service.id)
      setForm({
        name: service.name,
        description: service.description,
        price_range: service.price_range,
        estimated_hours: service.estimated_hours,
        image_url: service.image_url || "",
        is_active: service.is_active,
      })
    } else {
      setEditing("new")
      setForm(emptyService)
    }
    setError("")
  }

  function cancelEdit() {
    setEditing(null)
    setForm(emptyService)
    setError("")
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    const token = sessionStorage.getItem("admin_token")

    const method = editing === "new" ? "POST" : "PUT"

    const res = await fetch("/api/admin/services", {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...form, id: editing !== "new" ? editing : undefined }),
    })

    if (res.ok) {
      cancelEdit()
      fetchServices()
    } else {
      const data = await res.json()
      setError(data.error || "Failed to save")
    }
    setSaving(false)
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
        <h1 className="text-2xl font-bold tracking-tight text-brand-dark">Services</h1>
        <button
          onClick={() => startEdit(null)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brass px-4 py-2 text-sm font-medium text-brand-dark transition hover:bg-white hover:text-brand-dark"
        >
          <Plus className="h-4 w-4" /> Add Service
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
            <h2 className="font-semibold text-brand-dark">{editing === "new" ? "New Service" : "Edit Service"}</h2>
            <button type="button" onClick={cancelEdit} className="text-stone-400 hover:text-stone-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="mt-1.5 block w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm transition focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={3}
              className="mt-1.5 block w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm transition focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-stone-700">Price Range</label>
              <input
                value={form.price_range}
                onChange={(e) => setForm({ ...form, price_range: e.target.value })}
                required
                placeholder="e.g. $200-$500"
                className="mt-1.5 block w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm transition focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">Est. Hours</label>
              <input
                value={form.estimated_hours}
                onChange={(e) => setForm({ ...form, estimated_hours: e.target.value })}
                required
                placeholder="e.g. 2-4 hours"
                className="mt-1.5 block w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm transition focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">Image URL</label>
              <input
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className="mt-1.5 block w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm transition focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="rounded border-stone-300 text-brass focus:ring-brass"
            />
            Active (visible on site)
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-brass px-5 py-2.5 text-sm font-medium text-brand-dark transition hover:bg-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {services.length === 0 && (
          <p className="py-12 text-center text-sm text-stone-400">No services created yet.</p>
        )}
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between rounded-lg border border-stone-200/60 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cream text-sm font-bold text-brass">
                {service.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-brand-dark">{service.name}</p>
                <p className="text-sm text-stone-500">{service.price_range}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  service.is_active
                    ? "bg-green-50 text-green-700"
                    : "bg-stone-100 text-stone-500"
                }`}
              >
                {service.is_active ? "Active" : "Inactive"}
              </span>
              <button
                onClick={() => startEdit(service)}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-stone-600 transition hover:bg-stone-100"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
