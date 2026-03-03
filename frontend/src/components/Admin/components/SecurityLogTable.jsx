import React, { useState, useMemo } from 'react';
import { Search, ShieldAlert, ShieldCheck, AlertTriangle, Info, Clock, Monitor, Globe } from 'lucide-react';

const SecurityLogTable = ({ activities }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [filterRisk, setFilterRisk] = useState('ALL');

    // Categorize actions and assign risks
    const getEventMeta = (action) => {
        // Upper case variants (Advanced SOC)
        switch (action) {
            case 'LOGIN_SUCCESS':
            case 'login_success':
                return { type: 'AUTH', risk: 'LOW', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: ShieldCheck };

            case 'LOGOUT':
            case 'logout':
                return { type: 'AUTH', risk: 'LOW', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Info };

            case 'LOGIN_FAILURE':
            case 'login_failed':
                return { type: 'SECURITY', risk: 'HIGH', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: ShieldAlert };

            case 'login':
                return { type: 'AUTH', risk: 'MED', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: AlertTriangle };

            case 'signup':
                return { type: 'AUTH', risk: 'LOW', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: ShieldCheck };

            // Advanced Security
            case 'MULTIPLE_FAILED_ATTEMPTS':
            case 'HIGH_RISK_SCORE':
                return { type: 'SECURITY', risk: 'HIGH', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: ShieldAlert };
            case 'NEW_DEVICE_LOGIN':
            case 'NEW_LOCATION_LOGIN':
                return { type: 'SECURITY', risk: 'MED', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: AlertTriangle };

            // Advanced Behavior
            case 'MULTIPLE_BMI_ATTEMPTS':
            case 'RAPID_REQUESTS':
            case 'UNUSUAL_TIME_LOGIN':
                return { type: 'SYSTEM', risk: 'MED', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: AlertTriangle };

            // Advanced Session
            case 'SESSION_START':
            case 'SESSION_END':
            case 'TOKEN_EXPIRED':
            case 'BMI_CALCULATED':
                return { type: 'SYSTEM', risk: 'INFO', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: Info };

            // Default Fallback
            default:
                return { type: 'SYSTEM', risk: 'INFO', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', icon: Info };
        }
    };

    const filteredLogs = useMemo(() => {
        if (!activities) return [];
        return activities.filter((log) => {
            const meta = getEventMeta(log.action);
            const matchesSearch = log.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.ipAddress?.includes(searchTerm);

            const matchesType = filterType === 'ALL' || meta.type === filterType;
            const matchesRisk = filterRisk === 'ALL' || meta.risk === filterRisk;

            return matchesSearch && matchesType && matchesRisk;
        });
    }, [activities, searchTerm, filterType, filterRisk]);

    return (
        <div className="glass-panel bg-black/40 border border-white/5 rounded-lg flex flex-col h-full overflow-hidden shadow-2xl relative">
            {/* Header & Filters */}
            <div className="p-4 border-b border-white/5 bg-black/60 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center shrink-0">
                <div className="flex items-center gap-3">
                    <ShieldAlert className="text-admin-accent" size={24} />
                    <div>
                        <h2 className="text-base font-bold text-white tracking-widest uppercase">Security Event Console</h2>
                        <p className="text-[10px] text-gray-500 font-mono tracking-widest mt-0.5">Real-time Authentication & Access Logs</p>
                    </div>
                </div>

                <div className="flex flex-wrap flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search IP, Identity..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded px-9 py-2 text-xs text-white font-mono focus:border-admin-accent focus:outline-none transition-colors"
                        />
                    </div>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-black/50 border border-white/10 rounded px-3 py-2 text-xs text-gray-300 font-mono focus:border-admin-accent outline-none cursor-pointer uppercase tracking-wider"
                    >
                        <option value="ALL">All Events</option>
                        <option value="AUTH">Authentication</option>
                        <option value="SECURITY">Security</option>
                        <option value="SYSTEM">System</option>
                    </select>

                    <select
                        value={filterRisk}
                        onChange={(e) => setFilterRisk(e.target.value)}
                        className="bg-black/50 border border-white/10 rounded px-3 py-2 text-xs text-gray-300 font-mono focus:border-admin-accent outline-none cursor-pointer uppercase tracking-wider"
                    >
                        <option value="ALL">All Risks</option>
                        <option value="HIGH">High Risk</option>
                        <option value="MED">Medium Risk</option>
                        <option value="LOW">Low Risk</option>
                        <option value="INFO">Info</option>
                    </select>
                </div>
            </div>

            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 bg-black/80 text-[10px] font-mono tracking-widest text-gray-500 uppercase shrink-0 shadow-lg z-10">
                <div className="col-span-3">Timestamp / Event</div>
                <div className="col-span-3">Identity Context</div>
                <div className="col-span-4">Network & Device</div>
                <div className="col-span-2">Risk Vector</div>
            </div>

            {/* Table Body */}
            <div className="overflow-y-auto flex-1 bg-black/20 pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {filteredLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-gray-500 group">
                        <Monitor size={48} className="mb-4 opacity-20 group-hover:opacity-50 transition-opacity" />
                        <p className="font-mono text-xs tracking-widest uppercase">No correlation events found matching criteria.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {filteredLogs.map((log) => {
                            const meta = getEventMeta(log.action);
                            const Icon = meta.icon;
                            let dateStr = 'Invalid Date';
                            let timeStr = 'Invalid Time';
                            if (log.createdAt) {
                                const d = new Date(log.createdAt);
                                dateStr = d.toLocaleDateString();
                                timeStr = d.toLocaleTimeString();
                            }

                            return (
                                <div key={log._id} className="grid grid-cols-1 md:grid-cols-12 gap-y-4 gap-x-4 px-6 py-4 hover:bg-white/[0.02] transition-colors items-center group relative">
                                    {/* Hover Highlight Element */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${meta.bg.split('/')[0].replace('bg-', 'bg-')}`}></div>

                                    {/* Event Info */}
                                    <div className="col-span-1 md:col-span-3 flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded ${meta.bg} ${meta.border} border`}>
                                                <Icon size={14} className={meta.color} />
                                            </div>
                                            <span className={`text-xs font-bold uppercase tracking-wider ${meta.color}`}>
                                                {log.action.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 font-mono text-[10px]">
                                            <Clock size={12} className="opacity-70" />
                                            {dateStr} <span className="text-gray-600">•</span> {timeStr}
                                        </div>
                                    </div>

                                    {/* Identity */}
                                    <div className="col-span-1 md:col-span-3 flex flex-col gap-1">
                                        <span className="text-gray-300 text-sm font-semibold truncate group-hover:text-white transition-colors">
                                            {log.userId?.name || 'ANONYMOUS ENTITY'}
                                        </span>
                                        <span className="text-gray-500 font-mono text-[10px] truncate">
                                            {log.userId?.email || 'SYSTEM EVENT'}
                                        </span>
                                    </div>

                                    {/* Network */}
                                    <div className="col-span-1 md:col-span-4 flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2 text-gray-400 font-mono text-[11px] bg-black/40 w-fit px-2 py-0.5 rounded border border-white/5">
                                            <Globe size={12} className="opacity-70 text-blue-400" />
                                            {log.ipAddress || 'UNKNOWN_IP'}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 font-sans text-[10px]" title={log.userAgent}>
                                            <Monitor size={12} className="shrink-0" />
                                            <span className="truncate max-w-[200px] xl:max-w-[300px]">{log.userAgent || 'Unknown Device Signature'}</span>
                                        </div>
                                    </div>

                                    {/* Risk */}
                                    <div className="col-span-1 md:col-span-2 flex items-center md:justify-end">
                                        <div className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-widest border uppercase flex items-center gap-2 ${meta.bg} ${meta.color} ${meta.border} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
                                            <div className={`w-2 h-2 rounded-full bg-current ${meta.risk === 'HIGH' ? 'animate-pulse' : 'opacity-80'}`}></div>
                                            {meta.risk}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SecurityLogTable;
