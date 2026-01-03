
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Link as RouterLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- Configuration & Constants ---
const DEFAULT_SETTINGS = {
  totalSteps: 3,
  timerDuration: 15,
  adSlots: {
    top: '<div class="bg-slate-50 border-2 border-dashed border-slate-200 h-32 flex items-center justify-center rounded-3xl text-[10px] font-black text-slate-400 tracking-widest uppercase">728x90 Leaderboard Ad</div>',
    middle: '<div class="bg-slate-50 border-2 border-dashed border-slate-200 h-96 flex items-center justify-center rounded-[3rem] text-[10px] font-black text-slate-400 tracking-widest uppercase">300x600 Vertical / Content Ad</div>',
    bottom: '<div class="bg-slate-50 border-2 border-dashed border-slate-200 h-48 flex items-center justify-center rounded-3xl text-[10px] font-black text-slate-400 tracking-widest uppercase">Sticky Footer / Bottom Ad</div>'
  }
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Components ---

const Navbar = ({ user, onLogout }: any) => {
  const loc = useLocation();
  return (
    <nav className="glass border-b border-slate-200/60 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <RouterLink to="/" className="flex items-center space-x-3 group">
          <div className="w-11 h-11 gradient-bg rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform">
            <Lucide.Link2 className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">SWIFTLINK</span>
        </RouterLink>
        <div className="flex items-center space-x-8">
          <RouterLink to="/" className={`text-sm font-bold ${loc.pathname === '/' ? 'text-indigo-600' : 'text-slate-400'}`}>Tools</RouterLink>
          {user ? (
            <>
              <RouterLink to="/admin" className="text-sm font-bold text-slate-700 flex items-center"><Lucide.ShieldCheck className="w-4 h-4 mr-1"/> Panel</RouterLink>
              <button onClick={onLogout} className="text-sm font-bold text-red-500">Exit</button>
            </>
          ) : (
            <RouterLink to="/login" className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition">Login</RouterLink>
          )}
        </div>
      </div>
    </nav>
  );
};

const HomePage = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShorten = (e: any) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const code = Math.random().toString(36).substring(2, 8);
      const link = { id: Date.now(), shortCode: code, originalUrl: url, createdAt: new Date() };
      const saved = JSON.parse(localStorage.getItem('swiftlink_db') || '[]');
      localStorage.setItem('swiftlink_db', JSON.stringify([link, ...saved]));
      setResult(link);
      setLoading(false);
    }, 800);
  };

  const shareUrl = result ? `${window.location.origin}${window.location.pathname}#/s/${result.shortCode}` : '';

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-32">
      <div className="text-center mb-16">
        <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-indigo-100 mb-8">Next-Gen Link Monetization</div>
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-10">Shorten. Protect. <br/><span className="text-indigo-600">Earn.</span></h1>
        <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium leading-relaxed">SwiftLink is a premium URL shortening engine designed for high-conversion multi-page verification flows.</p>
      </div>

      <div className="bg-white p-4 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-4 mb-16 max-w-3xl mx-auto">
        <input 
          type="url" required value={url} onChange={e => setUrl(e.target.value)}
          placeholder="Paste your long destination URL..."
          className="flex-grow px-8 py-5 rounded-[2rem] bg-slate-50 text-lg focus:outline-none border-none font-medium"
        />
        <button onClick={handleShorten} disabled={loading} className="gradient-bg text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:scale-105 transition transform shadow-xl shadow-indigo-100 disabled:opacity-50">
          {loading ? <Lucide.Loader2 className="animate-spin w-7 h-7" /> : 'Create Link'}
        </button>
      </div>

      {result && (
        <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white animate-fade-in relative overflow-hidden shadow-2xl max-w-4xl mx-auto">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Your Shortened Link Is Active</p>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-white/5 p-6 rounded-3xl flex-grow font-mono text-indigo-300 border border-white/10 truncate w-full text-xl">
                {shareUrl}
              </div>
              <button 
                onClick={() => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }} 
                className="bg-white text-slate-900 px-10 py-6 rounded-3xl font-black text-xl hover:bg-slate-100 transition shrink-0 shadow-lg"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 gradient-bg blur-[120px] opacity-20 -mr-40 -mt-40"></div>
        </div>
      )}
    </div>
  );
};

