
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  Loader2, 
  AlertCircle,
  ChevronDown,
  Lock,
  Unlock,
  Megaphone,
  ArrowRight
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
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [targetUrl, setTargetUrl] = useState('');
  const [linkId, setLinkId] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [error, setError] = useState('');
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const activeSettings: SiteSettings = JSON.parse(localStorage.getItem('swiftlink_settings') || JSON.stringify(DEFAULT_SETTINGS));
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  // Use the shortCode to deterministically select a blog post so it stays consistent for a specific link
  const post: BlogPost = useMemo(() => {
    const index = (shortCode || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return DEMO_POSTS[index % DEMO_POSTS.length];
  }, [shortCode]);

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
    if (flowState === 'counting') {
      const duration = 15000; // 15 seconds
      const interval = 100;
      const steps = duration / interval;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        setProgress((currentStep / steps) * 100);
        if (currentStep >= steps) {
          clearInterval(timer);
          setFlowState('verifying');
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [flowState]);

  const handleVerify = () => {
    setFlowState('ready');
    // Gently pulse the page to signal unlock
    setTimeout(() => {
       window.scrollBy({ top: 300, behavior: 'smooth' });
    }, 100);
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
          <span className="text-[9px] font-black uppercase tracking-widest">Security Protocol Active</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Status:</span>
          <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
            {flowState === 'counting' ? 'Securing Connection...' : flowState === 'verifying' ? 'Identity Verification' : 'Gateway Open'}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-14">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase leading-tight">{post.title}</h1>
          <div className="flex items-center justify-center space-x-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <span>By {post.author}</span>
             <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
             <span>{post.date}</span>
          </div>
        </div>

        {/* INTERACTION AREA */}
        <div className="bg-slate-900 border-2 border-indigo-500/20 rounded-[2.5rem] p-10 md:p-16 mb-20 text-center shadow-2xl relative overflow-hidden">
           {flowState === 'counting' && (
             <div className="animate-in space-y-6">
               <div className="flex justify-center mb-8">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                     <Lock className="w-10 h-10 text-indigo-400" />
                  </div>
               </div>
               <h3 className="text-2xl font-black uppercase tracking-tight text-white">Authenticating User Identity</h3>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Please stay on this page for 15 seconds</p>
               
               {/* Progress Bar instead of Countdown */}
               <div className="max-w-xs mx-auto h-2 bg-white/5 rounded-full mt-10 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-300 ease-linear shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                    style={{ width: `${progress}%` }}
                  />
               </div>
             </div>
           )}

           {flowState === 'verifying' && (
             <div className="animate-in space-y-8">
                <div className="flex justify-center">
                  <div className="p-6 bg-green-500/10 rounded-3xl border border-green-500/20 animate-pulse">
                     <ShieldCheck className="w-12 h-12 text-green-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">Threshold Reached</h3>
                <button 
                  onClick={handleVerify} 
                  className="w-full max-w-sm py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-indigo-700 transition active:scale-95 flex items-center justify-center mx-auto"
                >
                  <Unlock className="w-4 h-4 mr-3" /> Verify & Unlock Link
                </button>
             </div>
           )}

           {flowState === 'ready' && (
             <div className="animate-in space-y-4">
                <div className="w-20 h-20 bg-green-500/10 rounded-3xl mx-auto flex items-center justify-center text-green-500 mb-6 border border-green-500/20"><Unlock className="w-10 h-10" /></div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-green-400">Gateway Authorized</h3>
                <div className="flex flex-col items-center text-indigo-400">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-4">Scroll down to continue</p>
                  <ChevronDown className="w-10 h-10 animate-bounce" />
                </div>
             </div>
           )}
        </div>

        {/* LONG FORM CONTENT FOR AD SLOTS */}
        <div className="prose prose-lg max-w-none text-slate-600 text-justify space-y-12 leading-relaxed">
          <p className="text-xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-6 italic">
            "The architecture of modern link relays is not just about redirection; it is about certifying the digital handshake between publisher and visitor."
          </p>

          <div className="bg-slate-50 p-8 md:p-12 rounded-[2rem] border border-slate-200">
             <h4 className="text-xl font-black uppercase tracking-tighter mb-4 text-slate-900">Summary Analysis</h4>
             <p className="text-base text-slate-500 font-medium">
               {post.excerpt}
             </p>
          </div>

          <div className="whitespace-pre-line text-lg font-medium opacity-80">
            {post.content}
          </div>
        </div>

        {/* THE FINAL GATEWAY - HIDDEN UNLESS READY */}
        <div className="mt-32 pt-32 border-t-4 border-slate-900 text-center" ref={bottomRef}>
          {flowState === 'ready' ? (
            <div className="animate-in space-y-12">
              
              {/* Buy Ad Above Button */}
              <div className="max-w-md mx-auto">
                 <a href={settings.telegramBotUrl} target="_blank" className="flex items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition group">
                   <Megaphone className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Advertise Here (Top Slot)</span>
                 </a>
              </div>

              <div className="space-y-6">
                 <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">Access <br/> Granted</h2>
                 <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Port {shortCode} is now active</p>
              </div>

              <a 
                href={targetUrl} 
                onClick={handleLogClick} 
                className="inline-flex w-full max-w-lg py-10 bg-indigo-600 text-white rounded-[2.5rem] font-black text-3xl uppercase tracking-tighter shadow-2xl hover:bg-indigo-700 transition-all active:scale-95 items-center justify-center group"
              >
                Continue to Link <ArrowRight className="ml-4 w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </a>

              {/* Buy Ad Below Button */}
              <div className="max-w-md mx-auto">
                 <a href={settings.telegramBotUrl} target="_blank" className="flex items-center justify-center p-6 bg-slate-900 border-2 border-dashed border-white/10 rounded-2xl text-white/30 hover:text-indigo-400 hover:border-indigo-500 transition group">
                   <Megaphone className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Advertise Here (Bottom Slot)</span>
                 </a>
              </div>

            </div>
          ) : (
            <div className="opacity-10 flex flex-col items-center select-none grayscale pointer-events-none">
               <div className="w-20 h-20 bg-slate-200 rounded-3xl mb-10"></div>
               <div className="h-10 w-80 bg-slate-200 rounded-2xl mb-6"></div>
               <div className="h-24 w-full max-w-lg bg-slate-300 rounded-[2.5rem]"></div>
               <p className="mt-10 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Security check required to reveal gateway</p>
            </div>
          )}
        </div>
      </div>
      
      {!isAdmin && <AdSlot html={settings.adSlots.bottom} />}
    </div>
  );
};

export default RedirectFlow;
