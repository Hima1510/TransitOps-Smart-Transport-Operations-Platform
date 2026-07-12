import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';
import { Sparkles } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent, overrideEmail?: string) => {
    e?.preventDefault();
    const loginEmail = overrideEmail || email;
    const loginPassword = password;
    if (!loginEmail || !loginPassword) {
      showToast('Email and password are required', 'error');
      return;
    }
    setLoading(true);
    try {
      const data = await api.login(loginEmail, loginPassword);
      login(data.token, data.user);
      showToast(`Welcome back, ${data.user.name}!`);
    } catch (err: any) { showToast(err.message, 'error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#010509' }}>

      {/* Grid pattern */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />

      {/* Radial blue glow */}
      <div className="absolute pointer-events-none"
        style={{
          width: 800, height: 800,
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(43,127,255,0.08) 0%, transparent 65%)',
          borderRadius: '50%',
        }} />

      {/* Animated Orb */}
      <div className="absolute pointer-events-none" style={{ left: '50%', top: '38%', transform: 'translate(-50%, -50%)' }}>
        <div className="orb-bg-glow" />
        <div className="orb-container">
          <div className="orb-sphere" />
          <div className="orb-orbits">
            <div className="orb-ring orb-ring-1"><div className="orb-electron" /></div>
            <div className="orb-ring orb-ring-2"><div className="orb-electron" /></div>
            <div className="orb-ring orb-ring-3"><div className="orb-electron" /></div>
          </div>
        </div>
      </div>

      {/* Main Login Content */}
      <div className="w-full max-w-md relative z-10" style={{ marginTop: '160px' }}>
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2"
            style={{
              padding: '6px 16px',
              borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.04)',
            }}>
            <Sparkles size={14} style={{ color: '#9810fa' }} />
            <span style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 600,
              fontSize: '10px',
              lineHeight: '18px',
              letterSpacing: '2px',
              textTransform: 'uppercase' as const,
              color: 'rgba(255,255,255,0.8)',
            }}>SMART TRANSPORT PLATFORM</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-white mb-3">
            Welcome to <span className="text-gradient">TransitOps</span>
          </h1>
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '15px',
            lineHeight: '24px',
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '380px',
            margin: '0 auto',
          }}>
            One system of record for vehicles, drivers, trips, maintenance, and money — with guardrails baked in.
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4), 0 0 60px rgba(152,16,250,0.04)',
          marginBottom: '24px',
        }}>
          <h2 className="text-white font-semibold text-lg mb-5 font-heading">Sign in to your account</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@company.com" />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="btn btn-primary w-full py-3 text-base"
              style={{ borderRadius: '12px' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px' }}>Need an account?</span>{' '}
            <Link to="/register" style={{ color: '#2b7fff', fontWeight: 600 }}>
              Create one
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-4">
          <div style={{ flex: 1, maxWidth: 100, height: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15))' }} />
          <p className="section-label text-center" style={{ fontSize: '10px' }}>Demo profile IDs</p>
          <div style={{ flex: 1, maxWidth: 100, height: 1, background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.15))' }} />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-2 rounded-full text-xs" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.72)', border: '1px solid rgba(255,255,255,0.08)' }}>fleet@transitops.io</span>
          <span className="px-3 py-2 rounded-full text-xs" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.72)', border: '1px solid rgba(255,255,255,0.08)' }}>driver@transitops.io</span>
          <span className="px-3 py-2 rounded-full text-xs" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.72)', border: '1px solid rgba(255,255,255,0.08)' }}>safety@transitops.io</span>
          <span className="px-3 py-2 rounded-full text-xs" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.72)', border: '1px solid rgba(255,255,255,0.08)' }}>finance@transitops.io</span>
        </div>
      </div>
    </div>
  );
}
