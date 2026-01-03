
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
  ChevronLeft
} from 'lucide-react';
import { User, SiteSettings } from './types.ts';
import { DEFAULT_SETTINGS } from './constants.tsx';

// Views
import HomePage from './views/HomePage.tsx';
import AdminDashboard from './views/AdminDashboard.tsx';
import RedirectFlow from './views/RedirectFlow.tsx';
import LoginPage from './views/LoginPage.tsx';
import BlogPage from './views/BlogPage.tsx';

/**
 * VP Links Style API Handler
 * Responds to ?api=KEY&url=URL
 */
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
      // Validate Key
      const storedUserString = localStorage.getItem('swiftlink_user');
      const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
      
      if (!storedUser || storedUser.apiKey !== api) {
        setError('Authentication Failed: Invalid API Token.');
        return;
      }

      // Generate Link
      const shortCode = Math.random().toString(36).substring(2, 9);
      const newLink = {
        id: Math.random().toString(36).substring(7),
        userId: storedUser.id,
        originalUrl: url,
        shortCode,
        clicks: 0,
        createdAt: new Date()
      };
      
      const existing = JSON.parse(localStorage.getItem('swiftlink_global_links') || '[]');
      localStorage.setItem('swiftlink_global_links', JSON.stringify([newLink, ...existing]));
      
      const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
      setResult(`${baseUrl}#/s/${shortCode}`);
    } else {
      setError('Missing parameters. Format: ?api=YOUR_TOKEN&url=TARGET_URL');
    }
  }, [location]);

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-2xl">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-100 transform -rotate-3">
           <LinkIcon className="text-white w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-black uppercase text-center text-slate-900 tracking-tighter">API Relay Result</h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-10 text-center">Programmatic Link Generation</p>
        
        {error && (
          <div className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold leading-relaxed">
            {error}
          </div>
        )}
        
        {result && (
          <div className="space-y-6 animate-in">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 font-mono text-indigo-300 text-sm break-all leading-relaxed shadow-inner">
               {result}
            </div>
            <button 
              onClick={copyResult}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-indigo-700 transition active:scale-95 flex items-center justify-center gap-3"
            >
              {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {isCopied ? 'Copied Link!' : 'Copy to Clipboard'}
            </button>
          </div>
        )}
        
        <div className="mt-12 pt-8 border-t border-slate-50 flex justify-center">
          <button onClick={() => navigate('/')} className="flex items-center text-slate-400 hover:text-indigo-600 transition text-[10px] font-black uppercase tracking-widest">
            <ChevronLeft className="w-3 h-3 mr-1" /> Return to Dashboard
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

  if (isRedirectPage) return <>{children}</>;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-[1000] shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 md:h-20">
            <div className="flex items-center">
              <RouterLink to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center shadow-lg">
                  <LinkIcon className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">{settings.siteName}</span>
              </RouterLink>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <RouterLink to="/" className="text-xs font-bold text-slate-600 hover:text-indigo-600 uppercase tracking-widest transition">Dashboard</RouterLink>
              <RouterLink to="/blog" className="text-xs font-bold text-slate-600 hover:text-indigo-600 uppercase tracking-widest transition">Insights</RouterLink>
              
              {currentUser ? (
                <div className="flex items-center space-x-4 border-l pl-4 border-slate-200">
                  <RouterLink to="/admin" className="text-[10px] font-black text-white bg-indigo-600 px-4 py-2 rounded-lg uppercase tracking-widest shadow-md hover:bg-indigo-700 transition">Admin Area</RouterLink>
                  <button onClick={handleLogout} className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:bg-red-50 px-2 py-1 rounded transition">Logout</button>
                </div>
              ) : (
                <RouterLink to="/login" className="text-[10px] font-bold text-slate-700 border px-4 py-2 rounded-lg uppercase tracking-widest hover:bg-slate-50 transition">Login</RouterLink>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-900 p-2">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 shadow-2xl py-6 px-4 space-y-2">
            <RouterLink to="/" className="block py-4 font-black uppercase text-xs tracking-widest text-slate-700 border-b border-slate-50" onClick={() => setIsMenuOpen(false)}>Dashboard</RouterLink>
            <RouterLink to="/blog" className="block py-4 font-black uppercase text-xs tracking-widest text-slate-700 border-b border-slate-50" onClick={() => setIsMenuOpen(false)}>Insights</RouterLink>
            {currentUser && (
              <RouterLink to="/admin" className="block py-4 font-black uppercase text-xs tracking-widest text-indigo-600" onClick={() => setIsMenuOpen(false)}>Admin Station</RouterLink>
            )}
            {!currentUser && (
              <RouterLink to="/login" className="block py-4 font-black uppercase text-xs tracking-widest text-slate-700" onClick={() => setIsMenuOpen(false)}>Login</RouterLink>
            )}
          </div>
        )}
      </nav>

      <main className="flex-grow">{children}</main>
      <footer className="bg-slate-900 py-16 px-4 text-center">
         <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center shadow-lg">
              <LinkIcon className="text-white w-3 h-3" />
            </div>
            <span className="text-xl font-black text-white uppercase tracking-tighter">{settings.siteName}</span>
         </div>
         <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.4em]">Enterprise Monetized Infrastructure</p>
         <div className="mt-8 pt-8 border-t border-white/5 max-w-sm mx-auto">
            <p className="text-slate-600 text-[9px] font-bold uppercase tracking-widest">© 2026 SwiftLink Technologies. All Relays Encrypted.</p>
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
          <Route path="/" element={<HomePage siteName={settings.siteName} settings={settings} />} />
          <Route path="/login" element={<LoginPage onAuth={setCurrentUser} />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/api" element={<ApiHandler />} />
          <Route path="/admin" element={<AdminDashboard user={currentUser} settings={settings} onUpdateSettings={setSettings} />} />
          <Route path="/s/:shortCode" element={<RedirectFlow settings={settings} currentUser={currentUser} />} />
        </Routes>
      </GlobalLayout>
    </HashRouter>
  );
};

export default App;
