
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Save,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Settings,
  Globe,
  Code,
  MousePointerClick,
  BarChart3,
  Copy,
  Check,
  Key,
  Link as LinkIcon,
  Plus,
  X,
  Zap,
  Cpu,
  Terminal
} from 'lucide-react';
import { User, SiteSettings, UserRole, Link as LinkType, ClickEvent } from '../types.ts';

interface AdminDashboardProps {
  user: User | null;
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, settings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'links' | 'ads' | 'api'>('analytics');
  // Initialize with fallback to prevent "not opening" if settings are partially missing
  const [localSettings, setLocalSettings] = useState<SiteSettings>({
    ...settings,
    adSlots: {
      ...settings.adSlots,
      contentAds: settings.adSlots.contentAds || []
    }
  });
  const [success, setSuccess] = useState(false);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [clickEvents, setClickEvents] = useState<ClickEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLinks(JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]'));
    setClickEvents(JSON.parse(localStorage.getItem('swiftlink_click_events') || '[]'));
  }, []);

  // Sync when parent settings change
  useEffect(() => {
    setLocalSettings({
      ...settings,
      adSlots: {
        ...settings.adSlots,
        contentAds: settings.adSlots.contentAds || []
      }
    });
  }, [settings]);

  const stats = useMemo(() => {
    return {
      totalClicks: clickEvents.length,
      totalLinks: links.length,
      topLink: [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0]
    };
  }, [clickEvents, links]);

  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-2xl text-center max-w-sm">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black uppercase text-slate-900 tracking-tighter">Access Denied</h2>
          <p className="text-slate-500 text-sm mt-3 font-medium">Administrator authentication required to access this terminal.</p>
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
    if(!confirm("Permanently wipe this relay link from the database?")) return;
    const updated = links.filter(l => l.id !== id);
    setLinks(updated);
    localStorage.setItem('swiftlink_global_links', JSON.stringify(updated));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus({ ...copyStatus, [id]: true });
    setTimeout(() => setCopyStatus({ ...copyStatus, [id]: false }), 2000);
  };

  const platformUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
  // VP Links style standard format
  const apiFormat = `${platformUrl}#/api?api=${user.apiKey}&url=https://yourlink.com`;

  const addContentAd = () => {
    setLocalSettings(prev => ({
      ...prev,
      adSlots: {
        ...prev.adSlots,
        contentAds: [...(prev.adSlots.contentAds || []), '']
      }
    }));
  };

  const removeContentAd = (index: number) => {
    const newAds = [...localSettings.adSlots.contentAds];
    newAds.splice(index, 1);
    setLocalSettings({
      ...localSettings,
      adSlots: { ...localSettings.adSlots, contentAds: newAds }
    });
  };

  const updateContentAd = (index: number, val: string) => {
    const newAds = [...localSettings.adSlots.contentAds];
    newAds[index] = val;
    setLocalSettings({
      ...localSettings,
      adSlots: { ...localSettings.adSlots, contentAds: newAds }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center uppercase tracking-tighter">
            <ShieldCheck className="w-10 h-10 mr-4 text-indigo-600" /> Admin Station
          </h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em] mt-2">Enterprise Network Control Terminal</p>
        </div>
        
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-xl overflow-x-auto no-scrollbar">
          {[
            { id: 'analytics', label: 'Metrics', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
            { id: 'links', label: 'Link Vault', icon: <LinkIcon className="w-4 h-4 mr-2" /> },
            { id: 'ads', label: 'Ads Manager', icon: <Globe className="w-4 h-4 mr-2" /> },
            { id: 'api', label: 'API Relay', icon: <Terminal className="w-4 h-4 mr-2" /> }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {success && (
        <div className="mb-10 p-6 bg-green-600 text-white rounded-2xl font-black text-sm flex items-center shadow-2xl animate-in">
          <CheckCircle className="w-6 h-6 mr-4" /> System protocol updated. Changes are live.
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in">
          <div className="bg-white border border-slate-200 p-12 rounded-[2.5rem] shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.3em]">Total Conversions</p>
             <h3 className="text-6xl font-black text-slate-900 tracking-tighter">{stats.totalClicks}</h3>
          </div>
          <div className="bg-white border border-slate-200 p-12 rounded-[2.5rem] shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.3em]">Active Relays</p>
             <h3 className="text-6xl font-black text-slate-900 tracking-tighter">{stats.totalLinks}</h3>
          </div>
          <div className="bg-white border border-slate-200 p-12 rounded-[2.5rem] shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.3em]">Top Performer</p>
             <h3 className="text-2xl font-black text-slate-900 truncate">/s/{stats.topLink?.shortCode || 'N/A'}</h3>
             <span className="text-indigo-600 font-bold text-xs uppercase tracking-widest mt-2 block">{(stats.topLink?.clicks || 0)} Successful Hits</span>
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="space-y-10 animate-in">
          <div className="bg-white border border-slate-200 rounded-[3rem] p-10 md:p-16 shadow-sm">
            <div className="flex items-center mb-10 pb-8 border-b border-slate-100">
              <Cpu className="w-10 h-10 text-indigo-600 mr-5" />
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">API Infrastructure</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">Platform Integration Bridge</p>
              </div>
            </div>
            
            <p className="text-base text-slate-500 mb-12 font-medium leading-relaxed max-w-2xl">
              Our API is built on a "Silent GET" protocol. Connect your external dashboards or tools by using the secure endpoint below.
            </p>

            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Integration Endpoint URL</label>
                <div className="flex items-center bg-slate-900 rounded-2xl p-6 font-mono text-sm text-indigo-300 shadow-2xl group overflow-hidden">
                  <span className="flex-grow truncate mr-6">{apiFormat}</span>
                  <button onClick={() => handleCopy(apiFormat, 'apiFmt')} className="text-slate-400 hover:text-white shrink-0 p-3 bg-white/10 rounded-xl transition-all active:scale-90">
                    {copyStatus['apiFmt'] ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                    <p className="text-[11px] font-black text-slate-400 uppercase mb-4 tracking-widest">Master API Token</p>
                    <div className="flex items-center justify-between">
                       <code className="text-lg font-mono font-black text-indigo-600">{user.apiKey}</code>
                       <button onClick={() => handleCopy(user.apiKey, 'keyOnly')} className="text-slate-300 p-2 hover:text-indigo-600 transition">
                         {copyStatus['keyOnly'] ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                       </button>
                    </div>
                 </div>
                 <div className="bg-slate-900 p-8 rounded-3xl text-white flex flex-col justify-center">
                    <p className="text-[11px] font-black uppercase mb-2 tracking-[0.3em] text-indigo-400">Response Protocol</p>
                    <p className="text-lg font-black uppercase tracking-widest">200 OK • CLEAN TEXT RELAY</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="space-y-10 animate-in">
          <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-slate-200 shadow-sm">
            <h2 className="text-3xl font-black mb-12 flex items-center uppercase text-slate-900 tracking-tighter">
              <Globe className="w-10 h-10 mr-5 text-indigo-600" /> Ad Network Manager
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Header Script Slot</label>
                <textarea 
                  className="w-full h-32 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-mono focus:border-indigo-500 outline-none transition shadow-inner resize-none"
                  value={localSettings.adSlots.top}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, top: e.target.value}})}
                  placeholder="Paste ad script tags here..."
                />
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Footer Script Slot</label>
                <textarea 
                  className="w-full h-32 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-mono focus:border-indigo-500 outline-none transition shadow-inner resize-none"
                  value={localSettings.adSlots.bottom}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, bottom: e.target.value}})}
                  placeholder="Paste ad script tags here..."
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-12">
               <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">In-Content Ad Chain</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Multi-slot Blog monetization engine</p>
                  </div>
                  <button onClick={addContentAd} className="flex items-center px-10 py-5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition active:scale-95 shrink-0">
                    <Plus className="w-5 h-5 mr-3" /> Add Link In-Content Ad
                  </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {localSettings.adSlots.contentAds.map((ad, idx) => (
                    <div key={idx} className="relative bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 group transition hover:border-indigo-200">
                       <button 
                         onClick={() => removeContentAd(idx)}
                         className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition p-2 bg-white rounded-xl shadow-md border border-slate-100"
                       >
                         <X className="w-5 h-5" />
                       </button>
                       <label className="text-[10px] font-black uppercase text-slate-400 block mb-4 tracking-[0.3em]">Article Slot #{idx + 1}</label>
                       <textarea 
                         className="w-full h-40 p-6 bg-white border border-slate-200 rounded-2xl text-xs font-mono focus:border-indigo-500 outline-none transition shadow-sm"
                         placeholder="Paste your ad unit HTML/JS..."
                         value={ad}
                         onChange={(e) => updateContentAd(idx, e.target.value)}
                       />
                    </div>
                  ))}
                  {(!localSettings.adSlots.contentAds || localSettings.adSlots.contentAds.length === 0) && (
                    <div className="col-span-full p-20 border-4 border-dashed border-slate-100 rounded-[3rem] text-center">
                       <Globe className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                       <p className="text-slate-300 font-black uppercase tracking-[0.2em]">The Ad Chain is Empty</p>
                    </div>
                  )}
               </div>
            </div>
          </div>

          <button onClick={handleSave} className="w-full py-8 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] shadow-2xl hover:bg-indigo-700 transition active:scale-95">
            Synchronize Global Ad Infrastructure
          </button>
        </div>
      )}

      {activeTab === 'links' && (
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden animate-in">
           <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between bg-slate-50 gap-8">
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Relay Link Database</h2>
             <div className="relative w-full md:w-96">
               <input 
                 type="text" 
                 placeholder="Search link codes..." 
                 className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-8 focus:ring-indigo-50 focus:outline-none transition-all shadow-sm"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left min-w-[800px]">
               <thead className="bg-slate-100 text-slate-400 text-[11px] font-black uppercase tracking-widest border-b border-slate-200">
                 <tr>
                   <th className="px-12 py-8">Path</th>
                   <th className="px-12 py-8">Destination</th>
                   <th className="px-12 py-8">Hits</th>
                   <th className="px-12 py-8 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {links.filter(l => l.shortCode.includes(searchTerm)).map(link => (
                   <tr key={link.id} className="hover:bg-indigo-50/10 transition-colors">
                     <td className="px-12 py-10 font-black text-indigo-600 text-xl tracking-tighter">/s/{link.shortCode}</td>
                     <td className="px-12 py-10 truncate max-w-[300px] text-slate-500 font-mono text-sm">{link.originalUrl}</td>
                     <td className="px-12 py-10 font-black text-slate-900 text-xl">{link.clicks || 0}</td>
                     <td className="px-12 py-10 text-right flex justify-end space-x-4">
                       <button onClick={() => handleCopy(`${platformUrl}#/s/${link.shortCode}`, link.id)} className="p-4 text-slate-400 hover:text-indigo-600 bg-white border border-slate-100 rounded-xl shadow-md transition active:scale-90">
                         {copyStatus[link.id] ? <Check className="w-6 h-6 text-green-500" /> : <LinkIcon className="w-6 h-6" />}
                       </button>
                       <button onClick={() => deleteLink(link.id)} className="p-4 text-slate-300 hover:text-red-500 bg-white border border-slate-100 rounded-xl shadow-md transition active:scale-90">
                         <Trash2 className="w-6 h-6" />
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
