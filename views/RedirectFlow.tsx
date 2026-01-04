
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
    
    // Simulated network verification delay
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
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{activeSettings.siteName} Protocol {currentStep}/{totalSteps}</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 text-center">
      <div className="bg-white/5 border border-white/10 p-12 rounded-xl max-w-md backdrop-blur-3xl shadow-2xl">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-8" />
        <h2 className="text-2xl font-black mb-4 uppercase text-white tracking-tighter">Connection Fault</h2>
        <p className="text-xs text-slate-400 font-bold mb-10 leading-relaxed uppercase tracking-widest">{error}</p>
        <button onClick={() => navigate('/')} className="block w-full py-5 bg-white text-slate-900 rounded-xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition">Exit Terminal</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-40">
      {/* PERSISTENT HEADER AD - SHOWS FROM REDIRECT START */}
      <AdSlot html={activeSettings.adSlots.top} className="py-4 bg-slate-50 border-b border-slate-100" />
      
      <div className="sticky top-0 z-[100] w-full bg-slate-900 text-white px-8 py-5 flex justify-between items-center shadow-lg border-b border-white/10">
        <div className="flex items-center space-x-3 text-indigo-400">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Globe className="text-white w-4 h-4" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">{activeSettings.siteName.toUpperCase()} • STEP {currentStep} / {totalSteps}</span>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          {flowState === 'ready' ? 'SECURE_GATEWAY' : 'AUTHENTICATING'}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase leading-tight">
            {flowState === 'counting' ? 'Verifying Session' : 
             flowState === 'verifying' ? 'Security Check' : 
             flowState === 'ready' ? 'Access Granted' : 'Processing...'}
          </h1>
          <div className="max-w-md mx-auto">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-indigo-600 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
              {flowState === 'counting' ? `Estimated Time: ${Math.ceil((activeSettings.redirectDelay * (100 - progress)) / 100)}s` : 
               flowState === 'verifying' ? 'Establishing Secure Handshake' : 
               flowState === 'ready' ? 'Connection Finalized' : 'Initializing Relay'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-12">
            <article className="prose prose-slate max-w-none">
              <div className="mb-8 overflow-hidden rounded-2xl aspect-video">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6">{post.title}</h2>
              <div className="text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                {post.content || post.excerpt}
              </div>
            </article>
            
            <AdSlot html={activeSettings.adSlots.middle} className="py-8 border-y border-slate-100" />
          </div>

          <div className="space-y-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Security Protocol</h4>
              <div className="space-y-4">
                <div className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-700">
                  <ShieldCheck className="w-4 h-4 mr-3 text-green-500" /> SSL Encryption
                </div>
                <div className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-700">
                  <Lock className="w-4 h-4 mr-3 text-indigo-500" /> Node Relay Verified
                </div>
              </div>
            </div>
            
            {flowState === 'verifying' && (
              <button 
                onClick={handleVerify}
                className="w-full py-8 bg-indigo-600 text-white rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center animate-bounce"
              >
                Verify & Continue <ChevronDown className="ml-3 w-5 h-5" />
              </button>
            )}

            {flowState === 'ready' && (
              <div ref={bottomRef} className="space-y-4 animate-in">
                <button 
                  onClick={handleNextAction}
                  className="w-full py-8 bg-slate-900 text-white rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-2xl hover:bg-black transition-all flex items-center justify-center group"
                >
                  {isFinalStep ? 'Final Destination' : `Proceed to Step ${currentStep + 1}`}
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
                <p className="text-[9px] text-center font-black uppercase tracking-widest text-slate-400">Click button to bypass gateway</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AdSlot html={activeSettings.adSlots.bottom} className="fixed bottom-0 left-0 right-0 py-4 bg-white border-t border-slate-100 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]" />
    </div>
  );
};

// Fixed: Added default export to resolve "Module has no default export" error in App.tsx
export default RedirectFlow;
