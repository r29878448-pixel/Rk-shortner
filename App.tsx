
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Link as LinkIcon,
  Menu,
  X,
  Shield,
  Terminal,
  Cpu,
  ChevronLeft,
  Wallet,
  Globe,
  Code,
  Copy,
  Check
} from 'lucide-react';
import { User, SiteSettings, UserRole } from './types.ts';
import { DEFAULT_SETTINGS } from './constants.tsx';

// Views
import HomePage from './views/HomePage.tsx';
import AdminDashboard from './views/AdminDashboard.tsx';
import UserDashboard from './views/UserDashboard.tsx';
import RedirectFlow from './views/RedirectFlow.tsx';
import LoginPage from './views/LoginPage.tsx';
import BlogPage from './views/BlogPage.tsx';

const ApiHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isKeyCopied, setIsKeyCopied] = useState(false);
  const [isUrlCopied, setIsUrlCopied] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUserString = localStorage.getItem('swiftlink_user');
    const currentUser = storedUserString ? JSON.parse(storedUserString) : null;
    setUser(currentUser);

    const params = new URLSearchParams(location.search);
    const api = params.get('api');
    const url = params.get('url');

    if (!api && !url) return;

    if (api && url) {
      if (!currentUser || currentUser.apiKey !== api) {
        setError('AUTH_ERROR: Invalid API Token.');
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
      
      const existing = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
      localStorage.setItem('swiftlink_global_links', JSON.stringify([newLink, ...existing]));
      const baseUrl = window.location.origin + window.location.pathname.split('#')[0];
      const finalResult = `${baseUrl}#/s/${shortCode}`;
      setResult(finalResult);
    } else {
      setError('PARAM_ERROR: both "api" and "url" are required.');
    }
  }, [location, navigate]);

  const copyKey = () => {
    if (user?.apiKey) {
      navigator.clipboard.writeText(user.apiKey);
      setIsKeyCopied(true);
      setTimeout(() => setIsKeyCopied(false), 2000);
    }
  };

  const copyEndpoint = () => {
    const endpoint = `${window.location.origin}${window.location.pathname.split('#')[0]}api?api=${user?.apiKey || 'YOUR_API_KEY'}&url=YOUR_URL`;
    navigator.clipboard.writeText(endpoint);
    setIsUrlCopied(true);
    setTimeout(() => setIsUrlCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white">
      <div className="max-w-3xl w-full bg-white/5 border border-white/10 p-10 md:p-16 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
        <div className="flex flex-col items-center mb-12">
           <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-6">
             <Code className="w-10 h-10" />
           </div>
           <h2 className="text-4xl font-black uppercase tracking-tighter">Developer Hub</h2>
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Programmatic Link Management</p>
        </div>

        {error && <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-[10px] font-black text-center mb-8 uppercase tracking-widest">{error}</div>}
        
        {result ? (
          <div className="space-y-6 text-center animate-in">
            <div className="bg-slate-800 p-8 rounded-2xl font-mono text-indigo-300 text-sm break-all border border-white/5">
              {result}
            </div>
            <button onClick={() => { navigator.clipboard.writeText(result || ''); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }} className="w-full py-6 bg-white text-slate-900 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl active:scale-95 transition">
              {isCopied ? 'Result Copied' : 'Copy Result'}
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* API KEY SECTION */}
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Your Private Access Key</p>
              <div className="flex items-center gap-4">
                <div className="flex-grow bg-slate-800 p-5 rounded-2xl font-mono text-indigo-100 text-xs border border-white/5 overflow-hidden truncate">
                  {user ? user.apiKey : 'Login to view API Key'}
                </div>
                {user && (
                  <button onClick={copyKey} className="p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all active:scale-90 group">
                    {isKeyCopied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-slate-300 group-hover:text-white" />}
                  </button>
                )}
              </div>
            </div>

            {/* ENDPOINT SECTION */}
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Endpoint Structure</p>
              <div className="relative group">
                <div className="bg-black/40 p-6 md:p-8 rounded-2xl border border-white/5 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
                  <span className="text-green-400">GET</span> {window.location.origin}{window.location.pathname.split('#')[0]}api?api=<span className="text-indigo-400">{user ? user.apiKey : 'YOUR_KEY'}</span>&url=<span className="text-indigo-400">YOUR_URL</span>
                </div>
                <button onClick={copyEndpoint} className="absolute top-4 right-4 p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all active:scale-90 group">
                  {isUrlCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-500 group-hover:text-white" />}
                </button>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest text-center leading-relaxed">
                Send a GET request to shorten links automatically from your application or script.
              </p>
            </div>
          </div>
        )}

        <button onClick={() => navigate('/')} className="w-full mt-12 text-slate-500 hover:text-white transition text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </button>
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

  useEffect(() => { setIsMenuOpen(false); }, [location]);

  if (isRedirectPage) return <>{children}</>;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-[1000] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <RouterLink to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg"><LinkIcon className="text-white w-5 h-5" /></div>
                <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{settings.siteName}</span>
              </RouterLink>
            </div>
            
            <div className="hidden md:flex items-center space-x-10">
              <RouterLink to="/" className="text-[11px] font-black text-slate-600 hover:text-indigo-600 uppercase tracking-[0.2em] transition">Shorten</RouterLink>
              <RouterLink to="/api" className="text-[11px] font-black text-slate-600 hover:text-indigo-600 uppercase tracking-[0.2em] flex items-center transition">API</RouterLink>
              <RouterLink to="/blog" className="text-[11px] font-black text-slate-600 hover:text-indigo-600 uppercase tracking-[0.2em] transition">Blog</RouterLink>
              
              {currentUser ? (
                <div className="flex items-center space-x-6 border-l pl-10 border-slate-200">
                  <RouterLink to={currentUser.role === UserRole.ADMIN ? "/admin" : "/dashboard"} className="text-[11px] font-black text-white bg-slate-900 px-6 py-3 rounded-xl uppercase tracking-widest shadow-xl">Dashboard</RouterLink>
                  <button onClick={handleLogout} className="text-[11px] font-black text-red-500 hover:text-red-700 uppercase tracking-widest transition">Logout</button>
                </div>
              ) : (
                <RouterLink to="/login" className="text-[11px] font-black text-slate-900 border-2 border-slate-900 px-6 py-3 rounded-xl uppercase tracking-widest hover:bg-slate-900 hover:text-white transition">Login</RouterLink>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-900 p-2 bg-slate-50 rounded-xl"><Menu className="w-7 h-7" /></button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-20 bottom-0 z-[999] bg-white border-t border-slate-100 p-6 space-y-4 animate-in">
            <RouterLink to="/" className="block p-5 bg-slate-50 rounded-xl text-[12px] font-black uppercase tracking-widest text-slate-900">Shorten</RouterLink>
            <RouterLink to="/api" className="block p-5 bg-slate-50 rounded-xl text-[12px] font-black uppercase tracking-widest text-slate-900">API Documentation</RouterLink>
            <RouterLink to="/blog" className="block p-5 bg-slate-50 rounded-xl text-[12px] font-black uppercase tracking-widest text-slate-900">Blog</RouterLink>
            <div className="pt-8 border-t border-slate-100 space-y-4">
              {currentUser ? (
                <>
                  <RouterLink to={currentUser.role === UserRole.ADMIN ? "/admin" : "/dashboard"} className="block p-5 bg-slate-900 text-white text-center rounded-xl text-[12px] font-black uppercase tracking-widest">Dashboard</RouterLink>
                  <button onClick={handleLogout} className="w-full p-5 text-center text-[12px] font-black text-red-500 uppercase tracking-widest">Logout</button>
                </>
              ) : (
                <RouterLink to="/login" className="block p-5 bg-slate-900 text-white text-center rounded-xl text-[12px] font-black uppercase tracking-widest">Login</RouterLink>
              )}
            </div>
          </div>
        )}
      </nav>
      <main className="flex-grow">{children}</main>
      <footer className="bg-slate-900 py-12 px-4 text-center">
         <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">© 2026 {settings.siteName} Hub.</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const storedSettings = localStorage.getItem('swiftlink_settings');
    if (!storedSettings) {
      localStorage.setItem('swiftlink_settings', JSON.stringify(DEFAULT_SETTINGS));
      setSettings(DEFAULT_SETTINGS);
    } else {
      setSettings(JSON.parse(storedSettings));
    }
    const storedUser = localStorage.getItem('swiftlink_user');
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
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
