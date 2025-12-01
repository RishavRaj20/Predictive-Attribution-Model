import React from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import { ChannelData } from '../types';

interface Props {
  data: ChannelData[];
}

export const DiminishingReturnsChart: React.FC<Props> = ({ data }) => {
  // We want to plot Spend (X) vs ROAS (Y) to visualize efficiency dropping as spend rises.
  // Bubble size = Total Revenue

  const scatterData = data.map(d => ({
    x: d.spend,
    y: d.roas,
    z: d.revenue, // Size
    name: d.name
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
      <div className="mb-4">
        <h3 className="text-md font-semibold text-slate-800">Efficiency Frontier</h3>
        <p className="text-xs text-slate-500">Spend (X) vs. ROAS (Y). Bubble size represents total revenue.</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Spend" 
            unit="$" 
            tick={{fontSize: 12, fill: '#64748b'}}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="ROAS" 
            unit="x" 
            tick={{fontSize: 12, fill: '#64748b'}} 
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }} 
            content={({ active, payload }) => {
                if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                    <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
                    <p className="font-bold text-slate-800">{data.name}</p>
                    <p className="text-sm text-slate-600">Spend: ${data.x.toLocaleString()}</p>
                    <p className="text-sm text-slate-600">ROAS: {data.y.toFixed(2)}x</p>
                    <p className="text-sm text-slate-600">Revenue: ${data.z.toLocaleString()}</p>
                    </div>
                );
                }
                return null;
            }}
          />
          <ReferenceLine y={1.0} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Break-even', fill: '#ef4444', fontSize: 10 }} />
          <Scatter name="Channels" data={scatterData} fill="#8884d8">
            {scatterData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.y > 3 ? '#10b981' : entry.y < 1.5 ? '#ef4444' : '#6366f1'} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
