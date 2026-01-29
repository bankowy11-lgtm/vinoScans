
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Scanner from './components/Scanner';
import WineDetails from './components/WineDetails';
import { identifyWineFromImage } from './services/geminiService';
import { WineInfo } from './types';
import { AlertCircle, History, Trash2, Clock } from 'lucide-react';

const App: React.FC = () => {
  const [currentWine, setCurrentWine] = useState<WineInfo | null>(null);
  const [history, setHistory] = useState<WineInfo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('wine_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Błąd ładowania historii");
      }
    }
  }, []);

  const saveToHistory = (wine: WineInfo) => {
    const newHistory = [wine, ...history.filter(h => h.name !== wine.name)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('wine_history', JSON.stringify(newHistory));
  };

  const handleCapture = async (base64Image: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const result = await identifyWineFromImage(base64Image);
      setCurrentWine(result);
      saveToHistory(result);
    } catch (err: any) {
      setError(err.message || "Błąd analizy obrazu.");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('wine_history');
  };

  return (
    <Layout>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      {!currentWine ? (
        <div className="space-y-10 pb-10">
          <div className="space-y-1">
            <h2 className="text-4xl font-bold text-stone-900">Benvenuto.</h2>
            <p className="text-stone-400 font-light text-lg">Odkryj duszę włoskich winnic.</p>
          </div>
          
          <Scanner onCapture={handleCapture} isProcessing={isProcessing} />
          
          {history.length > 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-xl text-stone-800 flex items-center gap-2">
                  <History className="w-5 h-5 text-[#c5a059]" />
                  Ostatnie degustacje
                </h3>
                <button onClick={clearHistory} className="text-stone-300 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid gap-3">
                {history.map((wine) => (
                  <div 
                    key={wine.id || wine.name}
                    onClick={() => setCurrentWine(wine)}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between hover:border-[#c5a059] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#722f37]/5 rounded-xl flex items-center justify-center text-[#722f37] group-hover:bg-[#722f37] group-hover:text-white transition-colors">
                        <History className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-800">{wine.name}</p>
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest">{wine.region}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-stone-300">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px]">zapisano</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <WineDetails wine={currentWine} onClose={() => setCurrentWine(null)} />
      )}
    </Layout>
  );
};

export default App;
