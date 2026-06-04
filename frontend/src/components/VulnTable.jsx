import React from 'react';
import { ExternalLink } from 'lucide-react';

const getSeverityStyles = (severity) => {
    switch(severity?.toLowerCase()) {
        case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/30 font-bold';
        case 'high': return 'bg-orange-500/10 text-orange-400 border-orange-500/30 font-bold';
        case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
        case 'low': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        case 'info': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
        default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
};

export default function VulnTable({ data }) {
    if (!data || data.length === 0) return <div className="text-slate-500 py-4 text-center italic">No vulnerabilities discovered.</div>;
    
    return (
        <div className="overflow-x-auto custom-scrollbar rounded-lg border border-slate-800">
            <table className="min-w-full text-left border-collapse">
                <thead className="bg-slate-900/80 text-slate-300 text-sm uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                        <th className="px-5 py-4">Severity</th>
                        <th className="px-5 py-4">Vulnerability</th>
                        <th className="px-5 py-4">Host/Target</th>
                        <th className="px-5 py-4">Template ID</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/20 font-mono text-sm">
                    {data.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition-colors group">
                            <td className="px-5 py-3">
                                <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs border uppercase tracking-wider ${getSeverityStyles(item.severity)}`}>
                                    {item.severity ? item.severity : 'UNKNOWN'}
                                </span>
                            </td>
                            <td className="px-5 py-3 text-slate-200 font-sans">{item.name}</td>
                            <td className="px-5 py-3">
                                <a href={item.matched_at || item.host} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1.5 transition-colors w-fit">
                                    <span className="truncate max-w-[200px] block">{item.matched_at || item.host}</span>
                                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                </a>
                            </td>
                            <td className="px-5 py-3 text-slate-500">{item.template_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
