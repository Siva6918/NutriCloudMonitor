import React, { useState } from 'react';
import UserRow from './UserRow';
import { adminAPI } from '../../../services/api';
import { AlertTriangle } from 'lucide-react';

const UsersTable = ({ users, fetchUsers, onSelectUser, title = "User Governance Directory" }) => {
    const [loadingId, setLoadingId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '' });

    const handleStatusChange = async (userId, newStatus) => {
        try {
            setLoadingId(userId);
            await adminAPI.updateUserStatus(userId, newStatus);
            if (fetchUsers) await fetchUsers();
        } catch (error) {
            console.error('Failed to update status', error);
            setToast({ show: true, message: 'Failed to update user status' });
            setTimeout(() => setToast({ show: false, message: '' }), 5000);
        } finally {
            setLoadingId(null);
        }
    };

    const handleSoftDelete = async (userId) => {
        if (window.confirm('WARNING: Initialize hard-lock protocol? This performs a forensic soft-delete removing standard access but securing logs.')) {
            try {
                setLoadingId(userId);
                await adminAPI.deleteUser(userId);
                if (fetchUsers) await fetchUsers();
            } catch (error) {
                console.error('Failed to delete user', error);
                setToast({ show: true, message: 'Failed to soft delete user' });
                setTimeout(() => setToast({ show: false, message: '' }), 5000);
            } finally {
                setLoadingId(null);
            }
        }
    };

    return (
        <div className="glass-panel bg-white/5 border border-white/5 rounded-lg overflow-hidden shadow-sm flex flex-col min-h-[400px] flex-1">
            <div className="px-5 py-3 border-b border-white/5 flex justify-between items-center bg-black/40">
                <h3 className="text-sm font-bold text-white tracking-widest uppercase">{title}</h3>
            </div>
            <div className="overflow-auto bg-black/20">
                <table className="w-full text-left">
                    <thead className="bg-black/40 border-b border-white/5 text-[10px] font-mono tracking-widest text-gray-500 uppercase">
                        <tr>
                            <th className="py-3 px-5 font-semibold">User Details</th>
                            <th className="py-3 px-5 text-center font-semibold text-admin-accent">Total Logins</th>
                            <th className="py-3 px-5 text-center font-semibold text-admin-warning" title="Short Term / Long Term">Failed (ST/LT)</th>
                            <th className="py-3 px-5 text-center font-semibold">System AI Status</th>
                            <th className="py-3 px-5 text-center font-semibold text-[#a855f7]">Admin Enforced</th>
                            <th className="py-3 px-5 text-center font-semibold">Last Login</th>
                            <th className="py-3 px-5 text-center font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users?.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="py-8 text-center text-gray-500 font-mono text-xs tracking-widest">
                                    NO ACTIVE USERS FOUND IN DIRECTORY.
                                </td>
                            </tr>
                        ) : (
                            users?.map(user => (
                                <UserRow
                                    key={user._id}
                                    user={user}
                                    handleStatusChange={handleStatusChange}
                                    handleSoftDelete={handleSoftDelete}
                                    onSelectUser={onSelectUser}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Toast Notification (Bottom Right) */}
            {toast.show && (
                <div className="fixed bottom-6 right-6 bg-[#181818] border border-zinc-800 text-white px-6 py-4 rounded shadow-2xl z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-center gap-3">
                    <AlertTriangle className="text-[#E87C03]" size={24} />
                    <span className="font-bold text-base">{toast.message}</span>
                </div>
            )}
        </div>
    );
};

export default UsersTable;
