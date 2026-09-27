'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeSurface({ children }: { children: React.ReactNode }) {
  const { darkMode, toggleTheme } = useTheme();
  return <div className={darkMode ? 'workspace-theme workspace-dark' : 'workspace-theme workspace-light'}>
    {children}
    <button onClick={toggleTheme} className="fixed bottom-6 left-6 z-[80] grid h-11 w-11 place-items-center rounded-full border border-current/10 bg-[var(--workspace-card)] text-[var(--workspace-text)] shadow-lg" aria-label={darkMode ? 'Use light theme' : 'Use dark theme'}>{darkMode ? <Sun size={18}/> : <Moon size={18}/>}</button>
  </div>;
}
