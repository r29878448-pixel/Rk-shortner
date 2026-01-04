
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Link as LinkIcon, 
  Check, 
  Plus, 
  TrendingUp,
  Wallet,
  Globe
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

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Publisher Panel</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Active Link Relay Station</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => window.open(settings.telegramBotUrl, '_blank')} className="flex items-center px-8 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
            <Wallet className="w-5 h-5 mr-3" /> Withdraw ₹{totalEarnings.toFixed(2)}
          </button>
          <button onClick={() => navigate('/')} className="flex items-center px-8 py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
            <Plus className="w-5 h-5 mr-3" /> New Link
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Global Earnings</p>
           <h3 className="text-3xl font-black text-slate-900">₹{totalEarnings.toFixed(2)}</h3>
        </div>
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Total Relay Hits</p>
           <h3 className="text-3xl font-black text-slate-900">{links.reduce((s, l) => s + (l.clicks || 0), 0)}</h3>
        </div>
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Network Status</p>
           <h3 className="text-3xl font-black text-indigo-600 uppercase tracking-tighter">Verified</h3>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
           <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Active Relays</h2>
           <Globe className="w-5 h-5 text-slate-300" />
        </div>
        <div className="overflow-x-auto">
          {links.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border-b border-slate-100">
                  <th className="px-10 py-6">Relay Path</th>
                  <th className="px-10 py-6">Hits</th>
                  <th className="px-10 py-6">Earnings</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {links.map(link => (
                  <tr key={link.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-10 py-8">
                      <p className="text-indigo-600 font-black text-base">/s/{link.shortCode}</p>
                      <p className="text-[9px] text-slate-400 font-mono truncate max-w-[200px]">{link.originalUrl}</p>
                    </td>
                    <td className="px-10 py-8 font-black text-slate-900">{link.clicks || 0}</td>
                    <td className="px-10 py-8 font-black text-green-600">₹{(link.earnings || 0).toFixed(2)}</td>
                    <td className="px-10 py-8 text-right flex justify-end">
                      <button onClick={() => handleCopy(`${window.location.origin + window.location.pathname.split('#')[0]}#/s/${link.shortCode}`, link.id)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition shadow-sm">
                        {copyStatus[link.id] ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-20 text-center text-slate-300 font-black uppercase tracking-widest">No Active Relays Found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
