
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
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <RouterLink to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <LinkIcon className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">SwiftLink</span>
              </RouterLink>
              
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <RouterLink to="/" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/') ? 'border-indigo-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                  Shortener
                </RouterLink>
                <RouterLink to="/blog" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/blog') ? 'border-indigo-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                  Blog
                </RouterLink>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <>
                  <RouterLink 
                    to="/admin"
                    className="flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </RouterLink>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-sm font-medium text-red-500 hover:text-red-700 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <RouterLink to="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 hover:underline">Admin Login</RouterLink>
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
          <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 space-y-2">
            <RouterLink to="/" className="block px-3 py-2 text-base font-medium text-slate-700">Home</RouterLink>
            <RouterLink to="/blog" className="block px-3 py-2 text-base font-medium text-slate-700">Blog</RouterLink>
            {currentUser ? (
              <>
                <RouterLink to="/admin" className="block px-3 py-2 text-base font-medium text-indigo-600">Admin Panel</RouterLink>
                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 text-base font-medium text-red-600">Logout</button>
              </>
            ) : (
              <RouterLink to="/login" className="block px-3 py-2 text-base font-medium text-slate-700">Admin Login</RouterLink>
            )}
          </div>
        )}
      </nav>
    );
  };

  const Footer = () => (
    <footer className="bg-slate-900 text-white py-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-xs">
        © {new Date().getFullYear()} SwiftLink Master Platform. Professional Edition.
      </div>
    </footer>
  );

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
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
