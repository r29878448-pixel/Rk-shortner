
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
        <div className="bg-amber-50 p-8 rounded-[3rem] border border-amber-100 max-w-sm">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-500 mb-6 text-sm font-medium">Please login with admin credentials to access the terminal.</p>
          <a href="/#/login" className="block w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl uppercase tracking-widest text-xs">Return to Login</a>
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
    if(!confirm("Permanently delete this link from the vault?")) return;
    const updated = links.filter(l => l.id !== id);
    setLinks(updated);
    localStorage.setItem('swiftlink_global_links', JSON.stringify(updated));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center tracking-tighter">
            <ShieldCheck className="w-10 h-10 mr-4 text-indigo-600" /> Administrative Hub
          </h1>
          <p className="text-slate-400 mt-1 font-black uppercase text-[10px] tracking-[0.4em]">Master Control v2.0</p>
        </div>
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl space-x-1 font-black uppercase text-[10px] tracking-widest">
          <button onClick={() => setActiveTab('analytics')} className={`px-6 py-3 rounded-xl transition ${activeTab === 'analytics' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Insights</button>
          <button onClick={() => setActiveTab('links')} className={`px-6 py-3 rounded-xl transition ${activeTab === 'links' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Link Vault</button>
          <button onClick={() => setActiveTab('settings')} className={`px-6 py-3 rounded-xl transition ${activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Ad Manager</button>
        </div>
      </div>

      {success && (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-3xl flex items-center text-green-800 font-black animate-in shadow-sm">
          <CheckCircle className="w-6 h-6 mr-3" /> System Synchronized. Changes are live globally.
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-12 animate-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Total Engagement</p>
               <h3 className="text-8xl font-black tracking-tighter leading-none">{stats.totalClicks}</h3>
               <BarChart3 className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5" />
            </div>
            <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Top Performing Link</p>
               <h3 className="text-4xl font-black tracking-tighter text-slate-900 truncate">/s/{stats.topLink?.shortCode || 'None'}</h3>
               <div className="flex items-center space-x-2 mt-4 text-indigo-600 font-black">
                  <MousePointerClick className="w-5 h-5" />
                  <span>{stats.topLink?.clicks || 0} Successful Verifications</span>
               </div>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-[3rem] p-12 border border-indigo-100">
            <div className="flex items-center mb-8">
              <Code className="w-8 h-8 text-indigo-600 mr-4" />
              <h2 className="text-2xl font-black text-indigo-900 tracking-tighter uppercase">External API Integration</h2>
            </div>
            <p className="text-indigo-700/80 mb-8 font-semibold">Your API Key is stable and works across all platforms. Use the structure below to generate links programmatically:</p>
            <div className="bg-slate-900 p-8 rounded-[2rem] text-indigo-100 overflow-x-auto border-4 border-white">
              <pre className="text-sm font-mono leading-relaxed">
{`// API KEY: ${user.apiKey}
// Endpoint: https://api.swiftlink.pro/v1/generate
{
  "apiKey": "${user.apiKey}",
  "destination": "https://your-site.com",
  "alias": "custom-name" // Optional
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'links' && (
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden animate-in">
          <div className="p-10 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tighter uppercase">Global Link Inventory</h2>
            <input 
              type="text" 
              placeholder="Search code..." 
              className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold w-64 focus:outline-none focus:ring-4 focus:ring-indigo-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-10 py-8">Short Path</th>
                <th className="px-10 py-8">Original Destination</th>
                <th className="px-10 py-8">Hits</th>
                <th className="px-10 py-8 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {links.filter(l => l.shortCode.includes(searchTerm)).map(link => (
                <tr key={link.id} className="hover:bg-slate-50 transition">
                  <td className="px-10 py-8 font-black text-indigo-600 text-lg">/s/{link.shortCode}</td>
                  <td className="px-10 py-8 truncate max-w-xs text-slate-500 font-mono text-xs">{link.originalUrl}</td>
                  <td className="px-10 py-8 font-black text-slate-900">{link.clicks || 0}</td>
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
            <h2 className="text-2xl font-black mb-10 flex items-center tracking-tighter uppercase">
              <Globe className="w-8 h-8 mr-4 text-indigo-600" /> Verification Ad Slots
            </h2>
            <p className="text-slate-500 mb-10 text-sm font-medium">Any code pasted here will be <strong>automatically injected</strong> during the redirection flow. We've improved visibility so you can easily read your scripts.</p>
            
            <div className="grid grid-cols-1 gap-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verification Page: Top Header Ad</label>
                <textarea 
                  className="w-full h-40 p-8 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-sm text-slate-900 font-mono focus:outline-none focus:ring-4 focus:ring-indigo-100 resize-none shadow-inner leading-relaxed"
                  placeholder="Paste <script> or <div> code here..."
                  value={localSettings.adSlots.top}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, top: e.target.value}})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verification Page: Content Middle Ad</label>
                <textarea 
                  className="w-full h-40 p-8 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-sm text-slate-900 font-mono focus:outline-none focus:ring-4 focus:ring-indigo-100 resize-none shadow-inner leading-relaxed"
                  placeholder="Paste <script> or <div> code here..."
                  value={localSettings.adSlots.middle}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, middle: e.target.value}})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verification Page: Footer Bottom Ad</label>
                <textarea 
                  className="w-full h-40 p-8 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-sm text-slate-900 font-mono focus:outline-none focus:ring-4 focus:ring-indigo-100 resize-none shadow-inner leading-relaxed"
                  placeholder="Paste <script> or <div> code here..."
                  value={localSettings.adSlots.bottom}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, bottom: e.target.value}})}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
             <h2 className="text-2xl font-black mb-10 flex items-center tracking-tighter uppercase">
                <Settings className="w-8 h-8 mr-4 text-indigo-600" /> Redirect Logic
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Redirect Stages</label>
                   <input 
                     type="number"
                     min="1"
                     max="10"
                     className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-4xl text-slate-900 focus:outline-none"
                     value={localSettings.totalSteps}
                     onChange={(e) => setLocalSettings({...localSettings, totalSteps: parseInt(e.target.value) || 1})}
                   />
                </div>
                <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Timer Delay (Seconds)</label>
                   <input 
                     type="number"
                     className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-4xl text-slate-900 focus:outline-none"
                     value={localSettings.redirectDelay}
                     onChange={(e) => setLocalSettings({...localSettings, redirectDelay: parseInt(e.target.value) || 0})}
                   />
                </div>
             </div>
          </div>

          <div className="bg-indigo-600 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-indigo-200">
             <div className="text-center md:text-left">
                <h3 className="text-3xl font-black tracking-tighter">Synchronize Configuration</h3>
                <p className="text-indigo-200 text-sm font-medium mt-2">Apply these ad and logic settings live to all verification links.</p>
             </div>
             <button onClick={handleSave} className="bg-white text-indigo-600 px-16 py-7 rounded-3xl font-black uppercase text-lg shadow-2xl hover:scale-105 transition active:scale-95 flex items-center">
                <Save className="w-6 h-6 mr-3" /> Save Changes
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
