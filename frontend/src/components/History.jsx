import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Shield, ArrowRight, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getAllScans } from '../api/scanApi';
import { cn } from '../lib/utils';

export default function History() {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getAllScans();
                setScans(data);
            } catch (err) {
                console.error("Failed to fetch history");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getStatusIcon = (status) => {
        if (status === 'completed') return <CheckCircle2 className="text-accent-500" size={18} />;
        if (status === 'error') return <AlertTriangle className="text-red-500" size={18} />;
        return <Activity className="text-blue-500 animate-pulse" size={18} />;
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-5xl mx-auto"
        >
            <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                    <Clock size={28} className="text-accent-500" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold dark:text-white tracking-tight">Scan History</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Review your previous reconnaissance operations.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Activity className="w-8 h-8 text-accent-500 animate-pulse" />
                </div>
            ) : scans.length === 0 ? (
                <div className="text-center py-20 glass-panel rounded-3xl">
                    <Shield size={48} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
                    <h3 className="text-xl font-semibold dark:text-white mb-2">No scans found</h3>
                    <p className="text-zinc-500 mb-6">You haven't run any reconnaissance scans yet.</p>
                    <Link to="/" className="inline-flex items-center gap-2 bg-accent-500 text-white px-6 py-3 rounded-full font-medium hover:bg-accent-600 transition-colors">
                        Start New Scan <ArrowRight size={18} />
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {scans.map((scan, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={scan.id}
                        >
                            <Link 
                                to={`/scan/${scan.id}`}
                                className="flex items-center justify-between p-6 glass-panel glass-panel-hover rounded-2xl group"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="flex-shrink-0">
                                        {getStatusIcon(scan.status)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold dark:text-white mb-1 group-hover:text-accent-500 transition-colors">{scan.domain}</h3>
                                        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
                                            <span>{new Date(scan.created_at).toLocaleString()}</span>
                                            <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 uppercase tracking-wider">
                                                {scan.phase}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-lg font-mono font-bold text-zinc-300 dark:text-zinc-700 group-hover:text-accent-500 transition-colors">
                                        {scan.progress}%
                                    </span>
                                    <ArrowRight className="text-zinc-300 dark:text-zinc-700 group-hover:text-accent-500 transition-colors transform group-hover:translate-x-1" size={20} />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
