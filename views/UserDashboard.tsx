
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Link as LinkIcon, 
  Check, 
  Plus, 
  TrendingUp,
  Wallet,
  Globe,
  Key,
  Copy,
  Terminal,
  ArrowUpRight
} from 'lucide-react';
import { User, Link as LinkType, SiteSettings } from '../types.ts';
import { DEFAULT_SETTINGS } from '../constants.tsx';

interface UserDashboardProps {
  user: User | null;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [links, setLinks] = useState<LinkType[]>([]);
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});
  const [isKeyCopied, setIsKeyCopied] = useState(false);
  const settings: SiteSettings = JSON.parse(localStorage.getItem('swiftlink_settings') || JSON.stringify(DEFAULT_SETTINGS));

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const allLinks = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
    setLinks(allLinks.filter((l: any) => l.userId === user.id));
  }, [user, navigate]);

  const totalEarnings = useMemo(() => links.reduce((sum, link) => sum + (link.earnings || 0), 0), [links]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus({ ...copyStatus, [id]: true });
    setTimeout(() => setCopyStatus({ ...copyStatus, [id]: false }), 2000);
  };

  const copyApiKey = () => {
    if (user?.apiKey) {
      navigator.clipboard.writeText(user.apiKey);
      setIsKeyCopied(true);
      setTimeout(() => setIsKeyCopied(false), 2000);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Publisher Panel</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Active Link Relay Status</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => window.open(settings.telegramBotUrl, '_blank')} className="flex items-center px-8 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all hover:bg-black active:scale-95">
            <Wallet className="w-5 h-5 mr-3" /> Withdraw ₹{totalEarnings.toFixed(2)}
          </button>
          <button onClick={() => navigate('/')} className="flex items-center px-8 py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all hover:bg-indigo-700 active:scale-95">
            <Plus className="w-5 h-5 mr-3" /> New Link
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm transition-hover hover:shadow-md">
           <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Global Earnings</p>
           <h3 className="text-4xl font-black text-slate-900 tracking-tighter">₹{totalEarnings.toFixed(2)}</h3>
        </div>
        <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm transition-hover hover:shadow-md">
           <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Network Hits</p>
           <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{links.reduce((s, l) => s + (l.clicks || 0), 0)}</h3>
        </div>
        <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm transition-hover hover:shadow-md">
           <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Node Status</p>
           <h3 className="text-4xl font-black text-indigo-600 tracking-tighter uppercase">Verified</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[60px] rounded-full -translate-y-12 translate-x-12 group-hover:bg-indigo-600/40 transition-all"></div>
           <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <Terminal className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-black uppercase tracking-tight">API Access</h2>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Secret Access Token</p>
              <div className="bg-white/10 p-4 rounded-xl border border-white/5 font-mono text-xs text-indigo-200 mb-8 truncate">
                {user.apiKey}
              </div>
              <div className="space-y-3">
                <button onClick={copyApiKey} className="w-full flex items-center justify-center gap-2 py-5 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition active:scale-95">
                  {isKeyCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {isKeyCopied ? 'Token Copied' : 'Copy API Token'}
                </button>
                <button onClick={() => navigate('/api')} className="w-full flex items-center justify-center gap-2 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition">
                  <Globe className="w-4 h-4" /> Developer Hub
                </button>
              </div>
           </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
             <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Active Relays</h2>
             <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
               <Globe className="w-4 h-4 mr-2" /> Global Traffic
             </div>
          </div>
          <div className="overflow-x-auto">
            {links.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/30 border-b border-slate-100">
                    <th className="px-10 py-6">ID / PATH</th>
                    <th className="px-10 py-6">HITS</th>
                    <th className="px-10 py-6">EARNED</th>
                    <th className="px-10 py-6 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {links.map(link => (
                    <tr key={link.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-10 py-8">
                        <p className="text-indigo-600 font-black text-base flex items-center">
                          /s/{link.shortCode} <ArrowUpRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </p>
                        <p className="text-[9px] text-slate-400 font-mono truncate max-w-[200px] mt-1">{link.originalUrl}</p>
                      </td>
                      <td className="px-10 py-8 font-black text-slate-900 text-lg">{link.clicks || 0}</td>
                      <td className="px-10 py-8 font-black text-green-600 text-lg">₹{(link.earnings || 0).toFixed(2)}</td>
                      <td className="px-10 py-8 text-right">
                        <button onClick={() => handleCopy(`${window.location.origin + window.location.pathname.split('#')[0]}#/s/${link.shortCode}`, link.id)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition shadow-sm hover:shadow active:scale-95">
                          {copyStatus[link.id] ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-20 text-center text-slate-300 font-black uppercase tracking-widest">No Active Links Created.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
