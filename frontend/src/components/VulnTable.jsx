import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

const getSeverityStyles = (severity) => {
    switch(severity?.toLowerCase()) {
        case 'critical': return 'bg-red-500/10 text-red-600 dark:text-red-500';
        case 'high': return 'bg-orange-500/10 text-orange-600 dark:text-orange-500';
        case 'medium': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500';
        case 'low': return 'bg-accent-500/10 text-accent-600 dark:text-accent-500';
        default: return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500';
    }
};

export default function VulnTable({ data }) {
    if (!data || data.length === 0) return <div className="p-8 text-center text-zinc-500 italic">No vulnerabilities discovered.</div>;
    
    return (
        <div className="overflow-y-auto h-[600px] minimal-scrollbar">
            <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-zinc-50 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-500 text-xs uppercase font-semibold border-b border-zinc-200 dark:border-zinc-800 z-10">
                    <tr>
                        <th className="px-6 py-4">Severity</th>
                        <th className="px-6 py-4">Vulnerability</th>
                        <th className="px-6 py-4">Host</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-mono text-sm">
                    <AnimatePresence>
                        {data.map((item, idx) => (
                            <motion.tr 
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} layout
                                key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                            >
                                <td className="px-6 py-3.5">
                                    <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider", getSeverityStyles(item.severity))}>
                                        {item.severity || 'UNKNOWN'}
                                    </span>
                                </td>
                                <td className="px-6 py-3.5 dark:text-zinc-200 font-sans font-medium">{item.name}</td>
                                <td className="px-6 py-3.5">
                                    <a href={item.matched_at || item.host} target="_blank" rel="noreferrer" className="text-accent-600 dark:text-accent-400 hover:underline flex items-center gap-1.5 w-fit">
                                        <span className="truncate max-w-[200px] block">{item.matched_at || item.host}</span>
                                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                    </a>
                                </td>
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                </tbody>
            </table>
        </div>
    );
}
