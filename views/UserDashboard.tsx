
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Link as LinkIcon, 
  Copy, 
  Check, 
  Zap, 
  BarChart3, 
  Key, 
  Plus, 
  TrendingUp,
  Clock,
  Trash2,
  Lock,
  Rocket,
  AlertCircle,
  Wallet,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { User, Link as LinkType, SubscriptionPlan, SiteSettings } from '../types.ts';
import { DEFAULT_SETTINGS } from '../constants.tsx';

interface UserDashboardProps {
  user: User | null;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [links, setLinks] = useState<LinkType[]>([]);
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});

  const settings: SiteSettings = JSON.parse(localStorage.getItem('swiftlink_settings') || JSON.stringify(DEFAULT_SETTINGS));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const allLinks = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
    setLinks(allLinks.filter((l: any) => l.userId === user.id));
  }, [user, navigate]);

  const totalEarnings = useMemo(() => {
    return links.reduce((sum, link) => sum + (link.earnings || 0), 0);
  }, [links]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus({ ...copyStatus, [id]: true });
    setTimeout(() => setCopyStatus({ ...copyStatus, [id]: false }), 2000);
  };

  const handleWithdraw = () => {
    window.open(`${settings.telegramBotUrl}?text=I%20want%20to%20withdraw%20my%20balance.%20User%20ID:%20${user?.id}%20Current%20Balance:%20₹${totalEarnings.toFixed(2)}`, '_blank');
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Publisher Terminal</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Link Monetization Node</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleWithdraw} className="flex items-center px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-black transition active:scale-95">
            <Wallet className="w-5 h-5 mr-3" /> Withdraw
          </button>
          <button onClick={() => navigate('/')} className="flex items-center px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition active:scale-95">
            <Plus className="w-5 h-5 mr-3" /> New Link
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Available Balance</p>
           <h3 className="text-3xl font-black text-slate-900">₹{totalEarnings.toFixed(2)}</h3>
           <div className="mt-4 flex items-center text-green-500 text-[9px] font-bold uppercase tracking-widest">
             <TrendingUp className="w-3 h-3 mr-1" /> Live tracking active
           </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Network CPM</p>
           <h3 className="text-3xl font-black text-indigo-600">₹{settings.cpmRate}</h3>
           <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">per 1,000 unique hits</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Total Hits</p>
           <h3 className="text-3xl font-black text-slate-900">{links.reduce((s, l) => s + (l.clicks || 0), 0)}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Active Plan</p>
           <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{user.plan}</h3>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Real-Time Analytics</h2>
           <BarChart3 className="w-6 h-6 text-slate-200" />
        </div>
        <div className="overflow-x-auto">
          {links.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border-b border-slate-100">
                  <th className="px-10 py-6">Link Endpoint</th>
                  <th className="px-10 py-6">Hits</th>
                  <th className="px-10 py-6">Earnings</th>
                  <th className="px-10 py-6 text-right">Relay Port</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {links.map(link => (
                  <tr key={link.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-10 py-8">
                      <p className="text-indigo-600 font-black text-lg">/s/{link.shortCode}</p>
                      <p className="text-[9px] text-slate-400 font-mono truncate max-w-[200px]">{link.originalUrl}</p>
                    </td>
                    <td className="px-10 py-8 font-black text-slate-900 text-xl">{link.clicks || 0}</td>
                    <td className="px-10 py-8 font-black text-green-600 text-xl">₹{(link.earnings || 0).toFixed(2)}</td>
                    <td className="px-10 py-8 text-right flex justify-end space-x-3">
                      <button onClick={() => handleCopy(`${window.location.origin}#/s/${link.shortCode}`, link.id)} className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-400 hover:text-indigo-600 transition">
                        {copyStatus[link.id] ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-20 text-center">
              <LinkIcon className="w-16 h-16 text-slate-100 mx-auto mb-6" />
              <p className="text-slate-300 font-black uppercase tracking-widest">Terminal Empty. Deploy first link to start earning.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 shadow-2xl">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
               <Key className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">Developer API Access</p>
               <p className="font-mono text-xs opacity-60 truncate max-w-xs">{user.apiKey}</p>
            </div>
         </div>
         <button onClick={() => handleCopy(user.apiKey, 'api')} className="bg-white text-slate-900 px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-50 transition">
            {copyStatus['api'] ? 'Copied' : 'Copy API Key'}
         </button>
      </div>
    </div>
  );
};

export default UserDashboard;
