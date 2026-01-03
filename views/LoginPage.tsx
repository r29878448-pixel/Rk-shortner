
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as LinkIcon, Mail, Lock, Loader2, UserPlus, LogIn } from 'lucide-react';
import { User, UserRole, SubscriptionPlan } from '../types.ts';

interface LoginPageProps {
  onAuth: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onAuth }) => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // New Master Credentials
  const MASTER_EMAIL = 'r29878448@gmail.com';
  const MASTER_PASS = 'Mnbvcxzlk';

  const generateAlphanumericKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'sk_live_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const isAdmin = email === MASTER_EMAIL && password === MASTER_PASS;
      
      if (isAdmin) {
        const adminUser: User = {
          id: 'admin-root',
          email,
          role: UserRole.ADMIN,
          plan: SubscriptionPlan.BUSINESS,
          apiKey: generateAlphanumericKey(),
          createdAt: new Date(),
          isSuspended: false
        };
        localStorage.setItem('swiftlink_user', JSON.stringify(adminUser));
        onAuth(adminUser);
        navigate('/admin');
      } else if (isRegistering) {
        // Handle User Registration
        const newUser: User = {
          id: Math.random().toString(36).substring(7),
          email,
          role: UserRole.USER,
          plan: SubscriptionPlan.FREE,
          apiKey: generateAlphanumericKey(),
          createdAt: new Date(),
          isSuspended: false
        };
        // Simulated persistence
        const users = JSON.parse(localStorage.getItem('swiftlink_registered_users') || '[]');
        users.push({ email, password, profile: newUser });
        localStorage.setItem('swiftlink_registered_users', JSON.stringify(users));
        localStorage.setItem('swiftlink_user', JSON.stringify(newUser));
        onAuth(newUser);
        navigate('/dashboard');
      } else {
        // Handle Standard User Login
        const users = JSON.parse(localStorage.getItem('swiftlink_registered_users') || '[]');
        const found = users.find((u: any) => u.email === email && u.password === password);
        
        if (found) {
          localStorage.setItem('swiftlink_user', JSON.stringify(found.profile));
          onAuth(found.profile);
          navigate('/dashboard');
        } else {
          alert('Access Denied: Invalid Credentials');
        }
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-slate-50">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-100/40 border border-slate-100">
          <div className="text-center mb-10">
            <div className="inline-flex w-20 h-20 bg-indigo-600 rounded-3xl items-center justify-center mb-6 shadow-2xl shadow-indigo-200">
              <LinkIcon className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {isRegistering ? 'Create Account' : 'Terminal Login'}
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">
              {isRegistering ? 'Join the network' : 'Restricted System Area'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email Identity</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com" 
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
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : (
                <div className="flex items-center">
                  {isRegistering ? 'Create Profile' : 'Enter Dashboard'} <span className="ml-2">→</span>
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition flex items-center justify-center mx-auto"
            >
              {isRegistering ? (
                <><LogIn className="w-4 h-4 mr-2" /> Already have an account? Login</>
              ) : (
                <><UserPlus className="w-4 h-4 mr-2" /> New user? Start free</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
