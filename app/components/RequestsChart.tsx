'use client';

import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RequestData {
  time: string;
  requests: number;
}

interface RequestsChartProps {
  data: RequestData[];
  darkMode: boolean;
}

export default function RequestsChart({ data, darkMode }: RequestsChartProps) {
  const cardBg = darkMode ? 'bg-[#0d1c18]' : 'bg-white';
  const borderColor = darkMode ? 'border-white/10' : 'border-[#10251e]/10';

  return (
    <section className={`${cardBg} rounded-3xl border ${borderColor} p-5 sm:p-6`}>
      <div className="mb-6 flex items-center justify-between"><h2 className="flex items-center gap-2 text-base font-semibold">
        <TrendingUp className="text-[#20b976]" size={18} />
        Request volume
      </h2>
      <span className={`text-xs ${darkMode ? 'text-white/35' : 'text-[#10251e]/45'}`}>Last 6 hours</span></div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
          <XAxis dataKey="time" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
          <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
          <Tooltip 
            contentStyle={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: darkMode ? '#f3f4f6' : '#111827',
            }}
            labelStyle={{ color: darkMode ? '#f3f4f6' : '#111827' }}
          />
          <Line 
            type="monotone" 
            dataKey="requests" 
            stroke="#20b976"
            strokeWidth={3} 
            dot={{ fill: '#20b976', r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}
