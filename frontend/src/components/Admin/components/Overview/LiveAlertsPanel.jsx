import React from 'react';
import { ShieldAlert, AlertCircle, Clock } from 'lucide-react';

const LiveAlertsPanel = ({ alerts }) => {
    return (
        <div className="glass-panel bg-admin-warning/5 border border-admin-warning/20 rounded-lg flex flex-col h-full overflow-hidden shadow-2xl relative">
            <div className="p-4 border-b border-admin-warning/20 bg-black/60 flex items-center gap-3 shrink-0">
                <AlertCircle className="text-admin-warning" size={20} />
                <div>
                    <h2 className="text-sm font-bold text-admin-warning tracking-widest uppercase">Live Threat Vector Alerts</h2>
                    <p className="text-[10px] text-gray-500 font-mono tracking-widest">Real-time Anomaly Triggers</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-black/40 p-2 space-y-2">
                {alerts.map((alert) => (
                    <div key={alert.id} className="p-3 bg-black/60 rounded border border-admin-warning/10 hover:border-admin-warning/30 transition-colors flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-red-500 tracking-wider uppercase border border-red-500/30 px-1.5 py-0.5 rounded bg-red-500/10 shrink-0">
                                {alert.type.replace(/_/g, ' ')}
                            </span>
                            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-mono shrink-0">
                                <Clock size={10} />
                                {alert.time}
                            </div>
                        </div>
                        <p className="text-sm text-gray-300 font-semibold mb-1 line-clamp-2">{alert.description}</p>
                        <div className="flex justify-between mt-auto pt-2 border-t border-white/5">
                            <span className="text-gray-400 font-mono text-[10px] truncate pr-2 max-w-[60%]">{alert.user}</span>
                            <span className="text-gray-500 font-mono text-[10px] shrink-0">IP: {alert.ip}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveAlertsPanel;
