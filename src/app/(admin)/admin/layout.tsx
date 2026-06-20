import AdminLayout from "@/components/AdminLayout"

export const metadata = {
  title: "Admin - PaintBooking",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
