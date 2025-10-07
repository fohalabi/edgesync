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
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Cpu className="text-blue-500" size={20} />
        Content Personalization Log
        <span className="ml-auto flex items-center gap-2 text-sm text-green-500 font-normal">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Live
        </span>
      </h2>
      <div className={`space-y-2 font-mono text-sm ${textSecondary} max-h-80 overflow-y-auto`}>
        {logs.map((log) => (
          <div 
            key={log.id} 
            className={`p-3 rounded border ${borderColor} hover:bg-opacity-50 transition-all animate-slideIn`}
            style={{
              backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)'
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
    </div>
  );
}