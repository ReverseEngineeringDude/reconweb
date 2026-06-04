import React, { useState } from 'react';
import { Search, Copy, ExternalLink, Check } from 'lucide-react';

export default function WaybackTable({ data }) {
    const [filter, setFilter] = useState('');
    const [copied, setCopied] = useState(false);

    if (!data || data.length === 0) return <div className="text-slate-500 py-4 text-center italic">No archived URLs found.</div>;
    
    const filteredData = data.filter(item => (item.url || '').toLowerCase().includes(filter.toLowerCase()));

    const handleCopy = () => {
        const urls = filteredData.map(item => item.url).join('\n');
        navigator.clipboard.writeText(urls);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col h-[500px]">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-slate-500" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Filter URLs by path, query params, etc..." 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full bg-slate-900/80 text-emerald-400 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-sm shadow-inner transition-all"
                    />
                </div>
                <button 
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 hover:border-slate-500 py-2.5 px-6 rounded-lg font-medium transition-colors sm:w-auto w-full"
                >
                    {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                    {copied ? 'COPIED!' : 'COPY ALL'}
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar rounded-lg border border-slate-800 bg-slate-900/20">
                {filteredData.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 italic">No URLs match your filter.</div>
                ) : (
                    <ul className="divide-y divide-slate-800/60 font-mono text-sm">
                        {filteredData.map((item, idx) => (
                            <li key={idx} className="p-3 hover:bg-slate-800/40 transition-colors group flex items-center justify-between gap-4">
                                <span className="truncate text-slate-400 group-hover:text-slate-300 transition-colors" title={item.url}>
                                    {item.url}
                                </span>
                                <a 
                                    href={item.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="p-1.5 rounded-md bg-slate-800/50 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                                >
                                    <ExternalLink size={16} />
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="mt-2 text-right text-xs text-slate-500 font-mono">
                Showing {filteredData.length} of {data.length} URLs
            </div>
        </div>
    );
}
