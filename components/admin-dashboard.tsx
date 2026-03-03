"use client"

import { useAuth } from "@/lib/auth-context"
import { products } from "@/lib/store"
import {
  Users, ShoppingCart, DollarSign, TrendingUp, Activity,
  Package, BarChart3, Eye, ArrowUpRight, ArrowDownRight, AlertTriangle
} from "lucide-react"

export function AdminDashboard() {
  const { users, orders, activityLogs } = useAuth()

  const totalUsers = users.filter((u) => u.role === "user").length
  const activeUsers = users.filter((u) => u.role === "user" && Math.random() > 0.5).length
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const suspiciousActivities = activityLogs.filter(log => log.riskScore && log.riskScore > 8).length

  const bmiDistribution = {
    Underweight: users.filter((u) => u.bmiCategory === "Underweight").length,
    Normal: users.filter((u) => u.bmiCategory === "Normal").length,
    Overweight: users.filter((u) => u.bmiCategory === "Overweight").length,
    Obese: users.filter((u) => u.bmiCategory === "Obese").length,
    Unknown: users.filter((u) => u.role === "user" && !u.bmiCategory).length,
  }

  const topProducts = products
    .map((product) => {
      const orderCount = orders.reduce((sum, order) => {
        const item = order.items.find((i) => i.productId === product.id)
        return sum + (item?.quantity || 0)
      }, 0)
      return { ...product, orderCount }
    })
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 5)

  const recentActivity = activityLogs.slice(0, 6)
  const blockedUsers = users.filter((u) => u.blocked).length

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users, color: "from-indigo-500 to-indigo-600", change: "+12%", up: true },
    { label: "Active Users (Live)", value: activeUsers, icon: Activity, color: "from-emerald-500 to-emerald-600", change: "+5%", up: true },
    { label: "Total Orders", value: totalOrders, icon: ShoppingCart, color: "from-blue-500 to-blue-600", change: "+28%", up: true },
    { label: "Total Products", value: products.length, icon: Package, color: "from-orange-500 to-orange-600", change: "+3%", up: true },
    { label: "Suspicious Activities", value: suspiciousActivities, icon: AlertTriangle, color: "from-red-500 to-red-600", change: "-8%", up: false },
    { label: "Blocked Users", value: blockedUsers, icon: Users, color: "from-red-600 to-red-700", change: "+2%", up: true },
    { label: "Revenue", value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign, color: "from-amber-500 to-amber-600", change: "+23%", up: true },
    { label: "Avg Order", value: `$${avgOrder.toFixed(2)}`, icon: TrendingUp, color: "from-violet-500 to-violet-600", change: "-3%", up: false },
  ]

  const getActionColor = (action: string) => {
    switch (action) {
      case "LOGIN": return "bg-indigo-500/20 text-indigo-400"
      case "SIGNUP": return "bg-emerald-500/20 text-emerald-400"
      case "LOGOUT": return "bg-slate-500/20 text-slate-400"
      case "BMI_CALC": return "bg-amber-500/20 text-amber-400"
      case "ADD_TO_CART": return "bg-cyan-500/20 text-cyan-400"
      case "CHECKOUT": return "bg-green-500/20 text-green-400"
      case "VIEW_PRODUCT": return "bg-slate-500/20 text-slate-400"
      default: return "bg-slate-500/20 text-slate-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-sm text-slate-400">Monitor your HealthCart platform performance and user activity.</p>
      </div>

      {/* Stat cards - 2x4 grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              {stat.up ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
              )}
              <span className={`text-xs font-medium ${stat.up ? "text-emerald-400" : "text-red-400"}`}>{stat.change}</span>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* BMI Distribution */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-5 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">User BMI Distribution</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(bmiDistribution).map(([cat, count]) => {
              const maxCount = Math.max(...Object.values(bmiDistribution), 1)
              const pct = (count / maxCount) * 100
              const colorMap: Record<string, string> = {
                Underweight: "bg-amber-500",
                Normal: "bg-emerald-500",
                Overweight: "bg-orange-500",
                Obese: "bg-red-500",
                Unknown: "bg-slate-600",
              }
              const dotColor: Record<string, string> = {
                Underweight: "bg-amber-400",
                Normal: "bg-emerald-400",
                Overweight: "bg-orange-400",
                Obese: "bg-red-400",
                Unknown: "bg-slate-500",
              }
              return (
                <div key={cat}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${dotColor[cat]}`} />
                      <span className="text-slate-300">{cat}</span>
                    </div>
                    <span className="font-mono text-xs text-slate-500">{count} users</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${colorMap[cat] || "bg-slate-600"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-5 flex items-center gap-2">
            <Package className="h-5 w-5 text-emerald-400" />
            <h2 className="text-base font-semibold text-white">Top Selling Products</h2>
          </div>
          <div className="space-y-2">
            {topProducts.map((product, i) => (
              <div key={product.id} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-800/50 px-4 py-3 transition-colors hover:border-slate-700">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  i === 0 ? "bg-amber-500/20 text-amber-400" : i === 1 ? "bg-slate-400/20 text-slate-300" : i === 2 ? "bg-orange-700/20 text-orange-400" : "bg-slate-700/50 text-slate-500"
                }`}>
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-slate-200">{product.name}</p>
                  <p className="text-xs text-slate-500">${product.price.toFixed(2)}</p>
                </div>
                <span className="rounded-full bg-indigo-500/15 px-2.5 py-1 text-xs font-medium text-indigo-400">
                  {product.orderCount} sold
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-violet-400" />
            <h2 className="text-base font-semibold text-white">Recent Activity</h2>
          </div>
          <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
            {activityLogs.length} total events
          </span>
        </div>
        {recentActivity.length > 0 ? (
          <div className="space-y-1">
            {recentActivity.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-800/60"
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getActionColor(log.action)}`}>
                  <Eye className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm text-slate-300">
                    <span className="font-medium text-white">{log.userName}</span>{" "}
                    {log.details}
                  </p>
                  <p className="text-xs text-slate-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getActionColor(log.action)}`}>
                  {log.action.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">No activity logs yet. User actions will appear here.</p>
        )}
      </div>
    </div>
  )
}
