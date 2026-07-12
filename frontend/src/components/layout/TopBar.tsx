import { useState, useEffect } from 'react';
import { Sun, Moon, Search, Bell } from 'lucide-react';

export default function TopBar() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    // Always dark mode
    document.documentElement.classList.add('dark');
    localStorage.setItem('transitops_theme', 'dark');
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('transitops_theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <header className="h-[64px] flex items-center justify-between px-6 sticky top-0 z-40"
      style={{
        background: 'rgba(1, 5, 9, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
      <div className="flex items-center gap-3 flex-1">
        <div className="relative max-w-md flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <input
            type="text"
            placeholder="Search vehicles, drivers, trips..."
            className="input-field pl-9 text-sm"
            style={{
              background: 'rgba(255,255,255,0.04)',
              borderColor: 'rgba(255,255,255,0.06)',
              borderRadius: '100px',
              height: '38px',
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative p-2.5 rounded-xl transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}>
          <Bell size={17} style={{ color: 'rgba(255,255,255,0.5)' }} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ background: '#9810fa', boxShadow: '0 0 6px rgba(152,16,250,0.5)' }} />
        </button>
        <button
          onClick={() => setDark(!dark)}
          className="p-2.5 rounded-xl transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
          title={dark ? 'Light mode' : 'Dark mode'}>
          {dark ? <Sun size={17} style={{ color: '#fbbf24' }} /> : <Moon size={17} className="text-secondary-color" />}
        </button>
      </div>
    </header>
  );
}
