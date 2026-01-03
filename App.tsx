
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Link as LinkIcon,
  Menu,
  X,
  User as UserIcon,
  Shield,
  LayoutDashboard,
  FileText,
  Copy,
  Check,
  ChevronLeft,
  Terminal,
  Zap,
  Cpu,
  ExternalLink,
  CreditCard,
  Wallet
} from 'lucide-react';
import { User, SiteSettings, SubscriptionPlan } from './types.ts';
import { DEFAULT_SETTINGS } from './constants.tsx';

// Views
import HomePage from './views/HomePage.tsx';
import AdminDashboard from './views/AdminDashboard.tsx';
import UserDashboard from './views/UserDashboard.tsx';
import RedirectFlow from './views/RedirectFlow.tsx';
import LoginPage from './views/LoginPage.tsx';
import BlogPage from './views/BlogPage.tsx';
import PricingPage from './views/PricingPage.tsx';

const ApiHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const api = params.get('api');
    const url = params.get('url');

    if (api && url) {
      const storedUserString = localStorage.getItem('swiftlink_user');
      const currentUser = storedUserString ? JSON.parse(storedUserString) : null;
      const settings: SiteSettings = JSON.parse(localStorage.getItem('swiftlink_settings') || JSON.stringify(DEFAULT_SETTINGS));

      if (!currentUser || currentUser.apiKey !== api) {
        setError('AUTH_ERROR: Invalid API Token.');
        return;
      }

      const existing = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
      const userCount = existing.filter((l: any) => l.userId === currentUser.id).length;
      
      let limit = settings.planConfig.freeLimit;
      if (currentUser.plan === SubscriptionPlan.PRO) limit = settings.planConfig.proLimit;
      if (currentUser.plan === SubscriptionPlan.BUSINESS) limit = settings.planConfig.businessLimit;

      if (userCount >= limit) {
        setError('QUOTA_EXCEEDED: Plan limit reached. Upgrade required.');
        return;
      }

      const shortCode = Math.random().toString(36).substring(2, 9);
      const newLink = {
        id: Math.random().toString(36).substring(7),
        userId: currentUser.id,
        originalUrl: url,
        shortCode,
        clicks: 0,
        earnings: 0,
        createdAt: new Date()
      };
      
      localStorage.setItem('swiftlink_global_links', JSON.stringify([newLink, ...existing]));
      const baseUrl = window.location.origin + window.location.pathname.split('#')[0];
      const finalResult = `${baseUrl}#/s/${shortCode}`;
      setResult(finalResult);
    } else if (location.search !== '') {
      setError('PARAM_ERROR: api & url required.');
    }
  }, [location]);

  if (result && location.search.includes('format=raw')) {
    return <div className="api-raw-response">{result}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-2xl w-full bg-white/5 border border-white/10 p-16 rounded-[3rem] backdrop-blur-3xl">
        <div className="flex items-center justify-center space-x-4 mb-12">
           <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <Terminal className="text-white w-8 h-8" />
           </div>
           <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">Relay API</h2>
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">Node Integration</p>
           </div>
        </div>
        {error && <div className="p-8 bg-red-500/10 border border-red-500/20 text-red-400 rounded-3xl text-sm font-bold text-center mb-6">{error}</div>}
        {result ? (
          <div className="space-y-8 text-center animate-in">
            <div className="bg-white/10 p-10 rounded-[2.5rem] border border-white/10 font-mono text-indigo-300 text-lg break-all">{result}</div>
            <button onClick={() => { navigator.clipboard.writeText(result || ''); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }} className="w-full py-6 bg-white text-slate-900 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-2xl active:scale-95 transition">
              {isCopied ? 'Link Copied' : 'Copy API Result'}
            </button>
          </div>
        ) : !error && (
          <div className="text-center py-10 opacity-50">
             <div className="flex justify-center mb-6"><Cpu className="w-12 h-12 text-indigo-500 animate-pulse" /></div>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Waiting for programmatic request...</p>
          </div>
        )}
        <div className="mt-16 pt-10 border-t border-white/5 flex flex-col items-center gap-4">
           <button onClick={() => navigate('/')} className="text-indigo-400 hover:text-white transition text-[11px] font-black uppercase tracking-[0.2em]">
            <ChevronLeft className="w-4 h-4 mr-2" /> Back to Terminal
          </button>
        </div>
      </div>
    </div>
  );
};

