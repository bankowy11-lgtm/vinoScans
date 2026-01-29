
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, RefreshCw, X, CameraIcon, ImagePlus } from 'lucide-react';

interface ScannerProps {
  onCapture: (base64Image: string) => void;
  isProcessing: boolean;
}

const Scanner: React.FC<ScannerProps> = ({ onCapture, isProcessing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const constraints = {
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setStream(newStream);
      setError(null);
    } catch (err) {
      setError("Brak dostępu do kamery. Upewnij się, że udzieliłeś uprawnień.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        onCapture(base64);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        onCapture(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="relative aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-stone-900">
            <X className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-sm font-medium">{error}</p>
            <button 
              onClick={startCamera}
              className="mt-6 px-6 py-2 bg-white text-black rounded-full text-xs font-bold"
            >
              Spróbuj ponownie
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            {/* Animated Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[80%] h-[40%] border-2 border-dashed border-white/50 rounded-lg relative">
                 <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#722f37]" />
                 <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#722f37]" />
                 <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#722f37]" />
                 <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#722f37]" />
                 
                 {/* Scanner Line */}
                 <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#722f37] shadow-[0_0_15px_#722f37] animate-scanline" />
              </div>
            </div>

            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
                <p className="text-sm font-serif italic tracking-wide">Analizuję bukiet i strukturę...</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-center text-stone-500 text-xs font-medium">
          Umieść kod kreskowy lub etykietę w ramce
        </p>
        
        <div className="flex justify-center items-center gap-4">
          <label className="w-14 h-14 bg-stone-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-stone-300 transition-colors">
            <ImagePlus className="w-6 h-6 text-stone-600" />
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>

          <button 
            onClick={captureImage}
            disabled={isProcessing || !!error}
            className="w-20 h-20 bg-[#722f37] rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            <CameraIcon className="w-10 h-10 text-white" />
          </button>

          <button 
            onClick={startCamera}
            className="w-14 h-14 bg-stone-200 rounded-full flex items-center justify-center hover:bg-stone-300 transition-colors"
          >
            <RefreshCw className="w-6 h-6 text-stone-600" />
          </button>
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
      
      <style>{`
        @keyframes scanline {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scanline {
          animation: scanline 2.5s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default Scanner;