const LoginPage = ({ onAuth }: any) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const nav = useNavigate();

  // Updated Admin Credentials
  const MASTER_EMAIL = 'admin@swiftlink.pro';
  const MASTER_PASS = 'admin786';

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (email === MASTER_EMAIL && pass === MASTER_PASS) {
      const u = { email, role: 'ADMIN' };
      localStorage.setItem('swiftlink_u', JSON.stringify(u));
      onAuth(u);
      nav('/admin');
    } else {
      alert('Invalid admin credentials.');
    }
  };

  const autoFill = () => {
    setEmail(MASTER_EMAIL);
    setPass(MASTER_PASS);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="bg-white p-6 mb-8 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full flex flex-col items-center text-center">
        <Lucide.Zap className="text-amber-500 w-6 h-6 mb-2" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Quick Access Mode</p>
        <button 
          onClick={autoFill}
          className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 transition"
        >
          Auto-fill Credentials
        </button>
      </div>

      <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl border border-slate-100 max-w-md w-full text-center">
        <div className="w-20 h-20 gradient-bg rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl">
          <Lucide.ShieldCheck className="text-white w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">System Login</h2>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-10">Restricted Access Dashboard</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900" placeholder="Email" required />
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900" placeholder="Password" required />
          <button type="submit" className="w-full py-5 gradient-bg text-white rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] transition">Access Terminal</button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = ({ user, settings, onUpdateSettings }: any) => {
  const [local, setLocal] = useState(settings);
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    setLinks(JSON.parse(localStorage.getItem('swiftlink_db') || '[]'));
  }, []);

  if (!user) return <div className="p-20 text-center font-black text-slate-200 text-7xl opacity-10 uppercase select-none">Unauthorized</div>;

  const save = () => {
    onUpdateSettings(local);
    localStorage.setItem('swiftlink_s', JSON.stringify(local));
    alert('Global settings synchronized.');
  };

  const del = (id: any) => {
    const up = links.filter(l => l.id !== id);
    setLinks(up);
    localStorage.setItem('swiftlink_db', JSON.stringify(up));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Platform Configuration</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Manage global redirection and monetization</p>
        </div>
        <button onClick={save} className="px-10 py-5 gradient-bg text-white rounded-2xl font-black shadow-2xl hover:scale-105 transition">Update Master Config</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
        <div className="lg:col-span-2 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-2xl font-black mb-10 flex items-center"><Lucide.Timer className="w-6 h-6 mr-3 text-indigo-600" /> Redirect Engine</h2>
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-black text-slate-900">Step Multiplier</p>
                <p className="text-sm text-slate-400 font-medium">Number of verification pages per link.</p>
              </div>
              <input type="number" className="w-24 p-4 bg-slate-50 rounded-2xl font-black text-center border-none" value={local.totalSteps} onChange={e => setLocal({...local, totalSteps: parseInt(e.target.value) || 1})} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-black text-slate-900">Wait Duration (Seconds)</p>
                <p className="text-sm text-slate-400 font-medium">User dwell time per verification page.</p>
              </div>
              <input type="number" className="w-24 p-4 bg-slate-50 rounded-2xl font-black text-center border-none" value={local.timerDuration} onChange={e => setLocal({...local, timerDuration: parseInt(e.target.value) || 15})} />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <Lucide.Activity className="text-indigo-400 w-10 h-10 mb-8" />
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Platform Inventory</p>
            <div className="text-7xl font-black tracking-tighter">{links.length} <span className="text-xl text-slate-600 block">Links Active</span></div>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 gradient-bg blur-[80px] opacity-20 -mr-24 -mt-24"></div>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50 font-black text-xl">Active URL Repository</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-10 py-6">Short Alias</th>
                <th className="px-10 py-6">Destination</th>
                <th className="px-10 py-6 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {links.map(l => (
                <tr key={l.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-10 py-6 font-black text-indigo-600">/{l.shortCode}</td>
                  <td className="px-10 py-6 text-slate-400 text-sm font-medium truncate max-w-md">{l.originalUrl}</td>
                  <td className="px-10 py-6 text-right">
                    <button onClick={() => del(l.id)} className="text-red-500 hover:bg-red-50 px-5 py-2 rounded-xl transition font-black text-xs uppercase tracking-tighter">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {links.length === 0 && <div className="p-24 text-center text-slate-300 italic font-medium">The database is currently empty.</div>}
        </div>
      </div>
    </div>
  );
};

