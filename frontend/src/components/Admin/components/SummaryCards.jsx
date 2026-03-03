import React from 'react';
import { Users, Activity, ShieldAlert, Zap, Target } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const SummaryCards = ({ kpi }) => {
    // If we're not using mock data yet, provide defaults
    if (!kpi) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-2 shrink-0">
            <StatCard
                title="TOTAL ACTIVE USERS"
                data={kpi.totalActiveUsers}
                icon={<Users size={20} className="text-blue-400" />}
                color="#3b82f6"
            />
            <StatCard
                title="SESSIONS (24H)"
                data={kpi.totalSessionsToday}
                icon={<Activity size={20} className="text-indigo-400" />}
                color="#818cf8"
            />
            <StatCard
                title="LOGIN FAILURES"
                data={kpi.failedLoginAttempts}
                icon={<ShieldAlert size={20} className="text-red-400" />}
                color="#ef4444"
            />
            <StatCard
                title="ANOMALIES (24H)"
                data={kpi.detectedAnomalies}
                icon={<Zap size={20} className="text-orange-400" />}
                color="#f97316"
            />
            <StatCard
                title="AVG RISK SCORE"
                data={kpi.averageRiskScore}
                icon={<Target size={20} className="text-cyan-400" />}
                color="#00E5FF"
                suffix="/100"
            />
        </div>
    );
};

const StatCard = ({ title, data, icon, color, suffix = '' }) => {
    // Format trend data for recharts
    const chartData = data.trend.map((val, i) => ({ value: val, index: i }));
    const trendDiff = data.trend[data.trend.length - 1] - data.trend[0];
    const isUp = trendDiff >= 0;

    return (
        <div className="glass-panel bg-black/40 border border-white/5 rounded-lg p-4 flex flex-col justify-between transition-colors hover:bg-white/5 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" style={{ backgroundColor: color }}></div>

            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-500 text-[9px] md:text-[10px] font-mono tracking-widest uppercase">{title}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                        <p className="text-xl md:text-2xl font-black text-white tracking-tighter">{data.current.toLocaleString()}</p>
                        {suffix && <span className="text-gray-500 text-xs font-mono">{suffix}</span>}
                    </div>
                </div>
                <div className="p-2 bg-black/50 rounded border border-white/5" style={{ boxShadow: `0 0 10px ${color}20` }}>
                    {icon}
                </div>
            </div>

            <div className="h-10 w-full mt-auto flex items-end gap-2">
                <div className="w-2/3 h-full">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <LineChart data={chartData}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={color}
                                strokeWidth={2}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-1/3 text-right">
                    <span className={`text-[10px] font-mono font-bold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                        {isUp ? '+' : ''}{trendDiff}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SummaryCards;
