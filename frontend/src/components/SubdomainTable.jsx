import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function SubdomainTable({ data }) {
    if (!data || data.length === 0) return <div className="text-slate-500 py-4 text-center italic">No subdomains discovered yet.</div>;
    
    return (
        <div className="overflow-x-auto custom-scrollbar rounded-lg border border-slate-800">
            <table className="min-w-full text-left border-collapse">
                <thead className="bg-slate-900/80 text-slate-300 text-sm uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                        <th className="px-5 py-4">Subdomain</th>
                        <th className="px-5 py-4 w-32">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/20 font-mono text-sm">
                    {data.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition-colors group">
                            <td className="px-5 py-3">
                                <a href={`http://${item.host}`} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-2 w-fit transition-colors">
                                    {item.host}
                                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </td>
                            <td className="px-5 py-3">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${
                                    item.status === 'found' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                    {item.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
