import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subValue, trend, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</h3>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <div className="mt-2">
        <div className="text-3xl font-bold text-slate-800">{value}</div>
        {subValue && (
          <div className={`text-sm mt-1 font-medium ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500'
          }`}>
            {subValue}
          </div>
        )}
      </div>
    </div>
  );
};