interface GlobalLayoutProps {
  children: React.ReactNode;
  settings: SiteSettings;
  currentUser: User | null;
  handleLogout: () => void;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children, settings, currentUser, handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isRedirectPage = location.pathname.startsWith('/s/');
  const isApiPage = location.pathname === '/api';

  if (isRedirectPage || isApiPage) return <>{children}</>;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-[1000] shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <RouterLink to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-100">
                  <LinkIcon className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{settings.siteName}</span>
              </RouterLink>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <RouterLink to="/" className="text-[11px] font-black text-slate-600 hover:text-indigo-600 uppercase tracking-[0.2em] transition">Create</RouterLink>
              <RouterLink to="/blog" className="text-[11px] font-black text-slate-600 hover:text-indigo-600 uppercase tracking-[0.2em] transition">Insights</RouterLink>
              <RouterLink to="/pricing" className="text-[11px] font-black text-slate-600 hover:text-indigo-600 uppercase tracking-[0.2em] transition">Plans</RouterLink>
              
              {currentUser ? (
                <div className="flex items-center space-x-6 border-l pl-8 border-slate-200">
                  {currentUser.role === 'ADMIN' ? (
                    <RouterLink to="/admin" className="text-[11px] font-black text-white bg-indigo-600 px-6 py-3 rounded-xl uppercase tracking-[0.2em] shadow-lg">Network Node</RouterLink>
                  ) : (
                    <RouterLink to="/dashboard" className="text-[11px] font-black text-white bg-slate-900 px-6 py-3 rounded-xl uppercase tracking-[0.2em] shadow-lg flex items-center"><Wallet className="w-3 h-3 mr-2" /> Dashboard</RouterLink>
                  )}
                  <button onClick={handleLogout} className="text-[11px] font-black text-red-500 uppercase tracking-[0.2em] hover:text-red-700 transition">Logout</button>
                </div>
              ) : (
                <RouterLink to="/login" className="text-[11px] font-black text-slate-900 border-2 border-slate-900 px-6 py-3 rounded-xl uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition">Login Area</RouterLink>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-900 p-2">
                {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">{children}</main>
      
      <footer className="bg-slate-900 py-20 px-4 text-center">
         <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-2xl shadow-indigo-500/20">
              <LinkIcon className="text-white w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-white uppercase tracking-tighter">{settings.siteName}</span>
         </div>
         <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] mb-10">Multi-User Monetization Infrastructure</p>
         <div className="pt-10 border-t border-white/5 max-w-xl mx-auto">
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">© 2026 SwiftLink Cloud. Strictly No Ads on Dashboard nodes.</p>
         </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const storedUser = localStorage.getItem('swiftlink_user');
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
    const storedSettings = localStorage.getItem('swiftlink_settings');
    if (storedSettings) setSettings(JSON.parse(storedSettings));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('swiftlink_user');
    setCurrentUser(null);
  };

  return (
    <HashRouter>
      <GlobalLayout settings={settings} currentUser={currentUser} handleLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<HomePage siteName={settings.siteName} settings={settings} currentUser={currentUser} />} />
          <Route path="/login" element={<LoginPage onAuth={setCurrentUser} />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/api" element={<ApiHandler />} />
          <Route path="/dashboard" element={<UserDashboard user={currentUser} />} />
          <Route path="/admin" element={<AdminDashboard user={currentUser} settings={settings} onUpdateSettings={setSettings} />} />
          <Route path="/s/:shortCode" element={<RedirectFlow settings={settings} currentUser={currentUser} />} />
        </Routes>
      </GlobalLayout>
    </HashRouter>
  );
};

export default App;
