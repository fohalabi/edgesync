'use client';

import { Activity, BarChart3, Clock3, FlaskConical, Github, Globe2, History, LogOut, Menu, Moon, MousePointerClick, Settings2, Sun, Users, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import type { SessionUser } from '@/lib/auth/token';
import type { DashboardAnalytics } from '@/lib/analytics';
import StatsCard from './StatsCard';
import RegionList from './RegionList';
import UserSegments from './UserSegment';
import RequestsChart from './RequestsChart';
import LiveLogFeed from './LiveLogFeed';

export default function EdgeDashboard({ user, analytics }: { user: SessionUser; analytics: DashboardAnalytics }) {
  const { darkMode, toggleTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const page = darkMode ? 'bg-[#07110f] text-[#effff7]' : 'bg-[#f4f8f4] text-[#10251e]';
  const muted = darkMode ? 'text-white/45' : 'text-[#10251e]/55';
  const border = darkMode ? 'border-white/10' : 'border-[#10251e]/10';

  return <div className={`min-h-screen ${page} transition-colors duration-200`}>
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r ${border} ${darkMode ? 'bg-[#08130f]' : 'bg-white'} p-5 transition-transform lg:translate-x-0 ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between"><Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#76f7b2] text-[#07110f]"><Zap size={19} fill="currentColor" /></span><span className="text-lg font-semibold tracking-[-.03em]">EdgeSync</span></Link><button onClick={() => setMobileNavOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg lg:hidden" aria-label="Close navigation"><X size={18} /></button></div>
      <p className={`mt-8 px-3 text-[10px] font-semibold uppercase tracking-[.2em] ${muted}`}>Workspace</p>
      <nav className="mt-3 space-y-1"><NavItem href="/dashboard" icon={<BarChart3 size={17} />} label="Analytics" active /><NavItem href="/dashboard/rules" icon={<Settings2 size={17} />} label="Rules" /><NavItem href="/dashboard/experiments" icon={<FlaskConical size={17} />} label="Experiments" /><NavItem href="/dashboard/activity" icon={<History size={17} />} label="Activity" /></nav>
      <div className={`mt-auto rounded-2xl border ${border} p-4`}><div className="flex items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#76f7b2]/15 text-xs font-semibold text-[#20b976]">{initials(user.name)}</span><div className="min-w-0"><p className="truncate text-sm font-medium">{user.name}</p><p className={`truncate text-xs ${muted}`}>{user.email}</p></div></div><form action="/api/auth/logout" method="post"><button className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl border ${border} px-3 py-2 text-xs transition hover:text-red-400`}><LogOut size={14} />Sign out</button></form></div>
    </aside>
    {mobileNavOpen && <button className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation overlay" />}

    <main className="min-h-screen lg:pl-72">
      <header className={`sticky top-0 z-30 flex h-20 items-center justify-between border-b ${border} ${darkMode ? 'bg-[#07110f]/85' : 'bg-[#f4f8f4]/85'} px-5 backdrop-blur-xl sm:px-8`}><div className="flex items-center gap-3"><button onClick={() => setMobileNavOpen(true)} className={`grid h-10 w-10 place-items-center rounded-xl border ${border} lg:hidden`} aria-label="Open navigation"><Menu size={19} /></button><div><p className="text-sm font-semibold">Analytics overview</p><p className={`hidden text-xs sm:block ${muted}`}>Live personalization health and performance</p></div></div><div className="flex items-center gap-2"><span className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-500 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Live data</span><button onClick={toggleTheme} className={`grid h-10 w-10 place-items-center rounded-xl border ${border}`} aria-label={darkMode ? 'Use light theme' : 'Use dark theme'} aria-pressed={darkMode}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button><a href="https://github.com/fohalabi/edgesync" target="_blank" rel="noopener noreferrer" className={`grid h-10 w-10 place-items-center rounded-xl border ${border}`} aria-label="View project on GitHub"><Github size={18} /></a></div></header>

      <div className="mx-auto max-w-[100rem] px-5 py-8 sm:px-8 lg:py-10">
        <section className={`relative overflow-hidden rounded-[2rem] border ${border} ${darkMode ? 'bg-[#0d1c18]' : 'bg-white'} p-6 sm:p-8`}><div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#76f7b2]/10 blur-3xl" /><div className="relative flex flex-col justify-between gap-8 xl:flex-row xl:items-end"><div><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#76f7b2]/20 bg-[#76f7b2]/5 px-3 py-1.5 text-xs text-[#20b976]"><Activity size={13} />Last 30 days</div><h1 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-.055em] sm:text-5xl">See every edge decision in context.</h1><p className={`mt-4 max-w-2xl text-sm leading-6 sm:text-base ${muted}`}>Understand who received a personalized experience, how quickly it arrived, and what converted—all from one operational view.</p></div><div className={`grid min-w-[280px] grid-cols-2 gap-px overflow-hidden rounded-2xl border ${border} ${darkMode ? 'bg-white/10' : 'bg-[#10251e]/10'}`}><HeroMetric label="Conversion rate" value={`${analytics.totals.conversionRate}%`} darkMode={darkMode} /><HeroMetric label="P95 latency" value={`${analytics.totals.p95Latency}ms`} darkMode={darkMode} /></div></div></section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatsCard title="Unique visitors" value={analytics.totals.visitors.toLocaleString()} trend={`${analytics.totals.impressions.toLocaleString()} impressions`} trendUp icon={Users} iconColor="text-blue-500" darkMode={darkMode} /><StatsCard title="Average latency" value={`${analytics.totals.avgLatency}ms`} trend={`P95 ${analytics.totals.p95Latency}ms`} trendUp icon={Clock3} iconColor="text-[#20b976]" darkMode={darkMode} /><StatsCard title="Conversions" value={analytics.totals.conversions.toLocaleString()} trend={`${analytics.totals.conversionRate}% conversion rate`} trendUp icon={MousePointerClick} iconColor="text-orange-500" darkMode={darkMode} /><StatsCard title="Active regions" value={analytics.totals.regions} trend="Observed countries" trendUp icon={Globe2} iconColor="text-violet-500" darkMode={darkMode} /></section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]"><RequestsChart data={analytics.requests} darkMode={darkMode} /><RegionList regions={analytics.regions} darkMode={darkMode} /></section>
        <section className="mt-5 grid gap-5 xl:grid-cols-[.75fr_1.25fr]"><UserSegments segments={analytics.segments} darkMode={darkMode} /><LiveLogFeed logs={analytics.logs} darkMode={darkMode} /></section>
      </div>
    </main>
  </div>;
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) { return <Link href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? 'bg-[#76f7b2] font-semibold text-[#07110f]' : 'opacity-55 hover:bg-current/5 hover:opacity-100'}`}>{icon}{label}</Link>; }
function HeroMetric({ label, value, darkMode }: { label: string; value: string; darkMode: boolean }) { return <div className={`${darkMode ? 'bg-[#0a1713]' : 'bg-[#f8fbf8]'} p-4`}><p className={`text-[10px] uppercase tracking-[.12em] ${darkMode ? 'text-white/35' : 'text-[#10251e]/45'}`}>{label}</p><p className="mt-2 text-2xl font-semibold tracking-[-.04em]">{value}</p></div>; }
function initials(name: string) { return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(); }
