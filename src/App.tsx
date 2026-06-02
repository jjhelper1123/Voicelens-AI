import React, { useState, useCallback, useEffect } from 'react';
import CameraView from './components/CameraView';
import ReaderDisplay from './components/ReaderDisplay';
import VoiceController from './components/VoiceController';
import Onboarding from './components/Onboarding';
import Settings from './components/Settings';
import PublishingGuide from './components/PublishingGuide';
import { analyzeImage } from './lib/api';
import { AnimatePresence, motion } from 'motion/react';
import { Eye, Settings as SettingsIcon, HelpCircle } from 'lucide-react';
import { VoiceGender } from './types';

export default function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [isContinuousMode, setIsContinuousMode] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [lastImage, setLastImage] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPublishingGuide, setShowPublishingGuide] = useState(false);
  const [voiceGender, setVoiceGender] = useState<VoiceGender>(() => {
    return (localStorage.getItem('voice-lens-gender') as VoiceGender) || 'female';
  });

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('voice-lens-onboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('voice-lens-onboarding', 'true');
    setShowOnboarding(false);
  };

  const handleVoiceGenderChange = (gender: VoiceGender) => {
    setVoiceGender(gender);
    localStorage.setItem('voice-lens-gender', gender);
  };

  const handleCapture = useCallback(async (base64Image: string) => {
    setIsScanning(true);
    setLastImage(base64Image);
    try {
      const data = await analyzeImage(base64Image, 'ocr');
      // If text is very similar to what we just read, skip it in continuous mode
      if (isContinuousMode && result && data.text.substring(0, 30) === result.substring(0, 30)) {
        return;
      }
      setResult(data.text);
    } catch (err: any) {
      console.error(err);
      if (!isContinuousMode) {
        setResult(err.message || "Error reading text. Please try again.");
      }
    } finally {
      setIsScanning(false);
    }
  }, [isContinuousMode, result]);

  const handleExplain = async () => {
    if (!lastImage) return;
    setIsExplaining(true);
    try {
      const data = await analyzeImage(lastImage, 'explain');
      setResult(data.text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExplaining(false);
    }
  };

  const handleVoiceCommand = (command: string) => {
    console.log('App received voice command:', command);
    
    // Spelling help
    if (command.includes('spell') || command.includes('how do you write')) {
      const words = command.split(' ');
      const lastWord = words[words.length - 1];
      if (lastWord && lastWord !== 'spell' && lastWord !== 'write') {
        const spelling = lastWord.toUpperCase().split('').join('-');
        setResult(`SPELLING:\n${spelling}\n\n${lastWord}`);
        return;
      }
    }

    if (command.includes('read') || command.includes('scan') || command.includes('what')) {
      const captureBtn = document.getElementById('capture-btn');
      if (captureBtn) captureBtn.click();
    }
    if (command.includes('explain')) {
       handleExplain();
    }
    if (command.includes('clipboard') || command.includes('copy')) {
      handleReadClipboard();
    }
  };

  const handleReadClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setResult(text);
      }
    } catch (err) {
      console.error('Clipboard error:', err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden flex flex-col font-sans select-none">
      <input 
        type="file" 
        id="gallery-input" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileUpload} 
      />
      <AnimatePresence>
        {showOnboarding && <Onboarding onComplete={completeOnboarding} />}
        {showSettings && (
          <Settings 
            onClose={() => setShowSettings(false)} 
            voiceGender={voiceGender}
            onVoiceGenderChange={handleVoiceGenderChange}
            onOpenGuide={() => setShowPublishingGuide(true)}
          />
        )}
        {showPublishingGuide && <PublishingGuide onClose={() => setShowPublishingGuide(false)} />}
      </AnimatePresence>

      {/* Top Banner */}
      <header className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 to-transparent z-30 px-8 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.5)]">
            <Eye size={24} className="text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white leading-none">VoiceLens</h1>
            <p className="text-[10px] font-bold text-teal-400/80 tracking-widest uppercase">AI Reading Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pointer-events-auto">
          <button 
            onClick={() => setShowPublishingGuide(true)}
            className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-black active:scale-95 transition-transform"
            aria-label="Developer Help"
          >
            <HelpCircle size={28} />
          </button>
          
          <button 
            onClick={() => setShowSettings(true)}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 active:scale-95 transition-transform"
          >
            <SettingsIcon size={20} />
          </button>
        </div>
      </header>

      {/* Main Experience */}
      <main className="flex-1 relative">
        <CameraView 
          onCapture={handleCapture} 
          isScanning={isScanning} 
          onReadClipboard={handleReadClipboard}
          isContinuous={isContinuousMode}
          setIsContinuous={setIsContinuousMode}
        />
        
        <VoiceController onCommand={handleVoiceCommand} isListening={!result} />

        <AnimatePresence>
          {result && (
            <ReaderDisplay 
              text={result} 
              onExplain={handleExplain} 
              onClose={() => {
                setResult(null);
                setLastImage(null);
              }}
              isProcessing={isExplaining}
              voiceGender={voiceGender}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Decorative Accents */}
      <div className="absolute bottom-4 left-4 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/5 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">System Live</span>
        </div>
      </div>
    </div>
  );
}
