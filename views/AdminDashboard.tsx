
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
  Layout,
  Type,
  Copy,
  Key,
  ChevronRight,
  Globe,
  Settings2,
  BarChart3,
  MousePointerClick,
  Activity,
  History,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { User, SiteSettings, UserRole, Link as LinkType, ClickEvent } from '../types.ts';

interface AdminDashboardProps {
  user: User | null;
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, settings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'links' | 'analytics'>('analytics');
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [success, setSuccess] = useState(false);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [clickEvents, setClickEvents] = useState<ClickEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  const loadData = () => {
    const storedLinks = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
    const storedEvents = JSON.parse(localStorage.getItem('swiftlink_click_events') || '[]');
    setLinks(storedLinks);
    setClickEvents(storedEvents);
  };

  useEffect(() => {
    loadData();
    setLocalSettings(settings);
  }, [settings]);

  const stats = useMemo(() => {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const totalClicks = clickEvents.length;
    const clicksLast24h = clickEvents.filter(e => new Date(e.timestamp) > last24h).length;
    
    const topLink = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0];

    // Calculate daily traffic for last 7 days
    const dailyTraffic = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
      const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      const count = clickEvents.filter(e => {
        const d = new Date(e.timestamp);
        return d.toDateString() === date.toDateString();
      }).length;
      return { day: dayStr, count };
    });

    return { totalClicks, clicksLast24h, topLink, dailyTraffic };
  }, [clickEvents, links]);

  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-amber-50 p-8 rounded-[3rem] border border-amber-100 max-w-sm">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-slate-900 mb-2 text-center">Restricted Area</h1>
          <p className="text-slate-500 mb-8 font-medium">This zone is for platform administrators only.</p>
          <a href="/#/login" className="block w-full py-4 gradient-bg text-white rounded-2xl font-bold shadow-xl">Admin Login</a>
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

  const updateGlobalAd = (key: keyof SiteSettings['adSlots'], code: string) => {
    setLocalSettings({
      ...localSettings,
      adSlots: { ...localSettings.adSlots, [key]: code }
    });
  };

  const updateStepAd = (index: number, code: string) => {
    const newAds = [...localSettings.stepAds];
    newAds[index] = code;
    setLocalSettings({...localSettings, stepAds: newAds});
  };

  const deleteLink = (id: string) => {
    const updated = links.filter(l => l.id !== id);
    setLinks(updated);
    localStorage.setItem('swiftlink_global_links', JSON.stringify(updated));
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(user.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const filteredLinks = links.filter(l => 
    l.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 flex items-center tracking-tighter">
            <ShieldCheck className="w-12 h-12 mr-4 text-indigo-600" /> Enterprise Terminal
          </h1>
          <p className="text-slate-500 mt-2 font-black uppercase text-[10px] tracking-[0.4em]">{localSettings.siteName} Hub</p>
        </div>
        
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl space-x-1">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('links')}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'links' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Vault
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Configs
          </button>
        </div>
      </div>

      {activeTab === 'analytics' && (
        <div className="animate-in space-y-12">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Aggregate Traffic</p>
                <h3 className="text-7xl font-black tracking-tighter leading-none">{stats.totalClicks}</h3>
                <p className="text-indigo-400 text-xs mt-4 font-bold flex items-center">
                  <MousePointerClick className="w-4 h-4 mr-2" /> All-time verification hits
                </p>
              </div>
              <BarChart3 className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5" />
            </div>
            
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Momentum (24h)</p>
              <h3 className="text-7xl font-black tracking-tighter leading-none text-slate-900">{stats.clicksLast24h}</h3>
              <p className="text-green-500 text-xs mt-4 font-bold flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" /> Recent activity surge
              </p>
            </div>

            <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-xl border border-indigo-400">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200 mb-2">High Performer</p>
              <h3 className="text-3xl font-black tracking-tighter truncate leading-tight mt-4">
                {stats.topLink ? stats.topLink.shortCode : 'None'}
              </h3>
              <p className="text-indigo-100 text-xs mt-4 font-bold flex items-center">
                <Activity className="w-4 h-4 mr-2" /> {stats.topLink?.clicks || 0} Successful redirects
              </p>
            </div>
          </div>

          {/* Performance Visualization & Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
              <h2 className="text-xl font-black mb-10 flex items-center tracking-tight">
                <BarChart3 className="w-6 h-6 mr-3 text-indigo-600" /> 7-Day Performance
              </h2>
              <div className="flex items-end justify-between h-64 px-4">
                {stats.dailyTraffic.map((day, idx) => {
                  const max = Math.max(...stats.dailyTraffic.map(d => d.count), 1);
                  const height = (day.count / max) * 100;
                  return (
                    <div key={idx} className="flex flex-col items-center space-y-4 flex-1">
                      <div className="relative group w-full px-2">
                        <div 
                          style={{ height: `${height}%` }}
                          className={`w-full rounded-t-xl transition-all duration-500 bg-indigo-100 group-hover:bg-indigo-600 min-h-[4px]`}
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg font-black">
                          {day.count}
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{day.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
              <h2 className="text-xl font-black mb-10 flex items-center tracking-tight">
                <History className="w-6 h-6 mr-3 text-indigo-600" /> Live Activity Feed
              </h2>
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {clickEvents.length === 0 ? (
                  <div className="text-center py-20 text-slate-300 font-bold uppercase tracking-widest italic">Waiting for traffic...</div>
                ) : clickEvents.slice(0, 10).map((event) => (
                  <div key={event.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50 transition border border-transparent hover:border-indigo-100 group">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">/s/{event.shortCode}</span>
                        <span className="text-[10px] font-bold text-slate-400">• {new Date(event.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium truncate max-w-[200px]">Referrer: {event.referrer}</p>
                    </div>
                    <div className="text-right">
                       <span className="inline-block px-2 py-1 bg-white text-[8px] font-black text-slate-400 border border-slate-200 rounded-lg uppercase tracking-widest group-hover:border-indigo-200 group-hover:text-indigo-600">VERIFIED</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'links' && (
        <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in">
          <div className="p-12 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-50/30">
            <h2 className="text-3xl font-black tracking-tighter">Vault Repository</h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-14 pr-8 py-5 w-full bg-white border border-slate-200 rounded-3xl text-sm focus:ring-4 focus:ring-indigo-100 focus:outline-none font-bold shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-[0.4em]">
                <tr>
                  <th className="px-12 py-8">Path</th>
                  <th className="px-12 py-8">Target</th>
                  <th className="px-12 py-8">Performance</th>
                  <th className="px-12 py-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLinks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-12 py-32 text-center text-slate-300 font-black text-3xl italic tracking-tighter uppercase opacity-30">No links found</td>
                  </tr>
                ) : filteredLinks.map(link => (
                  <tr key={link.id} className="hover:bg-slate-50/50 transition duration-300 group">
                    <td className="px-12 py-8 font-black text-indigo-600 text-lg">/s/{link.shortCode}</td>
                    <td className="px-12 py-8 truncate max-w-md text-slate-400 text-xs font-mono">{link.originalUrl}</td>
                    <td className="px-12 py-8">
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-slate-900">{link.clicks || 0}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">clicks</span>
                      </div>
                    </td>
                    <td className="px-12 py-8 text-right">
                      <button 
                        onClick={() => deleteLink(link.id)} 
                        className="p-4 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition duration-300"
                      >
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
        <div className="lg:col-span-2 space-y-12 animate-in">
           {/* Re-using settings layout from previous version */}
           <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black mb-10 flex items-center tracking-tight">
              <Type className="w-8 h-8 mr-4 text-indigo-600" /> Platform Identity
            </h2>
            <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Website Brand Name</label>
              <input 
                type="text"
                className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:outline-none font-black text-3xl tracking-tighter"
                value={localSettings.siteName}
                onChange={(e) => setLocalSettings({...localSettings, siteName: e.target.value})}
              />
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black mb-10 flex items-center tracking-tight">
              <Globe className="w-8 h-8 mr-4 text-indigo-600" /> Global Ad Distribution
            </h2>
            <div className="space-y-8">
              {(Object.keys(localSettings.adSlots) as Array<keyof SiteSettings['adSlots']>).map((slotKey) => (
                <div key={slotKey} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-indigo-900 uppercase tracking-[0.3em]">
                      {slotKey.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <textarea 
                    className="w-full h-24 px-6 py-4 rounded-2xl border border-slate-200 text-[10px] font-mono focus:ring-4 focus:ring-indigo-100 focus:outline-none resize-none"
                    value={localSettings.adSlots[slotKey]}
                    onChange={(e) => updateGlobalAd(slotKey, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black mb-12 flex items-center tracking-tight">
              <Settings2 className="w-8 h-8 mr-4 text-indigo-600" /> Interstitial Logic
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Verification Steps</label>
                <input 
                  type="number"
                  min="1"
                  max="5"
                  className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:outline-none font-black text-4xl text-center"
                  value={localSettings.totalSteps}
                  onChange={(e) => setLocalSettings({...localSettings, totalSteps: parseInt(e.target.value) || 1})}
                />
              </div>
              <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Timer (Seconds)</label>
                <input 
                  type="number"
                  className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:outline-none font-black text-4xl text-center"
                  value={localSettings.redirectDelay}
                  onChange={(e) => setLocalSettings({...localSettings, redirectDelay: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end p-8">
            <button 
              onClick={handleSave}
              className="flex items-center justify-center space-x-3 px-16 py-6 gradient-bg text-white rounded-2xl font-black text-xl hover:opacity-90 transition shadow-2xl"
            >
              <Save className="w-7 h-7" />
              <span>Apply Configs</span>
            </button>
          </div>
        </div>
      )}

      {/* Global API Key section remains visible on sidebar equivalent area for settings */}
      {activeTab !== 'analytics' && (
        <div className="mt-16 bg-indigo-600 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
          <h2 className="text-xl font-black mb-10 flex items-center relative z-10 tracking-tight">
            <Key className="w-6 h-6 mr-4 text-indigo-300" /> API Access Identity
          </h2>
          <div className="space-y-10 relative z-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200 mb-4">Master Key</p>
                <div className="flex items-center bg-black/30 p-5 rounded-2xl border border-white/10">
                  <code className="text-xs truncate font-mono mr-4 text-indigo-100 select-all">{user.apiKey}</code>
                  <button onClick={copyApiKey} className="shrink-0 p-3 hover:bg-white/20 rounded-xl transition">
                    {copiedKey ? <CheckCircle className="w-5 h-5 text-green-300" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 gradient-bg blur-[100px] opacity-30 -mr-32 -mt-32"></div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
