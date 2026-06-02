import { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'motion/react';

interface VoiceControllerProps {
  onCommand: (command: string) => void;
  isListening: boolean;
}

export default function VoiceController({ onCommand, isListening }: VoiceControllerProps) {
  const [isActive, setIsActive] = useState(false);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      // Check for speech recognition support
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.warn('Speech recognition not supported in this browser.');
        return;
      }
  
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
  
      recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.toLowerCase().trim();
        console.log('Voice Command:', command);
        setError(null);
        
        const keywords = ['read', 'scan', 'what', 'help', 'explain', 'this', 'mean', 'lens', 'spell', 'how do you', 'write'];
        if (keywords.some(k => command.includes(k))) {
          onCommand(command);
        }
      };
  
      recognition.onerror = (event: any) => {
        if (event.error === 'aborted') {
          console.log('Speech recognition aborted (context change).');
          return;
        }

        console.error('Speech Recognition Error:', event.error);
        
        if (event.error === 'network') {
          setError('Network error: Voice service unavailable offline.');
          // Auto-retry network after 5 seconds if still active
          setTimeout(() => {
            if (isActive && !error) {
               try { recognition.start(); } catch(e) {}
            }
          }, 5000);
        } else if (event.error === 'not-allowed') {
          setError('Microphone access denied.');
          setIsActive(false);
        } else {
          setError(`Voice error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        // If it ended unexpectedly while active, restart it
        if (isActive && isListening && !error) {
           try { recognition.start(); } catch(e) {}
        }
      };
  
      if (isListening && isActive) {
        try {
          recognition.start();
          setError(null);
        } catch (e) {
          // Recognition already started
        }
      }
  
      return () => {
        try {
          recognition.stop();
        } catch (e) {}
      };
    }, [isListening, isActive, onCommand]);
  
    return (
      <div className="fixed top-8 right-8 z-50 flex flex-col items-end gap-3">
        <button
          onClick={() => {
            setIsActive(!isActive);
            setError(null);
          }}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            isActive 
              ? 'bg-teal-500 shadow-[0_0_20px_rgba(45,212,191,0.6)]' 
              : 'bg-slate-800 border border-slate-700'
          } ${error ? 'border-red-500 border-2' : ''}`}
          aria-label={isActive ? "Stop Voice Interaction" : "Start Voice Interaction"}
          id="voice-toggle"
        >
          {isActive ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Mic size={32} className="text-white" />
            </motion.div>
          ) : (
            <MicOff size={32} className={error ? 'text-red-400' : 'text-slate-400'} />
          )}
        </button>
        
        {isActive && !error && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg text-teal-400 text-sm font-mono shadow-xl border border-teal-500/20"
          >
            Listening for "Read this"
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-950/80 backdrop-blur-md px-4 py-3 rounded-2xl text-red-200 text-xs font-bold border border-red-500/30 shadow-2xl max-w-[200px] text-right"
          >
            {error}
          </motion.div>
        )}
      </div>
    );
}
