import { Link } from 'react-router-dom';
import { Truck, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center px-3 pt-4 sm:pt-5">
      <div className="relative w-full max-w-[1200px]">
        <header className="pointer-events-auto flex w-full items-center justify-between gap-3 rounded-xl px-4 py-2 sm:gap-5 sm:px-[30px] transition-colors"
          style={{
            height: 56,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            color: '#fff',
          }}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #155dfc, #9810fa)' }}>
              <Truck size={16} className="text-white" />
            </div>
            <span className="font-heading font-bold text-lg text-white">TransitOps</span>
          </Link>

          {/* Nav (desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium uppercase">
            <a href="#features" className="leading-5 hover:text-white/80 transition-colors">Features</a>
            <a href="#how-it-works" className="leading-5 hover:text-white/80 transition-colors">How It Works</a>
            <a href="#stats" className="leading-5 hover:text-white/80 transition-colors">Stats</a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3" style={{ height: 28 }}>
            <Link to="/login"
              className="flex h-7 items-center justify-center rounded-md border px-3 text-xs font-medium transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: '#fff' }}>
              Log In
            </Link>
            <Link to="/signup"
              className="flex h-7 items-center justify-center rounded-md px-3 text-xs font-medium text-white whitespace-nowrap"
              style={{ background: 'linear-gradient(90deg, #155dfc, #9810fa)', borderRadius: '6.75px' }}>
              Sign Up Free
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link to="/login" className="text-xs font-medium px-3 py-1 rounded-md"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
              Log In
            </Link>
            <Link to="/signup" className="text-xs font-medium px-3 py-1 rounded-md text-white"
              style={{ background: 'linear-gradient(90deg, #155dfc, #9810fa)' }}>
              Sign Up
            </Link>
          </div>
        </header>
      </div>
    </div>
  );
}
