import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, RefreshCw, Image as ImageIcon, Clipboard, Zap, ZapOff, Play, Square, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CameraViewProps {
  onCapture: (blob: string) => void;
  isScanning: boolean;
  onReadClipboard: () => void;
  isContinuous: boolean;
  setIsContinuous: (val: boolean) => void;
}

export default function CameraView({ onCapture, isScanning, onReadClipboard, isContinuous, setIsContinuous }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const lastCaptureTime = useRef(0);

  useEffect(() => {
    let interval: any;
    if (isContinuous && !isScanning) {
      interval = setInterval(() => {
        const now = Date.now();
        if (now - lastCaptureTime.current > 5000) { // Capture every 5 seconds in continuous mode
          captureFrame();
          lastCaptureTime.current = now;
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isContinuous, isScanning]);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          const track = stream.getVideoTracks()[0];
          const capabilities = track.getCapabilities() as any;
          if (capabilities.torch) {
            setHasTorch(true);
          }
        }
      } catch (err) {
        console.error('Camera Error:', err);
        setError('Camera access denied. Please enable camera permissions.');
      }
    }

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const toggleTorch = async () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const track = stream.getVideoTracks()[0];
      try {
        await track.applyConstraints({
          advanced: [{ torch: !isTorchOn } as any]
        });
        setIsTorchOn(!isTorchOn);
      } catch (err) {
        console.error('Torch Error:', err);
      }
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      {error ? (
        <div className="flex flex-col items-center justify-center max-w-md mx-auto p-8 text-center text-white">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.15)] animate-pulse">
            <CameraOff size={28} className="text-red-400" />
          </div>
          
          <h2 className="text-2xl font-black mb-2 text-slate-100 tracking-tight italic">Camera Access Disallowed</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-bold mb-6">
            To read documents, medicine bottles, or letters, VoiceLens needs camera permissions. You can enable them, or use an alternative below:
          </p>

          <div className="w-full space-y-3 mb-8 text-slate-300">
            <div className="flex items-start gap-3 text-left bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[10px] font-black text-teal-400">1</span>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-300">Grant Permission</p>
                <p className="text-[11px] text-slate-500 font-bold mt-0.5">Tap the lock icon 🔒 next to the web address above, or look for device/browser site permissions, and toggle Camera to "Allow".</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[10px] font-black text-teal-400">2</span>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-300">Device Settings</p>
                <p className="text-[11px] text-slate-500 font-bold mt-0.5">If on a mobile device, make sure system-wide camera permissions for this app (or your browser app) are turned ON.</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 w-full">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 text-black rounded-xl font-bold text-xs uppercase tracking-wider active:scale-95 transition-transform hover:shadow-[0_0_20px_rgba(45,212,191,0.3)]"
            >
              <RefreshCw size={14} />
              Retry
            </button>
            <button 
              onClick={() => document.getElementById('gallery-input')?.click()}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 border border-slate-800 text-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider active:scale-95 transition-transform hover:bg-slate-800"
            >
              <ImageIcon size={14} className="text-teal-400" />
              Upload Photo
            </button>
          </div>

          <button 
            onClick={onReadClipboard}
            className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-teal-400/80 hover:text-teal-400 active:scale-95 transition-transform"
          >
            <Clipboard size={14} />
            Read Clipboard Text Instead
          </button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover grayscale-[0.2] brightness-[0.8]"
          />
          
          <AnimatePresence>
            {(isScanning || isContinuous) && (
              <motion.div
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ 
                  duration: isContinuous ? 2 : 1.5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className={`absolute left-0 w-full h-1 z-10 ${
                  isContinuous ? 'bg-amber-400 shadow-[0_0_15px_#fbbf24]' : 'bg-teal-400 shadow-[0_0_15px_#2dd4bf]'
                }`}
              />
            )}
          </AnimatePresence>

          <canvas ref={canvasRef} className="hidden" />

          {/* Guide Frame */}
          <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
            <div className="w-full h-full border-2 border-dashed border-teal-500/30 rounded-xl" />
          </div>

          <div className="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-6 pointer-events-auto px-4 translate-y-[-20px]">
             <button
              onClick={() => document.getElementById('gallery-input')?.click()}
              className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center pointer-events-auto active:scale-95 transition-transform"
              aria-label="Upload from Gallery"
            >
              <ImageIcon size={20} className="text-white/60" />
            </button>

             <button
              onClick={captureFrame}
              disabled={isScanning}
              className={`w-24 h-24 rounded-full backdrop-blur-md border-4 flex items-center justify-center pointer-events-auto active:scale-95 transition-all hover:shadow-2xl ${
                isContinuous 
                  ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_30px_rgba(251,191,36,0.3)]' 
                  : 'border-teal-500 bg-white/10'
              }`}
              aria-label="Take Photo"
              id="capture-btn"
            >
              {isContinuous ? (
                <RotateCcw size={40} className="text-amber-400 animate-spin-slow" />
              ) : (
                <Camera size={40} className="text-teal-400" />
              )}
            </button>

            <button
              onClick={() => setIsContinuous(!isContinuous)}
              className={`w-14 h-14 rounded-full backdrop-blur-md border transition-all flex items-center justify-center active:scale-95 ${
                isContinuous 
                  ? 'bg-amber-400 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)]' 
                  : 'bg-black/40 border-white/10'
              }`}
              aria-label="Toggle Continuous Mode"
            >
              {isContinuous ? <Square size={20} className="text-black" /> : <Play size={20} className="text-white/60" />}
            </button>

            {hasTorch && (
              <button
                onClick={toggleTorch}
                className={`w-14 h-14 rounded-full backdrop-blur-md border transition-all pointer-events-auto active:scale-95 flex items-center justify-center ${
                  isTorchOn 
                    ? 'bg-amber-400 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)]' 
                    : 'bg-black/40 border-white/10'
                }`}
                aria-label="Toggle Flashlight"
              >
                {isTorchOn ? <Zap size={20} className="text-black" /> : <ZapOff size={20} className="text-white/60" />}
              </button>
            )}
          </div>
          
          {isContinuous && (
            <div className="absolute top-28 left-0 right-0 flex justify-center pointer-events-none">
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-amber-400/20 backdrop-blur-md border border-amber-400/30 px-6 py-2 rounded-full flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest italic">Eyes Through Audio Mode</span>
              </motion.div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
