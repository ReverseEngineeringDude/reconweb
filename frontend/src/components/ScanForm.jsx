import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Target, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { startScan } from '../api/scanApi';
import { cn } from '../lib/utils';

export default function ScanForm() {
    const [domain, setDomain] = useState('');
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!authorized) return;
        setLoading(true);
        setError(null);
        try {
            const data = await startScan(domain);
            // small delay to let animation play
            setTimeout(() => {
                navigate(`/scan/${data.job_id}`);
            }, 800);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to start scan');
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.8 }}
            className="flex flex-col items-center mt-10 md:mt-20 min-h-[70vh] w-full relative"
        >
            {/* Background Network effect (simple particles reacting to input) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 opacity-30 dark:opacity-10">
                <motion.div 
                    animate={{ scale: domain.length > 0 ? 1.05 : 1, opacity: loading ? 0 : 1 }}
                    transition={{ duration: 1 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-500/10 rounded-full blur-[100px]"
                />
            </div>

            <div className="text-center mb-10 relative z-10">
                <motion.h2 layoutId="headerTitle" className="text-4xl md:text-5xl font-bold dark:text-white text-zinc-900 mb-4 tracking-tight">
                    Automated <span className="text-accent-500">Recon</span>
                </motion.h2>
                <motion.p layoutId="headerDesc" className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto text-lg">
                    Discover subdomains, map ports, and identify vulnerabilities with premium precision.
                </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-xl glass-panel p-8 md:p-10 rounded-3xl relative z-10 group">
                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-3 overflow-hidden"
                        >
                            <Shield className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <div className="mb-8 relative">
                    <label className="block text-zinc-500 dark:text-zinc-400 mb-2 text-sm font-semibold uppercase tracking-wider">Target Domain</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            placeholder="example.com"
                            className="w-full bg-zinc-50 dark:bg-zinc-950/50 text-zinc-900 dark:text-accent-400 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-500/20 font-mono text-lg transition-all shadow-inner"
                            required
                        />
                    </div>
                </div>

                <div 
                    className="mb-8 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex items-start gap-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    onClick={() => setAuthorized(!authorized)}
                >
                    <div className="pt-0.5 relative">
                        <motion.div 
                            className={cn(
                                "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors duration-300",
                                authorized ? "bg-accent-500 border-accent-500" : "border-zinc-300 dark:border-zinc-600 bg-transparent"
                            )}
                        >
                            <AnimatePresence>
                                {authorized && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                    >
                                        <ShieldCheck size={16} className="text-white" strokeWidth={3} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        I confirm I have explicit <strong className="text-zinc-900 dark:text-zinc-200">authorization</strong> to scan this domain. Active testing will be performed.
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={!authorized || loading}
                    className="relative overflow-hidden group w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold py-4 px-6 rounded-2xl transition-all disabled:opacity-50 disabled:scale-100 active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 text-lg"
                >
                    {/* Active pulse background */}
                    {authorized && !loading && (
                        <div className="absolute inset-0 bg-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                    
                    <span className="relative z-10 flex items-center gap-3">
                        {loading ? (
                            <>
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}>
                                    <Zap className="w-5 h-5 text-accent-400 dark:text-accent-600" />
                                </motion.div>
                                INITIATING PROTOCOL...
                            </>
                        ) : (
                            <>
                                START SCAN <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </span>
                </button>
            </form>
        </motion.div>
    );
}
