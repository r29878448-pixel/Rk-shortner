
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Link as LinkIcon,
  Menu,
  Shield,
  ChevronLeft,
  Globe,
  Code,
  Copy,
  Check,
  Key
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
  const [isResultCopied, setIsResultCopied] = useState(false);
  const [isKeyCopied, setIsKeyCopied] = useState(false);
  const [isUrlCopied, setIsUrlCopied] = useState(false);
  const [sessionUser, setSessionUser] = useState<User | null>(null);

  useEffect(() => {
    // For UI display, get the logged-in user
    const storedUserString = localStorage.getItem('swiftlink_user');
    setSessionUser(storedUserString ? JSON.parse(storedUserString) : null);

    const params = new URLSearchParams(location.search);
    const apiToken = params.get('api');
    const targetUrl = params.get('url');

    if (!apiToken || !targetUrl) return;

    // AUTH LOGIC: Search "database" for user matching this token
    const allRegistered = JSON.parse(localStorage.getItem('swiftlink_registered_users') || '[]');
    const matchingUser = allRegistered.find((u: any) => u.profile.apiKey === apiToken);

    if (matchingUser) {
      const shortCode = Math.random().toString(36).substring(2, 9);
      const newLink = {
        id: Math.random().toString(36).substring(7),
        userId: matchingUser.profile.id,
        originalUrl: targetUrl,
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
      setError('AUTH_ERROR: Invalid API Token. Ensure you are using your Secret Key.');
    }
  }, [location]);

  const copyKey = () => {
    if (sessionUser?.apiKey) {
      navigator.clipboard.writeText(sessionUser.apiKey);
      setIsKeyCopied(true);
      setTimeout(() => setIsKeyCopied(false), 2000);
    }
  };

  const copyEndpoint = () => {
    const endpoint = `${window.location.origin}${window.location.pathname.split('#')[0]}api?api=${sessionUser?.apiKey || 'YOUR_API_TOKEN'}&url=YOUR_URL`;
    navigator.clipboard.writeText(endpoint);
    setIsUrlCopied(true);
    setTimeout(() => setIsUrlCopied(false), 2000);
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setIsResultCopied(true);
      setTimeout(() => setIsResultCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white">
      <div className="max-w-3xl w-full bg-white/5 border border-white/10 p-10 md:p-16 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
        <div className="flex flex-col items-center mb-12">
           <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-6">
             <Key className="w-10 h-10" />
           </div>
           <h2 className="text-4xl font-black uppercase tracking-tighter">Developer API</h2>
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-4">API Token Authentication</p>
        </div>

        {error && <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-[10px] font-black text-center mb-8 uppercase tracking-widest">{error}</div>}
        
        {result ? (
          <div className="space-y-6 text-center animate-in">
            <div className="text-left mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Successfully Shortened</p>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl font-mono text-indigo-300 text-sm break-all border border-white/5 flex items-center justify-between gap-4">
              <span className="truncate">{result}</span>
              <button onClick={copyResult} className="shrink-0 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition">
                {isResultCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <button onClick={copyResult} className="w-full py-6 bg-white text-slate-900 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl active:scale-95 transition">
              {isResultCopied ? 'Copied' : 'Copy Short Link'}
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-end px-1">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Your API Token</p>
                {sessionUser && <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded">Active</span>}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-grow bg-slate-800 p-6 rounded-2xl font-mono text-indigo-100 text-sm border border-white/10 overflow-hidden truncate">
                  {sessionUser ? sessionUser.apiKey : 'Login required'}
                </div>
                {sessionUser && (
                  <button onClick={copyKey} className="flex items-center gap-3 px-6 py-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all active:scale-95">
                    {isKeyCopied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-slate-300" />}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Relay Endpoint (GET)</p>
              <div className="relative group">
                <div className="bg-black/40 p-6 md:p-8 rounded-2xl border border-white/5 font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-nowrap">
                  <span className="text-green-400 font-bold mr-3">GET</span> 
                  {window.location.origin}{window.location.pathname.split('#')[0]}api?api=
                  <span className="text-indigo-400 font-bold">{sessionUser ? sessionUser.apiKey : 'TOKEN'}</span>
                  &url=<span className="text-indigo-400 font-bold">URL</span>
                </div>
                <button onClick={copyEndpoint} className="absolute top-4 right-4 flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all active:scale-95 group">
                  <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline text-slate-400 group-hover:text-white">Copy URL</span>
                  {isUrlCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-500 group-hover:text-white" />}
                </button>
              </div>
            </div>
          </div>
        )}

        <button onClick={() => navigate('/')} className="w-full mt-12 text-slate-500 hover:text-white transition text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center group">
          <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
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
              <RouterLink to="/api" className="text-[11px] font-black text-slate-600 hover:text-indigo-600 uppercase tracking-[0.2em] transition">API</RouterLink>
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
