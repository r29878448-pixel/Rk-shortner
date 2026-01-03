
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { SiteSettings } from '../types';

interface RedirectFlowProps {
  settings: SiteSettings;
}

const RedirectFlow: React.FC<RedirectFlowProps> = ({ settings }) => {
  const { shortCode } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isFinalStep, setIsFinalStep] = useState(false);
  const [timer, setTimer] = useState(15);
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
    if (!loading && timer > 0) {
      const interval = setInterval(() => setTimer((v) => v - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [loading, timer, currentStep]);

  const handleNextStep = () => {
    if (timer > 0) return;
    
    if (currentStep < settings.totalSteps) {
      setCurrentStep(prev => prev + 1);
      setTimer(15);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsFinalStep(true);
      setTimer(5); // Final countdown for the circle timer
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
      <h2 className="text-lg font-bold text-slate-700">Loading Secure Link...</h2>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center border">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Link Invalid</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <a href="/#/" className="inline-block py-3 px-8 bg-blue-600 text-white rounded-lg font-bold">Go Home</a>
      </div>
    </div>
  );

  // Final Redirection Page (VP LINK Style)
  if (isFinalStep) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <header className="px-6 py-4 flex justify-between items-center border-b border-slate-100">
          <div className="flex items-center">
            <span className="text-2xl font-black text-[#1a3b5d] tracking-tighter italic">VP LINK</span>
          </div>
          <button className="text-[#00a8e8]">
            <Menu className="w-8 h-8" />
          </button>
        </header>

        <div className="max-w-md mx-auto px-6 py-12 text-center">
          <h2 className="text-4xl font-black text-[#333] mb-12">Your link is almost ready.</h2>
          
          <div className="relative inline-flex items-center justify-center mb-12">
            <svg className="w-64 h-64 -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="#eef2f6"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="#1a73e8"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={754}
                strokeDashoffset={754 - (754 * (5 - timer)) / 5}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-8xl font-black text-[#1a73e8]">{Math.max(0, timer)}</span>
              <span className="text-slate-400 font-medium">Seconds</span>
            </div>
          </div>

          <div className="space-y-4">
            {timer > 0 ? (
              <button disabled className="w-full py-5 bg-[#9dc4f8] text-white rounded-2xl font-bold text-xl cursor-not-allowed">
                Please wait...
              </button>
            ) : (
              <a 
                href={targetUrl} 
                className="block w-full py-5 bg-[#1a73e8] text-white rounded-2xl font-bold text-xl shadow-[0_10px_30px_-10px_rgba(26,115,232,0.5)] hover:bg-[#1557b0] transition active:scale-95"
              >
                Get Link
              </a>
            )}
          </div>
        </div>

        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 text-center">
           <div className="flex justify-center space-x-6 text-[10px] font-bold text-[#1a73e8] uppercase tracking-wider">
             <a href="#">Privacy Policy</a>
             <a href="#">Terms of Use</a>
           </div>
        </footer>
      </div>
    );
  }

  // Verification Steps (Blog Style)
  return (
    <div className="min-h-screen bg-white font-sans text-[#333]">
      {/* Step Indicator Header */}
      <div className="sticky top-0 z-[100] bg-white border border-black py-2 text-center shadow-sm">
        <span className="font-bold text-sm">You are currently on step <span className="text-red-600 font-black">{currentStep}/{settings.totalSteps}</span>.</span>
      </div>

      <div className="max-w-[800px] mx-auto border-x border-slate-100">
        <div className="p-4 md:p-6">
          <h1 className="text-3xl font-black mb-6">Find Your Perfect Group</h1>
          
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-20 h-20 bg-[#1877f2] rounded-full flex items-center justify-center shrink-0">
               <span className="text-white text-4xl font-black">f</span>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed">
              Get inspiration, ask questions, and find your community on Facebook Groups.
            </p>
            <button className="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center shrink-0">
              <ArrowRight className="text-white" />
            </button>
          </div>

          {/* Green Instruction Bar */}
          <div className="bg-[#4ade80] border-2 border-blue-600 rounded-lg py-3 px-4 text-center mb-8 font-black text-sm">
            <span className="flex items-center justify-center space-x-2">
              <span>▼ CLICK ANY</span>
              <span className="text-orange-500">IMAGE</span>
              <span>👆 & Wait 15 Seconds to</span>
              <span className="text-blue-600 underline">GET LINK</span>
              <span>▼ 👇</span>
            </span>
          </div>

          {/* Ad Section */}
          <div className="border border-slate-200 rounded overflow-hidden mb-8 shadow-sm">
            <div className="p-4 flex items-center justify-between border-b border-slate-50">
              <div>
                <h3 className="text-sm font-bold">Underground House Friends</h3>
                <p className="text-[10px] text-slate-400">Facebook Group</p>
              </div>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-blue-300 rounded-sm"></div>
                <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
              </div>
            </div>
            <div className="aspect-video relative bg-slate-100">
               <img src="https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Ad" />
            </div>
          </div>

          {/* Secondary Header (Duplicated look as per screenshot) */}
          <h1 className="text-3xl font-black mb-6">Find Your Perfect Group</h1>
          
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-20 h-20 bg-[#1877f2] rounded-full flex items-center justify-center shrink-0">
               <span className="text-white text-4xl font-black">f</span>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed">
              Get inspiration, ask questions, and find your community on Facebook Groups.
            </p>
            <button className="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center shrink-0">
              <ArrowRight className="text-white" />
            </button>
          </div>

          {/* Red Verify Button (Sometimes shown in steps) */}
          <div className="flex justify-center mb-10">
            <button className="bg-red-600 text-white font-black px-10 py-3 rounded-full text-lg shadow-lg">Verify</button>
          </div>

          {/* Timer Display */}
          <div className="flex flex-col items-center mb-12">
            <div className="border border-slate-400 rounded-xl px-6 py-3 bg-white mb-4">
               <span className="text-2xl font-bold text-slate-500">{timer} seconds</span>
            </div>
            <p className="text-sm font-bold text-slate-800">
              Scroll down & click on <span className="text-blue-600 underline">Continue</span> button for your destination link
            </p>
          </div>

          {/* Content Spacing Ad */}
          <div className="mb-12" dangerouslySetInnerHTML={{ __html: settings.stepAds[currentStep - 1] || '' }} />

          {/* Continue Button Area */}
          <div className="flex flex-col items-center pt-20 pb-32 border-t border-slate-50 relative">
             <button 
               onClick={handleNextStep}
               disabled={timer > 0}
               className={`px-12 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all ${
                 timer <= 0 
                 ? 'bg-red-600 text-white shadow-xl hover:scale-105' 
                 : 'bg-slate-200 text-slate-400 cursor-not-allowed'
               }`}
             >
               <span className="underline">Continue</span>
             </button>

             {/* Blue Scroll up button */}
             <div className="absolute right-4 bottom-4 w-10 h-10 bg-blue-600 text-white flex items-center justify-center shadow-lg">
                <ChevronUp className="w-6 h-6" />
             </div>
          </div>
        </div>

        {/* Blog Style Footer */}
        <footer className="bg-[#f8f9fa] py-12 px-6 text-center border-t border-slate-100">
           <p className="text-sm font-bold text-slate-800 mb-2">© 2026 E-Study Adda · Built with</p>
           <a href="#" className="text-blue-500 font-bold underline hover:text-blue-700">GeneratePress</a>
        </footer>
      </div>
    </div>
  );
};

export default RedirectFlow;
