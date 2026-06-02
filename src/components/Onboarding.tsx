import { motion, AnimatePresence } from 'motion/react';
import { Eye, Mic, Camera, Check } from 'lucide-react';
import { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

const STEPS = [
  {
    title: "Welcome Home",
    description: "You no longer have to struggle reading alone. VoiceLens is your dedicated companion for clarity and independence.",
    icon: <Eye size={48} className="text-teal-400" />,
    color: "bg-teal-500/10"
  },
  {
    title: "The World Speaks",
    description: "Point your camera and let the world speak back to you. We'll identify medicine, bills, and street signs automatically.",
    icon: <Camera size={48} className="text-blue-400" />,
    color: "bg-blue-500/10"
  },
  {
    title: "Explain It Simply",
    description: "Confused by legal jargon or long forms? Tap 'Explain' and we'll tell you exactly what it means in plain English.",
    icon: <Mic size={48} className="text-purple-400" />,
    color: "bg-purple-500/10"
  }
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1, y: -20 }}
          className="max-w-xs w-full flex flex-col items-center"
        >
          <div className={`w-32 h-32 rounded-[40px] ${STEPS[currentStep].color} flex items-center justify-center mb-12 shadow-2xl`}>
            {STEPS[currentStep].icon}
          </div>
          
          <h2 className="text-4xl font-black text-white mb-6 leading-tight">
            {STEPS[currentStep].title}
          </h2>
          
          <p className="text-xl text-slate-400 font-medium leading-relaxed mb-12">
            {STEPS[currentStep].description}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-auto w-full flex flex-col gap-4">
        {/* Progress dots */}
        <div className="flex justify-center gap-3 mb-8">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentStep ? 'w-8 bg-teal-500' : 'w-2 bg-slate-800'
              }`} 
            />
          ))}
        </div>

        <button 
          onClick={next}
          className="w-full py-6 bg-teal-500 rounded-3xl text-black font-black text-xl uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          {currentStep === STEPS.length - 1 ? (
            <>
              Get Started
              <Check size={28} />
            </>
          ) : (
            'Continue'
          )}
        </button>
      </div>
    </div>
  );
}
