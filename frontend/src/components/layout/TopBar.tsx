import { useState, useEffect } from 'react';
import { Sun, Moon, Bell } from 'lucide-react';

export default function TopBar() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('transitops_theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const useDark = saved ? saved === 'dark' : prefersDark;
    setDark(useDark);
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
        background: 'var(--bg-card)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
      }}>
      <div className="flex items-center gap-3 flex-1">
        <div className="relative max-w-md flex-1">
          <input
            type="text"
            placeholder="Search vehicles, drivers, trips..."
            className="input-field text-sm"
            style={{
              background: 'var(--bg-card-solid)',
              borderColor: 'var(--border-color)',
              borderRadius: '100px',
              height: '38px',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative p-2.5 rounded-xl transition-colors"
          style={{ background: 'rgba(127,127,127,0.08)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(127,127,127,0.12)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(127,127,127,0.08)')}>
          <Bell size={17} style={{ color: 'var(--text-secondary)' }} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ background: '#9810fa', boxShadow: '0 0 6px rgba(152,16,250,0.5)' }} />
        </button>
        <button
          onClick={() => setDark(!dark)}
          className="p-2.5 rounded-xl transition-colors"
          style={{ background: 'rgba(127,127,127,0.08)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(127,127,127,0.12)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(127,127,127,0.08)')}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
          {dark ? <Sun size={17} style={{ color: '#fbbf24' }} /> : <Moon size={17} style={{ color: 'var(--text-primary)' }} />}
        </button>
      </div>
    </header>
  );
}
