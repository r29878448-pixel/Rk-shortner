
import React, { useState, useEffect } from 'react';
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
  Settings2
} from 'lucide-react';
import { User, SiteSettings, UserRole, Link as LinkType } from '../types.ts';

interface AdminDashboardProps {
  user: User | null;
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, settings, onUpdateSettings }) => {
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [success, setSuccess] = useState(false);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  const loadLinks = () => {
    const storedLinks = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
    setLinks(storedLinks);
  };

  useEffect(() => {
    loadLinks();
    setLocalSettings(settings);
  }, [settings]);

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

  const filteredLinks = links.filter(l => 
    l.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyApiKey = () => {
    navigator.clipboard.writeText(user.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const getBaseUrl = () => window.location.href.split('#')[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 flex items-center tracking-tighter">
            <ShieldCheck className="w-12 h-12 mr-4 text-indigo-600" /> Terminal Center
          </h1>
          <p className="text-slate-500 mt-2 font-black uppercase text-[10px] tracking-[0.4em]">{localSettings.siteName} Management</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={loadLinks}
            className="p-5 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-indigo-600 transition shadow-sm"
          >
            <RefreshCcw className="w-6 h-6" />
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center justify-center space-x-3 px-12 py-5 gradient-bg text-white rounded-2xl font-black text-lg hover:opacity-90 transition shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)]"
          >
            <Save className="w-6 h-6" />
            <span>Apply Global Settings</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-12 p-8 bg-green-50 border border-green-200 rounded-[2.5rem] flex items-center text-green-800 font-black animate-in slide-in-from-top-4 shadow-sm">
          <CheckCircle className="w-8 h-8 mr-4" /> System synced. Ads are now appearing on all parts of the page globally.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        <div className="lg:col-span-2 space-y-12">
          {/* Site Branding */}
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
                placeholder="SwiftLink"
              />
            </div>
          </div>

          {/* Global Ads configuration */}
          <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black mb-10 flex items-center tracking-tight">
              <Globe className="w-8 h-8 mr-4 text-indigo-600" /> Global Ad Distribution
            </h2>
            <p className="text-slate-500 mb-10 text-sm font-medium">These codes will automatically appear in specific positions across the entire website.</p>
            
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
                    placeholder="Paste global ad HTML/Script code here..."
                    value={localSettings.adSlots[slotKey]}
                    onChange={(e) => updateGlobalAd(slotKey, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Interstitial Step Ads */}
          <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black mb-12 flex items-center tracking-tight">
              <Settings2 className="w-8 h-8 mr-4 text-indigo-600" /> Redirect Interstitials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
              <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Redirect Steps</label>
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

            <div className="space-y-8">
              {[0, 1, 2, 3, 4].map(idx => (
                <div key={idx} className={`p-8 rounded-[2rem] border transition-all duration-300 ${idx < localSettings.totalSteps ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-50 border-slate-100 opacity-40 grayscale'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black text-indigo-900 uppercase tracking-[0.3em]">Step {idx + 1} Ad Placement</span>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded ${idx < localSettings.totalSteps ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-white'}`}>{idx < localSettings.totalSteps ? 'ACTIVE' : 'IDLE'}</span>
                  </div>
                  <textarea 
                    className="w-full h-32 px-6 py-4 rounded-2xl border border-slate-200 text-[10px] font-mono focus:ring-4 focus:ring-indigo-100 focus:outline-none resize-none"
                    placeholder="Paste specific ad script for this step..."
                    value={localSettings.stepAds[idx] || ''}
                    onChange={(e) => updateStepAd(idx, e.target.value)}
                    disabled={idx >= localSettings.totalSteps}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {/* API Access Section */}
          <div className="bg-indigo-600 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
            <h2 className="text-xl font-black mb-10 flex items-center relative z-10 tracking-tight">
              <Key className="w-6 h-6 mr-4 text-indigo-300" /> API Access
            </h2>
            <div className="space-y-10 relative z-10">
               <div>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200 mb-4">Your Private Key</p>
                 <div className="flex items-center bg-black/30 p-5 rounded-2xl border border-white/10 group-hover:bg-black/40 transition">
                   <code className="text-xs truncate font-mono mr-4 text-indigo-100 select-all">{user.apiKey}</code>
                   <button onClick={copyApiKey} className="shrink-0 p-3 hover:bg-white/20 rounded-xl transition">
                     {copiedKey ? <CheckCircle className="w-5 h-5 text-green-300" /> : <Copy className="w-5 h-5" />}
                   </button>
                 </div>
               </div>
               <p className="text-[10px] italic text-indigo-200 leading-relaxed font-medium">Use this key to integrate with your other platforms.</p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 gradient-bg blur-[100px] opacity-30 -mr-32 -mt-32"></div>
          </div>

          <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
            <h2 className="text-xl font-black mb-10 flex items-center relative z-10 tracking-tight">
              <Database className="w-6 h-6 mr-4 text-indigo-400" /> Statistics
            </h2>
            <div className="space-y-10 relative z-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Links Stored</span>
                <span className="text-8xl font-black tracking-tighter leading-none">{links.length}</span>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 gradient-bg blur-[120px] opacity-40 -mr-32 -mt-32"></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-12 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-50/30">
          <h2 className="text-3xl font-black tracking-tighter">Vault</h2>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-14 pr-8 py-5 w-full bg-white border border-slate-200 rounded-3xl text-sm focus:ring-4 focus:ring-indigo-100 focus:outline-none font-bold"
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
                <th className="px-12 py-8 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-12 py-32 text-center text-slate-300 font-black text-3xl italic tracking-tighter uppercase opacity-30 text-center">Empty</td>
                </tr>
              ) : filteredLinks.map(link => (
                <tr key={link.id} className="hover:bg-slate-50/50 transition duration-300 group">
                  <td className="px-12 py-8 font-black text-indigo-600 text-lg">/s/{link.shortCode}</td>
                  <td className="px-12 py-8 truncate max-w-md text-slate-400 text-xs font-mono">{link.originalUrl}</td>
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
    </div>
  );
};

export default AdminDashboard;
