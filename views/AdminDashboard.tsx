
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
        <div className="bg-white p-10 rounded-xl border border-slate-200 shadow-xl max-w-sm">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2 uppercase">Unauthorized</h1>
          <p className="text-slate-500 mb-8 font-medium">Admin credentials are required to access this dashboard.</p>
          <a href="/#/login" className="block w-full py-4 bg-slate-900 text-white rounded font-bold uppercase text-xs tracking-widest">Login</a>
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
    if(!confirm("Are you sure you want to delete this link?")) return;
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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center uppercase tracking-tight">
            <ShieldCheck className="w-8 h-8 mr-3 text-indigo-600" /> Admin Dashboard
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Global System Control</p>
        </div>
        <div className="flex items-center bg-white border border-slate-200 p-1 rounded-lg shadow-sm">
          <button onClick={() => setActiveTab('analytics')} className={`px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500'}`}>Stats</button>
          <button onClick={() => setActiveTab('links')} className={`px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition ${activeTab === 'links' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500'}`}>Links</button>
          <button onClick={() => setActiveTab('settings')} className={`px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500'}`}>Ads</button>
          <button onClick={() => setActiveTab('api')} className={`px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition ${activeTab === 'api' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500'}`}>API</button>
        </div>
      </div>

      {success && (activeTab === 'settings') && (
        <div className="mb-8 p-5 bg-green-600 text-white rounded-lg flex items-center font-bold shadow-lg animate-in">
          <CheckCircle className="w-6 h-6 mr-3" /> System settings updated successfully.
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 rounded-xl p-10 text-white relative overflow-hidden shadow-2xl">
               <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 mb-3">Total Redirects</p>
               <h3 className="text-7xl font-bold tracking-tighter">{stats.totalClicks}</h3>
               <BarChart3 className="absolute -bottom-6 -right-6 w-40 h-40 text-white/5" />
            </div>
            <div className="bg-white rounded-xl p-10 shadow-sm border border-slate-200 flex flex-col justify-center">
               <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Top Alias</p>
               <h3 className="text-3xl font-bold text-slate-900">/s/{stats.topLink?.shortCode || 'N/A'}</h3>
               <div className="flex items-center space-x-2 mt-4 text-indigo-600 font-bold">
                  <MousePointerClick className="w-5 h-5" />
                  <span>{stats.topLink?.clicks || 0} Successful Hits</span>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="space-y-8 animate-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <Key className="w-6 h-6 text-indigo-600 mr-3" />
                <h2 className="text-lg font-bold text-slate-900 uppercase">Your API Key</h2>
              </div>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded p-4">
                <code className="text-sm font-mono text-indigo-600 flex-grow break-all">{user.apiKey}</code>
                <button 
                  onClick={() => handleCopy(user.apiKey, 'api')}
                  className="ml-4 p-2 text-slate-400 hover:text-indigo-600 transition"
                  title="Copy Key"
                >
                  {copyStatus.api ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-slate-400 text-xs mt-4">Keep this key private. It allows programmatic access to your link vault.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <LinkIcon className="w-6 h-6 text-indigo-600 mr-3" />
                <h2 className="text-lg font-bold text-slate-900 uppercase">Platform URL</h2>
              </div>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded p-4">
                <code className="text-sm font-mono text-slate-600 flex-grow break-all">{platformUrl}</code>
                <button 
                  onClick={() => handleCopy(platformUrl, 'url')}
                  className="ml-4 p-2 text-slate-400 hover:text-indigo-600 transition"
                  title="Copy URL"
                >
                  {copyStatus.url ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-slate-400 text-xs mt-4">Use this as the base URL for API requests and integrations.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-10 shadow-sm">
            <div className="flex items-center mb-6">
              <Code className="w-8 h-8 text-indigo-600 mr-4" />
              <h2 className="text-xl font-bold text-slate-900 uppercase">API Documentation</h2>
            </div>
            <p className="text-slate-600 mb-8 text-sm">SwiftLink supports RESTful integration. Send a POST request to generate links programmatically.</p>
            <div className="bg-slate-900 p-8 rounded-lg text-indigo-200 overflow-x-auto border-4 border-slate-800">
              <pre className="text-sm font-mono leading-relaxed">
{`# Generated Link Endpoint
POST ${platformUrl}api/v1/generate
Headers: { "X-API-KEY": "${user.apiKey}" }

# Payload
{
  "url": "https://target-site.com",
  "alias": "optional-custom-name"
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'links' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h2 className="text-lg font-bold text-slate-900 uppercase">Link Vault</h2>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search link..." 
                className="pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded text-sm w-64 focus:border-indigo-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-500 text-[11px] uppercase font-bold tracking-widest border-b border-slate-200">
                <tr>
                  <th className="px-8 py-5">Short Code</th>
                  <th className="px-8 py-5">Target URL</th>
                  <th className="px-8 py-5">Clicks</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {links.filter(l => l.shortCode.includes(searchTerm)).map(link => (
                  <tr key={link.id} className="hover:bg-slate-50 transition">
                    <td className="px-8 py-6 font-bold text-indigo-600">/s/{link.shortCode}</td>
                    <td className="px-8 py-6 truncate max-w-xs text-slate-500 font-mono text-xs">{link.originalUrl}</td>
                    <td className="px-8 py-6 font-bold text-slate-900">{link.clicks || 0}</td>
                    <td className="px-8 py-6 text-right">
                      <button onClick={() => deleteLink(link.id)} className="p-2 text-slate-300 hover:text-red-600 transition">
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

      {activeTab === 'settings' && (
        <div className="space-y-10 animate-in">
          <div className="bg-white rounded-xl p-10 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-8 flex items-center uppercase text-slate-900">
              <Globe className="w-6 h-6 mr-3 text-indigo-600" /> Ad Injection Logic
            </h2>
            <p className="text-slate-500 mb-10 text-sm">Ads are injected <strong>only</strong> on verification (blog) pages. Admins see an ad-free experience.</p>
            
            <div className="grid grid-cols-1 gap-10">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Header Ad Slot</label>
                <textarea 
                  className="w-full h-40 p-6 bg-white border-2 border-slate-200 rounded text-sm text-slate-900 font-mono focus:border-indigo-500 focus:outline-none shadow-sm leading-relaxed"
                  placeholder="Paste HTML or Script here..."
                  value={localSettings.adSlots.top}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, top: e.target.value}})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">In-Content Ad Slot</label>
                <textarea 
                  className="w-full h-40 p-6 bg-white border-2 border-slate-200 rounded text-sm text-slate-900 font-mono focus:border-indigo-500 focus:outline-none shadow-sm leading-relaxed"
                  placeholder="Paste HTML or Script here..."
                  value={localSettings.adSlots.middle}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, middle: e.target.value}})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Footer Ad Slot</label>
                <textarea 
                  className="w-full h-40 p-6 bg-white border-2 border-slate-200 rounded text-sm text-slate-900 font-mono focus:border-indigo-500 focus:outline-none shadow-sm leading-relaxed"
                  placeholder="Paste HTML or Script here..."
                  value={localSettings.adSlots.bottom}
                  onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, bottom: e.target.value}})}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-10 shadow-sm border border-slate-200">
             <h2 className="text-xl font-bold mb-8 flex items-center uppercase text-slate-900">
                <Settings className="w-6 h-6 mr-3 text-indigo-600" /> Redirect Configuration
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-slate-50 rounded border border-slate-200">
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Stages Count</label>
                   <input 
                     type="number"
                     min="1"
                     max="10"
                     className="w-full px-4 py-3 bg-white border border-slate-300 rounded font-bold text-2xl text-slate-900 focus:border-indigo-500 focus:outline-none"
                     value={localSettings.totalSteps}
                     onChange={(e) => setLocalSettings({...localSettings, totalSteps: parseInt(e.target.value) || 1})}
                   />
                </div>
                <div className="p-6 bg-slate-50 rounded border border-slate-200">
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Wait Timer (Seconds)</label>
                   <input 
                     type="number"
                     className="w-full px-4 py-3 bg-white border border-slate-300 rounded font-bold text-2xl text-slate-900 focus:border-indigo-500 focus:outline-none"
                     value={localSettings.redirectDelay}
                     onChange={(e) => setLocalSettings({...localSettings, redirectDelay: parseInt(e.target.value) || 0})}
                   />
                </div>
             </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
             <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold tracking-tight uppercase">Save All Changes</h3>
                <p className="text-slate-400 text-sm mt-2">Update global ad slots and redirect logic across the network.</p>
             </div>
             <button onClick={handleSave} className="bg-indigo-600 text-white px-12 py-5 rounded font-bold uppercase text-sm hover:bg-indigo-700 transition active:scale-95 flex items-center shadow-lg">
                <Save className="w-5 h-5 mr-3" /> Sync Settings
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
