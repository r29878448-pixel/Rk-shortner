
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as LinkIcon, Mail, Lock, Loader2, Info, Zap } from 'lucide-react';
import { User, UserRole, SubscriptionPlan } from '../types';

interface LoginPageProps {
  onAuth: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onAuth }) => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // New Admin Credentials
  const MASTER_EMAIL = 'admin@swiftlink.pro';
  const MASTER_PASS = 'admin786';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const isAdmin = email === MASTER_EMAIL && password === MASTER_PASS;
      
      if (isAdmin) {
        const mockUser: User = {
          id: 'master-admin',
          email,
          role: UserRole.ADMIN,
          plan: SubscriptionPlan.BUSINESS,
          apiKey: 'sk_master_admin_production',
          createdAt: new Date(),
          isSuspended: false
        };
        
        localStorage.setItem('swiftlink_user', JSON.stringify(mockUser));
        onAuth(mockUser);
        navigate('/admin');
      } else {
        alert('Access Denied: Invalid Master Credentials');
      }
      setLoading(false);
    }, 800);
  };

  const autoFill = () => {
    setEmail(MASTER_EMAIL);
    setPassword(MASTER_PASS);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-slate-50">
      <div className="max-w-md w-full">
        {/* Quick Access Utility */}
        <div className="mb-6 p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-3">
            <Zap className="text-amber-600 w-5 h-5" />
          </div>
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-2">Master Access</h3>
          <p className="text-xs text-slate-500 mb-4 font-medium">Use the button below to instantly fill your private administrative credentials.</p>
          <button 
            onClick={autoFill}
            className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition shadow-sm"
          >
            Auto-fill Master Admin
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-100/40 border border-slate-100">
          <div className="text-center mb-10">
            <div className="inline-flex w-20 h-20 gradient-bg rounded-3xl items-center justify-center mb-6 shadow-2xl shadow-indigo-200 transform hover:rotate-6 transition">
              <LinkIcon className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Terminal Login</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">Restricted System Area</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Admin Identity</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="email" 
                  required
                  placeholder="admin@swiftlink.pro" 
                  className="w-full pl-12 pr-4 py-4 border border-slate-100 bg-slate-50/50 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-4 border border-slate-100 bg-slate-50/50 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 gradient-bg text-white rounded-2xl font-black text-xl hover:opacity-90 transition shadow-xl shadow-indigo-100 flex items-center justify-center group"
            >
              {loading ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : (
                <>
                  Enter Dashboard <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-center space-x-2 text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
             <span>Encrypted Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal icon helper
const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export default LoginPage;
