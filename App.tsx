
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Link as LinkIcon,
  Menu,
  X,
  Shield,
  ChevronLeft,
  Globe,
  Copy,
  Check,
  Key,
  Terminal,
  Code
} from 'lucide-react';
import { User, SiteSettings, UserRole, Link as LinkType } from './types.ts';
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
  const [apiResult, setApiResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('swiftlink_user');
    setUser(storedUser ? JSON.parse(storedUser) : null);

    const params = new URLSearchParams(location.search);
    const token = params.get('api');
    const targetUrl = params.get('url');

    if (!token || !targetUrl) return;

    // Validate against "database"
    const allUsers = JSON.parse(localStorage.getItem('swiftlink_registered_users') || '[]');
    const matching = allUsers.find((u: any) => u.profile.apiKey === token);

    if (matching) {
      const shortCode = Math.random().toString(36).substring(2, 9);
      const newLink: LinkType = {
        id: Math.random().toString(36).substring(7),
        userId: matching.profile.id,
        originalUrl: targetUrl,
        shortCode,
        clicks: 0,
        earnings: 0,
        createdAt: new Date()
      };
      
      const existing = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
      localStorage.setItem('swiftlink_global_links', JSON.stringify([newLink, ...existing]));
      
      const baseUrl = window.location.origin + window.location.pathname.split('#')[0];
      setApiResult({
        status: "success",
        shortenedUrl: `${baseUrl}#/s/${shortCode}`,
        originalUrl: targetUrl,
        timestamp: new Date().toISOString()
      });
      setError(null);
    } else {
      setError('INVALID_KEY: The API token provided is invalid.');
    }
  }, [location]);

  const copyResult = () => {
    if (apiResult) {
      navigator.clipboard.writeText(apiResult.shortenedUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-white">
      <div className="max-w-2xl w-full">
        {apiResult ? (
          <div className="bg-black/60 p-10 rounded-[2rem] border border-white/10 backdrop-blur-3xl shadow-2xl animate-in">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <Check className="text-green-500 w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">API Success</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">200 OK - JSON RESPONSE</p>
              </div>
            </div>
            
            <pre className="bg-black/40 p-6 rounded-xl font-mono text-xs text-indigo-300 overflow-x-auto border border-white/5 mb-8">
              {JSON.stringify(apiResult, null, 2)}
            </pre>

            <div className="flex gap-4">
              <button onClick={copyResult} className="flex-grow py-5 bg-white text-slate-900 rounded-xl font-black uppercase text-[10px] tracking-widest transition active:scale-95">
                {isCopied ? 'Copied to Clipboard' : 'Copy Short Link'}
              </button>
              <button onClick={() => setApiResult(null)} className="px-8 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition">Reset</button>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 p-10 md:p-16 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
            <div className="flex flex-col items-center mb-12 text-center">
              <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-6">
                <Terminal className="w-10 h-10" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter">Developer API</h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Programmatic Link Control</p>
            </div>

            {error && <div className="p-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[10px] font-black text-center mb-10 uppercase tracking-widest">{error}</div>}

            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-4">Your Secret Key</p>
                <div className="bg-slate-800 p-5 rounded-xl font-mono text-xs text-indigo-100 border border-white/5 truncate">
                  {user ? user.apiKey : 'Login to view key'}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-4">Endpoint Usage</p>
                <div className="bg-black/40 p-6 rounded-xl font-mono text-[11px] text-slate-400 leading-relaxed overflow-x-auto whitespace-nowrap">
                  <span className="text-green-500">GET</span> {window.location.origin}{window.location.pathname}api?api=<span className="text-white">YOUR_KEY</span>&url=<span className="text-white">YOUR_URL</span>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/')} className="w-full mt-12 text-slate-500 hover:text-white transition text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center group">
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Dashboard
            </button>
          </div>
        )}
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
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-[2000] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <RouterLink to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <LinkIcon className="text-white w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{settings.siteName}</span>
              </RouterLink>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-10">
              <RouterLink to="/" className="text-[11px] font-black text-slate-600 hover:text-indigo-600 uppercase tracking-[0.2em] transition">Home</RouterLink>
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

            {/* Mobile Menu Toggle (Three Lines) */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="text-slate-900 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition active:scale-95"
              >
                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 z-[1900] bg-white border-b border-slate-200 shadow-2xl p-6 space-y-4 animate-in">
            <RouterLink to="/" className="block p-5 bg-slate-50 rounded-xl text-[12px] font-black uppercase tracking-widest text-slate-900">Home Station</RouterLink>
            <RouterLink to="/api" className="block p-5 bg-slate-50 rounded-xl text-[12px] font-black uppercase tracking-widest text-slate-900">API Gateway</RouterLink>
            <RouterLink to="/blog" className="block p-5 bg-slate-50 rounded-xl text-[12px] font-black uppercase tracking-widest text-slate-900">Insights</RouterLink>
            <div className="pt-8 border-t border-slate-100 space-y-4">
              {currentUser ? (
                <>
                  <RouterLink to={currentUser.role === UserRole.ADMIN ? "/admin" : "/dashboard"} className="block p-5 bg-slate-900 text-white text-center rounded-xl text-[12px] font-black uppercase tracking-widest">Dashboard Access</RouterLink>
                  <button onClick={handleLogout} className="w-full p-5 text-center text-[12px] font-black text-red-500 uppercase tracking-widest">Sign Out</button>
                </>
              ) : (
                <RouterLink to="/login" className="block p-5 bg-slate-900 text-white text-center rounded-xl text-[12px] font-black uppercase tracking-widest">Login Terminal</RouterLink>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow relative">{children}</main>

      <footer className="bg-slate-900 py-12 px-4 text-center border-t border-white/5">
         <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">© 2026 {settings.siteName} Relay Network.</p>
         <p className="text-slate-800 text-[8px] font-bold mt-4 uppercase tracking-widest">ID: 320f263d298979dc11826b8e2574610ba0cc5d6b</p>
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
