
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, Loader2, Zap, Link as LinkIcon } from 'lucide-react';
import { Link as LinkType, SiteSettings, User, SubscriptionPlan } from '../types.ts';
import { DEFAULT_SETTINGS } from '../constants.tsx';

interface HomePageProps {
  siteName: string;
  settings: SiteSettings;
  currentUser: User | null;
}

const HomePage: React.FC<HomePageProps> = ({ siteName, settings, currentUser }) => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [shortenedLink, setShortenedLink] = useState<LinkType | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use latest settings
  const activeSettings: SiteSettings = JSON.parse(localStorage.getItem('swiftlink_settings') || JSON.stringify(DEFAULT_SETTINGS));

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
    
    // Auth Check
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Plan Limit Check
    const existing = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
    const userLinksCount = existing.filter((l: any) => l.userId === currentUser.id).length;
    
    let limit = activeSettings.planConfig.freeLimit;
    if (currentUser.plan === SubscriptionPlan.PRO) limit = activeSettings.planConfig.proLimit;
    if (currentUser.plan === SubscriptionPlan.BUSINESS) limit = activeSettings.planConfig.businessLimit;

    if (userLinksCount >= limit) {
      alert(`Plan limit reached (${limit} links). Please upgrade your account.`);
      navigate('/pricing');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const shortCode = generateShortCode();
      const newLink: LinkType = {
        id: Math.random().toString(36).substring(7),
        userId: currentUser.id,
        originalUrl: url,
        shortCode,
        clicks: 0,
        createdAt: new Date()
      };
      
      localStorage.setItem('swiftlink_global_links', JSON.stringify([newLink, ...existing]));
      setShortenedLink(newLink);
      setIsLoading(false);
    }, 600);
  };

  const copyToClipboard = () => {
    if (!shortenedLink) return;
    const baseUrl = window.location.origin + window.location.pathname;
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl.replace(/\/[^\/]*$/, '/');
    const fullUrl = `${cleanBaseUrl}#/s/${shortenedLink.shortCode}`;
    
    navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white min-h-[75vh] flex flex-col justify-center py-12 px-6 font-sans">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-12">
          <Zap className="w-4 h-4" /> <span>Enterprise Link Relay</span>
        </div>
        
        <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 md:mb-10 leading-none uppercase">
          Digital Assets, <br />
          <span className="text-indigo-600">Re-imagined.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
          The ultimate link tracking and secure redirection engine for professional content networks.
        </p>

        <form onSubmit={handleShorten} className="bg-white p-2 md:p-3 rounded border-2 border-slate-100 flex flex-col md:flex-row gap-2 md:gap-3 max-w-2xl mx-auto mb-16 shadow-xl shadow-slate-100/50">
          <div className="relative flex-grow">
            <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="url" 
              placeholder="Paste destination URL..." 
              className="w-full pl-14 pr-6 py-6 rounded-lg bg-slate-50 border-none focus:ring-4 focus:ring-indigo-100 focus:outline-none font-bold text-slate-700 transition"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <button className="bg-indigo-600 text-white px-12 py-6 rounded font-black uppercase text-sm tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center min-w-[200px] active:scale-95">
            {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : 'Start Relay'}
          </button>
        </form>

        {shortenedLink && (
          <div className="bg-slate-900 p-10 rounded text-white flex flex-col md:flex-row items-center justify-between gap-6 max-w-2xl mx-auto animate-in border-4 border-slate-800 shadow-2xl">
            <div className="text-left overflow-hidden w-full">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-3">Live Node Ready</p>
              <span className="text-lg md:text-xl font-mono truncate block text-indigo-50 bg-slate-800/50 px-4 py-2 rounded">
                {window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/')}#/s/${shortenedLink.shortCode}
              </span>
            </div>
            <button onClick={copyToClipboard} className="w-full md:w-auto bg-white text-slate-900 px-8 py-5 rounded font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-3 shrink-0 hover:bg-indigo-50 transition shadow-lg">
              {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
