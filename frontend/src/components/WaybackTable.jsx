import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Copy, ExternalLink, Check } from 'lucide-react';

export default function WaybackTable({ data }) {
    const [filter, setFilter] = useState('');
    const [copied, setCopied] = useState(false);

    if (!data || data.length === 0) return <div className="p-8 text-center text-zinc-500 italic">No archived URLs found.</div>;
    
    const filteredData = data.filter(item => (item.url || '').toLowerCase().includes(filter.toLowerCase()));

    const handleCopy = () => {
        const urls = filteredData.map(item => item.url).join('\n');
        navigator.clipboard.writeText(urls);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col h-[600px]">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-zinc-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Filter URLs..." 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 font-sans text-sm transition-all"
                    />
                </div>
                <button 
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 py-2 px-4 rounded-xl font-medium transition-colors sm:w-auto w-full text-sm"
                >
                    {copied ? <Check size={16} className="text-accent-500" /> : <Copy size={16} />}
                    {copied ? 'Copied' : 'Copy All'}
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto minimal-scrollbar">
                <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 font-mono text-sm">
                    <AnimatePresence>
                        {filteredData.slice(0, 500).map((item, idx) => (
                            <motion.li 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout
                                key={idx} className="p-3 px-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group flex items-center justify-between gap-4"
                            >
                                <span className="truncate text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors" title={item.url}>
                                    {item.url}
                                </span>
                                <a 
                                    href={item.url} target="_blank" rel="noreferrer"
                                    className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-accent-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                                >
                                    <ExternalLink size={16} />
                                </a>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            </div>
            <div className="p-3 text-right text-xs text-zinc-500 font-mono border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                Showing {Math.min(filteredData.length, 500)} of {data.length} URLs
            </div>
        </div>
    );
}
