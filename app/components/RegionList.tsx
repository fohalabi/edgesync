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
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <MapPin className="text-blue-500" size={20} />
        Active Regions
      </h2>
      <div className="space-y-3">
        {regions.map((region, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between p-3 rounded-lg bg-opacity-50" 
            style={{backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'}}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{region.flag}</span>
              <div>
                <p className="font-semibold">{region.region}</p>
                <p className={`text-sm ${textSecondary}`}>{region.users.toLocaleString()} users</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-green-500 font-bold">{region.latency}ms</p>
              <p className={`text-xs ${textSecondary}`}>avg latency</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
