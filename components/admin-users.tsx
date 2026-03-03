"use client"

import { useAuth } from "@/lib/auth-context"
import { Users, Mail, Calendar, Scale, Search, UserCheck } from "lucide-react"
import { useState } from "react"

export function AdminUsers() {
  const { users } = useAuth()
  const usersList = users.filter((u) => u.role === "user")
  const [search, setSearch] = useState("")

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const getBmiColor = (category?: string) => {
    switch (category) {
      case "Underweight": return "bg-amber-500/15 text-amber-400 border-amber-500/20"
      case "Normal": return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
      case "Overweight": return "bg-orange-500/15 text-orange-400 border-orange-500/20"
      case "Obese": return "bg-red-500/15 text-red-400 border-red-500/20"
      default: return "bg-slate-700/30 text-slate-500 border-slate-600/20"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-sm text-slate-400">
            {filteredUsers.length} registered user{filteredUsers.length !== 1 ? "s" : ""} on the platform.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-64"
          />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Users", value: usersList.length, color: "text-indigo-400" },
          { label: "BMI Tracked", value: usersList.filter((u) => u.bmi).length, color: "text-emerald-400" },
          { label: "Normal BMI", value: usersList.filter((u) => u.bmiCategory === "Normal").length, color: "text-green-400" },
          { label: "Needs Attention", value: usersList.filter((u) => u.bmiCategory === "Overweight" || u.bmiCategory === "Obese").length, color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/40">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">User</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Email</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Weight / Height</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">BMI</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-slate-800/40">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Mail className="h-3.5 w-3.5 text-slate-600" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Scale className="h-3.5 w-3.5 text-slate-600" />
                      {user.weight ? `${user.weight}kg / ${user.height}cm` : <span className="text-slate-600">Not set</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {user.bmi ? (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-white">{user.bmi}</span>
                        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getBmiColor(user.bmiCategory)}`}>
                          {user.bmiCategory}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="h-3.5 w-3.5 text-slate-600" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border border-slate-800 bg-slate-900 py-14 text-center">
          {search ? (
            <>
              <Search className="mb-3 h-10 w-10 text-slate-600" />
              <p className="font-medium text-slate-300">No users match your search.</p>
              <p className="text-sm text-slate-500">Try a different keyword.</p>
            </>
          ) : (
            <>
              <UserCheck className="mb-3 h-10 w-10 text-slate-600" />
              <p className="font-medium text-slate-300">No users registered yet.</p>
              <p className="text-sm text-slate-500">Users will appear here once they sign up.</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
