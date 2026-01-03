
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Loader2, 
  AlertCircle,
  Zap,
  Menu,
  ChevronDown
} from 'lucide-react';
import { SiteSettings, BlogPost, ClickEvent, Link } from '../types.ts';
import AdSlot from '../components/AdSlot.tsx';

const DEMO_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'High-Performance Monetization Strategies',
    excerpt: 'How leading creators are maximizing their link revenue using advanced redirect layers.',
    content: 'URL shortening has evolved from a simple way to manage long links into a multi-billion dollar monetization industry. For creators, influencers, and digital marketers, every click is an opportunity. Our platform leverages high-performance redirection layers that maximize "dwell time" while maintaining user trust. By integrating seamless verification steps, you can filter out low-quality bot traffic and ensure your advertisers reach real humans. The key to successful monetization lies in the balance between user experience and revenue generation. Overly aggressive ad placements can lead to high bounce rates, while subtle, well-integrated verification flows like ours provide the perfect middle ground. Start tracking your clicks today and optimize your distribution channels with SwiftLink.',
    author: 'Admin',
    date: 'Oct 12, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=800'
  }
];

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
      setBlogPost(DEMO_POSTS[Math.floor(Math.random() * DEMO_POSTS.length)]);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } else {
      setError('This link has expired or reached its access limit.');
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
    // 1. Log the click event
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

    // 2. Increment click count in link object
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
      <h2 className="text-lg font-bold text-slate-700 tracking-tight text-center">Processing Request...</h2>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center border border-slate-100">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black mb-2 text-slate-900">Access Restricted</h2>
        <p className="text-slate-500 mb-10 font-medium text-center">{error}</p>
        <a href="/#/" className="block w-full py-5 gradient-bg text-white rounded-2xl font-bold shadow-xl">Return Home</a>
      </div>
    </div>
  );

  if (isFinalStep) {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
        <div className="max-w-md mx-auto px-6 py-20 text-center flex-grow">
          <AdSlot html={settings.adSlots.contentTop} className="mb-12" />
          
          <h2 className="text-4xl font-black text-slate-900 mb-12 tracking-tight leading-none">Redirecting...</h2>
          
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
              <span className="text-8xl font-black text-indigo-600 tracking-tighter">{Math.max(0, timer)}</span>
            </div>
          </div>

          <div className="space-y-4">
            {timer > 0 ? (
              <button disabled className="w-full py-6 bg-slate-100 text-slate-400 rounded-2xl font-black text-xl cursor-not-allowed uppercase tracking-widest">
                Please Wait
              </button>
            ) : (
              <a 
                href={targetUrl} 
                onClick={handleLogClick}
                className="block w-full py-6 gradient-bg text-white rounded-2xl font-black text-2xl shadow-[0_20px_50px_-10px_rgba(79,70,229,0.5)] hover:scale-[1.02] transition transform active:scale-95"
              >
                GET FINAL LINK
              </a>
            )}
          </div>
          
          <AdSlot html={settings.adSlots.contentBottom} className="mt-12" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="sticky top-[16px] z-[100] bg-white/90 backdrop-blur border-b border-slate-200 py-3 text-center shadow-sm max-w-2xl mx-auto rounded-full mt-4">
        <span className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Step <span className="text-indigo-600">{currentStep}/{settings.totalSteps}</span></span>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 p-4 md:p-8">
        {/* Main Content Area */}
        <div className="flex-grow bg-white min-h-screen shadow-2xl rounded-[2.5rem] border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-12">
            <AdSlot html={settings.adSlots.contentTop} className="mb-10" />

            <article className="mb-16">
              <div className="h-80 w-full rounded-3xl overflow-hidden mb-10 shadow-lg">
                <img src={blogPost.imageUrl} className="w-full h-full object-cover" alt="Content Preview" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-none">{blogPost.title}</h1>
              
              <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed space-y-6 mb-12">
                <p>{blogPost.content.substring(0, 300)}...</p>
                
                {/* Verification Box */}
                <div className="bg-slate-900 rounded-[2.5rem] p-10 my-12 text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-4 flex items-center tracking-tight">
                      <ShieldCheck className="mr-3 w-8 h-8 text-indigo-400" /> Human Check
                    </h3>
                    <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">
                      Confirm you are human to access the destination.
                    </p>
                    
                    {!isTimerActive ? (
                      <button 
                        onClick={handleStartVerify}
                        className="w-full bg-white text-slate-900 py-6 rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] transition transform"
                      >
                        VERIFY ACCESS
                      </button>
                    ) : (
                      <div className="bg-white/10 p-6 rounded-2xl border border-white/10 flex items-center justify-center space-x-4">
                        <div className="w-8 h-8 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
                        <span className="text-xl font-black tracking-tighter">SECURE WAIT: {timer}S</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 gradient-bg blur-[100px] opacity-20 -mr-32 -mt-32"></div>
                </div>

                {/* Specific Step Ad */}
                <AdSlot html={settings.stepAds[currentStep - 1] || ''} className="my-10" />

                <p className="opacity-60">{blogPost.content.substring(300)}</p>
              </div>
            </article>

            <AdSlot html={settings.adSlots.contentBottom} className="mb-10" />

            <div className="flex flex-col items-center pt-20 pb-40 border-t border-slate-50 text-center" ref={bottomAnchorRef}>
               <button 
                 onClick={handleNextStep}
                 disabled={!isTimerActive || timer > 0}
                 className={`px-20 py-6 rounded-[2rem] text-2xl font-black uppercase tracking-widest transition-all shadow-2xl transform ${
                   isTimerActive && timer <= 0 
                   ? 'gradient-bg text-white hover:scale-105 active:scale-95' 
                   : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                 }`}
               >
                 {timer > 0 ? (isTimerActive ? `Wait ${timer}s` : 'Verify to Proceed') : 'Continue Now'}
               </button>
            </div>
          </div>
        </div>

        {/* Sidebar Ad Area */}
        <aside className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-24 space-y-8">
            <AdSlot html={settings.adSlots.globalSidebar} className="shadow-sm rounded-2xl" />
            <AdSlot html={settings.adSlots.globalSidebar} className="shadow-sm rounded-2xl" />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RedirectFlow;
