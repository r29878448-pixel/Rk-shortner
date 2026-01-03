
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
  Plus,
  X,
  Zap,
  Cpu,
  Terminal,
  CreditCard,
  UserCheck,
  Users as UsersIcon,
  MessageCircle,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { User, SiteSettings, UserRole, Link as LinkType, ClickEvent, SubscriptionPlan } from '../types.ts';

interface AdminDashboardProps {
  user: User | null;
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, settings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'links' | 'ads' | 'api' | 'plans' | 'users'>('analytics');
  
  const [localSettings, setLocalSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('swiftlink_settings');
    const base = saved ? JSON.parse(saved) : settings;
    return {
      ...base,
      cpmRate: base.cpmRate || settings.cpmRate
    };
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

  const totalOwed = useMemo(() => {
    return registeredUsers.reduce((sum, u) => sum + (u.profile.balance || 0), 0);
  }, [registeredUsers]);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    localStorage.setItem('swiftlink_settings', JSON.stringify(localSettings));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleUpdateUserPlan = (userId: string, newPlan: SubscriptionPlan) => {
    const updatedUsers = registeredUsers.map(u => {
      if (u.profile.id === userId) {
        return { ...u, profile: { ...u.profile, plan: newPlan, pendingUpgrade: undefined } };
      }
      return u;
    });
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('swiftlink_registered_users', JSON.stringify(updatedUsers));
    alert(`User plan updated to ${newPlan}`);
  };

  if (!user || user.role !== UserRole.ADMIN) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center uppercase tracking-tighter">
            <ShieldCheck className="w-10 h-10 mr-4 text-indigo-600" /> Network Hub
          </h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em] mt-2">Central Monetization Node</p>
        </div>
        
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-xl overflow-x-auto no-scrollbar">
          {[
            { id: 'analytics', label: 'Stats', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
            { id: 'users', label: 'Analytics', icon: <UsersIcon className="w-4 h-4 mr-2" /> },
            { id: 'plans', label: 'Global CPM', icon: <Settings className="w-4 h-4 mr-2" /> },
            { id: 'ads', label: 'Ad Codes', icon: <Globe className="w-4 h-4 mr-2" /> },
            { id: 'api', label: 'System', icon: <Terminal className="w-4 h-4 mr-2" /> }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {success && (
        <div className="mb-10 p-6 bg-green-600 text-white rounded-2xl font-black text-sm flex items-center shadow-2xl animate-in">
          <CheckCircle className="w-6 h-6 mr-4" /> System Updated Successfully
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in">
          <div className="bg-white border border-slate-200 p-10 rounded-[2rem] shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.3em]">Network Hits</p>
             <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{clickEvents.length}</h3>
          </div>
          <div className="bg-white border border-slate-200 p-10 rounded-[2rem] shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.3em]">Total Owed</p>
             <h3 className="text-4xl font-black text-red-500 tracking-tighter">₹{totalOwed.toFixed(2)}</h3>
          </div>
          <div className="bg-white border border-slate-200 p-10 rounded-[2rem] shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.3em]">Publishers</p>
             <h3 className="text-4xl font-black text-indigo-600 tracking-tighter">{registeredUsers.length}</h3>
          </div>
          <div className="bg-white border border-slate-200 p-10 rounded-[2rem] shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.3em]">Global CPM</p>
             <h3 className="text-4xl font-black text-slate-900 tracking-tighter">₹{localSettings.cpmRate}</h3>
          </div>
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-slate-200 shadow-sm animate-in">
          <h2 className="text-3xl font-black mb-12 uppercase tracking-tighter text-slate-900 flex items-center">
             <TrendingUp className="w-8 h-8 mr-4 text-indigo-600" /> Revenue Controls
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Network CPM Rate (₹)</label>
              <input type="number" className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-black focus:border-indigo-500 outline-none transition" value={localSettings.cpmRate} onChange={(e) => setLocalSettings({ ...localSettings, cpmRate: parseInt(e.target.value) || 0 })} />
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">User earnings = (clicks * CPM) / 1000</p>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Telegram Payout Bot</label>
              <input type="text" className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black focus:border-indigo-500 outline-none transition" value={localSettings.telegramBotUrl} onChange={(e) => setLocalSettings({ ...localSettings, telegramBotUrl: e.target.value })} />
            </div>
          </div>
          <button onClick={handleSave} className="w-full py-8 bg-indigo-600 text-white rounded-3xl font-black uppercase text-sm tracking-widest shadow-2xl hover:bg-indigo-700 transition">
            Apply Global Monetization Update
          </button>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm animate-in overflow-hidden">
          <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <h2 className="text-xl font-black uppercase tracking-tight">Publisher Analytics & Balances</h2>
             <Wallet className="w-6 h-6 text-slate-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50 border-b border-slate-100">
                  <th className="px-10 py-6">Publisher</th>
                  <th className="px-10 py-6">Total Hits</th>
                  <th className="px-10 py-6">Total Balance</th>
                  <th className="px-10 py-6">Upgrade Tier</th>
                  <th className="px-10 py-6 text-right">Payout Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {registeredUsers.map(u => {
                  const userLinks = links.filter(l => l.userId === u.profile.id);
                  const userClicks = userLinks.reduce((s, l) => s + (l.clicks || 0), 0);
                  const userBalance = (userClicks * localSettings.cpmRate) / 1000;
                  
                  return (
                    <tr key={u.profile.id} className="hover:bg-slate-50 transition">
                      <td className="px-10 py-8">
                        <p className="font-bold text-slate-900">{u.profile.email}</p>
                        <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black">ID: {u.profile.id}</p>
                      </td>
                      <td className="px-10 py-8 font-black text-slate-900 text-xl">{userClicks}</td>
                      <td className="px-10 py-8 font-black text-red-600 text-xl">₹{userBalance.toFixed(2)}</td>
                      <td className="px-10 py-8">
                        <span className="text-[9px] font-black px-3 py-1 bg-slate-100 rounded-full uppercase tracking-widest">{u.profile.plan}</span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button onClick={() => window.open(`${localSettings.telegramBotUrl}?text=Payout%20Request%20for%20${u.profile.email}%20Amount:%20₹${userBalance.toFixed(2)}`, '_blank')} className="text-[9px] font-black uppercase tracking-widest px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-black transition">
                          Process Payout
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
