
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  Loader2, 
  AlertCircle,
  ArrowDown,
  ChevronDown,
  User as UserIcon,
  MousePointerClick
} from 'lucide-react';
import { SiteSettings, BlogPost, ClickEvent, Link, User, UserRole } from '../types.ts';
import { DEMO_POSTS, DEFAULT_SETTINGS } from '../constants.tsx';
import AdSlot from '../components/AdSlot.tsx';

interface RedirectFlowProps {
  settings: SiteSettings;
  currentUser: User | null;
}

type FlowState = 'idle' | 'counting' | 'verifying' | 'ready';

const RedirectFlow: React.FC<RedirectFlowProps> = ({ settings, currentUser }) => {
  const { shortCode } = useParams();
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [timer, setTimer] = useState(15);
  const [loading, setLoading] = useState(true);
  const [targetUrl, setTargetUrl] = useState('');
  const [linkId, setLinkId] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [error, setError] = useState('');
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const activeSettings: SiteSettings = JSON.parse(localStorage.getItem('swiftlink_settings') || JSON.stringify(DEFAULT_SETTINGS));
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  useEffect(() => {
    const storedLinks = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
    const link = storedLinks.find((l: any) => l.shortCode === shortCode);

    if (link) {
      setTargetUrl(link.originalUrl);
      setLinkId(link.id);
      setOwnerId(link.userId);
      setTimeout(() => {
        setLoading(false);
        setFlowState('counting');
      }, 1500);
    } else {
      setError('System Invalid Session.');
    }
  }, [shortCode]);

  useEffect(() => {
    if (flowState === 'counting' && timer > 0) {
      const interval = setInterval(() => setTimer((v) => v - 1), 1000);
      return () => clearInterval(interval);
    } else if (flowState === 'counting' && timer === 0) {
      setFlowState('verifying');
    }
  }, [flowState, timer]);

  const handleVerify = () => {
    setFlowState('ready');
    // Briefly scroll user down to signal they should find the link
    window.scrollBy({ top: 200, behavior: 'smooth' });
  };

  const handleLogClick = () => {
    const clickEvent: ClickEvent = {
      id: Math.random().toString(36).substring(7),
      linkId, 
      userId: ownerId,
      shortCode: shortCode || 'unknown',
      timestamp: new Date().toISOString(),
      referrer: document.referrer || 'Direct',
      userAgent: navigator.userAgent
    };
    
    const events = JSON.parse(localStorage.getItem('swiftlink_click_events') || '[]');
    localStorage.setItem('swiftlink_click_events', JSON.stringify([clickEvent, ...events]));

    const storedLinks = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
    const updatedLinks = storedLinks.map((l: Link) => {
      if (l.id === linkId) {
        const newClicks = (l.clicks || 0) + 1;
        const newEarnings = (newClicks * activeSettings.cpmRate) / 1000;
        return { ...l, clicks: newClicks, earnings: newEarnings };
      }
      return l;
    });
    localStorage.setItem('swiftlink_global_links', JSON.stringify(updatedLinks));
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-10">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-6" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Verifying Connection Port</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
      <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xl max-w-sm">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
        <h2 className="text-xl font-black mb-4 uppercase">Node Error</h2>
        <p className="text-xs text-slate-400 font-bold mb-8">{error}</p>
        <a href="/#/" className="block py-4 bg-slate-900 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest">Back to Hub</a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-40">
      {!isAdmin && <AdSlot html={settings.adSlots.top} />}
      
      <div className="sticky top-0 z-[100] w-full bg-slate-900 text-white border-b border-white/10 px-6 py-4 flex justify-between items-center shadow-xl">
        <div className="flex items-center space-x-2 text-indigo-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[9px] font-black uppercase tracking-widest">Security Active</span>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-[9px] font-black uppercase tracking-widest opacity-40">System State:</p>
          <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
            {flowState === 'counting' ? `Waiting ${timer}s` : flowState === 'verifying' ? 'Awaiting Verify' : 'Gateway Ready'}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-14">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter uppercase leading-tight">Initialization Procedure</h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
            Our multi-step verification network ensures that every relay is authentic. Please follow the on-screen instructions to proceed to your destination link.
          </p>
        </div>

        {/* INTERACTION AREA */}
        <div className="bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] p-10 md:p-16 mb-16 text-center shadow-inner">
           {flowState === 'counting' && (
             <div className="animate-in">
               <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white text-3xl font-black mb-6 shadow-xl">{timer}</div>
               <h3 className="text-xl font-black uppercase tracking-tight mb-4">Initializing Security Check</h3>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Interact with the surrounding content to confirm identity</p>
             </div>
           )}

           {flowState === 'verifying' && (
             <div className="animate-in space-y-6">
                <div className="w-20 h-20 bg-green-500 rounded-3xl mx-auto flex items-center justify-center text-white mb-6 shadow-xl"><ShieldCheck className="w-10 h-10" /></div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Time Threshold Reached</h3>
                <button onClick={handleVerify} className="w-full max-w-sm py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-indigo-700 transition active:scale-95">
                  Verify Session Identity
                </button>
             </div>
           )}

           {flowState === 'ready' && (
             <div className="animate-in space-y-4">
                <div className="w-20 h-20 bg-indigo-100 rounded-3xl mx-auto flex items-center justify-center text-indigo-600 mb-6"><ChevronDown className="w-10 h-10 animate-bounce" /></div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-indigo-600">Verification Successful</h3>
                <p className="text-xs text-indigo-400 font-black uppercase tracking-widest">Scroll to bottom to access gateway</p>
             </div>
           )}
        </div>

        {/* LONG FORM CONTENT FOR AD SLOTS */}
        <div className="prose prose-lg max-w-none text-slate-600 text-justify space-y-10 leading-relaxed">
          <p>The digital landscape of 2026 demands a higher level of scrutiny for every bit of data that traverses the global web. When we establish a link relay, we are not just moving a user from point A to point B; we are certifying the intent of the interaction. This multi-layered process filters out high-latency automated scripts and ensures that the destination server receives clean, high-value traffic.</p>
          
          <div className="p-8 border-2 border-dashed border-indigo-100 rounded-3xl bg-indigo-50/20 text-center my-10">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Network Recommendation</p>
            <a href="https://www.effectivegatecpm.com/x7462fyue?key=967d606352d8c84667eba56789c7a043" target="_blank" className="text-xl font-black text-indigo-600 hover:underline decoration-2 underline-offset-4">Join our global monetization syndicate today →</a>
          </div>

          <p>Security architectures like the ones deployed at SwiftLink are designed with behavioral heuristics at their core. By measuring the "Wait Time" and "Interaction Depth," we build a cryptographic fingerprint of the user session. This fingerprint is then used to unlock the final routing table which contains the raw destination URL. Without this verification, the system remains in a locked state to prevent unauthorized scraping or relay abuse.</p>
          
          <p>By using our service, you are contributing to a more secure and sustainable web ecosystem where creators are fairly compensated for their digital assets and users are protected from malicious redirection loops often found in legacy link shorteners. Our commitment to transparency and performance ensures that your links remain active and accessible around the clock.</p>
        </div>

        {/* THE FINAL GATEWAY - HIDDEN UNLESS READY */}
        <div className="mt-24 pt-24 border-t-2 border-slate-100 text-center" ref={bottomRef}>
          {flowState === 'ready' ? (
            <div className="animate-in space-y-10">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">Gateway <br/> Authorized</h2>
              <a 
                href={targetUrl} 
                onClick={handleLogClick} 
                className="inline-block w-full max-w-md py-8 bg-indigo-600 text-white rounded-3xl font-black text-2xl uppercase tracking-tighter shadow-2xl hover:bg-indigo-700 transition active:scale-95"
              >
                Access Link
              </a>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Port {shortCode} now open</p>
            </div>
          ) : (
            <div className="opacity-20 flex flex-col items-center select-none grayscale">
               <div className="w-16 h-16 bg-slate-200 rounded-2xl mb-6"></div>
               <div className="h-6 w-64 bg-slate-100 rounded-full mb-4"></div>
               <div className="h-12 w-80 bg-slate-200 rounded-2xl"></div>
               <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-slate-300">Complete verification to unlock gateway</p>
            </div>
          )}
        </div>
      </div>
      
      {!isAdmin && <AdSlot html={settings.adSlots.bottom} />}
    </div>
  );
};

export default RedirectFlow;
