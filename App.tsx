
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { 
  Link as LinkIcon
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

/**
 * Defining GlobalLayout outside of the App component improves typing reliability for 
 * the 'children' prop in JSX and avoids closure-related inference issues.
 */
interface GlobalLayoutProps {
  children: React.ReactNode;
  settings: SiteSettings;
  currentUser: User | null;
  handleLogout: () => void;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children, settings, currentUser, handleLogout }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Automatic Top Ad */}
      <AdSlot html={settings.adSlots.top} />
      
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <RouterLink to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <LinkIcon className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">{settings.siteName}</span>
              </RouterLink>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <RouterLink to="/" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition">Dashboard</RouterLink>
                <RouterLink to="/blog" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition">Insights</RouterLink>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <>
                  <RouterLink to="/admin" className="text-xs font-black uppercase tracking-widest text-indigo-600">Admin</RouterLink>
                  <button onClick={handleLogout} className="text-xs font-black uppercase tracking-widest text-red-500">Exit</button>
                </>
              ) : (
                <RouterLink to="/login" className="text-xs font-black uppercase tracking-widest text-slate-400">Login</RouterLink>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      {/* Automatic Bottom Ad */}
      <AdSlot html={settings.adSlots.bottom} />
      
      <footer className="bg-slate-900 py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
           <span className="text-2xl font-black text-white tracking-tighter uppercase">{settings.siteName}</span>
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Professional Link Infrastructure</p>
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
          <Route path="/s/:shortCode" element={<RedirectFlow settings={settings} />} />
        </Routes>
      </GlobalLayout>
    </HashRouter>
  );
};

export default App;
