import React from 'react';
import { Users, Activity, ShieldAlert, Zap, Target } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const SummaryCards = ({ kpi }) => {
    if (!kpi) return null;

    const normalized = normalizeKpiData(kpi);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-2 shrink-0">
            <StatCard
                title="TOTAL ACTIVE USERS"
                data={normalized.totalActiveUsers}
                icon={<Users size={20} className="text-cyan-300" />}
                color="#22d3ee"
            />
            <StatCard
                title="SESSIONS (24H)"
                data={normalized.totalSessionsToday}
                icon={<Activity size={20} className="text-violet-300" />}
                color="#8b5cf6"
            />
            <StatCard
                title="LOGIN FAILURES"
                data={normalized.failedLoginAttempts}
                icon={<ShieldAlert size={20} className="text-rose-300" />}
                color="#fb7185"
            />
            <StatCard
                title="ANOMALIES (24H)"
                data={normalized.detectedAnomalies}
                icon={<Zap size={20} className="text-amber-300" />}
                color="#f59e0b"
            />
            <StatCard
                title="AVG RISK SCORE"
                data={normalized.averageRiskScore}
                icon={<Target size={20} className="text-sky-300" />}
                color="#38bdf8"
                suffix="/100"
            />
        </div>
    );
};

const normalizeMetric = (metric, fallback = 0) => {
    if (metric && typeof metric === 'object' && !Array.isArray(metric)) {
        const current = typeof metric.current === 'number' ? metric.current : fallback;
        const trend = Array.isArray(metric.trend) && metric.trend.length > 0
            ? metric.trend.map((v) => (typeof v === 'number' ? v : fallback))
            : [current, current, current, current, current];

        return { current, trend };
    }

    const current = typeof metric === 'number' ? metric : fallback;
    return {
        current,
        trend: [current, current, current, current, current]
    };
};

const normalizeKpiData = (raw) => {
    return {
        totalActiveUsers: normalizeMetric(
            raw.totalActiveUsers ?? raw.activeUsers ?? raw.totalUsers ?? 0
        ),
        totalSessionsToday: normalizeMetric(
            raw.totalSessionsToday ?? raw.sessionsToday ?? raw.totalSessions ?? 0
        ),
        failedLoginAttempts: normalizeMetric(
            raw.failedLoginAttempts ?? raw.loginFailures ?? raw.failedLogins ?? 0
        ),
        detectedAnomalies: normalizeMetric(
            raw.detectedAnomalies ?? raw.anomaliesToday ?? raw.totalAnomalies ?? 0
        ),
        averageRiskScore: normalizeMetric(
            raw.averageRiskScore ?? raw.avgRiskScore ?? raw.riskScore ?? 0
        )
    };
};

const StatCard = ({ title, data, icon, color, suffix = '' }) => {
    const trend = Array.isArray(data?.trend) && data.trend.length > 0 ? data.trend : [0, 0, 0, 0, 0];
    const currentValue = typeof data?.current === 'number' ? data.current : 0;

    const chartData = trend.map((val, i) => ({
        value: typeof val === 'number' ? val : 0,
        index: i
    }));

    const trendDiff = trend[trend.length - 1] - trend[0];
    const isUp = trendDiff >= 0;

    return (
        <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.08)] p-4 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-[rgba(255,255,255,0.11)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.24)]">
            <div
                className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-35"
                style={{ backgroundColor: color }}
            />

            <div className="relative flex items-start justify-between gap-3 mb-5">
                <div className="min-w-0">
                    <p className="text-[10px] md:text-[11px] font-semibold tracking-[0.24em] text-slate-400 uppercase">
                        {title}
                    </p>

                    <div className="mt-2 flex items-end gap-1">
                        <p className="text-2xl md:text-[1.8rem] leading-none font-black tracking-tight text-white">
                            {currentValue.toLocaleString()}
                        </p>
                        {suffix && (
                            <span className="pb-1 text-xs font-semibold text-slate-400">
                                {suffix}
                            </span>
                        )}
                    </div>
                </div>

                <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 shadow-[inset_-4px_-4px_12px_rgba(255,255,255,0.03),inset_6px_6px_12px_rgba(0,0,0,0.18)]"
                    style={{ boxShadow: `inset -4px -4px 12px rgba(255,255,255,0.03), inset 6px 6px 12px rgba(0,0,0,0.18), 0 0 18px ${color}22` }}
                >
                    {icon}
                </div>
            </div>

            <div className="relative mt-auto flex items-end gap-3">
                <div className="h-12 w-[70%] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={color}
                                strokeWidth={2.5}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex w-[30%] justify-end">
                    <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] ${
                            isUp
                                ? 'bg-emerald-500/12 text-emerald-300 border border-emerald-400/20'
                                : 'bg-rose-500/12 text-rose-300 border border-rose-400/20'
                        }`}
                    >
                        {isUp ? '+' : ''}
                        {trendDiff}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SummaryCards;
