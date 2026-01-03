
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
import { SiteSettings, BlogPost } from '../types.ts';

const DEMO_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'How to Maximize Your Earnings with URL Shorteners',
    excerpt: 'Link monetization is a powerful way to generate passive income. Discover the best strategies for high-conversion traffic.',
    content: 'URL shortening has evolved from a simple way to manage long links into a multi-billion dollar monetization industry. For creators, influencers, and digital marketers, every click is an opportunity. Our platform leverages high-performance redirection layers that maximize "dwell time" while maintaining user trust. By integrating seamless verification steps, you can filter out low-quality bot traffic and ensure your advertisers reach real humans. The key to successful monetization lies in the balance between user experience and revenue generation. Overly aggressive ad placements can lead to high bounce rates, while subtle, well-integrated verification flows like ours provide the perfect middle ground. Start tracking your clicks today and optimize your distribution channels with SwiftLink.',
    author: 'Admin',
    date: 'Oct 12, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'The Future of Secure Link Redirection in 2026',
    excerpt: 'Digital security is evolving. Learn how multi-step verification helps protect your users and your revenue.',
    content: 'As we look toward 2026, the landscape of digital security is shifting more toward behavioral verification. Static CAPTCHAs are becoming less effective against advanced AI-driven bots. Our redirection infrastructure is at the forefront of this change, using "Human-in-the-loop" verification that rewards genuine engagement. When a user navigates through your links, they aren’t just being stopped; they are being verified as a valuable consumer of your content. This increases the CPM of your links significantly. Furthermore, data privacy regulations like GDPR and CCPA require that redirection services handle user data with extreme care. Our platform is built with a privacy-first architecture, ensuring that the transition from a short link to a destination is secure, fast, and compliant.',
    author: 'Tech Team',
    date: 'Sep 28, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
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
  const [error, setError] = useState('');
  const [blogPost, setBlogPost] = useState<BlogPost>(DEMO_POSTS[0]);
  
  const bottomAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedLinks = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
    const link = storedLinks.find((l: any) => l.shortCode === shortCode);

    if (link) {
      setTargetUrl(link.originalUrl);
      // Randomly pick a blog post to display
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
    // Smooth scroll down to emphasize the verification process
    setTimeout(() => {
       bottomAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
      <h2 className="text-lg font-bold text-slate-700 tracking-tight">Verifying Security...</h2>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center border border-slate-100">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black mb-2 text-slate-900">Access Restricted</h2>
        <p className="text-slate-500 mb-10 font-medium">{error}</p>
        <a href="/#/" className="block w-full py-5 gradient-bg text-white rounded-2xl font-bold shadow-xl">Return Home</a>
      </div>
    </div>
  );

  if (isFinalStep) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <header className="px-6 py-4 flex justify-between items-center border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{settings.siteName}</span>
          </div>
          <button className="text-indigo-600"><Menu className="w-6 h-6" /></button>
        </header>

        <div className="max-w-md mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-12 tracking-tight leading-none">Your destination is <br/>almost ready.</h2>
          
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
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Seconds</span>
            </div>
          </div>

          <div className="space-y-4">
            {timer > 0 ? (
              <button disabled className="w-full py-6 bg-slate-100 text-slate-400 rounded-2xl font-black text-xl cursor-not-allowed">
                PREPARING LINK...
              </button>
            ) : (
              <a 
                href={targetUrl} 
                className="block w-full py-6 gradient-bg text-white rounded-2xl font-black text-2xl shadow-[0_20px_50px_-10px_rgba(79,70,229,0.5)] hover:scale-[1.02] transition transform active:scale-95"
              >
                GET FINAL LINK
              </a>
            )}
          </div>
        </div>

        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-6 text-center">
           <div className="flex justify-center space-x-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
             <a href="#" className="hover:text-indigo-600 transition">Security Protocol</a>
             <a href="#" className="hover:text-indigo-600 transition">Terms of Access</a>
           </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="sticky top-0 z-[100] bg-white border-b border-slate-200 py-3 text-center shadow-sm">
        <span className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Verification Gateway: Step <span className="text-indigo-600">{currentStep}/{settings.totalSteps}</span></span>
      </div>

      <div className="max-w-[850px] mx-auto bg-white min-h-screen shadow-2xl border-x border-slate-100">
        {/* Blog Post Layout Integration */}
        <div className="p-6 md:p-12">
          <div className="mb-10" dangerouslySetInnerHTML={{ __html: settings.adSlots.top }} />

          <article className="mb-16">
            <div className="h-96 w-full rounded-[2.5rem] overflow-hidden mb-10 shadow-lg">
              <img src={blogPost.imageUrl} className="w-full h-full object-cover" alt="Verification Content" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-none">{blogPost.title}</h1>
            
            <div className="flex items-center space-x-4 mb-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg">Verification Required</span>
              <span>Published {blogPost.date}</span>
            </div>

            <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed space-y-6 mb-12">
              <p>{blogPost.content.substring(0, 300)}...</p>
              
              {/* Verification Call to Action */}
              <div className="bg-slate-900 rounded-[2.5rem] p-10 my-12 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-4 flex items-center tracking-tight">
                    <ShieldCheck className="mr-3 w-8 h-8 text-indigo-400" /> Unlock Full Content
                  </h3>
                  <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">
                    This article is protected. Click the verify button below to continue to your destination. We use this verification to prevent bot abuse.
                  </p>
                  
                  {!isTimerActive ? (
                    <button 
                      onClick={handleStartVerify}
                      className="w-full bg-white text-slate-900 py-6 rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] transition transform flex items-center justify-center group"
                    >
                      CLICK TO VERIFY <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </button>
                  ) : (
                    <div className="bg-white/10 p-6 rounded-2xl border border-white/10 flex items-center justify-center space-x-4">
                      <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
                      <span className="text-xl font-black tracking-tighter">SECURE WAIT: {timer}S</span>
                    </div>
                  )}
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 gradient-bg blur-[100px] opacity-20 -mr-32 -mt-32"></div>
              </div>

              <div className="bg-green-50 border-2 border-green-500 rounded-2xl py-6 px-4 text-center mb-8 font-black text-sm text-green-800 animate-pulse">
                <span className="flex items-center justify-center space-x-2">
                  <span>▼ CLICK ANY</span>
                  <span className="bg-red-600 text-white px-2 py-0.5 rounded">ADVERTISEMENT</span>
                  <span>TO SPEED UP REDIRECT ▼</span>
                </span>
              </div>

              <div className="mb-10" dangerouslySetInnerHTML={{ __html: settings.stepAds[currentStep - 1] || '' }} />

              <p className="opacity-60">{blogPost.content.substring(300)}</p>
            </div>
          </article>

          <div className="flex flex-col items-center pt-20 pb-40 border-t border-slate-50 text-center" ref={bottomAnchorRef}>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center">
               Scroll to find the continue button <ChevronDown className="ml-2 w-4 h-4 animate-bounce" />
             </p>
             
             <button 
               onClick={handleNextStep}
               disabled={!isTimerActive || timer > 0}
               className={`px-20 py-6 rounded-[2rem] text-2xl font-black uppercase tracking-widest transition-all shadow-2xl transform ${
                 isTimerActive && timer <= 0 
                 ? 'gradient-bg text-white hover:scale-105 active:scale-95' 
                 : 'bg-slate-100 text-slate-300 cursor-not-allowed'
               }`}
             >
               {timer > 0 ? (isTimerActive ? `PLEASE WAIT ${timer}S` : 'VERIFY TO PROCEED') : 'CONTINUE NOW'}
             </button>
          </div>
        </div>

        <footer className="bg-slate-900 py-24 px-10 text-center">
           <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-8">
             <Zap className="text-white w-6 h-6" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-4">Powered by {settings.siteName} Enterprise</p>
           <div className="flex justify-center items-center space-x-4">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Global Protection Node Active</span>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default RedirectFlow;
