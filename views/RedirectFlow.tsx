
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
      setTimeout(() => setLoading(false), 800);
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
      <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-6" />
      <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest">Securing Redirect...</h2>
      <p className="text-slate-400 text-sm mt-2">Authenticating secure relay node</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-10">
      <div className="max-w-md w-full bg-white p-12 rounded-xl shadow-2xl text-center border border-slate-200">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4 text-slate-900 uppercase">Invalid Path</h2>
        <p className="text-slate-500 mb-10 text-sm">The secure session has expired or the link is no longer available in our vault.</p>
        <a href="/#/" className="block w-full py-4 bg-slate-900 text-white rounded font-bold uppercase text-xs tracking-widest">Back to Home</a>
      </div>
    </div>
  );

  if (isFinalStep) {
    return (
      <div className="min-h-screen bg-white py-24 px-6 text-center flex flex-col items-center">
        {!isAdmin && <AdSlot html={settings.adSlots.top} className="w-full mb-16" />}
        
        <h2 className="text-5xl md:text-7xl font-bold text-slate-900 mb-12 tracking-tight uppercase">Verification <br/> Complete</h2>
        
        <div className="relative inline-flex items-center justify-center mb-16 scale-110">
          <svg className="w-48 h-48 -rotate-90">
            <circle cx="96" cy="96" r="90" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
            <circle
              cx="96" cy="96" r="90"
              stroke="#4f46e5" strokeWidth="8" fill="transparent"
              strokeDasharray={565}
              strokeDashoffset={565 - (565 * (5 - timer)) / 5}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-indigo-600">{Math.max(0, timer)}</span>
          </div>
        </div>
        
        <div className="w-full max-w-sm">
          {timer > 0 ? (
            <button disabled className="w-full py-5 bg-slate-100 text-slate-400 rounded-lg font-bold uppercase text-sm border-2 border-dashed border-slate-200">Relaying to Destination...</button>
          ) : (
            <a 
              href={targetUrl} 
              onClick={handleLogClick}
              className="block w-full py-6 bg-indigo-600 text-white rounded-lg font-bold text-xl shadow-2xl animate-pulse hover:bg-indigo-700 transition uppercase"
            >
              Get Destination Link
            </a>
          )}
        </div>
        
        {!isAdmin && <AdSlot html={settings.adSlots.bottom} className="w-full mt-24" />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Top Automated Ad - Suppressed for Admins */}
      {!isAdmin && <AdSlot html={settings.adSlots.top} />}

      {/* Progress Header - Visible and Professional */}
      <div className="sticky top-0 z-[100] w-full bg-slate-900 text-white border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">Human Verification Required</span>
          </div>
          <div className="flex items-center space-x-4">
             <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Stage Progress</span>
             <span className="text-xl font-bold text-indigo-400">{currentStep} / {settings.totalSteps}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto border-x border-slate-100 p-6 md:p-12 pb-60">
        <article>
          {/* Header Ad Slot - Suppressed for Admins */}
          {!isAdmin && <AdSlot html={settings.adSlots.middle} className="mb-12" />}

          <div className="h-[500px] w-full rounded-xl overflow-hidden mb-12 shadow-lg border border-slate-100">
            <img src={blogPost.imageUrl} className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-1000" alt="Blog" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-10 tracking-tight text-slate-900 leading-tight">
            {blogPost.title}
          </h1>

          <div className="flex items-center space-x-4 mb-12 pb-10 border-b border-slate-100">
             <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                <UserIcon className="w-6 h-6" />
             </div>
             <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{blogPost.author}</p>
                <div className="flex items-center text-sm font-semibold text-slate-900">
                  <Clock className="w-4 h-4 mr-1 text-slate-300" /> 12 Min Critical Analysis • {blogPost.date}
                </div>
             </div>
          </div>
          
          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
             
             {/* Verification UI */}
             <div className="bg-slate-900 rounded-xl p-10 text-white shadow-2xl my-16 relative overflow-hidden">
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl font-bold mb-4 flex items-center justify-center uppercase tracking-tight">
                    <ShieldCheck className="mr-3 w-8 h-8 text-indigo-400" /> Start Verification
                  </h3>
                  <p className="text-slate-400 text-sm mb-10 leading-relaxed max-w-md mx-auto">Confirm your session to unlock the destination path. Continue reading the analysis below to reach the next relay point.</p>
                  
                  {!isTimerActive ? (
                    <button onClick={handleStartVerify} className="w-full bg-indigo-600 text-white py-5 rounded font-bold text-lg hover:bg-indigo-700 transition shadow-lg uppercase tracking-widest">Authenticate Session</button>
                  ) : (
                    <div className="bg-white/5 p-8 rounded border border-white/10 flex flex-col items-center justify-center space-y-4">
                      <div className="w-10 h-10 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
                      <span className="text-3xl font-bold text-indigo-400">{timer} Seconds</span>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 flex items-center animate-pulse">
                        Please scroll to the bottom <ArrowDown className="ml-2 w-4 h-4" />
                      </p>
                    </div>
                  )}
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] -mr-32 -mt-32"></div>
             </div>

             {/* Middle Ad Slot - Suppressed for Admins */}
             {!isAdmin && <AdSlot html={settings.adSlots.middle} />}

             {/* Massive content to force scroll */}
             <div className="whitespace-pre-line text-lg md:text-xl leading-loose space-y-12 mb-20 text-slate-700 text-justify">
                {blogPost.content}
             </div>

             {/* In-content Interstitial Ad - Suppressed for Admins */}
             {!isAdmin && (
               <div className="my-16">
                 <AdSlot html={settings.stepAds[currentStep - 1] || ''} />
               </div>
             )}

             <div className="whitespace-pre-line text-lg md:text-xl leading-loose space-y-12 mb-20 text-slate-700/60 italic">
                {blogPost.content.substring(0, 4000)}
             </div>
          </div>
        </article>

        {/* The Continue Button - Absolute bottom after massive content */}
        <div className="flex flex-col items-center pt-24 border-t border-slate-100 text-center" ref={bottomAnchorRef}>
           {!isAdmin && <AdSlot html={settings.adSlots.middle} className="mb-16 w-full" />}

           <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.6em] mb-10 animate-pulse">
             Critical Content Analysis Complete
           </p>

           <button 
             onClick={handleNextStep}
             disabled={!isTimerActive || timer > 0}
             className={`px-16 py-6 rounded text-2xl font-bold uppercase tracking-widest transition-all shadow-xl border-b-4 ${
               isTimerActive && timer <= 0 
               ? 'bg-indigo-600 text-white border-indigo-800 hover:bg-indigo-700 active:translate-y-1 active:border-b-0' 
               : 'bg-slate-100 text-slate-300 cursor-not-allowed border-slate-200'
             }`}
           >
             {timer > 0 ? (isTimerActive ? `Wait ${timer}s` : 'Verify at Top') : 'Continue to Next Stage'}
           </button>
           
           <p className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-6 py-2 rounded">
             Verification Progression: {currentStep} of {settings.totalSteps}
           </p>
        </div>
      </div>

      {/* Bottom Automated Ad - Suppressed for Admins */}
      {!isAdmin && <AdSlot html={settings.adSlots.bottom} />}
    </div>
  );
};

export default RedirectFlow;