const RedirectFlow = ({ settings }: any) => {
  const { shortCode } = useParams();
  const [link, setLink] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isFinal, setIsFinal] = useState(false);
  const [timer, setTimer] = useState(settings.timerDuration);
  const [verifyStarted, setVerifyStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const bottomAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const links = JSON.parse(localStorage.getItem('swiftlink_db') || '[]');
    const found = links.find((l: any) => l.shortCode === shortCode);
    if (found) {
      setLink(found);
      setTimeout(() => setLoading(false), 1200);
    }
  }, [shortCode]);

  useEffect(() => {
    if (verifyStarted && timer > 0) {
      const interval = setInterval(() => setTimer((v: number) => v - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [verifyStarted, timer]);

  const handleStartVerify = () => {
    setVerifyStarted(true);
    bottomAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNextStep = () => {
    if (timer > 0) return;
    if (currentStep < settings.totalSteps) {
      setCurrentStep(prev => prev + 1);
      setTimer(settings.timerDuration);
      setVerifyStarted(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsFinal(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Lucide.Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-6" />
      <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Resolving Path...</h2>
      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">SwiftLink Secure Cloud</p>
    </div>
  );

  if (!link) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white p-16 rounded-[4rem] shadow-2xl text-center border">
        <Lucide.Ghost className="w-20 h-20 text-slate-200 mx-auto mb-10" />
        <h2 className="text-3xl font-black text-slate-900 mb-2">404 - Link Expired</h2>
        <p className="text-slate-400 font-medium mb-10 leading-relaxed">The link you are looking for has been purged or disabled by the administrator.</p>
        <RouterLink to="/" className="block py-5 gradient-bg text-white rounded-3xl font-black text-xl shadow-2xl">Return Home</RouterLink>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-40">
      {/* Premium Verification Bar */}
      <div className="bg-indigo-600 text-white py-5 px-8 sticky top-0 z-[100] shadow-2xl flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-4">
          <Lucide.ShieldCheck className="w-6 h-6 text-indigo-200" />
          <span className="text-xs font-black uppercase tracking-[0.2em] opacity-90">
            {isFinal ? 'Security Clearance Granted' : `Security Verification: ${currentStep} of ${settings.totalSteps}`}
          </span>
        </div>
        {!isFinal && verifyStarted && (
          <div className="bg-white text-indigo-600 px-6 py-2 rounded-2xl font-black text-xl shadow-lg animate-pulse">
            {timer}s
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-12">
        {/* TOP AD SLOT */}
        <div className="mb-12" dangerouslySetInnerHTML={{ __html: settings.adSlots.top }} />

        <div className="bg-white rounded-[4rem] p-12 md:p-24 shadow-2xl border border-slate-100 relative overflow-hidden text-center min-h-[60vh] flex flex-col items-center justify-center">
          {!isFinal ? (
            <div className="animate-fade-in w-full">
              <div className="inline-flex items-center px-4 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest mb-10 border border-amber-100">Premium Content Locked</div>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-none">Complete the <br/>Verification.</h2>
              
              {!verifyStarted ? (
                <button 
                  onClick={handleStartVerify}
                  className="mt-10 px-16 py-8 gradient-bg text-white rounded-[3rem] font-black text-3xl shadow-[0_20px_60px_-15px_rgba(79,70,229,0.5)] hover:scale-105 transition transform flex items-center justify-center mx-auto"
                >
                  CLICK TO VERIFY <Lucide.ArrowDown className="ml-4 w-8 h-8 animate-bounce" />
                </button>
              ) : (
                <div className="mt-12 text-slate-500 text-xl font-medium max-w-xl mx-auto leading-relaxed">
                  Excellent. Please scroll down to the bottom of the page to find the next step button. 
                  Verification is running in the background.
                </div>
              )}
              
              {/* MIDDLE AD SLOT */}
              <div className="my-20" dangerouslySetInnerHTML={{ __html: settings.adSlots.middle }} />

              <div className="h-px bg-slate-100 w-full my-20"></div>

              <div className="py-12 flex flex-col items-center">
                <Lucide.Fingerprint className={`w-20 h-20 mb-8 transition-colors ${timer === 0 ? 'text-green-500' : 'text-slate-200'}`} />
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
                  {timer > 0 ? `Bypass Security in ${timer}s` : 'Security Cleared'}
                </p>
                <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full gradient-bg transition-all duration-1000" style={{ width: `${((settings.timerDuration - timer) / settings.timerDuration) * 100}%` }}></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-green-100 border-8 border-white">
                <Lucide.Check className="text-green-500 w-16 h-16" />
              </div>
              <h2 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter">Verified.</h2>
              <p className="text-slate-500 mb-16 text-2xl font-medium max-w-sm mx-auto leading-relaxed">
                You have passed all security steps. Your link is now ready.
              </p>
              
              <a 
                href={link.originalUrl} 
                className="block w-full py-10 gradient-bg text-white rounded-[3.5rem] font-black text-4xl shadow-[0_25px_80px_-20px_rgba(79,70,229,0.6)] hover:scale-[1.03] transition transform flex items-center justify-center"
              >
                GET LINK <Lucide.Zap className="ml-4 w-12 h-12 fill-white" />
              </a>
              <p className="mt-10 text-[11px] font-black uppercase tracking-[0.5em] text-slate-300">SECURE REDIRECTION ENABLED</p>
            </div>
          )}
        </div>

        {/* BOTTOM AD SLOT */}
        <div className="mt-12" dangerouslySetInnerHTML={{ __html: settings.adSlots.bottom }} />

        {/* Dynamic Next Step Trigger at the bottom */}
        {!isFinal && verifyStarted && (
          <div ref={bottomAnchorRef} className="mt-24 text-center pb-24">
            <div className="inline-block p-1 bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 w-full max-w-2xl">
              <button 
                onClick={handleNextStep}
                disabled={timer > 0}
                className={`w-full py-8 rounded-[3rem] font-black text-3xl transition-all shadow-xl transform flex items-center justify-center ${timer === 0 ? 'gradient-bg text-white hover:scale-105 active:scale-95' : 'bg-slate-50 text-slate-300 cursor-not-allowed'}`}
              >
                {timer > 0 ? (
                  <>
                    <Lucide.Clock className="mr-4 w-8 h-8 animate-pulse" /> Wait {timer}s
                  </>
                ) : (
                  <>
                    {currentStep < settings.totalSteps ? 'Continue To Step ' + (currentStep + 1) : 'Continue To Final Link'}
                    <Lucide.ArrowRight className="ml-4 w-9 h-9" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const u = localStorage.getItem('swiftlink_u');
    if (u) setUser(JSON.parse(u));
    const s = localStorage.getItem('swiftlink_s');
    if (s) setSettings(JSON.parse(s));
  }, []);

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} onLogout={() => { localStorage.removeItem('swiftlink_u'); setUser(null); }} />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage onAuth={setUser} />} />
            <Route path="/admin" element={<AdminDashboard user={user} settings={settings} onUpdateSettings={setSettings} />} />
            <Route path="/s/:shortCode" element={<RedirectFlow settings={settings} />} />
          </Routes>
        </div>
        <footer className="p-12 text-center border-t border-slate-200/50 bg-white">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Status: Online</span>
          </div>
          <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">SwiftLink Master Platform • Premium SaaS Edition</p>
        </footer>
      </div>
    </HashRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
