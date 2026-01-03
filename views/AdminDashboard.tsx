
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
  Type
} from 'lucide-react';
import { User, SiteSettings, UserRole, Link as LinkType } from '../types';

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

  const loadLinks = () => {
    const storedLinks = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
    setLinks(storedLinks);
  };

  useEffect(() => {
    loadLinks();
  }, []);

  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-amber-50 p-8 rounded-[3rem] border border-amber-100 max-w-sm">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-slate-900 mb-2">Restricted Area</h1>
          <p className="text-slate-500 mb-8">This zone is for platform administrators only. Please authenticate to continue.</p>
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center tracking-tighter">
            <ShieldCheck className="w-10 h-10 mr-4 text-indigo-600" /> Control Terminal
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Enterprise Monetization Engine • Active</p>
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
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-10 p-6 bg-green-50 border border-green-200 rounded-[2rem] flex items-center text-green-700 font-bold animate-in slide-in-from-top-4 shadow-sm">
          <CheckCircle className="w-6 h-6 mr-3" /> All changes have been synchronized to production.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black mb-10 flex items-center">
              <Eye className="w-6 h-6 mr-3 text-indigo-600" /> Core Engine Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <p className="mt-3 text-xs text-slate-400 font-medium">Number of 15s pages users must pass.</p>
              </div>
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Timer (Seconds)</label>
                <input 
                  type="number"
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-black text-2xl"
                  value={localSettings.redirectDelay}
                  onChange={(e) => setLocalSettings({...localSettings, redirectDelay: parseInt(e.target.value) || 0})}
                />
                <p className="mt-3 text-xs text-slate-400 font-medium">Dwell time per page.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black mb-10 flex items-center">
              <Layout className="w-6 h-6 mr-3 text-indigo-600" /> Per-Step Ad Placement
            </h2>
            <div className="space-y-6">
              {[0, 1, 2, 3, 4].map(idx => (
                <div key={idx} className={`p-6 rounded-3xl border ${idx < localSettings.totalSteps ? 'bg-indigo-50/30 border-indigo-100' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-black text-indigo-900 uppercase tracking-widest">Step {idx + 1} Ad Code</span>
                    {idx >= localSettings.totalSteps && <span className="text-[10px] font-bold text-slate-400 italic">Inactive</span>}
                  </div>
                  <textarea 
                    className="w-full h-24 px-4 py-3 rounded-2xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder="<script>...ad content...</script>"
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
          <div className="bg-slate-900 rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
            <h2 className="text-xl font-black mb-8 flex items-center relative z-10">
              <Database className="w-5 h-5 mr-3 text-indigo-400" /> Inventory
            </h2>
            <div className="space-y-8 relative z-10">
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Active Links</span>
                <span className="text-6xl font-black tracking-tighter">{links.length}</span>
              </div>
              <div className="h-px bg-slate-800 w-full" />
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Storage Node</span>
                <span className="text-lg font-bold text-indigo-400">LocalStorage API</span>
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
              placeholder="Search database..." 
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
                <th className="px-10 py-6">Code Path</th>
                <th className="px-10 py-6">Target Destination</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-10 py-24 text-center text-slate-400 font-bold text-lg italic">Database empty.</td>
                </tr>
              ) : filteredLinks.map(link => (
                <tr key={link.id} className="hover:bg-slate-50/50 transition group">
                  <td className="px-10 py-6">
                    <div className="text-md font-black text-indigo-600">
                      /{link.shortCode}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="text-xs text-slate-500 max-w-[400px] truncate font-medium">{link.originalUrl}</div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button 
                      onClick={() => deleteLink(link.id)}
                      className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    >
                      <Trash2 className="w-5 h-5" />
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
