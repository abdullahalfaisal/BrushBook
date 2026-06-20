"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { LockKeyhole, AlertCircle, Paintbrush } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: form.get("password"),
      }),
    })

    if (res.ok) {
      const data = await res.json()
      sessionStorage.setItem("admin_token", data.token)
      router.replace("/admin/dashboard")
    } else {
      setError("Invalid password")
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cream via-white to-cream px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-lg border border-stone-200/60 bg-white p-8 shadow-sm">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-cream">
              <Paintbrush className="h-6 w-6 text-brass" />
            </div>
            <h1 className="mt-4 text-xl font-bold tracking-tight text-brand-dark">Admin Login</h1>
            <p className="mt-1 text-sm text-stone-500">Enter your password to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}
            <div>
              <label htmlFor="password" className="flex items-center gap-1.5 text-sm font-medium text-stone-700">
                <LockKeyhole className="h-3.5 w-3.5 text-stone-400" /> Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1.5 block w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm transition focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brass px-4 py-2.5 text-sm font-medium text-brand-dark transition hover:bg-white disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
