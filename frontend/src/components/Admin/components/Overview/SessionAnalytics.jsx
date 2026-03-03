import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Smartphone, Clock } from 'lucide-react';

const SessionAnalytics = ({ data }) => {
    return (
        <div className="glass-panel bg-black/40 border border-white/5 rounded-lg flex flex-col xl:flex-row overflow-hidden shadow-2xl relative">
            {/* Device Analytics (Pie Chart) */}
            <div className="flex-1 border-b xl:border-b-0 xl:border-r border-white/5 flex flex-col">
                <div className="p-4 border-b border-white/5 bg-black/60 flex items-center gap-3 shrink-0">
                    <Smartphone className="text-pink-500" size={20} />
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-widest uppercase">Endpoint Signatures</h2>
                        <p className="text-[10px] text-gray-500 font-mono tracking-widest">Device Profiling Metrics</p>
                    </div>
                </div>
                <div className="flex-1 p-4 flex flex-col sm:flex-row items-center justify-center gap-6">
                    <div className="w-full h-64 sm:h-full sm:min-h-[200px] sm:w-1/2">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <PieChart>
                                <Pie
                                    data={data.devices}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.devices.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #333', borderRadius: '4px', color: '#fff' }}
                                    itemStyle={{ fontFamily: 'monospace', fontSize: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-full sm:w-1/2 flex flex-col gap-3 justify-center pt-2 pb-4 sm:py-0">
                        {data.devices.map(device => (
                            <div key={device.name} className="flex justify-between items-center text-xs font-mono">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: device.fill }}></div>
                                    <span className="text-gray-400">{device.name}</span>
                                </div>
                                <span className="text-white font-bold">{device.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Session Duration (Bar Chart) */}
            <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-white/5 bg-black/60 flex items-center gap-3 shrink-0">
                    <Clock className="text-indigo-500" size={20} />
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-widest uppercase">Session Viability</h2>
                        <p className="text-[10px] text-gray-500 font-mono tracking-widest">Duration Distribution</p>
                    </div>
                </div>
                <div className="flex-1 p-4 text-xs font-mono h-[250px] sm:h-auto sm:min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <BarChart data={data.duration} margin={{ top: 10, right: 30, left: -5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="range" stroke="#666" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #333', borderRadius: '4px', color: '#fff' }}
                            />
                            <Bar dataKey="users" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SessionAnalytics;
