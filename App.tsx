
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
  ExternalLink
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
 * Optimized for machine-reading and platform validation.
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
      const storedUserString = localStorage.getItem('swiftlink_user');
      const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
      
      if (!storedUser || storedUser.apiKey !== api) {
        setError('ERROR: Authentication failed. Key mismatch.');
        return;
      }

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
      
      // Clean base URL calculation
      const baseUrl = window.location.origin + window.location.pathname.split('#')[0];
      const finalResult = `${baseUrl}#/s/${shortCode}`;
      setResult(finalResult);
    } else if (location.search !== '') {
      setError('ERROR: Missing parameters (api & url required)');
    }
  }, [location]);

  // If a platform is checking for a raw string, we provide a clean pre-tag layout
  if (result && location.search.includes('format=raw')) {
    return <div className="api-raw-response">{result}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-2xl w-full bg-white/5 border border-white/10 p-12 md:p-16 rounded-[3rem] backdrop-blur-3xl shadow-[0_0_100px_rgba(79,70,229,0.1)]">
        <div className="flex items-center justify-center space-x-4 mb-12">
           <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 transform -rotate-6">
              <Terminal className="text-white w-8 h-8" />
           </div>
           <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">Relay API</h2>
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">Integration Terminal</p>
           </div>
        </div>
        
        {error && (
          <div className="p-8 bg-red-500/10 border border-red-500/20 text-red-400 rounded-3xl text-sm font-bold leading-relaxed mb-6 text-center">
            {error}
          </div>
        )}
        
        {result ? (
          <div className="space-y-8 animate-in text-center">
            <div className="inline-flex items-center bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
               <Zap className="w-3 h-3 mr-2" /> Node Validated
            </div>
            <div className="bg-white/10 p-10 rounded-[2.5rem] border border-white/10 font-mono text-indigo-300 text-lg break-all leading-relaxed shadow-inner">
               {result}
            </div>
            <button 
              onClick={() => { navigator.clipboard.writeText(result || ''); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }}
              className="w-full py-6 bg-white text-slate-900 rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] shadow-2xl hover:bg-indigo-50 transition active:scale-95 flex items-center justify-center gap-4"
            >
              {isCopied ? <Check className="w-6 h-6 text-green-600" /> : <Copy className="w-6 h-6" />}
              {isCopied ? 'Link Copied' : 'Copy API Result'}
            </button>
          </div>
        ) : !error && (
          <div className="text-center py-10">
             <div className="flex justify-center mb-6">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
             </div>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Awaiting Request...</p>
          </div>
        )}
        
        <div className="mt-16 pt-10 border-t border-white/5 flex flex-col items-center gap-4">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
              Protocol: GET Link Relay v2.6.1
           </p>
           <button onClick={() => navigate('/')} className="flex items-center text-indigo-400 hover:text-white transition text-[11px] font-black uppercase tracking-[0.2em]">
            <ChevronLeft className="w-4 h-4 mr-2" /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

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
              <RouterLink to="/" className="text-[11px] font-black text-slate-600 hover:text-indigo-600 uppercase tracking-[0.2em] transition">Dashboard</RouterLink>
              <RouterLink to="/blog" className="text-[11px] font-black text-slate-600 hover:text-indigo-600 uppercase tracking-[0.2em] transition">Insights</RouterLink>
              
              {currentUser ? (
                <div className="flex items-center space-x-6 border-l pl-8 border-slate-200">
                  <RouterLink to="/admin" className="text-[11px] font-black text-white bg-indigo-600 px-6 py-3 rounded-xl uppercase tracking-[0.2em] shadow-lg hover:bg-indigo-700 transition">Admin Area</RouterLink>
                  <button onClick={handleLogout} className="text-[11px] font-black text-red-500 uppercase tracking-[0.2em] hover:text-red-700 transition">Logout</button>
                </div>
              ) : (
                <RouterLink to="/login" className="text-[11px] font-black text-slate-900 border-2 border-slate-900 px-6 py-3 rounded-xl uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition">Login</RouterLink>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-900 p-2">
                {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 shadow-2xl py-8 px-6 space-y-4">
            <RouterLink to="/" className="block py-4 font-black uppercase text-xs tracking-widest text-slate-900 border-b border-slate-50" onClick={() => setIsMenuOpen(false)}>Dashboard</RouterLink>
            <RouterLink to="/blog" className="block py-4 font-black uppercase text-xs tracking-widest text-slate-900 border-b border-slate-50" onClick={() => setIsMenuOpen(false)}>Insights</RouterLink>
            {currentUser && (
              <RouterLink to="/admin" className="block py-6 font-black uppercase text-xs tracking-widest text-indigo-600" onClick={() => setIsMenuOpen(false)}>Admin Station</RouterLink>
            )}
            {!currentUser && (
              <RouterLink to="/login" className="block py-6 font-black uppercase text-xs tracking-widest text-slate-900" onClick={() => setIsMenuOpen(false)}>Login Area</RouterLink>
            )}
          </div>
        )}
      </nav>

      <main className="flex-grow">{children}</main>
      <footer className="bg-slate-900 py-20 px-4 text-center">
         <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-2xl shadow-indigo-500/20">
              <LinkIcon className="text-white w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-white uppercase tracking-tighter">{settings.siteName}</span>
         </div>
         <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] mb-10">Enterprise Redirect Infrastructure</p>
         
         <div className="mb-12">
            <a 
              href="https://www.effectivegatecpm.com/x7462fyue?key=967d606352d8c84667eba56789c7a043" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-black text-slate-700 hover:text-indigo-400 transition uppercase tracking-widest border border-white/5 px-6 py-3 rounded-full flex items-center justify-center mx-auto max-w-xs"
            >
              <ExternalLink className="w-3 h-3 mr-2" /> Featured Partner
            </a>
         </div>

         <div className="mt-12 pt-10 border-t border-white/5 max-w-xl mx-auto flex flex-col items-center gap-4">
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">© 2026 SwiftLink Cloud. All Rights Reserved.</p>
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
