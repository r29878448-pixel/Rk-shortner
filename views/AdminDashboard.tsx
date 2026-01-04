
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
  Users as UsersIcon,
  Layout
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
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-16 gap-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 flex items-center uppercase tracking-tighter">
            <ShieldCheck className="w-12 h-12 mr-6 text-indigo-600" /> Network Hub
          </h1>
          <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.5em] mt-3">Root Administrative Infrastructure</p>
        </div>
        
        <div className="flex bg-white border border-slate-200 p-2 rounded-3xl shadow-2xl">
          {[
            { id: 'analytics', label: 'Stats', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
            { id: 'users', label: 'Users', icon: <UsersIcon className="w-4 h-4 mr-2" /> },
            { id: 'ads', label: 'Ads', icon: <Globe className="w-4 h-4 mr-2" /> },
            { id: 'system', label: 'System', icon: <Layers className="w-4 h-4 mr-2" /> }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {success && <div className="mb-12 p-8 bg-green-600 text-white rounded-[2rem] font-black text-sm flex items-center shadow-xl animate-in"><CheckCircle className="w-7 h-7 mr-5" /> All Configurations Deployed Successfully</div>}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 animate-in">
          <div className="bg-white border border-slate-200 p-12 rounded-[3rem] shadow-sm">
             <p className="text-[11px] font-black uppercase text-slate-400 mb-4 tracking-widest">Network Hits</p>
             <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{clickEvents.length}</h3>
          </div>
          <div className="bg-white border border-slate-200 p-12 rounded-[3rem] shadow-sm">
             <p className="text-[11px] font-black uppercase text-slate-400 mb-4 tracking-widest">Publishers</p>
             <h3 className="text-5xl font-black text-indigo-600 tracking-tighter">{registeredUsers.length}</h3>
          </div>
          <div className="bg-white border border-slate-200 p-12 rounded-[3rem] shadow-sm">
             <p className="text-[11px] font-black uppercase text-slate-400 mb-4 tracking-widest">CPM Rate</p>
             <h3 className="text-5xl font-black text-slate-900 tracking-tighter">₹{localSettings.cpmRate}</h3>
          </div>
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="bg-white rounded-[3.5rem] p-12 md:p-20 border border-slate-200 shadow-sm animate-in">
           <div className="flex justify-between items-center mb-16">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Global Ad Console</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Manage HTML Injection Slots</p>
              </div>
              <button onClick={() => setLocalSettings({...localSettings, adsEnabled: !localSettings.adsEnabled})} className={`flex items-center px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-colors ${localSettings.adsEnabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {localSettings.adsEnabled ? <ToggleRight className="w-6 h-6 mr-3" /> : <ToggleLeft className="w-6 h-6 mr-3" />}
                Ad Engine {localSettings.adsEnabled ? 'Live' : 'Standby'}
              </button>
           </div>
           
           <div className="space-y-12 mb-16">
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center"><Layout className="w-4 h-4 mr-2" /> Top Header Slot (HTML)</label>
                <textarea className="w-full h-40 p-6 bg-slate-900 text-indigo-300 font-mono text-xs rounded-3xl border border-white/10" value={localSettings.adSlots.top} onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, top: e.target.value}})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center"><Layout className="w-4 h-4 mr-2" /> Content Middle Slot (HTML)</label>
                  <textarea className="w-full h-64 p-6 bg-slate-900 text-indigo-300 font-mono text-xs rounded-3xl border border-white/10" value={localSettings.adSlots.middle} onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, middle: e.target.value}})} />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center"><Layout className="w-4 h-4 mr-2" /> Global Footer Slot (HTML)</label>
                  <textarea className="w-full h-64 p-6 bg-slate-900 text-indigo-300 font-mono text-xs rounded-3xl border border-white/10" value={localSettings.adSlots.bottom} onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, bottom: e.target.value}})} />
                </div>
              </div>
           </div>
           
           <button onClick={handleSave} className="w-full py-8 bg-slate-900 text-white rounded-3xl font-black uppercase text-xs tracking-[0.3em] hover:bg-black transition-all shadow-2xl active:scale-95">Deploy Ad Manifest</button>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="bg-white rounded-[3.5rem] p-12 md:p-20 border border-slate-200 shadow-sm animate-in">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-16">Core System Protocols</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
             <div className="space-y-6">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Platform Identity</label>
                <input type="text" className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700" value={localSettings.siteName} onChange={(e) => setLocalSettings({...localSettings, siteName: e.target.value})} />
             </div>
             <div className="space-y-6">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Telegram Operations Bot</label>
                <input type="text" className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700" value={localSettings.telegramBotUrl} onChange={(e) => setLocalSettings({...localSettings, telegramBotUrl: e.target.value})} />
             </div>
             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                   <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Verify Delay (S)</label>
                   <input type="number" className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700" value={localSettings.redirectDelay} onChange={(e) => setLocalSettings({...localSettings, redirectDelay: parseInt(e.target.value) || 0})} />
                </div>
                <div className="space-y-6">
                   <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">CPM (₹/1k)</label>
                   <input type="number" className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700" value={localSettings.cpmRate} onChange={(e) => setLocalSettings({...localSettings, cpmRate: parseInt(e.target.value) || 0})} />
                </div>
             </div>
          </div>
          <button onClick={handleSave} className="w-full py-8 bg-indigo-600 text-white rounded-3xl font-black uppercase text-xs tracking-[0.3em] hover:bg-indigo-700 transition-all shadow-2xl active:scale-95">Apply Global Settings</button>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 bg-slate-50 border-b border-slate-100">
                <th className="px-12 py-8">Authorized Publisher</th>
                <th className="px-12 py-8">Accumulated Balance</th>
                <th className="px-12 py-8 text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-bold">
              {registeredUsers.length > 0 ? registeredUsers.map(u => (
                <tr key={u.profile.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-12 py-10 text-slate-900 text-lg">{u.profile.email}</td>
                  <td className="px-12 py-10 font-black text-green-600 text-2xl">₹{(u.profile.balance || 0).toFixed(2)}</td>
                  <td className="px-12 py-10 text-right">
                    <button onClick={() => window.open(localSettings.telegramBotUrl, '_blank')} className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-black transition-colors">Execute Payout</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={3} className="px-12 py-20 text-center text-slate-300 font-black uppercase tracking-[0.4em]">No Active Publishers Detected</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
