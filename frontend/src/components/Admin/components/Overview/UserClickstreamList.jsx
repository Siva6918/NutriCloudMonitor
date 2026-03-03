import React, { useState, useEffect } from 'react';
import { adminAPI, ASSET_URL } from '../../../../services/api';
import { User, Calendar, ArrowRight, Activity, X } from 'lucide-react';

const UserClickstreamList = ({ users }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [clickstreamData, setClickstreamData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchUserClickstream = async (userId) => {
        setLoading(true);
        try {
            const res = await adminAPI.getUserActivity(userId, { action: 'PAGE_TRANSITION', limit: 1000 });

            // Group activities by date
            const grouped = res.data.activities.reduce((acc, current) => {
                const date = new Date(current.createdAt).toLocaleDateString(undefined, {
                    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                });
                if (!acc[date]) {
                    acc[date] = [];
                }
                // Push sequentially since they are sorted newest first, we reverse later or prepend
                acc[date].unshift(current);
                return acc;
            }, {});

            setClickstreamData(grouped);
        } catch (error) {
            console.error('Failed to fetch user clickstream:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        fetchUserClickstream(user._id);
    };

    return (
        <div className="glass-panel bg-black/40 border border-white/5 rounded-lg flex flex-col overflow-hidden shadow-2xl relative">
            <div className="p-4 border-b border-white/5 bg-black/60 flex flex-col md:flex-row items-center justify-between shrink-0 gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Activity className="text-cyan-400" size={20} />
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-widest uppercase">Targeted User Clickstream</h2>
                        <p className="text-[10px] text-gray-500 font-mono tracking-widest">Day-wise Path Introspection</p>
                    </div>
                </div>
                {!selectedUser && (
                    <input
                        type="text"
                        placeholder="Search specific target..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-black/50 border border-white/10 rounded px-4 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 w-full md:w-64"
                    />
                )}
            </div>

            <div className="flex flex-col md:flex-row flex-1 min-h-[400px]">
                {/* Users List Sidebar */}
                <div className={`w-full ${selectedUser ? 'md:w-1/3 border-r border-white/5' : 'md:w-full'} flex flex-col h-[400px] md:h-auto overflow-y-auto custom-scrollbar`}>
                    <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {filteredUsers.map(user => (
                            <div
                                key={user._id}
                                onClick={() => handleSelectUser(user)}
                                className={`p-3 rounded border cursor-pointer transition-all flex items-center gap-3 ${selectedUser?._id === user._id ? 'bg-cyan-900/30 border-cyan-500/50 shadow-[0_0_15px_rgba(0,229,255,0.1)]' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                                style={{ display: selectedUser && selectedUser._id !== user._id ? 'none' : 'flex' }}
                            >
                                <div className="w-8 h-8 rounded-full bg-admin-highlight/20 border border-admin-highlight/40 flex items-center justify-center shrink-0">
                                    {user.profileImage ? (
                                        <img src={user.profileImage.startsWith('http') ? user.profileImage : `${ASSET_URL}${user.profileImage}`} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <User size={14} className="text-admin-highlight" />
                                    )}
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm text-gray-200 font-bold truncate">{user.name}</span>
                                    <span className="text-[10px] text-gray-500 truncate">{user.email}</span>
                                </div>
                                {selectedUser?._id === user._id && (
                                    <button
                                        className="ml-auto p-1.5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded transition-colors"
                                        onClick={(e) => { e.stopPropagation(); setSelectedUser(null); setClickstreamData({}); }}
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    {filteredUsers.length === 0 && (
                        <div className="p-8 text-center text-gray-500 text-xs font-mono">No users found.</div>
                    )}
                </div>

                {/* Clickstream Details Panel */}
                {selectedUser && (
                    <div className="flex-1 flex flex-col bg-black/20 h-[500px] md:h-auto overflow-y-auto custom-scrollbar p-6">
                        {loading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                            </div>
                        ) : Object.keys(clickstreamData).length === 0 ? (
                            <div className="flex-1 flex items-center justify-center text-gray-500 text-xs font-mono">
                                No clickstream transition data found for this user.
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {Object.entries(clickstreamData).map(([date, activities]) => (
                                    <div key={date} className="flex flex-col relative">
                                        <div className="sticky top-0 bg-admin-bg/95 backdrop-blur-sm z-10 py-2 border-b border-white/10 mb-4 flex items-center gap-2">
                                            <Calendar className="text-admin-accent" size={14} />
                                            <h3 className="text-gray-300 font-bold text-xs uppercase tracking-wider">{date}</h3>
                                            <span className="ml-auto text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded">{activities.length} Transitions</span>
                                        </div>

                                        <div className="flex flex-col pl-4 border-l border-white/5 space-y-6">
                                            {activities.map((act, index) => (
                                                <div key={act._id} className="flex flex-col relative group">
                                                    <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-cyan-500 ring-4 ring-black"></div>
                                                    <div className="flex items-center gap-2 text-[11px] font-mono mb-1">
                                                        <span className="text-gray-500">{new Date(act.createdAt).toLocaleTimeString()}</span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                                        <div className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-400 rounded truncate max-w-[200px]" title={act.details.source}>
                                                            {act.details.source}
                                                        </div>
                                                        <ArrowRight size={14} className="text-gray-600" />
                                                        <div className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded shadow-[0_0_10px_rgba(0,229,255,0.1)] truncate max-w-[200px]" title={act.details.target}>
                                                            {act.details.target}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserClickstreamList;
