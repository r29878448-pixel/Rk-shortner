
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  CheckCircle,
  Globe,
  BarChart3,
  TrendingUp,
  Wallet,
  Layers,
  Clock,
  ToggleLeft,
  ToggleRight,
  Users as UsersIcon
} from 'lucide-react';
import { User, SiteSettings, UserRole, Link as LinkType, ClickEvent } from '../types.ts';

interface AdminDashboardProps {
  user: User | null;
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, settings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'ads' | 'system'>('analytics');
  const [localSettings, setLocalSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('swiftlink_settings');
    return saved ? JSON.parse(saved) : settings;
  });

  const [success, setSuccess] = useState(false);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [clickEvents, setClickEvents] = useState<ClickEvent[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);

  useEffect(() => {
    setLinks(JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]'));
    setClickEvents(JSON.parse(localStorage.getItem('swiftlink_click_events') || '[]'));
    setRegisteredUsers(JSON.parse(localStorage.getItem('swiftlink_registered_users') || '[]'));
  }, []);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    localStorage.setItem('swiftlink_settings', JSON.stringify(localSettings));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (!user || user.role !== UserRole.ADMIN) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center uppercase tracking-tighter">
            <ShieldCheck className="w-10 h-10 mr-4 text-indigo-600" /> Network Hub
          </h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em] mt-2">Central Management</p>
        </div>
        
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-lg">
          {[
            { id: 'analytics', label: 'Stats', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
            { id: 'users', label: 'Users', icon: <UsersIcon className="w-4 h-4 mr-2" /> },
            { id: 'ads', label: 'Ads', icon: <Globe className="w-4 h-4 mr-2" /> },
            { id: 'system', label: 'System', icon: <Layers className="w-4 h-4 mr-2" /> }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {success && <div className="mb-10 p-6 bg-green-600 text-white rounded-2xl font-black text-sm flex items-center"><CheckCircle className="w-6 h-6 mr-4" /> Updated Successfully</div>}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in">
          <div className="bg-white border border-slate-200 p-10 rounded-[2rem] shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Network Hits</p>
             <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{clickEvents.length}</h3>
          </div>
          <div className="bg-white border border-slate-200 p-10 rounded-[2rem] shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Publishers</p>
             <h3 className="text-4xl font-black text-indigo-600 tracking-tighter">{registeredUsers.length}</h3>
          </div>
          <div className="bg-white border border-slate-200 p-10 rounded-[2rem] shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">CPM Rate</p>
             <h3 className="text-4xl font-black text-slate-900 tracking-tighter">₹{localSettings.cpmRate}</h3>
          </div>
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="bg-white rounded-[3rem] p-12 border border-slate-200">
           <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Ad Engine Configuration</h2>
              <button onClick={() => setLocalSettings({...localSettings, adsEnabled: !localSettings.adsEnabled})} className={`flex items-center px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest ${localSettings.adsEnabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {localSettings.adsEnabled ? <ToggleRight className="w-5 h-5 mr-2" /> : <ToggleLeft className="w-5 h-5 mr-2" />}
                Ads {localSettings.adsEnabled ? 'Live' : 'Off'}
              </button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <textarea className="w-full h-48 p-4 bg-slate-900 text-indigo-300 font-mono text-xs rounded-2xl" placeholder="Top Ad HTML" value={localSettings.adSlots.top} onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, top: e.target.value}})} />
              <textarea className="w-full h-48 p-4 bg-slate-900 text-indigo-300 font-mono text-xs rounded-2xl" placeholder="Middle Ad HTML" value={localSettings.adSlots.middle} onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, middle: e.target.value}})} />
              <textarea className="w-full h-48 p-4 bg-slate-900 text-indigo-300 font-mono text-xs rounded-2xl" placeholder="Bottom Ad HTML" value={localSettings.adSlots.bottom} onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, bottom: e.target.value}})} />
           </div>
           <button onClick={handleSave} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition shadow-xl">Save Ad Setup</button>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="bg-white rounded-[3rem] p-12 border border-slate-200">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-10">System Identity & Timing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Site Branding</label>
                <input type="text" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={localSettings.siteName} onChange={(e) => setLocalSettings({...localSettings, siteName: e.target.value})} />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Delay (Sec)</label>
                   <input type="number" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={localSettings.redirectDelay} onChange={(e) => setLocalSettings({...localSettings, redirectDelay: parseInt(e.target.value) || 0})} />
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step Count</label>
                   <input type="number" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={localSettings.totalSteps} onChange={(e) => setLocalSettings({...localSettings, totalSteps: parseInt(e.target.value) || 0})} />
                </div>
             </div>
          </div>
          <button onClick={handleSave} className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition shadow-xl">Apply System Changes</button>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50 border-b border-slate-100">
                <th className="px-10 py-6">Publisher</th>
                <th className="px-10 py-6">Balance</th>
                <th className="px-10 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {registeredUsers.map(u => (
                <tr key={u.profile.id} className="hover:bg-slate-50 transition">
                  <td className="px-10 py-8 font-bold text-slate-900">{u.profile.email}</td>
                  <td className="px-10 py-8 font-black text-red-600">₹{(u.profile.balance || 0).toFixed(2)}</td>
                  <td className="px-10 py-8 text-right">
                    <button onClick={() => window.open(localSettings.telegramBotUrl, '_blank')} className="text-[9px] font-black uppercase bg-slate-900 text-white px-4 py-2 rounded-lg">Pay</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
