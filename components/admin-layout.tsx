"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  LayoutDashboard, Users, Activity, LogOut, ChevronLeft,
  ChevronRight, Shield, Bell, Search, AlertCircle
} from "lucide-react"

interface AdminLayoutProps {
  currentPage: string
  onNavigate: (page: string) => void
  children: React.ReactNode
}

const sidebarItems = [
  { id: "admin-dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "admin-users", label: "Users", icon: Users },
  { id: "admin-suspicious-users", label: "Suspicious Users", icon: AlertCircle },
  { id: "admin-monitoring", label: "Monitoring", icon: Activity },
]

export function AdminLayout({ currentPage, onNavigate, children }: AdminLayoutProps) {
  const { user, logout, getSuspiciousUsers } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const suspiciousUsersCount = getSuspiciousUsers().length

  const anomalyCount = (() => {
    // Keep existing logic but add suspicious users to count
    return suspiciousUsersCount
  })()

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex shrink-0 flex-col border-r border-slate-700/50 bg-slate-900 text-slate-300 transition-all duration-300 ${
          collapsed ? "w-[68px]" : "w-60"
        }`}
      >
        {/* Logo area */}
        <div className="flex h-16 items-center gap-2.5 border-b border-slate-700/50 px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Shield className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="truncate text-sm font-bold text-white">HealthCart</p>
              <p className="truncate text-[10px] uppercase tracking-wider text-slate-500">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarItems.map((item) => {
            const isActive = currentPage === item.id
            const badgeCount = item.id === "admin-suspicious-users" ? suspiciousUsersCount : 0
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : undefined}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-white"}`} />
                {!collapsed && <span>{item.label}</span>}
                {badgeCount > 0 && (
                  <span className={`${collapsed ? "absolute left-11 top-1" : "ml-auto"} flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white`}>
                    {badgeCount}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Collapse button */}
        <div className="border-t border-slate-700/50 px-3 py-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /><span>Collapse</span></>}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-slate-950">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search users, logs..."
                className="h-9 w-64 rounded-lg border border-slate-700 bg-slate-800 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Alerts bell */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 transition-colors hover:text-white">
              <Bell className="h-4 w-4" />
              {anomalyCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {anomalyCount}
                </span>
              )}
            </button>

            {/* Admin badge */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-medium text-white">{user?.name}</p>
                <p className="text-[10px] text-slate-500">Administrator</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => { logout(); onNavigate("login") }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
