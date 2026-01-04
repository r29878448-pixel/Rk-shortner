
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, Loader2, Zap, Link as LinkIcon } from 'lucide-react';
import { Link as LinkType, SiteSettings, User } from '../types.ts';
import { DEFAULT_SETTINGS } from '../constants.tsx';

interface HomePageProps {
  siteName: string;
  settings: SiteSettings;
  currentUser: User | null;
}

const HomePage: React.FC<HomePageProps> = ({ siteName, settings, currentUser: initialUser }) => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [shortenedLink, setShortenedLink] = useState<LinkType | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => { setUser(initialUser); }, [initialUser]);

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    const sessionUser = user || JSON.parse(localStorage.getItem('swiftlink_user') || 'null');
    if (!sessionUser) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const shortCode = Math.random().toString(36).substring(2, 9);
      const newLink: LinkType = {
        id: Math.random().toString(36).substring(7),
        userId: sessionUser.id,
        originalUrl: url,
        shortCode,
        clicks: 0,
        createdAt: new Date()
      };
      
      const existing = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
      localStorage.setItem('swiftlink_global_links', JSON.stringify([newLink, ...existing]));
      setShortenedLink(newLink);
      setIsLoading(false);
      setUrl('');
    }, 800);
  };

  const copyToClipboard = () => {
    if (!shortenedLink) return;
    const baseUrl = window.location.origin + window.location.pathname.split('#')[0];
    const finalUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}#/s/${shortenedLink.shortCode}`;
    navigator.clipboard.writeText(finalUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white min-h-[70vh] flex flex-col justify-center py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-12">
          <Zap className="w-4 h-4" /> <span>Unified Link Relay Network</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 uppercase leading-none">
          Fast. Secure. <br /> <span className="text-indigo-600">Monetized.</span>
        </h1>
        
        <form onSubmit={handleShorten} className="bg-white p-2 border-2 border-slate-100 flex flex-col md:flex-row gap-3 max-w-2xl mx-auto mb-16 shadow-2xl shadow-slate-200/50 rounded-2xl">
          <input 
            type="url" 
            placeholder="Paste your destination link here..." 
            className="flex-grow px-8 py-5 bg-slate-50 border-none rounded-xl focus:ring-0 font-bold text-slate-700"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white px-10 py-5 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-indigo-700 transition flex items-center justify-center min-w-[180px]">
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Start Relay'}
          </button>
        </form>

        {shortenedLink && (
          <div className="bg-slate-900 p-8 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 max-w-2xl mx-auto animate-in border border-white/10 shadow-2xl">
            <div className="text-left overflow-hidden w-full">
              <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-2">Relay Port Ready</p>
              <span className="text-sm font-mono truncate block text-indigo-100 opacity-80">
                {window.location.origin + window.location.pathname.split('#')[0]}#/s/{shortenedLink.shortCode}
              </span>
            </div>
            <button onClick={copyToClipboard} className="w-full md:w-auto bg-white text-slate-900 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-3 transition hover:bg-indigo-50">
              {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'Copied' : 'Copy URL'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
