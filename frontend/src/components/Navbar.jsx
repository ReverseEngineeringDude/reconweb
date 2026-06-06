import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Shield } from 'lucide-react';
import { cn } from '../lib/utils';

const links = [
  { name: 'New Scan', path: '/' },
  { name: 'History', path: '/history' }
];

export default function Navbar({ theme, toggleTheme }) {
  const location = useLocation();
  const [hoveredPath, setHoveredPath] = useState(location.pathname);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-panel border-x-0 border-t-0 rounded-none h-16 flex items-center px-6 transition-colors duration-500">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-accent-500 text-white flex items-center justify-center shadow-lg shadow-accent-500/20 group-hover:scale-105 transition-transform duration-300">
            <Shield size={18} strokeWidth={2.5} />
          </div>
          <span className="font-bold tracking-tight text-lg dark:text-white">RECON<span className="font-light opacity-50">WEB</span></span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onMouseEnter={() => setHoveredPath(link.path)}
                onMouseLeave={() => setHoveredPath(location.pathname)}
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-colors z-10",
                  location.pathname === link.path ? "text-accent-600 dark:text-accent-400" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
              >
                {hoveredPath === link.path && (
                  <motion.div
                    layoutId="navBubble"
                    className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.8 }}
                  />
                )}
                {link.name}
              </Link>
            ))}
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'dark' ? 180 : 0, scale: theme === 'dark' ? 0.8 : 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </motion.div>
          </button>
        </div>
      </div>
    </nav>
  );
}
