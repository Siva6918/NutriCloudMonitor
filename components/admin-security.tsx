'use client'

import { Shield, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react'

export function AdminSecurity() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Security & Compliance</h1>
        <p className="text-sm text-slate-400">Manage security settings and monitoring</p>
      </div>

      {/* Blocked Users */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Lock className="h-5 w-5 text-red-400" />
          Blocked Users
        </h3>
        <div className="space-y-2">
          {['user_suspicious_001', 'user_spam_042', 'bot_scraper_089'].map((user, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
              <span className="font-mono text-slate-300">{user}</span>
              <button className="text-xs px-3 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30">Unblock</button>
            </div>
          ))}
        </div>
      </div>

      {/* Warning History */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
          Warning History
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {[
            'user_123 - Multiple failed login attempts',
            'user_456 - Rapid checkout attempts',
            'user_789 - Unusual browsing pattern',
          ].map((warning, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-sm">
              {warning}
            </div>
          ))}
        </div>
      </div>

      {/* IP Blacklist */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-indigo-400" />
          IP Blacklist
        </h3>
        <div className="space-y-2">
          {['192.168.1.100', '10.0.0.50', '172.16.0.10'].map((ip, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
              <span className="font-mono text-slate-300">{ip}</span>
              <button className="text-xs px-3 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30">Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
