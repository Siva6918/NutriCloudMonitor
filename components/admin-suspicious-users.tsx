"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  AlertTriangle, Mail, Ban, PauseCircle, Check, X,
  AlertCircle, Clock, Shield, Zap
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function AdminSuspiciousUsers() {
  const {
    users,
    getSuspiciousUsers,
    blockUser,
    unblockUser,
    suspendUser,
    unsuspendUser,
    sendEmailToUser,
  } = useAuth()

  const suspiciousUsers = getSuspiciousUsers()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [suspendReason, setSuspendReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [emailTemplate, setEmailTemplate] = useState("warning")
  const [emailMessage, setEmailMessage] = useState("")

  const getRiskScoreColor = (score: number | undefined) => {
    if (!score) return "bg-slate-500/20 text-slate-400"
    if (score >= 8) return "bg-red-500/20 text-red-400"
    if (score >= 6) return "bg-orange-500/20 text-orange-400"
    if (score >= 3) return "bg-yellow-500/20 text-yellow-400"
    return "bg-emerald-500/20 text-emerald-400"
  }

  const getRiskScoreBadge = (score: number | undefined) => {
    if (!score) return { label: "Low", color: "bg-emerald-500/20 text-emerald-400" }
    if (score >= 8) return { label: "Critical", color: "bg-red-500/20 text-red-400" }
    if (score >= 6) return { label: "High", color: "bg-orange-500/20 text-orange-400" }
    if (score >= 3) return { label: "Medium", color: "bg-yellow-500/20 text-yellow-400" }
    return { label: "Low", color: "bg-emerald-500/20 text-emerald-400" }
  }

  const suspensionReasons = [
    "Suspicious activity",
    "Unusual pattern",
    "Payment issue",
    "Fraud indicator",
    "Policy violation",
  ]

  const emailTemplates = {
    warning: {
      subject: "Security Alert - Unusual Activity Detected",
      message: "We've detected unusual activity on your account. Please verify it was you. If not, change your password immediately.",
    },
    status: {
      subject: "Account Status Notice",
      message: "Your account status has been updated due to security concerns. Please review your account activity.",
    },
    action: {
      subject: "Action Required - Account Verification",
      message: "For your account security, please verify your identity by clicking the link below and confirming recent activity.",
    },
  }

  const handleSuspend = (userId: string, reason: string) => {
    const finalReason = reason === "custom" ? customReason : reason
    suspendUser(userId, finalReason)
    setSelectedUserId(null)
    setSuspendReason("")
    setCustomReason("")
  }

  const handleSendEmail = (userId: string) => {
    const template = emailTemplates[emailTemplate as keyof typeof emailTemplates]
    const finalMessage = emailMessage || template.message
    sendEmailToUser(userId, template.subject, finalMessage)
    setSelectedUserId(null)
    setEmailMessage("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Suspicious Users Management</h1>
        <p className="text-sm text-slate-400">
          Monitor and manage users with high risk scores or suspicious activities
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Suspicious</p>
              <p className="mt-2 text-2xl font-bold text-white">{suspiciousUsers.length}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/20">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Suspended</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {suspiciousUsers.filter((u) => u.suspended).length}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/20">
              <PauseCircle className="h-5 w-5 text-orange-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Blocked</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {suspiciousUsers.filter((u) => u.blocked).length}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600/20">
              <Ban className="h-5 w-5 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-white">
          <AlertCircle className="h-5 w-5 text-amber-400" />
          Suspicious Users List
        </h2>

        {suspiciousUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-3 text-left font-medium text-slate-300">User</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Risk Score</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Last Flagged</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suspiciousUsers.map((user) => {
                  const riskBadge = getRiskScoreBadge(user.riskScore)
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-slate-800 transition-colors hover:bg-slate-800/50"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${riskBadge.color}`}>
                          {user.riskScore || 0} - {riskBadge.label}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {user.blocked && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-600/20 px-2.5 py-0.5 text-xs font-medium text-red-400">
                              <Ban className="h-3 w-3" />
                              Blocked
                            </span>
                          )}
                          {user.suspended && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/20 px-2.5 py-0.5 text-xs font-medium text-orange-400">
                              <PauseCircle className="h-3 w-3" />
                              Suspended
                            </span>
                          )}
                          {!user.blocked && !user.suspended && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                              <Check className="h-3 w-3" />
                              Active
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {user.lastFlaggedAt
                          ? new Date(user.lastFlaggedAt).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* Suspend Dialog */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500/20 px-2.5 py-1.5 text-xs font-medium text-orange-400 transition-colors hover:bg-orange-500/30">
                                <Clock className="h-3.5 w-3.5" />
                                Suspend
                              </button>
                            </DialogTrigger>
                            <DialogContent className="border-slate-700 bg-slate-900">
                              <DialogHeader>
                                <DialogTitle className="text-white">Suspend User</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                  Suspend {user.name}'s account and optionally send them a notification.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Suspension Reason
                                  </label>
                                  <select
                                    value={suspendReason}
                                    onChange={(e) => setSuspendReason(e.target.value)}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  >
                                    <option value="">Select a reason...</option>
                                    {suspensionReasons.map((reason) => (
                                      <option key={reason} value={reason}>
                                        {reason}
                                      </option>
                                    ))}
                                    <option value="custom">Custom reason...</option>
                                  </select>
                                </div>
                                {suspendReason === "custom" && (
                                  <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-300">
                                      Custom Reason
                                    </label>
                                    <textarea
                                      value={customReason}
                                      onChange={(e) => setCustomReason(e.target.value)}
                                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                      placeholder="Enter custom suspension reason..."
                                      rows={3}
                                    />
                                  </div>
                                )}
                                <div className="flex gap-3">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        onClick={() => handleSuspend(user.id, suspendReason)}
                                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                                      >
                                        <Clock className="mr-2 h-4 w-4" />
                                        Suspend Account
                                      </Button>
                                    </DialogTrigger>
                                  </Dialog>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* Email Dialog */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/20 px-2.5 py-1.5 text-xs font-medium text-blue-400 transition-colors hover:bg-blue-500/30">
                                <Mail className="h-3.5 w-3.5" />
                                Email
                              </button>
                            </DialogTrigger>
                            <DialogContent className="border-slate-700 bg-slate-900">
                              <DialogHeader>
                                <DialogTitle className="text-white">Send Email</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                  Send a security notification email to {user.name}.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Email Template
                                  </label>
                                  <select
                                    value={emailTemplate}
                                    onChange={(e) => setEmailTemplate(e.target.value)}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  >
                                    <option value="warning">Security Alert</option>
                                    <option value="status">Account Status</option>
                                    <option value="action">Action Required</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Subject
                                  </label>
                                  <input
                                    type="text"
                                    value={emailTemplates[emailTemplate as keyof typeof emailTemplates].subject}
                                    disabled
                                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-400 disabled:opacity-70"
                                  />
                                </div>
                                <div>
                                  <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Message
                                  </label>
                                  <textarea
                                    value={emailMessage || emailTemplates[emailTemplate as keyof typeof emailTemplates].message}
                                    onChange={(e) => setEmailMessage(e.target.value)}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    rows={4}
                                  />
                                </div>
                                <Button
                                  onClick={() => handleSendEmail(user.id)}
                                  className="w-full bg-blue-600 hover:bg-blue-700"
                                >
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Email
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* Block/Unblock Button */}
                          {!user.blocked ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <button className="inline-flex items-center gap-1.5 rounded-lg bg-red-600/20 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-600/30">
                                  <Ban className="h-3.5 w-3.5" />
                                  Block
                                </button>
                              </DialogTrigger>
                              <DialogContent className="border-slate-700 bg-slate-900">
                                <DialogHeader>
                                  <DialogTitle className="text-white">Block User</DialogTitle>
                                  <DialogDescription className="text-slate-400">
                                    This will prevent {user.name} from accessing their account.
                                  </DialogDescription>
                                </DialogHeader>
                                <Button
                                  onClick={() => {
                                    blockUser(user.id)
                                    setSelectedUserId(null)
                                  }}
                                  className="w-full bg-red-600 hover:bg-red-700"
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  Confirm Block
                                </Button>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <button
                              onClick={() => unblockUser(user.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-2.5 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/30"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Unblock
                            </button>
                          )}

                          {/* Unsuspend Button */}
                          {user.suspended && (
                            <button
                              onClick={() => unsuspendUser(user.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-2.5 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/30"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Unsuspend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <Shield className="mx-auto mb-3 h-12 w-12 text-emerald-500/50" />
            <p className="text-sm text-slate-400">No suspicious users detected</p>
            <p className="text-xs text-slate-500">Great job maintaining platform security!</p>
          </div>
        )}
      </div>
    </div>
  )
}
