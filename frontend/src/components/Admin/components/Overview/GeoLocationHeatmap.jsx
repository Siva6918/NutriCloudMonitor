import React from 'react';
import { Globe, Crosshair } from 'lucide-react';

const GeoLocationHeatmap = () => {
    return (
        <div className="glass-panel bg-black/40 border border-white/5 rounded-lg flex flex-col h-full overflow-hidden shadow-2xl relative min-h-[300px]">
            <div className="p-4 border-b border-white/5 bg-black/60 flex items-center justify-between shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <Globe className="text-cyan-400" size={20} />
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-widest uppercase">Global Access Topology</h2>
                        <p className="text-[10px] text-gray-500 font-mono tracking-widest">Geo-Spatial Authentication Mapping</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 relative bg-[#060b13] flex items-center justify-center overflow-hidden p-6 group">
                {/* SVG World Map Base (Abstract stylized) */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#060b13] to-[#060b13]"></div>

                {/* Simulated SVG Map - Just using a placeholder graphic approach for high performance SOC vibe */}
                <svg viewBox="0 0 1000 500" className="w-full h-full max-w-3xl opacity-30 stroke-cyan-500/30 fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round" style={{ filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.2))' }}>
                    {/* Very simplified geometric world representation for tech vibe */}
                    <path d="M 150 150 Q 200 100 250 150 T 400 180 T 500 250 T 600 200 T 700 220 T 800 180 L 850 300 Q 800 350 700 380 T 550 400 T 450 350 T 350 420 T 250 380 T 150 400 Z" />
                    <path d="M 400 180 L 450 120 L 550 140 L 500 200 Z" />
                    <path d="M 700 220 L 750 280 L 850 250 L 820 180 Z" />
                    <path d="M 250 150 L 220 220 L 300 280 L 350 200 Z" />
                </svg>

                {/* Heatmap Nodes */}
                <div className="absolute top-[30%] left-[25%] flex items-center justify-center">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping absolute opacity-70"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full relative z-10 shadow-[0_0_10px_#22d3ee]"></div>
                    <div className="absolute top-4 bg-black/80 border border-cyan-500/30 text-cyan-400 font-mono text-[9px] px-1.5 py-0.5 rounded backdrop-blur-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        US East: 1.2k req/s
                    </div>
                </div>

                <div className="absolute top-[45%] left-[70%] flex items-center justify-center">
                    <div className="w-4 h-4 bg-admin-warning rounded-full animate-ping absolute opacity-50 duration-1000"></div>
                    <div className="w-2 h-2 bg-admin-warning text-admin-warning rounded-full relative z-10 shadow-[0_0_10px_#ff7a00]"></div>
                    <div className="absolute top-4 bg-black/80 border border-admin-warning/30 text-admin-warning font-mono text-[9px] px-1.5 py-0.5 rounded backdrop-blur-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        IND: 850 req/s (High Vol)
                    </div>
                </div>

                <div className="absolute top-[35%] left-[55%] flex items-center justify-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full relative z-10 shadow-[0_0_10px_#22d3ee] opacity-60"></div>
                </div>

                <div className="absolute top-[60%] left-[30%] flex items-center justify-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full relative z-10 shadow-[0_0_10px_#22d3ee] opacity-40"></div>
                </div>

                {/* Anomalous specific Node */}
                <div className="absolute top-[25%] left-[65%] flex items-center justify-center">
                    <Crosshair className="text-red-500 absolute animate-spin-slow opacity-80" size={32} />
                    <div className="w-2 h-2 bg-red-500 rounded-full relative z-10 shadow-[0_0_15px_#ef4444]"></div>
                    <div className="absolute top-6 bg-black/90 border border-red-500/50 text-red-500 font-mono text-[9px] px-2 py-1 rounded backdrop-blur-sm whitespace-nowrap">
                        THREAT: Multiple Geo Origin
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeoLocationHeatmap;
