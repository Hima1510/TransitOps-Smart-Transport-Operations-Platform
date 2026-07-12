import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';
import { Sparkles, User, Mail, Lock, Truck, UserCircle, Shield, BarChart3 } from 'lucide-react';

const roles = [
  { value: 'fleet_manager', label: 'Fleet Manager', desc: 'Full platform access', icon: Truck, gradient: 'linear-gradient(135deg, #155dfc, #2b7fff)' },
  { value: 'driver', label: 'Driver', desc: 'Trips & assigned vehicle', icon: UserCircle, gradient: 'linear-gradient(135deg, #059669, #34d399)' },
  { value: 'safety_officer', label: 'Safety Officer', desc: 'Compliance & licensing', icon: Shield, gradient: 'linear-gradient(135deg, #d97706, #fbbf24)' },
  { value: 'financial_analyst', label: 'Financial Analyst', desc: 'Costs, fuel & ROI', icon: BarChart3, gradient: 'linear-gradient(135deg, #9810fa, #c084fc)' },
];

export default function Register() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('fleet_manager');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      showToast('All fields are required', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await api.register(name, email, password, role);
      login(data.token, data.user);
      showToast(`Account created! Welcome, ${data.user.name}!`);
      navigate('/');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}>

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
          left: '50%', top: '42%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(43,127,255,0.08) 0%, transparent 65%)',
          borderRadius: '50%',
        }} />

      {/* Animated Orb */}
      <div className="absolute pointer-events-none" style={{ left: '50%', top: '30%', transform: 'translate(-50%, -50%)' }}>
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

      <div className="w-full max-w-md relative z-10" style={{ marginTop: '160px' }}>
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
        <div className="text-center mb-6">
          <h1 className="font-heading text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Create your <span className="text-gradient">TransitOps</span> Account
          </h1>
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '14px',
            lineHeight: '22px',
            color: 'var(--text-secondary)',
            maxWidth: '420px',
            margin: '0 auto',
          }}>
            Register now to manage your fleet assets, drivers, trips, and expenses in one single pane of glass.
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-card)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '20px',
        }}>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <User size={16} />
                  </span>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    className="input-field pl-10"
                    placeholder="John Doe" required />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Mail size={16} />
                  </span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="john@company.com" required />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Lock size={16} />
                </span>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="At least 6 characters" required />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Select Your Role</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {roles.map(r => (
                  <button key={r.value} type="button" onClick={() => setRole(r.value)}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all group text-left cursor-pointer"
                    style={{
                      background: role === r.value ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                      border: role === r.value 
                        ? '1px solid rgba(43,127,255,0.5)' 
                        : '1px solid rgba(255,255,255,0.06)',
                      boxShadow: role === r.value ? '0 0 15px rgba(43,127,255,0.1)' : 'none',
                    }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{ background: r.gradient, boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                      <r.icon size={17} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{r.label}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '11px' }} className="truncate">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn btn-primary w-full py-3 text-base mt-2 cursor-pointer"
              style={{ borderRadius: '12px' }}>
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div className="text-center mt-5">
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Already have an account? </span>
            <Link to="/login" className="text-gradient hover:underline font-semibold" style={{ fontSize: '14px' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
