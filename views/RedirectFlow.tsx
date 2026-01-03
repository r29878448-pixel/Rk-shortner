
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
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  useEffect(() => {
    const storedLinks = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
    const link = storedLinks.find((l: any) => l.shortCode === shortCode);

    if (link) {
      setTargetUrl(link.originalUrl);
      setLinkId(link.id);
      const postIndex = (currentStep - 1) % DEMO_POSTS.length;
      setBlogPost(DEMO_POSTS[postIndex]);
      setTimeout(() => setLoading(false), 1200);
    } else {
      setError('Invalid Session.');
    }
  }, [shortCode, currentStep]);

  useEffect(() => {
    if (isTimerActive && timer > 0) {
      const interval = setInterval(() => setTimer((v) => v - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerActive, timer]);

  const handleStartVerify = () => setIsTimerActive(true);

  const handleLogClick = () => {
    const clickEvent: ClickEvent = {
      id: Math.random().toString(36).substring(7),
      linkId, shortCode: shortCode || 'unknown',
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

  // Function to inject multiple ads into the long content
  const renderContentWithAds = () => {
    if (!blogPost.content) return null;
    const contentSegments = blogPost.content.split('\n\n');
    const adPool = settings.adSlots.contentAds;
    
    // Calculate ad placement interval (e.g., every 5 paragraphs)
    const interval = Math.floor(contentSegments.length / (adPool.length + 1)) || 5;
    
    return contentSegments.map((segment, idx) => (
      <React.Fragment key={idx}>
        <p className="mb-8">{segment}</p>
        {!isAdmin && (idx + 1) % interval === 0 && (idx + 1) < contentSegments.length && (
          <AdSlot 
            html={adPool[Math.floor(idx / interval) % adPool.length]} 
            className="my-12 p-4 bg-slate-50 border border-slate-100 rounded-lg shadow-inner" 
          />
        )}
      </React.Fragment>
    ));
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-10 text-center">
      <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-8" />
      <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Securing Connection</h2>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl text-center border border-slate-100">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
        <h2 className="text-xl font-black mb-4 uppercase">Link Expired</h2>
        <a href="/#/" className="block w-full py-4 bg-slate-900 text-white rounded font-bold uppercase text-xs">Home</a>
      </div>
    </div>
  );

  if (isFinalStep) {
    return (
      <div className="min-h-screen bg-white py-20 px-6 text-center flex flex-col items-center">
        {!isAdmin && <AdSlot html={settings.adSlots.top} className="w-full mb-12" />}
        <h2 className="text-4xl md:text-7xl font-black text-slate-900 mb-12 tracking-tighter uppercase leading-none">Redirect <br/> Ready</h2>
        
        <div className="relative inline-flex items-center justify-center mb-12">
          <svg className="w-40 h-40 -rotate-90">
            <circle cx="80" cy="80" r="75" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
            <circle cx="80" cy="80" r="75" stroke="#4f46e5" strokeWidth="8" fill="transparent"
              strokeDasharray={471} strokeDashoffset={471 - (471 * (5 - timer)) / 5}
              strokeLinecap="round" className="transition-all duration-1000 ease-linear" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-indigo-600">{Math.max(0, timer)}</span>
          </div>
        </div>
        
        <div className="w-full max-w-sm">
          {timer > 0 ? (
            <div className="w-full py-5 bg-slate-100 text-slate-400 rounded-xl font-bold uppercase text-xs">Authenticating Destination...</div>
          ) : (
            <a href={targetUrl} onClick={handleLogClick} className="block w-full py-6 bg-indigo-600 text-white rounded-xl font-black text-xl shadow-2xl animate-bounce hover:bg-indigo-700 uppercase">Access Link</a>
          )}
        </div>
        {!isAdmin && <AdSlot html={settings.adSlots.bottom} className="w-full mt-24" />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {!isAdmin && <AdSlot html={settings.adSlots.top} />}

      <div className="sticky top-0 z-[100] w-full bg-slate-900/95 backdrop-blur-md text-white border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Encryption Active</span>
          </div>
          <div className="flex items-center space-x-3">
             <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Stage</span>
             <span className="text-lg font-black text-indigo-400">{currentStep} / {settings.totalSteps}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-14">
        <article className="prose prose-lg max-w-none text-slate-700">
          <div className="h-64 w-full rounded-2xl overflow-hidden mb-12 shadow-xl border-4 border-white">
            <img src={blogPost.imageUrl} className="w-full h-full object-cover" alt="Article Cover" />
          </div>

          <h1 className="text-3xl md:text-5xl font-black mb-8 tracking-tight leading-tight uppercase">
            {blogPost.title}
          </h1>

          <div className="flex items-center space-x-4 mb-12 pb-8 border-b border-slate-100">
             <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center"><UserIcon className="w-5 h-5" /></div>
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{blogPost.author} • {blogPost.date}</div>
          </div>
          
          <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-white shadow-xl my-12 relative overflow-hidden text-center">
            <h3 className="text-xl font-black mb-4 flex items-center justify-center uppercase">
              <ShieldCheck className="mr-3 w-6 h-6 text-indigo-400" /> Verify Your Session
            </h3>
            <p className="text-slate-400 text-xs mb-8 font-medium">Please confirm your session and scroll down to continue.</p>
            
            {!isTimerActive ? (
              <button onClick={handleStartVerify} className="w-full bg-white text-slate-900 py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg">Confirm session</button>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <span className="text-3xl font-black text-indigo-400">{timer}s</span>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500 animate-pulse flex items-center">
                  Scroll for next gateway <ArrowDown className="ml-2 w-4 h-4" />
                </p>
              </div>
            )}
          </div>

          <div className="text-lg md:text-xl leading-relaxed text-justify space-y-8">
            {renderContentWithAds()}
          </div>

          <div className="flex flex-col items-center pt-20 border-t border-slate-100 mt-20" ref={bottomAnchorRef}>
             <button 
               onClick={handleNextStep}
               disabled={!isTimerActive || timer > 0}
               className={`w-full md:w-auto px-16 py-6 rounded-xl text-xl font-black uppercase tracking-tight transition-all ${
                 isTimerActive && timer <= 0 ? 'bg-indigo-600 text-white shadow-xl hover:bg-indigo-700' : 'bg-slate-100 text-slate-300'
               }`}
             >
               {timer > 0 ? (isTimerActive ? `Wait ${timer}s` : 'Start at Top') : 'Proceed to Gateway'}
             </button>
             <p className="mt-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">
               Protocol {currentStep} of {settings.totalSteps} complete
             </p>
          </div>
        </article>
      </div>
      {!isAdmin && <AdSlot html={settings.adSlots.bottom} />}
    </div>
  );
};

export default RedirectFlow;
