
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle,
  Globe,
  BarChart3,
  Users as UsersIcon,
  Settings,
  Database
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
  const [clickEvents, setClickEvents] = useState<ClickEvent[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);

  useEffect(() => {
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
          <h1 className="text-4xl font-black text-slate-900 flex items-center uppercase tracking-tighter">
            <ShieldCheck className="w-10 h-10 mr-4 text-indigo-600" /> System Control
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Network Hub Administration</p>
        </div>
        
        <div className="flex bg-white border border-slate-200 p-1 rounded-2xl shadow-sm">
          {[
            { id: 'analytics', label: 'Telemetry', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
            { id: 'users', label: 'Publishers', icon: <UsersIcon className="w-4 h-4 mr-2" /> },
            { id: 'ads', label: 'Ad Engine', icon: <Globe className="w-4 h-4 mr-2" /> },
            { id: 'system', label: 'Core Config', icon: <Settings className="w-4 h-4 mr-2" /> }
          ].map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex items-center px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {success && (
        <div className="mb-12 p-6 bg-green-600 text-white rounded-2xl font-black text-sm flex items-center animate-in shadow-xl">
          <CheckCircle className="w-6 h-6 mr-4" /> Configuration Synchronized Successfully
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in">
          <div className="bg-white border p-10 rounded-[2rem] shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Total Network Hits</p>
             <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{clickEvents.length}</h3>
          </div>
          <div className="bg-white border p-10 rounded-[2rem] shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Active Publishers</p>
             <h3 className="text-5xl font-black text-indigo-600 tracking-tighter">{registeredUsers.length}</h3>
          </div>
          <div className="bg-white border p-10 rounded-[2rem] shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Network CPM (₹)</p>
             <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{localSettings.cpmRate}</h3>
          </div>
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="bg-white rounded-[2rem] p-10 border shadow-sm animate-in max-w-4xl mx-auto">
           <h2 className="text-3xl font-black uppercase tracking-tighter mb-10 flex items-center">
             <Database className="w-8 h-8 mr-4 text-indigo-600" /> Ad Injection Engine
           </h2>
           <div className="space-y-10 mb-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Header Script Slot</label>
                <textarea className="w-full h-40 p-5 bg-slate-900 text-indigo-300 font-mono text-xs rounded-2xl border border-white/10" value={localSettings.adSlots.top} onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, top: e.target.value}})} />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Middle Script Slot</label>
                <textarea className="w-full h-40 p-5 bg-slate-900 text-indigo-300 font-mono text-xs rounded-2xl border border-white/10" value={localSettings.adSlots.middle} onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, middle: e.target.value}})} />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Footer Script Slot</label>
                <textarea className="w-full h-40 p-5 bg-slate-900 text-indigo-300 font-mono text-xs rounded-2xl border border-white/10" value={localSettings.adSlots.bottom} onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, bottom: e.target.value}})} />
              </div>
           </div>
           <button onClick={handleSave} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">Deploy Ad Matrix</button>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="bg-white rounded-[2rem] p-10 border shadow-sm animate-in max-w-4xl mx-auto">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-10">Network Core Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Brand Name</label>
                <input type="text" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={localSettings.siteName} onChange={(e) => setLocalSettings({...localSettings, siteName: e.target.value})} />
             </div>
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verification Delay (SEC)</label>
                <input type="number" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={localSettings.redirectDelay} onChange={(e) => setLocalSettings({...localSettings, redirectDelay: parseInt(e.target.value) || 0})} />
             </div>
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Stages (STEPS)</label>
                <input type="number" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={localSettings.totalSteps} onChange={(e) => setLocalSettings({...localSettings, totalSteps: parseInt(e.target.value) || 1})} min="1" />
             </div>
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Publisher CPM (₹)</label>
                <input type="number" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={localSettings.cpmRate} onChange={(e) => setLocalSettings({...localSettings, cpmRate: parseInt(e.target.value) || 0})} />
             </div>
          </div>
          <button onClick={handleSave} className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-xl active:scale-95">Update Core Engine</button>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden animate-in shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50 border-b border-slate-200">
                <th className="px-10 py-8">PUBLISHER IDENTITY</th>
                <th className="px-10 py-8">WALLET BALANCE</th>
                <th className="px-10 py-8 text-right">OPERATIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registeredUsers.length > 0 ? registeredUsers.map(u => (
                <tr key={u.profile.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-10 py-10 text-slate-900 font-bold text-lg">{u.profile.email}</td>
                  <td className="px-10 py-10 font-black text-green-600 text-xl">₹{(u.profile.balance || 0).toFixed(2)}</td>
                  <td className="px-10 py-10 text-right">
                    <button onClick={() => window.open(localSettings.telegramBotUrl, '_blank')} className="text-[10px] font-black uppercase tracking-widest text-indigo-600 border-2 border-indigo-600 px-6 py-3 rounded-xl transition hover:bg-indigo-600 hover:text-white">Process Payout</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={3} className="px-10 py-24 text-center text-slate-300 font-black uppercase tracking-[0.3em]">Database Empty</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
