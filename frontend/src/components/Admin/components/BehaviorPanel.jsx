import React from 'react';
import { AlertTriangle, Activity } from 'lucide-react';

const BehaviorPanel = ({ anomalies, activities }) => {
    const hasAnomalies = anomalies?.suspiciousLoginActivity?.length > 0 || anomalies?.rapidCheckoutActivity?.length > 0;

    if (!hasAnomalies && !activities) return null;

    return (
        <div className="space-y-6 flex flex-col shrink-0">
            {/* Anomalies Alert */}
            {(anomalies?.suspiciousLoginActivity?.length > 0 ||
                anomalies?.rapidCheckoutActivity?.length > 0) && (
                    <div className="glass-panel bg-admin-warning/5 rounded-lg p-5 border-l-4 border-admin-warning shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle size={24} className="text-admin-warning shrink-0" />
                            <h3 className="text-lg font-bold text-admin-warning tracking-wide uppercase">System Behavioral Alerts (AI Flagged)</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {anomalies?.suspiciousLoginActivity?.length > 0 && (
                                <div className="bg-black/40 p-4 rounded border border-admin-warning/20">
                                    <p className="font-mono text-xs text-gray-400 tracking-widest mb-3 border-b border-white/5 pb-2 uppercase">High Frequency Logins</p>
                                    <div className="space-y-2">
                                        {anomalies.suspiciousLoginActivity.slice(0, 5).map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center">
                                                <span className="text-gray-500 font-mono text-[10px]">ID: {item._id.slice(-8)}</span>
                                                <span className="text-admin-warning bg-admin-warning/10 px-2 py-0.5 rounded font-mono text-[10px] tracking-wider border border-admin-warning/20">{item.loginCount} ATTEMPTS</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {anomalies?.rapidCheckoutActivity?.length > 0 && (
                                <div className="bg-black/40 p-4 rounded border border-blue-500/20">
                                    <p className="font-mono text-xs text-gray-400 tracking-widest mb-3 border-b border-white/5 pb-2 uppercase">Rapid Checkout Activity</p>
                                    <div className="space-y-2">
                                        {anomalies.rapidCheckoutActivity.slice(0, 5).map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center">
                                                <span className="text-gray-500 font-mono text-[10px]">ID: {item._id.slice(-8)}</span>
                                                <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded font-mono text-[10px] tracking-wider border border-blue-500/20">{item.checkoutCount} / HR</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            {/* Recent Activities */}
            {activities && (
                <div className="glass-panel bg-white/5 border border-white/5 rounded-lg overflow-hidden shadow-sm flex flex-col flex-1">
                    <div className="px-5 py-3 border-b border-white/5 flex items-center gap-3 bg-black/40 shrink-0">
                        <Activity className="text-admin-accent shrink-0" size={18} />
                        <h3 className="text-sm font-bold text-white tracking-widest uppercase">Forensic Activity Log (Real-time Tracker)</h3>
                    </div>
                    <div className="divide-y divide-white/5 overflow-y-auto bg-black/20">
                        {activities.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 font-mono text-xs tracking-widest">NO FORENSIC LOGS RECORDED.</div>
                        ) : (
                            activities.map((activity) => (
                                <ActivityItem key={activity._id} activity={activity} />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const ActivityItem = ({ activity }) => {
    const actionColors = {
        login_success: 'bg-green-500/10 text-green-400 border-green-500/20',
        login_failed: 'bg-admin-danger/10 text-admin-danger border-admin-danger/30 font-bold',
        login: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        signup: 'bg-meta-purple/10 text-meta-purple border-meta-purple/20',
        bmi_calculation: 'bg-admin-accent/10 text-admin-accent border-admin-accent/20',
        view_product: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        add_to_cart: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        checkout: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
        logout: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };

    const style = actionColors[activity.action] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 hover:bg-white/5 transition-colors gap-3 md:gap-0">
            <div className="flex items-center gap-3 md:gap-4 flex-1 w-full overflow-hidden">
                <div className={`px-2 py-1 rounded text-[9px] font-mono tracking-widest w-28 text-center shrink-0 border uppercase ${style}`}>
                    {activity.action.replace('_', ' ')}
                </div>
                <div className="min-w-0 pr-4">
                    <p className="font-semibold text-gray-300 truncate text-sm">{activity.userId?.name || 'UNKNOWN USER'}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[10px] text-gray-500 font-mono truncate tracking-wider">{activity.userId?.email}</span>
                        {activity.ipAddress && (
                            <span className="text-[9px] text-gray-600 font-mono px-1.5 py-0.5 rounded border border-white/5 bg-black/40">IP: {activity.ipAddress}</span>
                        )}
                    </div>
                </div>
            </div>
            <div className="shrink-0 text-left md:text-right pl-0 md:pl-4 border-l-0 md:border-l border-white/5 ml-[124px] md:ml-0">
                <p className="text-[10px] md:text-xs text-gray-500 font-mono tracking-widest">
                    {new Date(activity.createdAt).toLocaleDateString()}
                </p>
                <p className="text-[10px] text-gray-600 font-mono tracking-widest mt-0.5">
                    {new Date(activity.createdAt).toLocaleTimeString()}
                </p>
            </div>
        </div>
    );
};

export default BehaviorPanel;
