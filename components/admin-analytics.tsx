'use client'

import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react'

export function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
        <p className="text-sm text-slate-400">Data-driven insights and performance metrics</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Most Viewed', value: 'Green Tea Extract', change: '+45%' },
          { label: 'Top Category', value: 'Supplements', change: '+23%' },
          { label: 'Avg Session', value: '12m 34s', change: '+5%' },
          { label: 'Peak Hours', value: '6-8 PM', change: 'Daily' },
        ].map((metric, idx) => (
          <div key={idx} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-slate-400 uppercase">{metric.label}</p>
            <p className="text-xl font-bold text-slate-200 mt-2">{metric.value}</p>
            <p className="text-xs text-green-400 mt-1">{metric.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-400" />
            BMI Distribution
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Normal (18.5-24.9)', value: 523, color: 'bg-green-500' },
              { label: 'Overweight (25-29.9)', value: 412, color: 'bg-yellow-500' },
              { label: 'Underweight (<18.5)', value: 213, color: 'bg-blue-500' },
              { label: 'Obese (30+)', value: 100, color: 'bg-red-500' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`${item.color} w-3 h-3 rounded-full`}></div>
                <span className="flex-1 text-slate-300">{item.label}</span>
                <span className="font-bold text-slate-200">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            New vs Returning Users
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-300 mb-2">New Users This Month</p>
              <div className="flex items-end gap-1">
                {[45, 52, 38, 65, 42, 58, 71].map((val, i) => (
                  <div key={i} className="flex-1 bg-indigo-500 rounded-t" style={{height: `${(val/71)*100}px`}}></div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-300 mb-2">Returning Users This Month</p>
              <div className="flex items-end gap-1">
                {[32, 41, 29, 52, 38, 45, 58].map((val, i) => (
                  <div key={i} className="flex-1 bg-emerald-500 rounded-t" style={{height: `${(val/58)*100}px`}}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
