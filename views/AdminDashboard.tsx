
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
          <p className="text-slate-500 mb-6 text-sm">Please log in to manage your link monetization platform.</p>
          <a href="/#/login" className="block w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl">Go to Login</a>
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
    if(!confirm("Permanently delete this link?")) return;
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
          <p className="text-slate-400 mt-1 font-black uppercase text-[10px] tracking-[0.4em]">{localSettings.siteName} Enterprise Control</p>
        </div>
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl space-x-1 font-black uppercase text-[10px] tracking-widest">
          <button onClick={() => setActiveTab('analytics')} className={`px-6 py-3 rounded-xl transition ${activeTab === 'analytics' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Analytics</button>
          <button onClick={() => setActiveTab('links')} className={`px-6 py-3 rounded-xl transition ${activeTab === 'links' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Vault</button>
          <button onClick={() => setActiveTab('settings')} className={`px-6 py-3 rounded-xl transition ${activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Ad Center</button>
        </div>
      </div>

      {success && (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-3xl flex items-center text-green-800 font-black animate-in shadow-sm">
          <CheckCircle className="w-6 h-6 mr-3" /> System synchronized. Ads are now live globally across all pages.
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in">
          <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Aggregate Engagement</p>
             <h3 className="text-8xl font-black tracking-tighter leading-none">{stats.totalClicks}</h3>
             <BarChart3 className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5" />
          </div>
          <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">High Yield Path</p>
             <h3 className="text-4xl font-black tracking-tighter text-slate-900 truncate">/s/{stats.topLink?.shortCode || 'None'}</h3>
             <div className="flex items-center space-x-2 mt-4 text-indigo-600 font-black">
                <MousePointerClick className="w-5 h-5" />
                <span>{stats.topLink?.clicks || 0} Successful Redirects</span>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'links' && (
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden animate-in">
          <div className="p-10 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tighter uppercase">Link Database</h2>
            <input 
              type="text" 
              placeholder="Search links..." 
              className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold w-64 focus:outline-none focus:ring-4 focus:ring-indigo-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-10 py-8">Short URL</th>
                <th className="px-10 py-8">Target Destination</th>
                <th className="px-10 py-8">Performance</th>
                <th className="px-10 py-8 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {links.filter(l => l.shortCode.includes(searchTerm)).map(link => (
                <tr key={link.id} className="hover:bg-slate-50 transition group">
                  <td className="px-10 py-8 font-black text-indigo-600 text-lg">/s/{link.shortCode}</td>
                  <td className="px-10 py-8 truncate max-w-xs text-slate-400 font-mono text-xs">{link.originalUrl}</td>
                  <td className="px-10 py-8 font-black text-slate-900">{link.clicks || 0} hits</td>
                  <td className="px-10 py-8 text-right">
                    <button onClick={() => deleteLink(link.id)} className="p-4 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition"><Trash2 className="w-6 h-6" /></button>
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
              <Globe className="w-8 h-8 mr-4 text-indigo-600" /> Automated Global Ads
            </h2>
            <p className="text-slate-500 mb-10 text-sm font-medium">Any code pasted here will be <strong>automatically injected</strong> across your entire site in the corresponding positions.</p>
            
            <div className="grid grid-cols-1 gap-12">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Header Ad (Shows at absolute top of all pages)</label>
                  <span className="text-[10px] font-black text-indigo-500 uppercase">Automated Slot 1</span>
                </div>
                <textarea 
                  className="w-full h-32 p-8 bg-slate-50 border border-slate-200 rounded-3xl text-[10px] font-mono focus:outline-none focus:ring-4 focus:ring-indigo-50 resize-none shadow-inner"
                  value={localSettings.adSlots.top}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, top: e.target.value}})}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Middle Ad (Shows inside blog content & home page middle)</label>
                  <span className="text-[10px] font-black text-indigo-500 uppercase">Automated Slot 2</span>
                </div>
                <textarea 
                  className="w-full h-32 p-8 bg-slate-50 border border-slate-200 rounded-3xl text-[10px] font-mono focus:outline-none focus:ring-4 focus:ring-indigo-50 resize-none shadow-inner"
                  value={localSettings.adSlots.middle}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, middle: e.target.value}})}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Footer Ad (Shows above page footer area)</label>
                  <span className="text-[10px] font-black text-indigo-500 uppercase">Automated Slot 3</span>
                </div>
                <textarea 
                  className="w-full h-32 p-8 bg-slate-50 border border-slate-200 rounded-3xl text-[10px] font-mono focus:outline-none focus:ring-4 focus:ring-indigo-50 resize-none shadow-inner"
                  value={localSettings.adSlots.bottom}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, bottom: e.target.value}})}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
             <h2 className="text-2xl font-black mb-10 flex items-center tracking-tighter">
                <Settings className="w-8 h-8 mr-4 text-indigo-600" /> Logic Config
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Redirect Steps</label>
                   <input 
                     type="number"
                     min="1"
                     max="10"
                     className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-3xl focus:outline-none"
                     value={localSettings.totalSteps}
                     onChange={(e) => setLocalSettings({...localSettings, totalSteps: parseInt(e.target.value) || 1})}
                   />
                </div>
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Wait Timer (Seconds)</label>
                   <input 
                     type="number"
                     className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-3xl focus:outline-none"
                     value={localSettings.redirectDelay}
                     onChange={(e) => setLocalSettings({...localSettings, redirectDelay: parseInt(e.target.value) || 0})}
                   />
                </div>
             </div>
          </div>

          <div className="bg-indigo-600 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-indigo-200">
             <div className="text-center md:text-left">
                <h3 className="text-3xl font-black tracking-tighter">Update Global Ad Infrastructure?</h3>
                <p className="text-indigo-200 text-sm font-medium mt-2">This will update all slots live across all verification paths instantly.</p>
             </div>
             <button onClick={handleSave} className="bg-white text-indigo-600 px-16 py-6 rounded-3xl font-black uppercase text-lg shadow-2xl hover:scale-105 transition active:scale-95">
                <Save className="w-6 h-6 mr-3 inline-block" /> Sync Configuration
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
