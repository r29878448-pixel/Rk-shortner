
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
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <RouterLink to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                  <LinkIcon className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight uppercase">{settings.siteName}</span>
              </RouterLink>
              
              {/* Desktop Nav */}
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <RouterLink to="/" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 flex items-center">
                  <LayoutDashboard className="w-4 h-4 mr-1.5" /> Dashboard
                </RouterLink>
                <RouterLink to="/blog" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 flex items-center">
                  <FileText className="w-4 h-4 mr-1.5" /> Insights
                </RouterLink>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              {currentUser ? (
                <div className="flex items-center space-x-6 border-l pl-6 border-slate-200">
                  <RouterLink to="/admin" className="text-sm font-bold text-indigo-600 flex items-center">
                    <Shield className="w-4 h-4 mr-1.5" /> Admin Terminal
                  </RouterLink>
                  <button 
                    onClick={handleLogout} 
                    className="text-sm font-bold text-red-500 hover:text-red-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <RouterLink to="/login" className="text-sm font-bold text-slate-700 hover:text-indigo-600 border px-4 py-2 rounded border-slate-300 hover:border-indigo-600 transition">
                  Login
                </RouterLink>
              )}
            </div>

            {/* Mobile Menu Button - Standard 3-Line Menu */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 p-2 hover:bg-slate-100 rounded transition border border-slate-200"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 animate-in">
            <div className="px-4 pt-4 pb-6 space-y-2">
              <RouterLink to="/" className="block px-3 py-3 text-base font-bold text-slate-700 hover:bg-slate-50 rounded" onClick={() => setIsMenuOpen(false)}>Dashboard</RouterLink>
              <RouterLink to="/blog" className="block px-3 py-3 text-base font-bold text-slate-700 hover:bg-slate-50 rounded" onClick={() => setIsMenuOpen(false)}>Insights</RouterLink>
              <div className="my-4 border-t border-slate-100"></div>
              {currentUser ? (
                <>
                  <RouterLink to="/admin" className="block px-3 py-3 text-base font-bold text-indigo-600" onClick={() => setIsMenuOpen(false)}>Admin Panel</RouterLink>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-3 text-base font-bold text-red-500">Logout</button>
                </>
              ) : (
                <RouterLink to="/login" className="block px-3 py-3 text-base font-bold text-indigo-600" onClick={() => setIsMenuOpen(false)}>Secure Login</RouterLink>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-white py-12 px-4 border-t border-slate-200">
        <div className="max-w-7xl mx-auto text-center">
           <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">{settings.siteName}</span>
           <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mt-3">Professional URL Infrastructure</p>
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
