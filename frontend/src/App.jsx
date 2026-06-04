import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScanForm from './components/ScanForm';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-emerald-500/30">
        <nav className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <span className="font-mono font-bold text-black text-lg">R</span>
              </div>
              <h1 className="text-xl font-bold tracking-widest text-white">RECON<span className="text-emerald-400 font-light">WEB</span></h1>
            </div>
            <a href="/" className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors">New Scan</a>
          </div>
        </nav>
        <main className="p-6 md:p-8">
          <Routes>
            <Route path="/" element={<ScanForm />} />
            <Route path="/scan/:id" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
