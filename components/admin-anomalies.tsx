'use client'

import { AlertTriangle, Clock, TrendingUp, Shield } from 'lucide-react'

export function AdminAnomalies() {
  const anomalies = [
    { id: 1, user: 'user_001', type: 'Multiple Failed Logins', risk: 14, age: '3 days', action: 'Warned', time: '10:22 AM' },
    { id: 2, user: 'user_045', type: 'Rapid Checkout Attempts', risk: 11, age: '5 days', action: 'Blocked', time: '09:45 AM' },
    { id: 3, user: 'user_089', type: 'Abnormal Browsing Pattern', risk: 9, age: '12 days', action: 'Monitored', time: '08:30 AM' },
    { id: 4, user: 'user_012', type: 'Excess BMI Calculations', risk: 7, age: '8 days', action: 'Warned', time: '07:15 AM' },
    { id: 5, user: 'user_156', type: 'Bot-like Activity', risk: 16, age: '1 day', action: 'Blocked', time: 'Yesterday' },
  ]

  const getRiskColor = (risk: number) => {
    if (risk > 12) return 'text-red-400 bg-red-500/20'
    if (risk > 8) return 'text-yellow-400 bg-yellow-500/20'
    return 'text-orange-400 bg-orange-500/20'
  }

  const getActionColor = (action: string) => {
    switch(action) {
      case 'Blocked': return 'bg-red-500/20 text-red-400'
      case 'Warned': return 'bg-yellow-500/20 text-yellow-400'
      default: return 'bg-blue-500/20 text-blue-400'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Anomaly Detection & Alerts</h1>
        <p className="text-sm text-slate-400">Intelligent behavior analysis and risk scoring</p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <h2 className="text-lg font-semibold text-white">Detected Anomalies</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-4 py-3 text-left font-medium text-slate-300">User</th>
                <th className="px-4 py-3 text-left font-medium text-slate-300">Page/Action</th>
                <th className="px-4 py-3 text-left font-medium text-slate-300">Anomaly Type</th>
                <th className="px-4 py-3 text-center font-medium text-slate-300">Risk Score</th>
                <th className="px-4 py-3 text-left font-medium text-slate-300">Account Age</th>
                <th className="px-4 py-3 text-left font-medium text-slate-300">Action Taken</th>
                <th className="px-4 py-3 text-left font-medium text-slate-300">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.map(anomaly => (
                <tr key={anomaly.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                  <td className="px-4 py-3 font-mono text-slate-300">{anomaly.user}</td>
                  <td className="px-4 py-3 text-slate-300">Login/Checkout</td>
                  <td className="px-4 py-3 text-slate-300">{anomaly.type}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-xs font-semibold ${getRiskColor(anomaly.risk)}`}>
                      {anomaly.risk}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {anomaly.age}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-medium ${getActionColor(anomaly.action)}`}>
                      {anomaly.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{anomaly.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Score Logic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-400" />
            Risk Score Calculation
          </h3>
          <div className="space-y-3 text-sm">
            <p className="text-slate-300"><span className="font-medium text-slate-200">Base Score:</span> 0 points</p>
            <p className="text-slate-300"><span className="font-medium text-slate-200">Failed Logins:</span> +2 per attempt</p>
            <p className="text-slate-300"><span className="font-medium text-slate-200">Fast Browsing:</span> +3 (100+ products/min)</p>
            <p className="text-slate-300"><span className="font-medium text-slate-200">Checkout Rate:</span> +4 (5+ in 1hr)</p>
            <p className="text-slate-300"><span className="font-medium text-slate-200">Account Age:</span> -1 per week old</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-400" />
            Risk Thresholds
          </h3>
          <div className="space-y-3 text-sm">
            <p className="text-slate-300"><span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">0-5:</span> Low Risk</p>
            <p className="text-slate-300"><span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-medium">6-10:</span> Medium Risk - Warning</p>
            <p className="text-slate-300"><span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs font-medium">11-14:</span> High Risk - Manual Review</p>
            <p className="text-slate-300"><span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-medium">15+:</span> Critical - Auto Block</p>
          </div>
        </div>
      </div>
    </div>
  )
}
