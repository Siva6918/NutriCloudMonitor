"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthPage } from "@/components/auth-page"
import { Navbar } from "@/components/navbar"
import { UserDashboard } from "@/components/user-dashboard"
import { ProductsPage } from "@/components/products-page"
import { CartPage } from "@/components/cart-page"
import { AdminLayout } from "@/components/admin-layout"
import { AdminDashboard } from "@/components/admin-dashboard"
import { AdminUsers } from "@/components/admin-users"
import { AdminMonitoring } from "@/components/admin-monitoring"
import { AdminSuspiciousUsers } from "@/components/admin-suspicious-users"

export default function Page() {
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState("login")

  const handleAuthSuccess = (role: string) => {
    setCurrentPage(role === "admin" ? "admin-dashboard" : "dashboard")
  }

  if (!user) {
    return <AuthPage onSuccess={handleAuthSuccess} />
  }

  const isAdmin = currentPage.startsWith("admin-")

  if (isAdmin) {
    return (
      <AdminLayout currentPage={currentPage} onNavigate={setCurrentPage}>
        {currentPage === "admin-dashboard" && <AdminDashboard />}
        {currentPage === "admin-users" && <AdminUsers />}
        {currentPage === "admin-suspicious-users" && <AdminSuspiciousUsers />}
        {currentPage === "admin-monitoring" && <AdminMonitoring />}
      </AdminLayout>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>
        {currentPage === "dashboard" && <UserDashboard />}
        {currentPage === "products" && <ProductsPage />}
        {currentPage === "cart" && <CartPage onNavigate={setCurrentPage} />}
      </main>
    </div>
  )
}
