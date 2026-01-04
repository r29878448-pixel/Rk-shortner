
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as LinkIcon, Mail, Lock, Loader2 } from 'lucide-react';
import { User, UserRole } from '../types.ts';

interface LoginPageProps {
  onAuth: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onAuth }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const MASTER_EMAIL = 'r29878448@gmail.com';
  const MASTER_PASS = 'Mnbvcxzlk';

  const generateAlphanumericKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'sk_live_';
    for (let i = 0; i < 32; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
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
          apiKey: generateAlphanumericKey(),
          createdAt: new Date(),
          isSuspended: false
        };
        localStorage.setItem('swiftlink_user', JSON.stringify(adminUser));
        onAuth(adminUser);
        navigate('/admin');
      } else if (isRegistering) {
        const newUser: User = {
          id: Math.random().toString(36).substring(7),
          email,
          role: UserRole.USER,
          apiKey: generateAlphanumericKey(),
          createdAt: new Date(),
          isSuspended: false
        };
        const users = JSON.parse(localStorage.getItem('swiftlink_registered_users') || '[]');
        users.push({ email, password, profile: newUser });
        localStorage.setItem('swiftlink_registered_users', JSON.stringify(users));
        localStorage.setItem('swiftlink_user', JSON.stringify(newUser));
        onAuth(newUser);
        navigate('/dashboard');
      } else {
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
        <div className="bg-white rounded-xl p-10 md:p-12 shadow-2xl border border-slate-100">
          <div className="text-center mb-10">
            <div className="inline-flex w-14 h-14 bg-indigo-600 rounded-xl items-center justify-center mb-6 shadow-xl shadow-indigo-100">
              <LinkIcon className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
              {isRegistering ? 'Network Portal' : 'Login Terminal'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input type="email" required placeholder="Identity (Email)" className="w-full pl-12 pr-4 py-4 border border-slate-200 bg-slate-50 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input type="password" required placeholder="Security Key" className="w-full pl-12 pr-4 py-4 border border-slate-200 bg-slate-50 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition shadow-lg">
              {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (isRegistering ? 'Register Publisher' : 'Access Network')}
            </button>
          </form>

          <button onClick={() => setIsRegistering(!isRegistering)} className="w-full mt-10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition text-center">
            {isRegistering ? 'Back to Login' : 'Register New Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
