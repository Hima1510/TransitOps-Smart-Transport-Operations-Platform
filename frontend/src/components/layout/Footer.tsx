import { Truck, Sparkles, Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', background: 'rgba(1, 5, 9, 0.4)', backdropFilter: 'blur(10px)' }}>
      <div className="px-6 py-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #155dfc 0%, #9810fa 100%)' }}>
              <Truck size={12} className="text-white" />
            </div>
            <span className="font-heading text-sm font-bold text-white leading-tight">TransitOps</span>
            <div className="flex items-center gap-1">
              <Sparkles size={8} style={{ color: '#9810fa' }} />
              <span className="text-[8px] font-medium tracking-wider uppercase" style={{ color: 'rgba(152, 16, 250, 0.7)' }}>Platform</span>
            </div>
          </div>
          <p className="text-xs max-w-md text-left" style={{ color: 'rgba(255, 255, 255, 0.45)', lineHeight: '18px' }}>
            Centralized intelligent hub for managing fleet assets, real-time dispatch operations, maintenance schedules, and financial intelligence. Built with robust validation guardrails.
          </p>
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            <a href="/" className="transition-all hover:text-white hover:underline">Dashboard</a>
            <a href="/vehicles" className="transition-all hover:text-white hover:underline">Vehicles</a>
            <a href="/drivers" className="transition-all hover:text-white hover:underline">Drivers</a>
            <a href="/trips" className="transition-all hover:text-white hover:underline">Trips</a>
            <a href="/maintenance" className="transition-all hover:text-white hover:underline">Maintenance</a>
            <a href="/fuel-expenses" className="transition-all hover:text-white hover:underline">Expenses</a>
            <a href="/reports" className="transition-all hover:text-white hover:underline">Reports</a>
          </div>
        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="px-6 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" 
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)', background: 'rgba(0, 0, 0, 0.2)' }}>
        <p className="text-[11px]" style={{ color: 'rgba(255, 255, 255, 0.35)' }}>
          © {new Date().getFullYear()} TransitOps. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <Activity size={12} className="text-emerald-500 animate-pulse" />
          <span className="text-[11px]" style={{ color: 'rgba(255, 255, 255, 0.45)' }}>System Status: </span>
          <span className="text-[11px] font-semibold text-emerald-400">Optimal</span>
        </div>
      </div>
    </footer>
  );
}
