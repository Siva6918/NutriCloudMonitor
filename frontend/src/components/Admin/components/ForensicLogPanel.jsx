import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../../services/api';
import { Activity, ShieldAlert, ArrowLeft } from 'lucide-react';

const ForensicLogPanel = ({ user, onBack }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchLogs();
        }
    }, [user]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const res = await adminAPI.getUserActivity(user._id, { limit: 100 });
            setLogs(res.data.activities || []);
        } catch (error) {
            console.error('Failed to fetch user activity', error);
        } finally {
            setLoading(false);
        }
    };

    const securityActions = [
        // Legacy
        'login', 'login_failed', 'signup', 'logout',
        // Advanced
        'LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOGOUT',
        'MULTIPLE_FAILED_ATTEMPTS', 'HIGH_RISK_SCORE',
        'NEW_DEVICE_LOGIN', 'NEW_LOCATION_LOGIN',
        'TOKEN_EXPIRED'
    ];
    const websiteLogs = logs.filter(l => !securityActions.includes(l.action));
    const securityLogs = logs.filter(l => securityActions.includes(l.action));

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                <button
                    onClick={onBack}
                    className="flex text-admin-accent hover:text-white items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Directory
                </button>
                <div className="h-4 w-px bg-white/10"></div>
                <h2 className="text-xl font-black text-white uppercase tracking-wider">
                    Forensic Profile: <span className="text-gray-400">{user.name}</span> <span className="text-gray-600 text-sm font-mono">({user.email})</span>
                </h2>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-accent"></div>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row items-start gap-6 w-full">
                    {/* Left Panel: Security & Login Events */}
                    <div className="flex-1 w-full glass-panel bg-admin-warning/5 border border-admin-warning/20 rounded-lg flex flex-col shadow-sm">
                        <div className="px-5 py-3 border-b border-admin-warning/20 flex items-center gap-3 bg-black/60 shrink-0">
                            <ShieldAlert className="text-admin-warning shrink-0" size={18} />
                            <h3 className="text-sm font-bold text-admin-warning tracking-widest uppercase">Security & Access Events</h3>
                        </div>
                        <div className="divide-y divide-white/5 bg-black/30 p-2">
                            {securityLogs.length === 0 ? (
                                <p className="text-center text-gray-500 font-mono text-xs tracking-widest p-4">NO SECURITY EVENTS RECORDED</p>
                            ) : (
                                securityLogs.map(log => <LogItem key={log._id} log={log} isSecurity={true} />)
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Website Behavior */}
                    <div className="flex-1 w-full glass-panel bg-white/5 border border-white/5 rounded-lg flex flex-col shadow-sm">
                        <div className="px-5 py-3 border-b border-white/5 flex items-center gap-3 bg-black/40 shrink-0">
                            <Activity className="text-cyan-400 shrink-0" size={18} />
                            <h3 className="text-sm font-bold text-white tracking-widest uppercase">Website Engagement</h3>
                        </div>
                        <div className="divide-y divide-white/5 bg-black/20 p-2">
                            {websiteLogs.length === 0 ? (
                                <p className="text-center text-gray-500 font-mono text-xs tracking-widest p-4">NO ACTIVITY RECORDED</p>
                            ) : (
                                websiteLogs.map(log => <LogItem key={log._id} log={log} />)
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const LogItem = ({ log, isSecurity }) => {
    const actionColors = {
        // Legacy
        login_success: 'bg-green-500/10 text-green-400 border-green-500/20',
        login_failed: 'bg-admin-danger/10 text-admin-danger border-admin-danger/30 font-bold',
        login: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        signup: 'bg-meta-purple/10 text-meta-purple border-meta-purple/20',
        bmi_calculation: 'bg-admin-accent/10 text-admin-accent border-admin-accent/20',
        view_product: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        add_to_cart: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        checkout: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
        logout: 'bg-gray-500/10 text-gray-400 border-gray-500/20',

        // Advanced Web/Behavior Events
        BMI_CALCULATED: 'bg-admin-accent/10 text-admin-accent border-admin-accent/20',
        MULTIPLE_BMI_ATTEMPTS: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        RAPID_REQUESTS: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        SESSION_START: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        SESSION_END: 'bg-gray-500/10 text-gray-400 border-gray-500/20',

        // Advanced Auth/Security Events
        LOGIN_SUCCESS: 'bg-green-500/10 text-green-400 border-green-500/20',
        LOGIN_FAILURE: 'bg-admin-danger/10 text-admin-danger border-admin-danger/30 font-bold',
        MULTIPLE_FAILED_ATTEMPTS: 'bg-red-500/10 text-red-400 border-red-500/30 font-bold',
        HIGH_RISK_SCORE: 'bg-red-600/20 text-red-500 border-red-600/40 font-black animate-pulse',
        NEW_DEVICE_LOGIN: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        NEW_LOCATION_LOGIN: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        UNUSUAL_TIME_LOGIN: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        TOKEN_EXPIRED: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
        LOGOUT: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };

    const style = actionColors[log.action] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';

    return (
        <div className="p-3 hover:bg-white/5 transition-colors flex flex-col mb-1 rounded bg-black/20 border border-white/5">
            <div className="flex items-center justify-between mb-2">
                <div className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-widest border uppercase ${style}`}>
                    {log.action.replace('_', ' ')}
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-mono tracking-widest">{new Date(log.createdAt).toLocaleDateString()}</p>
                    <p className="text-[9px] text-gray-500 font-mono tracking-widest">{new Date(log.createdAt).toLocaleTimeString()}</p>
                </div>
            </div>
            {isSecurity ? (
                <div className="flex items-center gap-2 mt-1">
                    {log.ipAddress && <span className="text-[10px] text-gray-500 font-mono px-1.5 py-0.5 rounded bg-black/60 border border-white/10 flex-shrink-0">IP: {log.ipAddress}</span>}
                    <p className="text-[10px] text-gray-600 font-sans truncate">{log.userAgent}</p>
                </div>
            ) : (
                <div className="text-xs text-gray-300 font-mono tracking-wide bg-black/40 p-1.5 rounded border border-white/5 whitespace-pre-wrap break-all">
                    {JSON.stringify(log.details || {})}
                </div>
            )}
        </div>
    );
};

export default ForensicLogPanel;
