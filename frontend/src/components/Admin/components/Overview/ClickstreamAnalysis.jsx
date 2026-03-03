import React from 'react';
import { GitMerge, ArrowRight, CornerDownRight } from 'lucide-react';

const ClickstreamAnalysis = ({ data }) => {
    // Safely extract from backend payload
    const normalFlow = data?.normalFlow || [];
    const anomalousFlow = data?.anomalousFlow || [];
    const hasData = normalFlow.length > 0 || anomalousFlow.length > 0;

    return (
        <div className="glass-panel bg-black/40 border border-white/5 rounded-lg flex flex-col h-full overflow-hidden shadow-2xl relative">
            <div className="p-4 border-b border-white/5 bg-black/60 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <GitMerge className="text-cyan-400" size={20} />
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-widest uppercase">Clickstream Traversal</h2>
                        <p className="text-[10px] text-gray-500 font-mono tracking-widest">Navigation Sequence & Anomalies</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 flex flex-col md:flex-row gap-8 min-h-[250px] items-center text-xs font-mono">
                {/* Normal Flow */}
                <div className="flex flex-1 flex-wrap items-center justify-center md:justify-start gap-4 shrink-1 w-full relative">
                    {!hasData ? (
                        <div className="w-full text-center text-gray-500 py-10">Waiting for sufficient transition data...</div>
                    ) : (
                        <>
                            {normalFlow.map((step, idx) => (
                                <React.Fragment key={`normal-${idx}`}>
                                    <div
                                        className="flex flex-col items-center gap-2 relative group cursor-help"
                                        title={`Transition: ${step.source} → ${step.target}\nCount: ${step.value}\nProbability: ${(step.probability * 100).toFixed(1)}%`}
                                    >
                                        <span className="text-gray-500 text-[10px] bg-black/50 px-2 py-0.5 rounded-full border border-white/5">
                                            {step.value.toLocaleString()}
                                        </span>
                                        <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded shadow-[0_0_15px_rgba(0,229,255,0.1)] whitespace-nowrap">
                                            {step.source}
                                        </div>
                                    </div>

                                    {/* Arrow to Next Node unless it's the last one we are mapping from source */}
                                    {idx < normalFlow.length - 1 && (
                                        <div className="flex flex-col items-center" title={`P(Next) = ${(step.probability * 100).toFixed(1)}%`}>
                                            <ArrowRight className="text-cyan-600/50 shrink-0 mt-6" size={16} />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                            {/* Add Final Target Node */}
                            {normalFlow.length > 0 && (
                                <>
                                    <ArrowRight className="text-cyan-600/50 shrink-0 mt-6" size={16} />
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-gray-700 text-[10px] opacity-0">-</span>
                                        <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded shadow-[0_0_15px_rgba(0,229,255,0.1)] whitespace-nowrap">
                                            {normalFlow[normalFlow.length - 1]?.target || 'End'}
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-px h-full bg-white/10 shrink-0 mx-2"></div>

                {/* Anomalous Drops/Bypasses */}
                <div className="flex flex-col gap-4 text-[11px] shrink-0 min-w-fit md:min-w-[250px]">
                    <h3 className="text-admin-warning font-bold uppercase tracking-wider mb-2 border-b border-admin-warning/20 pb-2">Detected Anomalous Paths</h3>

                    {!anomalousFlow.length && hasData && (
                        <div className="text-gray-500 mt-2 text-center">No anomalies detected (all P &gt; 5%)</div>
                    )}

                    {anomalousFlow.map((anomaly, idx) => (
                        <div
                            key={`anomaly-${idx}`}
                            className="flex items-center gap-2 text-gray-300 bg-red-500/10 p-2 rounded border border-red-500/20 cursor-help transition-all hover:bg-red-500/20"
                            title={`Anomalous Edge: ${anomaly.source} → ${anomaly.target}\nCount: ${anomaly.value}\nProbability: ${(anomaly.probability * 100).toFixed(1)}%\nDeviation Risk: High`}
                        >
                            <span className="text-gray-500 truncate max-w-[80px]">{anomaly.source}</span>
                            <CornerDownRight size={14} className="text-red-500 shrink-0 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                            <span className="text-red-400 font-bold truncate max-w-[100px]">{anomaly.target}</span>
                            <span className="ml-auto text-red-300 bg-red-900/50 px-1.5 py-0.5 rounded text-[10px] border border-red-500/30 font-bold">
                                {(anomaly.probability * 100).toFixed(1)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClickstreamAnalysis;
