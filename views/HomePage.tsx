
import React, { useState } from 'react';
import { Link as LinkIcon, Zap, Shield, ChevronRight, Copy, Check, ExternalLink, Loader2 } from 'lucide-react';
import { Link as LinkType } from '../types';

const HomePage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [shortenedLink, setShortenedLink] = useState<LinkType | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const shortCode = Math.random().toString(36).substring(2, 8);
      const newLink: LinkType = {
        id: Math.random().toString(36).substring(7),
        userId: 'admin',
        originalUrl: url,
        shortCode,
        clicks: 0,
        createdAt: new Date()
      };

      // Store in global links key for RedirectFlow to pick up
      const existing = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
      localStorage.setItem('swiftlink_global_links', JSON.stringify([newLink, ...existing]));
      
      setShortenedLink(newLink);
      setIsLoading(false);
    }, 600);
  };

  const getBaseUrl = () => {
    // Robustly get the Blogger base URL without the hash
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
      <section className="relative pt-24 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-slate-50 -z-10 rounded-b-[120px]"></div>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-8 uppercase tracking-widest border border-indigo-100">
            Professional Link Shortener
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8">
            Shorten Your Links <br />
            <span className="text-transparent bg-clip-text gradient-bg">For Free. No Limits.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto mb-14 leading-relaxed">
            Create ultra-fast, professional short links with security verification built-in. Perfect for social media, blogs, and ads.
          </p>

          <div className="bg-white p-3 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 mb-10 transform transition hover:scale-[1.01]">
            <form onSubmit={handleShorten} className="flex flex-col md:flex-row gap-3">
              <input 
                type="url" 
                placeholder="https://paste-your-long-link-here.com" 
                className="flex-grow px-8 py-5 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg border-none bg-slate-50/50"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="gradient-bg text-white px-12 py-5 rounded-2xl font-bold text-xl hover:opacity-90 transition flex items-center justify-center disabled:opacity-50 shadow-xl shadow-indigo-200"
              >
                {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : 'Shorten Now'} <ChevronRight className="ml-2 w-6 h-6" />
              </button>
            </form>
          </div>

          {shortenedLink && (
            <div className="bg-indigo-600 rounded-[2rem] p-10 text-white shadow-2xl animate-in zoom-in duration-300">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-left w-full overflow-hidden">
                  <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-2">Short Link Ready:</p>
                  <div className="text-xl md:text-2xl font-black truncate bg-white/10 p-3 rounded-xl border border-white/20 font-mono">
                    {getBaseUrl()}#/s/{shortenedLink.shortCode}
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto shrink-0">
                  <button 
                    onClick={copyToClipboard}
                    className="flex-grow md:flex-initial flex items-center justify-center space-x-2 bg-white text-indigo-600 px-8 py-5 rounded-2xl font-bold hover:bg-indigo-50 transition shadow-xl"
                  >
                    {isCopied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                    <span>{isCopied ? 'Copied' : 'Copy Link'}</span>
                  </button>
                  <a 
                    href={`${getBaseUrl()}#/s/${shortenedLink.shortCode}`}
                    target="_blank"
                    className="flex items-center justify-center p-5 bg-indigo-500 text-white rounded-2xl hover:bg-indigo-400 transition border border-white/10"
                  >
                    <ExternalLink className="w-7 h-7" />
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="mt-16 flex flex-wrap justify-center gap-10 text-slate-400 font-bold text-sm">
            <div className="flex items-center space-x-3 bg-slate-50 px-5 py-2.5 rounded-full border border-slate-100">
              <Shield className="w-4 h-4 text-indigo-500" />
              <span>Blogger Optimized</span>
            </div>
            <div className="flex items-center space-x-3 bg-slate-50 px-5 py-2.5 rounded-full border border-slate-100">
              <Zap className="w-4 h-4 text-indigo-500" />
              <span>Fastest Redirects</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
