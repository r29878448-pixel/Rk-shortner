
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  Loader2, 
  AlertCircle,
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
      // Ensure different blog per step
      const postIndex = (currentStep - 1) % DEMO_POSTS.length;
      setBlogPost(DEMO_POSTS[postIndex]);
      setTimeout(() => setLoading(false), 800);
    } else {
      setError('Session timed out or the link is invalid.');
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
      <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-6" />
      <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Encrypting Session...</h2>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center border border-slate-100">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black mb-10 text-slate-900 uppercase tracking-tighter">Connection Failed</h2>
        <a href="/#/" className="block w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-lg">Back to Safety</a>
      </div>
    </div>
  );

  if (isFinalStep) {
    return (
      <div className="min-h-screen bg-white py-20 px-6 text-center flex flex-col items-center">
        <AdSlot html={settings.adSlots.top} className="w-full mb-12" />
        
        <h2 className="text-6xl font-black text-slate-900 mb-12 tracking-tighter uppercase">Verification <br/> Successful</h2>
        
        <div className="relative inline-flex items-center justify-center mb-16 scale-125">
          <svg className="w-56 h-56 -rotate-90">
            <circle cx="112" cy="112" r="105" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
            <circle
              cx="112" cy="112" r="105"
              stroke="#4f46e5" strokeWidth="10" fill="transparent"
              strokeDasharray={660}
              strokeDashoffset={660 - (660 * (5 - timer)) / 5}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-black text-indigo-600">{Math.max(0, timer)}</span>
          </div>
        </div>
        
        <div className="w-full max-w-sm">
          {timer > 0 ? (
            <button disabled className="w-full py-7 bg-slate-100 text-slate-300 rounded-3xl font-black uppercase text-xl border-4 border-dashed border-slate-200">Relaying...</button>
          ) : (
            <a 
              href={targetUrl} 
              onClick={handleLogClick}
              className="block w-full py-7 bg-indigo-600 text-white rounded-3xl font-black text-2xl shadow-2xl animate-bounce hover:bg-indigo-700 transition"
            >
              ACCESS LINK NOW
            </a>
          )}
        </div>
        
        <AdSlot html={settings.adSlots.bottom} className="w-full mt-24" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Top Automated Ad */}
      <AdSlot html={settings.adSlots.top} />

      {/* Step Indicator Sticky */}
      <div className="sticky top-[10px] z-[100] w-full flex justify-center pointer-events-none">
        <div className="bg-slate-900 text-white px-10 py-4 rounded-full shadow-2xl flex items-center space-x-6 border-2 border-white/20 pointer-events-auto backdrop-blur-xl">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-50">Process</span>
          <div className="h-4 w-px bg-white/30"></div>
          <span className="text-indigo-400 font-black text-xl uppercase tracking-tighter">Stage {currentStep} OF {settings.totalSteps}</span>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto border-x-4 border-slate-50 p-6 md:p-14 pb-60">
        <article>
          {/* Hero Content */}
          <div className="h-[600px] w-full rounded-[3.5rem] overflow-hidden mb-14 shadow-2xl border-8 border-white group">
            <img src={blogPost.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-[2s]" alt="Hero" />
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-14 tracking-tighter leading-none text-slate-900 text-center md:text-left">
            {blogPost.title}
          </h1>

          <div className="flex items-center justify-between space-x-6 mb-16 pb-12 border-b-2 border-slate-100">
             <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-white text-2xl">
                    {blogPost.author[0]}
                </div>
                <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{blogPost.author}</p>
                    <p className="text-lg font-bold text-slate-900">{blogPost.date} • Verified Author</p>
                </div>
             </div>
             <div className="hidden md:block bg-indigo-50 px-6 py-2 rounded-xl text-indigo-600 font-black text-xs uppercase tracking-widest">
                Professional Analysis
             </div>
          </div>
          
          <div className="max-w-none">
             {/* Verification UI Container */}
             <div className="bg-slate-900 rounded-[3.5rem] p-14 text-white shadow-2xl relative overflow-hidden my-20 border-4 border-indigo-500/20">
                <div className="relative z-10 text-center">
                  <h3 className="text-4xl font-black mb-6 flex items-center justify-center tracking-tighter uppercase">
                    <ShieldCheck className="mr-4 w-12 h-12 text-indigo-400" /> SECURE AUTHENTICATION
                  </h3>
                  <p className="text-slate-400 text-lg mb-14 leading-relaxed max-w-xl mx-auto font-medium">To unlock the destination path, confirm your session below and scroll through our research content to reach the relay point.</p>
                  
                  {!isTimerActive ? (
                    <button onClick={handleStartVerify} className="w-full bg-white text-slate-900 py-8 rounded-3xl font-black text-3xl hover:scale-[1.02] transition transform shadow-[0_0_50px_rgba(255,255,255,0.2)]">VERIFY SESSION</button>
                  ) : (
                    <div className="bg-white/5 p-10 rounded-3xl border-2 border-white/10 flex flex-col items-center justify-center space-y-6">
                      <div className="w-14 h-14 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
                      <span className="text-4xl font-black uppercase tracking-[0.2em] text-indigo-400">{timer}S</span>
                      <p className="text-xs font-black uppercase tracking-[0.5em] text-slate-500 flex items-center">
                        PLEASE WAIT & SCROLL DOWN <ArrowDown className="ml-3 w-5 h-5 animate-bounce" />
                      </p>
                    </div>
                  )}
                </div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] gradient-bg blur-[150px] opacity-40 -mr-60 -mt-60"></div>
             </div>

             {/* Automated Middle Ad */}
             <AdSlot html={settings.adSlots.middle} />

             {/* The Massive 10,000+ Word Content Section */}
             <div className="whitespace-pre-line text-2xl md:text-3xl leading-relaxed space-y-20 mb-32 text-slate-700 font-medium">
                {blogPost.content}
             </div>

             {/* Secondary Middle Ad for deep scrolling */}
             <AdSlot html={settings.adSlots.middle} />
             
             {/* Interstitial Stage Ad Slot */}
             <div className="my-24">
               <AdSlot html={settings.stepAds[currentStep - 1] || ''} />
             </div>

             {/* Final long-tail content block */}
             <div className="whitespace-pre-line text-2xl md:text-3xl leading-relaxed space-y-20 mb-32 text-slate-700 font-medium opacity-80">
                {blogPost.content}
             </div>
          </div>
        </article>

        {/* The Final Button Area - Placed at absolute bottom after 10k words */}
        <div className="flex flex-col items-center pt-32 border-t-4 border-slate-50 text-center" ref={bottomAnchorRef}>
           <div className="mb-20 w-full">
              <AdSlot html={settings.adSlots.middle} />
           </div>

           <p className="text-sm font-black text-slate-300 uppercase tracking-[0.8em] mb-14 animate-pulse">
             CONTENT END REACHED
           </p>

           <button 
             onClick={handleNextStep}
             disabled={!isTimerActive || timer > 0}
             className={`px-32 py-10 rounded-[3rem] text-4xl font-black uppercase tracking-[0.2em] transition-all shadow-2xl transform border-4 ${
               isTimerActive && timer <= 0 
               ? 'bg-indigo-600 text-white hover:scale-105 active:scale-95 shadow-indigo-200 border-indigo-400' 
               : 'bg-slate-50 text-slate-200 cursor-not-allowed border-slate-100'
             }`}
           >
             {timer > 0 ? (isTimerActive ? `REMAINING ${timer}S` : 'VERIFY AT TOP') : 'RELAY TO NEXT'}
           </button>
           
           <p className="mt-12 text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-8 py-3 rounded-full">
             Current Session Progress: {currentStep} / {settings.totalSteps} Stages Complete
           </p>
        </div>
      </div>

      {/* Automated Bottom Ad */}
      <AdSlot html={settings.adSlots.bottom} />
    </div>
  );
};

export default RedirectFlow;
