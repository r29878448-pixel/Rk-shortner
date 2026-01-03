
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
  Cpu
} from 'lucide-react';
import { User, SiteSettings, UserRole, Link as LinkType, ClickEvent } from '../types.ts';

interface AdminDashboardProps {
  user: User | null;
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, settings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'links' | 'settings' | 'api'>('analytics');
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [success, setSuccess] = useState(false);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [clickEvents, setClickEvents] = useState<ClickEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLinks(JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]'));
    setClickEvents(JSON.parse(localStorage.getItem('swiftlink_click_events') || '[]'));
    setLocalSettings(settings);
  }, [settings]);

  const stats = useMemo(() => {
    return {
      totalClicks: clickEvents.length,
      totalLinks: links.length,
      topLink: [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0]
    };
  }, [clickEvents, links]);

  if (!user || user.role !== UserRole.ADMIN) {
    return <div className="p-10 text-center font-bold">Access Restricted.</div>;
  }

  const handleSave = () => {
    onUpdateSettings(localSettings);
    localStorage.setItem('swiftlink_settings', JSON.stringify(localSettings));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const deleteLink = (id: string) => {
    if(!confirm("Delete link?")) return;
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
  const apiFormat = `${platformUrl}api?api=${user.apiKey}&url=YOUR_LONG_URL`;

  const addContentAd = () => {
    setLocalSettings({
      ...localSettings,
      adSlots: {
        ...localSettings.adSlots,
        contentAds: [...localSettings.adSlots.contentAds, '']
      }
    });
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
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center uppercase">
            <ShieldCheck className="w-6 h-6 mr-2 text-indigo-600" /> Admin Station
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Network Management Terminal</p>
        </div>
        
        <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2">
          {[
            { id: 'analytics', label: 'Overview' },
            { id: 'links', label: 'Vault' },
            { id: 'settings', label: 'Ads Manager' },
            { id: 'api', label: 'Integration' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2 rounded font-bold text-[10px] uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-500 text-white rounded font-bold text-sm flex items-center shadow-lg animate-in">
          <CheckCircle className="w-5 h-5 mr-3" /> System configurations synchronized.
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in">
          <div className="bg-white border border-slate-200 p-8 rounded-lg">
             <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Total Hits</p>
             <h3 className="text-4xl font-black text-slate-900">{stats.totalClicks}</h3>
          </div>
          <div className="bg-white border border-slate-200 p-8 rounded-lg">
             <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Total Relays</p>
             <h3 className="text-4xl font-black text-slate-900">{stats.totalLinks}</h3>
          </div>
          <div className="bg-white border border-slate-200 p-8 rounded-lg">
             <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Top Performance</p>
             <h3 className="text-xl font-black text-slate-900 truncate">/s/{stats.topLink?.shortCode || 'N/A'}</h3>
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="space-y-6 animate-in">
          <div className="bg-white border-2 border-slate-100 rounded-lg p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <Cpu className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-xl font-black text-slate-900 uppercase">Shortener Integration</h2>
            </div>
            
            <p className="text-sm text-slate-500 mb-8 font-medium leading-relaxed">
              Use the following URL format for third-party platforms (like VP Links, scripts, or bots). 
              Our system accepts simple <strong>GET</strong> requests for instant link generation.
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Integration URL</label>
                <div className="flex items-center bg-slate-900 rounded p-4 font-mono text-xs text-indigo-300 group">
                  <span className="flex-grow truncate mr-4">{apiFormat}</span>
                  <button onClick={() => handleCopy(apiFormat, 'apiFmt')} className="text-slate-400 hover:text-white shrink-0">
                    {copyStatus['apiFmt'] ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                 <div className="bg-slate-50 p-4 rounded border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">API Token (Key)</p>
                    <div className="flex items-center justify-between">
                       <code className="text-xs font-mono font-bold text-slate-700">{user.apiKey}</code>
                       <button onClick={() => handleCopy(user.apiKey, 'keyOnly')} className="text-indigo-600 p-1">
                         {copyStatus['keyOnly'] ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                       </button>
                    </div>
                 </div>
                 <div className="bg-slate-50 p-4 rounded border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Standard Protocol</p>
                    <p className="text-xs font-bold text-slate-700">HTTP GET / JSON-Lite</p>
                 </div>
              </div>
            </div>

            <div className="mt-8 bg-indigo-50 p-6 rounded-lg">
               <h4 className="text-xs font-black uppercase text-indigo-700 mb-2">How it works:</h4>
               <p className="text-xs text-indigo-900/70 leading-relaxed">
                 Replace <code className="bg-indigo-100 px-1 rounded">YOUR_LONG_URL</code> with the destination. 
                 The system will return a 200 OK status with the shortened path in the response body. 
                 This is fully compatible with all automated bulk-shortening tools.
               </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6 animate-in">
          <div className="bg-white rounded-lg p-8 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-black mb-8 flex items-center uppercase text-slate-900">
              <Globe className="w-5 h-5 mr-2 text-indigo-600" /> Global Ad Slots
            </h2>
            
            <div className="space-y-6 mb-12">
              {[
                { id: 'top', label: 'Header Slot' },
                { id: 'bottom', label: 'Footer Slot' }
              ].map((slot) => (
                <div key={slot.id} className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{slot.label}</label>
                  <textarea 
                    className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-900 font-mono focus:border-indigo-500 outline-none transition"
                    value={(localSettings.adSlots as any)[slot.id]}
                    onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, [slot.id]: e.target.value}})}
                  />
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-8">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">In-Content Ads (Multiple)</h3>
                  <button onClick={addContentAd} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded text-[10px] font-bold uppercase">
                    <Plus className="w-3 h-3 mr-2" /> Add Ad Slot
                  </button>
               </div>
               
               <div className="space-y-6">
                  {localSettings.adSlots.contentAds.map((ad, idx) => (
                    <div key={idx} className="relative bg-slate-50 p-6 rounded-lg border border-slate-200 group">
                       <button 
                         onClick={() => removeContentAd(idx)}
                         className="absolute top-4 right-4 text-slate-300 hover:text-red-500 group-hover:block transition"
                       >
                         <X className="w-4 h-4" />
                       </button>
                       <label className="text-[9px] font-bold uppercase text-slate-400 block mb-2">Article Slot #{idx + 1}</label>
                       <textarea 
                         className="w-full h-32 p-4 bg-white border border-slate-200 rounded text-[11px] font-mono focus:border-indigo-500 outline-none"
                         placeholder="Paste ad script/HTML here..."
                         value={ad}
                         onChange={(e) => updateContentAd(idx, e.target.value)}
                       />
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <button onClick={handleSave} className="w-full py-5 bg-indigo-600 text-white rounded font-black uppercase text-xs tracking-widest shadow-xl hover:bg-indigo-700 transition active:scale-95">
            Sync System Settings
          </button>
        </div>
      )}

      {activeTab === 'links' && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden animate-in">
           <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
             <h2 className="text-sm font-black text-slate-900 uppercase">Active Relays</h2>
             <input 
               type="text" 
               placeholder="Search vault..." 
               className="px-4 py-2 bg-white border border-slate-200 rounded text-xs w-64 focus:outline-none"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left min-w-[600px]">
               <thead className="bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-widest border-b border-slate-200">
                 <tr>
                   <th className="px-6 py-4">Relay</th>
                   <th className="px-6 py-4">Target</th>
                   <th className="px-6 py-4">Hits</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {links.filter(l => l.shortCode.includes(searchTerm)).map(link => (
                   <tr key={link.id} className="hover:bg-slate-50 transition">
                     <td className="px-6 py-4 font-bold text-indigo-600 text-xs">/s/{link.shortCode}</td>
                     <td className="px-6 py-4 truncate max-w-[200px] text-slate-500 font-mono text-[10px]">{link.originalUrl}</td>
                     <td className="px-6 py-4 font-bold text-slate-900 text-xs">{link.clicks || 0}</td>
                     <td className="px-6 py-4 text-right flex justify-end space-x-2">
                       <button onClick={() => handleCopy(`${platformUrl}#/s/${link.shortCode}`, link.id)} className="p-2 text-slate-400 hover:text-indigo-600">
                         {copyStatus[link.id] ? <Check className="w-4 h-4 text-green-500" /> : <LinkIcon className="w-4 h-4" />}
                       </button>
                       <button onClick={() => deleteLink(link.id)} className="p-2 text-slate-300 hover:text-red-500">
                         <Trash2 className="w-4 h-4" />
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
