
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Link as LinkIcon,
  Menu,
  X,
  User as UserIcon,
  Shield,
  LayoutDashboard,
  FileText
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const api = params.get('api');
    const url = params.get('url');

    if (api && url) {
      // Validate Key
      const storedUser = JSON.parse(localStorage.getItem('swiftlink_user') || '{}');
      if (storedUser.apiKey !== api) {
        setError('Invalid API Key.');
        return;
      }

      // Generate Link
      const shortCode = Math.random().toString(36).substring(2, 9);
      const newLink = {
        id: Math.random().toString(36).substring(7),
        userId: 'admin',
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
      setError('Missing required parameters: ?api=TOKEN&url=LONG_URL');
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white text-center">
      <div className="max-w-lg w-full bg-white/5 border border-white/10 p-10 rounded-2xl backdrop-blur-xl">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20">
           <LinkIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black uppercase mb-2">API Integration Result</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-10">Programmatic Relay Node Generated</p>
        
        {error && <div className="p-4 bg-red-500/20 text-red-400 rounded-lg text-sm font-bold border border-red-500/20">{error}</div>}
        
        {result && (
          <div className="space-y-6">
            <div className="bg-white/10 p-6 rounded-xl border border-white/10 font-mono text-indigo-300 text-sm break-all">
               {result}
            </div>
            <button 
              onClick={() => { navigator.clipboard.writeText(result); alert('Link Copied!'); }}
              className="w-full py-4 bg-white text-slate-900 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl"
            >
              Copy To Clipboard
            </button>
          </div>
        )}
        
        <button onClick={() => navigate('/')} className="mt-8 text-slate-500 hover:text-white transition text-[10px] font-bold uppercase tracking-widest">
          Return to Dashboard
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
              <RouterLink to="/" className="text-xs font-bold text-slate-600 hover:text-indigo-600 uppercase tracking-widest">Dashboard</RouterLink>
              <RouterLink to="/blog" className="text-xs font-bold text-slate-600 hover:text-indigo-600 uppercase tracking-widest">Insights</RouterLink>
              
              {currentUser ? (
                <div className="flex items-center space-x-4 border-l pl-4 border-slate-200">
                  <RouterLink to="/admin" className="text-[10px] font-black text-white bg-indigo-600 px-4 py-2 rounded uppercase tracking-widest shadow-md">Admin Area</RouterLink>
                  <button onClick={handleLogout} className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Logout</button>
                </div>
              ) : (
                <RouterLink to="/login" className="text-[10px] font-bold text-slate-700 border px-4 py-2 rounded uppercase tracking-widest hover:bg-slate-50 transition">Login</RouterLink>
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
            <RouterLink to="/" className="block py-4 font-black uppercase text-xs tracking-widest text-slate-700" onClick={() => setIsMenuOpen(false)}>Dashboard</RouterLink>
            <RouterLink to="/blog" className="block py-4 font-black uppercase text-xs tracking-widest text-slate-700" onClick={() => setIsMenuOpen(false)}>Insights</RouterLink>
            {currentUser && (
              <RouterLink to="/admin" className="block py-4 font-black uppercase text-xs tracking-widest text-indigo-600" onClick={() => setIsMenuOpen(false)}>Admin Station</RouterLink>
            )}
          </div>
        )}
      </nav>

      <main className="flex-grow">{children}</main>
      <footer className="bg-slate-900 py-12 px-4 text-center">
         <span className="text-xl font-black text-white uppercase tracking-tighter">{settings.siteName}</span>
         <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.4em] mt-2">Monetized Link Infrastructure</p>
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
