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
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <TrendingUp className="text-blue-500" size={20} />
        Requests Per Minute
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
          <XAxis dataKey="time" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
          <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
          <Tooltip 
            contentStyle={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="requests" 
            stroke="#10b981" 
            strokeWidth={3} 
            dot={{ fill: '#10b981', r: 4 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}