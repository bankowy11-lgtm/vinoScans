
import React, { useState } from 'react';
import { WineInfo, WineDryness } from '../types';
import { ChevronLeft, Info, GlassWater, Utensils, Droplets, MapPin, Volume2, ThermometerSun, ShieldCheck, Loader2 } from 'lucide-react';
import { speakSommelierNotes } from '../services/geminiService';

interface WineDetailsProps {
  wine: WineInfo;
  onClose: () => void;
}

const WineDetails: React.FC<WineDetailsProps> = ({ wine, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      await speakSommelierNotes(wine.description);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsPlaying(false), 5000); // Proste zabezpieczenie czasu trwania
    }
  };

  const getDrynessColor = (dryness: string) => {
    switch (dryness) {
      case WineDryness.DRY: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case WineDryness.SEMI_DRY: return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case WineDryness.SEMI_SWEET: return 'bg-orange-50 text-orange-700 border-orange-100';
      case WineDryness.SWEET: return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-stone-50 text-stone-700 border-stone-100';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col gap-6 pb-20">
      <button 
        onClick={onClose}
        className="flex items-center gap-2 text-[#722f37] font-semibold text-sm hover:translate-x-[-4px] transition-transform w-fit"
      >
        <ChevronLeft className="w-4 h-4" />
        Powrót do skanera
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-stone-100 relative overflow-hidden">
        {/* Luxury Header Accent */}
        <div className="h-32 bg-[#4a0e0e] relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="absolute -bottom-10 left-8">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-stone-100">
               <ShieldCheck className="w-10 h-10 text-[#c5a059]" />
            </div>
          </div>
        </div>

        <div className="p-8 pt-14 flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getDrynessColor(wine.dryness)}`}>
                  {wine.dryness}
                </span>
                {wine.classification && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#c5a059] bg-[#c5a059]/10 text-[#8a6d3b]">
                    {wine.classification}
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-bold text-stone-900 leading-tight">{wine.name}</h2>
              <p className="flex items-center gap-1 text-stone-400 text-sm mt-1">
                <MapPin className="w-3.5 h-3.5" /> {wine.region}, Włochy
              </p>
            </div>
            
            <button 
              onClick={handleSpeak}
              disabled={isPlaying}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-stone-100 text-stone-400' : 'bg-[#722f37] text-white shadow-lg active:scale-90'}`}
            >
              {isPlaying ? <Loader2 className="w-6 h-6 animate-spin" /> : <Volume2 className="w-6 h-6" />}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <DetailCard icon={<GlassWater />} label="Szczep" value={wine.grapeType} />
            <DetailCard icon={<Droplets />} label="Alkohol" value={wine.alcoholContent} />
            <DetailCard icon={<ThermometerSun />} label="Temp." value={wine.servingTemp || '16-18°C'} />
          </div>

          <div className="space-y-4">
            <h3 className="font-serif italic text-xl text-stone-800 flex items-center gap-2 border-b border-stone-100 pb-2">
              <Info className="w-5 h-5 text-[#c5a059]" />
              Charakterystyka
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed italic">
              "{wine.description}"
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif italic text-xl text-stone-800 flex items-center gap-2 border-b border-stone-100 pb-2">
              <Utensils className="w-5 h-5 text-[#c5a059]" />
              Food Pairing
            </h3>
            <div className="flex flex-wrap gap-2">
              {wine.pairings.map((p, i) => (
                <span key={i} className="px-4 py-2 bg-stone-50 text-stone-600 text-[11px] rounded-xl font-semibold border border-stone-100">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="bg-stone-50/50 p-3 rounded-2xl border border-stone-100 flex flex-col items-center text-center">
    <div className="text-[#c5a059] mb-1 opacity-80">{icon}</div>
    <span className="text-[9px] uppercase font-bold text-stone-400 tracking-tighter mb-0.5">{label}</span>
    <span className="text-[10px] font-bold text-stone-800 truncate w-full">{value}</span>
  </div>
);

export default WineDetails;
