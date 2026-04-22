import React from 'react';
import { LogOut, Users, Activity, ShieldAlert, LayoutDashboard, GitMerge } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, handleLogout }) => {
    const navItems = [
        { key: 'overview', label: 'Overview', icon: LayoutDashboard },
        { key: 'users', label: 'Governance Control', icon: Users },
        { key: 'monitoring', label: 'Behavioral Logs', icon: Activity },
        { key: 'clickstream', label: 'Clickstream Matrix', icon: GitMerge }
    ];

    return (
        <aside className="w-72 h-full shrink-0 z-20 border-r border-white/10 bg-[rgba(10,14,25,0.72)] backdrop-blur-2xl shadow-[12px_0_40px_rgba(0,0,0,0.25)]">
            <div className="relative p-6 border-b border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-fuchsia-500/10 pointer-events-none" />
                <div className="relative flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.16)]">
                        <ShieldAlert className="text-cyan-300" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black uppercase tracking-[0.14em] text-white">
                            NutriSOC
                        </h2>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                            Monitor Console
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 px-3 py-6 space-y-2">
                {navItems.map(({ key, label, icon: Icon }) => {
                    const isActive = activeTab === key;

                    return (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`group relative w-full overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 ${
                                isActive
                                    ? 'border-cyan-400/20 bg-gradient-to-r from-cyan-400/14 via-blue-400/10 to-fuchsia-400/14 text-white shadow-[0_8px_24px_rgba(34,211,238,0.12)]'
                                    : 'border-transparent bg-white/[0.03] text-slate-400 hover:border-white/10 hover:bg-white/[0.07] hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                                        isActive
                                            ? 'border-cyan-300/20 bg-cyan-300/10 text-cyan-200'
                                            : 'border-white/8 bg-black/20 text-slate-400 group-hover:border-white/10 group-hover:text-slate-200'
                                    }`}
                                >
                                    <Icon size={17} />
                                </div>

                                <div className="min-w-0">
                                    <p className={`text-xs font-bold uppercase tracking-[0.22em] ${isActive ? 'text-white' : ''}`}>
                                        {label}
                                    </p>
                                </div>
                            </div>

                            {isActive && (
                                <>
                                    <div className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-cyan-300" />
                                    <div className="absolute -right-6 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-2xl" />
                                </>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="border-t border-white/10 p-4">
                <button
                    onClick={handleLogout}
                    className="w-full rounded-2xl border border-rose-400/20 bg-rose-500/8 px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-rose-300 transition-all duration-200 hover:bg-rose-500/15 hover:text-white"
                >
                    <span className="flex items-center justify-center gap-3">
                        <LogOut size={16} />
                        Secure Logout
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
