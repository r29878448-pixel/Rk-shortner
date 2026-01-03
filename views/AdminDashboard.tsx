
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Eye, 
  Save,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Database,
  Link as LinkIcon,
  Search,
  Settings as SettingsIcon,
  RefreshCcw,
  Layout,
  Type,
  Code,
  Copy,
  Key
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
          <h1 className="text-2xl font-black text-slate-900 mb-2">Restricted Area</h1>
          <p className="text-slate-500 mb-8">This zone is for platform administrators only.</p>
          <a href="/#/login" className="block w-full py-4 gradient-bg text-white rounded-2xl font-bold shadow-xl shadow-indigo-100">Admin Login</a>
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center tracking-tighter">
            <ShieldCheck className="w-10 h-10 mr-4 text-indigo-600" /> Control Terminal
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Enterprise Management • {localSettings.siteName}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={loadLinks}
            className="p-4 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-indigo-600 transition shadow-sm"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center justify-center space-x-3 px-10 py-4 gradient-bg text-white rounded-2xl font-bold hover:opacity-90 transition shadow-2xl shadow-indigo-100"
          >
            <Save className="w-5 h-5" />
            <span>Save All Settings</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-10 p-6 bg-green-50 border border-green-200 rounded-[2rem] flex items-center text-green-700 font-bold animate-in slide-in-from-top-4 shadow-sm">
          <CheckCircle className="w-6 h-6 mr-3" /> Dashboard settings successfully updated.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
        <div className="lg:col-span-2 space-y-10">
          {/* Site Branding */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black mb-10 flex items-center">
              <Type className="w-6 h-6 mr-3 text-indigo-600" /> Platform Branding
            </h2>
            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Website Name</label>
              <input 
                type="text"
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-xl"
                value={localSettings.siteName}
                onChange={(e) => setLocalSettings({...localSettings, siteName: e.target.value})}
                placeholder="Enter your website name"
              />
              <p className="mt-3 text-xs text-slate-400 font-medium">This changes the logo, footer, and branding everywhere.</p>
            </div>
          </div>

          {/* Ad Configuration */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black mb-10 flex items-center">
              <Layout className="w-6 h-6 mr-3 text-indigo-600" /> Monetization Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Verification Steps</label>
                <input 
                  type="number"
                  min="1"
                  max="5"
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-black text-2xl"
                  value={localSettings.totalSteps}
                  onChange={(e) => setLocalSettings({...localSettings, totalSteps: parseInt(e.target.value) || 1})}
                />
              </div>
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Timer (Seconds)</label>
                <input 
                  type="number"
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-black text-2xl"
                  value={localSettings.redirectDelay}
                  onChange={(e) => setLocalSettings({...localSettings, redirectDelay: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="space-y-6">
              {[0, 1, 2, 3, 4].map(idx => (
                <div key={idx} className={`p-6 rounded-3xl border ${idx < localSettings.totalSteps ? 'bg-indigo-50/30 border-indigo-100' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-black text-indigo-900 uppercase tracking-widest">Ad Slot for Step {idx + 1}</span>
                  </div>
                  <textarea 
                    className="w-full h-24 px-4 py-3 rounded-2xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder="Paste ad script here..."
                    value={localSettings.stepAds[idx] || ''}
                    onChange={(e) => updateStepAd(idx, e.target.value)}
                    disabled={idx >= localSettings.totalSteps}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {/* API Access Section */}
          <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
            <h2 className="text-xl font-black mb-8 flex items-center relative z-10">
              <Key className="w-5 h-5 mr-3 text-indigo-200" /> External API Access
            </h2>
            <div className="space-y-6 relative z-10">
               <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">Your API Key</p>
                 <div className="flex items-center bg-black/20 p-4 rounded-xl border border-white/10">
                   <code className="text-xs truncate font-mono mr-2">{user.apiKey}</code>
                   <button onClick={copyApiKey} className="shrink-0 p-2 hover:bg-white/10 rounded-lg transition">
                     {copiedKey ? <CheckCircle className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
                   </button>
                 </div>
               </div>
               <div className="bg-black/10 p-4 rounded-xl border border-white/10">
                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">Shorten Endpoint</p>
                 <code className="text-[10px] block font-mono text-indigo-100">POST /api/shorten</code>
                 <code className="text-[8px] block font-mono text-indigo-300 mt-1 opacity-60">?apiKey={user.apiKey.substring(0,6)}...&url=...</code>
               </div>
               <p className="text-[10px] italic text-indigo-200">Use this key to integrate with other platforms like Telegram bots or blogs.</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
            <h2 className="text-xl font-black mb-8 flex items-center relative z-10">
              <Database className="w-5 h-5 mr-3 text-indigo-400" /> System Stats
            </h2>
            <div className="space-y-8 relative z-10">
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Active Links</span>
                <span className="text-6xl font-black tracking-tighter">{links.length}</span>
              </div>
              <div className="h-px bg-slate-800 w-full" />
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Storage Node</span>
                <span className="text-lg font-bold text-indigo-400">Secure Browser DB</span>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 gradient-bg blur-[100px] opacity-30 -mr-24 -mt-24"></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-2xl font-black">Link Repository</h2>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search links..." 
              className="pl-12 pr-6 py-4 w-full bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-[0.3em]">
              <tr>
                <th className="px-10 py-6">Code</th>
                <th className="px-10 py-6">Destination</th>
                <th className="px-10 py-6 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-10 py-24 text-center text-slate-400 font-bold text-lg italic">No links found in database.</td>
                </tr>
              ) : filteredLinks.map(link => (
                <tr key={link.id} className="hover:bg-slate-50/50 transition group">
                  <td className="px-10 py-6 font-black text-indigo-600">/{link.shortCode}</td>
                  <td className="px-10 py-6 truncate max-w-md text-slate-500 text-xs">{link.originalUrl}</td>
                  <td className="px-10 py-6 text-right">
                    <button onClick={() => deleteLink(link.id)} className="p-3 text-slate-300 hover:text-red-600 transition"><Trash2 className="w-5 h-5" /></button>
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
