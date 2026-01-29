
import React from 'react';
import { WineInfo, WineDryness } from '../types';
import { ChevronLeft, Info, GlassWater, Utensils, Droplets, MapPin } from 'lucide-react';

interface WineDetailsProps {
  wine: WineInfo;
  onClose: () => void;
}

const WineDetails: React.FC<WineDetailsProps> = ({ wine, onClose }) => {
  const getDrynessColor = (dryness: string) => {
    switch (dryness) {
      case WineDryness.DRY: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case WineDryness.SEMI_DRY: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case WineDryness.SEMI_SWEET: return 'bg-orange-100 text-orange-800 border-orange-200';
      case WineDryness.SWEET: return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-6">
      <button 
        onClick={onClose}
        className="flex items-center gap-2 text-[#722f37] font-semibold text-sm hover:translate-x-[-4px] transition-transform"
      >
        <ChevronLeft className="w-4 h-4" />
        Wróć do skanera
      </button>

      <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-stone-100 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#722f37]/5 rounded-bl-[100px] pointer-events-none" />

        <div className="flex flex-col gap-4">
          <div>
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border ${getDrynessColor(wine.dryness)} mb-4`}>
              {wine.dryness.toUpperCase()}
            </span>
            <h2 className="text-3xl font-bold text-stone-900 leading-tight mb-2">{wine.name}</h2>
            <div className="flex items-center gap-1.5 text-stone-500 text-sm font-medium">
              <MapPin className="w-4 h-4" />
              {wine.region}, Italia
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 my-4">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
              <div className="flex items-center gap-2 text-stone-400 mb-1">
                <GlassWater className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Odmiana</span>
              </div>
              <p className="text-xs font-semibold text-stone-800">{wine.grapeType}</p>
            </div>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
              <div className="flex items-center gap-2 text-stone-400 mb-1">
                <Droplets className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Alkohol</span>
              </div>
              <p className="text-xs font-semibold text-stone-800">{wine.alcoholContent}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif italic text-lg text-stone-800 flex items-center gap-2">
              <Info className="w-5 h-5 text-[#722f37]" />
              Notatki sommeliera
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              {wine.description}
            </p>
          </div>

          <div className="mt-4 pt-6 border-t border-stone-100">
            <h3 className="font-serif italic text-lg text-stone-800 flex items-center gap-2 mb-4">
              <Utensils className="w-5 h-5 text-[#722f37]" />
              Propozycje podania
            </h3>
            <div className="flex flex-wrap gap-2">
              {wine.pairings.map((pair, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-stone-100 text-stone-700 text-xs rounded-lg font-medium">
                  {pair}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#722f37] text-white p-6 rounded-[2rem] shadow-lg flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">Poziom słodyczy</p>
          <p className="text-xl font-serif">{wine.dryness}</p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <WineDrynessIcon dryness={wine.dryness} />
        </div>
      </div>
    </div>
  );
};

const WineDrynessIcon: React.FC<{ dryness: string }> = ({ dryness }) => {
  // Simple representation of sugar level
  const levels = {
    [WineDryness.DRY]: 1,
    [WineDryness.SEMI_DRY]: 2,
    [WineDryness.SEMI_SWEET]: 3,
    [WineDryness.SWEET]: 4,
    default: 0
  };
  const level = levels[dryness as keyof typeof levels] || 0;
  
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4].map((i) => (
        <div 
          key={i} 
          className={`w-2 h-4 rounded-full ${i <= level ? 'bg-white' : 'bg-white/30'}`} 
        />
      ))}
    </div>
  );
};

export default WineDetails;
