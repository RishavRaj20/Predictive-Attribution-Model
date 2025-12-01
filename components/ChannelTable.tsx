import React from 'react';
import { ChannelData } from '../types';

interface ChannelTableProps {
  data: ChannelData[];
  onUpdate: (updatedChannel: ChannelData) => void;
}

export const ChannelTable: React.FC<ChannelTableProps> = ({ data, onUpdate }) => {
  
  const handleEdit = (channel: ChannelData, field: keyof ChannelData, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const updated = { ...channel, [field]: numValue };
    // Recalculate derived metrics
    if (field === 'spend' || field === 'conversions' || field === 'revenue') {
       updated.cpa = updated.conversions > 0 ? updated.spend / updated.conversions : 0;
       updated.roas = updated.spend > 0 ? updated.revenue / updated.spend : 0;
    }
    onUpdate(updated);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
          <tr>
            <th className="px-6 py-4">Channel</th>
            <th className="px-6 py-4 text-right">Spend ($)</th>
            <th className="px-6 py-4 text-right">Conversions</th>
            <th className="px-6 py-4 text-right">Revenue ($)</th>
            <th className="px-6 py-4 text-right">CPA ($)</th>
            <th className="px-6 py-4 text-right">ROAS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((channel) => (
            <tr key={channel.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-800">{channel.name}</td>
              <td className="px-6 py-4 text-right">
                <input 
                  type="number"
                  className="w-24 text-right border-b border-transparent focus:border-indigo-500 focus:outline-none bg-transparent hover:border-slate-300"
                  value={channel.spend}
                  onChange={(e) => handleEdit(channel, 'spend', e.target.value)}
                />
              </td>
              <td className="px-6 py-4 text-right">
                <input 
                  type="number"
                  className="w-20 text-right border-b border-transparent focus:border-indigo-500 focus:outline-none bg-transparent hover:border-slate-300"
                  value={channel.conversions}
                  onChange={(e) => handleEdit(channel, 'conversions', e.target.value)}
                />
              </td>
              <td className="px-6 py-4 text-right">
                <input 
                  type="number"
                  className="w-24 text-right border-b border-transparent focus:border-indigo-500 focus:outline-none bg-transparent hover:border-slate-300"
                  value={channel.revenue}
                  onChange={(e) => handleEdit(channel, 'revenue', e.target.value)}
                />
              </td>
              <td className="px-6 py-4 text-right font-medium">
                {channel.cpa.toFixed(2)}
              </td>
              <td className={`px-6 py-4 text-right font-bold ${channel.roas >= 3 ? 'text-green-600' : channel.roas < 1.5 ? 'text-red-500' : 'text-slate-600'}`}>
                {channel.roas.toFixed(2)}x
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
