
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Loader2, 
  AlertCircle,
  X,
  Zap,
  Check as CheckIcon,
  ChevronUp,
  Menu
} from 'lucide-react';
import { SiteSettings } from '../types.ts';

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
  
  const bottomAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedLinks = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
    const link = storedLinks.find((l: any) => l.shortCode === shortCode);

    if (link) {
      setTargetUrl(link.originalUrl);
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
    bottomAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNextStep = () => {
    if (timer > 0) return;
    
    if (currentStep < settings.totalSteps) {
      setCurrentStep(prev => prev + 1);
      setTimer(settings.redirectDelay);
      setIsTimerActive(false); // Reset timer trigger for next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsFinalStep(true);
      setTimer(5); // Final 5s countdown for the circle page
      setIsTimerActive(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
      <h2 className="text-lg font-bold text-slate-700">Verifying Security...</h2>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center border">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <a href="/#/" className="inline-block py-3 px-8 bg-indigo-600 text-white rounded-lg font-bold">Return Home</a>
      </div>
    </div>
  );

  // Final Redirection Page (Dynamic Branding)
  if (isFinalStep) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <header className="px-6 py-4 flex justify-between items-center border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <Zap className="text-white w-3 h-3" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">{settings.siteName}</span>
          </div>
          <button className="text-indigo-600">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="max-w-md mx-auto px-6 py-12 text-center">
          <h2 className="text-3xl font-black text-slate-800 mb-12">Your link is almost ready.</h2>
          
          <div className="relative inline-flex items-center justify-center mb-12">
            <svg className="w-64 h-64 -rotate-90">
              <circle cx="128" cy="128" r="120" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
              <circle
                cx="128" cy="128" r="120"
                stroke="#4f46e5" strokeWidth="8" fill="transparent"
                strokeDasharray={754}
                strokeDashoffset={754 - (754 * (5 - timer)) / 5}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-8xl font-black text-indigo-600">{Math.max(0, timer)}</span>
              <span className="text-slate-400 font-medium uppercase text-[10px] tracking-widest">Seconds</span>
            </div>
          </div>

          <div className="space-y-4">
            {timer > 0 ? (
              <button disabled className="w-full py-5 bg-slate-200 text-slate-400 rounded-2xl font-bold text-xl cursor-not-allowed">
                Please wait...
              </button>
            ) : (
              <a 
                href={targetUrl} 
                className="block w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition transform active:scale-95"
              >
                Get Link
              </a>
            )}
          </div>
        </div>

        <footer className="fixed bottom-0 left-0 right-0 bg-slate-50 border-t border-slate-100 p-4 text-center">
           <div className="flex justify-center space-x-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
             <a href="#">Security Policy</a>
             <a href="#">Terms of Use</a>
           </div>
        </footer>
      </div>
    );
  }

  // Verification Steps (Blog Style)
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-[#333]">
      <div className="sticky top-0 z-[100] bg-white border-b border-slate-200 py-2 text-center shadow-sm">
        <span className="font-bold text-xs uppercase tracking-widest">Verification Step <span className="text-indigo-600 font-black">{currentStep}/{settings.totalSteps}</span></span>
      </div>

      <div className="max-w-[800px] mx-auto bg-white min-h-screen shadow-lg border-x border-slate-100">
        <div className="p-4 md:p-10">
          <div className="mb-8" dangerouslySetInnerHTML={{ __html: settings.adSlots.top }} />

          <h1 className="text-3xl font-black mb-8 leading-tight">Securing your digital destination...</h1>
          
          <div className="bg-indigo-600 rounded-3xl p-8 mb-8 text-white">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <ShieldCheck className="mr-3 w-6 h-6" /> Human Verification Required
            </h2>
            <p className="opacity-80 text-sm leading-relaxed mb-6">
              To ensure the security of our community and protect against automated bot traffic, please complete the manual verification step below. This process takes only a few moments and ensures high-speed delivery of your content.
            </p>
            {!isTimerActive ? (
              <button 
                onClick={handleStartVerify}
                className="w-full bg-white text-indigo-600 py-4 rounded-xl font-black text-lg shadow-lg hover:scale-105 transition"
              >
                VERIFY NOW
              </button>
            ) : (
              <div className="bg-white/10 p-4 rounded-xl text-center border border-white/20">
                <span className="text-sm font-bold opacity-80 uppercase tracking-widest">Verification Active: {timer}s remaining</span>
              </div>
            )}
          </div>

          <div className="bg-[#4ade80] border-2 border-indigo-600 rounded-xl py-4 px-4 text-center mb-8 font-black text-sm text-indigo-900">
            <span className="flex items-center justify-center space-x-2">
              <span>▼ CLICK ANY</span>
              <span className="text-red-600">ADS</span>
              <span>& Wait {settings.redirectDelay} Seconds to</span>
              <span className="underline">CONTINUE</span>
              <span>▼</span>
            </span>
          </div>

          <div className="mb-8" dangerouslySetInnerHTML={{ __html: settings.stepAds[currentStep - 1] || '' }} />

          <div className="prose prose-slate mb-12">
            <p className="text-slate-500 italic">Please do not close this window. Verification is running in the background. Once the timer hits 0, the continue button at the bottom will become active.</p>
          </div>

          <div className="h-[200px]" /> {/* Spacer to force scroll */}

          <div className="flex flex-col items-center pt-20 pb-32 border-t border-slate-50 relative" ref={bottomAnchorRef}>
             <button 
               onClick={handleNextStep}
               disabled={!isTimerActive || timer > 0}
               className={`px-16 py-4 rounded-full text-lg font-black uppercase tracking-widest transition-all ${
                 isTimerActive && timer <= 0 
                 ? 'bg-indigo-600 text-white shadow-2xl hover:scale-105 active:scale-95' 
                 : 'bg-slate-100 text-slate-300 cursor-not-allowed'
               }`}
             >
               {timer > 0 ? (isTimerActive ? `Wait ${timer}s` : 'Verify First') : 'Continue'}
             </button>
          </div>
        </div>

        <footer className="bg-slate-900 py-20 px-6 text-center text-slate-500">
           <p className="text-xs font-bold uppercase tracking-widest mb-4">© {settings.siteName} Infrastructure</p>
           <div className="flex justify-center space-x-4">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <span className="text-[10px] font-bold">Encrypted Connection Active</span>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default RedirectFlow;
