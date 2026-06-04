import React from 'react';

export default function PortTable({ data }) {
    if (!data || data.length === 0) return <div className="text-slate-500 py-4 text-center italic">No open ports mapped yet.</div>;
    
    return (
        <div className="overflow-x-auto custom-scrollbar rounded-lg border border-slate-800">
            <table className="min-w-full text-left border-collapse">
                <thead className="bg-slate-900/80 text-slate-300 text-sm uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                        <th className="px-5 py-4">Host</th>
                        <th className="px-5 py-4">Port</th>
                        <th className="px-5 py-4">Protocol</th>
                        <th className="px-5 py-4">Service</th>
                        <th className="px-5 py-4">Version</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/20 font-mono text-sm">
                    {data.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition-colors group">
                            <td className="px-5 py-3 text-slate-300">{item.host}</td>
                            <td className="px-5 py-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-bold">
                                    {item.port}
                                </span>
                            </td>
                            <td className="px-5 py-3 text-slate-400 uppercase">{item.protocol || '-'}</td>
                            <td className="px-5 py-3 text-emerald-400">{item.service || 'unknown'}</td>
                            <td className="px-5 py-3 text-slate-500">{item.version || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
