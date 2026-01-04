
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, Loader2, Zap, Globe, Cpu, Shield, ArrowRight } from 'lucide-react';
import { Link as LinkType, SiteSettings, User } from '../types.ts';

interface HomePageProps {
  siteName: string;
  settings: SiteSettings;
  currentUser: User | null;
}

const HomePage: React.FC<HomePageProps> = ({ settings, currentUser: initialUser }) => {
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
        <div className="inline-flex items-center space-x-3 bg-indigo-50 text-indigo-600 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.25em] mb-12 shadow-sm border border-indigo-100">
          <Globe className="w-5 h-5" /> <span>{settings.siteName.toUpperCase()} GLOBAL RELAY</span>
        </div>
        
        <h1 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter mb-10 uppercase leading-[0.8] text-balance">
          Manage <br /> <span className="text-indigo-600">Infrastructure.</span>
        </h1>
        
        <p className="text-slate-400 font-bold uppercase tracking-[0.5em] text-[12px] mb-16">Enterprise Link Redirection & Scaling</p>
        
        <form onSubmit={handleShorten} className="bg-white p-3 border border-slate-200 flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-24 shadow-2xl rounded-xl transition-all focus-within:border-indigo-500">
          <input 
            type="url" 
            placeholder="Target Destination (https://...)" 
            className="flex-grow px-8 py-6 bg-slate-50 border-none rounded-xl focus:ring-0 font-bold text-slate-700 placeholder:text-slate-300"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white px-12 py-6 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center min-w-[200px] active:scale-95 group">
            {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : (
              <>
                Create Relay <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </form>

        {shortenedLink && (
          <div className="bg-slate-900 p-10 rounded-xl text-white flex flex-col md:flex-row items-center justify-between gap-8 max-w-2xl mx-auto animate-in border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
            <div className="text-left overflow-hidden w-full">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-4">Relay Protocol Active</p>
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <span className="text-base font-mono truncate block text-indigo-100/90">
                  {window.location.origin + window.location.pathname.split('#')[0]}#/s/{shortenedLink.shortCode}
                </span>
              </div>
            </div>
            <button onClick={copyToClipboard} className="w-full md:w-auto bg-white text-slate-900 px-10 py-5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-3 transition-all hover:bg-indigo-50 active:scale-95 shadow-xl shrink-0">
              {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}

        <div className="mt-32 flex flex-col md:flex-row justify-center items-center gap-16 opacity-40">
           <div className="flex items-center space-x-4"><Cpu className="w-6 h-6" /> <span className="text-[10px] font-black uppercase tracking-widest">Global Telemetry</span></div>
           <div className="flex items-center space-x-4"><Shield className="w-6 h-6" /> <span className="text-[10px] font-black uppercase tracking-widest">Secure Handshake</span></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
