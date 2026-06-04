import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startScan } from '../api/scanApi';
import { Shield, Target, ArrowRight } from 'lucide-react';

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
            navigate(`/scan/${data.job_id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to start scan');
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in-up">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-6">
                    <Target size={32} className="text-emerald-400" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    Automated <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Reconnaissance</span>
                </h2>
                <p className="text-slate-400 max-w-lg mx-auto text-lg">
                    Discover subdomains, analyze live hosts, map open ports, and identify vulnerabilities seamlessly.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-xl glass-card p-8 md:p-10 neon-border relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-80"></div>
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-start gap-3">
                        <Shield className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
                
                <div className="mb-8 relative">
                    <label className="block text-slate-300 mb-2 text-sm font-medium uppercase tracking-wider">Target Domain</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            placeholder="example.com"
                            className="w-full bg-slate-950/50 text-emerald-400 border border-slate-700 rounded-xl px-4 py-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-lg transition-all shadow-inner"
                            required
                        />
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500 font-mono text-sm">
                            HTTPS/HTTP
                        </div>
                    </div>
                </div>

                <div className="mb-8 p-4 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-4 hover:border-emerald-900/50 transition-colors cursor-pointer" onClick={() => setAuthorized(!authorized)}>
                    <div className="pt-0.5">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${authorized ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 bg-slate-800'}`}>
                            {authorized && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                    </div>
                    <div className="text-sm text-slate-400 leading-relaxed">
                        I confirm I have explicit <strong className="text-slate-200">authorization</strong> to scan this domain. This tool performs active reconnaissance and is for authorized testing only.
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={!authorized || loading}
                    className="group w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-3 text-lg"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            INITIALIZING...
                        </>
                    ) : (
                        <>
                            START SCAN <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
