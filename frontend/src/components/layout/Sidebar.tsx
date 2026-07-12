import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getNavItems } from '../../utils/helpers';
import { LayoutDashboard, Truck, Users, Route, Wrench, Fuel, BarChart3, LogOut } from 'lucide-react';

const iconMap: Record<string, any> = { LayoutDashboard, Truck, Users, Route, Wrench, Fuel, BarChart3 };

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navItems = getNavItems(user?.role || '');
  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] flex flex-col z-50" style={{ background: 'var(--bg-sidebar)' }}>
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center"><Truck size={20} className="text-white" /></div>
          <div><h1 className="text-white font-bold text-lg leading-tight">TransitOps</h1><p className="text-blue-300/60 text-[11px]">Smart Fleet Platform</p></div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => { const Icon = iconMap[item.icon] || LayoutDashboard; return (
          <NavLink key={item.path} to={item.path} end={item.path === '/'}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Icon size={18} />{item.label}
          </NavLink>
        ); })}
      </nav>
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{user?.name?.charAt(0)}</div>
          <div className="flex-1 min-w-0"><p className="text-white text-sm font-medium truncate">{user?.name}</p><p className="text-slate-500 text-[11px] capitalize">{user?.role?.replace('_', ' ')}</p></div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-slate-500 hover:text-red-400 text-sm transition-colors w-full"><LogOut size={15} /> Sign Out</button>
      </div>
    </aside>
  );
}
