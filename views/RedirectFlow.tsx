
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  Loader2, 
  AlertCircle,
  ChevronDown,
  Lock,
  Unlock,
  ArrowRight,
  ShieldAlert,
  Layers
} from 'lucide-react';
import { SiteSettings, ClickEvent, Link, User, UserRole, BlogPost } from '../types.ts';
import { DEMO_POSTS, DEFAULT_SETTINGS } from '../constants.tsx';
import AdSlot from '../components/AdSlot.tsx';

interface RedirectFlowProps {
  settings: SiteSettings;
  currentUser: User | null;
}

type FlowState = 'idle' | 'counting' | 'verifying' | 'ready';

const RedirectFlow: React.FC<RedirectFlowProps> = ({ settings, currentUser }) => {
  const { shortCode } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [targetUrl, setTargetUrl] = useState('');
  const [linkId, setLinkId] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [error, setError] = useState('');
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const activeSettings: SiteSettings = JSON.parse(localStorage.getItem('swiftlink_settings') || JSON.stringify(DEFAULT_SETTINGS));
  const totalSteps = activeSettings.totalSteps || 1;
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  // Dynamically select a post based on shortCode AND current step to vary content
  const post: BlogPost = useMemo(() => {
    const seed = (shortCode || '') + currentStep;
    const index = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return DEMO_POSTS[index % DEMO_POSTS.length];
  }, [shortCode, currentStep]);

  useEffect(() => {
    const storedLinks = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
    const link = storedLinks.find((l: any) => l.shortCode === shortCode);

    if (link) {
      setTargetUrl(link.originalUrl);
      setLinkId(link.id);
      setOwnerId(link.userId);
      resetStepFlow();
    } else {
      setError('SESSION_EXPIRED: The requested link node is no longer available.');
    }
  }, [shortCode]);

  const resetStepFlow = () => {
    setLoading(true);
    setFlowState('idle');
    setProgress(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
      setLoading(false);
      setFlowState('counting');
    }, 1000);
  };

  useEffect(() => {
    if (flowState === 'counting') {
      const duration = activeSettings.redirectDelay * 1000; 
      const interval = 100;
      const steps = duration / interval;
      let currentProgressStep = 0;

      const timer = setInterval(() => {
        currentProgressStep++;
        setProgress((currentProgressStep / steps) * 100);
        if (currentProgressStep >= steps) {
          clearInterval(timer);
          setFlowState('verifying');
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [flowState, activeSettings.redirectDelay]);

  const handleVerify = () => {
    setFlowState('ready');
    setTimeout(() => {
       window.scrollBy({ top: 400, behavior: 'smooth' });
    }, 100);
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      resetStepFlow();
    } else {
      handleFinalRedirect();
    }
  };

  const handleFinalRedirect = () => {
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

    window.location.href = targetUrl;
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-10">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-8" />
      <div className="text-center">
         <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">
           {currentStep > 1 ? `Initializing Verification Step ${currentStep}` : 'Resolving Network Port'}
         </p>
         <p className="text-[9px] font-bold text-slate-300 uppercase">Awaiting handshake...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 text-center">
      <div className="bg-white/5 border border-white/10 p-16 rounded-[3rem] max-w-md backdrop-blur-3xl shadow-2xl">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-8" />
        <h2 className="text-2xl font-black mb-4 uppercase text-white tracking-tighter">Access Denied</h2>
        <p className="text-xs text-slate-400 font-bold mb-10 leading-relaxed uppercase tracking-widest">{error}</p>
        <a href="/#/" className="block py-5 bg-white text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition">Return to Hub</a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-40">
      {!isAdmin && <AdSlot html={settings.adSlots.top} className="bg-slate-50 border-b border-slate-100" />}
      
      <div className="sticky top-0 z-[100] w-full bg-slate-900 text-white border-b border-white/10 px-8 py-5 flex justify-between items-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] backdrop-blur-xl bg-slate-900/90">
        <div className="flex items-center space-x-3 text-indigo-400">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Phase: {currentStep} / {totalSteps}</span>
        </div>
        <div className="flex items-center space-x-5">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 hidden sm:inline">Network Status:</span>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-lg border border-indigo-500/20">
            {flowState === 'counting' ? 'Securing Phase' : flowState === 'verifying' ? 'Verifying Identity' : 'Step Authorized'}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-14 pt-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter uppercase leading-[0.9] text-balance">{post.title}</h1>
          <div className="flex items-center justify-center space-x-5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 bg-slate-50 inline-flex mx-auto px-6 py-3 rounded-xl border border-slate-100">
             <span>Pub: {post.author}</span>
             <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
             <span>Ref: {post.date}</span>
          </div>
        </div>

        {/* INTERACTION CONSOLE */}
        <div className="bg-slate-900 border-2 border-indigo-500/20 rounded-[3rem] p-10 md:p-20 mb-20 text-center shadow-2xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent pointer-events-none"></div>
           
           {flowState === 'counting' && (
             <div className="animate-in space-y-10 relative z-10">
               <div className="flex justify-center">
                  <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 shadow-2xl">
                     <Lock className="w-12 h-12 text-indigo-400" />
                  </div>
               </div>
               <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-4">Establishing Verification Phase</h3>
                  <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.4em] mb-12">Authorization required. Please wait...</p>
                  
                  <div className="max-w-md mx-auto h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-300 ease-linear shadow-[0_0_30px_rgba(99,102,241,0.6)]" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
               </div>
             </div>
           )}

           {flowState === 'verifying' && (
             <div className="animate-in space-y-10 relative z-10">
                <div className="flex justify-center">
                  <div className="p-8 bg-green-500/10 rounded-[2.5rem] border border-green-500/20 animate-pulse">
                     <ShieldCheck className="w-14 h-14 text-green-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">Security Threshold Met</h3>
                <button 
                  onClick={handleVerify} 
                  className="w-full max-w-sm py-8 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-sm tracking-[0.25em] shadow-[0_30px_60px_-15px_rgba(79,70,229,0.5)] hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center mx-auto"
                >
                  <Unlock className="w-5 h-5 mr-4" /> Verify Step {currentStep}
                </button>
             </div>
           )}

           {flowState === 'ready' && (
             <div className="animate-in space-y-8 relative z-10">
                <div className="w-24 h-24 bg-green-500/10 rounded-[2.5rem] mx-auto flex items-center justify-center text-green-500 border border-green-500/20 shadow-xl shadow-green-500/5">
                   <Unlock className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-green-400">Step {currentStep} Authorized</h3>
                <div className="flex flex-col items-center text-indigo-400 space-y-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-60">Continue button located below</p>
                  <ChevronDown className="w-12 h-12 animate-bounce" />
                </div>
             </div>
           )}
        </div>

        {!isAdmin && <AdSlot html={settings.adSlots.middle} className="mb-20" />}

        <div className="prose prose-2xl max-w-none text-slate-700 text-justify space-y-16 leading-[1.6]">
          <p className="text-2xl font-black text-slate-900 border-l-[12px] border-indigo-600 pl-10 italic py-4 bg-slate-50 rounded-r-3xl uppercase tracking-tighter">
            "Verification Step {currentStep}: Processing network telemetry and user authentication."
          </p>

          <div className="whitespace-pre-line text-lg md:text-xl font-medium text-slate-500 leading-relaxed">
            {post.content}
          </div>
        </div>

        <div className="mt-40 pt-40 border-t-[8px] border-slate-900 text-center" ref={bottomRef}>
          {flowState === 'ready' ? (
            <div className="animate-in space-y-16">
              
              <div className="space-y-8">
                 <h2 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter uppercase leading-[0.8] text-balance">
                    {currentStep < totalSteps ? `Step ${currentStep} Done` : 'Final Gateway'}
                 </h2>
                 <p className="text-[12px] font-black uppercase tracking-[0.6em] text-slate-300">Phase Authorization Verified</p>
              </div>

              <div className="relative inline-block w-full max-w-xl group">
                 <div className="absolute inset-0 bg-indigo-600 blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                 <button 
                   onClick={handleNextStep} 
                   className="relative flex w-full py-12 bg-indigo-600 text-white rounded-[3rem] font-black text-3xl md:text-4xl uppercase tracking-tighter shadow-2xl hover:bg-indigo-700 transition-all active:scale-95 items-center justify-center group"
                 >
                   {currentStep < totalSteps ? `Continue to Step ${currentStep + 1}` : 'Continue to Link'} 
                   <ArrowRight className="ml-6 w-10 h-10 group-hover:translate-x-3 transition-transform" />
                 </button>
              </div>

            </div>
          ) : (
            <div className="opacity-5 flex flex-col items-center select-none grayscale pointer-events-none scale-90">
               <div className="w-24 h-24 bg-slate-300 rounded-[2.5rem] mb-12"></div>
               <div className="h-12 w-full max-w-md bg-slate-300 rounded-2xl mb-8"></div>
               <div className="h-32 w-full max-w-xl bg-slate-400 rounded-[3rem]"></div>
               <p className="mt-12 text-[12px] font-black uppercase tracking-[0.5em] text-slate-400">Complete verification to proceed</p>
            </div>
          )}
        </div>
      </div>
      
      {!isAdmin && <AdSlot html={settings.adSlots.bottom} className="mt-40 border-t border-slate-100" />}
    </div>
  );
};

export default RedirectFlow;
