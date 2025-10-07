'use client';

import { useState, useEffect } from 'react';
import { Globe, Zap, Activity, TrendingUp, Clock, Users } from 'lucide-react';
import StatsCard from './StatsCard';
import RegionList from './RegionList';
import UserSegments from './UserSegment';
import PerformanceChart from './PerformanceChart';
import RequestsChart from './RequestsChart';
import LiveLogFeed from './LiveLogFeed';
import ComingSoon from './ComingSoon';

export default function EdgeDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [logs, setLogs] = useState([
    { id: 1, time: '09:24:01', user: '0xA2F3B', location: 'Lagos', rule: 'Show ₦ Pricing', latency: '52ms' },
    { id: 2, time: '09:25:14', user: '0x33E8D', location: 'Paris', rule: 'Show € Banner', latency: '46ms' },
    { id: 3, time: '09:26:32', user: '0x7BC4A', location: 'New York', rule: 'Show $ Pricing', latency: '38ms' },
  ]);

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

  useEffect(() => {
    const interval = setInterval(() => {
      const locations = ['Lagos', 'Paris', 'New York', 'Tokyo', 'London', 'Berlin', 'Mumbai'];
      const rules = [
        'Show ₦ Pricing', 'Show € Banner', 'Show $ Pricing', 
        'Dark Mode', 'Mobile Layout', 'Premium Features',
        'Show ¥ Pricing', 'Show £ Banner'
      ];
      
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        user: `0x${Math.random().toString(16).substr(2, 5).toUpperCase()}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        rule: rules[Math.floor(Math.random() * rules.length)],
        latency: `${Math.floor(Math.random() * 40 + 35)}ms`
      };

      setLogs(prev => [newLog, ...prev.slice(0, 9)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const bgClass = darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-200 p-6`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Zap className="text-blue-500" size={32} />
              EdgeSync
            </h1>
            <p className={`mt-1 ${textSecondary}`}>Real-time intelligent content delivery at the edge</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-lg ${cardBg} border ${borderColor} hover:opacity-80 transition-opacity`}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
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

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}