import React from 'react';
import StatusBadge from './StatusBadge';
import { ShieldOff, Lock, UserCheck, Trash2 } from 'lucide-react';

const UserRow = ({ user, handleStatusChange, handleSoftDelete, onSelectUser }) => {
    return (
        <tr
            className="hover:bg-white/5 transition-colors cursor-pointer group"
            onClick={() => onSelectUser && onSelectUser(user)}
        >
            <td className="py-3 px-5">
                <div className="font-semibold text-gray-300 text-sm tracking-wide">{user.name}</div>
                <div className="text-[10px] text-gray-500 font-mono tracking-wider">{user.email}</div>
            </td>
            <td className="py-3 px-5 text-center text-gray-400 font-mono text-xs">
                {user.loginCount || 0}
            </td>
            <td className="py-3 px-5 text-center text-gray-400 font-mono text-xs">
                <span className={user.failedLoginAttempts > 0 ? "text-admin-warning font-bold drop-shadow-[0_0_5px_rgba(255,122,0,0.5)]" : ""}>
                    {user.failedLoginAttempts || 0}
                </span>
                <span className="text-gray-600 mx-1">/</span>
                <span className={user.totalFailedAttempts > 10 ? "text-admin-danger font-bold drop-shadow-[0_0_5px_rgba(255,60,0,0.5)]" : ""}>
                    {user.totalFailedAttempts || 0}
                </span>
            </td>
            <td className="py-3 px-5 text-center">
                <StatusBadge type="system" status={user.systemStatus || 'Safe'} />
                {user.riskScore > 0 && <div className="text-[9px] text-gray-600 font-mono tracking-widest mt-1">SCORE: {user.riskScore}</div>}
            </td>
            <td className="py-3 px-5 text-center">
                <StatusBadge type="admin" status={user.adminStatus || 'Active'} />
            </td>
            <td className="py-3 px-5 text-center text-[10px] text-gray-500 font-mono tracking-widest uppercase">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'NEVER'}
            </td>
            <td className="py-3 px-5 text-center">
                <div className="flex items-center justify-center gap-1.5">
                    {user.adminStatus !== 'Active' && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(user._id, 'Active'); }}
                            className="p-1.5 text-green-500 hover:bg-green-500/20 border border-transparent hover:border-green-500/30 rounded transition-all"
                            title="Activate User"
                        >
                            <UserCheck size={16} />
                        </button>
                    )}
                    {user.adminStatus !== 'Suspended' && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(user._id, 'Suspended'); }}
                            className="p-1.5 text-yellow-500 hover:bg-yellow-500/20 border border-transparent hover:border-yellow-500/30 rounded transition-all"
                            title="Suspend User"
                        >
                            <ShieldOff size={16} />
                        </button>
                    )}
                    {user.adminStatus !== 'Blocked' && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(user._id, 'Blocked'); }}
                            className="p-1.5 text-admin-danger hover:bg-admin-danger/20 border border-transparent hover:border-admin-danger/30 rounded transition-all"
                            title="Block User"
                        >
                            <Lock size={16} />
                        </button>
                    )}
                    <div className="w-px h-4 bg-white/10 mx-1 border-r border-black/50"></div>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleSoftDelete(user._id); }}
                        className="p-1.5 text-gray-600 hover:text-admin-danger hover:bg-admin-danger/10 border border-transparent hover:border-admin-danger/20 rounded transition-all"
                        title="Soft Delete User (Preserve Forensic Data)"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default UserRow;
