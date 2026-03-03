"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { ShoppingCart, User, Menu, X, LogOut, Heart, LayoutDashboard, Package } from "lucide-react"

interface NavbarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { user, cart, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const navItems = user?.role === "admin"
    ? [
        { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "admin-users", label: "Users", icon: User },
        { id: "admin-monitoring", label: "Monitoring", icon: Package },
      ]
    : [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "products", label: "Products", icon: Package },
        { id: "cart", label: "Cart", icon: ShoppingCart },
      ]

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <button
          onClick={() => onNavigate(user?.role === "admin" ? "admin-dashboard" : "dashboard")}
          className="flex items-center gap-2"
        >
          <Heart className="h-7 w-7 text-[hsl(46,97%,65%)]" fill="currentColor" />
          <span className="text-xl font-bold tracking-tight">HealthCart</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                currentPage === item.id
                  ? "bg-primary-foreground/20"
                  : "hover:bg-primary-foreground/10"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.id === "cart" && cartCount > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(46,97%,65%)] text-xs font-bold text-foreground">
                  {cartCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-2 rounded-lg bg-primary-foreground/10 px-3 py-1.5">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">{user?.name}</span>
            <span className="rounded bg-[hsl(46,97%,65%)] px-1.5 py-0.5 text-xs font-bold text-foreground">
              {user?.role === "admin" ? "ADMIN" : "USER"}
            </span>
          </div>
          <button
            onClick={() => { logout(); onNavigate("login"); }}
            className="flex items-center gap-1.5 rounded-lg bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-primary-foreground/20 px-4 pb-4 pt-2 md:hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                currentPage === item.id ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.id === "cart" && cartCount > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(46,97%,65%)] text-xs font-bold text-foreground">
                  {cartCount}
                </span>
              )}
            </button>
          ))}
          <div className="mt-2 border-t border-primary-foreground/20 pt-2">
            <div className="flex items-center gap-2 px-3 py-2">
              <User className="h-4 w-4" />
              <span className="text-sm">{user?.name}</span>
              <span className="rounded bg-[hsl(46,97%,65%)] px-1.5 py-0.5 text-xs font-bold text-foreground">
                {user?.role === "admin" ? "ADMIN" : "USER"}
              </span>
            </div>
            <button
              onClick={() => { logout(); onNavigate("login"); setMobileOpen(false); }}
              className="mt-1 flex w-full items-center gap-2 rounded-lg bg-destructive px-3 py-2.5 text-sm font-medium text-destructive-foreground"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
