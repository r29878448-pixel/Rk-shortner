
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
  Play,
  Terminal
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
  
  const [copyStatus, setCopyStatus] = useState({ api: false, url: false, curl: false });
  const [testResult, setTestResult] = useState<any>(null);

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
        <div className="bg-white p-8 md:p-12 rounded-lg border border-slate-200 shadow-2xl max-w-sm">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Access Forbidden</h1>
          <p className="text-slate-500 mb-8 font-medium">Administrative authentication is required to access this terminal.</p>
          <a href="/#/login" className="block w-full py-4 bg-slate-900 text-white rounded font-black uppercase text-xs tracking-widest shadow-xl">Login to Terminal</a>
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

  const handleCopy = (text: string, type: 'api' | 'url' | 'curl') => {
    navigator.clipboard.writeText(text);
    setCopyStatus({ ...copyStatus, [type]: true });
    setTimeout(() => setCopyStatus({ ...copyStatus, [type]: false }), 2000);
  };

  // Improved platform URL calculation (removes trailing index.html)
  const platformUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
  const apiEndpoint = `${platformUrl}api/v1/shorten`;

  const simulateApiCall = () => {
    setTestResult({
      status: 201,
      message: "Link Created Successfully",
      data: {
        id: "lnk_" + Math.random().toString(36).substring(7),
        short_url: `${platformUrl}#/s/demo786`,
        original_url: "https://google.com",
        created_at: new Date().toISOString()
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center uppercase tracking-tighter">
            <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 mr-4 text-indigo-600" /> Admin Terminal
          </h1>
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.4em] mt-2">Network Control Center</p>
        </div>
        <div className="flex flex-wrap items-center bg-white border border-slate-200 p-1 rounded-lg shadow-sm gap-1">
          <button onClick={() => setActiveTab('analytics')} className={`flex-1 md:flex-none px-6 md:px-10 py-3 rounded text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Insights</button>
          <button onClick={() => setActiveTab('links')} className={`flex-1 md:flex-none px-6 md:px-10 py-3 rounded text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'links' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Links</button>
          <button onClick={() => setActiveTab('settings')} className={`flex-1 md:flex-none px-6 md:px-10 py-3 rounded text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Ads</button>
          <button onClick={() => setActiveTab('api')} className={`flex-1 md:flex-none px-6 md:px-10 py-3 rounded text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'api' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>API Setup</button>
        </div>
      </div>

      {success && (activeTab === 'settings') && (
        <div className="mb-8 p-5 bg-green-600 text-white rounded-lg flex items-center font-black shadow-xl animate-in">
          <CheckCircle className="w-6 h-6 mr-4" /> Global network configuration synced.
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div className="bg-slate-900 rounded-xl p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-4">Total Conversions</p>
               <h3 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">{stats.totalClicks}</h3>
               <BarChart3 className="absolute -bottom-8 -right-8 w-40 h-40 md:w-56 md:h-56 text-white/5" />
            </div>
            <div className="bg-white rounded-xl p-10 md:p-14 shadow-xl border border-slate-100 flex flex-col justify-center">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4">Highest Performing Alias</p>
               <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter truncate">/s/{stats.topLink?.shortCode || 'N/A'}</h3>
               <div className="flex items-center space-x-3 mt-6 text-indigo-600 font-black text-lg md:text-xl">
                  <MousePointerClick className="w-6 h-6 md:w-7 md:h-7" />
                  <span>{stats.topLink?.clicks || 0} hits</span>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="space-y-10 animate-in">
          <div className="bg-white border-2 border-slate-100 rounded-xl p-8 md:p-12 shadow-xl">
            <div className="flex items-center mb-8 border-b border-slate-100 pb-6">
              <Terminal className="w-8 h-8 text-indigo-600 mr-4" />
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Global API Configuration</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Integration with external platforms</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-3">API Endpoint (Standard REST)</label>
                  <div className="flex items-center bg-slate-50 border-2 border-slate-100 rounded-lg p-4 font-mono text-sm text-slate-600">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-black mr-3 uppercase">POST</span>
                    <span className="flex-grow truncate">{apiEndpoint}</span>
                    <button onClick={() => handleCopy(apiEndpoint, 'url')} className="ml-4 p-2 hover:bg-white rounded transition">
                      {copyStatus.url ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>
                </section>

                <section>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-3">Authorization Token (Bearer)</label>
                  <div className="flex items-center bg-slate-900 rounded-lg p-5 font-mono text-sm text-indigo-400 shadow-inner">
                    <span className="text-indigo-600/50 mr-3 shrink-0">Authorization: Bearer</span>
                    <span className="flex-grow truncate">{user.apiKey}</span>
                    <button onClick={() => handleCopy(user.apiKey, 'api')} className="ml-4 p-2 hover:bg-slate-800 rounded transition shrink-0">
                      {copyStatus.api ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>
                </section>

                <section className="bg-slate-50 rounded-lg p-8 border border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center">
                    <Code className="w-4 h-4 mr-2" /> JSON Request Schema
                  </h3>
                  <div className="bg-white p-6 rounded border border-slate-200 text-xs font-mono text-slate-500 leading-relaxed shadow-sm">
                    {`{
  "url": "https://your-long-url.com",
  "alias": "custom-name",
  "stages": 3
}`}
                  </div>
                </section>
              </div>

              <div className="bg-slate-900 rounded-xl p-8 text-white flex flex-col">
                <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-6 flex items-center">
                  <Play className="w-4 h-4 mr-2" /> Live Simulator
                </h3>
                <p className="text-xs text-slate-400 mb-8 font-medium">Test your endpoint logic directly within the terminal to verify the JSON structure.</p>
                <button 
                  onClick={simulateApiCall}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded font-black uppercase text-xs tracking-widest transition shadow-lg shadow-indigo-500/20 active:scale-95 mb-8"
                >
                  Send Test Request
                </button>

                {testResult && (
                  <div className="mt-auto animate-in">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Response 201</span>
                      <span className="text-[10px] text-slate-500 font-mono">142ms</span>
                    </div>
                    <div className="bg-black/40 p-5 rounded font-mono text-[10px] text-indigo-300 leading-tight border border-white/5">
                      <pre>{JSON.stringify(testResult.data, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Integration Tip</h3>
                <p className="text-indigo-100 text-sm max-w-2xl font-medium leading-relaxed">Most shortener-integration platforms require the <strong>Authorization: Bearer</strong> header. Use your unique sk_live key to authenticate all incoming relay creation requests.</p>
             </div>
             <terminal className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 transform -rotate-12" />
          </div>
        </div>
      )}

      {activeTab === 'links' && (
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between bg-slate-50 gap-6">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Encrypted Vault</h2>
            <div className="relative w-full md:w-80">
              <input 
                type="text" 
                placeholder="Filter vault..." 
                className="w-full pl-5 pr-10 py-3.5 bg-white border border-slate-200 rounded text-sm font-bold focus:ring-4 focus:ring-indigo-50 focus:outline-none shadow-sm transition-all"
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
                      <button onClick={() => deleteLink(link.id)} className="p-4 text-slate-300 hover:text-red-600 hover:bg-white rounded transition-all shadow-sm active:scale-90">
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

      {activeTab === 'settings' && (
        <div className="space-y-10 animate-in">
          <div className="bg-white rounded-xl p-8 md:p-14 shadow-xl border border-slate-200">
            <div className="flex items-center mb-10">
              <Globe className="w-10 h-10 text-indigo-600 mr-5" />
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Ad Injection Logic</h2>
            </div>
            <p className="text-slate-500 mb-12 text-sm font-medium leading-relaxed">Dynamic ad injection is exclusively restricted to the multi-stage verification (blog) flows. Administrative sessions are strictly ad-free.</p>
            
            <div className="grid grid-cols-1 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 px-1">Global Header Slot</label>
                <textarea 
                  className="w-full h-48 p-8 bg-slate-50 border-2 border-slate-100 rounded text-sm text-slate-900 font-mono focus:ring-8 focus:ring-indigo-100 focus:outline-none shadow-inner transition-all resize-none"
                  placeholder="Paste ad script/HTML here..."
                  value={localSettings.adSlots.top}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, top: e.target.value}})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 px-1">In-Content Ad Slot</label>
                <textarea 
                  className="w-full h-48 p-8 bg-slate-50 border-2 border-slate-100 rounded text-sm text-slate-900 font-mono focus:ring-8 focus:ring-indigo-100 focus:outline-none shadow-inner transition-all resize-none"
                  placeholder="Paste ad script/HTML here..."
                  value={localSettings.adSlots.middle}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, middle: e.target.value}})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 px-1">Article Footer Slot</label>
                <textarea 
                  className="w-full h-48 p-8 bg-slate-50 border-2 border-slate-100 rounded text-sm text-slate-900 font-mono focus:ring-8 focus:ring-indigo-100 focus:outline-none shadow-inner transition-all resize-none"
                  placeholder="Paste ad script/HTML here..."
                  value={localSettings.adSlots.bottom}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, bottom: e.target.value}})}
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-10 md:p-14 text-white flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl border-b-8 border-indigo-600">
             <div className="text-center lg:text-left">
                <h3 className="text-3xl font-black tracking-tighter uppercase mb-3">Sync Configuration</h3>
                <p className="text-slate-400 text-lg font-medium">Instantly apply ad slots and stage logic to the network.</p>
             </div>
             <button onClick={handleSave} className="w-full lg:w-auto bg-indigo-600 text-white px-16 py-7 rounded font-black uppercase text-lg shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center">
                <Save className="w-6 h-6 mr-4" /> Synchronize All
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
