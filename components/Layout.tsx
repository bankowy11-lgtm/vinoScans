
import React from 'react';
import { Wine, Info, Scan } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-[#faf7f2] shadow-2xl relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#4a0e0e] opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#1a3a1a] opacity-5 rounded-full -ml-24 -mb-24 pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-6 border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#722f37] rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
            <Wine className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#2d2a2a] leading-none">VinoScans</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#722f37] font-semibold mt-1">Italia Edition</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 relative">
        {children}
      </main>

      {/* Footer Nav */}
      <nav className="bg-white border-t border-stone-200 px-8 py-4 flex justify-around items-center sticky bottom-0">
        <button className="flex flex-col items-center gap-1 text-[#722f37]">
          <Scan className="w-6 h-6" />
          <span className="text-[10px] font-medium">Skaner</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-stone-400 opacity-50 cursor-not-allowed">
          <Wine className="w-6 h-6" />
          <span className="text-[10px] font-medium">Kolekcja</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-stone-400 opacity-50 cursor-not-allowed">
          <Info className="w-6 h-6" />
          <span className="text-[10px] font-medium">O nas</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
