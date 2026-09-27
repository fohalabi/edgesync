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

export default function StatsCard({ title, value, trend, icon: Icon, iconColor, darkMode }: StatsCardProps) {
  const cardBg = darkMode ? 'bg-[#0d1c18]' : 'bg-white';
  const borderColor = darkMode ? 'border-white/10' : 'border-[#10251e]/10';
  const textSecondary = darkMode ? 'text-white/40' : 'text-[#10251e]/50';

  return (
    <article className={`${cardBg} rounded-2xl border ${borderColor} p-5 transition hover:-translate-y-0.5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-medium ${textSecondary}`}>{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-.04em]">{value}</p>
          <p className={`mt-2 text-xs ${textSecondary}`}>
            {trend}
          </p>
        </div>
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${darkMode ? 'bg-white/5' : 'bg-[#10251e]/5'} ${iconColor}`}><Icon size={19} /></span>
      </div>
    </article>
  );
}
