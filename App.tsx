
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  Link as LinkIcon, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck
} from 'lucide-react';
import { User, SiteSettings } from './types.ts';
import { DEFAULT_SETTINGS } from './constants.tsx';
import AdSlot from './components/AdSlot.tsx';

// Views
import HomePage from './views/HomePage.tsx';
import AdminDashboard from './views/AdminDashboard.tsx';
import RedirectFlow from './views/RedirectFlow.tsx';
import LoginPage from './views/LoginPage.tsx';
import BlogPage from './views/BlogPage.tsx';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('swiftlink_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    const storedSettings = localStorage.getItem('swiftlink_settings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('swiftlink_user');
    setCurrentUser(null);
  };

  const Navigation = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
      <header className="sticky top-0 z-50">
        <AdSlot html={settings.adSlots.globalHeader} />
        <nav className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <RouterLink to="/" className="flex items-center space-x-2 group">
                  <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition duration-300">
                    <LinkIcon className="text-white w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{settings.siteName}</span>
                </RouterLink>
                
                <div className="hidden md:ml-12 md:flex md:space-x-8">
                  <RouterLink to="/" className={`inline-flex items-center px-1 pt-1 border-b-2 text-xs font-black uppercase tracking-widest ${isActive('/') ? 'border-indigo-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                    Dashboard
                  </RouterLink>
                  <RouterLink to="/blog" className={`inline-flex items-center px-1 pt-1 border-b-2 text-xs font-black uppercase tracking-widest ${isActive('/blog') ? 'border-indigo-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                    Insight
                  </RouterLink>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-6">
                {currentUser ? (
                  <>
                    <RouterLink 
                      to="/admin"
                      className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin Control</span>
                    </RouterLink>
                    <button 
                      onClick={handleLogout}
                      className="text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition"
                    >
                      Exit
                    </button>
                  </>
                ) : (
                  <RouterLink to="/login" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 underline underline-offset-4 decoration-indigo-200">Terminal Access</RouterLink>
                )}
              </div>

              <div className="flex items-center md:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-500 hover:text-slate-600">
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-slate-100 py-6 px-4 space-y-4 shadow-xl">
              <RouterLink to="/" className="block px-3 py-2 text-sm font-black uppercase tracking-widest text-slate-700">Shortener</RouterLink>
              <RouterLink to="/blog" className="block px-3 py-2 text-sm font-black uppercase tracking-widest text-slate-700">Blog</RouterLink>
              {currentUser ? (
                <>
                  <RouterLink to="/admin" className="block px-3 py-2 text-sm font-black uppercase tracking-widest text-indigo-600">Admin Panel</RouterLink>
                  <button onClick={handleLogout} className="w-full text-left block px-3 py-2 text-sm font-black uppercase tracking-widest text-red-600">Logout</button>
                </>
              ) : (
                <RouterLink to="/login" className="block px-3 py-2 text-sm font-black uppercase tracking-widest text-slate-700">Admin Login</RouterLink>
              )}
            </div>
          )}
        </nav>
      </header>
    );
  };

  const Footer = () => (
    <footer className="mt-auto">
      <AdSlot html={settings.adSlots.globalFooter} />
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <LinkIcon className="text-white w-6 h-6" />
            </div>
            <span className="text-3xl font-black tracking-tighter uppercase">{settings.siteName}</span>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">The Enterprise Infrastructure for Link Monetization</p>
          <div className="text-slate-700 text-[10px] font-bold uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} All Rights Reserved • v2.5 Enterprise Edition
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage siteName={settings.siteName} settings={settings} />} />
            <Route path="/login" element={<LoginPage onAuth={setCurrentUser} />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/admin" element={<AdminDashboard user={currentUser} settings={settings} onUpdateSettings={setSettings} />} />
            <Route path="/s/:shortCode" element={<RedirectFlow settings={settings} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
