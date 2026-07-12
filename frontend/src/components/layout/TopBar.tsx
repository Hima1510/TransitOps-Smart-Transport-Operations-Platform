import { useState, useEffect } from 'react';
import { Sun, Moon, Search } from 'lucide-react';
export default function TopBar() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => { if (dark) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); localStorage.setItem('transitops_theme', dark ? 'dark' : 'light'); }, [dark]);
  useEffect(() => { if (localStorage.getItem('transitops_theme') === 'dark') { setDark(true); document.documentElement.classList.add('dark'); } }, []);
  return (
    <header className="h-[60px] flex items-center justify-between px-6 border-b border-app bg-card-color sticky top-0 z-40">
      <div className="flex items-center gap-3 flex-1"><div className="relative max-w-md flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-color" /><input type="text" placeholder="Search vehicles, drivers, trips..." className="input-field pl-9 text-sm" /></div></div>
      <button onClick={() => setDark(!dark)} className="p-2.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors" title={dark ? 'Light mode' : 'Dark mode'}>
        {dark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-secondary-color" />}
      </button>
    </header>
  );
}
