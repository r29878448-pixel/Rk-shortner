
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  Loader2, 
  AlertCircle,
  ChevronDown,
  ArrowDown
} from 'lucide-react';
import { SiteSettings, BlogPost, ClickEvent, Link } from '../types.ts';
import { DEMO_POSTS } from '../constants.tsx';
import AdSlot from '../components/AdSlot.tsx';

interface RedirectFlowProps {
  settings: SiteSettings;
}

const RedirectFlow: React.FC<RedirectFlowProps> = ({ settings }) => {
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

  useEffect(() => {
    const storedLinks = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
    const link = storedLinks.find((l: any) => l.shortCode === shortCode);

    if (link) {
      setTargetUrl(link.originalUrl);
      setLinkId(link.id);
      // Pick a blog based on step or random
      setBlogPost(DEMO_POSTS[(currentStep - 1) % DEMO_POSTS.length]);
      setTimeout(() => setLoading(false), 800);
    } else {
      setError('Secure Link Session Expired or Invalid.');
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
      <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Securing Connection...</h2>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center border border-slate-100">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black mb-10 text-slate-900 uppercase">Invalid Access</h2>
        <a href="/#/" className="block w-full py-5 bg-slate-900 text-white rounded-2xl font-black">Back to Home</a>
      </div>
    </div>
  );

  if (isFinalStep) {
    return (
      <div className="min-h-screen bg-white py-20 px-6 text-center flex flex-col items-center">
        <div className="w-full max-w-4xl mb-12">
            <AdSlot html={settings.adSlots.middle} />
        </div>
        
        <h2 className="text-5xl font-black text-slate-900 mb-12 tracking-tighter">SUCCESS! <br/> Link Decrypted</h2>
        
        <div className="relative inline-flex items-center justify-center mb-16 scale-125">
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
            <span className="text-5xl font-black text-indigo-600">{Math.max(0, timer)}</span>
          </div>
        </div>
        
        <div className="w-full max-w-sm">
          {timer > 0 ? (
            <button disabled className="w-full py-6 bg-slate-100 text-slate-300 rounded-3xl font-black uppercase text-xl border-2 border-dashed border-slate-200">Processing...</button>
          ) : (
            <a 
              href={targetUrl} 
              onClick={handleLogClick}
              className="block w-full py-6 bg-indigo-600 text-white rounded-3xl font-black text-2xl shadow-2xl animate-bounce hover:bg-indigo-700 transition"
            >
              GET DESTINATION LINK
            </a>
          )}
        </div>
        <div className="w-full max-w-4xl mt-20">
            <AdSlot html={settings.adSlots.middle} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Step Indicator Header */}
      <div className="sticky top-[16px] z-[100] w-full flex justify-center pointer-events-none">
        <div className="bg-slate-900 text-white px-8 py-3 rounded-full shadow-2xl flex items-center space-x-4 border border-white/10 pointer-events-auto backdrop-blur-md">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Verification Path</span>
          <div className="h-4 w-px bg-white/20"></div>
          <span className="text-indigo-400 font-black text-lg">{currentStep} / {settings.totalSteps}</span>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto border-x border-slate-100 p-6 md:p-12 pb-40">
        <article>
          {/* Header Ad Slot - Internal Middle Injection */}
          <div className="mb-12">
            <AdSlot html={settings.adSlots.middle} />
          </div>

          <div className="h-[500px] w-full rounded-[3rem] overflow-hidden mb-12 shadow-2xl border-4 border-white">
            <img src={blogPost.imageUrl} className="w-full h-full object-cover" alt="Hero" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-12 tracking-tighter leading-none text-slate-900">
            {blogPost.title}
          </h1>

          <div className="flex items-center space-x-6 mb-12 pb-12 border-b border-slate-100">
             <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center font-black text-indigo-600 uppercase">
                {blogPost.author[0]}
             </div>
             <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{blogPost.author}</p>
                <p className="text-sm font-bold text-slate-900">{blogPost.date} • 12 Min Read</p>
             </div>
          </div>
          
          <div className="prose prose-2xl prose-slate max-w-none text-slate-600 leading-relaxed font-medium">
             
             {/* Dynamic verification box injected near top of content */}
             <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden my-16 border border-white/10">
                <div className="relative z-10 text-center">
                  <h3 className="text-3xl font-black mb-4 flex items-center justify-center">
                    <ShieldCheck className="mr-3 w-10 h-10 text-indigo-400" /> HUMAN VERIFICATION
                  </h3>
                  <p className="text-slate-400 text-sm mb-12 leading-relaxed max-w-md mx-auto">This link is protected. Confirm your identity below and scroll through the content to unlock the next path.</p>
                  
                  {!isTimerActive ? (
                    <button onClick={handleStartVerify} className="w-full bg-white text-slate-900 py-7 rounded-3xl font-black text-2xl hover:scale-[1.02] transition transform shadow-xl">START VERIFICATION</button>
                  ) : (
                    <div className="bg-white/10 p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-center space-y-4">
                      <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
                      <span className="text-2xl font-black uppercase tracking-[0.2em] text-indigo-400">{timer}S REMAINING</span>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                        Wait for timer and scroll to bottom <ArrowDown className="ml-2 w-4 h-4" />
                      </p>
                    </div>
                  )}
                </div>
                <div className="absolute top-0 right-0 w-80 h-80 gradient-bg blur-[120px] opacity-30 -mr-40 -mt-40"></div>
             </div>

             {/* The Massive Content Block */}
             <div className="whitespace-pre-line text-xl md:text-2xl leading-relaxed space-y-12 mb-20 text-slate-700">
                {blogPost.content}
             </div>

             {/* MIDDLE Ad Slot Injection (Automated) */}
             <div className="my-20">
               <AdSlot html={settings.adSlots.middle} />
             </div>

             <div className="whitespace-pre-line text-xl md:text-2xl leading-relaxed space-y-12 mb-20 text-slate-700">
                {blogPost.content}
             </div>

             {/* Interstitial Step Ad Slot Injection */}
             <div className="my-20">
               <AdSlot html={settings.stepAds[currentStep - 1] || ''} />
             </div>

             <div className="whitespace-pre-line text-xl md:text-2xl leading-relaxed space-y-12 mb-20 text-slate-700">
                {blogPost.content}
             </div>
          </div>
        </article>

        {/* The Final Button Area - Only reachable after heavy scrolling */}
        <div className="flex flex-col items-center pt-24 border-t border-slate-100 text-center" ref={bottomAnchorRef}>
           <div className="mb-12">
              <AdSlot html={settings.adSlots.middle} />
           </div>

           <p className="text-xs font-black text-slate-300 uppercase tracking-[0.5em] mb-12 animate-pulse">
             END OF VERIFICATION CONTENT
           </p>

           <button 
             onClick={handleNextStep}
             disabled={!isTimerActive || timer > 0}
             className={`px-24 py-8 rounded-[2.5rem] text-3xl font-black uppercase tracking-[0.2em] transition-all shadow-2xl transform ${
               isTimerActive && timer <= 0 
               ? 'bg-indigo-600 text-white hover:scale-105 active:scale-95 shadow-indigo-200' 
               : 'bg-slate-100 text-slate-300 cursor-not-allowed border-2 border-slate-200'
             }`}
           >
             {timer > 0 ? (isTimerActive ? `Wait ${timer}s` : 'Verify Top First') : 'CONTINUE TO NEXT'}
           </button>
           
           <p className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             Step {currentStep} complete. One or more steps may remain.
           </p>
        </div>
      </div>
    </div>
  );
};

export default RedirectFlow;
