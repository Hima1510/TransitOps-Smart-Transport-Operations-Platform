import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';
import { Truck, Shield, BarChart3, UserCircle } from 'lucide-react';

const demoUsers = [
  { label: 'Fleet Manager', email: 'fleet@transitops.io', icon: Truck, desc: 'Full platform access', color: 'from-blue-500 to-blue-700' },
  { label: 'Driver', email: 'driver@transitops.io', icon: UserCircle, desc: 'Trips & assigned vehicle', color: 'from-emerald-500 to-emerald-700' },
  { label: 'Safety Officer', email: 'safety@transitops.io', icon: Shield, desc: 'Compliance & licensing', color: 'from-amber-500 to-amber-700' },
  { label: 'Financial Analyst', email: 'finance@transitops.io', icon: BarChart3, desc: 'Costs, fuel & ROI', color: 'from-purple-500 to-purple-700' },
];

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent, overrideEmail?: string) => {
    e?.preventDefault();
    const loginEmail = overrideEmail || email;
    const loginPassword = password || 'demo1234';
    if (!loginEmail) return;
    setLoading(true);
    try {
      const data = await api.login(loginEmail, loginPassword);
      login(data.token, data.user);
      showToast(`Welcome back, ${data.user.name}!`);
    } catch (err: any) { showToast(err.message, 'error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 mb-4 shadow-lg shadow-blue-500/30"><Truck size={32} className="text-white" /></div>
          <h1 className="text-3xl font-bold text-white mb-2">TransitOps</h1>
          <p className="text-blue-200/70 text-sm max-w-xs mx-auto">One system of record for vehicles, drivers, trips, maintenance, and money — with guardrails baked in.</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-7 shadow-2xl mb-6">
          <h2 className="text-white font-semibold text-lg mb-5">Sign in to your account</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div><label className="block text-blue-200/80 text-sm mb-1.5">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200/40 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all" placeholder="you@company.com" /></div>
            <div><label className="block text-blue-200/80 text-sm mb-1.5">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200/40 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all" placeholder="••••••••" /></div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 text-base">{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>
        </div>
        <div>
          <p className="text-center text-blue-200/50 text-xs uppercase tracking-wider font-semibold mb-3">Quick Demo Access</p>
          <div className="grid grid-cols-2 gap-3">
            {demoUsers.map(u => (
              <button key={u.email} onClick={() => handleLogin(undefined, u.email)} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group text-left">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${u.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}><u.icon size={17} className="text-white" /></div>
                <div><p className="text-white text-sm font-medium">{u.label}</p><p className="text-blue-200/40 text-[11px]">{u.desc}</p></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
