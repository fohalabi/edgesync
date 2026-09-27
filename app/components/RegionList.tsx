'use client'

import { MapPin } from 'lucide-react';

interface Region {
  region: string;
  users: number;
  latency: number;
  flag: string;
}

interface RegionListProps {
  regions: Region[];
  darkMode: boolean;
}

export default function RegionList({ regions, darkMode }: RegionListProps) {
  const cardBg = darkMode ? 'bg-[#0d1c18]' : 'bg-white';
  const borderColor = darkMode ? 'border-white/10' : 'border-[#10251e]/10';
  const textSecondary = darkMode ? 'text-white/40' : 'text-[#10251e]/50';

  return (
    <section className={`${cardBg} rounded-3xl border ${borderColor} p-5 sm:p-6`}>
      <h2 className="mb-5 flex items-center gap-2 text-base font-semibold">
        <MapPin className="text-[#20b976]" size={18} />
        Active Regions
      </h2>
      <div className="space-y-3">
        {regions.length === 0 && <p className={`py-10 text-center text-sm ${textSecondary}`}>No regional activity recorded yet.</p>}
        {regions.map((region, idx) => (
          <div 
            key={idx} 
            className={`flex items-center justify-between rounded-xl border ${borderColor} p-3`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{region.flag}</span>
              <div>
                <p className="font-semibold">{region.region}</p>
                <p className={`text-sm ${textSecondary}`}>{region.users.toLocaleString()} users</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-semibold text-[#20b976]">{region.latency}ms</p>
              <p className={`text-xs ${textSecondary}`}>avg latency</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
