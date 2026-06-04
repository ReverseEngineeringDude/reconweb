import React from 'react';
import { Activity, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export default function StatusBadge({ status, phase, progress }) {
    const isCompleted = status === 'completed';
    const isError = status === 'error';
    const isRunning = !isCompleted && !isError;

    return (
        <div className="glass-card p-6 mb-8 relative overflow-hidden animate-fade-in-up">
            <div className={`absolute top-0 left-0 w-1 h-full ${isCompleted ? 'bg-emerald-500' : isError ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    {isCompleted ? <CheckCircle2 className="text-emerald-500" size={28} /> : 
                     isError ? <AlertTriangle className="text-red-500" size={28} /> : 
                     <Activity className="text-cyan-400 animate-pulse" size={28} />}
                    
                    <div>
                        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Current Status</div>
                        <div className={`text-2xl font-bold tracking-tight ${isCompleted ? 'text-emerald-400' : isError ? 'text-red-500' : 'text-cyan-400'}`}>
                            {status?.toUpperCase() || 'UNKNOWN'}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-800">
                    <Clock size={16} className="text-slate-400" />
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Phase:</span>
                    <span className="text-sm font-bold text-white capitalize">{phase?.replace('_', ' ') || 'Initializing'}</span>
                </div>
            </div>
            
            <div className="relative mt-2">
                <div className="flex justify-between text-xs font-medium text-slate-400 mb-2 font-mono">
                    <span>PROGRESS</span>
                    <span className={isCompleted ? 'text-emerald-400' : 'text-cyan-400'}>{progress}%</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden border border-slate-700/50 shadow-inner">
                    <div 
                        className={`h-full rounded-full transition-all duration-700 ease-out relative ${isCompleted ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : isError ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-600 to-emerald-400'}`}
                        style={{ width: `${progress}%` }}
                    >
                        {isRunning && progress > 0 && (
                            <div className="absolute top-0 left-0 w-full h-full">
                                <div className="absolute inset-0 bg-white/20" style={{ animation: 'shimmer 2s infinite linear', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style jsx="true">{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
