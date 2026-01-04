
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Loader2, 
  ChevronDown,
  Lock,
  Unlock,
  ArrowRight,
  ShieldAlert,
  Globe
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
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [targetUrl, setTargetUrl] = useState('');
  const [linkId, setLinkId] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [error, setError] = useState('');
  
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const activeSettings: SiteSettings = useMemo(() => {
    const saved = localStorage.getItem('swiftlink_settings');
    return saved ? JSON.parse(saved) : settings;
  }, [settings]);

  const totalSteps = activeSettings.totalSteps || 1;
  const isFinalStep = currentStep === totalSteps;

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
      startStep();
    } else {
      setError('INVALID_NODE: This link has expired or never existed.');
    }
  }, [shortCode]);

  const startStep = () => {
    setLoading(true);
    setFlowState('idle');
    setProgress(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
      setLoading(false);
      setFlowState('counting');
    }, 1200);
  };

  useEffect(() => {
    if (flowState === 'counting') {
      const duration = activeSettings.redirectDelay * 1000; 
      const interval = 100;
      const steps = duration / interval;
      let tick = 0;

      const timer = setInterval(() => {
        tick++;
        setProgress((tick / steps) * 100);
        if (tick >= steps) {
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
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const handleNextAction = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      startStep();
    } else {
      finalize();
    }
  };

  const finalize = () => {
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

    const users = JSON.parse(localStorage.getItem('swiftlink_registered_users') || '[]');
    const updatedUsers = users.map((u: any) => {
      if (u.profile.id === ownerId) {
        const bal = u.profile.balance || 0;
        return { ...u, profile: { ...u.profile, balance: bal + (activeSettings.cpmRate / 1000) } };
      }
      return u;
    });
    localStorage.setItem('swiftlink_registered_users', JSON.stringify(updatedUsers));

    window.location.href = targetUrl;
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
          <Globe className="text-white w-6 h-6 animate-pulse" />
        </div>
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">VP Links Protocol {currentStep}/{totalSteps}</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 text-center">
      <div className="bg-white/5 border border-white/10 p-12 rounded-xl max-w-md backdrop-blur-3xl">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-8" />
        <h2 className="text-2xl font-black mb-4 uppercase text-white tracking-tighter">Connection Failed</h2>
        <p className="text-xs text-slate-400 font-bold mb-10 leading-relaxed uppercase tracking-widest">{error}</p>
        <button onClick={() => navigate('/')} className="block w-full py-5 bg-white text-slate-900 rounded-xl font-black uppercase text-[10px] tracking-widest active:scale-95">Home Station</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-40">
      <AdSlot html={activeSettings.adSlots.top} className="py-4 bg-slate-50 border-b" />
      
      <div className="sticky top-0 z-[100] w-full bg-slate-900 text-white px-8 py-5 flex justify-between items-center shadow-lg border-b border-white/5">
        <div className="flex items-center space-x-3 text-indigo-400">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Globe className="text-white w-4 h-4" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">VP LINKS • STEP {currentStep} / {totalSteps}</span>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          {flowState === 'ready' ? 'SECURE' : 'PROCESSING'}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase leading-[0.9] text-balance">
            {isFinalStep ? 'The Destination is Ready' : post.title}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
             <span>{activeSettings.siteName} Relay</span>
             <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
             <span>Ref: {shortCode}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-xl p-10 md:p-16 mb-20 text-center relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
             <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
           </div>

           {flowState === 'counting' && (
             <div className="animate-in space-y-8">
               <div className="flex justify-center">
                  <div className="p-8 bg-white/5 rounded-xl border border-white/10">
                    <Lock className="w-12 h-12 text-indigo-400 animate-pulse" />
                  </div>
               </div>
               <h3 className="text-xl font-black uppercase tracking-tight text-white">Establishing Secure Node...</h3>
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Verifying Identity ({Math.ceil((1 - progress/100) * activeSettings.redirectDelay)}s)</p>
             </div>
           )}

           {flowState === 'verifying' && (
             <div className="animate-in flex flex-col items-center w-full">
                {/* STRICT AD PLACEMENT: ABOVE BUTTON */}
                <AdSlot html={activeSettings.adSlots.top} className="mb-10 w-full" />
                
                <div className="my-6 w-full">
                  <button 
                    onClick={handleVerify} 
                    className="w-full max-w-md py-10 bg-indigo-600 text-white rounded-xl font-black uppercase text-base tracking-[0.2em] shadow-[0_25px_50px_-12px_rgba(79,70,229,0.5)] hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center mx-auto group"
                  >
                    <Unlock className="w-6 h-6 mr-4 group-hover:rotate-12 transition-transform" /> Verify Step {currentStep}
                  </button>
                </div>

                {/* STRICT AD PLACEMENT: BELOW BUTTON */}
                <AdSlot html={activeSettings.adSlots.bottom} className="mt-10 w-full" />
             </div>
           )}

           {flowState === 'ready' && (
             <div className="animate-in space-y-8">
                <div className="w-20 h-20 bg-green-500/10 rounded-xl mx-auto flex items-center justify-center border border-green-500/20 shadow-xl shadow-green-500/5">
                   <Unlock className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-green-400">Verification Success</h3>
                <div className="flex flex-col items-center text-indigo-400 animate-bounce">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-50">Scroll down to continue</p>
                  <ChevronDown className="w-10 h-10" />
                </div>
             </div>
           )}
        </div>

        <div className="prose prose-xl max-w-none text-slate-700 text-justify space-y-12 leading-relaxed mb-40">
          <p className="text-2xl font-black text-slate-900 border-l-[10px] border-indigo-600 pl-8 italic py-4 bg-slate-50 rounded-r-xl uppercase tracking-tighter">
            "Step {currentStep} Authorized. Node {shortCode} handshake confirmed."
          </p>
          <div className="whitespace-pre-line text-lg font-medium text-slate-500 leading-relaxed">
            {post.content}
          </div>
        </div>

        <div className="pt-40 border-t-8 border-slate-900 text-center" ref={bottomRef}>
          {flowState === 'ready' ? (
            <div className="animate-in flex flex-col items-center w-full">
              <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase mb-16 leading-[0.8] text-balance">
                {isFinalStep ? 'VP LINKS READY' : `STEP ${currentStep} COMPLETE`}
              </h2>

              {/* STRICT AD PLACEMENT: ABOVE FINAL BUTTON */}
              <AdSlot html={activeSettings.adSlots.middle} className="mb-12 w-full" />

              <div className="my-8 w-full">
                <button 
                  onClick={handleNextAction} 
                  className="w-full max-w-2xl py-14 bg-slate-900 text-white rounded-xl font-black text-3xl md:text-4xl uppercase tracking-tighter shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center justify-center mx-auto group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/5 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative z-10 flex items-center">
                    {isFinalStep ? 'Go to Destination' : `Continue to Step ${currentStep + 1}`} 
                    <ArrowRight className="ml-8 w-10 h-10 group-hover:translate-x-4 transition-transform" />
                  </span>
                </button>
              </div>

              {/* STRICT AD PLACEMENT: BELOW FINAL BUTTON */}
              <AdSlot html={activeSettings.adSlots.bottom} className="mt-12 w-full" />
            </div>
          ) : (
            <div className="opacity-20 flex flex-col items-center pointer-events-none grayscale blur-[1px]">
               <Lock className="w-16 h-16 mb-8 text-slate-400" />
               <p className="text-[14px] font-black uppercase tracking-[0.5em] text-slate-400">Locked Node Protocol</p>
            </div>
          )}
        </div>
      </div>
      <AdSlot html={activeSettings.adSlots.bottom} className="mt-40 border-t py-12" />
    </div>
  );
};

export default RedirectFlow;
