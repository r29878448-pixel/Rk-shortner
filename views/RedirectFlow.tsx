
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  Zap,
  ChevronDown
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
      // Randomly pick one of our lengthy blog posts
      setBlogPost(DEMO_POSTS[Math.floor(Math.random() * DEMO_POSTS.length)]);
      setTimeout(() => setLoading(false), 1000);
    } else {
      setError('Invalid or expired secure link.');
    }
  }, [shortCode]);

  useEffect(() => {
    if (isTimerActive && timer > 0) {
      const interval = setInterval(() => setTimer((v) => v - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerActive, timer]);

  const handleStartVerify = () => {
    setIsTimerActive(true);
    setTimeout(() => {
       bottomAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsFinalStep(true);
      setTimer(5); 
      setIsTimerActive(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Authenticating Session...</h2>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center border border-slate-100">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black mb-10 text-slate-900 uppercase tracking-tighter">Access Forbidden</h2>
        <a href="/#/" className="block w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl">Back to Safety</a>
      </div>
    </div>
  );

  if (isFinalStep) {
    return (
      <div className="min-h-screen bg-white py-20 px-6 text-center flex flex-col items-center">
        <h2 className="text-5xl font-black text-slate-900 mb-12 tracking-tighter leading-none">Preparing Your <br/> Destination</h2>
        <div className="relative inline-flex items-center justify-center mb-16">
          <svg className="w-64 h-64 -rotate-90">
            <circle cx="128" cy="128" r="120" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
            <circle
              cx="128" cy="128" r="120"
              stroke="#4f46e5" strokeWidth="10" fill="transparent"
              strokeDasharray={754}
              strokeDashoffset={754 - (754 * (5 - timer)) / 5}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-8xl font-black text-indigo-600">{Math.max(0, timer)}</span>
          </div>
        </div>
        <div className="w-full max-w-sm">
          {timer > 0 ? (
            <button disabled className="w-full py-6 bg-slate-100 text-slate-300 rounded-3xl font-black uppercase text-xl">Loading...</button>
          ) : (
            <a 
              href={targetUrl} 
              onClick={handleLogClick}
              className="block w-full py-6 bg-indigo-600 text-white rounded-3xl font-black text-2xl shadow-2xl hover:bg-indigo-700 transition"
            >
              GO TO LINK
            </a>
          )}
        </div>
        
        {/* Automatic Middle Ad on final page too */}
        <AdSlot html={settings.adSlots.middle} className="mt-20 w-full max-w-4xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="max-w-[850px] mx-auto bg-white min-h-screen shadow-2xl border-x border-slate-100 p-6 md:p-12">
        <article>
          <div className="h-96 w-full rounded-[2.5rem] overflow-hidden mb-12 shadow-lg">
            <img src={blogPost.imageUrl} className="w-full h-full object-cover" alt="Blog Illustration" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter leading-none">{blogPost.title}</h1>
          
          <div className="prose prose-lg prose-slate text-slate-600 leading-relaxed space-y-8 mb-16 font-medium">
             {/* Dynamic verification box injected into the blog context */}
             <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden my-12">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-4 flex items-center">
                    <ShieldCheck className="mr-3 w-8 h-8 text-indigo-400" /> Human Verification
                  </h3>
                  <p className="text-slate-400 text-sm mb-10 leading-relaxed">Please verify your session to unlock the destination path.</p>
                  {!isTimerActive ? (
                    <button onClick={handleStartVerify} className="w-full bg-white text-slate-900 py-6 rounded-2xl font-black text-xl hover:scale-[1.02] transition transform">VERIFY NOW</button>
                  ) : (
                    <div className="bg-white/10 p-6 rounded-2xl border border-white/10 flex items-center justify-center space-x-4">
                      <div className="w-8 h-8 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
                      <span className="text-xl font-black uppercase tracking-widest">{timer}S REMAINING</span>
                    </div>
                  )}
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 gradient-bg blur-[100px] opacity-20 -mr-32 -mt-32"></div>
             </div>

             <div className="whitespace-pre-line">
                {blogPost.content}
             </div>

             {/* Automatic Middle Ad inside content */}
             <AdSlot html={settings.adSlots.middle} />
             
             {/* Interstitial Step Ad specifically for this step */}
             <AdSlot html={settings.stepAds[currentStep - 1] || ''} />
          </div>
        </article>

        <div className="flex flex-col items-center pt-20 pb-40 border-t border-slate-50 text-center" ref={bottomAnchorRef}>
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-12 flex items-center">
             Scroll down to find continue button <ChevronDown className="ml-2 w-4 h-4 animate-bounce" />
           </p>
           <button 
             onClick={handleNextStep}
             disabled={!isTimerActive || timer > 0}
             className={`px-24 py-7 rounded-[2.5rem] text-2xl font-black uppercase tracking-[0.2em] transition-all shadow-2xl transform ${
               isTimerActive && timer <= 0 
               ? 'bg-indigo-600 text-white hover:scale-105 active:scale-95' 
               : 'bg-slate-100 text-slate-300 cursor-not-allowed'
             }`}
           >
             {timer > 0 ? (isTimerActive ? `Wait ${timer}s` : 'Verify to Proceed') : 'Continue'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default RedirectFlow;
