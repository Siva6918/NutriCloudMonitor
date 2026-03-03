import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShieldAlert } from 'lucide-react';

const RiskDistribution = ({ data }) => {
    return (
        <div className="glass-panel bg-black/40 border border-white/5 rounded-lg flex flex-col h-full overflow-hidden shadow-2xl relative">
            <div className="p-4 border-b border-white/5 bg-black/60 flex items-center gap-3 shrink-0">
                <ShieldAlert className="text-admin-warning" size={20} />
                <div>
                    <h2 className="text-sm font-bold text-admin-warning tracking-widest uppercase">Anomaly Risk Distribution</h2>
                    <p className="text-[10px] text-gray-500 font-mono tracking-widest">Z-Score Segmented Profiling</p>
                </div>
            </div>

            <div className="flex-1 p-4 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 5 }} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={true} vertical={false} />
                        <XAxis
                            type="number"
                            stroke="#666"
                            tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            stroke="#666"
                            width={120}
                            tick={{ fill: '#888', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #333', borderRadius: '4px', color: '#fff' }}
                            itemStyle={{ fontFamily: 'monospace', fontSize: '12px' }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RiskDistribution;
