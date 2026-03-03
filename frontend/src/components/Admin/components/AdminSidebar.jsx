import React from 'react';
import { LogOut, Users, Activity, ShieldAlert, LayoutDashboard, GitMerge } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, handleLogout }) => {
    return (
        <div className="bg-admin-bg/60 backdrop-blur-md w-72 h-full flex flex-col border-r border-white/5 shrink-0 z-20">
            <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white flex items-center gap-3 tracking-wide">
                    <ShieldAlert className="text-admin-accent drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    NutriSOC Monitor
                </h2>
            </div>

            <div className="flex-1 py-6 space-y-1.5 px-3">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`text-xs tracking-widest uppercase w-full flex items-center gap-3 px-4 py-3.5 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-admin-accent/10 text-admin-accent font-bold border border-admin-accent/20 shadow-[inset_2px_0_0_0_#3B82F6]' : 'hover:bg-white/5 text-gray-400 border border-transparent hover:border-white/5'}`}
                >
                    <LayoutDashboard size={16} />
                    Overview
                </button>

                <button
                    onClick={() => setActiveTab('users')}
                    className={`text-xs tracking-widest uppercase w-full flex items-center gap-3 px-4 py-3.5 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-admin-accent/10 text-admin-accent font-bold border border-admin-accent/20 shadow-[inset_2px_0_0_0_#3B82F6]' : 'hover:bg-white/5 text-gray-400 border border-transparent hover:border-white/5'}`}
                >
                    <Users size={16} />
                    Governance Control
                </button>

                <button
                    onClick={() => setActiveTab('monitoring')}
                    className={`text-xs tracking-widest uppercase w-full flex items-center gap-3 px-4 py-3.5 rounded-lg transition-colors ${activeTab === 'monitoring' ? 'bg-admin-accent/10 text-admin-accent font-bold border border-admin-accent/20 shadow-[inset_2px_0_0_0_#3B82F6]' : 'hover:bg-white/5 text-gray-400 border border-transparent hover:border-white/5'}`}
                >
                    <Activity size={16} />
                    Behavioral Logs
                </button>

                <button
                    onClick={() => setActiveTab('clickstream')}
                    className={`text-xs tracking-widest uppercase w-full flex items-center gap-3 px-4 py-3.5 rounded-lg transition-colors ${activeTab === 'clickstream' ? 'bg-admin-accent/10 text-admin-accent font-bold border border-admin-accent/20 shadow-[inset_2px_0_0_0_#3B82F6]' : 'hover:bg-white/5 text-gray-400 border border-transparent hover:border-white/5'}`}
                >
                    <GitMerge size={16} />
                    Clickstream Matrix
                </button>
            </div>

            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="text-xs tracking-widest uppercase w-full flex items-center justify-center gap-3 px-4 py-3 text-admin-danger hover:text-white hover:bg-admin-danger/20 rounded-lg transition-colors border border-admin-danger/20"
                >
                    <LogOut size={16} />
                    Secure Logout
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
