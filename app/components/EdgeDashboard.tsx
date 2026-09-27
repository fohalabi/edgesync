'use client';

import { Globe, Zap, TrendingUp, Clock, Users, Github, Sun, Moon, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import type { SessionUser } from '@/lib/auth/token';
import StatsCard from './StatsCard';
import RegionList from './RegionList';
import UserSegments from './UserSegment';
import PerformanceChart from './PerformanceChart';
import RequestsChart from './RequestsChart';
import LiveLogFeed from './LiveLogFeed';
import ComingSoon from './ComingSoon';

export default function EdgeDashboard({ user }: { user: SessionUser }) {
  const { darkMode, toggleTheme } = useTheme();
  const logs = [
    { id: 1, time: '09:24:01', user: '0xA2F3B', location: 'Lagos', rule: 'Show ₦ Pricing', latency: '52ms' },
    { id: 2, time: '09:25:14', user: '0x33E8D', location: 'Paris', rule: 'Show € Banner', latency: '46ms' },
    { id: 3, time: '09:26:32', user: '0x7BC4A', location: 'New York', rule: 'Show $ Pricing', latency: '38ms' },
  ];

  const regionData = [
    { region: 'Lagos', users: 1247, latency: 45, flag: '🇳🇬' },
    { region: 'London', users: 892, latency: 50, flag: '🇬🇧' },
    { region: 'New York', users: 1543, latency: 38, flag: '🇺🇸' },
    { region: 'Singapore', users: 634, latency: 55, flag: '🇸🇬' },
    { region: 'São Paulo', users: 478, latency: 62, flag: '🇧🇷' },
  ];

  const segments = [
    { name: 'New Visitors', count: 2847, percentage: 45, color: 'bg-blue-500' },
    { name: 'Returning Users', count: 1923, percentage: 30, color: 'bg-green-500' },
    { name: 'Developers', count: 1586, percentage: 25, color: 'bg-orange-500' },
  ];

  const edgeVsOrigin = [
    { name: 'Lagos', edge: 45, origin: 380 },
    { name: 'London', edge: 50, origin: 420 },
    { name: 'NY', edge: 38, origin: 350 },
    { name: 'Singapore', edge: 55, origin: 460 },
    { name: 'São Paulo', edge: 62, origin: 490 },
  ];

  const requestsData = [
    { time: '09:00', requests: 1200 },
    { time: '09:15', requests: 1850 },
    { time: '09:30', requests: 2100 },
    { time: '09:45', requests: 1950 },
    { time: '10:00', requests: 2400 },
    { time: '10:15', requests: 2650 },
  ];

  const bgClass = darkMode ? 'bg-[#07110f] text-gray-100' : 'bg-[#f4f8f4] text-gray-900';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-200 p-4 sm:p-6`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
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
          <div><h1 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Edge intelligence, at a glance.</h1><p className={`mt-2 ${textSecondary}`}>A preview of the analytics workspace planned for Phase 6.</p></div>
          <span className="w-fit rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-500">Demo dataset · not live</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value="6,356"
            trend="12% today"
            trendUp={true}
            icon={Users}
            iconColor="text-blue-500"
            darkMode={darkMode}
          />
          <StatsCard
            title="Avg Latency"
            value="48ms"
            trend="8ms faster"
            trendUp={true}
            icon={Clock}
            iconColor="text-green-500"
            darkMode={darkMode}
          />
          <StatsCard
            title="Cache Hit Rate"
            value="94.2%"
            trend="2.1%"
            trendUp={true}
            icon={TrendingUp}
            iconColor="text-orange-500"
            darkMode={darkMode}
          />
          <StatsCard
            title="Active Regions"
            value="24"
            trend="5 continents"
            trendUp={true}
            icon={Globe}
            iconColor="text-blue-500"
            darkMode={darkMode}
          />
        </div>

        {/* User Personalization Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RegionList regions={regionData} darkMode={darkMode} />
          <UserSegments segments={segments} darkMode={darkMode} />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart data={edgeVsOrigin} darkMode={darkMode} />
          <RequestsChart data={requestsData} darkMode={darkMode} />
        </div>

        {/* Live Log Feed */}
        <LiveLogFeed logs={logs} darkMode={darkMode} />

        {/* Coming Soon Section */}
        <ComingSoon darkMode={darkMode} />
      </div>
    </div>
  );
}
