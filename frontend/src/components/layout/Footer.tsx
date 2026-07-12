import { Link } from 'react-router-dom';
import { Truck, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#010509', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #155dfc, #9810fa)' }}>
                <Truck size={18} className="text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-white">TransitOps</span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 360 }}>
              The smart transport operations platform for modern fleets. Track, manage, and optimize your entire fleet operation with AI-driven insights.
            </p>
            <div className="flex gap-3">
              {[Github, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                  <Icon size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 font-heading">Platform</h4>
            <ul className="space-y-2.5">
              {['Fleet Dashboard', 'Vehicle Tracking', 'Trip Management', 'Maintenance', 'Reports & Analytics'].map(item => (
                <li key={item}><Link to="/login" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 font-heading">Get Started</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Sign Up', to: '/signup' },
                { label: 'Log In', to: '/login' },
                { label: 'Demo Access', to: '/login' },
              ].map(item => (
                <li key={item.label}><Link to={item.to} className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>{item.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} TransitOps. Built for Odoo Hackathon.
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Smart Transport Operations Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
