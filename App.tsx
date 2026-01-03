
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { 
  Link as LinkIcon,
  Menu,
  X,
  User as UserIcon,
  Shield
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
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Navigation - Clean, No Ads */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-[1000] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <RouterLink to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition shadow-lg shadow-indigo-200">
                  <LinkIcon className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{settings.siteName}</span>
              </RouterLink>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-10">
              <RouterLink to="/" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition">Dashboard</RouterLink>
              <RouterLink to="/blog" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition">Insights</RouterLink>
              <div className="h-6 w-px bg-slate-200"></div>
              {currentUser ? (
                <div className="flex items-center space-x-6">
                  <RouterLink to="/admin" className="text-xs font-black uppercase tracking-widest text-indigo-600 flex items-center bg-indigo-50 px-4 py-2 rounded-lg">
                    <Shield className="w-4 h-4 mr-2" /> Admin Portal
                  </RouterLink>
                  <button onClick={handleLogout} className="text-xs font-black uppercase tracking-widest text-red-500 hover:underline">Exit</button>
                </div>
              ) : (
                <RouterLink to="/login" className="text-xs font-black uppercase tracking-widest text-slate-900 hover:text-indigo-600 border-2 border-slate-900 px-6 py-2 rounded-xl transition">Login</RouterLink>
              )}
            </div>

            {/* Mobile Menu Button - Highly Visible Hamburger */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-900 p-3 bg-slate-100 rounded-xl hover:bg-indigo-100 transition border-2 border-transparent focus:border-indigo-600"
              >
                {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-6 space-y-6 animate-in shadow-2xl absolute w-full top-20 left-0">
            <RouterLink to="/" className="block text-lg font-black uppercase tracking-widest text-slate-900" onClick={() => setIsMenuOpen(false)}>Dashboard</RouterLink>
            <RouterLink to="/blog" className="block text-lg font-black uppercase tracking-widest text-slate-900" onClick={() => setIsMenuOpen(false)}>Insights</RouterLink>
            <div className="pt-6 border-t border-slate-100">
              {currentUser ? (
                <div className="space-y-6">
                  <RouterLink to="/admin" className="block text-lg font-black uppercase tracking-widest text-indigo-600" onClick={() => setIsMenuOpen(false)}>Admin Panel</RouterLink>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block text-lg font-black uppercase tracking-widest text-red-500">Logout</button>
                </div>
              ) : (
                <RouterLink to="/login" className="block text-lg font-black uppercase tracking-widest text-indigo-600" onClick={() => setIsMenuOpen(false)}>Secure Login</RouterLink>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-white py-16 px-4 border-t border-slate-200">
        <div className="max-w-7xl mx-auto text-center">
           <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{settings.siteName}</span>
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Enterprise Link Infrastructure</p>
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
