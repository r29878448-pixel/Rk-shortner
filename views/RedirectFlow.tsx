
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  
  // Get latest settings from localStorage
  const activeSettings: SiteSettings = useMemo(() => {
    const saved = localStorage.getItem('swiftlink_settings');
    return saved ? JSON.parse(saved) : settings;
  }, [settings]);

  const totalSteps = activeSettings.totalSteps || 1;
  const isAdmin = currentUser?.role === UserRole.ADMIN;

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
      initializeStep();
    } else {
      setError('SESSION_EXPIRED: The requested link node is no longer available.');
    }
  }, [shortCode]);

  const initializeStep = () => {
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
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  const handleNextAction = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      initializeStep();
    } else {
      finalizeRedirection();
    }
  };

  const finalizeRedirection = () => {
    // Analytics
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

    // Payout logic simulated: Add to user balance
    const registeredUsers = JSON.parse(localStorage.getItem('swiftlink_registered_users') || '[]');
    const updatedUsers = registeredUsers.map((u: any) => {
      if (u.profile.id === ownerId) {
        const currentBalance = u.profile.balance || 0;
        const increment = activeSettings.cpmRate / 1000;
        return { ...u, profile: { ...u.profile, balance: currentBalance + increment } };
      }
      return u;
    });
    localStorage.setItem('swiftlink_registered_users', JSON.stringify(updatedUsers));

    window.location.href = targetUrl;
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-10">
      <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-10" />
      <div className="text-center">
         <h2 className="text-xl font-black uppercase tracking-[0.2em] mb-4">Initialising Relay</h2>
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Step {currentStep} of {totalSteps}</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 text-center">
      <div className="bg-white/5 border border-white/10 p-16 rounded-[3rem] max-w-md backdrop-blur-3xl shadow-2xl">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-8" />
        <h2 className="text-2xl font-black mb-4 uppercase text-white tracking-tighter">Connection Fault</h2>
        <p className="text-xs text-slate-400 font-bold mb-10 leading-relaxed uppercase tracking-widest">{error}</p>
        <button onClick={() => navigate('/')} className="block w-full py-5 bg-white text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition">Return Home</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-60">
      {/* HEADER AD */}
      <AdSlot html={activeSettings.adSlots.top} className="bg-slate-50 border-b border-slate-100 py-4" />
      
      <div className="sticky top-0 z-[100] w-full bg-slate-900 text-white border-b border-white/10 px-8 py-5 flex justify-between items-center shadow-xl backdrop-blur-xl bg-slate-900/95">
        <div className="flex items-center space-x-3 text-indigo-400">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Verification Phase {currentStep}/{totalSteps}</span>
        </div>
        <div className="flex items-center space-x-5">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400 bg-indigo-500/10 px-5 py-2.5 rounded-xl border border-indigo-500/20">
            {flowState === 'counting' ? 'Processing Node' : flowState === 'verifying' ? 'Identity Check' : 'Success'}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-14 pt-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter uppercase leading-[0.85] text-balance">{post.title}</h1>
          <div className="flex items-center justify-center space-x-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
             <span>System: {post.author}</span>
             <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
             <span>Ref: {shortCode}</span>
          </div>
        </div>

        {/* TOP AD BEFORE INTERACTION */}
        <AdSlot html={activeSettings.adSlots.middle} className="mb-10" />

        <div className="bg-slate-900 border-2 border-indigo-500/20 rounded-[3.5rem] p-12 md:p-24 mb-24 text-center shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
             <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
           </div>

           {flowState === 'counting' && (
             <div className="animate-in space-y-12">
               <div className="flex justify-center">
                  <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10">
                     <Lock className="w-16 h-16 text-indigo-400 animate-pulse" />
                  </div>
               </div>
               <div className="space-y-6">
                  <h3 className="text-3xl font-black uppercase tracking-tight text-white">Security Scan in Progress</h3>
                  <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.5em]">Awaiting Authorization ({activeSettings.redirectDelay}s)</p>
               </div>
             </div>
           )}

           {flowState === 'verifying' && (
             <div className="animate-in space-y-12">
                {/* AD ABOVE VERIFY BUTTON */}
                <AdSlot html={activeSettings.adSlots.top} className="mb-6 opacity-80" />
                
                <h3 className="text-3xl font-black uppercase tracking-tight text-white">System Ready for Handshake</h3>
                <button 
                  onClick={handleVerify} 
                  className="w-full max-w-md py-10 bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase text-base tracking-[0.3em] shadow-[0_40px_80px_-20px_rgba(79,70,229,0.5)] hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center mx-auto group"
                >
                  <Unlock className="w-6 h-6 mr-4 group-hover:rotate-12 transition-transform" /> Verify Identity
                </button>

                {/* AD BELOW VERIFY BUTTON */}
                <AdSlot html={activeSettings.adSlots.bottom} className="mt-6 opacity-80" />
             </div>
           )}

           {flowState === 'ready' && (
             <div className="animate-in space-y-10">
                <div className="w-28 h-28 bg-green-500/10 rounded-[3rem] mx-auto flex items-center justify-center text-green-500 border border-green-500/20 shadow-2xl">
                   <Unlock className="w-14 h-14" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tight text-green-400">Authorised Successfully</h3>
                <div className="flex flex-col items-center text-indigo-400 space-y-6">
                  <p className="text-[12px] font-black uppercase tracking-[0.5em] opacity-50">Please scroll to continue relay</p>
                  <ChevronDown className="w-14 h-14 animate-bounce" />
                </div>
             </div>
           )}
        </div>

        {/* MIDDLE CONTENT AD */}
        <AdSlot html={activeSettings.adSlots.middle} className="mb-24" />

        <div className="prose prose-2xl max-w-none text-slate-700 text-justify space-y-20 leading-[1.6]">
          <p className="text-3xl font-black text-slate-900 border-l-[16px] border-indigo-600 pl-12 italic py-6 bg-slate-50 rounded-r-[2.5rem] uppercase tracking-tighter">
            "Phase {currentStep} Complete: Validating secure connection telemetry..."
          </p>

          <div className="whitespace-pre-line text-xl md:text-2xl font-medium text-slate-500 leading-relaxed">
            {post.content}
          </div>
        </div>

        {/* AD BEFORE BOTTOM GATEWAY */}
        <AdSlot html={activeSettings.adSlots.top} className="mt-32 mb-10" />

        <div className="mt-40 pt-40 border-t-[10px] border-slate-900 text-center" ref={bottomRef}>
          {flowState === 'ready' ? (
            <div className="animate-in space-y-20">
              
              <div className="space-y-10">
                 <h2 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter uppercase leading-[0.8] text-balance">
                    {currentStep < totalSteps ? `Step ${currentStep} Done` : 'Final Link'}
                 </h2>
                 <p className="text-[14px] font-black uppercase tracking-[0.8em] text-slate-300">Relay Authorized: {shortCode}</p>
              </div>

              {/* AD ABOVE ACTION BUTTON */}
              <AdSlot html={activeSettings.adSlots.middle} className="mb-8" />

              <div className="relative inline-block w-full max-w-2xl group">
                 <div className="absolute inset-0 bg-indigo-600 blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity"></div>
                 <button 
                   onClick={handleNextAction} 
                   className="relative flex w-full py-14 bg-indigo-600 text-white rounded-[3.5rem] font-black text-4xl md:text-5xl uppercase tracking-tighter shadow-2xl hover:bg-indigo-700 transition-all active:scale-95 items-center justify-center group overflow-hidden"
                 >
                   <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                   <span className="relative z-10 flex items-center">
                    {currentStep < totalSteps ? `Initialise Step ${currentStep + 1}` : 'Continue To Site'} 
                    <ArrowRight className="ml-8 w-12 h-12 group-hover:translate-x-4 transition-transform" />
                   </span>
                 </button>
              </div>

              {/* AD BELOW ACTION BUTTON */}
              <AdSlot html={activeSettings.adSlots.bottom} className="mt-8" />

            </div>
          ) : (
            <div className="opacity-5 flex flex-col items-center select-none grayscale pointer-events-none scale-75 blur-sm">
               <div className="w-32 h-32 bg-slate-300 rounded-[3rem] mb-16"></div>
               <div className="h-16 w-full max-w-md bg-slate-300 rounded-3xl mb-12"></div>
               <div className="h-40 w-full max-w-2xl bg-slate-400 rounded-[4rem]"></div>
               <p className="mt-16 text-[14px] font-black uppercase tracking-[0.6em] text-slate-400">Node Status: Locked</p>
            </div>
          )}
        </div>
      </div>
      
      {/* GLOBAL FOOTER AD */}
      <AdSlot html={activeSettings.adSlots.bottom} className="mt-60 border-t border-slate-100 py-10" />
    </div>
  );
};

export default RedirectFlow;
