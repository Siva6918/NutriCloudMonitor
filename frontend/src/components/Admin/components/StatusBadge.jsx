import React from 'react';

const StatusBadge = ({ type, status }) => {
    const statusConfig = {
        // Admin Statuses (Governance)
        'Active': 'bg-green-500/10 text-green-500 border-green-500/20',
        'Suspended': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 font-bold',
        'Blocked': 'bg-admin-danger/10 text-admin-danger border-admin-danger/40 font-bold shadow-[inset_0_0_10px_rgba(255,60,0,0.1)]',

        // System Statuses (AI/Anomaly Evaluation)
        'Safe': 'bg-admin-accent/5 text-admin-accent border-admin-accent/20',
        'Suspicious': 'bg-admin-warning/10 text-admin-warning border-admin-warning/30',
        'HighRisk': 'bg-admin-danger/10 text-admin-danger border-admin-danger/30 font-bold',
    };

    const displayLabels = {
        'Safe': 'LOW RISK',
        'Suspicious': 'MEDIUM',
        'HighRisk': 'HIGH RISK'
    };

    const style = statusConfig[status] || 'bg-gray-500/10 text-gray-400 border-white/5';
    const displayedText = type === 'system' ? (displayLabels[status] || status) : status;

    return (
        <span className={`px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase rounded border ${style} inline-block`}>
            {displayedText}
        </span>
    );
};

export default StatusBadge;
