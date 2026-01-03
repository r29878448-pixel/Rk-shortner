
import React, { useState } from 'react';
import { Copy, Check, Loader2, Zap, Link as LinkIcon } from 'lucide-react';
import { Link as LinkType, SiteSettings } from '../types.ts';

interface HomePageProps {
  siteName: string;
  settings: SiteSettings;
}

const HomePage: React.FC<HomePageProps> = ({ siteName, settings }) => {
  const [url, setUrl] = useState('');
  const [shortenedLink, setShortenedLink] = useState<LinkType | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Generates a short, professional 7-character alphanumeric code.
   */
  const generateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 7; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const shortCode = generateShortCode();
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

  const copyToClipboard = () => {
    if (!shortenedLink) return;
    const fullUrl = `${window.location.href.split('#')[0]}#/s/${shortenedLink.shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white min-h-[70vh] flex flex-col justify-center py-20 px-4 font-sans">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-10">
          <Zap className="w-4 h-4" /> <span>Next-Gen URL Relaying</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-8 leading-tight">
          Smarter Link <br />
          <span className="text-indigo-600">Infrastructure.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-14 font-medium leading-relaxed">
          Secure, stable, and high-performance link redirection for professional creators. 
          Manage your digital assets with enterprise-grade stability.
        </p>

        <form onSubmit={handleShorten} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 max-w-2xl mx-auto mb-16 shadow-lg">
          <div className="relative flex-grow">
            <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="url" 
              placeholder="Paste your long destination URL here..." 
              className="w-full pl-14 pr-6 py-5 rounded bg-white border border-slate-200 focus:border-indigo-500 focus:outline-none font-semibold text-slate-700 shadow-inner"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <button className="bg-indigo-600 text-white px-10 py-5 rounded font-bold uppercase text-sm shadow-xl hover:bg-indigo-700 transition flex items-center justify-center min-w-[180px]">
            {isLoading ? <Loader2 className="animate-spin" /> : 'Shorten URL'}
          </button>
        </form>

        {shortenedLink && (
          <div className="bg-slate-900 p-8 rounded-xl text-white flex flex-col md:flex-row items-center justify-between gap-6 max-w-2xl mx-auto animate-in border-4 border-slate-800 shadow-2xl">
            <div className="text-left overflow-hidden">
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Your Secure Link</p>
              <span className="text-xl font-mono truncate block text-indigo-50">
                {window.location.href.split('#')[0]}#/s/{shortenedLink.shortCode}
              </span>
            </div>
            <button onClick={copyToClipboard} className="bg-white text-slate-900 px-8 py-4 rounded font-bold text-xs uppercase tracking-widest flex items-center space-x-3 shrink-0 hover:bg-indigo-50 transition">
              {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              <span>{isCopied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
