import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Server, Network, ShieldAlert, Link as LinkIcon, ExternalLink, Activity, ArrowLeft } from 'lucide-react';
import { getScan } from '../api/scanApi';
import NumberTicker from './NumberTicker';
import { cn } from '../lib/utils';
import SubdomainTable from './SubdomainTable';
import PortTable from './PortTable';
import VulnTable from './VulnTable';
import WaybackTable from './WaybackTable';

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            type: "spring", stiffness: 120, damping: 20, mass: 0.8
        }
    })
};

function StatusIndicator({ status, progress }) {
    const isCompleted = status === 'completed';
    const isError = status === 'error';
    const isRunning = !isCompleted && !isError;

    return (
        <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800">
            <div className="relative flex items-center justify-center">
                {isRunning && <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-accent-400 opacity-75"></span>}
                <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", isCompleted ? "bg-accent-500" : isError ? "bg-red-500" : "bg-accent-500")}></span>
            </div>
            <span className="text-sm font-semibold tracking-wider uppercase dark:text-zinc-300">
                {status || 'INITIALIZING'}
            </span>
            {isRunning && (
                <span className="text-sm font-mono text-accent-500 font-bold ml-2">{progress}%</span>
            )}
        </div>
    );
}

export default function Dashboard() {
    const { id } = useParams();
    const [scanData, setScanData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('subdomains');

    useEffect(() => {
        let timer;
        const fetchScanData = async () => {
            try {
                const data = await getScan(id);
                setScanData(data);
                setLoading(false);
                
                if (data.status !== 'completed' && data.status !== 'error') {
                    timer = setTimeout(fetchScanData, 3000);
                }
            } catch (err) {
                setLoading(false);
            }
        };
        fetchScanData();
        return () => clearTimeout(timer);
    }, [id]);

    if (loading && !scanData) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4 w-full">
            <Activity className="w-8 h-8 text-accent-500 animate-pulse" />
        </div>
    );
    if (!scanData) return null;

    const metrics = [
        { id: 'subdomains', label: 'Subdomains', value: scanData.subdomains?.length || 0, icon: Globe, color: 'text-blue-500' },
        { id: 'live_hosts', label: 'Live Hosts', value: scanData.live_hosts?.length || 0, icon: Server, color: 'text-accent-500' },
        { id: 'ports', label: 'Open Ports', value: scanData.ports?.length || 0, icon: Network, color: 'text-yellow-500' },
        { id: 'vulnerabilities', label: 'Vulns', value: scanData.vulnerabilities?.length || 0, icon: ShieldAlert, color: 'text-red-500' },
        { id: 'wayback_urls', label: 'Wayback', value: scanData.wayback_urls?.length || 0, icon: LinkIcon, color: 'text-purple-500' },
    ];

    const renderLiveHosts = () => {
        const data = scanData.live_hosts || [];
        if (data.length === 0) return <div className="p-8 text-center text-zinc-500 italic">No live hosts found yet.</div>;
        return (
            <div className="overflow-y-auto h-[600px] minimal-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-zinc-50 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-500 text-xs uppercase font-semibold border-b border-zinc-200 dark:border-zinc-800 z-10">
                        <tr>
                            <th className="px-5 py-3">URL</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3">Tech</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-mono text-sm">
                        <AnimatePresence>
                            {data.map((item, idx) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} layout
                                    key={item.url + idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                                >
                                    <td className="px-5 py-3">
                                        <a href={item.url} target="_blank" rel="noreferrer" className="text-zinc-900 dark:text-zinc-200 hover:text-accent-500 flex items-center gap-2 transition-colors">
                                            {item.url} <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={cn("px-2 py-1 rounded-md text-xs font-bold", item.status_code < 300 ? "bg-accent-500/10 text-accent-500" : "bg-zinc-500/10 text-zinc-500")}>
                                            {item.status_code || '-'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 flex flex-wrap gap-1">
                                        {item.technologies && (() => {
                                            try {
                                                const techs = JSON.parse(item.technologies);
                                                if (!Array.isArray(techs)) return null;
                                                return techs.slice(0, 3).map((t, i) => <span key={i} className="bg-zinc-100 dark:bg-zinc-800 text-[10px] px-2 py-0.5 rounded-full dark:text-zinc-300">{t}</span>);
                                            } catch (e) { return null; }
                                        })()}
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-full max-w-7xl mx-auto"
        >
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-4 transition-colors">
                        <ArrowLeft size={16} /> Back to Scanner
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight dark:text-white mb-2">
                        {scanData.domain}
                    </h1>
                    <div className="text-zinc-500 font-mono text-sm flex items-center gap-2">
                        <span>PHASE: <strong className="text-zinc-900 dark:text-zinc-300">{scanData.phase?.toUpperCase()}</strong></span>
                    </div>
                </div>
                <StatusIndicator status={scanData.status} progress={scanData.progress} />
            </header>

            {/* Premium Progress Bar */}
            <div className="w-full h-2 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full mb-10 overflow-hidden relative shadow-inner">
                <motion.div 
                    className="h-full bg-gradient-to-r from-accent-600 to-accent-400 relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${scanData.progress}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                >
                    <div className="absolute inset-0 bg-white/20" style={{ animation: 'shimmer 2s infinite linear', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }}></div>
                    {scanData.progress < 100 && (
                        <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/80 blur-sm animate-pulse"></div>
                    )}
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Bento Metrics Sidebar */}
                <div className="lg:col-span-3 flex flex-col gap-3">
                    {metrics.map((metric, i) => (
                        <motion.button
                            key={metric.id}
                            custom={i}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            onClick={() => setActiveTab(metric.id)}
                            className={cn(
                                "flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-300 group",
                                activeTab === metric.id 
                                    ? "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 shadow-md" 
                                    : "bg-zinc-50/50 dark:bg-zinc-900/30 border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn("p-2 rounded-xl bg-white dark:bg-zinc-800 shadow-sm transition-transform group-hover:-translate-y-1", metric.color)}>
                                    <metric.icon size={18} />
                                </div>
                                <span className="font-semibold text-sm dark:text-zinc-200">{metric.label}</span>
                            </div>
                            <span className="font-mono font-bold text-lg dark:text-white">
                                <NumberTicker value={metric.value} />
                            </span>
                        </motion.button>
                    ))}
                </div>

                {/* Active View Pane */}
                <motion.div 
                    layout
                    className="lg:col-span-9 glass-panel rounded-3xl overflow-hidden min-h-[600px] flex flex-col"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="flex-1 flex flex-col"
                        >
                            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 flex items-center justify-between">
                                <h3 className="text-xl font-bold dark:text-white capitalize flex items-center gap-2">
                                    {metrics.find(m => m.id === activeTab)?.label}
                                </h3>
                            </div>
                            <div className="flex-1 relative bg-white/30 dark:bg-zinc-950/30">
                                {activeTab === 'subdomains' && <SubdomainTable data={scanData.subdomains} />}
                                {activeTab === 'live_hosts' && renderLiveHosts()}
                                {activeTab === 'ports' && <PortTable data={scanData.ports} />}
                                {activeTab === 'vulnerabilities' && <VulnTable data={scanData.vulnerabilities} />}
                                {activeTab === 'wayback_urls' && <WaybackTable data={scanData.wayback_urls} />}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.div>
    );
}
