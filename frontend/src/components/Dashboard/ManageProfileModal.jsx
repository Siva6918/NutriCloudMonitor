import React, { useState } from 'react';
import { userAPI } from '../../services/api';
import { X, AlertCircle } from 'lucide-react';

const ManageProfileModal = ({ user, onClose, onUpdate }) => {
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = { name, email };
            if (password) data.password = password;
            const res = await userAPI.updateProfile(data);
            onUpdate(res.data.user);
            onClose();
        } catch (error) {
            setToast({ show: true, message: error.response?.data?.message || 'Failed to update profile' });
            setTimeout(() => setToast({ show: false, message: '' }), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#181818] w-full max-w-md rounded-lg shadow-2xl border border-zinc-700 animate-in zoom-in-95 duration-200 overflow-hidden relative text-white">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold font-sans">Manage Profile</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#333] border-b-2 border-transparent focus:border-[#E50914] rounded-sm px-4 py-3 outline-none transition-colors" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email (Login ID)</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#333] border-b-2 border-transparent focus:border-[#E50914] rounded-sm px-4 py-3 outline-none transition-colors" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">New Password (leave blank to keep current)</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#333] border-b-2 border-transparent focus:border-[#E50914] rounded-sm px-4 py-3 outline-none transition-colors" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-sm font-medium text-white hover:bg-[#333] transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="bg-[#E50914] hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-sm transition-colors shadow-lg disabled:opacity-50">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Toast Notification (Bottom Right) */}
            {toast.show && (
                <div className="fixed bottom-6 right-6 bg-[#181818] border border-zinc-800 text-white px-6 py-4 rounded shadow-2xl z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-center gap-3">
                    <AlertCircle className="text-[#E87C03]" size={24} />
                    <span className="font-bold text-base">{toast.message}</span>
                </div>
            )}
        </div>
    );
};
export default ManageProfileModal;
