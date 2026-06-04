import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getScan, getScanStatus } from '../api/scanApi';
import StatusBadge from './StatusBadge';
import SubdomainTable from './SubdomainTable';
import PortTable from './PortTable';
import VulnTable from './VulnTable';
import WaybackTable from './WaybackTable';
import { ChevronDown, ChevronUp, Globe, Server, Network, ShieldAlert, Link as LinkIcon, ExternalLink, Target } from 'lucide-react';

const Collapsible = ({ title, icon: Icon, count, children, defaultOpen = false, delay = 0 }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className={`glass-card mb-4 overflow-hidden animate-fade-in-up delay-${delay}`}>
            <button 
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center p-5 bg-slate-900/40 hover:bg-slate-800/60 transition-colors group"
            >
                <div className="font-semibold text-lg flex items-center gap-3 text-white">
                    <Icon className="text-emerald-400 group-hover:text-emerald-300 transition-colors" size={22} />
                    {title} 
                    <span className="bg-slate-800/80 px-2.5 py-0.5 rounded-md text-xs text-emerald-300 border border-emerald-900/30 font-mono shadow-inner">{count}</span>
                </div>
                <div className="bg-slate-800/50 p-1.5 rounded-lg border border-slate-700/50 group-hover:bg-slate-700 transition-colors">
                    {open ? <ChevronUp size={18} className="text-slate-300" /> : <ChevronDown size={18} className="text-slate-300" />}
                </div>
            </button>
            <div className={`transition-all duration-300 ease-in-out ${open ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-5 bg-slate-950/50 border-t border-slate-800/60">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const { id } = useParams();
    const [scanData, setScanData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScanData = async () => {
            try {
                const data = await getScan(id);
                setScanData(data);
                setLoading(false);
                
                if (data.status !== 'completed' && data.status !== 'error') {
                    const timer = setTimeout(fetchScanData, 3000);
                    return () => clearTimeout(timer);
                }
            } catch (err) {
                setError('Failed to fetch scan data. Ensure the backend is running.');
                setLoading(false);
            }
        };
        fetchScanData();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
            <div className="text-emerald-400 font-mono tracking-widest animate-pulse">LOADING DASHBOARD...</div>
        </div>
    );
    if (error) return <div className="text-center mt-20 text-red-500 bg-red-500/10 p-6 rounded-xl border border-red-500/30 max-w-lg mx-auto">{error}</div>;
    if (!scanData) return null;

    const renderLiveHosts = () => {
        const data = scanData.live_hosts || [];
        if (data.length === 0) return <div className="text-slate-500 py-4 text-center italic">No live hosts mapped yet.</div>;
        return (
            <div className="overflow-x-auto custom-scrollbar rounded-lg border border-slate-800">
                <table className="min-w-full text-left border-collapse">
                    <thead className="bg-slate-900/80 text-slate-300 text-sm uppercase tracking-wider font-semibold border-b border-slate-800">
                        <tr>
                            <th className="px-5 py-4">URL</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4">Title</th>
                            <th className="px-5 py-4">Tech Stack</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/20 font-mono text-sm">
                        {data.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/40 transition-colors group">
                                <td className="px-5 py-3">
                                    <a href={item.url} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1.5 transition-colors">
                                        {item.url} <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </td>
                                <td className="px-5 py-3">
                                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold ${
                                        item.status_code >= 200 && item.status_code < 300 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                        item.status_code >= 300 && item.status_code < 400 ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 
                                        item.status_code >= 400 ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 
                                        'bg-slate-800 text-slate-400 border border-slate-700'
                                    }`}>
                                        {item.status_code || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-slate-400 max-w-xs truncate font-sans" title={item.title}>{item.title || '-'}</td>
                                <td className="px-5 py-3">
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.technologies && (() => {
                                            try {
                                                const techs = JSON.parse(item.technologies);
                                                if (!Array.isArray(techs)) return null;
                                                return techs.map((t, i) => <span key={i} className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full border border-slate-700 uppercase tracking-wider">{t}</span>);
                                            } catch (e) {
                                                return null;
                                            }
                                        })()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8 animate-fade-in-up">
                <div>
                    <div className="text-slate-400 text-sm font-medium tracking-widest uppercase mb-1 flex items-center gap-2">
                        <Target size={16} className="text-emerald-500" /> Target Domain
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
                        {scanData.domain}
                        <a href={`http://${scanData.domain}`} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-emerald-400 transition-colors">
                            <ExternalLink size={24} />
                        </a>
                    </h1>
                </div>
                <Link 
                    to="/" 
                    className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 rounded-lg text-sm font-medium transition-all shadow-sm"
                >
                    Start New Scan
                </Link>
            </div>

            <StatusBadge 
                status={scanData.status} 
                phase={scanData.phase} 
                progress={scanData.progress} 
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
                {[
                    { label: 'Subdomains', value: scanData.subdomains?.length || 0, icon: Globe, color: 'emerald' },
                    { label: 'Live Hosts', value: scanData.live_hosts?.length || 0, icon: Server, color: 'cyan' },
                    { label: 'Open Ports', value: scanData.ports?.length || 0, icon: Network, color: 'yellow' },
                    { label: 'Vulnerabilities', value: scanData.vulnerabilities?.length || 0, icon: ShieldAlert, color: 'red' },
                ].map((stat, idx) => (
                    <div key={idx} className={`glass-card p-5 border-t-2 border-t-${stat.color}-500 animate-fade-in-up delay-${(idx+1)*100} relative overflow-hidden group`}>
                        <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-500/10 rounded-full blur-2xl group-hover:bg-${stat.color}-500/20 transition-colors`}></div>
                        <div className="flex items-center gap-3 mb-3 relative z-10">
                            <div className={`p-2 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-400`}>
                                <stat.icon size={20} />
                            </div>
                            <div className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{stat.label}</div>
                        </div>
                        <div className="text-4xl font-bold text-white relative z-10">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <Collapsible title="Subdomains" icon={Globe} count={scanData.subdomains?.length || 0} defaultOpen={true} delay="100">
                    <SubdomainTable data={scanData.subdomains} />
                </Collapsible>

                <Collapsible title="Live Hosts" icon={Server} count={scanData.live_hosts?.length || 0} defaultOpen={true} delay="200">
                    {renderLiveHosts()}
                </Collapsible>

                <Collapsible title="Ports & Services" icon={Network} count={scanData.ports?.length || 0} delay="300">
                    <PortTable data={scanData.ports} />
                </Collapsible>

                <Collapsible title="Vulnerabilities" icon={ShieldAlert} count={scanData.vulnerabilities?.length || 0} delay="400">
                    <VulnTable data={scanData.vulnerabilities} />
                </Collapsible>

                <Collapsible title="Wayback URLs" icon={LinkIcon} count={scanData.wayback_urls?.length || 0} delay="500">
                    <WaybackTable data={scanData.wayback_urls} />
                </Collapsible>
            </div>
        </div>
    );
}
