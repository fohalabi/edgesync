'use client';

import { Cpu } from 'lucide-react';

interface LogEntry {
  id: number;
  time: string;
  user: string;
  location: string;
  rule: string;
  latency: string;
}

interface LiveLogFeedProps {
  logs: LogEntry[];
  darkMode: boolean;
}

export default function LiveLogFeed({ logs, darkMode }: LiveLogFeedProps) {
  const cardBg = darkMode ? 'bg-[#0d1c18]' : 'bg-white';
  const borderColor = darkMode ? 'border-white/10' : 'border-[#10251e]/10';
  const textSecondary = darkMode ? 'text-white/40' : 'text-[#10251e]/50';

  return (
    <section className={`${cardBg} rounded-3xl border ${borderColor} p-5 sm:p-6`}>
      <h2 className="mb-5 flex items-center gap-2 text-base font-semibold">
        <Cpu className="text-[#20b976]" size={18} />
        Recent personalization decisions
        <span className="ml-auto flex items-center gap-2 text-xs font-normal text-[#20b976]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#20b976]" />Live
        </span>
      </h2>
      <div className={`space-y-2 font-mono text-sm ${textSecondary} max-h-80 overflow-y-auto`}>
        {logs.length === 0 && <p className="py-10 text-center font-sans text-sm">No impressions yet. Visit the homepage to generate the first event.</p>}
        {logs.map((log) => (
          <div 
            key={log.id} 
            className={`animate-slideIn rounded-xl border p-3 ${borderColor}`}
            style={{
              backgroundColor: darkMode ? 'rgba(255,255,255,.018)' : 'rgba(16,37,30,.018)'
            }}
          >
            <span className="text-blue-500">[{log.time}]</span> → 
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}> User: </span>
            <span className="text-orange-500">{log.user}</span> | 
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}> Location: </span>
            <span className="text-green-500">{log.location}</span> | 
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}> Rule: </span>
            <span className="text-blue-400">`{log.rule}`</span> | 
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}> Served in </span>
            <span className="text-green-500 font-bold">{log.latency}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
