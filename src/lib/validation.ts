const MAX_LENGTHS = {
  customer_name: 100,
  customer_email: 254,
  customer_phone: 20,
  address: 200,
  city: 100,
  postal_code: 10,
  message: 2000,
  preferred_date: 10,
  preferred_time: 10,
  name: 100,
  description: 2000,
  price_range: 50,
  estimated_hours: 20,
  content: 5000,
  label: 200,
} as const

export function sanitizeInput(value: unknown): string {
  if (typeof value !== "string") return ""
  return value.replace(/[\r\n\t]/g, " ").trim()
}

export function validateLengths(
  fields: Record<string, unknown>
): { valid: boolean; error?: string } {
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value !== "string") continue
    const max = MAX_LENGTHS[key as keyof typeof MAX_LENGTHS]
    if (max && value.length > max) {
      return { valid: false, error: `${key} must be ${max} characters or fewer` }
    }
  }
  return { valid: true }
}
