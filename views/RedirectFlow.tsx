
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  Loader2, 
  AlertCircle,
  ArrowDown,
  Clock,
  User as UserIcon
} from 'lucide-react';
import { SiteSettings, BlogPost, ClickEvent, Link, User, UserRole } from '../types.ts';
import { DEMO_POSTS } from '../constants.tsx';
import AdSlot from '../components/AdSlot.tsx';

interface RedirectFlowProps {
  settings: SiteSettings;
  currentUser: User | null;
}

const RedirectFlow: React.FC<RedirectFlowProps> = ({ settings, currentUser }) => {
  const { shortCode } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isFinalStep, setIsFinalStep] = useState(false);
  const [timer, setTimer] = useState(settings.redirectDelay);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [targetUrl, setTargetUrl] = useState('');
  const [linkId, setLinkId] = useState('');
  const [error, setError] = useState('');
  const [blogPost, setBlogPost] = useState<BlogPost>(DEMO_POSTS[0]);
  
  const bottomAnchorRef = useRef<HTMLDivElement>(null);

  // Suppress ads for Admin as requested
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  useEffect(() => {
    const storedLinks = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
    const link = storedLinks.find((l: any) => l.shortCode === shortCode);

    if (link) {
      setTargetUrl(link.originalUrl);
      setLinkId(link.id);
      // Change post per step
      const postIndex = (currentStep - 1) % DEMO_POSTS.length;
      setBlogPost(DEMO_POSTS[postIndex]);
      setTimeout(() => setLoading(false), 1200);
    } else {
      setError('Secure Link Session Expired or Invalid Access Path.');
    }
  }, [shortCode, currentStep]);

  useEffect(() => {
    if (isTimerActive && timer > 0) {
      const interval = setInterval(() => setTimer((v) => v - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerActive, timer]);

  const handleStartVerify = () => {
    setIsTimerActive(true);
  };

  const handleLogClick = () => {
    const clickEvent: ClickEvent = {
      id: Math.random().toString(36).substring(7),
      linkId: linkId,
      shortCode: shortCode || 'unknown',
      timestamp: new Date().toISOString(),
      referrer: document.referrer || 'Direct',
      userAgent: navigator.userAgent
    };
    const events = JSON.parse(localStorage.getItem('swiftlink_click_events') || '[]');
    localStorage.setItem('swiftlink_click_events', JSON.stringify([clickEvent, ...events]));

    const storedLinks = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
    const updatedLinks = storedLinks.map((l: Link) => 
      l.id === linkId ? { ...l, clicks: (l.clicks || 0) + 1 } : l
    );
    localStorage.setItem('swiftlink_global_links', JSON.stringify(updatedLinks));
  };

  const handleNextStep = () => {
    if (timer > 0) return;
    if (currentStep < settings.totalSteps) {
      setCurrentStep(prev => prev + 1);
      setTimer(settings.redirectDelay);
      setIsTimerActive(false); 
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      setIsFinalStep(true);
      setTimer(5); 
      setIsTimerActive(true);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-10 text-center">
      <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-8" />
      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-[0.4em]">Authenticating Relay</h2>
      <p className="text-slate-400 text-xs font-bold mt-4 uppercase tracking-widest">establishing secure handoff node...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 md:p-10">
      <div className="max-w-md w-full bg-white p-10 md:p-16 rounded-2xl shadow-2xl text-center border border-slate-100">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-8" />
        <h2 className="text-2xl font-black mb-4 text-slate-900 uppercase tracking-tighter leading-none">Access Invalid</h2>
        <p className="text-slate-500 mb-10 text-sm font-medium">This secure relay path is no longer available in the active vault.</p>
        <a href="/#/" className="block w-full py-5 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-xl transition-transform active:scale-95">Return to Dashboard</a>
      </div>
    </div>
  );

  if (isFinalStep) {
    return (
      <div className="min-h-screen bg-white py-16 md:py-32 px-6 text-center flex flex-col items-center">
        {!isAdmin && <AdSlot html={settings.adSlots.top} className="w-full mb-12 md:mb-24" />}
        
        <h2 className="text-4xl md:text-8xl font-black text-slate-900 mb-12 md:mb-20 tracking-tighter uppercase leading-none">Session <br/> Authenticated</h2>
        
        <div className="relative inline-flex items-center justify-center mb-16 md:mb-24 scale-100 md:scale-125">
          <svg className="w-48 h-48 md:w-56 md:h-56 -rotate-90">
            <circle cx="96" cy="96" r="90" className="md:cx-[112] md:cy-[112] md:r-[105]" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
            {/* Merged duplicate className attributes on the circle below */}
            <circle
              cx="96" cy="96" r="90"
              stroke="#4f46e5" strokeWidth="10" fill="transparent"
              strokeDasharray={565}
              strokeDashoffset={565 - (565 * (5 - timer)) / 5}
              strokeLinecap="round"
              className="md:cx-[112] md:cy-[112] md:r-[105] transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl md:text-6xl font-black text-indigo-600">{Math.max(0, timer)}</span>
          </div>
        </div>
        
        <div className="w-full max-w-md">
          {timer > 0 ? (
            <div className="w-full py-6 md:py-8 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-xs md:text-sm border-2 border-dashed border-slate-200">Decrypting target path...</div>
          ) : (
            <a 
              href={targetUrl} 
              onClick={handleLogClick}
              className="block w-full py-6 md:py-8 bg-indigo-600 text-white rounded-2xl font-black text-xl md:text-2xl shadow-2xl animate-bounce hover:bg-indigo-700 transition-all uppercase tracking-tighter"
            >
              Access Link Now
            </a>
          )}
        </div>
        
        {!isAdmin && <AdSlot html={settings.adSlots.bottom} className="w-full mt-24 md:mt-32" />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Top Automated Ad Slot */}
      {!isAdmin && <AdSlot html={settings.adSlots.top} />}

      {/* Progress Monitor Sticky */}
      <div className="sticky top-0 z-[100] w-full bg-slate-900 text-white border-b border-white/10 shadow-2xl backdrop-blur-xl bg-slate-900/90">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest opacity-80">Security Protocol Active</span>
            <span className="sm:hidden text-[10px] font-black uppercase tracking-widest opacity-80">Active</span>
          </div>
          <div className="flex items-center space-x-4">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Stage</span>
             <span className="text-xl md:text-2xl font-black text-indigo-400 leading-none">{currentStep} / {settings.totalSteps}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto border-x-0 md:border-x border-slate-100 p-6 md:p-14 pb-80">
        <article>
          {/* Header Ad Injection */}
          {!isAdmin && <AdSlot html={settings.adSlots.middle} className="mb-12" />}

          <div className="h-64 md:h-[500px] w-full rounded-2xl overflow-hidden mb-12 shadow-2xl border-4 md:border-8 border-white group">
            <img src={blogPost.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-[2s]" alt="Blog Article Cover" />
          </div>

          <h1 className="text-4xl md:text-7xl font-black mb-10 tracking-tighter leading-none text-slate-900 uppercase text-center md:text-left">
            {blogPost.title}
          </h1>

          <div className="flex items-center space-x-5 mb-12 pb-10 border-b-2 border-slate-50">
             <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                <UserIcon className="w-7 h-7" />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{blogPost.author}</p>
                <div className="flex items-center text-base md:text-lg font-black text-slate-900 tracking-tight">
                  <Clock className="w-4 h-4 mr-2 text-indigo-600" /> {blogPost.date} • Insights Team
                </div>
             </div>
          </div>
          
          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
             
             {/* Verification Core Unit */}
             <div className="bg-slate-900 rounded-3xl p-8 md:p-16 text-white shadow-2xl my-16 relative overflow-hidden border-b-4 border-indigo-600">
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl md:text-3xl font-black mb-6 flex items-center justify-center uppercase tracking-tighter">
                    <ShieldCheck className="mr-4 w-8 h-8 text-indigo-400" /> Authenticate Relay
                  </h3>
                  <p className="text-slate-400 text-sm md:text-base mb-12 leading-relaxed max-w-lg mx-auto font-medium">To unlock the final destination relay, confirm your session and scroll past the professional analysis below to reach the next gateway.</p>
                  
                  {!isTimerActive ? (
                    <button onClick={handleStartVerify} className="w-full bg-white text-slate-900 py-6 md:py-8 rounded-2xl font-black text-xl md:text-2xl hover:bg-indigo-50 transition transform active:scale-95 shadow-xl uppercase tracking-widest">Confirm session</button>
                  ) : (
                    <div className="bg-white/5 p-10 rounded-2xl border-2 border-white/10 flex flex-col items-center justify-center space-y-6">
                      <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
                      <span className="text-4xl font-black text-indigo-400">{timer} SECONDS</span>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center animate-pulse">
                        Please scroll to the bottom <ArrowDown className="ml-3 w-5 h-5" />
                      </p>
                    </div>
                  )}
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[120px] -mr-32 -mt-32"></div>
             </div>

             {/* Middle Ad Injection */}
             {!isAdmin && <AdSlot html={settings.adSlots.middle} />}

             {/* 10,000+ Word Content Relay Section */}
             <div className="whitespace-pre-line text-xl md:text-2xl leading-relaxed space-y-16 mb-24 text-slate-700 text-justify">
                {blogPost.content}
             </div>

             {/* Interstitial Step Ad Slot */}
             {!isAdmin && (
               <div className="my-20">
                 <AdSlot html={settings.stepAds[currentStep - 1] || ''} />
               </div>
             )}

             <div className="whitespace-pre-line text-xl md:text-2xl leading-relaxed space-y-16 mb-24 text-slate-700/60 italic">
                {blogPost.content.substring(0, 5000)}
             </div>
          </div>
        </article>

        {/* Final Gateway Button - Absolute bottom of 10k words */}
        <div className="flex flex-col items-center pt-24 border-t-2 border-slate-100 text-center" ref={bottomAnchorRef}>
           {!isAdmin && <AdSlot html={settings.adSlots.middle} className="mb-20 w-full" />}

           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.8em] mb-12 animate-pulse">
             System Analysis End Reached
           </p>

           <button 
             onClick={handleNextStep}
             disabled={!isTimerActive || timer > 0}
             className={`w-full md:w-auto px-20 py-8 rounded-2xl text-2xl md:text-3xl font-black uppercase tracking-tighter transition-all shadow-2xl border-b-8 ${
               isTimerActive && timer <= 0 
               ? 'bg-indigo-600 text-white border-indigo-800 hover:bg-indigo-700 active:translate-y-2 active:border-b-0' 
               : 'bg-slate-100 text-slate-300 cursor-not-allowed border-slate-200'
             }`}
           >
             {timer > 0 ? (isTimerActive ? `Wait ${timer}s` : 'Verify at top') : 'Continue to Next Gateway'}
           </button>
           
           <p className="mt-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] bg-slate-50 px-10 py-4 rounded-full border border-slate-100 shadow-sm">
             Relay Progress: {currentStep} of {settings.totalSteps} complete
           </p>
        </div>
      </div>

      {/* Footer Automated Ad Slot */}
      {!isAdmin && <AdSlot html={settings.adSlots.bottom} />}
    </div>
  );
};

export default RedirectFlow;
