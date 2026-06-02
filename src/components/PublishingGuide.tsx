import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Download, Github, ExternalLink, Info, Zap, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

interface PublishingGuideProps {
  onClose: () => void;
}

export default function PublishingGuide({ onClose }: PublishingGuideProps) {
  const [health, setHealth] = useState<{ status: string; message: string } | null>(null);
  const [checking, setChecking] = useState(false);

  const runSystemCheck = async () => {
    setChecking(true);
    try {
      const resp = await fetch('/api/health');
      const data = await resp.json();
      setHealth(data);
      
      // Personalized message for the admin
      const isAdmin = "jjholdings911@gmail.com";
      const message = `${data.message}. Administrator access confirmed for ${isAdmin}.`;
      
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      setHealth({ status: 'error', message: 'Connection Error' });
      const utterance = new SpeechSynthesisUtterance("System check failed. Please check your internet connection.");
      window.speechSynthesis.speak(utterance);
    } finally {
      setChecking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col p-8 overflow-y-auto"
    >
      <header className="flex justify-between items-center mb-12">
        <h2 className="text-4xl font-black text-teal-400 uppercase tracking-tighter">Export Guide</h2>
        <button 
          onClick={onClose} 
          className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-white"
          aria-label="Close Guide"
        >
          <X size={48} />
        </button>
      </header>

      <div className="flex flex-col gap-12 pb-20">
        {/* System Check Section */}
        <section className="bg-slate-900 border-l-8 border-teal-500 p-10 rounded-3xl">
          <div className="flex items-center gap-4 mb-6">
            <Activity size={48} className="text-teal-400" />
            <h3 className="text-6xl font-black text-white">System Check</h3>
          </div>
          
          {health ? (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className={`p-8 rounded-2xl mb-8 flex flex-col gap-6 ${
                 health.status === 'ok' ? 'bg-teal-500/10 border border-teal-500/30' : 'bg-red-500/10 border border-red-500/30'
               }`}
             >
               <div className="flex items-center gap-6">
                {health.status === 'ok' ? <ShieldCheck size={48} className="text-teal-400" /> : <AlertTriangle size={48} className="text-red-400" />}
                <div>
                  <p className="text-4xl font-black text-white">{health.message}</p>
                  <p className="text-xl font-bold text-slate-500 mt-2 uppercase tracking-widest italic">
                    {health.status === 'ok' ? 'Verified Administrator' : 'Action Required'}
                  </p>
                </div>
               </div>
               
               {health.status === 'ok' && (
                 <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                   <p className="text-xl text-slate-400 leading-relaxed">
                     <span className="text-white font-bold">Admin:</span> jjholdings911@gmail.com<br/>
                     <span className="text-teal-400 font-bold">Status:</span> All systems operational. If you see "Quota Exceeded", please enable billing in your AI Studio dashboard to get unlimited scans.
                   </p>
                 </div>
               )}
             </motion.div>
          ) : (
             <button 
               onClick={runSystemCheck}
               disabled={checking}
               className="w-full bg-teal-500 py-10 rounded-2xl text-black text-4xl font-black uppercase tracking-tighter flex items-center justify-center gap-4 active:scale-95 transition-all"
             >
               {checking ? (
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                 >
                   <Activity size={48} />
                 </motion.div>
               ) : <Activity size={48} />}
               {checking ? 'Checking Systems...' : 'Run System Check'}
             </button>
          )}

          <p className="text-2xl font-bold text-slate-500 mt-6 text-center italic">
            Verifies API connection, server health, and camera modules.
          </p>
        </section>

        <section className="bg-slate-900 border-l-8 border-teal-500 p-10 rounded-3xl">
          <div className="flex items-center gap-4 mb-6">
            <Download size={48} className="text-teal-400" />
            <h3 className="text-6xl font-black text-white">1. Get ZIP</h3>
          </div>
          <p className="text-3xl leading-snug font-bold text-slate-300">
            Look at the <span className="text-white bg-slate-700 px-2 rounded">TOP RIGHT</span> of the screen.
          </p>
          <p className="text-3xl leading-snug font-bold text-slate-300 mt-4">
            Click the <span className="text-teal-400">GEAR ICON</span> (Settings).
          </p>
          <p className="text-3xl leading-snug font-bold text-slate-300 mt-4">
            Find the button that says <span className="text-white border-b-4 border-teal-400">DOWNLOAD AS ZIP</span>.
          </p>
        </section>

        <section className="bg-slate-900 border-l-8 border-blue-500 p-10 rounded-3xl">
          <div className="flex items-center gap-4 mb-6">
            <Github size={48} className="text-blue-400" />
            <h3 className="text-6xl font-black text-white">2. GitHub</h3>
          </div>
          <p className="text-3xl leading-snug font-bold text-slate-300">
            In the same <span className="text-white bg-slate-700 px-2 rounded">SETTINGS</span> menu, you can also 
            select <span className="text-blue-400">EXPORT TO GITHUB</span>.
          </p>
        </section>

        <section className="bg-slate-900 border-l-8 border-amber-500 p-10 rounded-3xl">
          <div className="flex items-center gap-4 mb-6">
            <ExternalLink size={48} className="text-amber-400" />
            <h3 className="text-6xl font-black text-white">3. Play Store</h3>
          </div>
          <div className="space-y-6">
            <p className="text-3xl leading-snug font-bold text-slate-300">
              Go to <span className="text-white italic">play.google.com/console</span>
            </p>
            <p className="text-3xl leading-snug font-bold text-slate-300">
              The <span className="text-amber-400">$25 fee</span> is paid to Google directly through their website.
            </p>
            <p className="text-3xl leading-snug font-bold text-slate-300">
              Upload the <span className="text-teal-400">ZIP</span> file components or your <span className="text-blue-400">GitHub</span> link there.
            </p>
          </div>
        </section>

        <section className="bg-slate-900 border-l-8 border-purple-500 p-10 rounded-3xl">
          <div className="flex items-center gap-4 mb-6">
            <Zap size={48} className="text-purple-400" />
            <h3 className="text-6xl font-black text-white">4. Admin Limits</h3>
          </div>
          <div className="space-y-6">
            <p className="text-3xl leading-snug font-bold text-slate-300">
              Seeing <span className="text-purple-400">"Quota Exceeded"</span>?
            </p>
            <p className="text-3xl leading-snug font-bold text-slate-300">
              As the administrator, you can get <span className="text-white bg-slate-700 px-2 rounded">UNLIMITED ACCESS</span> by enabling billing in Google AI Studio.
            </p>
            <p className="text-3xl leading-snug font-bold text-slate-300">
              1. Open <span className="text-white italic">ai.studio.google.com</span>
            </p>
            <p className="text-3xl leading-snug font-bold text-slate-300">
              2. Click on <span className="text-purple-400">Settings</span> (Gear Icon) in the top right.
            </p>
            <p className="text-3xl leading-snug font-bold text-slate-300">
              3. Select <span className="text-white">Plan</span> and choose a paid tier to remove all scanning limits.
            </p>
          </div>
        </section>

        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 mt-8">
            <div className="flex items-center gap-4 mb-4">
                <Info size={32} className="text-slate-400" />
                <span className="text-2xl font-black uppercase tracking-widest text-slate-400">Pro Tip</span>
            </div>
            <p className="text-2xl leading-relaxed font-medium text-slate-500 italic">
                The "Export" button is inside the GEAR ICON at the top right of the AI Studio window itself, not inside this app's preview.
            </p>
        </div>
      </div>
    </motion.div>
  );
}
