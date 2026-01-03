
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
  Zap,
  ExternalLink
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
    const totalLinks = links.length;
    const topLink = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0];
    return { totalClicks, totalLinks, topLink };
  }, [clickEvents, links]);

  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-xl max-w-sm w-full">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900 mb-2 uppercase">Admin Required</h1>
          <p className="text-slate-500 mb-6 text-sm">You must be logged in as an administrator to view this page.</p>
          <a href="/#/login" className="block w-full py-3 bg-indigo-600 text-white rounded font-bold uppercase text-xs tracking-widest">Login Now</a>
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

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus({ ...copyStatus, [id]: true });
    setTimeout(() => setCopyStatus({ ...copyStatus, [id]: false }), 2000);
  };

  const platformUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
  const simpleApiExample = `${platformUrl}api?api=${user.apiKey}&url=https://google.com`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center uppercase tracking-tight">
            <ShieldCheck className="w-6 h-6 mr-2 text-indigo-600" /> Control Panel
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Manage links, ads & API</p>
        </div>
        
        {/* Mobile Navigation Pills */}
        <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
          {[
            { id: 'analytics', label: 'Stats' },
            { id: 'links', label: 'Links' },
            { id: 'settings', label: 'Ads' },
            { id: 'api', label: 'API Access' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`whitespace-nowrap px-6 py-2 rounded font-bold text-[10px] uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {success && activeTab === 'settings' && (
        <div className="mb-6 p-4 bg-green-500 text-white rounded font-bold text-sm flex items-center shadow-lg animate-in">
          <CheckCircle className="w-5 h-5 mr-3" /> All changes have been synchronized.
        </div>
      )}

      {/* Analytics Tab - Simplified */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
               <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Total Clicks</p>
               <h3 className="text-3xl font-black text-slate-900">{stats.totalClicks}</h3>
               <div className="mt-2 text-[10px] text-green-600 font-bold uppercase flex items-center">
                 <Zap className="w-3 h-3 mr-1" /> Live Traffic
               </div>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
               <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Total Links</p>
               <h3 className="text-3xl font-black text-slate-900">{stats.totalLinks}</h3>
               <div className="mt-2 text-[10px] text-indigo-600 font-bold uppercase flex items-center">
                 <LinkIcon className="w-3 h-3 mr-1" /> Active Vault
               </div>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
               <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Top Link</p>
               <h3 className="text-xl font-black text-slate-900 truncate">/s/{stats.topLink?.shortCode || 'N/A'}</h3>
               <div className="mt-2 text-[10px] text-slate-500 font-bold uppercase flex items-center">
                 <MousePointerClick className="w-3 h-3 mr-1" /> {stats.topLink?.clicks || 0} hits
               </div>
            </div>
          </div>
        </div>
      )}

      {/* API Access Tab - Simplified VP Links Style */}
      {activeTab === 'api' && (
        <div className="space-y-6 animate-in">
          <div className="bg-white border-2 border-slate-100 rounded-lg p-6 md:p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <Key className="w-5 h-5 text-indigo-600 mr-3" />
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Your API Credentials</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">API Token</label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded p-3 group">
                  <code className="text-xs font-mono text-indigo-600 flex-grow break-all pr-2">{user.apiKey}</code>
                  <button onClick={() => handleCopy(user.apiKey, 'apiToken')} className="text-slate-400 hover:text-indigo-600 shrink-0">
                    {copyStatus['apiToken'] ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">API Endpoint</label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded p-3 group">
                  <code className="text-xs font-mono text-slate-600 flex-grow break-all pr-2">{platformUrl}api</code>
                  <button onClick={() => handleCopy(`${platformUrl}api`, 'apiEndpoint')} className="text-slate-400 hover:text-indigo-600 shrink-0">
                    {copyStatus['apiEndpoint'] ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center">
                <Zap className="w-4 h-4 mr-2 text-amber-500" /> Simple Integration Method
              </h3>
              <p className="text-xs text-slate-500 mb-4 font-medium">Use this simple URL format to create links from other platforms or scripts:</p>
              <div className="bg-slate-900 p-4 rounded text-indigo-300 font-mono text-[11px] overflow-x-auto break-all leading-relaxed border-l-4 border-indigo-500">
                {simpleApiExample}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button 
                  onClick={() => handleCopy(simpleApiExample, 'fullExample')}
                  className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase hover:bg-indigo-100 transition"
                >
                  {copyStatus['fullExample'] ? 'Copied Example!' : 'Copy Example URL'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Links Vault Tab */}
      {activeTab === 'links' && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden animate-in">
          <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between bg-slate-50 gap-4">
            <h2 className="text-sm font-black text-slate-900 uppercase">Active Relay Vault</h2>
            <input 
              type="text" 
              placeholder="Search..." 
              className="px-4 py-2 bg-white border border-slate-200 rounded text-xs w-full md:w-64 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-widest border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Relay Path</th>
                  <th className="px-6 py-4">Target</th>
                  <th className="px-6 py-4">Clicks</th>
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
                      <button 
                        onClick={() => handleCopy(`${platformUrl}#/s/${link.shortCode}`, link.id)} 
                        className="p-2 text-slate-400 hover:text-indigo-600"
                        title="Copy Link"
                      >
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

      {/* Settings/Ads Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-in">
          <div className="bg-white rounded-lg p-6 md:p-8 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-black mb-6 flex items-center uppercase text-slate-900">
              <Globe className="w-5 h-5 mr-2 text-indigo-600" /> Monetization Settings
            </h2>
            <p className="text-slate-500 mb-8 text-xs font-medium leading-relaxed">Place your ad scripts here. They will only appear on the public multi-stage verification pages.</p>
            
            <div className="space-y-6">
              {[
                { id: 'top', label: 'Header Ad Slot' },
                { id: 'middle', label: 'In-Content Ad Slot' },
                { id: 'bottom', label: 'Footer Ad Slot' }
              ].map((slot) => (
                <div key={slot.id} className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{slot.label}</label>
                  <textarea 
                    className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-900 font-mono focus:border-indigo-500 focus:outline-none resize-none"
                    placeholder="Paste script or HTML..."
                    value={(localSettings.adSlots as any)[slot.id]}
                    onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, [slot.id]: e.target.value}})}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 md:p-8 border border-slate-200 shadow-sm">
             <h2 className="text-lg font-black mb-6 flex items-center uppercase text-slate-900">
                <Settings className="w-5 h-5 mr-2 text-indigo-600" /> Flow Settings
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded">
                   <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Total Verification Steps</label>
                   <input 
                     type="number" min="1" max="10"
                     className="w-full px-3 py-2 bg-white border border-slate-200 rounded font-bold text-lg text-slate-900 focus:outline-none"
                     value={localSettings.totalSteps}
                     onChange={(e) => setLocalSettings({...localSettings, totalSteps: parseInt(e.target.value) || 1})}
                   />
                </div>
                <div className="p-4 bg-slate-50 rounded">
                   <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Step Timer (Seconds)</label>
                   <input 
                     type="number"
                     className="w-full px-3 py-2 bg-white border border-slate-200 rounded font-bold text-lg text-slate-900 focus:outline-none"
                     value={localSettings.redirectDelay}
                     onChange={(e) => setLocalSettings({...localSettings, redirectDelay: parseInt(e.target.value) || 0})}
                   />
                </div>
             </div>
          </div>

          <button onClick={handleSave} className="w-full py-5 bg-indigo-600 text-white rounded font-black uppercase text-xs tracking-widest shadow-xl hover:bg-indigo-700 transition active:scale-95 flex items-center justify-center">
            <Save className="w-4 h-4 mr-2" /> Sync Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
