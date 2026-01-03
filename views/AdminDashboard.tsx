
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
  BarChart3
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
        <div className="bg-amber-50 p-12 rounded-[3.5rem] border border-amber-100 max-w-sm">
          <AlertTriangle className="w-20 h-20 text-amber-500 mx-auto mb-8" />
          <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">RESTRICTED</h1>
          <p className="text-slate-500 mb-8 font-medium">Administrative credentials required.</p>
          <a href="/#/login" className="block w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest">Login</a>
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
      <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 flex items-center tracking-tighter uppercase">
            Admin <span className="text-indigo-600 ml-3">Terminal</span>
          </h1>
          <p className="text-slate-400 mt-2 font-black uppercase text-xs tracking-[0.5em]">System Operational</p>
        </div>
        <div className="flex items-center bg-slate-200 p-2 rounded-3xl space-x-2 font-black uppercase text-[10px] tracking-widest">
          <button onClick={() => setActiveTab('analytics')} className={`px-8 py-4 rounded-2xl transition shadow-sm ${activeTab === 'analytics' ? 'bg-white text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>Insights</button>
          <button onClick={() => setActiveTab('links')} className={`px-8 py-4 rounded-2xl transition shadow-sm ${activeTab === 'links' ? 'bg-white text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>Vault</button>
          <button onClick={() => setActiveTab('settings')} className={`px-8 py-4 rounded-2xl transition shadow-sm ${activeTab === 'settings' ? 'bg-white text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>Ad Center</button>
        </div>
      </div>

      {success && (
        <div className="mb-10 p-8 bg-green-50 border-2 border-green-200 rounded-[2.5rem] flex items-center text-green-800 font-black animate-in shadow-xl">
          <CheckCircle className="w-8 h-8 mr-4" /> Global Verification Ads Updated Successfully.
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-12 animate-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-slate-900 rounded-[4rem] p-16 text-white shadow-2xl relative overflow-hidden">
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-4">Total Conversions</p>
               <h3 className="text-9xl font-black tracking-tighter leading-none">{stats.totalClicks}</h3>
               <BarChart3 className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5" />
            </div>
            <div className="bg-white rounded-[4rem] p-16 shadow-xl border border-slate-100 flex flex-col justify-center">
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-4">Most Active Alias</p>
               <h3 className="text-5xl font-black tracking-tighter text-slate-900 truncate">/s/{stats.topLink?.shortCode || 'None'}</h3>
               <div className="flex items-center space-x-3 mt-6 text-indigo-600 font-black text-xl">
                  <MousePointerClick className="w-7 h-7" />
                  <span>{stats.topLink?.clicks || 0} hits</span>
               </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[4rem] p-16 text-white border-8 border-white shadow-2xl">
            <div className="flex items-center mb-10">
              <Code className="w-12 h-12 mr-6" />
              <h2 className="text-4xl font-black tracking-tighter uppercase">API Connectivity</h2>
            </div>
            <p className="text-indigo-100 mb-10 text-xl font-medium max-w-3xl leading-relaxed">Your Stable API Key works across all platforms. Generated links use the 7-character professional short-code format.</p>
            <div className="bg-slate-950 p-10 rounded-[2.5rem] text-indigo-300 overflow-x-auto shadow-inner border-2 border-indigo-400/20">
              <pre className="text-base font-mono leading-relaxed">
{`# Global API Endpoint
https://api.swiftlink.pro/v1/shorten

# Stable Header
X-API-KEY: "${user.apiKey}"

# Request Payload
{
  "destination": "https://your-long-url.com",
  "alias_length": 7
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'links' && (
        <div className="bg-white rounded-[4rem] shadow-xl border border-slate-100 overflow-hidden animate-in">
          <div className="p-12 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-3xl font-black tracking-tighter uppercase">Link Database</h2>
            <input 
              type="text" 
              placeholder="Search Vault..." 
              className="px-8 py-5 bg-white border-2 border-slate-200 rounded-[2rem] text-sm font-bold w-80 focus:ring-4 focus:ring-indigo-100 focus:outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase font-black tracking-widest border-b border-slate-200">
              <tr>
                <th className="px-12 py-10">Short Path</th>
                <th className="px-12 py-10">Original URL</th>
                <th className="px-12 py-10">Performance</th>
                <th className="px-12 py-10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {links.filter(l => l.shortCode.includes(searchTerm)).map(link => (
                <tr key={link.id} className="hover:bg-indigo-50/30 transition">
                  <td className="px-12 py-10 font-black text-indigo-600 text-xl">/s/{link.shortCode}</td>
                  <td className="px-12 py-10 truncate max-w-sm text-slate-400 font-mono text-sm">{link.originalUrl}</td>
                  <td className="px-12 py-10 font-black text-slate-900 text-lg">{link.clicks || 0}</td>
                  <td className="px-12 py-10 text-right">
                    <button onClick={() => deleteLink(link.id)} className="p-5 text-slate-300 hover:text-red-600 hover:bg-white rounded-2xl transition shadow-sm"><Trash2 className="w-8 h-8" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-12 animate-in">
          <div className="bg-white rounded-[4rem] p-16 shadow-xl border border-slate-100">
            <div className="flex items-center mb-12">
              <Globe className="w-12 h-12 text-indigo-600 mr-6" />
              <h2 className="text-4xl font-black tracking-tighter uppercase">Redirection Ads</h2>
            </div>
            <p className="text-slate-500 mb-12 text-lg font-medium">Ads placed here will only appear on the verification "Blog" pages for regular users. Admins will see an ad-free flow.</p>
            
            <div className="grid grid-cols-1 gap-12">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Header Ad Script (Top)</label>
                  <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase">Active Slot</span>
                </div>
                <textarea 
                  className="w-full h-48 p-10 bg-white border-4 border-slate-50 rounded-[3rem] text-sm text-slate-900 font-mono focus:ring-8 focus:ring-indigo-50 focus:outline-none shadow-inner leading-relaxed"
                  placeholder="Paste Ad HTML/JS code here..."
                  value={localSettings.adSlots.top}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, top: e.target.value}})}
                />
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Content In-Article Ad (Middle)</label>
                  <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase">Active Slot</span>
                </div>
                <textarea 
                  className="w-full h-48 p-10 bg-white border-4 border-slate-50 rounded-[3rem] text-sm text-slate-900 font-mono focus:ring-8 focus:ring-indigo-50 focus:outline-none shadow-inner leading-relaxed"
                  placeholder="Paste Ad HTML/JS code here..."
                  value={localSettings.adSlots.middle}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, middle: e.target.value}})}
                />
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Footer Banner Ad (Bottom)</label>
                  <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase">Active Slot</span>
                </div>
                <textarea 
                  className="w-full h-48 p-10 bg-white border-4 border-slate-50 rounded-[3rem] text-sm text-slate-900 font-mono focus:ring-8 focus:ring-indigo-50 focus:outline-none shadow-inner leading-relaxed"
                  placeholder="Paste Ad HTML/JS code here..."
                  value={localSettings.adSlots.bottom}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, bottom: e.target.value}})}
                />
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[4rem] p-16 text-white flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl shadow-indigo-300 border-8 border-white">
             <div className="text-center md:text-left">
                <h3 className="text-4xl font-black tracking-tighter uppercase">Synchronize Assets</h3>
                <p className="text-indigo-100 text-lg font-medium mt-3">Apply these changes live to the entire global redirection network.</p>
             </div>
             <button onClick={handleSave} className="bg-white text-indigo-600 px-20 py-8 rounded-[2.5rem] font-black uppercase text-xl shadow-2xl hover:scale-105 transition active:scale-95 flex items-center">
                <Save className="w-8 h-8 mr-4" /> Save All Settings
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
