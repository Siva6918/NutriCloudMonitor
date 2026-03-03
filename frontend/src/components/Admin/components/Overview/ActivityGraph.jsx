import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const ActivityGraph = ({ data }) => {
    return (
        <div className="glass-panel bg-black/40 border border-white/5 rounded-lg flex flex-col h-full overflow-hidden shadow-2xl relative">
            <div className="p-4 border-b border-white/5 bg-black/60 flex items-center gap-3 shrink-0">
                <Activity className="text-blue-500" size={20} />
                <div>
                    <h2 className="text-sm font-bold text-white tracking-widest uppercase">Real-Time Activity Monitor</h2>
                    <p className="text-[10px] text-gray-500 font-mono tracking-widest">Authentication & Systems Over Time</p>
                </div>
            </div>

            <div className="flex-1 p-4 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <LineChart data={data} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#666"
                            tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }}
                            tickMargin={10}
                        />
                        <YAxis
                            stroke="#666"
                            tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #333', borderRadius: '4px', color: '#fff' }}
                            itemStyle={{ fontFamily: 'monospace', fontSize: '12px' }}
                            labelStyle={{ color: '#aaa', marginBottom: '5px' }}
                        />
                        <Line type="monotone" name="Success Logins" dataKey="successfulLogins" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                        <Line type="stepAfter" name="Failed Logins" dataKey="failedLogins" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#ef4444' }} />
                        <Line type="monotone" name="Checkouts" dataKey="checkouts" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ActivityGraph;
