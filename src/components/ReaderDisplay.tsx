import { useEffect, useState } from 'react';
import { Volume2, VolumeX, RotateCcw, HelpCircle, X } from 'lucide-react';
import { motion } from 'motion/react';
import { VoiceGender } from '../types';

interface ReaderDisplayProps {
  text: string;
  onExplain: () => void;
  onClose: () => void;
  isProcessing: boolean;
  voiceGender: VoiceGender;
}

export default function ReaderDisplay({ text, onExplain, onClose, isProcessing, voiceGender }: ReaderDisplayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (text && !isProcessing) {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      u.pitch = 1.0;
      u.onend = () => setIsPlaying(false);
      u.onstart = () => setIsPlaying(true);
      setUtterance(u);
      
      const voices = window.speechSynthesis.getVoices();
      const findVoice = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        const preferredVoices = availableVoices.filter(v => v.lang.startsWith('en'));
        
        let selectedVoice = null;
        if (voiceGender === 'male') {
          selectedVoice = preferredVoices.find(v => 
            v.name.toLowerCase().includes('male') || 
            v.name.toLowerCase().includes('david') || 
            v.name.toLowerCase().includes('guy') ||
            v.name.toLowerCase().includes('daniel')
          );
        } else {
          selectedVoice = preferredVoices.find(v => 
            v.name.toLowerCase().includes('female') || 
            v.name.toLowerCase().includes('samantha') || 
            v.name.toLowerCase().includes('victoria') ||
            v.name.toLowerCase().includes('lisa')
          );
        }

        if (selectedVoice) {
          u.voice = selectedVoice;
        } else if (preferredVoices.length > 0) {
          u.voice = preferredVoices[0];
        }
        
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      };

      if (voices.length > 0) {
        findVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = findVoice;
      }
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [text, isProcessing, voiceGender]);

  const togglePlayback = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else if (utterance) {
        window.speechSynthesis.speak(utterance);
      }
      setIsPlaying(true);
    }
  };

  const restart = () => {
    window.speechSynthesis.cancel();
    if (utterance) window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="absolute inset-x-0 bottom-0 top-1/4 bg-slate-950 rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] border-t border-slate-800 p-8 flex flex-col z-40 overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-teal-400 font-bold uppercase tracking-widest text-lg">AI Vision</h2>
        <button 
          onClick={onClose}
          className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400"
        >
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto mb-8 pr-2 custom-scrollbar">
        {isProcessing ? (
          <div className="h-full flex items-center justify-center flex-col gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full"
            />
            <p className="text-slate-400 font-medium italic">Translating to simple language...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {text.includes('EXPLAINED:') ? (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 bg-teal-500/10 border-l-4 border-teal-500 rounded-r-2xl"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 mb-3">Simple Explanation</p>
                  <p className="text-2xl md:text-3xl font-black leading-tight text-white italic">
                    {text.split('ORIGINAL:')[0].replace('EXPLAINED:', '').trim()}
                  </p>
                </motion.div>

                <div className="px-6 opacity-30">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Original Text</p>
                  <p className="text-lg font-medium leading-relaxed text-slate-300">
                    {text.split('ORIGINAL:')[1]?.trim()}
                  </p>
                </div>
              </>
            ) : text.includes('SPELLING:') ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400 mb-8 underline underline-offset-8">Spelling Assistant</p>
                 <p className="text-4xl md:text-6xl font-black text-white tracking-[0.2em] mb-12 animate-pulse break-all px-4">
                   {text.split('SPELLING:')[1]?.split('\n\n')[0].trim()}
                 </p>
                 <p className="text-xl font-black text-slate-500 uppercase tracking-[0.3em] italic">
                  {text.split('\n\n')[1]?.trim()}
                 </p>
              </div>
            ) : (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl md:text-3xl font-medium leading-relaxed text-slate-100"
              >
                {text || "No text detected. Try adjusting the camera."}
              </motion.p>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-4 pb-4">
        <button
          onClick={restart}
          className="flex flex-col items-center justify-center bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:bg-slate-800 transition-colors"
          aria-label="Repeat Reading"
        >
          <RotateCcw size={32} className="text-slate-400 mb-2" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">Repeat</span>
        </button>

        <button
          onClick={togglePlayback}
          className="flex flex-col items-center justify-center bg-teal-500 p-6 rounded-3xl shadow-[0_10px_30px_rgba(45,212,191,0.3)] active:scale-95 transition-transform"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <VolumeX size={40} className="text-black" /> : <Volume2 size={40} className="text-black" />}
          <span className="text-[10px] font-black uppercase tracking-widest text-black mt-2">
            {isPlaying ? "Pause" : "Listen"}
          </span>
        </button>

        {!text.includes('EXPLAINED:') && (
          <button
            onClick={onExplain}
            className="flex flex-col items-center justify-center bg-amber-400 p-6 rounded-3xl shadow-[0_10px_30px_rgba(251,191,36,0.2)] active:scale-95 transition-transform"
            aria-label="Ask AI to Explain Simply"
          >
            <HelpCircle size={32} className="text-black mb-2" />
            <span className="text-[10px] font-black uppercase tracking-widest text-black/60">Explain</span>
          </button>
        )}
        
        {text.includes('EXPLAINED:') && (
           <button
           onClick={onClose}
           className="flex flex-col items-center justify-center bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:bg-slate-800 transition-colors"
           aria-label="Dismiss"
         >
           <X size={32} className="text-slate-400 mb-2" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Dismiss</span>
         </button>
        )}
      </div>
    </motion.div>
  );
}
