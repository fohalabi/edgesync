'use client';

import { Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  edge: number;
  origin: number;
}

interface PerformanceChartProps {
  data: ChartData[];
  darkMode: boolean;
}

export default function PerformanceChart({ data, darkMode }: PerformanceChartProps) {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Activity className="text-blue-500" size={20} />
        Edge vs Origin Response Time
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
          <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
          <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
          <Tooltip 
            contentStyle={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="edge" fill="#3b82f6" name="Edge (ms)" radius={[8, 8, 0, 0]} />
          <Bar dataKey="origin" fill="#ef4444" name="Origin (ms)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}