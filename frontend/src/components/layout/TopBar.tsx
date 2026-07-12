import { useState, useEffect } from 'react';
import { Sun, Moon, Search, Bell } from 'lucide-react';

export default function TopBar() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('transitops_theme') !== 'light';
  });

  useEffect(() => {
    const theme = dark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('transitops_theme', theme);
  }, [dark]);

  return (
    <header className="h-[64px] flex items-center justify-between px-6 sticky top-0 z-40"
      style={{
        background: 'var(--bg-card)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
      }}>
      <div className="flex items-center gap-3 flex-1">
        <div className="relative max-w-md flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search vehicles, drivers, trips..."
            className="input-field pl-11 pr-4 text-sm"
            style={{
              background: 'var(--bg-input)',
              borderColor: 'var(--border-color)',
              borderRadius: '9999px',
              height: '40px',
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative p-2.5 rounded-xl transition-colors border"
          style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-input)')}>
          <Bell size={17} style={{ color: 'var(--text-secondary)' }} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ background: '#9810fa', boxShadow: '0 0 6px rgba(152,16,250,0.5)' }} />
        </button>
        <button
          onClick={() => setDark(!dark)}
          className="p-2.5 rounded-xl transition-colors border"
          style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-input)')}
          title={dark ? 'Light mode' : 'Dark mode'}>
          {dark ? <Sun size={17} style={{ color: '#fbbf24' }} /> : <Moon size={17} style={{ color: 'var(--text-primary)' }} />}
        </button>
      </div>
    </header>
  );
}
