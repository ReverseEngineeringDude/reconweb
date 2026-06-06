import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SubdomainTable({ data }) {
    if (!data || data.length === 0) return <div className="p-8 text-center text-zinc-500 italic">No subdomains discovered yet.</div>;
    
    return (
        <div className="overflow-y-auto h-[600px] minimal-scrollbar">
            <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-zinc-50 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-500 text-xs uppercase font-semibold border-b border-zinc-200 dark:border-zinc-800 z-10">
                    <tr>
                        <th className="px-6 py-4">Subdomain</th>
                        <th className="px-6 py-4 w-32">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-mono text-sm">
                    <AnimatePresence>
                        {data.map((item, idx) => (
                            <motion.tr 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0, transition: { delay: idx * 0.02, type: 'spring', stiffness: 100 } }} 
                                layout
                                key={item.host + idx} 
                                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                            >
                                <td className="px-6 py-3.5">
                                    <a href={`http://${item.host}`} target="_blank" rel="noreferrer" className="dark:text-zinc-300 hover:text-accent-500 flex items-center gap-2 w-fit transition-colors">
                                        {item.host}
                                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </td>
                                <td className="px-6 py-3.5">
                                    <span className={cn("inline-flex px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider", item.status === 'found' ? "bg-accent-500/10 text-accent-500" : "bg-red-500/10 text-red-500")}>
                                        {item.status}
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                </tbody>
            </table>
        </div>
    );
}
