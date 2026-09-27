'use client';

import { BarChart3, FlaskConical, Github, History, LogOut, Menu, Moon, Settings2, Sun, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

type Section = 'analytics' | 'rules' | 'experiments' | 'activity';
const sections = [
  { id: 'analytics' as const, href: '/dashboard', label: 'Analytics', icon: BarChart3 },
  { id: 'rules' as const, href: '/dashboard/rules', label: 'Rules', icon: Settings2 },
  { id: 'experiments' as const, href: '/dashboard/experiments', label: 'Experiments', icon: FlaskConical },
  { id: 'activity' as const, href: '/dashboard/activity', label: 'Activity', icon: History },
];

export default function WorkspaceShell({ active, title, description, children }: { active: Section; title: string; description: string; children: React.ReactNode }) {
  const { darkMode, toggleTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const page = darkMode ? 'bg-[#07110f] text-[#effff7]' : 'bg-[#f4f8f4] text-[#10251e]';
  const muted = darkMode ? 'text-white/45' : 'text-[#10251e]/55';
  const border = darkMode ? 'border-white/10' : 'border-[#10251e]/10';

  return <div data-theme={darkMode ? 'dark' : 'light'} className={`workspace-theme ${darkMode ? 'workspace-dark' : 'workspace-light'} min-h-screen ${page}`}>
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r ${border} ${darkMode ? 'bg-[#08130f]' : 'bg-white'} p-5 transition-transform lg:translate-x-0 ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between"><Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#76f7b2] text-[#07110f]"><Zap size={19} fill="currentColor" /></span><span className="text-lg font-semibold tracking-[-.03em]">EdgeSync</span></Link><button onClick={() => setMobileNavOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg lg:hidden" aria-label="Close navigation"><X size={18} /></button></div>
      <p className={`mt-8 px-3 text-[10px] font-semibold uppercase tracking-[.2em] ${muted}`}>Workspace</p>
      <nav className="mt-3 space-y-1">{sections.map(({ id, href, label, icon: Icon }) => <Link key={id} href={href} onClick={() => setMobileNavOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active === id ? 'bg-[#76f7b2] font-semibold text-[#07110f]' : 'opacity-55 hover:bg-current/5 hover:opacity-100'}`}><Icon size={17} />{label}</Link>)}</nav>
      <div className={`mt-auto rounded-2xl border ${border} p-4`}><p className="text-sm font-medium">Administrator workspace</p><p className={`mt-1 text-xs leading-5 ${muted}`}>Manage delivery logic and review every important change.</p><form action="/api/auth/logout" method="post"><button className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl border ${border} px-3 py-2 text-xs transition hover:text-red-400`}><LogOut size={14} />Sign out</button></form></div>
    </aside>
    {mobileNavOpen && <button className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation overlay" />}

    <main className="min-h-screen bg-[var(--workspace-page)] text-[var(--workspace-text)] lg:pl-72">
      <header className={`sticky top-0 z-30 flex h-20 items-center justify-between border-b ${border} ${darkMode ? 'bg-[#07110f]/85' : 'bg-[#f4f8f4]/85'} px-5 backdrop-blur-xl sm:px-8`}><div className="flex min-w-0 items-center gap-3"><button onClick={() => setMobileNavOpen(true)} className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${border} lg:hidden`} aria-label="Open navigation"><Menu size={19} /></button><div className="min-w-0"><p className="truncate text-sm font-semibold">{title}</p><p className={`hidden truncate text-xs sm:block ${muted}`}>{description}</p></div></div><div className="flex items-center gap-2"><button onClick={toggleTheme} className={`grid h-10 w-10 place-items-center rounded-xl border ${border}`} aria-label={darkMode ? 'Use light theme' : 'Use dark theme'} aria-pressed={darkMode}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button><a href="https://github.com/fohalabi/edgesync" target="_blank" rel="noopener noreferrer" className={`grid h-10 w-10 place-items-center rounded-xl border ${border}`} aria-label="View project on GitHub"><Github size={18} /></a></div></header>
      <div className="mx-auto max-w-[100rem] px-5 py-8 sm:px-8 lg:py-10">{children}</div>
    </main>
  </div>;
}
