
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  Loader2, 
  AlertCircle,
  ArrowDown
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

  // If the user is an admin, they should NOT see ads.
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  useEffect(() => {
    const storedLinks = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
    const link = storedLinks.find((l: any) => l.shortCode === shortCode);

    if (link) {
      setTargetUrl(link.originalUrl);
      setLinkId(link.id);
      // Different massive blog per step
      const postIndex = (currentStep - 1) % DEMO_POSTS.length;
      setBlogPost(DEMO_POSTS[postIndex]);
      setTimeout(() => setLoading(false), 800);
    } else {
      setError('Secure Session Expired.');
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-20 h-20 text-indigo-600 animate-spin mb-8" />
      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-[0.5em]">Establishing Secure Relay</h2>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-10">
      <div className="max-w-md w-full bg-white p-16 rounded-[4rem] shadow-2xl text-center border-4 border-slate-100">
        <AlertCircle className="w-24 h-24 text-red-500 mx-auto mb-10" />
        <h2 className="text-3xl font-black mb-10 text-slate-900 uppercase tracking-tighter">Connection Lost</h2>
        <a href="/#/" className="block w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl">Return to Dashboard</a>
      </div>
    </div>
  );

  if (isFinalStep) {
    return (
      <div className="min-h-screen bg-white py-32 px-10 text-center flex flex-col items-center">
        {!isAdmin && <AdSlot html={settings.adSlots.top} className="w-full mb-20" />}
        
        <h2 className="text-7xl md:text-9xl font-black text-slate-900 mb-20 tracking-tighter uppercase leading-[0.8]">PATH <br/> UNLOCKED</h2>
        
        <div className="relative inline-flex items-center justify-center mb-24 scale-150">
          <svg className="w-64 h-64 -rotate-90">
            <circle cx="128" cy="128" r="120" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
            <circle
              cx="128" cy="128" r="120"
              stroke="#4f46e5" strokeWidth="12" fill="transparent"
              strokeDasharray={754}
              strokeDashoffset={754 - (754 * (5 - timer)) / 5}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-7xl font-black text-indigo-600">{Math.max(0, timer)}</span>
          </div>
        </div>
        
        <div className="w-full max-w-md">
          {timer > 0 ? (
            <button disabled className="w-full py-8 bg-slate-100 text-slate-300 rounded-[2.5rem] font-black uppercase text-xl border-4 border-dashed border-slate-200">DECRYPTING...</button>
          ) : (
            <a 
              href={targetUrl} 
              onClick={handleLogClick}
              className="block w-full py-10 bg-indigo-600 text-white rounded-[3rem] font-black text-3xl shadow-2xl animate-bounce hover:bg-indigo-700 transition tracking-tighter uppercase"
            >
              GO TO DESTINATION
            </a>
          )}
        </div>
        
        {!isAdmin && <AdSlot html={settings.adSlots.bottom} className="w-full mt-32" />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Top Automated Ad - Visible only to regular users */}
      {!isAdmin && <AdSlot html={settings.adSlots.top} />}

      <div className="sticky top-4 z-[100] w-full flex justify-center pointer-events-none">
        <div className="bg-slate-900 text-white px-12 py-5 rounded-full shadow-2xl flex items-center space-x-8 border-4 border-white/20 pointer-events-auto backdrop-blur-2xl">
          <span className="text-[10px] font-black uppercase tracking-[0.6em] opacity-40">Verification</span>
          <div className="h-6 w-px bg-white/30"></div>
          <span className="text-indigo-400 font-black text-2xl uppercase tracking-tighter">STAGE {currentStep} / {settings.totalSteps}</span>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto border-x-8 border-slate-50 p-8 md:p-20 pb-80">
        <article>
          <div className="h-[700px] w-full rounded-[4rem] overflow-hidden mb-20 shadow-2xl border-[12px] border-white ring-1 ring-slate-100">
            <img src={blogPost.imageUrl} className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-[2s]" alt="Article Header" />
          </div>

          <h1 className="text-7xl md:text-9xl font-black mb-20 tracking-tighter leading-none text-slate-900 text-center md:text-left uppercase">
            {blogPost.title}
          </h1>

          <div className="flex items-center justify-between mb-24 pb-16 border-b-4 border-slate-50">
             <div className="flex items-center space-x-8">
                <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center font-black text-white text-3xl">
                    {blogPost.author[0]}
                </div>
                <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-1">{blogPost.author}</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">{blogPost.date}</p>
                </div>
             </div>
             <div className="hidden lg:flex items-center space-x-4 bg-indigo-50 px-10 py-4 rounded-[2rem] text-indigo-600 font-black text-sm uppercase tracking-widest shadow-sm">
                <ShieldCheck className="w-6 h-6" /> Verified Research Article
             </div>
          </div>
          
          <div className="max-w-none">
             <div className="bg-slate-900 rounded-[4rem] p-20 text-white shadow-2xl relative overflow-hidden my-24 border-8 border-indigo-500/10">
                <div className="relative z-10 text-center">
                  <h3 className="text-5xl font-black mb-10 flex items-center justify-center tracking-tighter uppercase">
                    AUTHENTICATION POINT
                  </h3>
                  <p className="text-slate-400 text-xl mb-16 leading-relaxed max-w-2xl mx-auto font-medium">To protect this relay path, verify your connection and scroll through the analysis below to reach the next gateway.</p>
                  
                  {!isTimerActive ? (
                    <button onClick={handleStartVerify} className="w-full bg-white text-slate-900 py-10 rounded-[2.5rem] font-black text-4xl hover:bg-indigo-50 transition transform active:scale-95 shadow-[0_0_80px_rgba(255,255,255,0.15)]">CONFIRM SESSION</button>
                  ) : (
                    <div className="bg-white/5 p-16 rounded-[3rem] border-4 border-white/10 flex flex-col items-center justify-center space-y-10">
                      <div className="w-20 h-20 rounded-full border-8 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                      <span className="text-6xl font-black tracking-tighter text-indigo-400">{timer} SECONDS</span>
                      <p className="text-sm font-black uppercase tracking-[0.8em] text-slate-500 flex items-center animate-pulse">
                        SCROLL TO FOOTER <ArrowDown className="ml-5 w-8 h-8" />
                      </p>
                    </div>
                  )}
                </div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 blur-[200px] rounded-full -mr-80 -mt-80"></div>
             </div>

             {/* Automated Middle Ad Slot */}
             {!isAdmin && <AdSlot html={settings.adSlots.middle} />}

             {/* The Massive 10,000+ Word Analysis Content */}
             <div className="whitespace-pre-line text-3xl md:text-4xl leading-relaxed space-y-32 mb-40 text-slate-700 font-medium text-justify">
                {blogPost.content}
             </div>

             {/* Second Middle Ad Injection for high-scroll depth */}
             {!isAdmin && <AdSlot html={settings.adSlots.middle} />}
             
             {/* Interstitial Step-specific Ad */}
             {!isAdmin && (
               <div className="my-32">
                 <AdSlot html={settings.stepAds[currentStep - 1] || ''} />
               </div>
             )}

             <div className="whitespace-pre-line text-3xl md:text-4xl leading-relaxed space-y-32 mb-40 text-slate-700 font-medium opacity-60 italic">
                {blogPost.content.substring(0, 5000)}
             </div>
          </div>
        </article>

        {/* Final Relay Button Area at absolute bottom */}
        <div className="flex flex-col items-center pt-40 border-t-8 border-slate-50 text-center" ref={bottomAnchorRef}>
           {!isAdmin && <div className="mb-24 w-full">
              <AdSlot html={settings.adSlots.middle} />
           </div>}

           <p className="text-lg font-black text-slate-200 uppercase tracking-[1em] mb-20 animate-pulse">
             ANALYSIS COMPLETE
           </p>

           <button 
             onClick={handleNextStep}
             disabled={!isTimerActive || timer > 0}
             className={`px-40 py-12 rounded-[3.5rem] text-5xl font-black uppercase tracking-tighter transition-all shadow-2xl transform border-8 ${
               isTimerActive && timer <= 0 
               ? 'bg-indigo-600 text-white hover:scale-105 active:scale-95 shadow-indigo-200 border-indigo-400 cursor-pointer' 
               : 'bg-slate-50 text-slate-200 cursor-not-allowed border-slate-100'
             }`}
           >
             {timer > 0 ? (isTimerActive ? `${timer}S LEFT` : 'VERIFY ABOVE') : 'CONTINUE RELAY'}
           </button>
           
           <p className="mt-16 text-sm font-black text-slate-400 uppercase tracking-[0.5em] bg-slate-50 px-12 py-5 rounded-full border-2 border-slate-100 shadow-sm">
             Vault Progression: {currentStep} OF {settings.totalSteps} 
           </p>
        </div>
      </div>

      {/* Automated Bottom Ad - Visible only to regular users */}
      {!isAdmin && <AdSlot html={settings.adSlots.bottom} />}
    </div>
  );
};

export default RedirectFlow;
