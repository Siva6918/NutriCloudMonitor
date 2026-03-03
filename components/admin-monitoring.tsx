"use client"

import { useAuth } from "@/lib/auth-context"
import {
  Activity, AlertTriangle, Shield, Clock,
  LogIn, Calculator, ShoppingCart, UserPlus, LogOut, Package, Eye
} from "lucide-react"

export function AdminMonitoring() {
  const { activityLogs } = useAuth()

  const detectAnomalies = () => {
    const anomalies: { type: string; severity: "low" | "medium" | "high"; description: string; timestamp: string }[] = []
    const loginLogs = activityLogs.filter((l) => l.action === "LOGIN")
    const userLoginCounts = new Map<string, number>()
    loginLogs.forEach((log) => {
      const count = (userLoginCounts.get(log.userId) || 0) + 1
      userLoginCounts.set(log.userId, count)
      if (count >= 3) {
        anomalies.push({
          type: "Rapid Login Attempts",
          severity: "high",
          description: `User ${log.userName} has ${count} login events. Possible credential testing.`,
          timestamp: log.timestamp,
        })
      }
    })
    const checkoutLogs = activityLogs.filter((l) => l.action === "CHECKOUT")
    if (checkoutLogs.length >= 3) {
      anomalies.push({
        type: "Rapid Checkout Activity",
        severity: "medium",
        description: `${checkoutLogs.length} checkout events detected. Possible automated purchasing.`,
        timestamp: checkoutLogs[0]?.timestamp || new Date().toISOString(),
      })
    }
    const viewLogs = activityLogs.filter((l) => l.action === "VIEW_PRODUCT")
    if (viewLogs.length >= 10) {
      anomalies.push({
        type: "Bot-like Browsing",
        severity: "medium",
        description: `${viewLogs.length} product views in short period. Possible scraping bot.`,
        timestamp: viewLogs[0]?.timestamp || new Date().toISOString(),
      })
    }
    return anomalies
  }

  const anomalies = detectAnomalies()

  const getActionIcon = (action: string) => {
    switch (action) {
      case "LOGIN": return LogIn
      case "SIGNUP": return UserPlus
      case "LOGOUT": return LogOut
      case "BMI_CALC": return Calculator
      case "ADD_TO_CART": return ShoppingCart
      case "CHECKOUT": return Package
      case "VIEW_PRODUCT": return Eye
      default: return Activity
    }
  }

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

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "high": return { bg: "border-red-500/30 bg-red-500/5", badge: "bg-red-500/20 text-red-400", dot: "bg-red-500" }
      case "medium": return { bg: "border-orange-500/30 bg-orange-500/5", badge: "bg-orange-500/20 text-orange-400", dot: "bg-orange-500" }
      case "low": return { bg: "border-amber-500/30 bg-amber-500/5", badge: "bg-amber-500/20 text-amber-400", dot: "bg-amber-500" }
      default: return { bg: "border-slate-700 bg-slate-800/50", badge: "bg-slate-700 text-slate-400", dot: "bg-slate-500" }
    }
  }

  const actionStats = activityLogs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Behavior Monitoring</h1>
        <p className="text-sm text-slate-400">Real-time user activity tracking and anomaly detection engine.</p>
      </div>

      {/* Action stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {Object.entries(actionStats).map(([action, count]) => {
          const Icon = getActionIcon(action)
          return (
            <div key={action} className="rounded-lg border border-slate-800 bg-slate-900 p-3 text-center">
              <div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${getActionColor(action)}`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-lg font-bold text-white">{count}</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{action.replace("_", " ")}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Anomaly Alerts */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <h2 className="text-base font-semibold text-white">Anomaly Alerts</h2>
            </div>
            {anomalies.length > 0 && (
              <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 px-2 text-[10px] font-bold text-white">
                {anomalies.length}
              </span>
            )}
          </div>

          {anomalies.length > 0 ? (
            <div className="space-y-3">
              {anomalies.map((anomaly, i) => {
                const style = getSeverityStyle(anomaly.severity)
                return (
                  <div key={i} className={`rounded-lg border p-4 ${style.bg}`}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${style.dot} animate-pulse`} />
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.badge}`}>
                          {anomaly.severity}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(anomaly.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white">{anomaly.type}</p>
                    <p className="mt-1 text-xs text-slate-400">{anomaly.description}</p>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                <Shield className="h-7 w-7 text-emerald-400" />
              </div>
              <p className="font-medium text-white">All Systems Clear</p>
              <p className="mt-1 text-xs text-slate-500">No suspicious activity detected.</p>
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-white">Live Activity Feed</h2>
            </div>
            <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-medium text-slate-400">
              {activityLogs.length} events
            </span>
          </div>

          {activityLogs.length > 0 ? (
            <div className="max-h-[520px] space-y-1 overflow-y-auto pr-1">
              {activityLogs.map((log) => {
                const Icon = getActionIcon(log.action)
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-800/50"
                  >
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getActionColor(log.action)}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm text-slate-300">
                        <span className="font-medium text-white">{log.userName}</span>{" "}
                        {log.details}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-600">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className={`mt-0.5 shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getActionColor(log.action)}`}>
                      {log.action.replace("_", " ")}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center py-14 text-center">
              <Activity className="mb-3 h-10 w-10 text-slate-700" />
              <p className="text-sm text-slate-500">No activity logged yet.</p>
              <p className="mt-1 text-xs text-slate-600">User actions will appear here in real time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
