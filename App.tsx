
import React, { useState } from 'react';
import Layout from './components/Layout';
import Scanner from './components/Scanner';
import WineDetails from './components/WineDetails';
import { identifyWineFromImage } from './services/geminiService';
import { WineInfo } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentWine, setCurrentWine] = useState<WineInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (base64Image: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const result = await identifyWineFromImage(base64Image);
      setCurrentWine(result);
    } catch (err: any) {
      setError(err.message || "Wystąpił nieoczekiwany błąd podczas analizy.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScanner = () => {
    setCurrentWine(null);
    setError(null);
  };

  return (
    <Layout>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800 font-medium">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-xs text-red-600 font-bold underline"
            >
              Rozumiem
            </button>
          </div>
        </div>
      )}

      {!currentWine ? (
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-stone-900 tracking-tight">Cześć!</h2>
            <p className="text-stone-500 font-light text-lg">Zeskanuj etykietę, aby odkryć sekret włoskiego trunku.</p>
          </div>
          
          <Scanner onCapture={handleCapture} isProcessing={isProcessing} />
          
          <div className="bg-white/60 p-6 rounded-3xl border border-stone-200">
            <h3 className="font-bold text-stone-800 text-sm mb-2">Jak to działa?</h3>
            <ul className="text-xs text-stone-500 space-y-2 leading-relaxed">
              <li className="flex gap-2">
                <span className="w-4 h-4 bg-[#722f37] text-white rounded-full flex items-center justify-center shrink-0">1</span>
                Skieruj aparat na etykietę lub kod kreskowy wina.
              </li>
              <li className="flex gap-2">
                <span className="w-4 h-4 bg-[#722f37] text-white rounded-full flex items-center justify-center shrink-0">2</span>
                Nasza sztuczna inteligencja przeanalizuje detale.
              </li>
              <li className="flex gap-2">
                <span className="w-4 h-4 bg-[#722f37] text-white rounded-full flex items-center justify-center shrink-0">3</span>
                Dowiedz się wszystkiego o smaku i słodkości!
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <WineDetails wine={currentWine} onClose={resetScanner} />
      )}
    </Layout>
  );
};

export default App;
