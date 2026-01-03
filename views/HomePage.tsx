
import React, { useState } from 'react';
import { ChevronRight, Copy, Check, Loader2, Zap, Shield } from 'lucide-react';
import { Link as LinkType, SiteSettings } from '../types.ts';
import AdSlot from '../components/AdSlot.tsx';

interface HomePageProps {
  siteName: string;
  settings: SiteSettings;
}

const HomePage: React.FC<HomePageProps> = ({ siteName, settings }) => {
  const [url, setUrl] = useState('');
  const [shortenedLink, setShortenedLink] = useState<LinkType | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateLongCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 14; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const shortCode = generateLongCode();
      const newLink: LinkType = {
        id: Math.random().toString(36).substring(7),
        userId: 'admin',
        originalUrl: url,
        shortCode,
        clicks: 0,
        createdAt: new Date()
      };

      const existing = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
      localStorage.setItem('swiftlink_global_links', JSON.stringify([newLink, ...existing]));
      
      setShortenedLink(newLink);
      setIsLoading(false);
    }, 600);
  };

  const getBaseUrl = () => {
    return window.location.href.split('#')[0];
  };

  const copyToClipboard = () => {
    if (!shortenedLink) return;
    const fullUrl = `${getBaseUrl()}#/s/${shortenedLink.shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white min-h-[90vh]">
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[600px] bg-slate-50 -z-10 rounded-[200px] rotate-[-2deg]"></div>
        <div className="max-w-4xl mx-auto px-4 text-center">
          
          <AdSlot html={settings.adSlots.contentTop} className="mb-12" />

          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black mb-10 uppercase tracking-[0.2em] border border-indigo-100">
            Professional Monetization Platform
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
            Shorten. <br />
            <span className="text-indigo-600">Secure. Earn.</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-xl mx-auto mb-14 leading-relaxed font-medium">
            The most advanced multi-step link infrastructure for professional creators. Powered by {siteName}.
          </p>

          <div className="bg-white p-3 rounded-[3rem] shadow-2xl shadow-indigo-100 border border-slate-100 mb-10 relative group max-w-3xl mx-auto">
            <form onSubmit={handleShorten} className="flex flex-col md:flex-row gap-3">
              <input 
                type="url" 
                placeholder="Paste your long destination link..." 
                className="flex-grow px-8 py-6 rounded-[2.5rem] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg bg-slate-50/50 font-medium"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 text-white px-12 py-6 rounded-[2.5rem] font-black text-xl hover:bg-indigo-700 transition flex items-center justify-center disabled:opacity-50 shadow-xl shadow-indigo-200"
              >
                {isLoading ? <Loader2 className="animate-spin w-7 h-7" /> : 'Shorten'} <ChevronRight className="ml-2 w-7 h-7" />
              </button>
            </form>
          </div>

          {shortenedLink && (
            <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group max-w-3xl mx-auto mb-16">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="text-left w-full overflow-hidden">
                  <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.3em] mb-4">Secure Path Generated</p>
                  <div className="text-xl md:text-2xl font-black truncate bg-white/5 p-5 rounded-2xl border border-white/10 font-mono text-indigo-100">
                    {getBaseUrl()}#/s/{shortenedLink.shortCode}
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto shrink-0">
                  <button 
                    onClick={copyToClipboard}
                    className="flex-grow md:flex-initial flex items-center justify-center space-x-3 bg-white text-slate-900 px-10 py-6 rounded-2xl font-black text-xl hover:scale-105 transition shadow-2xl shadow-indigo-900/40"
                  >
                    {isCopied ? <Check className="w-7 h-7 text-green-500" /> : <Copy className="w-7 h-7" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 gradient-bg blur-[100px] opacity-20 -mr-32 -mt-32"></div>
            </div>
          )}

          <AdSlot html={settings.adSlots.contentBottom} className="mt-12" />

          <div className="mt-20 flex flex-wrap justify-center gap-12 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">
            <div className="flex items-center space-x-4">
              <Shield className="w-5 h-5 text-indigo-500" />
              <span>Enterprise Redirects</span>
            </div>
            <div className="flex items-center space-x-4">
              <Zap className="w-5 h-5 text-indigo-500" />
              <span>Instant Monetization</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
