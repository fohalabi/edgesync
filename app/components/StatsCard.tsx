'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  icon: LucideIcon;
  iconColor: string;
  darkMode: boolean;
}

export default function StatsCard({ title, value, trend, trendUp, icon: Icon, iconColor, darkMode }: StatsCardProps) {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${textSecondary}`}>{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          <p className={`text-sm mt-1 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </p>
        </div>
        <Icon className={iconColor} size={32} />
      </div>
    </div>
  );
}