
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
  Link as LinkIcon
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
  
  const [copyStatus, setCopyStatus] = useState({ api: false, url: false });

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
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-2xl max-w-sm">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Access Forbidden</h1>
          <p className="text-slate-500 mb-8 font-medium">Valid administrative authentication is required to access this terminal.</p>
          <a href="/#/login" className="block w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-xl">Login to Terminal</a>
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

  const handleCopy = (text: string, type: 'api' | 'url') => {
    navigator.clipboard.writeText(text);
    setCopyStatus({ ...copyStatus, [type]: true });
    setTimeout(() => setCopyStatus({ ...copyStatus, [type]: false }), 2000);
  };

  const platformUrl = window.location.origin + window.location.pathname;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center uppercase tracking-tighter">
            <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 mr-4 text-indigo-600" /> Admin Terminal
          </h1>
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.4em] mt-2">Network Control Center</p>
        </div>
        <div className="flex flex-wrap items-center bg-white border border-slate-200 p-1 rounded-xl shadow-sm gap-1">
          <button onClick={() => setActiveTab('analytics')} className={`flex-1 md:flex-none px-4 md:px-8 py-3 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Insights</button>
          <button onClick={() => setActiveTab('links')} className={`flex-1 md:flex-none px-4 md:px-8 py-3 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'links' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Vault</button>
          <button onClick={() => setActiveTab('settings')} className={`flex-1 md:flex-none px-4 md:px-8 py-3 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Ads</button>
          <button onClick={() => setActiveTab('api')} className={`flex-1 md:flex-none px-4 md:px-8 py-3 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'api' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>API</button>
        </div>
      </div>

      {success && (activeTab === 'settings') && (
        <div className="mb-8 p-5 bg-green-600 text-white rounded-xl flex items-center font-black shadow-xl animate-in">
          <CheckCircle className="w-6 h-6 mr-4" /> Network configuration updated successfully.
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div className="bg-slate-900 rounded-2xl p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-4">Total Conversions</p>
               <h3 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">{stats.totalClicks}</h3>
               <BarChart3 className="absolute -bottom-8 -right-8 w-40 h-40 md:w-56 md:h-56 text-white/5" />
            </div>
            <div className="bg-white rounded-2xl p-10 md:p-14 shadow-xl border border-slate-100 flex flex-col justify-center">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4">Highest Performing Alias</p>
               <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter truncate">/s/{stats.topLink?.shortCode || 'N/A'}</h3>
               <div className="flex items-center space-x-3 mt-6 text-indigo-600 font-black text-lg md:text-xl">
                  <MousePointerClick className="w-6 h-6 md:w-7 md:h-7" />
                  <span>{stats.topLink?.clicks || 0} unique hits</span>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="space-y-8 animate-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center mb-6">
                <Key className="w-6 h-6 text-indigo-600 mr-4" />
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Your API Key</h2>
              </div>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-5 group transition-colors hover:bg-white hover:border-indigo-200">
                <code className="text-sm font-mono text-indigo-600 flex-grow break-all pr-4">{user.apiKey}</code>
                <button 
                  onClick={() => handleCopy(user.apiKey, 'api')}
                  className="p-3 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm active:scale-90"
                  title="Copy Key"
                >
                  {copyStatus.api ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-6">Authentication required for all programmatic relay generation.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center mb-6">
                <LinkIcon className="w-6 h-6 text-indigo-600 mr-4" />
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">API Endpoint</h2>
              </div>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-5 group transition-colors hover:bg-white hover:border-indigo-200">
                <code className="text-sm font-mono text-slate-600 flex-grow break-all pr-4">{platformUrl}api/v1</code>
                <button 
                  onClick={() => handleCopy(`${platformUrl}api/v1`, 'url')}
                  className="p-3 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm active:scale-90"
                  title="Copy URL"
                >
                  {copyStatus.url ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-6">Use this as the root for your automated link workflows.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-xl overflow-hidden">
            <div className="flex items-center mb-8">
              <Code className="w-10 h-10 text-indigo-600 mr-6" />
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Implementation Guide</h2>
            </div>
            <p className="text-slate-600 mb-8 text-sm font-medium leading-relaxed">SwiftLink supports secure RESTful integration. Send an authenticated POST request to generate relay paths programmatically.</p>
            <div className="bg-slate-900 p-8 rounded-xl text-indigo-200 overflow-x-auto border-4 border-slate-800 shadow-inner">
              <pre className="text-sm font-mono leading-relaxed">
{`# PROGRAMMATIC GENERATION
POST ${platformUrl}api/v1/shorten
Headers: { "X-API-KEY": "${user.apiKey}" }

# PAYLOAD
{
  "destination": "https://external-domain.com/long-path",
  "alias": "custom-alias", // OPTIONAL
  "stages": 3 // OPTIONAL
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'links' && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between bg-slate-50 gap-6">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Encrypted Vault</h2>
            <div className="relative w-full md:w-80">
              <input 
                type="text" 
                placeholder="Filter vault..." 
                className="w-full pl-5 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-50 focus:outline-none shadow-sm transition-all"
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
                  <tr key={link.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-10 py-8 font-black text-indigo-600 text-lg">/s/{link.shortCode}</td>
                    <td className="px-10 py-8 truncate max-w-sm text-slate-500 font-mono text-xs">{link.originalUrl}</td>
                    <td className="px-10 py-8 font-black text-slate-900 text-lg">{link.clicks || 0}</td>
                    <td className="px-10 py-8 text-right">
                      <button onClick={() => deleteLink(link.id)} className="p-4 text-slate-300 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm active:scale-90">
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </td>
                  </tr>
                ))}
                {links.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-10 py-20 text-center text-slate-400 font-bold uppercase tracking-widest">Vault is currently empty.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-10 animate-in">
          <div className="bg-white rounded-2xl p-8 md:p-14 shadow-xl border border-slate-200">
            <div className="flex items-center mb-10">
              <Globe className="w-10 h-10 text-indigo-600 mr-5" />
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Ad Injection Logic</h2>
            </div>
            <p className="text-slate-500 mb-12 text-sm font-medium leading-relaxed">Dynamic ad injection is exclusively restricted to the multi-stage verification (blog) flows. Administrative sessions are strictly ad-free.</p>
            
            <div className="grid grid-cols-1 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 px-1">Global Header Slot (Verification Page)</label>
                <textarea 
                  className="w-full h-48 p-8 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm text-slate-900 font-mono focus:ring-8 focus:ring-indigo-100 focus:outline-none shadow-inner transition-all resize-none"
                  placeholder="Paste ad script/HTML here..."
                  value={localSettings.adSlots.top}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, top: e.target.value}})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 px-1">Content Middle Slot (Article Body)</label>
                <textarea 
                  className="w-full h-48 p-8 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm text-slate-900 font-mono focus:ring-8 focus:ring-indigo-100 focus:outline-none shadow-inner transition-all resize-none"
                  placeholder="Paste ad script/HTML here..."
                  value={localSettings.adSlots.middle}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, middle: e.target.value}})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 px-1">Article Footer Slot (Verification Page)</label>
                <textarea 
                  className="w-full h-48 p-8 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm text-slate-900 font-mono focus:ring-8 focus:ring-indigo-100 focus:outline-none shadow-inner transition-all resize-none"
                  placeholder="Paste ad script/HTML here..."
                  value={localSettings.adSlots.bottom}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, bottom: e.target.value}})}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-14 shadow-xl border border-slate-200">
             <div className="flex items-center mb-10">
                <Settings className="w-10 h-10 text-indigo-600 mr-5" />
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Redirect Topology</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Stages Count</label>
                   <input 
                     type="number"
                     min="1"
                     max="10"
                     className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-xl font-black text-4xl text-slate-900 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all"
                     value={localSettings.totalSteps}
                     onChange={(e) => setLocalSettings({...localSettings, totalSteps: parseInt(e.target.value) || 1})}
                   />
                </div>
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Relay Timer (Seconds)</label>
                   <input 
                     type="number"
                     className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-xl font-black text-4xl text-slate-900 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all"
                     value={localSettings.redirectDelay}
                     onChange={(e) => setLocalSettings({...localSettings, redirectDelay: parseInt(e.target.value) || 0})}
                   />
                </div>
             </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-10 md:p-14 text-white flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl border-b-8 border-indigo-600">
             <div className="text-center lg:text-left">
                <h3 className="text-3xl font-black tracking-tighter uppercase mb-3">Sync Configuration</h3>
                <p className="text-slate-400 text-lg font-medium">Instantly apply ad slots and stage logic to the entire global network.</p>
             </div>
             <button onClick={handleSave} className="w-full lg:w-auto bg-indigo-600 text-white px-16 py-7 rounded-2xl font-black uppercase text-lg shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center">
                <Save className="w-6 h-6 mr-4" /> Synchronize All
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
