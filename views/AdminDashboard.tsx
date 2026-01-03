
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
  // Renamed 'settings' tab to 'ads' internally for total clarity and to fix the 'not opening' bug
  const [activeTab, setActiveTab] = useState<'analytics' | 'links' | 'ads' | 'api'>('analytics');
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [success, setSuccess] = useState(false);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [clickEvents, setClickEvents] = useState<ClickEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLinks(JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]'));
    setClickEvents(JSON.parse(localStorage.getItem('swiftlink_click_events') || '[]'));
  }, []);

  // Sync local settings when global settings change (e.g. on mount)
  useEffect(() => {
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
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-xl text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-black uppercase text-slate-900">Restricted Access</h2>
          <p className="text-slate-500 text-sm mt-2">Administrative privileges required.</p>
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
    if(!confirm("Are you sure you want to delete this link permanently?")) return;
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
  // VP Links style simple endpoint
  const apiFormat = `${platformUrl}#/api?api=${user.apiKey}&url=YOUR_LONG_URL`;

  const addContentAd = () => {
    setLocalSettings({
      ...localSettings,
      adSlots: {
        ...localSettings.adSlots,
        contentAds: [...(localSettings.adSlots.contentAds || []), '']
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
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Tab Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center uppercase tracking-tighter">
            <ShieldCheck className="w-8 h-8 mr-3 text-indigo-600" /> Control Center
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Operational Network Terminal</p>
        </div>
        
        <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm overflow-x-auto no-scrollbar">
          {[
            { id: 'analytics', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
            { id: 'links', label: 'Links', icon: <LinkIcon className="w-4 h-4 mr-2" /> },
            { id: 'ads', label: 'Ads Manager', icon: <Globe className="w-4 h-4 mr-2" /> },
            { id: 'api', label: 'API Setup', icon: <Terminal className="w-4 h-4 mr-2" /> }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-6 py-3 rounded-lg font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {success && (
        <div className="mb-8 p-5 bg-green-600 text-white rounded-xl font-black text-sm flex items-center shadow-xl animate-in">
          <CheckCircle className="w-6 h-6 mr-4" /> Global network configuration synchronized.
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in">
          <div className="bg-white border border-slate-200 p-10 rounded-2xl shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Global Conversions</p>
             <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{stats.totalClicks}</h3>
          </div>
          <div className="bg-white border border-slate-200 p-10 rounded-2xl shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Active Relays</p>
             <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{stats.totalLinks}</h3>
          </div>
          <div className="bg-white border border-slate-200 p-10 rounded-2xl shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Top Performance</p>
             <h3 className="text-xl font-black text-slate-900 truncate">/s/{stats.topLink?.shortCode || 'N/A'}</h3>
             <span className="text-indigo-600 font-bold text-xs">{(stats.topLink?.clicks || 0)} total hits</span>
          </div>
        </div>
      )}

      {/* API Integration Tab */}
      {activeTab === 'api' && (
        <div className="space-y-8 animate-in">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm">
            <div className="flex items-center mb-8 pb-6 border-b border-slate-100">
              <Cpu className="w-8 h-8 text-indigo-600 mr-4" />
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">API Integration</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Standard VP Links Compatible Endpoint</p>
              </div>
            </div>
            
            <p className="text-sm text-slate-500 mb-10 font-medium leading-relaxed max-w-2xl">
              Use this simple GET-request format to integrate with third-party platforms, bots, or scripts. 
              The system accepts your API key and a target URL to return an instant shortened relay link.
            </p>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Full Integration Endpoint</label>
                <div className="flex items-center bg-slate-900 rounded-xl p-5 font-mono text-xs text-indigo-300 shadow-inner group overflow-hidden">
                  <span className="flex-grow truncate mr-4">{apiFormat}</span>
                  <button onClick={() => handleCopy(apiFormat, 'apiFmt')} className="text-slate-400 hover:text-white shrink-0 p-2 bg-white/5 rounded transition">
                    {copyStatus['apiFmt'] ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Your Private Token</p>
                    <div className="flex items-center justify-between">
                       <code className="text-sm font-mono font-black text-indigo-600">{user.apiKey}</code>
                       <button onClick={() => handleCopy(user.apiKey, 'keyOnly')} className="text-slate-400 p-1 hover:text-indigo-600 transition">
                         {copyStatus['keyOnly'] ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                       </button>
                    </div>
                 </div>
                 <div className="bg-indigo-600 p-6 rounded-xl text-white shadow-lg shadow-indigo-100">
                    <p className="text-[10px] font-black uppercase mb-2 tracking-widest text-indigo-200">Protocol Type</p>
                    <p className="text-sm font-black uppercase tracking-widest">HTTP GET / JSON RETURN</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ads Manager Tab (The fixed settings tab) */}
      {activeTab === 'ads' && (
        <div className="space-y-8 animate-in">
          <div className="bg-white rounded-2xl p-8 md:p-14 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-black mb-10 flex items-center uppercase text-slate-900 tracking-tighter">
              <Globe className="w-8 h-8 mr-4 text-indigo-600" /> Content Monetization
            </h2>
            
            <div className="space-y-8 mb-12">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Header Script Slot</label>
                <textarea 
                  className="w-full h-24 p-5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:border-indigo-500 outline-none transition shadow-inner resize-none"
                  value={localSettings.adSlots.top}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, top: e.target.value}})}
                  placeholder="Paste <script> or <iframe> here..."
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Footer Script Slot</label>
                <textarea 
                  className="w-full h-24 p-5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:border-indigo-500 outline-none transition shadow-inner resize-none"
                  value={localSettings.adSlots.bottom}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, bottom: e.target.value}})}
                  placeholder="Paste <script> or <iframe> here..."
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-10">
               <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">In-Content Ad List</h3>
                    <p className="text-xs text-slate-400 font-medium">Add multiple ads to be spread across the redirect article content.</p>
                  </div>
                  <button onClick={addContentAd} className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition active:scale-95 shrink-0">
                    <Plus className="w-4 h-4 mr-2" /> New Ad Slot
                  </button>
               </div>
               
               <div className="space-y-6">
                  {localSettings.adSlots.contentAds.map((ad, idx) => (
                    <div key={idx} className="relative bg-slate-50 p-8 rounded-2xl border border-slate-200 group shadow-sm">
                       <button 
                         onClick={() => removeContentAd(idx)}
                         className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition p-2 bg-white rounded-full shadow-sm"
                       >
                         <X className="w-4 h-4" />
                       </button>
                       <label className="text-[9px] font-black uppercase text-slate-400 block mb-3 tracking-[0.2em]">Article Placement #{idx + 1}</label>
                       <textarea 
                         className="w-full h-32 p-5 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:border-indigo-500 outline-none transition"
                         placeholder="Paste ad script/HTML code here..."
                         value={ad}
                         onChange={(e) => updateContentAd(idx, e.target.value)}
                       />
                    </div>
                  ))}
                  {localSettings.adSlots.contentAds.length === 0 && (
                    <div className="p-16 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                       <Globe className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                       <p className="text-slate-400 font-bold text-sm">No in-content ads configured.</p>
                    </div>
                  )}
               </div>
            </div>
          </div>

          <button onClick={handleSave} className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-indigo-700 transition active:scale-95">
            Synchronize All System Ads
          </button>
        </div>
      )}

      {/* Links Tab */}
      {activeTab === 'links' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in">
           <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between bg-slate-50 gap-6">
             <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Active Network Relays</h2>
             <div className="relative w-full md:w-80">
               <input 
                 type="text" 
                 placeholder="Search by code..." 
                 className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left min-w-[700px]">
               <thead className="bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-200">
                 <tr>
                   <th className="px-10 py-6">Relay Path</th>
                   <th className="px-10 py-6">Target Origin</th>
                   <th className="px-10 py-6">Hits</th>
                   <th className="px-10 py-6 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {links.filter(l => l.shortCode.includes(searchTerm)).map(link => (
                   <tr key={link.id} className="hover:bg-indigo-50/20 transition-colors">
                     <td className="px-10 py-8 font-black text-indigo-600 text-lg">/s/{link.shortCode}</td>
                     <td className="px-10 py-8 truncate max-w-[250px] text-slate-500 font-mono text-xs">{link.originalUrl}</td>
                     <td className="px-10 py-8 font-black text-slate-900 text-lg">{link.clicks || 0}</td>
                     <td className="px-10 py-8 text-right flex justify-end space-x-3">
                       <button onClick={() => handleCopy(`${platformUrl}#/s/${link.shortCode}`, link.id)} className="p-3 text-slate-400 hover:text-indigo-600 bg-white border border-slate-100 rounded-lg shadow-sm transition active:scale-90">
                         {copyStatus[link.id] ? <Check className="w-5 h-5 text-green-500" /> : <LinkIcon className="w-5 h-5" />}
                       </button>
                       <button onClick={() => deleteLink(link.id)} className="p-3 text-slate-300 hover:text-red-500 bg-white border border-slate-100 rounded-lg shadow-sm transition active:scale-90">
                         <Trash2 className="w-5 h-5" />
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
