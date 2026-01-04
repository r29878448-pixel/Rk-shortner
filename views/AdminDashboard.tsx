
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle,
  Globe,
  BarChart3,
  Users as UsersIcon,
  Settings
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
            <ShieldCheck className="w-10 h-10 mr-4 text-indigo-600" /> Admin Core
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Network Infrastructure Management</p>
        </div>
        
        <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
          {[
            { id: 'analytics', label: 'Stats', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
            { id: 'users', label: 'Users', icon: <UsersIcon className="w-4 h-4 mr-2" /> },
            { id: 'ads', label: 'Ads', icon: <Globe className="w-4 h-4 mr-2" /> },
            { id: 'system', label: 'System', icon: <Settings className="w-4 h-4 mr-2" /> }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {success && <div className="mb-12 p-6 bg-green-600 text-white rounded-xl font-black text-sm flex items-center animate-in shadow-xl"><CheckCircle className="w-6 h-6 mr-4" /> Global Settings Updated</div>}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in">
          <div className="bg-white border p-10 rounded-xl shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Global Hits</p>
             <h3 className="text-4xl font-black text-slate-900">{clickEvents.length}</h3>
          </div>
          <div className="bg-white border p-10 rounded-xl shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Total Publishers</p>
             <h3 className="text-4xl font-black text-indigo-600">{registeredUsers.length}</h3>
          </div>
          <div className="bg-white border p-10 rounded-xl shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">CPM Rate</p>
             <h3 className="text-4xl font-black text-slate-900">₹{localSettings.cpmRate}</h3>
          </div>
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="bg-white rounded-xl p-10 border shadow-sm animate-in">
           <h2 className="text-2xl font-black uppercase tracking-tighter mb-10">Global Ad Injections</h2>
           <div className="space-y-8 mb-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Header Slot (Top Ad)</label>
                <textarea className="w-full h-32 p-4 bg-slate-900 text-indigo-300 font-mono text-xs rounded-xl border border-white/10" value={localSettings.adSlots.top} onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, top: e.target.value}})} />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Middle Slot (Inline Ad)</label>
                <textarea className="w-full h-32 p-4 bg-slate-900 text-indigo-300 font-mono text-xs rounded-xl border border-white/10" value={localSettings.adSlots.middle} onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, middle: e.target.value}})} />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Footer Slot (Bottom Ad)</label>
                <textarea className="w-full h-32 p-4 bg-slate-900 text-indigo-300 font-mono text-xs rounded-xl border border-white/10" value={localSettings.adSlots.bottom} onChange={(e) => setLocalSettings({...localSettings, adSlots: {...localSettings.adSlots, bottom: e.target.value}})} />
              </div>
           </div>
           <button onClick={handleSave} className="w-full py-6 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all">Update Ad Matrix</button>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="bg-white rounded-xl p-10 border shadow-sm animate-in">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-10">System Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Site Name</label>
                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={localSettings.siteName} onChange={(e) => setLocalSettings({...localSettings, siteName: e.target.value})} />
             </div>
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Redirect Delay (Seconds)</label>
                <input type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={localSettings.redirectDelay} onChange={(e) => setLocalSettings({...localSettings, redirectDelay: parseInt(e.target.value) || 0})} />
             </div>
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Steps (Pages)</label>
                <input type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={localSettings.totalSteps} onChange={(e) => setLocalSettings({...localSettings, totalSteps: parseInt(e.target.value) || 1})} min="1" />
             </div>
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">CPM Rate (₹)</label>
                <input type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={localSettings.cpmRate} onChange={(e) => setLocalSettings({...localSettings, cpmRate: parseInt(e.target.value) || 0})} />
             </div>
          </div>
          <button onClick={handleSave} className="w-full py-6 bg-indigo-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all">Update Core Logic</button>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-in">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border-b border-slate-200">
                <th className="px-10 py-6">Publisher</th>
                <th className="px-10 py-6">Balance</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registeredUsers.length > 0 ? registeredUsers.map(u => (
                <tr key={u.profile.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-10 py-8 text-slate-900 font-bold">{u.profile.email}</td>
                  <td className="px-10 py-8 font-black text-green-600">₹{(u.profile.balance || 0).toFixed(2)}</td>
                  <td className="px-10 py-8 text-right">
                    <button onClick={() => window.open(localSettings.telegramBotUrl, '_blank')} className="text-[10px] font-black uppercase tracking-widest text-indigo-600 border border-indigo-600 px-4 py-2 rounded-xl">Payout</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={3} className="px-10 py-20 text-center text-slate-300 font-black uppercase">No Publishers Registered</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
