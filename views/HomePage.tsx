
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

  const copyToClipboard = () => {
    if (!shortenedLink) return;
    const fullUrl = `${window.location.href.split('#')[0]}#/s/${shortenedLink.shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white min-h-[80vh] py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
          Smart Link <br />
          <span className="text-indigo-600">Ecosystem.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-xl mx-auto mb-14 font-medium">The advanced multi-step redirect engine for {siteName}.</p>

        <form onSubmit={handleShorten} className="bg-white p-3 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-3 max-w-2xl mx-auto mb-16">
          <input 
            type="url" 
            placeholder="Destination link..." 
            className="flex-grow px-8 py-5 rounded-[2.5rem] bg-slate-50 focus:outline-none font-medium"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button className="bg-indigo-600 text-white px-10 py-5 rounded-[2.5rem] font-black uppercase text-sm shadow-xl hover:bg-indigo-700 transition">
            {isLoading ? <Loader2 className="animate-spin" /> : 'Shorten'}
          </button>
        </form>

        {shortenedLink && (
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 max-w-2xl mx-auto">
            <span className="text-sm font-mono truncate">{window.location.href.split('#')[0]}#/s/{shortenedLink.shortCode}</span>
            <button onClick={copyToClipboard} className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-2">
              {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'Copied' : 'Copy URL'}</span>
            </button>
          </div>
        )}

        {/* Global Middle Ad */}
        <AdSlot html={settings.adSlots.middle} className="mt-20" />
      </div>
    </div>
  );
};

export default HomePage;
