import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';
import { Sparkles } from 'lucide-react';

export default function Register() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'select_role' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!form.name || !form.email || !form.password) return;
    if (!form.role || form.role === 'select_role') {
      showToast('Role not selected', 'error');
      return;
    }
    if (form.password !== form.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await api.register(form.name, form.email, form.password, form.role);
      login(data.token, data.user);
      showToast(`Welcome aboard, ${data.user.name}!`);
      navigate('/');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#010509' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />

      <div className="absolute pointer-events-none"
        style={{
          width: 800, height: 800,
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(43,127,255,0.08) 0%, transparent 65%)',
          borderRadius: '50%',
        }} />

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

        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-white mb-3">
            Create your <span className="text-gradient">TransitOps</span> account
          </h1>
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '15px',
            lineHeight: '24px',
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '380px',
            margin: '0 auto',
          }}>
            Register to manage vehicles, drivers, trips, maintenance, and fleet insights in one place.
          </p>
        </div>

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
          <h2 className="text-white font-semibold text-lg mb-5 font-heading">Sign up for TransitOps</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="input-field"
                placeholder="Full Name" required />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field"
                placeholder="you@company.com" required />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="input-field" required>
                <option value="select_role">Select Role</option>
                <option value="fleet_manager">Fleet Manager</option>
                <option value="driver">Driver</option>
                <option value="safety_officer">Safety Officer</option>
                <option value="financial_analyst">Financial Analyst</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Password</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                className="input-field"
                placeholder="••••••••" required />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Confirm Password</label>
              <input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                className="input-field"
                placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading}
              className="btn btn-primary w-full py-3 text-base"
              style={{ borderRadius: '12px' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px' }}>Already have an account?</span>{' '}
            <Link to="/login" style={{ color: '#2b7fff', fontWeight: 600 }}>
              Sign in
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
