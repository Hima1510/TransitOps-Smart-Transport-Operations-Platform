import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getNavItems } from '../../utils/helpers';
import { LayoutDashboard, Truck, Users, Route, Wrench, Fuel, BarChart3, LogOut, Sparkles } from 'lucide-react';

const iconMap: Record<string, any> = { LayoutDashboard, Truck, Users, Route, Wrench, Fuel, BarChart3 };

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navItems = getNavItems(user?.role || '');
  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] flex flex-col z-50"
      style={{
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}>
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
      style={{
          backgroundImage: 'var(--sidebar-grid)',
          backgroundSize: '48px 48px',
        }} />

      {/* Logo */}
      <div className="relative px-6 py-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #155dfc 0%, #9810fa 100%)', boxShadow: '0 4px 16px rgba(152, 16, 250, 0.3)' }}>
            <Truck size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg leading-tight" style={{ color: 'var(--sidebar-text)' }}>TransitOps</h1>
            <div className="flex items-center gap-1.5">
              <Sparkles size={10} style={{ color: '#9810fa' }} />
              <p className="text-[10px] font-medium tracking-wider uppercase" style={{ color: 'rgba(152, 16, 250, 0.85)' }}>Smart Fleet Platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="section-label px-3 mb-3">Navigation</p>
        {navItems.map(item => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          return (
            <NavLink key={item.path} to={item.path} end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                    ? ''
                    : ''
                }`
              }
              style={({ isActive }) => isActive ? {
                background: 'var(--sidebar-icon-active-bg)',
                borderLeft: '2px solid transparent',
                borderImage: 'linear-gradient(to bottom, #2b7fff, #9810fa) 1',
                boxShadow: '0 0 20px rgba(152, 16, 250, 0.06)',
                color: 'var(--sidebar-text)',
              } : { color: 'var(--sidebar-muted)' }}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all`}
                style={{ background: 'var(--sidebar-icon-bg)' }}>
                <Icon size={16} />
              </div>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="relative px-4 py-4" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-3 mb-3 p-2 rounded-xl" style={{ background: 'rgba(127, 127, 127, 0.08)' }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #2b7fff, #9810fa)', boxShadow: '0 2px 10px rgba(152, 16, 250, 0.25)' }}>
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--sidebar-text)' }}>{user?.name}</p>
            <p className="text-[11px] capitalize" style={{ color: 'var(--sidebar-subtle)' }}>{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button onClick={logout}
          className="flex items-center gap-2 text-sm transition-colors w-full px-2 py-2 rounded-lg hover:bg-red-500/10"
          style={{ color: 'var(--sidebar-subtle)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--sidebar-subtle)')}>
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
