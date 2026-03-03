'use client'

import { Settings, Bell, Save } from 'lucide-react'
import { useState } from 'react'

export function AdminSettings() {
  const [settings, setSettings] = useState({
    maxLoginAttempts: 5,
    riskScoreThreshold: 10,
    accountAgeThreshold: 7,
    emailWarnings: true,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Monitoring Settings</h1>
        <p className="text-sm text-slate-400">Configure system parameters and thresholds</p>
      </div>

      {/* Configuration Panel */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Max Login Attempts</label>
          <input
            type="number"
            value={settings.maxLoginAttempts}
            onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value)})}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-slate-500 mt-1">Failed attempts before account lockdown</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Risk Score Threshold</label>
          <input
            type="number"
            value={settings.riskScoreThreshold}
            onChange={(e) => setSettings({...settings, riskScoreThreshold: parseInt(e.target.value)})}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-slate-500 mt-1">Score above this triggers alerts</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Account Age Threshold (days)</label>
          <input
            type="number"
            value={settings.accountAgeThreshold}
            onChange={(e) => setSettings({...settings, accountAgeThreshold: parseInt(e.target.value)})}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-slate-500 mt-1">New accounts under this age get closer monitoring</p>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
          <input
            type="checkbox"
            checked={settings.emailWarnings}
            onChange={(e) => setSettings({...settings, emailWarnings: e.target.checked})}
            className="w-4 h-4 rounded"
          />
          <div>
            <p className="text-sm font-medium text-slate-300">Enable Email Warnings</p>
            <p className="text-xs text-slate-500">Send alerts to admin on suspicious activity</p>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition">
          <Save className="h-4 w-4" />
          Save Settings
        </button>
      </div>

      {/* Export Logs */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="font-semibold text-white mb-4">Export & Logs</h3>
        <button className="w-full px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition">
          Export Logs (CSV)
        </button>
      </div>
    </div>
  )
}
