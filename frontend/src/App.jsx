import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ScanForm from './components/ScanForm';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Navbar from './components/Navbar';

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<ScanForm />} />
        <Route path="/scan/:id" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans selection:bg-accent-500/30 transition-colors duration-500">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="p-4 md:p-8 pt-24 relative z-10 min-h-screen flex flex-col items-center">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
