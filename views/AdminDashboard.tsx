
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
  Terminal
} from 'lucide-react';
import { User, SiteSettings, UserRole, Link as LinkType, ClickEvent } from '../types.ts';

interface AdminDashboardProps {
  user: User | null;
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, settings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'links' | 'ads' | 'api'>('analytics');
  
  // Strict initialization to prevent Ads tab from "not opening"
  const [localSettings, setLocalSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('swiftlink_settings');
    const base = saved ? JSON.parse(saved) : settings;
    return {
      ...base,
      adSlots: {
        top: base.adSlots?.top || '',
        middle: base.adSlots?.middle || '',
        bottom: base.adSlots?.bottom || '',
        contentAds: base.adSlots?.contentAds || []
      }
    };
  });

  const [success, setSuccess] = useState(false);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [clickEvents, setClickEvents] = useState<ClickEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLinks(JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]'));
    setClickEvents(JSON.parse(localStorage.getItem('swiftlink_click_events') || '[]'));
  }, []);

  const stats = useMemo(() => {
    return {
      totalClicks: clickEvents.length,
      totalLinks: links.length,
      topLink: [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0]
    };
  }, [clickEvents, links]);

  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-2xl text-center max-w-sm">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black uppercase text-slate-900 tracking-tighter">Access Denied</h2>
          <p className="text-slate-500 text-sm mt-3 font-medium">Administrator credentials required.</p>
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

  const addContentAd = () => {
    setLocalSettings(prev => ({
      ...prev,
      adSlots: {
        ...prev.adSlots,
        contentAds: [...(prev.adSlots.contentAds || []), '']
      }
    }));
  };

  const removeContentAd = (index: number) => {
    const newAds = [...localSettings.adSlots.contentAds];
    newAds.splice(index, 1);
    setLocalSettings(prev => ({
      ...prev,
      adSlots: { ...prev.adSlots, contentAds: newAds }
    }));
  };

  const updateContentAd = (index: number, val: string) => {
    const newAds = [...localSettings.adSlots.contentAds];
    newAds[index] = val;
    setLocalSettings(prev => ({
      ...prev,
      adSlots: { ...prev.adSlots, contentAds: newAds }
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center uppercase tracking-tighter">
            <ShieldCheck className="w-10 h-10 mr-4 text-indigo-600" /> Control Hub
          </h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em] mt-2">Network Administration Terminal</p>
        </div>
        
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-xl overflow-x-auto no-scrollbar">
          {[
            { id: 'analytics', label: 'Overview', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
            { id: 'links', label: 'Vault', icon: <LinkIcon className="w-4 h-4 mr-2" /> },
            { id: 'ads', label: 'Ads Manager', icon: <Globe className="w-4 h-4 mr-2" /> },
            { id: 'api', label: 'API Branch', icon: <Terminal className="w-4 h-4 mr-2" /> }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {success && (
        <div className="mb-10 p-6 bg-green-600 text-white rounded-2xl font-black text-sm flex items-center shadow-2xl animate-in">
          <CheckCircle className="w-6 h-6 mr-4" /> System protocol synchronized.
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in">
          <div className="bg-white border border-slate-200 p-12 rounded-[2.5rem] shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.3em]">Total Hits</p>
             <h3 className="text-6xl font-black text-slate-900 tracking-tighter">{stats.totalClicks}</h3>
          </div>
          <div className="bg-white border border-slate-200 p-12 rounded-[2.5rem] shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.3em]">Active Relays</p>
             <h3 className="text-6xl font-black text-slate-900 tracking-tighter">{stats.totalLinks}</h3>
          </div>
          <div className="bg-white border border-slate-200 p-12 rounded-[2.5rem] shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.3em]">Peak Load</p>
             <h3 className="text-2xl font-black text-slate-900 truncate">/s/{stats.topLink?.shortCode || 'N/A'}</h3>
             <span className="text-indigo-600 font-bold text-xs uppercase tracking-widest mt-2 block">{(stats.topLink?.clicks || 0)} Successful Relays</span>
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="space-y-10 animate-in">
          <div className="bg-white border border-slate-200 rounded-[3rem] p-10 md:p-16 shadow-sm">
            <div className="flex items-center mb-10 pb-8 border-b border-slate-100">
              <Cpu className="w-10 h-10 text-indigo-600 mr-5" />
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Branch Integration</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">VP Links Protocol Compatible</p>
              </div>
            </div>
            
            <p className="text-base text-slate-500 mb-12 font-medium leading-relaxed max-w-2xl">
              Use this endpoint to allow other platforms to generate links via your dashboard. 
              The system returns a direct URL that is easily scraped by automated tools.
            </p>

            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">API Endpoint (GET)</label>
                <div className="flex items-center bg-slate-900 rounded-2xl p-6 font-mono text-sm text-indigo-300 shadow-2xl overflow-hidden">
                  <span className="flex-grow truncate mr-6">
                    {window.location.origin + window.location.pathname.split('#')[0]}#/api?api={user.apiKey}&url=YOUR_URL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="space-y-10 animate-in">
          <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-slate-200 shadow-sm">
            <h2 className="text-3xl font-black mb-12 flex items-center uppercase text-slate-900 tracking-tighter">
              <Globe className="w-10 h-10 mr-5 text-indigo-600" /> Ads Architecture
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Header Slot</label>
                <textarea 
                  className="w-full h-32 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-mono focus:border-indigo-500 outline-none transition"
                  value={localSettings.adSlots.top}
                  onChange={(e) => setLocalSettings(prev => ({...prev, adSlots: {...prev.adSlots, top: e.target.value}}))}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Footer Slot</label>
                <textarea 
                  className="w-full h-32 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-mono focus:border-indigo-500 outline-none transition"
                  value={localSettings.adSlots.bottom}
                  onChange={(e) => setLocalSettings(prev => ({...prev, adSlots: {...prev.adSlots, bottom: e.target.value}}))}
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-12">
               <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">Multi-Ad Blog Chain</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Injected across verification stages</p>
                  </div>
                  <button onClick={addContentAd} className="flex items-center px-10 py-5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl">
                    <Plus className="w-5 h-5 mr-3" /> New Content Slot
                  </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {localSettings.adSlots.contentAds.map((ad, idx) => (
                    <div key={idx} className="relative bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200">
                       <button onClick={() => removeContentAd(idx)} className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition">
                         <X className="w-5 h-5" />
                       </button>
                       <label className="text-[10px] font-black uppercase text-slate-400 block mb-4">Ad Node #{idx + 1}</label>
                       <textarea 
                         className="w-full h-40 p-6 bg-white border border-slate-200 rounded-2xl text-xs font-mono focus:border-indigo-500 outline-none transition"
                         value={ad}
                         onChange={(e) => updateContentAd(idx, e.target.value)}
                         placeholder="Paste script/HTML code..."
                       />
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <button onClick={handleSave} className="w-full py-8 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] shadow-2xl active:scale-95 transition">
            Apply Global Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
