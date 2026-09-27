'use client';

import { Users } from 'lucide-react'

interface Segment {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface UserSegmentsProps {
  segments: Segment[];
  darkMode: boolean;
}

export default function UserSegments({ segments, darkMode }: UserSegmentsProps) {
  const cardBg = darkMode ? 'bg-[#0d1c18]' : 'bg-white';
  const borderColor = darkMode ? 'border-white/10' : 'border-[#10251e]/10';
  const textSecondary = darkMode ? 'text-white/40' : 'text-[#10251e]/50';

  return (
    <section className={`${cardBg} rounded-3xl border ${borderColor} p-5 sm:p-6`}>
      <h2 className="mb-5 flex items-center gap-2 text-base font-semibold">
        <Users className="text-[#20b976]" size={18} />
        User Segments
      </h2>
      <div className="space-y-4">
        {segments.length === 0 && <p className={`py-10 text-center text-sm ${textSecondary}`}>No segment impressions recorded yet.</p>}
        {segments.map((segment, idx) => (
          <div key={idx}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="max-w-[65%] truncate font-medium">{segment.name}</span>
              <span className={`text-xs ${textSecondary}`}>
                {segment.count.toLocaleString()} ({segment.percentage}%)
              </span>
            </div>
            <div className={`h-3 w-full rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className={`${segment.color} h-3 rounded-full transition-all duration-500`}
                style={{width: `${segment.percentage}%`}}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
