
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
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
      {/* Navigation - Professional Classic Style */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-[1000] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20">
            <div className="flex items-center">
              <RouterLink to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded flex items-center justify-center shadow-indigo-200 shadow-lg">
                  <LinkIcon className="text-white w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="text-lg md:text-2xl font-black text-slate-900 tracking-tighter uppercase">{settings.siteName}</span>
              </RouterLink>
              
              {/* Desktop Nav */}
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <RouterLink to="/" className="text-sm font-bold text-slate-600 hover:text-indigo-600 flex items-center transition">
                  Dashboard
                </RouterLink>
                <RouterLink to="/blog" className="text-sm font-bold text-slate-600 hover:text-indigo-600 flex items-center transition">
                  Insights
                </RouterLink>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              {currentUser ? (
                <div className="flex items-center space-x-6 border-l pl-6 border-slate-200">
                  <RouterLink to="/admin" className="text-sm font-bold text-indigo-600 flex items-center bg-indigo-50 px-4 py-2 rounded border border-indigo-100">
                    <Shield className="w-4 h-4 mr-2" /> Admin Terminal
                  </RouterLink>
                  <button 
                    onClick={handleLogout} 
                    className="text-sm font-bold text-red-500 hover:text-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <RouterLink to="/login" className="text-sm font-bold text-slate-700 hover:text-indigo-600 border px-6 py-2.5 rounded-lg border-slate-300 hover:border-indigo-600 transition shadow-sm">
                  Login
                </RouterLink>
              )}
            </div>

            {/* Mobile Menu Button - High Contrast */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-900 p-2 bg-slate-50 border border-slate-200 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500"
                aria-label="Toggle Navigation Menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 shadow-2xl animate-in overflow-y-auto max-h-[calc(100vh-4rem)]">
            <div className="px-6 py-8 space-y-4">
              <RouterLink to="/" className="flex items-center px-4 py-4 text-lg font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>
                <LayoutDashboard className="w-5 h-5 mr-4 text-indigo-600" /> Dashboard
              </RouterLink>
              <RouterLink to="/blog" className="flex items-center px-4 py-4 text-lg font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>
                <FileText className="w-5 h-5 mr-4 text-indigo-600" /> Insights
              </RouterLink>
              <div className="my-6 border-t border-slate-100"></div>
              {currentUser ? (
                <div className="space-y-4">
                  <RouterLink to="/admin" className="flex items-center px-4 py-4 text-lg font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>
                    <Shield className="w-5 h-5 mr-4" /> Admin Terminal
                  </RouterLink>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center w-full text-left px-4 py-4 text-lg font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition">
                    Logout Session
                  </button>
                </div>
              ) : (
                <RouterLink to="/login" className="flex items-center px-4 py-4 text-lg font-black uppercase tracking-widest text-indigo-600 border-2 border-indigo-600 rounded-xl text-center justify-center" onClick={() => setIsMenuOpen(false)}>
                  Secure Login
                </RouterLink>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-slate-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
           <span className="text-2xl font-black text-white tracking-tighter uppercase">{settings.siteName}</span>
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Automated Link Monetization Network</p>
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

  return (
    <HashRouter>
      <GlobalLayout settings={settings} currentUser={currentUser} handleLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<HomePage siteName={settings.siteName} settings={settings} />} />
          <Route path="/login" element={<LoginPage onAuth={setCurrentUser} />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/admin" element={<AdminDashboard user={currentUser} settings={settings} onUpdateSettings={setSettings} />} />
          <Route path="/s/:shortCode" element={<RedirectFlow settings={settings} currentUser={currentUser} />} />
        </Routes>
      </GlobalLayout>
    </HashRouter>
  );
};

export default App;
