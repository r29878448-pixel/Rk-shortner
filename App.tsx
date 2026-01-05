
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Link as LinkIcon,
  Menu,
  Shield,
  ChevronLeft,
  Globe,
  Copy,
  Check,
  Key,
  Terminal,
  ExternalLink
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
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [sessionUser, setSessionUser] = useState<User | null>(null);

  useEffect(() => {
    // 1. Get current logged-in user for the UI
    const storedUser = localStorage.getItem('swiftlink_user');
    setSessionUser(storedUser ? JSON.parse(storedUser) : null);

    // 2. Parse API Query Parameters
    const params = new URLSearchParams(location.search);
    const apiToken = params.get('api');
    const targetUrl = params.get('url');

    if (!apiToken || !targetUrl) return;

    // 3. AUTHENTICATION: Check all registered users in "database"
    const allUsers = JSON.parse(localStorage.getItem('swiftlink_registered_users') || '[]');
    const userFound = allUsers.find((u: any) => u.profile.apiKey === apiToken);

    if (userFound) {
      const shortCode = Math.random().toString(36).substring(2, 9);
      const newLink: LinkType = {
        id: Math.random().toString(36).substring(7),
        userId: userFound.profile.id,
        originalUrl: targetUrl,
        shortCode,
        clicks: 0,
        earnings: 0,
        createdAt: new Date()
      };
      
      // Save to global link storage
      const existingLinks = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
      localStorage.setItem('swiftlink_global_links', JSON.stringify([newLink, ...existingLinks]));
      
      const baseUrl = window.location.origin + window.location.pathname.split('#')[0];
      setResult(`${baseUrl}#/s/${shortCode}`);
      setError(null);
    } else {
      setError('INVALID_API_KEY: The provided token does not match any active publisher.');
      setResult(null);
    }
  }, [location]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-3xl w-full">
        {result ? (
          /* SUCCESS VIEW - API RESPONSE */
          <div className="bg-white/5 border border-white/10 p-10 md:p-16 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl animate-in text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Relay Created</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-10">Endpoint Response Success</p>
            
            <div className="bg-black/40 p-6 rounded-2xl font-mono text-indigo-300 text-sm break-all border border-white/5 mb-8 flex items-center justify-between gap-4">
              <span className="truncate">{result}</span>
              <button onClick={() => copyToClipboard(result)} className="shrink-0 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition">
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => copyToClipboard(result)} className="py-5 bg-white text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition">
                {isCopied ? 'Copied' : 'Copy URL'}
              </button>
              <button onClick={() => window.location.href = result} className="py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition flex items-center justify-center">
                Visit <ExternalLink className="ml-2 w-4 h-4" />
              </button>
            </div>
            
            <button onClick={() => { setResult(null); navigate('/api'); }} className="mt-10 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition">Generate Another</button>
          </div>
        ) : (
          /* DOCUMENTATION / ERROR VIEW */
          <div className="bg-white/5 border border-white/10 p-10 md:p-16 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
            <div className="flex flex-col items-center mb-12 text-center">
              <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-6">
                <Terminal className="w-10 h-10" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter">Developer Hub</h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Programmatic Link Management</p>
            </div>

            {error && (
              <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-[10px] font-black text-center mb-10 uppercase tracking-widest animate-pulse">
                {error}
              </div>
            )}

            <div className="space-y-10">
              {/* TOKEN SECTION */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Your Access Token</p>
                <div className="flex items-center gap-4">
                  <div className="flex-grow bg-slate-800 p-6 rounded-2xl font-mono text-indigo-100 text-sm border border-white/10 overflow-hidden truncate">
                    {sessionUser ? sessionUser.apiKey : 'sk_live_login_to_view_your_token'}
                  </div>
                  {sessionUser && (
                    <button onClick={() => copyToClipboard(sessionUser.apiKey)} className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition">
                      <Copy className="w-5 h-5 text-slate-300" />
                    </button>
                  )}
                </div>
              </div>

              {/* REQUEST FORMAT SECTION */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">API GET Request Structure</p>
                <div className="relative group">
                  <div className="bg-black/60 p-8 rounded-2xl border border-white/5 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto whitespace-nowrap scrollbar-hide">
                    <span className="text-green-400 font-bold mr-3">GET</span> 
                    {window.location.origin}{window.location.pathname.split('#')[0]}api?api=
                    <span className="text-indigo-400 font-bold">{sessionUser ? sessionUser.apiKey : 'YOUR_TOKEN'}</span>
                    &url=<span className="text-indigo-400 font-bold">TARGET_URL</span>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/')} className="w-full mt-12 text-slate-500 hover:text-white transition text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center group">
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Exit Developer Mode
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
  const isApiPage = location.pathname === '/api';

  useEffect(() => { setIsMenuOpen(false); }, [location]);

  // Hide nav/footer for Redirect and API pages for a clean developer/user experience
  if (isRedirectPage || (isApiPage && location.search.includes('api='))) return <>{children}</>;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-[1000] shadow-sm">
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
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-900 p-2 bg-slate-50 rounded-xl">
                <Menu className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
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
