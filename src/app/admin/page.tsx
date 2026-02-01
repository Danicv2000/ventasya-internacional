import { AdminDashboard } from "@/src/features/admin/admin-dashboard"
import { ProtectedRoute } from "@/src/features/auth/protected-route"

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  )
}
