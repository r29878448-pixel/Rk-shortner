
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Save,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Database,
  Search,
  RefreshCcw,
  Type,
  Copy,
  Key,
  BarChart3,
  MousePointerClick,
  Activity,
  Globe,
  Settings
} from 'lucide-react';
import { User, SiteSettings, UserRole, Link as LinkType, ClickEvent } from '../types.ts';

interface AdminDashboardProps {
  user: User | null;
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, settings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'links' | 'settings'>('analytics');
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [success, setSuccess] = useState(false);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [clickEvents, setClickEvents] = useState<ClickEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = () => {
    setLinks(JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]'));
    setClickEvents(JSON.parse(localStorage.getItem('swiftlink_click_events') || '[]'));
  };

  useEffect(() => {
    loadData();
    setLocalSettings(settings);
  }, [settings]);

  const stats = useMemo(() => {
    const totalClicks = clickEvents.length;
    const topLink = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0];
    return { totalClicks, topLink };
  }, [clickEvents, links]);

  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-amber-50 p-8 rounded-[3rem] border border-amber-100 max-w-sm">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-slate-900 mb-2">Restricted Area</h1>
          <a href="/#/login" className="block w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl">Login</a>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    onUpdateSettings(localSettings);
    localStorage.setItem('swiftlink_settings', JSON.stringify(localSettings));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const deleteLink = (id: string) => {
    const updated = links.filter(l => l.id !== id);
    setLinks(updated);
    localStorage.setItem('swiftlink_global_links', JSON.stringify(updated));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center tracking-tighter">
            <ShieldCheck className="w-10 h-10 mr-4 text-indigo-600" /> Admin Terminal
          </h1>
          <p className="text-slate-400 mt-1 font-black uppercase text-[10px] tracking-[0.4em]">{localSettings.siteName} Enterprise</p>
        </div>
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl space-x-1 font-black uppercase text-[10px] tracking-widest">
          <button onClick={() => setActiveTab('analytics')} className={`px-6 py-3 rounded-xl transition ${activeTab === 'analytics' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Stats</button>
          <button onClick={() => setActiveTab('links')} className={`px-6 py-3 rounded-xl transition ${activeTab === 'links' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Vault</button>
          <button onClick={() => setActiveTab('settings')} className={`px-6 py-3 rounded-xl transition ${activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Ad Center</button>
        </div>
      </div>

      {success && (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-3xl flex items-center text-green-800 font-black animate-in shadow-sm">
          <CheckCircle className="w-6 h-6 mr-3" /> System synchronized globally.
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in">
          <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Total Hits</p>
             <h3 className="text-8xl font-black tracking-tighter leading-none">{stats.totalClicks}</h3>
             <BarChart3 className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5" />
          </div>
          <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Best Performer</p>
             <h3 className="text-4xl font-black tracking-tighter text-slate-900 truncate">/s/{stats.topLink?.shortCode || 'None'}</h3>
             <div className="flex items-center space-x-2 mt-4 text-indigo-600 font-black">
                <MousePointerClick className="w-5 h-5" />
                <span>{stats.topLink?.clicks || 0} clicks</span>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'links' && (
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden animate-in">
          <div className="p-10 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tighter">Database Vault</h2>
            <input 
              type="text" 
              placeholder="Filter paths..." 
              className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold w-64 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-10 py-6">Code Path</th>
                <th className="px-10 py-6">Engagement</th>
                <th className="px-10 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {links.filter(l => l.shortCode.includes(searchTerm)).map(link => (
                <tr key={link.id} className="hover:bg-slate-50 transition group">
                  <td className="px-10 py-6 font-black text-indigo-600">/s/{link.shortCode}</td>
                  <td className="px-10 py-6 font-black text-slate-900">{link.clicks || 0} hits</td>
                  <td className="px-10 py-6 text-right">
                    <button onClick={() => deleteLink(link.id)} className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition"><Trash2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-10 animate-in">
          <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black mb-10 flex items-center tracking-tighter">
              <Globe className="w-8 h-8 mr-3 text-indigo-600" /> Global Ad Management
            </h2>
            <p className="text-slate-500 mb-10 text-sm font-medium">Paste your ad scripts here. They will automatically appear in the top, middle, and bottom sections of EVERY page on the site.</p>
            
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Top Ad (Shows on all pages)</label>
                <textarea 
                  className="w-full h-24 p-6 bg-slate-50 border border-slate-200 rounded-3xl text-[10px] font-mono focus:outline-none focus:ring-4 focus:ring-indigo-50"
                  value={localSettings.adSlots.top}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, top: e.target.value}})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Middle Ad (Shows inside articles/home)</label>
                <textarea 
                  className="w-full h-24 p-6 bg-slate-50 border border-slate-200 rounded-3xl text-[10px] font-mono focus:outline-none focus:ring-4 focus:ring-indigo-50"
                  value={localSettings.adSlots.middle}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, middle: e.target.value}})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Bottom Ad (Shows in footer area)</label>
                <textarea 
                  className="w-full h-24 p-6 bg-slate-50 border border-slate-200 rounded-3xl text-[10px] font-mono focus:outline-none focus:ring-4 focus:ring-indigo-50"
                  value={localSettings.adSlots.bottom}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, bottom: e.target.value}})}
                />
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
             <div>
                <h3 className="text-2xl font-black tracking-tighter">Ready to Deploy?</h3>
                <p className="text-indigo-200 text-xs font-medium mt-2">Apply these global advertisement changes instantly.</p>
             </div>
             <button onClick={handleSave} className="bg-white text-indigo-600 px-12 py-6 rounded-[2.5rem] font-black uppercase text-sm shadow-2xl flex items-center hover:scale-105 transition">
                <Save className="w-5 h-5 mr-3" /> Save Changes
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
