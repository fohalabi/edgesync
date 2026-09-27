'use client';

import { Globe, Zap, Clock, Users, Github, Sun, Moon, LogOut, Settings2, MousePointerClick } from 'lucide-react';
import Link from 'next/link';
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

  const bgClass = darkMode ? 'bg-[#07110f] text-gray-100' : 'bg-[#f4f8f4] text-gray-900';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-200 p-4 sm:p-6`}>
      {/* Header */}
      <div className="max-w-[96rem] mx-auto mb-8">
          <div className="flex items-center justify-between">
          <div className='flex items-center gap-3'>
            <Link href="/" className="grid h-10 w-10 place-items-center rounded-xl bg-[#76f7b2] text-[#07110f]" aria-label="Back to home"><Zap size={20} fill="currentColor" /></Link>
            <div><span className='block text-xl font-semibold tracking-tight'>EdgeSync</span><span className={`text-xs ${textSecondary}`}>Overview</span></div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block"><p className="text-sm font-medium">{user.name}</p><p className={`text-xs ${textSecondary}`}>{user.email}</p></div>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border ${borderColor} hover:opacity-80 transition-opacity`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <a 
              href="https://github.com/fohalabi/edgesync"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 hover:opacity-80 transition-opacity flex items-center gap-2`}
            >
              <Github size={20} />
            </a>
            <form action="/api/auth/logout" method="post">
              <button type="submit" className={`p-2 rounded-lg border ${borderColor} hover:text-red-500 transition-colors`} aria-label="Sign out"><LogOut size={20} /></button>
            </form>
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div><h1 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Edge intelligence, at a glance.</h1><p className={`mt-2 ${textSecondary}`}>Measured personalization activity from the last 30 days.</p></div>
          <div className="flex gap-2"><Link href="/dashboard/rules" className="flex items-center gap-2 rounded-full border border-current/10 px-4 py-2 text-sm"><Settings2 size={15} />Rules</Link><Link href="/dashboard/experiments" className="rounded-full border border-current/10 px-4 py-2 text-sm">Experiments</Link><span className="w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-500">Live data</span></div>
        </div>
      </div>

      <div className="max-w-[96rem] mx-auto space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value={analytics.totals.visitors.toLocaleString()}
            trend={`${analytics.totals.impressions.toLocaleString()} impressions`}
            trendUp={true}
            icon={Users}
            iconColor="text-blue-500"
            darkMode={darkMode}
          />
          <StatsCard
            title="Avg Latency"
            value={`${analytics.totals.avgLatency}ms`}
            trend={`P95 ${analytics.totals.p95Latency}ms`}
            trendUp={true}
            icon={Clock}
            iconColor="text-green-500"
            darkMode={darkMode}
          />
          <StatsCard
            title="Conversions"
            value={analytics.totals.conversions.toLocaleString()}
            trend={`${analytics.totals.conversionRate}% rate`}
            trendUp={true}
            icon={MousePointerClick}
            iconColor="text-orange-500"
            darkMode={darkMode}
          />
          <StatsCard
            title="Active Regions"
            value={analytics.totals.regions}
            trend="observed countries"
            trendUp={true}
            icon={Globe}
            iconColor="text-blue-500"
            darkMode={darkMode}
          />
        </div>

        {/* User Personalization Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RegionList regions={analytics.regions} darkMode={darkMode} />
          <UserSegments segments={analytics.segments} darkMode={darkMode} />
        </div>

        {/* Performance Metrics */}
        <RequestsChart data={analytics.requests} darkMode={darkMode} />

        {/* Live Log Feed */}
        <LiveLogFeed logs={analytics.logs} darkMode={darkMode} />
      </div>
    </div>
  );
}
