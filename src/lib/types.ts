export interface Service {
  id: string
  name: string
  description: string
  price_range: string
  estimated_hours: string
  image_url: string | null
  is_active: boolean
  created_at: string
}

export interface Booking {
  id: string
  service_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  address: string
  city: string
  postal_code: string
  preferred_date: string
  preferred_time: string
  message: string | null
  status: "pending" | "confirmed" | "completed" | "cancelled"
  created_at: string
  services?: Service
}

export type BookingStatus = Booking["status"]

export interface Review {
  id: string
  customer_name: string
  customer_title: string | null
  rating: number
  content: string
  avatar_url: string | null
  is_visible: boolean
  created_at: string
}

export interface GalleryItem {
  id: string
  image_url: string
  label: string
  sort_order: number
  is_visible: boolean
  created_at: string
}
