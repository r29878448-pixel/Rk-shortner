
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, Loader2, Zap, Link as LinkIcon, Globe, ArrowRight, Cpu, Shield } from 'lucide-react';
import { Link as LinkType, SiteSettings, User } from '../types.ts';

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
    <div className="bg-white min-h-[80vh] flex flex-col justify-center py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] mb-12 shadow-sm">
          <Globe className="w-4 h-4" /> <span>Global Link Relay Node</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter mb-10 uppercase leading-[0.85] text-balance">
          Scale Your <br /> <span className="text-indigo-600">Earnings.</span>
        </h1>
        
        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-16">Enterprise Level Link Monetization & Tracking</p>
        
        <form onSubmit={handleShorten} className="bg-white p-3 border-4 border-slate-50 flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-20 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] rounded-[2.5rem] transition-all focus-within:border-indigo-50">
          <input 
            type="url" 
            placeholder="Enter your destination link..." 
            className="flex-grow px-10 py-6 bg-slate-50 border-none rounded-[1.8rem] focus:ring-4 focus:ring-indigo-100 font-bold text-slate-700 placeholder:text-slate-300"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white px-12 py-6 rounded-[1.8rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center min-w-[200px] active:scale-95">
            {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : 'Start Relay'}
          </button>
        </form>

        {shortenedLink && (
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 max-w-2xl mx-auto animate-in border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Zap className="w-32 h-32 text-white" />
            </div>
            <div className="text-left overflow-hidden w-full relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-4">Relay Endpoint Generated</p>
              <span className="text-lg md:text-xl font-mono truncate block text-indigo-100/80 bg-white/5 p-5 rounded-2xl border border-white/5">
                {window.location.origin + window.location.pathname.split('#')[0]}#/s/{shortenedLink.shortCode}
              </span>
            </div>
            <button onClick={copyToClipboard} className="w-full md:w-auto bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-3 transition-all hover:bg-indigo-50 active:scale-95 shadow-xl shrink-0 relative z-10">
              {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}

        <div className="mt-20 pt-16 border-t border-slate-50 flex flex-col md:flex-row justify-center items-center gap-10 opacity-30">
           {/* Fixed: Added missing Cpu and Shield icon imports from lucide-react */}
           <div className="flex items-center space-x-3 grayscale"><Cpu className="w-6 h-6" /> <span className="text-[10px] font-black uppercase tracking-widest">Low Latency</span></div>
           <div className="flex items-center space-x-3 grayscale"><Shield className="w-6 h-6" /> <span className="text-[10px] font-black uppercase tracking-widest">Secured Node</span></div>
           <div className="flex items-center space-x-3 grayscale"><Globe className="w-6 h-6" /> <span className="text-[10px] font-black uppercase tracking-widest">Global CDN</span></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
