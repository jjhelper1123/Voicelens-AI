import { motion } from 'motion/react';
import { X, Crown, Shield, Globe, Zap, Settings as SettingsIcon, User, UserRound, CheckCircle2, Activity, Battery, Signal, HelpCircle } from 'lucide-react';
import { VoiceGender } from '../types';
import { useBilling } from './BillingManager';

interface SettingsProps {
  onClose: () => void;
  voiceGender: VoiceGender;
  onVoiceGenderChange: (gender: VoiceGender) => void;
  onOpenGuide: () => void;
}

export default function Settings({ onClose, voiceGender, onVoiceGenderChange, onOpenGuide }: SettingsProps) {
  const { isPro, purchaseFounderPlan, isSupported } = useBilling();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex flex-col"
    >
      <header className="p-8 flex justify-between items-center bg-slate-900/50">
        <div className="flex items-center gap-3">
          <SettingsIcon className="text-teal-400" />
          <h2 className="text-xl font-bold uppercase tracking-widest">Settings</h2>
        </div>
        <button onClick={onClose} className="p-3 bg-slate-800 rounded-full">
          <X />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
        {/* BIG HELP BUTTON FOR LEGALLY BLIND USER */}
        <button 
          onClick={onOpenGuide}
          className="w-full bg-amber-400 p-8 rounded-[40px] flex items-center justify-between shadow-[0_20px_40px_rgba(251,191,36,0.2)] active:scale-95 transition-all text-black"
        >
          <div className="flex items-center gap-6">
            <div className="bg-black/10 p-4 rounded-2xl">
              <HelpCircle size={48} />
            </div>
            <div className="text-left">
              <span className="block text-4xl font-black uppercase tracking-tighter">Developer Guide</span>
              <span className="block text-lg font-bold opacity-60">Help for exporting & Play Store</span>
            </div>
          </div>
          <CheckCircle2 size={32} />
        </button>

        {/* Pricing Strategy */}
        <section className={`relative overflow-hidden bg-slate-900 border rounded-[40px] p-8 transition-all duration-500 ${
          isPro ? 'border-teal-400 shadow-[0_0_40px_rgba(45,212,191,0.15)]' : 'border-teal-500/20'
        }`}>
          {!isPro && (
            <div className="absolute top-4 right-4 bg-amber-400 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_15px_#fbbf24]">
              Limited founding offer
            </div>
          )}
          
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl transition-all ${
              isPro ? 'bg-amber-400 scale-110' : 'bg-teal-500'
            }`}>
              <Crown size={32} className="text-black" />
            </div>
            
            <h3 className="text-3xl font-black text-white mb-2 italic">
              {isPro ? 'Vision Lens Founder' : 'Vision Lens Pro'}
            </h3>
            
            {!isPro ? (
              <>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-teal-400">$2.99</span>
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">/ Month</span>
                </div>

                <button 
                  onClick={purchaseFounderPlan}
                  className="w-full py-5 bg-teal-500 text-black font-black rounded-3xl text-xl uppercase tracking-widest active:scale-95 transition-transform shadow-xl mb-8"
                >
                  Become a Founder
                </button>
              </>
            ) : (
              <div className="mb-8 px-6 py-2 bg-teal-500/10 border border-teal-500/30 rounded-2xl">
                <span className="text-teal-400 font-black uppercase tracking-widest text-sm">Active Subscription</span>
              </div>
            )}

            <div className="w-full space-y-4 text-left border-t border-white/5 pt-8">
              <h4 className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-4">Included in Pro</h4>
              <ul className="grid grid-cols-1 gap-3">
                <PlanFeature label="Unlimited AI Scans" />
                <PlanFeature label="Premium Human Voices" />
                <PlanFeature label="Advanced Smart Explain" />
                <PlanFeature label="Document & PDF Reader" />
                <PlanFeature label="Unlimited Offline Mode" />
                <PlanFeature label="Medication Assistant" />
              </ul>
            </div>
          </div>
        </section>

        {/* Free Plan Status */}
        {!isPro && (
          <div className="bg-slate-900/40 rounded-3xl p-6 border border-white/5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Current Plan: Free</span>
              <span className="text-teal-400 font-mono text-xs">5 Scans Remaining</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-teal-500" />
            </div>
            <p className="mt-4 text-[10px] text-slate-600 uppercase font-bold tracking-tighter leading-tight">
              Free version includes basic voice reading and limited daily scans. Ad-supported.
            </p>
          </div>
        )}

        {/* Voice Preference */}
        <div className="flex flex-col gap-4">
          <h4 className="text-slate-500 font-bold uppercase tracking-widest text-xs">Voice Interaction</h4>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => onVoiceGenderChange('female')}
              className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all ${
                voiceGender === 'female' 
                  ? 'bg-teal-500/10 border-teal-500 shadow-[0_0_20px_rgba(45,212,191,0.2)]' 
                  : 'bg-slate-900/50 border-white/5 text-slate-500'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${voiceGender === 'female' ? 'bg-teal-500' : 'bg-slate-800'}`}>
                <User className={voiceGender === 'female' ? 'text-black' : 'text-slate-400'} />
              </div>
              <span className={`font-bold uppercase tracking-wider ${voiceGender === 'female' ? 'text-teal-400' : ''}`}>Female Voice</span>
            </button>

            <button 
              onClick={() => onVoiceGenderChange('male')}
              className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all ${
                voiceGender === 'male' 
                  ? 'bg-teal-500/10 border-teal-500 shadow-[0_0_20px_rgba(45,212,191,0.2)]' 
                  : 'bg-slate-900/50 border-white/5 text-slate-500'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${voiceGender === 'male' ? 'bg-teal-500' : 'bg-slate-800'}`}>
                <UserRound className={voiceGender === 'male' ? 'text-black' : 'text-slate-400'} />
              </div>
              <span className={`font-bold uppercase tracking-wider ${voiceGender === 'male' ? 'text-teal-400' : ''}`}>Male Voice</span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-4">
          <h4 className="text-slate-500 font-bold uppercase tracking-widest text-xs">Accessibility</h4>
          <SettingsItem icon={<Zap className="text-amber-400" />} label="High Contrast Mode" description="Enhanced visibility for low light." toggle />
          <SettingsItem icon={<Globe className="text-blue-400" />} label="Auto-Language" description="Detect speech language automatically." checked />
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <h4 className="text-slate-500 font-bold uppercase tracking-widest text-xs">App Info</h4>
          <div className="bg-slate-900/50 rounded-3xl p-6 flex items-center justify-between border border-white/5">
            <span className="text-lg font-medium">Version</span>
            <span className="text-teal-400 font-mono">1.0.4-beta</span>
          </div>
          <div className="bg-slate-900/50 rounded-3xl p-6 flex items-center justify-between border border-white/5">
            <span className="text-lg font-medium">Privacy Policy</span>
            <Shield className="text-slate-600" />
          </div>
        </div>

        {/* Store Readiness Info */}
        <section className="bg-slate-900 border border-teal-500/20 rounded-[40px] p-8 mt-auto">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-teal-400" size={20} />
            <h4 className="text-white font-black uppercase tracking-widest text-sm">System Health</h4>
          </div>
          
          <div className="space-y-4 mb-8">
            <HealthItem icon={<Signal size={14} />} label="Play Services" status={isSupported ? 'Authenticated' : 'Simulation Mode'} />
            <HealthItem icon={<Battery size={14} />} label="Offline Sync" status="Operational" />
            <HealthItem icon={<Shield size={14} />} label="Asset Verification" status="Verified" />
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={12} className="text-teal-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">PWA Ready for TWA</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-bold">
              This build is optimized for a Trusted Web Activity. Use Bubblewrap CLI with your Play Console SHA256 fingerprint to generate the release APK.
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

function HealthItem({ icon, label, status }: { icon: any, label: string, status: string }) {
  return (
    <div className="flex justify-between items-center bg-white/5 rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <div className="text-slate-500">{icon}</div>
        <span className="text-sm font-bold text-slate-300">{label}</span>
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest ${
        status === 'Operational' || status === 'Verified' || status === 'Authenticated' ? 'text-teal-400' : 'text-amber-400'
      }`}>{status}</span>
    </div>
  );
}

function PlanFeature({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-3">
      <CheckCircle2 size={18} className="text-teal-500 fill-teal-500/10" />
      <span className="text-sm font-medium text-slate-300">{label}</span>
    </li>
  );
}

function SettingsItem({ icon, label, description, toggle, checked }: any) {
  return (
    <div className="bg-slate-900/50 rounded-3xl p-6 flex items-center border border-white/5 hover:border-white/10 transition-colors">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mr-4">
        {icon}
      </div>
      <div className="flex-1">
        <h5 className="text-lg font-bold">{label}</h5>
        <p className="text-slate-500 text-sm">{description}</p>
      </div>
      {toggle && (
        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-teal-500' : 'bg-slate-700'}`}>
           <div className={`w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : ''}`} />
        </div>
      )}
    </div>
  );
}
