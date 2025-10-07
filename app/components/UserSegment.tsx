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
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Users className="text-blue-500" size={20} />
        User Segments
      </h2>
      <div className="space-y-4">
        {segments.map((segment, idx) => (
          <div key={idx}>
            <div className="flex justify-between mb-2">
              <span className="font-medium">{segment.name}</span>
              <span className={textSecondary}>
                {segment.count.toLocaleString()} ({segment.percentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className={`${segment.color} h-3 rounded-full transition-all duration-500`}
                style={{width: `${segment.percentage}%`}}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}